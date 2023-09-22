<template>
  <div class="container-n">
    <div class="chat-content" ref="chatContainer">
      <template v-if="chatList && chatList.length">
        <div
          v-for="(chat, index) in chatList"
          class="message-box"
          :class="{ 'right-message': chat.user === userInfo.user.name }"
          :key="index"
        >
          <div v-if="chat.user !== userInfo.user.name" class="user">
            <el-avatar class="avatar" src="https://img.6tu.com/2023/07/20230707075538555-900x900.jpg"></el-avatar>
            <div class="info">
              <div class="name">{{ chat.user }}</div>
              <div class="time">{{ chat.createTime }}</div>
            </div>
          </div>
          <div v-else class="user">
            <div class="info">
              <div class="time">{{ chat.createTime }}</div>
              <div class="name">{{ chat.user }}</div>
            </div>
            <el-avatar class="avatar" :src="userInfo.user.avatar"></el-avatar>
          </div>
          <div class="message">
            <div class="block">{{ chat.message }}</div>
          </div>
        </div>
      </template>
      <div v-else class="empty">没有消息</div>
    </div>
    <div class="chat-bottom">
      <el-input @keydown.enter="sendMsg" v-model="chatMsg" class="chat-input" placeholder="请输入内容" />
      <el-button class="chat-btn" type="primary" @click="sendMsg">发送</el-button>
    </div>
    <div style="margin-top: 10px">
      当前用户：
      <el-select v-model="userInfo.user" value-key="id" @change="selectUser" placeholder="Select">
        <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item"> </el-option>
      </el-select>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, reactive, nextTick } from 'vue'
import io from 'socket.io-client'
import { userStore } from '@/stores/user'
import { ElNotification } from 'element-plus'
const avatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
const url = import.meta.env.VITE_SOCKET_BASE
export default {
  name: 'HomePage',
  setup() {
    const chatContainer = ref()
    const user = userStore()
    console.log(user)
    const chatList = ref([])
    const chatMsg = ref('')
    const userList = [
      {
        id: 1,
        name: user.user.username === 'zzh' ? 'admin' : 'zzh',
        avatar:
          user.user.username === 'zzh'
            ? 'https://miro.medium.com/v2/resize:fit:1400/0*rD3NNaSbUjHFph4M.jpg'
            : 'https://img.6tu.com/2023/07/20230707075538555-900x900.jpg'
      }
    ]
    const userInfo = reactive({ user: userList[0] })
    let socket
    onMounted(() => {
      socket = io(`${url}/chat?username=${user.user.username}&receiver=${userInfo.user.name}`)
      socket.on('connect', () => {
        socket.emit('online', user.user.username)
        console.log(socket.id, '监听客户端连接成功-connect')
      })
      socket.on('refresh', ({ list, caches }) => {
        chatList.value = list
        nextTick(() => {
          console.log(chatContainer);
          chatContainer.value?.scrollTo({ top: chatContainer.value?.scrollHeight, behavior: 'smooth' })
        })
      })
      socket.on('onlineInfo', ({ type, message, title }) => {
        ElNotification({
          title,
          message,
          type
        })
      })
    })
    const selectUser = (user) => {
      userInfo.user = user
    }
    const sendMsg = () => {
      socket.emit('send-message', { user: user.user.username, message: chatMsg.value })
      chatMsg.value = ''
    }
    return {
      chatMsg,
      chatList,
      userList,
      userInfo,
      sendMsg,
      selectUser,
      chatContainer
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin flex($align) {
  display: flex;
  align-items: $align;
}
.container-n {
  padding: 24px;
  height: 100%;
  box-sizing: border-box;
}
.chat-bottom {
  @include flex(center);
}
.chat-content {
  overflow: auto;
  height: calc(100% - 32px);
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-bottom: none;
  box-sizing: border-box;
  .message-box {
    margin-bottom: 10px;
    .message {
      margin-left: 42px;
      border-radius: 4px;
      box-sizing: border-box;
      margin-top: 5px;
      width: calc(100% - 42px);
      white-space: break-spaces;
      .block {
        display: inline-block;
        font-size: 14px;
        line-height: 1.5;
        border-radius: 4px;
        padding: 8px;
        background-color: #eee;
      }
    }
    .user {
      .avatar {
        width: 32px;
        height: 32px;
        margin-right: 10px;
      }
      @include flex(center);
    }
    .info {
      @include flex(center);
      font-size: 12px;
      color: #999;
      .name {
        margin-right: 10px;
      }
    }
    &.right-message {
      text-align: right;
      .message {
        padding-right: 42px;
        margin-left: auto;
      }
      .user {
        .name {
          margin-right: 0px;
          margin-left: 10px;
        }
        justify-content: flex-end;
      }
      .avatar {
        margin-right: 0px;
        margin-left: 10px;
      }
    }
  }
}
.empty {
  font-size: 14px;
  padding: 50px 0;
  text-align: center;
}
.chat-input {
  &:deep(.el-input__inner) {
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    border-bottom-right-radius: 0;
  }
}
.chat-btn {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
