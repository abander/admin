import request from "@/api/request.js";

// 列表查询
export const getCommon = (params) => {
    return request({
        url: '/common/commonApi/getCommonApi',
        method: 'get',
        params
    })
}

// 新增保存
export const addCommonApi = (data) => {
    return request({
        url: '/common/commonApi/addCommonApi',
        method: 'post',
        data
    })
}

// 编辑保存
export const updateCommonApi = (data) => {
    const {id} = data
    return request({
        url: `/common/commonApi/updateCommonApi/${id}`,
        method: 'put',
        data
    })
}
// 删除
export const delCommon = (id) => {
    return request({
        url: `/common/commonApi/deleteCommonApi/${id}`,
        method: 'delete'
    })
}
