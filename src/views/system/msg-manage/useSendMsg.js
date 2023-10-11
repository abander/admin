import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import { inject, onMounted } from 'vue'

export default function useSendMsg() {
  const socket = inject('socketInstance')
  const compMap = {
    message: (row) => {
      const { statusType, content, options } = row
      ElMessage({
        type: statusType,
        message: content,
        ...JSON.parse(options)
      })
    },
    notification: (row) => {
      const { statusType, content, options } = row

      ElNotification({
        title: '提示',
        message: content,
        type: statusType,
        ...JSON.parse(options)
      })
    },
    messageBox: async (row) => {
      const { statusType, content, options } = row
      await ElMessageBox({
        title: '提示',
        message: content,
        confirmButtonText: '确定',
        ...JSON.parse(options)
      })
    }
  }
  const handelSendMsg = (row) => {
    socket.emit('activeMsg', row._id)
  }
  onMounted(() => {
    socket.on('sendMsg', (row) => {
      compMap[row.componentsType](row)
    })
  })

  return {
    handelSendMsg
  }
}
