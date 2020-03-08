import axios from '../axios'

/*
 * 报名信息管理
 */

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/appApplyInfoManage/queryByPage',
    method: 'get',
    params
  })
}

// 查询所有
export const queryAll = (params) => {
  return axios({
    url: '/appApplyInfoManage/queryAll',
    method: 'get',
    params
  })
}

// 修改
export const update = (data) => {
  return axios({
    url: '/appApplyInfoManage/update',
    method: 'post',
    data
  })
}

// 保存
export const save = (data) => {
  return axios({
    url: '/appApplyInfoManage/save',
    method: 'post',
    data
  })
}

// 删除
export const del = (data) => {
  return axios({
    url: '/appApplyInfoManage/delete',
    method: 'post',
    data
  })
}
