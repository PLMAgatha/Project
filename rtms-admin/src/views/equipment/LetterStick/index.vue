<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" v-show="showSearch" :inline="true">
      <div style="display: flex;justify-content: space-between;">
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="queryParams.name" placeholder="请输入类别名称" clearable size="small" style="width: 240px"
                    @keyup.enter.native="handleQuery"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search"size="small" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh"size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </div>
    </el-form>

    <div class="add-btn">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus"size="small" @click="handleAdd"
                     v-hasPermi="['system:role:create']">新增类别
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="loading" :data="templatelistList">
      <el-table-column label="类别名称" align="center" prop="name" width="120"/>
      <el-table-column label="模板数量" align="center" prop="quantity" :formatter="quantityformatter" width="800"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="400">
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template v-slot="scope">
          <el-button size="small" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
                     v-hasPermi="['system:role:update']">编辑
          </el-button>
          <el-button size="small" type="text" class="btn" icon="el-icon-delete" @click="handleDelete(scope.row)"
                     v-hasPermi="['system:role:delete']">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/>
    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入类别名称"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  templatelist, addtemplate, deltemplate, getonetemplate, updatatemplate
} from "@/api/tag/templateCategory";

export default {
  name: "Role",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 模板类别列表
      templatelistList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          {required: true, message: '请输入模板类型名称', trigger: 'blur'},
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      templatelist(this.queryParams).then(
        response => {
          this.templatelistList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
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
      this.open = false;
      this.reset();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新增模板类别";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id
      getonetemplate(id).then(response => {
        this.form = response.data[0];
        console.log(this.form);
        this.open = true;
        this.title = "修改模板类别";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id !== undefined) {
            updatatemplate(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addtemplate(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id;
      this.$modal.confirm('确定要删除吗？').then(function () {
        return deltemplate(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    // 处理表格中的数据
    quantityformatter(row) {
      if (row.quantity == null) {
        return 0
      }
    }
  }
};
</script>

<style scoped>
.btn {
  color: #7a7a7a;
}

/*.add-btn {*/
/*  background-color: #f0f3f3;*/
/*  padding: 10px 0;*/
/*}*/

/deep/ .el-button--primary.is-plain {
  background-color: #056938;
  color: #fff;
  width: 120px;
}

/deep/ .el-button--primary {
  background-color: #056938;
  color: #fff;
  border-color: #056938;
}

/deep/ .el-button--primary.is-plain:hover, .el-button--primary.is-plain:focus {
  border-color: #056938;
}

/deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #056938;
}

/deep/ .el-pager li:hover {
  border-color: #056938 !important;
}
</style>
