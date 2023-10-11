import request from '@/api/request.js'

// 列表查询
export const getMsg = (params) => {
  return request({
    url: '/msg/list',
    method: 'get',
    params
  })
}

// 新增保存
export const addMsg = (data) => {
  return request({
    url: '/msg/add',
    method: 'post',
    data
  })
}

// 编辑保存
export const updateMsg = (data) => {
  const { id } = data
  return request({
    url: `/msg/update/${id}`,
    method: 'put',
    data
  })
}
// 删除
export const delMsg = (id) => {
  return request({
    url: `/msg/remove/${id}`,
    method: 'delete'
  })
}
