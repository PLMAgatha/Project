<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <div class="search">
        <div class="searchcopy">
          <el-form-item label="工单编号:">
            <el-input v-model="queryParams.orderNumber" placeholder="请输入工单编号" clearable size="small"
                      style="width: 240px"
                      @keyup.enter.native="handleQuery"
                      @keyup.native="keyUp"
                      minlength="1" maxlength="20" show-word-limit/>
          </el-form-item>
          <el-form-item label="产品图号:">
            <el-input v-model="queryParams.productCode" placeholder="请输入产品图号" clearable size="small"
                      style="width: 240px"
                      @keyup.enter.native="handleQuery"
                      @keyup.native="keyUp"
                      minlength="1" maxlength="20" show-word-limit/>
          </el-form-item>
          <el-form-item label="产线名称:">
            <el-input v-model="queryParams.prodLineName" placeholder="请输入产线名称" clearable size="small"
                      style="width: 240px"
                      @keyup.enter.native="handleQuery"
                      @keyup.native="keyUp"
                      minlength="1" maxlength="20" show-word-limit/>
          </el-form-item>
          <el-form-item label="计划状态:">
            <el-select v-model="queryParams.status" placeholder="请选择任务状态" filterable clearable
                       style="width: 240px">
              <el-option v-for="item in stocklist" :key="item.value" :label="item.label"
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
    <div class="add-btn">
      <el-button type="primary" icon="el-icon-edit" size="small" @click="handleeditstatus">更改任务状态
      </el-button>
      <el-button type="primary" icon="el-icon-upload" size="small" @click="handleimport">计划导入
      </el-button>
      <el-button type="primary" icon="el-icon-download" size="small" @click="handleExcel">导出
      </el-button>
      <el-button type="primary" icon="el-icon-refresh" size="small" @click="handleanew">重新计算时间
      </el-button>
      <el-button type="primary" icon="el-icon-view" size="small" @click="dataBoard">数据看板
      </el-button>
      <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete">删除
      </el-button>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </div>
    <el-table v-loading="loading" :data="inprodplanList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="工单编号" align="center" prop="orderNumber" :show-overflow-tooltip="true"/>
      <el-table-column label="产品图号" align="center" prop="productCode" :show-overflow-tooltip="true"/>
      <el-table-column label="产线名称" align="center" prop="prodLineName"
                       :show-overflow-tooltip="true"/>
      <el-table-column label="工单数量" align="center" prop="orderProductCount" sortable :show-overflow-tooltip="true"/>
      <el-table-column label="起始站点" align="center" prop="beginStationId"
                       :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="终点站点" align="center" prop="endStationId" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="空箱是否流转" align="center" :formatter="emptyBoxHomingformatter" prop="emptyBoxHoming"
                       :show-overflow-tooltip="true"
      />
      <el-table-column label="计划状态" align="center" prop="status" :show-overflow-tooltip="true"
                       :formatter="statusformatter"
      />
      <el-table-column label="配送时间" align="center" prop="sendTime" sortable :show-overflow-tooltip="true"
                       width="180">
      </el-table-column>
      <!--      <el-table-column label="创建人" align="center" prop="creator" :show-overflow-tooltip="true"/>-->
      <!--      <el-table-column label="创建时间" align="center" prop="createTime" sortable :show-overflow-tooltip="true"-->
      <!--                       width="180">-->
      <!--        <template v-slot="scope">-->
      <!--          &lt;!&ndash;          <span>{{ parseTime(scope.row.sendTime) }}</span>&ndash;&gt;-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="更新人" align="center" prop="updater" :show-overflow-tooltip="true"/>-->
      <!--      <el-table-column label="更新时间" align="center" prop="updateTime" sortable :show-overflow-tooltip="true"-->
      <!--                       width="180">-->
      <!--        <template v-slot="scope">-->
      <!--          &lt;!&ndash;          <span>{{ parseTime(scope.row.sendTime) }}</span>&ndash;&gt;-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column width="350" label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="small" icon="el-icon-copy-document" type="text" @click="handleinsert(scope.row)">
            插单
          </el-button>
          <el-button size="small" icon="el-icon-top" type="text" @click="goup(scope.row)">
            上调
          </el-button>
          <el-button size="small" icon="el-icon-bottom" type="text" @click="godown(scope.row)">
            下调
          </el-button>
          <el-button size="small" icon="el-icon-back" type="text" @click="handleinadvance(scope.row)">
            提前
          </el-button>
          <el-button size="small" icon="el-icon-right" type="text" @click="handlepostpone(scope.row)">
            推迟
          </el-button>
          <el-button size="small" icon="el-icon-tickets" type="text" @click="handlerecord(scope.row)">
            操作记录
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>
    <!--更改任务状态-->
    <editstatus ref="editstatus" :title="editstatus.title" :linedatas="editstatus.linedatas"
                @refresh="refresh"></editstatus>
    <!--导入-->
    <tochannel ref="tochannel" :title="tochanneldata.title" @refresh="refresh"></tochannel>
    <!--插单-->
    <interposition ref="interposition" :title="interposition.title" :id="interposition.id" :sort="interposition.sort"
                   :prodLineName="interposition.prodLineName" @refresh="refresh"></interposition>
    <!--提前-->
    <inadvance ref="inadvance" :title="inadvancedata.title" :linedata="inadvancedata.linedata"
               @refresh="refresh"></inadvance>
    <!--推迟-->
    <putoff ref="postpone" :title="postponedata.title" :linedata="postponedata.linedata"
            @refresh="refresh"></putoff>
    <!--推迟记录-->
    <eferredrecord ref="eferredrecord" :title="eferredrecorddata.title" :id="eferredrecorddata.id"></eferredrecord>
  </div>
