<template>
  <div>
    <el-dialog :title="title" :visible.sync="upload.open" width="400px" append-to-body class="mt-four"
               @close="uploadclose">
      <el-upload class="upload-demo" ref="upload" drag accept=".xlsx, .xls" :headers="upload.headers"
                 :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
                 :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传excel文件</div>
      </el-upload>
      <div slot="footer" class="dialog-footer-imp">
        <div>
          <el-button class="model-left" @click="importTemplate">下载模版</el-button>
        </div>
        <div class="model-right">
          <el-button @click="uploadcancel">取 消</el-button>
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {getBaseHeader} from "@/utils/request";
import {gettemplate} from "@/api/prodManger/inProdPlan"

export default {
  name: "EditControl",
  props: {
    title: {
      type: String,
      default: '',
    },
    idslist: {
      type: Array,
    }
  },
  data() {
    return {
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/admin-api/prodMange/in-prod-plan/import'
      },
      fileList: [],
    }
  },
  methods: {
    open() {
      this.$nextTick(() => {
        this.$refs.upload.clearFiles()
      })
      this.form.status = null
    },
    // 下载模板
    importTemplate() {
      gettemplate().then(response => {
        this.$download.excel(response, '模板案例.xls');
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      if (response.code !== 0) {
        this.$modal.msgError(response.msg)
        this.upload.isUploading = false;
        return;
      }
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$message.success('导入成功');
      this.$emit('refresh');
    },
    // 确定按钮
    submitFileForm() {
      let files = this.$refs.upload.uploadFiles;
      if (files.length == 0) {
        this.$message.warning('请选择要导入的文件')
      } else {
        this.$refs.upload.submit();
      }
    },
    // 取消按钮
    uploadcancel() {
      this.upload.isUploading = false;
      this.upload.open = false;
      this.$refs.upload.clearFiles();
    },
    // 导入右上角弹窗
    uploadclose() {
      this.upload.isUploading = false;
      this.upload.open = false;
      this.$refs.upload.clearFiles();
    }
  },
}
</script>

<style scoped>
</style>
