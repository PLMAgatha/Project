import request from '@/utils/request'
import qs from "qs";

//获取列表
export function getprodplanlist(query) {
  return request({
    url: '/prodMange/out-prod-plan/page',
    method: 'get',
    params: query
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

//批量删除
export function delall(data) {
  return request({
    url: '/prodMange/out-prod-plan/delete',
    method: 'delete',
    params: {
      ids: data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: "repeat"});
    },
  })
}

// 下载导入模板
export function gettemplate() {
  return request({
    url: '/prodMange/in-prod-plan/get-import-template',
    method: 'get',
    responseType: 'blob'
  })
}

//导出
export function getExcel(data) {
  return request({
    url: '/prodMange/out-prod-plan/export-excel',
    method: 'post',
    data: data,
    responseType: 'blob',
    paramsSerializer: function (params) {
      return qs.stringify(params, {arrayFormat: "repeat"});
    }
  })
}

// 批量更改状态
export function outeditstatus(data) {
  return request({
    url: '/prodMange/out-prod-plan/update',
    method: 'put',
    data: data,
  })
}

// 插单
export function insertone(data) {
  return request({
    url: '/prodMange/out-prod-plan/insertTicket',
    method: 'post',
    data: data,
  })
}

// 产品图号
export function getproductnumber(query) {
  return request({
    url: '/bs/material-diagram/page',
    method: 'get',
    params: query
  })
}

// 单个产品图号
export function getoneproductnumber(query) {
  return request({
    url: '/bs/material-diagram/get?id=' + query,
    method: 'get'
  })
}

// 上移下移
export function updown(data) {
  return request({
    url: '/prodMange/out-prod-plan/moveUp',
    method: 'post',
    data: data
  })
}

// 推迟
export function postponedata(data) {
  return request({
    url: '/prodMange/postpone-recored/create',
    method: 'post',
    data: data,
  })
}

//获取推迟提前列表
export function getpostponelist(query) {
  return request({
    url: '/prodMange/postpone-recored/page',
    method: 'get',
    params: query
  })
}

//重新计算时间
export function recalculate() {
  return request({
    url: '/prodMange/in-prod-plan/calculationTime',
    method: 'get',
  })
}
