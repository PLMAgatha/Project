<template>
  <div>
    <el-dialog id="achieve_dialog" :title="title" :visible.sync="dialogVisible" width="30%" @open="open" class="mt-one">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="计划状态:" prop="status">
          <el-select v-model="form.status" placeholder="请选择需要更改的计划状态" filterable clearable
                     style="width: 240px">
            <el-option v-for="item in stocklist" :key="item.value" :label="item.label"
                       :value="item.value"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {outeditstatus} from "@/api/prodManger/outProdplan"
import {DICT_TYPE, getDictDatas} from "@/utils/dict";

export default {
  name: "EditControl",
  props: {
    title: {
      type: String,
      default: '',
    },
    linedatas: {
      type: Array,
    }
  },
  data() {
    return {
      idslistdata: null, //需要修改的id
      dialogVisible: false,//是否展示弹框
      form: {//表格数据
        status: null
      },
      rules: {//校验规则
        status: [{required: true, message: "请选择需要更改的计划状态", trigger: "change"}],
      },
      stocklist: getDictDatas(DICT_TYPE.TASK_STATUS),//计划状态
    }
  },
  methods: {
    open() {
      console.log(this.$props)
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
      this.form.status = null
    },
    // 确定按钮
    confirm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let parameter = this.$props.linedatas.map(item => {
            return {
              "id": item.id,
              "sort": item.sort,
              "orderNumber": item.orderNumber,
              "productCode": item.productCode,
              "prodLineName": item.prodLineName,
              "orderProductCount": item.orderProductCount,
              "beginStationId": item.beginStationId,
              "endStationId": item.endStationId,
              "emptyBoxHoming": item.emptyBoxHoming,
              "status": this.form.status,
              "sendTime": item.sendTime,
            }
          })
          outeditstatus(parameter).then(res => {
            this.$message.success('修改成功');
            this.dialogVisible = false;
            this.$emit('refresh');
          })
        }
      });
    },
    // 取消按钮
    cancel() {
      this.dialogVisible = false;
    }
  },
}
</script>

<style scoped>
</style>
