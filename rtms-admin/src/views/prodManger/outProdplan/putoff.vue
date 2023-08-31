<template>
  <div>
    <el-dialog id="achieve_dialog-postpone" class="mt-two" :title="title" :visible.sync="dialogVisible" append-to-body
               @open="open" @close="close">
      <el-form class="popup-one" ref="form" :model="form" :rules="rules" label-width="80px" @submit.native.prevent>
        <el-form-item label="推迟时长(分):" prop="num">
          <el-input-number v-model="form.num" :min="0" :max="300" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="推迟说明:" prop="">
          <el-input type="textarea" v-model="form.desc" placeholder="请输入推迟说明"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="function-two" @click="cancel">取 消</el-button>
        <el-button class="function-two" type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {postponedata} from "@/api/prodManger/outProdplan"

export default {
  name: "EditControl",
  props: {
    title: {
      type: String,
      default: '',
    },
    linedata: {
      type: Object,
    },
  },
  data() {
    return {
      dialogVisible: null,//控制弹框是否展示
      form: {
        num: null,
        desc: null,
      },//列表数据
      rules: {
        num: [{required: true, message: '请输入推迟时长(分)', trigger: 'change'}],
        desc: [{required: true, message: '请填写推迟说明', trigger: 'blur'}]
      }
    }
  },
  methods: {
    // 清空
    reset() {
      this.form.desc = null;
      this.form.num = null;
    },
    // 打开弹窗事件
    open() {
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    close() {
      this.reset();
    },
    // 取消事件
    cancel() {
      this.dialogVisible = false;
      this.reset();
    },
    // 确定事件
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          let obj = {};
          obj.type = 0;
          obj.planType = 1;
          obj.postponeDuration = this.form.num;
          obj.remark = this.form.desc;
          obj.prodPlanId = this.$props.linedata.id;
          obj.orderNumber = this.$props.linedata.orderNumber;
          obj.productCode = this.$props.linedata.productCode;
          obj.prodLineName = this.$props.linedata.prodLineName;
          obj.sort = this.$props.linedata.sort;
          obj.sendTime = this.$props.linedata.sendTime;
          postponedata(obj).then(res => {
            this.$message.success("推迟成功");
            this.dialogVisible = false;
            this.$emit('refresh');
            this.reset();
          })
        }
      });
    },
  },
}
</script>

<style scoped>

</style>
