import io from 'socket.io-client'
import { ref } from 'vue'
import { userStore } from '@/stores/user'

export default function useSocket() {
  const chatList = ref([])
  const url = import.meta.env.VITE_SOCKET_BASE
  const socket = io(`${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${url}/chat`)
  const userInfo = userStore()
  socket.on('connect', () => {
    socket.emit('online', userInfo.user.username)
    console.log(socket.id, '监听客户端连接成功-connect')
  })
  socket.on('fresh-message', (data) => {
    chatList.value = data
  })
}
