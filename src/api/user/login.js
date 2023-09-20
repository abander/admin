import request from '../request'

//登录
// 实际请求：http://localhost:4000/smq/users/login   smq定义在.env.development里面 和 /users/login 拼接
// 代理时，发现有smq 就会把http://localhost:4000 改为 https://1270001.xyz/
export const login = (data) => {
  return request({
    url: '/users/login',
    method: 'POST',
    data,
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    url: '/users/info',
    method: 'get',
  })
}
// 获取验证码
export const getCaptcha = (sid) => {
  return request({
    url: '/mail/captcha',
    method: 'get',
    params: {
      sid,
    },
  })
}
