import axios from '../axios'


export const headcount = (params) => {
  return axios({
    url: '/homePageStatistics/headcount',
    method: 'get',
    params
  })
}

export const getSevenDayApplyTotal = (params) => {
  return axios({
    url: '/homePageStatistics/getSevenDayApplyTotal',
    method: 'get',
    params
  })
}



