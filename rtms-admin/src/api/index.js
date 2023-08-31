import request from '@/utils/request'

// 查询任务完成数
export function getDayAndMonProd() {
  return request({
    url: '/prodMange/home/getDayAndMonProd',
    method: 'get',
  })
}
//获取看板列表
export function getprodplanlistBoard(query) {
  return request({
    url: '/prodMange/home/getProdStatusOut',
    method: 'get',
    params: query
  })
}
//获取agv小车状态
export function getAgvStatus() {
  return request({
    url: '/prodMange/home/getAgvStatus',
    method: 'get',
  })
}
//获取密度统计
export function getInAndOutDayProd() {
  return request({
    url: '/prodMange/home/getInAndOutDayProd',
    method: 'get',
  })
}

