import request from '@/utils/request'

//获取列表
export function getAGVlist(query) {
  return request({
    url: '/prodMange/agv/page',
    method: 'get',
    params: query
  })
}

//故障弹框列表
export function getmalfunctionlist(query) {
  return request({
    url: '/prodMange/agverrlog/page',
    method: 'get',
    params: query
  })
}
