import axios from '../axios'

/*
 * 系统计划任务管理
 */

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/scheduleJob/queryScheduleJobByPage',
    method: 'get',
    params
  })
}

// 修改
export const update = (data) => {
  return axios({
    url: '/scheduleJob/update',
    method: 'post',
    data
  })
}

// 保存
export const save = (data) => {
  return axios({
    url: '/scheduleJob/save',
    method: 'post',
    data
  })
}

// 暂停
export const pause = (data) => {
  return axios({
    url: '/scheduleJob/pause',
    method: 'post',
    data
  })
}

// 恢复
export const resume = (data) => {
  return axios({
    url: '/scheduleJob/resume',
    method: 'post',
    data
  })
}

// 删除
export const del = (data) => {
  return axios({
    url: '/scheduleJob/delete',
    method: 'post',
    data
  })
}
