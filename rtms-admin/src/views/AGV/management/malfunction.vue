<template>
  <div>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="30%" @open="open">
      <el-table :data="malfunctionlist">
        <el-table-column label="agv编号" align="center" prop="agvCode"/>
        <el-table-column label="故障时长" align="center" prop="errDuration"/>
        <el-table-column label="故障时间" align="center" prop="errTime"/>
        <el-table-column label="故障原因" align="center" prop="errReason"/>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="malfunctionParams.pageNo"
                  :limit.sync="malfunctionParams.pageSize"
                  @pagination="getlist"/>
    </el-dialog>
  </div>
</template>
<script>
import {getmalfunctionlist} from "@/api/AGV/management"

export default {
  name: "EditControl",
  props: {
    title: {
      type: String,
      default: '',
    },
    recordId: {
      type: Number,
      default: '',
    },
    // dialogVisible: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  data() {
    return {
      // 查询参数
      malfunctionParams: {
        pageNo: 1,
        pageSize: 10,
        agvId: null
      },
      dialogVisible: null,
      malfunctionlist: [], //列表数据
      total: 0,
    }
  },
  methods: {
    open() {
      this.getlist();
    },
    getlist() {
      this.malfunctionParams.agvId = this.$props.recordId;
      getmalfunctionlist(this.malfunctionParams).then(res => {
        this.malfunctionlist = res.data.list;
        this.total = res.data.total;
      })
    }
  },
}
</script>

<style scoped>

</style>
