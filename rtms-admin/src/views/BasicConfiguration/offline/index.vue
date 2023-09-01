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
          <el-form-item label="图号:">
            <el-input
              v-model="queryParams.imageCode"
              placeholder="请输入图号"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
              @keyup.native="keyUp"
              minlength="1"
              maxlength="20"
              show-word-limit
              filterable
              clearable
            >
            </el-input>
          </el-form-item>
          <el-form-item label="产线:">
            <el-input
              v-model="queryParams.plName"
              placeholder="请输入产线"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
              @keyup.native="keyUp"
              minlength="1"
              maxlength="20"
              show-word-limit
              filterable
              clearable
            >
            </el-input>
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
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="openDialog"
        >新增</el-button
      >
      <el-button
        type="primary"
        size="small"
        icon="el-icon-upload"
        id="btns-style"
        @click="handleimport()"
        >导入
      </el-button>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-download"
        filterable
        id="btns-style"
        @click="handleExcel"
      >
        导出
      </el-button>
      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        filterable
        id="btns-style"
        @click="handledelTimeNodeList()"
      >删除
      </el-button>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </div>
    <el-table
      v-loading="loading"
      :data="stationList"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="45"></el-table-column>
      <el-table-column
        label="图号"
        align="center"
        prop="imageCode"
        min-width="120"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="产线"
        align="center"
        prop="plName"
        min-width="100"
        class="form-content-width"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="单根工时"
        align="center"
        prop="workingHour"
        min-width="80"
        class="form-content-width"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="AGV单次下线运输量"
        align="center"
        prop="agvTransVolume"
        min-width="140"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="下料滞后时间"
        sortable
        align="center"
        prop="blankingLagTime"
        :show-overflow-tooltip="true"
        min-width="140"
      >
      </el-table-column>
      <el-table-column
        label="起点站点"
        sortable
        align="center"
        prop="startStationName"
        :show-overflow-tooltip="true"
        min-width="180"
      >
      </el-table-column>
      <el-table-column
        label="终点站点"
        sortable
        align="center"
        prop="endStationName"
        :show-overflow-tooltip="true"
        min-width="180"
      >
      </el-table-column>
      <el-table-column
        label="备注"
        align="center"
        prop="mark"
        min-width="80"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建人"
        align="center"
        prop="creator"
        min-width="80"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="更新人"
        align="center"
        prop="updater"
        min-width="80"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="更新时间"
        sortable
        align="center"
        prop="updateTime"
        :show-overflow-tooltip="true"
        min-width="180"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        min-width="60"
      >
        <template v-slot="scope">
          <el-button
            size="small"
            type="text"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <el-dialog
      :title="dialogTitle"
      id="achieve_dialog-seven"
      append-to-body
      :visible.sync="dialogFormVisible"
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
          label="单次AGV下线运输量"
          prop="agvTransVolume"
        >
          <el-input
            v-model.number="form.agvTransVolume"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="下料滞后时间:" prop="blankingLagTime">
          <el-input
            v-model.number="form.blankingLagTime"
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
          >确定</el-button
        >
      </div>
    </el-dialog>
    <uploadExcel ref="tochannel" :title="tochanneldata.title" @refresh="refresh"></uploadExcel>
  </div>
</template>
<script>
import _ from "lodash";
import {
  getPreparationList,
  addPreparation,
  updatePreparation,
  delPreparationList,
  pagePreparation,
  uploadOfflineExcel,
  getExcel,
  getPreparationStartStation,
  downloadPreExcel,
} from "@/api/BasicConfiguration/offline";
import { listData } from "@/api/system/dict/data";
import uploadExcel from '@/views/BasicConfiguration/offline/uploadExcel.vue'

