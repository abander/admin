// 请求级别的权限：有些请求是不需要token的
// 不需要token的请求  白名单
export const requestWhiteList = [
  '/users/login', // 登陆请求
  '/mail/captcha', // 验证码请求
]
