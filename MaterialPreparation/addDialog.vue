<template>
  <div>
    <!-- 新增弹出框 -->
    <el-dialog
      :title="dialogTitle"
      id="achieve_dialog-seven"
      append-to-body
      :visible.sync="dialogFormVisible"
      @open="open"
    >
      <el-form
        class="popup-one"
        ref="form"
        :rules="rules"
        :model="form"
        @submit.native.prevent
      >
        <el-form-item label="图号:" prop="imageCode">
          <el-input v-model="form.imageCode" @keyup.native="keyUp" placeholder="请输入图号"></el-input>
        </el-form-item>
        <el-form-item label="产线:" prop="plName">
          <el-input v-model="form.plName" @keyup.native="keyUp" placeholder="请输入产线"></el-input>
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
          label="单次AGV备料运输量:"
          prop="agvTransVolume"
        >
          <el-input
            placeholder="请输入单次AGV备料运输量"
            v-model.number="form.agvTransVolume"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="备料提前时间（分）:" prop="preparationLeadTime">
          <el-input
            placeholder="请输入备料提前时间（分）"
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
              :label="item.agvCode+'('+item.siteName+')'"
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
        <el-form-item label="备注:" prop="mark">
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
  getPreparationList,
  addPreparation,
  getPreparationStartStation,
} from "@/api/BasicConfiguration/preparation";
import {listData} from "@/api/system/dict/data";
import uploadExcel from "@/views/BasicConfiguration/MaterialPreparation/uploadExcel.vue";

export default {
  components: {"uploadExcel": uploadExcel},
  data() {
    var validatePass = (rule, value, callback) => {
      if (value && value < 0 && Number.isInteger(value) || (value && value !== "" && typeof value !== 'number')) {
        callback(new Error("备料提前时间（分）必须为数值类型且不能为负数"));
      } else {
        callback();
      }
    };
    var validatePassAgv = (rule, value, callback) => {
      if (!value || value <= 0 || !Number.isInteger(value)) {
        callback(new Error("单次AGV下线运输量必须为正整数"));
      } else {
        callback();
      }
    };
    return {
      dialogFormVisible: false,
      value: "",
      // 弹出层标题
      dialogTitle: "新增",
      // 站点数据
      position: 1,
      //起点站点
      starStation: {
        iseb: 1,
      },
      startdata: null,
      form: {},
      rules: {
        imageCode: [{required: true, message: "请输入图号", trigger: "blur"}],
        plName: [{required: true, message: "请输入产线", trigger: "blur"}],
        workingHour: [
          {
            required: true,
            message: "请选择单根工时（分）",
            trigger: "blur",
          },
        ],
        agvTransVolume: [
          {required: true, message: '单次AGV备料运输量不能为空'},
          {type: 'number', message: '单次AGV备料运输量必须为数字值'},
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
          {required: true, message: "请选择起点站点", trigger: "change"},
        ],
        endStationId: [
          {required: true, message: "请选择终点站点", trigger: "change"},
        ],
      },
      // 任务的状态
      positiontype: [],
    };
  },
  mounted() {
    //初始化库位类型list
    this.getTypeList();
  },
  methods: {
    open() {
      this.getStarStation()
    },
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
        .catch(() => {
        });
    },
    //单根工时（分）只保留小数点后一位
    handleChange(value) {
      // 小数点后一位
      this.form.workingHour = value.toFixed(1);
    },
    /** 获取起点站点 */
    getStarStation() {
      getPreparationStartStation(this.starStation).then((response) => {
        this.startdata = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.dialogFormVisible = false;
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const params = _.cloneDeep(this.form);
          params.workingHour = this.form.workingHour;
          //新增
          params.agvTransVolume = parseInt(params.agvTransVolume);
          if (params.preparationLeadTime != "") {
            params.preparationLeadTime = parseInt(params.preparationLeadTime);
          }
          params.startStationId = parseInt(params.startStationId);
          params.endStationId = parseInt(params.endStationId);
          addPreparation(params)
            .then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.dialogFormVisible = false;
              this.$emit('refresh');
            })
            .catch((error) => {
              // 处理错误情况
              console.error("新增失败", error);
            });
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