</template>

<script>
import editstatus from "@/views/prodManger/outProdplan/editstatus.vue";
import tochannel from "@/views/prodManger/outProdplan/tochannel.vue";
import interposition from "@/views/prodManger/outProdplan/interposition.vue";
import inadvance from "@/views/prodManger/outProdplan/inadvance.vue";
import putoff from "@/views/prodManger/outProdplan/putoff.vue";
import eferredrecord from "@/views/prodManger/outProdplan/eferredrecord.vue";
import {getprodplanlist, delall, getExcel, updown, recalculate} from "@/api/prodManger/outProdplan";
import {DICT_TYPE, getDictDatas} from "@/utils/dict";

export default {
  name: "Role",
  components: {
    "editstatus": editstatus,
    "tochannel": tochannel,
    "interposition": interposition,
    "inadvance": inadvance,
    "putoff": putoff,
    "eferredrecord": eferredrecord
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
      // 列表
      inprodplanList: [],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        orderNumber: null,
        productCode: null,
        prodLineName: null,
        status: null,
      },
      // 更改任务状态参数
      editstatus: {
        title: "",
        linedatas: null,
      },
      // 导入的参数
      tochanneldata: {
        title: ""
      },
      // 插单
      interposition: {
        title: "",
        id: null,
        sort: null,
        prodLineName: null,
      },
      // 提前
      inadvancedata: {
        title: "",
        linedata: null,
      },
      // 推迟
      postponedata: {
        title: "",
        linedata: null,
      },
      // 推迟记录的参数
      eferredrecorddata: {
        title: "",
        id: null
      },
      arr: [],//多选的id
      // 备料下线生产计划状态
      stocklist: getDictDatas(DICT_TYPE.TASK_STATUS),
    }
      ;
  },
  mounted() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1; // 月份从0开始，所以需要加1
      let date = today.getDate();
      let monthzero = String(month).padStart(2, '0') //补零
      let datezero = String(date).padStart(2, '0') //补零
      let dateString = year + '-' + monthzero + '-' + date;
      let start = dateString + " 00:00:01"
      let end = dateString + " 23:59:59"
      let arr = []
      arr.push(start)
      arr.push(end)
      this.queryParams.createTime = arr;
      getprodplanlist(this.queryParams).then(
        response => {
          this.inprodplanList = response.data.list;
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
      this.queryParams.orderNumber = null;
      this.queryParams.productCode = null;
      this.queryParams.prodLineName = null;
      this.queryParams.status = null;
      this.handleQuery();
    },
    // 子组件刷新列表
    refresh() {
      this.getList();
    },
    // 多选事件
    handleSelectionChange(val) {
      this.arr = val
    },
    // 多选删除
    handleDelete() {
      if (this.arr.length == 0) {
        this.$message.warning("请选择要删除的计划");
      } else {
        let alldel = this.arr.every(item => {
          return item.status == 0
        })
        if (alldel) {
          let idslist = this.arr.map(item => {
            return item.id
          })
          let that = this;
          this.$modal.confirm("确定要删除吗？").then(function () {
            return delall(idslist).then(() => {
              that.getList();
              that.$modal.msgSuccess("删除成功");
            });
          })
        } else {
          this.$message.warning('请对待配送的数据进行修改')
        }
      }
    },
    // 重新计算时间
    handleanew() {
      let that = this;
      this.$modal.confirm("确定要重新计算时间吗？").then(function () {
        recalculate().then(res => {
          that.$message.success('重新计算时间成功')
        })
      })
    },
    // 导入
    handleimport() {
      this.tochanneldata.title = "导入下线生产计划";
      this.$refs.tochannel.upload.open = true;
    },
    // 多选导出
    handleExcel() {
      if (this.arr.length == 0) {
        this.$message.warning('请选择要导出的生产计划')
        return;
      } else {
        let ids = [];
        ids = this.arr.map(item => {
          return item.id
        })
        this.$modal.confirm('是否确认导出选中下线生产计划?').then(() => {
          this.exportLoading = true;
          return getExcel(ids);
        }).then(response => {
          this.$download.excel(response, '下线生产计划.xls');
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    },
    //更改任务状态
    handleeditstatus() {
      if (this.arr.length == 0) {
        this.$message.warning("请选择要修改状态的计划");
      } else {
        let allupdata = this.arr.every(item => {
          return item.status == 0
        })
        if (allupdata) {
          this.editstatus.linedatas = this.arr;
          this.editstatus.title = "更改任务状态";
          this.$refs.editstatus.dialogVisible = true;
        } else {
          this.$message.warning('请对待配送的数据进行修改')
        }
      }
    },
    // 插单
    handleinsert(row) {
      this.interposition.id = row.id;
      this.interposition.sort = row.sort;
      this.interposition.prodLineName = row.prodLineName;
      this.interposition.title = "插单";
      this.$refs.interposition.dialogVisible = true;
    },
    // 上调
    goup(row) {
      let alldata = {};
      let olddata = {};
      let newdata = {};
      if (this.queryParams.pageNo == 1 && this.inprodplanList.indexOf(row) == 0) {
        this.$message.warning('已经是第一个任务，无法上调')
        return;
      }
      if (this.queryParams.pageNo !== 1 && this.inprodplanList.indexOf(row) == 0) {
        this.$message.warning('这个任务是本页面第一条数据，请切换分页后再上调')
        return;
      }
      let upone = this.inprodplanList.indexOf(row) - 1
      if (row.prodLineName != this.inprodplanList[upone].prodLineName) {
        this.$message.warning('请对同一条产线的数据进行上调')
        return;
      }
      let that = this;
      this.$modal.confirm("确定要上调吗？").then(function () {
        olddata.id = row.id;
        olddata.sort = row.sort;
        newdata.id = that.inprodplanList[upone].id;
        newdata.sort = that.inprodplanList[upone].sort;
        alldata.taskA = olddata;
        alldata.taskB = newdata;
        updown(alldata).then(res => {
          that.getList();
          that.$message.success('上调成功')
        })
      })
    },
    // 下调
    godown(row) {
      let alldata = {};
      let olddata = {};
      let newdata = {};
      let num = this.inprodplanList.indexOf(row) + 1;
      let last = this.queryParams.pageSize * (this.queryParams.pageNo - 1) + num;
      if (last == this.total) {
        this.$message.warning('已经是最后一个任务，无法下调')
        return;
      }
      if (num == this.queryParams.pageSize) {
        this.$message.warning('这个任务是本页面最后一条数据，请切换分页后再下调')
        return;
      }
      let downone = this.inprodplanList.indexOf(row) + 1;
      if (row.prodLineName != this.inprodplanList[downone]?.prodLineName) {
        this.$message.warning('请对同一条产线的数据进行下调')
        return;
      }
      let that = this;
      this.$modal.confirm("确定要下调吗？").then(function () {
        console.log(that)
        olddata.id = row.id;
        olddata.sort = row.sort;
        newdata.id = that.inprodplanList[downone].id;
        newdata.sort = that.inprodplanList[downone].sort;
        alldata.taskA = olddata;
        alldata.taskB = newdata;
        updown(alldata).then(res => {
          that.getList();
          that.$message.success('下调成功')
        })
      })
    },
    // 提前
    handleinadvance(row) {
      if (row.status != 0) {
        this.$message.warning("只能对待配送的数据进行提前")
        return;
      }
      this.inadvancedata.title = '提前';
      this.inadvancedata.linedata = row;
      this.$refs.inadvance.dialogVisible = true;
    },
    // 推迟
    handlepostpone(row) {
      if (row.status != 0) {
        this.$message.warning("只能对待配送的数据进行推迟")
        return;
      }
      this.postponedata.title = '推迟';
      this.postponedata.linedata = row;
      this.$refs.postpone.dialogVisible = true;
    },
    // 推迟记录
    handlerecord(row) {
      this.eferredrecorddata.id = row.id;
      this.eferredrecorddata.title = "操作记录";
      this.$refs.eferredrecord.dialogVisible = true;
    },
    //处理列表数据
    emptyBoxHomingformatter(row) {
      if (row.emptyBoxHoming == true) {
        return "是"
      } else {
        return "否"
      }
    },
    statusformatter(row) {
      let data = this.stocklist.filter(item => {
        return item.value == row.status
      })
      return data[0]?.label
    },
    /** 数据看板 */
    dataBoard() {
      const {href} = this.$router.resolve('/outProdPlanBoard');
      const newWindow = window.open(href, '_blank')
      if (newWindow) {
        newWindow.addEventListener('load', () => {
          newWindow.dispatchEvent(new KeyboardEvent('keydown', {key: 'F11'}));
        });
      }
      // screenfull.toggle()

    },
  }
};
</script>

<style scoped>
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
