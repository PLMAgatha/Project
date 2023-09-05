<template>
  <div>
    <!--新增彈出框-->
    <el-dialog
      :title="dialogTitle"
      id="achieve_dialog-sixUpdate"
      append-to-body
      class="mt-one"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        class="popup-one"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        @submit.native.prevent
      >
        <el-form-item label="AGV库位编号" prop="agvCode" >
          <el-input
            v-model="form.agvCode"
            placeholder="请输入AGV库位编号"
            minlength="1"
            maxlength="20"
            show-word-limit
            @keyup.native="keyUp"
          />
        </el-form-item>
        <el-form-item label="站点名称" prop="siteName" >
          <el-input
            v-model="form.siteName"
            placeholder="请输入站点名称"
            minlength="1"
            maxlength="20"
            show-word-limit
            @keyup.native="keyUp"
          />
        </el-form-item>
        <el-form-item label="库位类型:" prop="positionType">
          <el-select
            v-model="form.positionType"
            filterable
            placeholder="请选择库位类型"
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
        <el-form-item label="库位状态:" prop="positionStatus">
          <el-select
            v-model="form.positionStatus"
            filterable
            placeholder="请选择库位"
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
        <el-form-item label="是否启用:" prop="isEnable">
          <el-select
            v-model="form.isEnable"
            filterable
            placeholder="请选择是否启用"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="item in positionisenable"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属楼层:" prop="floor">
          <el-select
            v-model="form.floor"
            filterable
            placeholder="请选择所属楼层"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="item in positionfloor"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
import {
  getLibraryPositionList,
  delLibraryPosition,
  addLibraryPosition,
  updateLibraryPosition,
  getonetemplate,
} from "@/api/bs/libraryPosition";
import {listData} from "@/api/system/dict/data";

export default {
  name: "Role",
  components: {},
  data() {
    return {
      //删除按钮默认禁用
      btnDisabled: true,
      dialogFormVisible: false,
      form: {},
      agvId: null,
      // 弹出层标题
      dialogTitle: "新增",
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 列表
      stationList: [],
      // 查询参数
      // multipleSelection: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        agvCode: null,
        positionType: null,
        positionStatus: null,
      },
      rules: {
        agvCode: [
          { required: true, message: "请输入库位编号", trigger: "blur" },
        ],
        siteName: [
          { required: true, message: "请输入站点名称", trigger: "blur" },
        ],
        positionType: [
          { required: true, message: "请选择库位类型", trigger: "change" },
        ],
        positionStatus: [
          { required: true, message: "请选择库位状态", trigger: "change" },
        ],
        isEnable: [
          { required: true, message: "请选择是否启用", trigger: "change" },
        ],
        floor: [{ required: true, message: "请选择楼层", trigger: "change" }],
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
      }).catch(() =>{
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
      }).catch(() =>{
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
      }).catch(() =>{
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
      }).catch(() =>{
      })
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
    // 取消按钮
    cancel() {
      this.dialogFormVisible = false;
      this.$emit("reset");
    },
    //  提交按钮
    submitForm () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          addLibraryPosition(this.form).then(() => {
            this.$modal.msgSuccess("新增成功");
            this.dialogFormVisible = false;
            this.$emit("getList");
            this.$emit('refresh');
          }).catch((error) => {
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
