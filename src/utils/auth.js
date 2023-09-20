import router from '@/router/index.js'

// 设置token
export const setToken = (token) => {
  sessionStorage.setItem('token', token)
}

// 获取token
export const getToken = () => {
  return sessionStorage.getItem('token')
}

// 清空token
export const removeToken = () => {
  setToken('')
}

// 回到login页面
export const toLogin = (msg) => {
  msg && $Message.error(msg)
  removeToken()
  router.replace('/login')
}
