<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      v-show="showSearch"
      :inline="true"
    >
      <div class="search">
        <div class="searchcopy">
          <el-form-item label="工单编号:">
            <el-input
              v-model="queryParams.orderNumber"
              placeholder="请输入工单编号"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
              @keyup.native="keyUp"
              minlength="1"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="产品图号:">
            <el-input
              v-model="queryParams.productCode"
              placeholder="请输入产品图号"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
              @keyup.native="keyUp"
              minlength="1"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="产线名称:">
            <el-input
              v-model="queryParams.prodLineName"
              placeholder="请输入产线名称"
              clearable
              size="small"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
              @keyup.native="keyUp"
              minlength="1"
              maxlength="20"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="任务状态:">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择任务状态"
              filterable
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="item in semiProstate"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="search-btn-style">
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery"
            >重置</el-button
          >
        </div>
      </div>
    </el-form>
    <div class="add-btn">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </div>
    <el-table
      v-loading="loading"
      :data="semiProductList"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        label="工单编号"
        align="center"
        prop="orderNumber"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="产品图号"
        align="center"
        prop="productCode"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="产线名称"
        align="center"
        prop="prodLineName"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="工单数量"
        min-width="140"
        align="center"
        prop="orderProductCount"
        sortable
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="起始站点"
        align="center"
        prop="beginStationId"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="终点站点"
        align="center"
        prop="endStationId"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
      <el-table-column
        label="空箱是否流转"
        min-width="140"
        align="center"
        prop="emptyBoxHoming"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="计划状态"
        align="center"
        prop="status"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="配送时间"
        align="center"
        prop="sendTime"
        sortable
        :show-overflow-tooltip="true"
        width="180"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.sendTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getPreparationList } from "@/api/history/semiProduct";
import { listData } from "@/api/system/dict/data";
export default {
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
      semiProductList: [],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        orderNumber: null,
        productCode: null,
        prodLineName: null,
        status: null,
      },
      //获得当天下线生产状态
      starStatus: {
        status: 2,
      },
      // 任务的状态
      semiProstate: [],
    };
  },

  mounted() {
    this.getList();
    //初始化任务状态list
    this.getStateList();
  },

  methods: {
    // 初始化任務状态list
    getStateList() {
      const data = {
        dictType: "task_status",
      };
      // 调用根据数据字典类型查询类型列表
      listData(data)
        .then((res) => {
          if (res.data && res.data.list) {
            this.semiProstate = res.data.list;
          }
        })
        .catch(() => {});
    },

    /** 查询列表 */
    getList() {
      this.loading = true;
      getPreparationList(this.starStatus).then((response) => {
        this.semiProductList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
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
  },
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

.search > * {
  padding: 0;
  margin-right: 30px !important;
}
</style>
