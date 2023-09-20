<!--upload二次封装组件-->
<template>
  <div class="image-upload-drag">
    <el-upload
      v-loading="uploading"
      drag
      :action="action"
      :headers="headers"
      :multiple="false"
      :show-file-list="false"
      :with-credentials="false"
      :on-success="handleImageSuccess"
      :before-upload="beforeImageUpload"
      :on-error="handleImageError"
      :http-request="handleCompressorFile"
      :style="styles"
      accept="image/*"
      name="file"
      class="upload-drag"
    >
      <div v-if="!thumb && mode === 'default'" class="drag-info">
        <i class="el-icon-upload" />
        <div v-if="height > 100" class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </div>
      <div v-else-if="!thumb && mode === 'plain'" :class="['drag-info', mode]">
        <div class="icon-wrap">
          <i class="el-icon-plus avatar-uploader-icon"></i>
        </div>
      </div>
      <dl v-else class="drag-renew square-bg">
        <dt>
          <img :key="thumb" :src="thumb" />
        </dt>
        <dd class="reload">
          <i class="el-icon-refresh-left" />
          <p>重新上传</p>
        </dd>
      </dl>
    </el-upload>
  </div>
</template>

<script>
/*import { mapGetters } from 'vuex'
import axios from 'axios'
import Compressor from 'compressorjs'
import { getToken } from '@/utils/auth'*/
export default {
  name: 'Index',
  props: {
    mode: {
      type: String,
      default: 'default',
    },
    url: {
      type: String,
      default: '',
    },
    width: {
      type: Number,
      default: 320,
    },
    height: {
      type: Number,
      default: 180,
    },
    quality: {
      type: Number,
      default: 0.75,
    },
    // callBack: {
    //   type: Function,
    //   default: () => {}
    // }
  },
  data() {
    return {
      action: '',
      headers: {},
      uploading: false,
      styles: '',
      thumb: '',
    }
  },
  computed: {
    //...mapGetters(['token'])
  },
  watch: {
    url() {
      this.thumb = this.url
    },
  },
  mounted() {
    this.styles = `width:${this.width}px;height:${this.height}px;`
    this.thumb = this.url
  },
  methods: {
    /**
     * 上传之前回调函数
     */
    beforeImageUpload(file) {
      const result = file.size / 1024 / 1024 < 2
      if (!result) {
        this.$message.error('上传图片大小不能超过 2MB!')
      } else {
        this.uploading = true
      }
      return result
    },
    /**
     * 处理文件
     */
    handleCompressorFile({ file }) {
      if (!file) {
        return
      }
      const that = this
      const config = {
        quality: this.quality,
        maxWidth: 1024,
        success(result) {
          that.handleUploadFile(result)
        },
        error(err) {
          that.$message({
            message: '图片上传失败',
            type: 'error',
          })
          that.uploading = false
          console.log(err.message)
        },
      }
      // eslint-disable-next-line no-new
      new Compressor(file, config)
    },
    /**
     * 上传文件
     */
    handleUploadFile(val) {
      const formData = new window.FormData()
      const activityInside = ['/creation', '/activity/blank'].includes(
        this.$route.name,
      )
      formData.append('file', val, val.name)
      if (activityInside && this.$route.params.id) {
        formData.append('activity_id', this.$route.params.id)
      }
      if (this.url) {
        formData.append('url', this.url)
      }
      const options = {
        url: process.env.VUE_APP_BASE_API + 'api/upload',
        data: formData,
        method: 'post',
        headers: {
          Authorization: 'Bearer ' + (this.token || getToken()),
          'Content-Type': 'multipart/form-data',
        },
      }
      axios(options)
        .then((res) => {
          if (res && res.data) {
            this.handleImageSuccess(res.data)
          }
        })
        .catch(function (error) {
          this.handleImageError(error)
        })
    },
    /**
     * 上传成功回调函数
     */
    handleImageSuccess(res, file) {
      this.uploading = false
      if (res && res.url) {
        this.thumb = res.url
        this.$emit('callBack', res.url)
      } else {
        this.$message({
          message: `图片上传失败`,
          type: 'error',
        })
      }
    },
    /**
     * 上传失败回调函数
     */
    handleImageError(err, file) {
      this.uploading = false
      this.$message({
        message: '图片上传失败',
        type: 'error',
      })
      console.log(err)
    },
  },
}
</script>

<!--<style rel="stylesheet/scss" lang="scss">
.image-upload-box-drag {
  display: inline-block;
  .upload-box-drag {
    width: max-content;
    .el-upload-box {
      width: 100%;
      height: 100%;
    }
    .el-upload-box-dragger {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      border-radius: 4px;
      .drag-info {
        .el-icon-upload-box {
          margin: 16px 0 20px;
          color:  #dbebfc;
          font-size: 106px;
        }

        &.plain{
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
        }
      }
      .drag-renew {
        position: relative;
        overflow: hidden;
        height: 100%;
        width: 100%;
        margin: 0;
        &:hover .reload {
          opacity: 1;
        }
        dt {
          position: absolute;
          z-index: 1;
          height: 100%;
          width: 100%;
          img {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            object-fit: contain;
            transform: translate(-50%, -50%);
          }
        }
        dd {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
          padding-top: 16%;
          background: rgba(0, 0, 0, 0.6);
          opacity: 0;
          transition: all 0.5s;
          i {
            font-size: 34px;
            color: white;
          }
          p {
            color: white;
          }
        }
      }
    }
  }
}
</style>-->
