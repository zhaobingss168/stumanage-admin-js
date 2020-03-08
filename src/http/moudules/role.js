import axios from '../axios'

/*
 * 角色管理模块
 */
// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/sysRole/queryByPage',
    method: 'get',
    params
  })
}
// 保存
export const save = (data) => {
  return axios({
    url: '/sysRole/save',
    method: 'post',
    data
  })
}
// 修改
export const update = (data) => {
  return axios({
    url: '/sysRole/update',
    method: 'post',
    data
  })
}

// 删除
export const del = (data) => {
  return axios({
    url: '/sysRole/delete',
    method: 'post',
    data
  })
}

// 获取所有角色
export const getRoleSList = (params) => {
  return axios({
    url: '/sysRole/querySysRole',
    method: 'get',
    params
  })
}

// 查询全部
export const findAllRoles = () => {
  return axios({
    url: '/sysRole/findAllRoles',
    method: 'get'
  })
}

// 根据角色id查询出对应的角色菜单
export const findRoleMenus = (params) => {
  return axios({
    url: '/sysRole/findRoleMenus',
    method: 'get',
    params
  })
}
// 保存角色菜单集合
export const saveRoleMenus = (data) => {
  return axios({
    url: '/sysRole/saveRoleMenus',
    method: 'post',
    data
  })
}



