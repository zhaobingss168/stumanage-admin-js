import axios from '../axios'

/*
 * 系统日志
 */

// 分页查询
export const findPage = (params) => {
  return axios({
    url: '/sysLog/querySysLogByPage',
    method: 'get',
    params
  })
}
