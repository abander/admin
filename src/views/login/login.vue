<template>
  <div class="login-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">用户登录</div>
      </template>
      <el-form ref="formRef" :model="form" :rules="formRules" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="form.username" size="large" :prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" size="large" :prefix-icon="Lock" show-password />
        </el-form-item>
        <el-form-item prop="captcha">
          <div class="sid" style="display: flex; width: 100%; align-items: center">
            <el-input v-model="form.captcha" size="large" style="width: 90%" />
            <el-image class="pointer" :src="src" fit="fill" width="10%" @click="captcha" />
            <!--            <img :src="src" v-loading="captchaLoading" style="display: inline-block; height: 30px" @click="captcha" />-->
          </div>
        </el-form-item>
        <el-button :loading="submitLoading" size="large" type="primary" class="login-button" plain @click="submit"
          >登录</el-button
        >
      </el-form>
    </el-card>
    <div class="bg absolute-lt z-1 wh-full overflow-hidden">
      <div class="bg-t">
        <BgTop />
      </div>
      <div class="bg-b">
        <BgBottom />
      </div>
    </div>
  </div>
</template>

<script setup>
// element
import { User, Lock } from '@element-plus/icons-vue'
import useLogin from './useLogin'
const { form, formRef, formRules, submit, src, captcha, captchaLoading, submitLoading } = useLogin()
import { BgTop, BgBottom } from './components'
</script>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
$cursor: #fff;

.login-container {
  position: relative;
  min-height: 100%;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  //background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 35px 40px;
    margin: 0 auto;
    overflow: hidden;

    :deep(.el-form-item) {
      //  border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }

    //:deep(.el-input) {
    //  display: inline-block;
    //  height: 47px;
    //  width: 85%;
    //
    //  .el-input__wrapper {
    //    background: transparent;
    //    box-shadow: 0 0 0 0;
    //    border: 0px;
    //    -webkit-appearance: none;
    //    border-radius: 0px;
    //    padding: 12px 5px 12px 15px;
    //    color: $light_gray;
    //    height: 47px;
    //    caret-color: $cursor;
    //  }
    //}
    .login-button {
      width: 100%;
      box-sizing: border-box;
    }
  }

  .tips {
    font-size: 16px;
    line-height: 28px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    ::v-deep .lang-select {
      position: absolute;
      top: 4px;
      right: 0;
      background-color: white;
      font-size: 22px;
      padding: 4px;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .show-pwd {
    // position: absolute;
    // right: 10px;
    // top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

.box-card {
  width: 480px;
  z-index: 4;
}
</style>
<style scoped>
.absolute-lt {
  /*wh-full overflow-hidden*/
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  overflow: hidden;
}
.bg-t {
  position: absolute;
  right: -300px;
  top: -900px;
}
.bg-b {
  position: absolute;
  left: -200px;
  bottom: -400px;
}
.card-header {
  width: 100%;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
}

:deep(.el-form-item__content) {
  width: 100%;
}
</style>
