import { ElMessageBox } from 'element-plus'
import { toLogin } from '@/utils/auth.js'

export default function useArchive() {
  //退出登陆
  const exitLogin = () => {
    $MessageBox
      .confirm('真的要退出登陆吗?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(() => {
        toLogin()
      })
      .catch(() => {
        //取消：就不做任何提示了
      })
  }

  return {
    exitLogin
  }
}
