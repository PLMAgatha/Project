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
          <el-form-item label="库位编号:">
            <el-input
              v-model="queryParams.agvCode"
              placeholder="请输入库位编号"
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
          <el-form-item label="库位类型:">
            <el-select
              v-model="queryParams.positionType"
              placeholder="请输入库位类型"
              filterable
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
          <el-form-item label="库位状态:">
            <el-select
              v-model="queryParams.positionStatus"
              placeholder="请选择库位状态"
              filterable
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="item in positionstate"
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
          >搜索
          </el-button
          >
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery"
          >重置
          </el-button
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
      >新增
      </el-button
      >
      <el-button
        type="danger"
        icon="el-icon-delete"
        size="small"
        @click="handleLibraryPosition()"
        id="btns-style"
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
        label="AGV库位编号"
        align="center"
        prop="agvCode"
        min-width="120"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="站点名称"
        align="center"
        prop="siteName"
        min-width="120"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="库位类型"
        align="center"
        prop="positionTypeName"
        min-width="180"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="库位状态"
        align="center"
        prop="positionStatusName"
        min-width="180"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column
        label="是否启用"
        :formatter="stateMatch"
        filterable
        align="center"
        prop="isEnable"
        :show-overflow-tooltip="true"
        min-width="100"
      />
      <el-table-column
        label="楼层"
        align="center"
        prop="floorName"
        min-width="100"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
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
        min-width="140"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template v-slot="scope">
          <el-button
            size="small"
            type="text"
            align="center"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            size="small"
            type="text"
            @click="onDisable(scope.row)"
            :icon="
              scope.row.isEnable
                ? 'el-icon-circle-close'
                : 'el-icon-circle-check'
            "
          >
            <span
              icon="el-icon-circle-close"
              v-if="scope.row.isEnable"
              :disabled="btnDisabled"
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
    <addDialog ref="addTochannel" :title="addTochannelData.title" @refresh="refresh"/>
    <editDialog ref="editTochannel" :title="editTochannelData.title" :formData="editTochannelData.formData" @refresh="refresh"/>
  </div>
</template>

<script>
import {
  getLibraryPositionList,
  delLibraryPosition,
  updateLibraryPosition,
} from "@/api/bs/libraryPosition";
import {listData} from "@/api/system/dict/data";
import addDialog from "@/views/bs/libraryPosition/addDialog.vue"
import editDialog from "@/views/bs/libraryPosition/editDialog.vue"

