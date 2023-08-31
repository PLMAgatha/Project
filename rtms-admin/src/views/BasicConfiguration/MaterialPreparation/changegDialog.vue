<template>
  <div class="app-container">
    <el-dialog
      :title="dialogTitle"
      id="achieve_dialog-seven"
      append-to-body
      :visible.sync="show"
    >
      <el-form
        class="popup-one"
        ref="form"
        :rules="rules"
        :model="form"
        @submit.native.prevent
      >
        <el-form-item label="图号:" prop="imageCode">
          <el-input v-model="form.imageCode" @keyup.native="keyUp"></el-input>
        </el-form-item>
        <el-form-item label="产线:" prop="plName">
          <el-input v-model="form.plName" @keyup.native="keyUp"></el-input>
        </el-form-item>
        <el-form-item label="单根工时（分）:" prop="workingHour">
          <el-input-number
            :precision="1"
            v-model="form.workingHour"
            @keyup.native="keyUp"
            controls-position="right"
            @change="handleChange"
            :min="0.1"
            :max="60"
            style="width: 375px"
          ></el-input-number>
        </el-form-item>
        <el-form-item
          label="单次AGV备料运输量"
          prop="agvTransVolume"

        >
          <el-input
            v-model.number="form.agvTransVolume"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="备料提前时间（分）:" prop="preparationLeadTime">
          <el-input
            v-model.number="form.preparationLeadTime"
            @keyup.native="keyUp"
          ></el-input>
        </el-form-item>
        <el-form-item label="起点站点:" prop="startStationId">
          <el-select
            v-model="form.startStationId"
            filterable
            placeholder="请选择起点站点"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="item in startdata"
              :key="item.value"
              :label="item.agvCode"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="终点站点:" prop="endStationId">
          <el-select
            v-model="form.endStationId"
            filterable
            placeholder="请选择终点站点"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="item in positiontype"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="mark">
          <el-col :span="10" class="dialog-list-width">
            <el-input
              type="textarea"
              :rows="3"
              v-model="form.mark"
              placeholder="请输入备注"
            />
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="function-two" @click="cancel">取 消</el-button>
        <el-button class="function-two" type="primary" @click="submitForm"
          >确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
import {
  // getPreparationList,
  addPreparation,
  updatePreparation,
  delPreparationList,
  pagePreparation,
  getPreparationStartStation,
  uploadPreExcel,
  getExcel,
  downloadPreExcel,
} from "@/api/BasicConfiguration/preparation";
import { listData } from "@/api/system/dict/data";

export default {
  name: "ChangeDialog",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value && value < 0 && Number.isInteger(value) || (value && value !== "" && typeof value !== 'number')) {
        callback(new Error("备料提前时间（分）必须为数字值"));
      } else {
        callback();
      }
    };
    var validatePassAgv = (rule, value, callback) => {
      if (value && value < 0 && Number.isInteger(value) || (value !== "" && typeof value !== 'number')) {
        callback(new Error("单次AGV下线运输量必须为正整数"));
      } else {
        callback();
      }
    };
    return {
      show:false,
      dialogVisible: false, //是否展示弹框
      multipleSelection: [],
      value: "",
      // 弹出层标题
      dialogTitle: "新增",
      // 遮罩层 查询
      loading: true,
      // 总条数
      total: 0,
      // 显示搜索条件
      showSearch: true,
      // 列表
      stationList: [],
      // 站点数据
      position: 1,
      //起点站点
      starStation: {
        iseb: 1,
      },
      startdata: null,
      form: {},
      rules: {
        imageCode: [{ required: true, message: "请输入图号", trigger: "blur" }],
        plName: [{ required: true, message: "请输入产线", trigger: "blur" }],
        workingHour: [
          {
            required: true,
            message: "请选择单根工时（分）",
            trigger: "blur",
          },
        ],
        agvTransVolume: [
          { required: true, message: '单次AGV备料运输量不能为空' },
          { type: 'number', message: '单次AGV备料运输量必须为数字值' },
          {
            validator: validatePassAgv,
            trigger: "blur",
          }
        ],
        preparationLeadTime: [
          {
            validator: validatePass,
            trigger: "blur",
          },
        ],
        startStationId: [
          { required: true, message: "请选择起点站点", trigger: "change" },
        ],
        endStationId: [
          { required: true, message: "请选择终点站点", trigger: "change" },
        ],
      },
      // 任务的状态
      positiontype: [],
    };
  },
  mounted() {
    //初始化库位类型list
    this.getTypeList();
    this.getStarStation();

  },
  methods: {
    // 初始化库位类型list
    getTypeList() {
      const data = {
        dictType: "position_type",
      };
      // 调用根据数据字典类型查询居委类型列表
      return listData(data)
        .then((res) => {
          if (res.data && res.data.list) {
            this.positiontype = res.data.list;
          }
        })
        .catch(() => {});
    },
    handleChange(value) {
      // 小数点后一位
      this.form.workingHour = value.toFixed(1);
    },
    /** 获取起点站点 */
    getStarStation() {
      getPreparationStartStation(this.starStation).then((response) => {
        console.log(response.data,'response.data')
        this.startdata = response.data;
        console.log(this.startdata,'this.startdata')
      });
    },
    // 表单重置
    reset() {
      this.form = {
        name: undefined,
      };
      this.resetForm("form");
    },
    // 取消按钮
    cancel() {
      this.show = false;
      this.reset();
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const params = _.cloneDeep(this.form);
          // params.workingHour = Math.ceil(this.form.workingHour) * 60;
          params.workingHour = this.form.workingHour;
          //编辑
          if (params.id !== undefined) {
            updatePreparation(params)
              .then((response) => {
                this.form.preparationLeadTime = parseInt(params.preparationLeadTime);
                this.form.startStationId = parseInt(params.startStationId);
                this.$modal.msgSuccess("修改成功");
                this.show = false;
                this.getList();
              })
              .catch(() => {});
          } else {
            //新增
            params.agvTransVolume = parseInt(params.agvTransVolume);
            // params.preparationLeadTime = params.preparationLeadTime != '' && parseInt(params.preparationLeadTime);
            if (params.preparationLeadTime != "") {
              params.preparationLeadTime = parseInt(params.preparationLeadTime);
            }
            params.startStationId = parseInt(params.startStationId);
            params.endStationId = parseInt(params.endStationId);
            addPreparation(params)
              .then((response) => {
                this.$modal.msgSuccess("新增成功");
                this.show = false;
                this.getList();
              })
              .catch(() => {});
          }
        }
      });
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

.dialog-list-width {
  width: 155px;
}

.el-form-item--medium .el-form-item__label {
  width: 155px;
}
</style>
