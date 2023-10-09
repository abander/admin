import { nextTick, onMounted } from 'vue'
import io from 'socket.io-client'
import { ElNotification } from 'element-plus'

const url = import.meta.env.VITE_SOCKET_BASE

export default function useSocket() {
  const socket = io(`${url}/chat}`)

  onMounted(() => {
    socket.on('connect', () => {
      socket.emit('online')
      console.log(socket.id, '监听客户端连接成功-connect')
    })
  })

  return {
    socket
  }
}
