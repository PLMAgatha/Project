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
          <el-form-item label="时间节点名称:">
            <el-input
              v-model="queryParams.parameterName"
              placeholder="请输入时间节点名称"
              filterable
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
              @keyup.native="keyUp"
              minlength="1"
              maxlength="20"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <el-form-item label="状态:">
            <el-select
              v-model="queryParams.status"
              filterable
              placeholder="请选择状态"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="item in timenodestate"
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
      <el-button
        type="warning"
        icon="el-icon-plus"
        size="small"
        @click="openDialog"
      >
        新增
      </el-button>
      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        filterable
        id="btns-style"
        @click="handledelTimeNodeList()"
      >
        删除
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
        label="时间节点名称"
        align="center"
        prop="parameterName"
        min-width="100"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="开始时间"
        align="center"
        prop="startTime"
        class="form-content-width"
        min-width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="结束时间"
        align="center"
        prop="endTime"
        class="form-content-width"
        min-width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="说明"
        align="center"
        prop="parameterExplain"
        min-width="120"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="状态"
        :formatter="stateMatch"
        filterable
        align="center"
        prop="status"
        min-width="100"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建人"
        align="center"
        prop="creator"
        min-width="100"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="更新人"
        align="center"
        prop="updater"
        min-width="100"
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
        min-width="120"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template v-slot="scope">
          <el-button
            size="small"
            type="text"
            align="center"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="text"
            @click="disableTwo(scope.row)"
            :icon="
              scope.row.status ? 'el-icon-circle-close' : 'el-icon-circle-check'
            "
          >
            <span icon="el-icon-circle-close" v-if="scope.row.status"
              >禁用</span
            >
            <span icon="el-icon-circle-check" v-else>启用</span>
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
      id="achieve_dialog-five-update"
      append-to-body
      class="mt-one"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        class="popup-one"
        ref="form"
        :rules="rules"
        :model="form"
        label-width="80px"
        @submit.native.prevent
      >
        <el-form-item label="时间节点名称" prop="parameterName">
          <el-input
            v-model="form.parameterName"
            placeholder="请输入时间节点名称"
            minlength="1"
            maxlength="20"
            show-word-limit
            @keyup.native="keyUp"
          />
        </el-form-item>
        <el-form-item label="开始时间" class="timeStytle" prop="startTime">
          <el-time-picker
            value-format="HH:mm:ss"
            type="string"
            placeholder="选择开始时间"
            v-model="form.startTime"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="结束时间" class="timeStytle" prop="endTime">
          <el-time-picker
            value-format="HH:mm:ss"
            type="string"
            placeholder="选择结束时间"
            v-model="form.endTime"
            style="width: 100%"
          ></el-time-picker>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select
            v-model="form.status"
            filterable
            placeholder="请选择状态"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="item in timenodestate"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="parameterExplain">
          <el-col :span="10">
            <el-input
              type="textarea"
              style="width: 400px"
              :rows="3"
              v-model="form.parameterExplain"
              placeholder="请输入说明"
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
  </div>
</template>

<script>
import { DICT_TYPE, getDictDatas } from "@/utils/dict";

import { listData } from "@/api/system/dict/data";
import {
  getTimeNodeList,
  addTimeNode,
  delTimeNodeList,
  updateTimeNode,
} from "@/api/BasicConfiguration/timenode";
import _ from "lodash";

export default {
  name: "TimeNode",
  data() {
    return {
      dialogFormVisible: false,
      value1: "",
      multipleSelection: [],
      // 弹出层标题
      dialogTitle: "新增",
      // 遮罩层 查询
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 列表
      stationList: [],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        parameterName: null,
        isEnable: null,
        status: null,
      },
      rules: {
        parameterName: [
          { required: true, message: "请输入时间节点名称", trigger: "blur" },
        ],
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "change" },
        ],
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "change" },
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
      },
      form: {},
      // TimeNode的状态
      timenodestate: [],
      // TimeNode 是否启用
      timenodeisenable: [],
    };
  },
  // created() {
  //   this.getList();
  // },
  mounted() {
    this.getList();
    // 初始化库位状态list
    this.getStateList();
    // 初始化时间节点是否启用list
    this.getEnableList();
  },

  methods: {
    // 初始化时间节点状态list
    getStateList() {
      const data = {
        dictType: "timenode_status",
      };
      // 调用根据数据字典类型查询居委类型列表
      listData(data)
        .then((res) => {
          if (res.data && res.data.list) {
            this.timenodestate = res.data.list;
          }
        })
        .catch(() => {});
    },

    // 初始化时间节点是否启用list
    getEnableList() {
      const data = {
        dictType: "timenode_isEnable",
      };
      // 调用根据数据字典状态查询居委类型列表
      listData(data)
        .then((res) => {
          if (res.data && res.data.list) {
              this.timenodeisenable = res.data.list;
            }
        })
        .catch(() => {});
    },

    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
            return delTimeNodeList(ids);
          })
          .then(() => {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          })
          .catch(() => {});
      }
    },
    // 新增
    openDialog() {
      this.reset();
      this.dialogFormVisible = true;
      this.dialogTitle = "新增";
    },
    /** 查询列表 */
    getList() {
      this.loading = true;
      getTimeNodeList(this.queryParams).then((response) => {
        this.stationList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 编辑
    handleEdit(index, row) {
      row.status = String(row.status);
      const data = _.cloneDeep(row);
      this.dialogFormVisible = true;
      this.form = data;
      this.dialogTitle = "编辑";
    },
    // 点击禁用
    disableTwo(row) {
      this.$modal
        .confirm("确定要修改吗？")
        .then(() => {
          if (row.status == 0) {
            row.status = 1;
          } else {
            row.status = 0;
          }
          updateTimeNode(row)
            .then((res) => {
              this.getList();
              this.$modal.msgSuccess("修改成功");
            })
            .catch((error) => {
              this.$modal.msgError("修改失败");
            });
        })
        .catch(() => {});
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.parameterName = null;
      this.queryParams.status = null;
      this.handleQuery();
    },
    /**启用状态*/
    stateMatch(row) {
      if (row.status == 1) {
        return "启用";
      } else if (row.status == 0) {
        return "禁用";
      }
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id !== undefined) {
            updateTimeNode(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.dialogFormVisible = false;
              this.getList();
            });
          } else {
            addTimeNode(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.dialogFormVisible = false;
              this.getList();
            });
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
</style>
