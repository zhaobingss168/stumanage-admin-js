import axios from '../axios'

/*
 * 系统参数配置模块
 */

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/sysConfig/querySysConfigByPage',
    method: 'get',
    params
  })
}

// 修改
export const update = (data) => {
  return axios({
    url: '/sysConfig/update',
    method: 'post',
    data
  })
}

// 保存
export const save = (data) => {
  return axios({
    url: '/sysConfig/save',
    method: 'post',
    data
  })
}

// 删除
export const del = (data) => {
  return axios({
    url: '/sysConfig/delete',
    method: 'post',
    data
  })
}