export default {
  components: { uploadExcel },
  data() {
    var validatePass = (rule, value, callback) => {
      //当输入的数据有值，值是非空，输入的数据不是数字类型时 进行提示
      if (value && value < 0 && Number.isInteger(value) || (value && value !== "" && typeof value !== 'number')) {
        callback(new Error("下线滞后时间（分）必须为数字值"));
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
      dialogVisible: false, //是否展示弹框
      dialogFormVisible: false,
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
      //起点站点
      starStation: {
        iseb: 1,
      },
      startdata: null,
      // 站点数据
      position: 1,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        imageCode: null,
        plName: null,
      },
      // 导入的参数
      tochanneldata: {
        title: "",
      },
      form: {},
      rules: {
        imageCode: [{ required: true, message: "请输入图号", trigger: "blur" }],
        plName: [{ required: true, message: "请输入产线", trigger: "blur" }],
        workingHour: [
          { required: true, message: "请选择单根工时（分）", trigger: "blur" },
        ],
        agvTransVolume : [
          { required: true, message: '单次AGV下线运输量不能为空' },
          { type: 'number', message: '单次AGV下线运输量必须为数字值' },
          {
            validator: validatePassAgv,
            trigger: "blur",
          }
        ],
        blankingLagTime: [
          {
            validator: validatePass,
            trigger: "blur",
          }
        ],
        startStationId: [
          { required: true, message: "请选择起点站点", trigger: "change" },
        ],
        endStationId: [
          { required: true, message: "请选择终点站点", trigger: "change" },
        ],
      },
      // 下线图号的终点站点
      preparationend: [],
      // 库位的 库位类型
      positiontype: [],
    };
  },
  mounted() {
    this.getList();
    // 初始化库位类型list
    this.getTypeList();
  },
  // created() {
  //   this.getList();
  // },
  methods: {
    // 初始化库位类型list
    getTypeList() {
      const data = {
        dictType: "position_type",
      };
      // 调用根据数据字典类型查询居委类型列表
      listData(data)
        .then((res) => {
          if (res.data && res.data.list) {
              this.positiontype = res.data.list;
            }
        })
        .catch(() => {});
    },

    // 子组件刷新列表
    refresh() {
      this.getList();
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleChange(value) {
      this.form.workingHour = value.toFixed(1);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.imageCode = null;
      this.queryParams.plName = null;
      this.handleQuery();
    },
    /** 获取列表 */
    getList() {
      this.loading = true;
      getPreparationList(this.queryParams).then((response) => {
        const newList = response.data.list.map(item => {
          // item.workingHour = item.workingHour;
          return item;
        })
        this.stationList = newList;
        this.preparationLeadTime = response.data.preparationLeadTime;
        this.stationList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    /** 获取起点站点 */
    getStarStation() {
      getPreparationStartStation(this.starStation).then((response) => {
        this.startdata = response.data;
      });
    },
    // 新增
    openDialog() {
      this.reset();
      this.getStarStation();
      this.dialogFormVisible = true;
      this.dialogTitle = "新增";
      // 新增
      pagePreparation().then((res) => {
        this.position = res.data.list;
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
      this.dialogFormVisible = false;
      this.reset();
    },
    //批量删除
    handledelTimeNodeList() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择要删除的数据");
      } else {
        let ids = this.multipleSelection.map((item) => {
          return item.id;
        });
        this.$modal
          .confirm("确定要删除吗？")
          .then(function () {
            return delPreparationList(ids);
          })
          .then(() => {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          })
          .catch(() => {});
      }
    },
    // 编辑
    handleEdit(index, row) {
      this.getStarStation();
      row.endStationId = String(row.endStationId);
      const data = _.cloneDeep(row);
      this.dialogFormVisible = true;
      this.form = data;
      this.dialogTitle = "编辑";
    },
    // 导入
    handleimport() {
      this.tochanneldata.title = "导入下线生产计划";
      this.$refs.tochannel.upload.open = true;
    },
    // 下载模板
    downloadTemplate() {
      downloadPreExcel()
        .then((response) => {
          this.$download.excel(response, "下线图号配置模板.xls");
          this.$message.success("模版下载成功");
        })
        .catch(() => {
          this.$message.error("模版下载失败");
        });
    },
    // 导入请求触发方法
    onUploadSubmit(uploadFile) {
      uploadOfflineExcel(true, uploadFile)
        .then((res) => {
          this.$message.success("上传成功");
          this.$refs.uploadOffline.dialogVisible = false;
        })
        .catch((err) => {
          this.$message.error("上传失败");
        });
    },
    // 导出
    handleExcel() {
      if (this.multipleSelection.length == 0) {
        this.$modal.confirm('是否确认导出所有下线图号配置数据?').then(() => {
          this.exportLoading = true;
          return getExcel([]);
        }).then(response => {
          this.$download.excel(response, '下线图号配置.xls');
          this.exportLoading = false;
        }).catch(() => {
        });
      } else {
        const ids = this.multipleSelection.map(item => {
          return item.id
        })
        this.$modal.confirm('是否确认导出选中下线图号配置?').then(() => {
          this.exportLoading = true;
          return getExcel(ids);
        }).then(response => {
          this.$download.excel(response, '下线图号配置.xls');
          this.exportLoading = false;
        }).catch(() => {
        });
      }
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const params = _.cloneDeep(this.form);
          console.log(params,'params下线')
          params.workingHour = this.form.workingHour;
          // this.form.workingHour = Math.ceil(this.form.workingHour) * 60;
          console.log(this.form.id,'this.form.id下线')
          if (this.form.id !== undefined) {
            updatePreparation(params)
              .then((response) => {
                this.form.blankingLagTime = parseInt(params.blankingLagTime);
                this.form.startStationId = parseInt(this.form.startStationId);
                this.$modal.msgSuccess("修改成功");
                this.dialogFormVisible = false;
                this.getList();
              })
              .catch(() => {});
          } else {
            params.agvTransVolume = parseInt(params.agvTransVolume);
            if (params.blankingLagTime != "") {
              params.blankingLagTime = parseInt(params.blankingLagTime);
            }
            params.startStationId = parseInt(params.startStationId);
            params.endStationId = parseInt(params.endStationId);

            addPreparation(params)
              .then((response) => {
                this.$modal.msgSuccess("新增成功");
                this.dialogFormVisible = false;
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
