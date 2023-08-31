import request from '@/utils/request'
import qs from "qs";

//获取列表
export function getPreparationList(query) {
  return request({
    url: '/bs/offlinedraw-conf/page',
    method: 'get',
    params: query
  })
}

//获取起点站点的列表
export function getPreparationStartStation(query) {
  return request({
    url: 'bs/library-position/getisEnablelist',
    method: 'get',
    params: query
  })
}

// 新增
export function addPreparation(data) {
  return request({
    url: '/bs/offlinedraw-conf/create',
    method: 'post',
    data: data
  })
}

// 调用的是库位管理里面的分页接口
export function pagePreparation(data) {
  return request({
    url: '/bs/library-position/page',
    method: 'get',
    data: data
  })
}

// 编辑
export function updatePreparation(data) {
  return request({
    url: '/bs/offlinedraw-conf/update',
    method: 'put',
    data: data
  })
}

//批量删除
export function delPreparationList(data) {
  return request({
    url: '/bs/offlinedraw-conf/delete',
    method: 'delete',
    params: {
      ids: data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: "repeat" });
    },
  })
}

//导出 全部及批量导出
export function getExcel(data) {
  return request({
    url: '/bs/offlinedraw-conf/export-excel',
    method: 'post',
    data: data,
    responseType: 'blob',
    paramsSerializer (params) {
      return qs.stringify(params, {arrayFormat: "repeat"});
    }
  })
}

//导入
export function uploadOfflineExcel(updateSupport, uploadData) {
  return request({
    url: `/bs/offlinedraw-conf/import?updateSupport=${updateSupport}`,
    method: 'post',
    data: uploadData
  })
}

//下载模板
export function downloadPreExcel() {
  return request({
    url: `/bs/offlinedraw-conf/get-import-template`,
    method: 'get',
    responseType: 'blob',
  })
}
