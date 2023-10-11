import axios from 'axios'
import { getToken, toLogin } from '@/utils/auth.js'
import { requestWhiteList } from '@/config/auth.js'

// 创建一个axios实例对象
const request = axios.create({
  // vite弃用了process.env改用import.meta.env
  baseURL: import.meta.env.VITE_BASE_API, // 基础路径
  timeout: 10000 // 设置超时时间
})

// 配置请求拦截器
request.interceptors.request.use((config) => {
  //request请求拦截器

  /*
   * 1. 判断是否需要token，设置请求白名单
   * 2. 判断是否有token， 没有toLogin
   * */
  const { url } = config

  const token = getToken()

  if (!requestWhiteList.includes(url)) {
    // 需要token
    // 为每一个接口添加上token信息Authorization
    if (!token) {
      return toLogin('登陆失效，请重新登陆！')
    }
    config.headers.Authorization = 'Bearer ' + token
  }

  //在最后必须return config
  return config
})

// 配置响应拦截器
request.interceptors.response.use(
  (response) => {
    //response响应拦截器
    // const { data, meta } = response.data
    if (response.status === 200) {
      if (response.data.code === 200 || response.data) {
        if (typeof response.data === 'object' && response.data?.code !== 200) {
          handleError(response.data)
        }
        return response.data
      } else {
        handleError(response.data)
        return Promise.reject(new Error(response.data.message || '请求出错'))
      }
    } else {
      console.log('code !== 200')
      return Promise.reject(new Error(response))
    }
  },
  (error) => {
    error.response && $Message.error(error.response.data)
    return Promise.reject(new Error(error.response.data))
  }
)

// 暴露出去
export default request

const handleError = (data) => {
  const { code, msg: message } = data
  switch (code) {
    // token失效
    case 401:
      toLogin(message || '登陆失效，请重新登陆！')
      break
    //case
    case 404:
      toLogin(message || '请求出错，请联系管理员')
      break
    default:
      $Message.error(message || '未知错误')
  }
}
