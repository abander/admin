<!--dialog二次封装-->
<template>
  <div class="dialog-test">
    <el-button type="primary" @click="showDialog">弹窗</el-button>
    <Dialog-box
      v-model:visible="isShow"
      title="测试"
      width="703px"
      :loading="loading"
      :is-check="isCheck"
      @handleSave="handleSave"
    >
      <div slot="content">
        <div>我是弹窗</div>
        <!--        <input></input>-->
      </div>
      <!--      <div slot="footer">
              <el-button>确定按钮</el-button>
            </div>-->
    </Dialog-box>
    <!-- 不使用.sync   -->
    <!--    <base-dialog-box :visible="isShow" @update:visible="change" title="测试" width="703px" @handleSave="handleSave" :loading="loading">
          <div>我是弹窗</div>
          <input></input>
        </base-dialog-box>-->
  </div>
</template>
<script>
import DialogBox from '../../../components/dialog-box/index.vue'
export default {
  name: 'Index',
  // components:{DialogBox},
  data() {
    return {
      isShow: false,
      loading: false,
      isCheck: true,
    }
  },
  methods: {
    //按钮
    showDialog() {
      this.isShow = true
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000)
    },
    //点击保存按钮
    handleSave() {
      // 处理校验
      this.isShow = false
    },
    change(e) {
      this.isShow = e
    },
  },
}
</script>

<style scoped></style>

<!--基础dialog封装-->
<!--
<template>
  <div class="dialog-test">
    <el-button type="primary" @click="showDialog">弹窗</el-button>

    <base-dialog-original
      :isShow.sync="isShow"
      title="测试"
      width="703px"
      @handleSave="handleSave"
    >
      <div>我是弹窗</div>
    </base-dialog-original>
  </div>
</template>
<script>
import BaseDialogOriginal from '../../../../components/dialog-box/baseDialogOriginal'
export default {
  name: 'test',
  components:{BaseDialogOriginal},
  data(){
    return{
      isShow: false,
    }
  },
  watch:{
    isShow(newValue){ // 监听弹窗状态
      if(newValue == false){
        // 如果需要重置表单在此操作
        this.reset()
      }
    }
  },
  methods:{
    showDialog(){
      this.isShow = true
    },

    handleSave(){//点击保存按钮
      this.isShow = false
    },

    reset(){

    }
  }
}
</script>-->
