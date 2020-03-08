import axios from '../axios'
/**
 * 菜单管理
 * 赵冰
 * @param data 2020.1
 */
 // 菜单保存
export const save = (data) => {
    return axios({
        url: '/sysMenu/save',
        method: 'post',
        data
    })
}

// 菜单修改
export const update = (data) => {
    return axios({
        url: '/sysMenu/update',
        method: 'post',
        data
    })
}

// 删除
export const del = (data) => {
    return axios({
        url: '/sysMenu/delete',
        method: 'post',
        data
    })
}
// 查找导航菜单树
export const findNavTree = (params) => {
    return axios({
        url: '/sysMenu/findNavTree',
        method: 'get',
        params
    })
}
// 查找导航菜单树
export const findMenuTree = () => {
    return axios({
        url: '/sysMenu/findMenuTree',
        method: 'get'
    })
}
