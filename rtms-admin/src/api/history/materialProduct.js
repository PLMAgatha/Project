import request from '@/utils/request'

//获取列表
export function getPreparationList(query) {
  return request({
    url: '/prodMange/home/getProdStatusIn',
    method: 'get',
    params: query
  })
}
