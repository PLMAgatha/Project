<template>
  <div>
    <el-dialog id="operation" :title="title" :visible.sync="dialogVisible" width="30%" @open="open">
      <el-table :data="malfunctionlist">
        <el-table-column label="产品图号" align="center" prop="productCode"/>
        <el-table-column label="类型" :formatter="typeformatter" align="center" prop="type"/>
        <el-table-column label="推迟时长(分)" align="center" prop="postponeDuration"/>
        <el-table-column label="推迟时间" align="center" prop="createTime" sortable :show-overflow-tooltip="true"
                         width="180">
          <template v-slot="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="推迟说明" align="center" prop="remark"/>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo"
                  :limit.sync="queryParams.pageSize"
                  @pagination="getlist"/>
    </el-dialog>
  </div>
</template>
<script>
import {getpostponelist} from "@/api/prodManger/outProdplan"

export default {
  name: "EditControl",
  props: {
    title: {
      type: String,
      default: '',
    },
    id: {
      type: Number,
      default: '',
    },
  },
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        prodPlanId: null,
        planType: 1,
      },
      dialogVisible: null,//控制弹框是否展示
      malfunctionlist: [], //列表数据
      total: 0,
    }
  },
  methods: {
    open() {
      this.getlist();
    },
    getlist() {
      this.queryParams.prodPlanId = this.$props.id;
      getpostponelist(this.queryParams).then(res => {
        this.malfunctionlist = res.data.list;
        this.total = res.data.total;
      })
    },
    typeformatter(row) {
      if (row.type == 0) {
        return "推迟"
      } else {
        return "提前"
      }
    }
  },
}
</script>

<style scoped>
#operation .pagination-container {
  position: static !important;
}

#operation .pagination-container /deep/ .el-pagination {
  padding-right: 0;
  margin-right: 20px;
}
</style>
