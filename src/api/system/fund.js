import request from '@/api/request.js'

export const getAllFundsApi = () => {
  return request({
    url: '/fund/getFunds',
    method: 'get'
  })
}

export const getSaveFundsApi = () => {
  return request({
    url: '/fund/getDetail',
    method: 'post'
  })
}

export const updateSaveFundsApi = (data) => {
  return request({
    url: '/fund/update',
    method: 'post',
    data
  })
}
