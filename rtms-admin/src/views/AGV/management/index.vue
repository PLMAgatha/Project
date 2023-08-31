<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <div class="search">
        <div class="searchcopy">
          <el-form-item label="AGV编号:">
            <el-input v-model="queryParams.agvCode" placeholder="请输入AGV编号" clearable size="small"
                      style="width: 240px"
                      @keyup.enter.native="handleQuery"
                      @keyup.native="keyUp"
                      minlength="1" maxlength="20" show-word-limit/>
          </el-form-item>
          <el-form-item label="是否启用:">
            <el-select v-model="queryParams.isEnable" placeholder="请选择设备是否启用" filterable clearable
                       style="width: 240px">
              <el-option v-for="item in agvsuse" :key="item.value" :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="AGV状态:">
            <el-select v-model="queryParams.status" placeholder="请选择AGV状态" filterable clearable
                       style="width: 240px">
              <el-option v-for="item in agvstate" :key="item.value" :label="item.label"
                         :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </div>
        <div class="search-btn">
          <!--          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>-->
          <!--          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>-->
        </div>
      </div>
    </el-form>
    <el-table v-loading="loading" :data="stationList">
      <el-table-column label="AGV编号" align="center" prop="agvCode" :show-overflow-tooltip="true"/>
      <el-table-column label="机器人名称" align="center" prop="agvName" :show-overflow-tooltip="true"/>
      <el-table-column label="机器人类别" align="center" prop="agvType" :formatter="formatter"
                       :show-overflow-tooltip="true"/>
      <el-table-column label="AGV电量" align="center" prop="battery" sortable :show-overflow-tooltip="true">
        <template v-slot="scope">
          <span v-if="scope.row.battery >= 60" class="success">{{ scope.row.battery }}%</span>
          <span v-else-if="scope.row.battery >= 20" class="middle">{{ scope.row.battery }}%</span>
          <span v-else-if="scope.row.battery >= 0" class="fail">{{ scope.row.battery }}%</span>
        </template>
      </el-table-column>
      <el-table-column label="是否启用" align="center" prop="isEnable"
                       :show-overflow-tooltip="true">
        <template v-slot="scope">
          <span v-if="scope.row.isEnable == true">启用</span>
          <span v-else>停用</span>
        </template>
      </el-table-column>
      <el-table-column label="AGV状态" align="center" prop="status" :show-overflow-tooltip="true">
        <template v-slot="scope">
          <div v-if="scope.row.status == 0" class="father">
            <span class="bad"></span>
            <span>故障</span>
          </div>
          <div v-else-if="scope.row.status == 1">
            <span class="operation"></span>
            空闲
          </div>
          <div v-else-if="scope.row.status == 2">
            <span class="leisure"></span>
            运行
          </div>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="createTime" sortable :show-overflow-tooltip="true"
                       width="180">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column width="210" label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="small" icon="el-icon-download" type="text" @click="failure(scope.row)">
            故障记录
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>
    <malfunction ref="editcomponents" :recordId="sondata.recordId" :dialogVisible="sondata.dialogVisible"
                 :title="sondata.title"></malfunction>
  </div>
</template>

<script>
import malfunction from "@/views/AGV/management/malfunction.vue"
import {getAGVlist} from "@/api/AGV/management"
import {DICT_TYPE, getDictDatas} from "@/utils/dict";

export default {
  name: "Role",
  components: {
    "malfunction": malfunction
  },
  mounted() {
    this.getList();
    console.log(this.ceshilist)
  },
  data() {
    return {
      agvId: null,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 记录ID
      recordId: 0,
      // 列表
      stationList: [],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        agvCode: null,
        isEnable: null,
        status: null
      },
      // 查询参数
      malfunctionParams: {
        pageNo: 1,
        pageSize: 10,
      },
      sondata: {
        title: null,
        dialogVisible: null,
        recordId: null,
      },
      // agv的状态
      agvstate: getDictDatas(DICT_TYPE.AGV_STATE),
      // agv是否启用
      agvsuse: getDictDatas(DICT_TYPE.AGV_USE),
      // agv类型
      agvtype: getDictDatas(DICT_TYPE.AGV_TYPE),
      ceshilist: getDictDatas(DICT_TYPE.CESHI)
    };
  },
  methods: {
    // 故障记录
    failure(row) {
      this.$refs.editcomponents.dialogVisible = true;
      this.sondata.title = "AGV故障记录";
      this.sondata.recordId = row.id;
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      getAGVlist(this.queryParams).then(
        response => {
          this.stationList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.agvCode = null;
      this.queryParams.isEnable = null;
      this.queryParams.status = null;
      this.handleQuery();
    },
//  处理列表数据
    formatter(row) {
      let type = this.agvtype.filter(item => {
        return item.value == row.agvType
      })
      return type[0]?.label
    }
  }
};
</script>

<style scoped>
.bad {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin: 0 8px 2px 0;
  background-color: red;
}

.leisure {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin: 0 8px 2px 0;
  background-color: #FAAD14;
}

.operation {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin: 0 8px 2px 0;
  background-color: #38B865;
}

.searchcopy {
  background-color: #fff;
  padding: 0 20px;
  padding-top: 17px;
  border-radius: 4px;
  display: inline-block;
}

.issue-pagination {
  margin-top: 26px;
}

/deep/ .el-dialog {
  width: 790px !important;
}

.success {
  display: inline-block;
  width: 45px;
  height: 30px;
  line-height: 30px;
  background-color: #eafff1;
  color: #38b865;
  border: 1px solid #4dc075;
  border-radius: 4px;
}

.fail {
  display: inline-block;
  width: 45px;
  height: 30px;
  line-height: 30px;
  background-color: #fff1ea;
  color: #eb5e12;
  border: 1px solid #ef7f43;
  border-radius: 4px;
}

.middle {
  display: inline-block;
  width: 45px;
  height: 30px;
  line-height: 30px;
  background-color: #fff8ea;
  color: #faad14;
  border: 1px solid #faad14;
  border-radius: 4px;
}

.search > * {
  padding: 0;
  margin-right: 30px !important;
}
</style>
