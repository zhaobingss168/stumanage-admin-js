import axios from '../axios'
/*
 * 用户管理模块
 */
// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/sysUser/queryByPage',
    method: 'get',
    params
  })
}
// 保存
export const save = (data) => {
    return axios({
        url: '/sysUser/save',
        method: 'post',
        data
    })
}

// 修改密码
export const updatePwd = (data) => {
    return axios({
        url: '/sysUser/updatePassword',
        method: 'post',
        data
    })
}

// 保存
export const update = (data) => {
  return axios({
    url: '/sysUser/update',
    method: 'post',
    data
  })
}
// 删除
export const del = (data) => {
    return axios({
        url: '/sysUser/delete',
        method: 'post',
        data
    })
}

// 删除角色
export const roledel = (data) => {
  return axios({
    url: '/role/delete',
    method: 'post',
    data
  })
}

// 查找用户的菜单权限标识集合
export const findPermissions = (params) => {
    return axios({
        url: '/sysUser/findPermissions',
        method: 'get',
        params
    })
}
