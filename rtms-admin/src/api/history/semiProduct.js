import request from '@/utils/request'

//获取列表
export function getPreparationList(query) {
  return request({
    url: '/prodMange/home/getProdStatusOut',
    method: 'get',
    params: query
  })
}