export default {
  name: "LibraryPosition",
  components: {
    "addDialog": addDialog,
    "editDialog": editDialog,
  },
  data() {
    return {
      //删除按钮默认禁用
      btnDisabled: true,
      dialogFormVisible: false,
      form: {},
      agvId: null,
      // 弹出层标题
      dialogTitle: "新增",
      // 是否显示弹出层
      open: false,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 列表
      stationList: [],
      // 查询参数
      multipleSelection: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        agvCode: null,
        positionType: null,
        positionStatus: null,
      },
      // 新增的参数
      addTochannelData: {
        title: ""
      },
      // 编辑的参数
      editTochannelData: {
        title: "",
        formData: null,
      },
      rules: {
        agvCode: [
          {required: true, message: "请输入库位编号", trigger: "blur"},
        ],
        siteName: [
          {required: true, message: "请输入站点名称", trigger: "blur"},
        ],
        positionType: [
          {required: true, message: "请选择库位类型", trigger: "change"},
        ],
        positionStatus: [
          {required: true, message: "请选择库位状态", trigger: "change"},
        ],
        isEnable: [
          {required: true, message: "请选择是否启用", trigger: "change"},
        ],
        floor: [{required: true, message: "请选择楼层", trigger: "change"}],
      },

      // 库位的类型
      // positiontype: getDictDatas(DICT_TYPE.POSITION_TYPE),
      positiontype: [],
      // 库位的状态
      positionstate: [],
      // 库位 是否启用
      positionisenable: [],
      // 库位 所属楼层
      positionfloor: [],
    };
  },

  mounted() {
    this.getList();
    // 初始化库位类型list
    this.getTypeList();
    // 初始化库位状态list
    this.getStateList();
    // 初始化库位是否启用list
    this.getEnableList();
    // 初始化库位所属楼层list
    this.getFloorList();
  },

  methods: {
    // 初始化库位类型list
    getTypeList() {
      const data = {
        dictType: 'position_type'
      }
      // 调用根据数据字典类型查询居委类型列表
      listData(data).then(res => {
        if (res.data) {
          if (res.data.list) {
            this.positiontype = res.data.list
          }
        }
      }).catch(() => {
      })
    },

    // 初始化库位状态list
    getStateList() {
      const data = {
        dictType: 'position_status'
      }
      // 调用根据数据字典状态查询居委类型列表
      listData(data).then(res => {
        if (res.data) {
          if (res.data.list) {
            this.positionstate = res.data.list
          }
        }
      }).catch(() => {
      })
    },

    // 初始化库位是否启用list
    getEnableList() {
      const data = {
        dictType: 'position_isEnable'
      }
      // 调用根据数据字典状态查询居委类型列表
      listData(data).then(res => {
        if (res.data) {
          if (res.data.list) {
            this.positionisenable = res.data.list
          }
        }
      }).catch(() => {
      })
    },

    // 初始化库位所属楼层list
    getFloorList() {
      const data = {
        dictType: 'position_floor'
      }
      // 调用根据数据字典状态查询居委类型列表
      listData(data).then(res => {
        if (res.data) {
          if (res.data.list) {
            this.positionfloor = res.data.list
          }
        }
      }).catch(() => {
      })
    },

    // 子组件刷新列表
    refresh() {
      this.getList();
    },

    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    /** 获取列表 */
    getList() {
      this.loading = true; //开始启动加载状态
      getLibraryPositionList(this.queryParams).then((response) => {
        this.stationList = response.data.list; //获取table里的数据
        this.total = response.data.total; //获取pagination的总条数
        this.loading = false; //完成加载状态
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams.agvCode = null;
      this.queryParams.positionType = null;
      this.queryParams.positionStatus = null;
      this.handleQuery();
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

    /**启用状态*/
    stateMatch(row) {
      if (row.isEnable == 1) {
        return "启用";
      } else if (row.isEnable == 0) {
        return "禁用";
      }
    },

    // 点击禁用
    onDisable(row) {
      this.$modal.confirm("确定要修改吗？").then(() => {
        //对操作里的禁用启用取反后
        if (row.isEnable == true) {
          row.isEnable = false
        } else {
          row.isEnable = true
        }
        updateLibraryPosition(row).then(res => {
          this.getList();
          this.$modal.msgSuccess('修改成功')
        }).catch(() => {
        })
      })
        .catch(() => {
        });
    },

    // 编辑
    handleEdit(row) {
      this.editTochannelData.title = "编辑";
      this.editTochannelData.formData = JSON.parse(JSON.stringify(row));
      this.editTochannelData.formData.positionType = String(this.editTochannelData.formData.positionType)
      this.editTochannelData.formData.positionStatus = String(this.editTochannelData.formData.positionStatus)
      this.editTochannelData.formData.floor = String(this.editTochannelData.formData.floor)
      this.editTochannelData.formData.isEnable = String(this.editTochannelData.formData.isEnable)

      this.$refs.editTochannel.dialogFormVisible = true;
    },

    // 新增
    openDialog() {
      this.reset();
      this.addTochannelData.title = "新增";
      this.$refs.addTochannel.dialogFormVisible = true;
    },

    //批量删除
    handleLibraryPosition() {
      //需要拿到要删除的数据
      // 当没有输入选项的时候，点击删除需要进行提示  请选择要删除的数据
      if (this.multipleSelection.length === 0) {
        this.$message.warning("请选择要删除的数据")
      } else {
        let ids = this.multipleSelection.map((item) => {
          return item.id;
        });
        this.$modal
          .confirm("确定要删除吗？")
          .then(function () {
            return delLibraryPosition(ids);
          })
          .then(() => {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          })
          .catch(() => {
          });
      }
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

.issue-pagination {
  margin-top: 26px;
}

:deep .el-dialog {
  width: 790px !important;
}

.success {
  display: inline-block;
  width: 45px;
  height: 30px;
  line-height: 30px;
  background-color: #eafff1;
  color: #38b865;
  border: 1px solid #4dc075;
  border-radius: 4px;
}

.fail {
  display: inline-block;
  width: 45px;
  height: 30px;
  line-height: 30px;
  background-color: #fff1ea;
  color: #eb5e12;
  border: 1px solid #ef7f43;
  border-radius: 4px;
}

.middle {
  display: inline-block;
  width: 45px;
  height: 30px;
  line-height: 30px;
  background-color: #fff8ea;
  color: #faad14;
  border: 1px solid #faad14;
  border-radius: 4px;
}

.search > * {
  padding: 0;
  margin-right: 30px !important;
}
</style>
