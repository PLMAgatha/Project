<template>
  <div>
    <el-dialog id="achieve_dialog-sixcopy" :title="title" :visible.sync="dialogVisible" append-to-body @open="open"
               @close="close">
      <el-form class="popup-one" ref="form" :model="form" :rules="rules" label-width="80px" @submit.native.prevent>
        <el-form-item label="工单编号" prop="orderNumber">
          <el-input v-model="form.orderNumber" placeholder="请输入工单编号" @keyup.enter.native="submitForm"
                    @keyup.native="keyUp"
                    minlength="1" maxlength="20" show-word-limit/>
        </el-form-item>
        <el-form-item label="产品图号" prop="productCode">
          <el-select v-model="form.productCode" @change="changeselect" filterable placeholder="请选择产品图号" clearable
                     style="width: 240px">
            <el-option v-for="item in selectdata" :key="item.id" :label="item.imageCode" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="起点库位" prop="">
          <el-input v-model="startStationName" disabled placeholder="选择产品图号后自动呈现"
                    @keyup.enter.native="submitForm"
                    @keyup.native="keyUp"
                    minlength="1" maxlength="20" show-word-limit/>
        </el-form-item>
        <el-form-item label="终点库位" prop="">
          <el-input v-model="endStationName" disabled placeholder="选择产品图号后自动呈现"
                    @keyup.enter.native="submitForm"
                    @keyup.native="keyUp"
                    minlength="1" maxlength="20" show-word-limit/>
        </el-form-item>
        <el-form-item label="产线名称" prop="">
          <el-input v-model="prodLineName" disabled placeholder="选择产品图号后自动呈现"
                    @keyup.enter.native="submitForm"
                    @keyup.native="keyUp"
                    minlength="1" maxlength="20" show-word-limit/>
        </el-form-item>
        <el-form-item label="工单数量" prop="orderProductCount"
                      :rules="[{ required: true, message: '工单数量不能为空'},{ type: 'number', message: '工单数量必须为数字值'}]">
          <el-input v-model.number="form.orderProductCount" placeholder="请输入工单数量"
                    @keyup.enter.native="submitForm"
                    @keyup.native="keyUp"
                    minlength="1" maxlength="20" show-word-limit/>
        </el-form-item>
        <el-form-item label="空箱回转" prop="emptyBoxHoming">
          <el-select v-model="form.emptyBoxHoming" filterable placeholder="请选择是否空箱回转" clearable
                     style="width: 240px">
            <el-option v-for="item in rotationlist" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
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

import {insertone, getproductnumber, getoneproductnumber} from "@/api/prodManger/inProdPlan"
import {DICT_TYPE, getDictDatas} from "@/utils/dict";

export default {
  name: "EditControl",
  props: {
    title: {
      type: String,
      default: '',
    },
    id: {
      type: Number,
    },
    sort: {
      type: Number,
      default: '',
    },
    prodLineName: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      rotationlist: getDictDatas(DICT_TYPE.STOCK_EMPTY),
      onedata: null,
      startStationName: null,
      endStationName: null,
      queryParams: { //查询产品图号参数
        pageNo: 1,
        pageSize: 100,
      },
      selectdata: null,//产品图号数据
      dialogVisible: null,//控制弹框是否展示
      form: {},//列表数据
      rules: {//校验
        orderNumber: [{required: true, message: "请输入工单编号", trigger: "blur"},],
        productCode: [{required: true, message: "请选择产品图号", trigger: "change"}],
        // orderProductCount: [{required: true, message: "请输入工单数量", trigger: "blur"},],
        emptyBoxHoming: [{required: true, message: "请选择是否空箱回转", trigger: "change"}],
      },
    }
  },
  methods: {
    // 重置
    reset() {
      this.form.orderNumber = '';
      this.form.productCode = '';
      this.form.orderProductCount = '';
      this.form.emptyBoxHoming = '';
      this.form.prodLineName = "";
      this.startStationName = '';
      this.endStationName = '';
    },
    // 打开弹窗事件
    open() {
      this.form.prodLineName = this.$props.prodLineName;
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
      this.getselectdata();
    },
    close() {
      this.reset();
    },
    getselectdata() {
      getproductnumber(this.queryParams).then(res => {
        res.data.list.map(item => {
          return item.imageCode = "图号:" + " " + item.imageCode + " " + "产线: " + " " + item.plName
        })
        this.selectdata = res.data.list
      })
    },
    // 下拉框选择事件
    changeselect(e) {
      getoneproductnumber(e).then(res => {
        this.onedata = res.data;
        this.startStationName = res.data.startStationName
        this.endStationName = res.data.endStationName

      })
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
          if (this.onedata.plName != this.$props.prodLineName) {
            this.$message.warning('不同产线不能插单');
            return;
          }
          this.form.beginStationId = this.onedata?.startStationId;
          this.form.endStationId = this.onedata?.endStationId;
          // this.form.prodLineName = this.$props.prodLineName;
          let obj = {};
          obj.createReqVO = this.form;
          obj.id = this.$props.id;
          obj.sort = this.$props.sort;
          obj.createReqVO.productCode = this.onedata.imageCode
          if (this.form.orderProductCount > this.onedata?.agvTransVolume) {
            this.$message.warning('工单数量不能超过AGV单次备料运输量');
            return;
          } else {
            insertone(obj).then(res => {
              this.$message.success('插单成功');
              this.dialogVisible = false;
              this.$emit('refresh')
              this.reset();
            })
          }
        }
      });
    },
  },
}
</script>

<style scoped>

</style>
