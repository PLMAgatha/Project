import request from '@/utils/request'
import qs from "qs";

//获取列表
export function getLibraryPositionList(query) {
  return request({
    url: '/bs/library-position/page',
    method: 'get',
    params: query
  })
}

//批量删除
export function delLibraryPosition(data) {
  return request({
    url: '/bs/library-position/delete',
    method: 'delete',
    params: {
      ids: data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: "repeat" });
    },
  })
}

// 新增 调用的是库位管理里面的分页接口
export function pageLibraryPosition(data) {
  return request({
    url: '/bs/library-position/page',
    method: 'get',
    data: data
  })
}

// 新增
export function addLibraryPosition(data) {
  return request({
    url: '/bs/library-position/create',
    method: 'post',
    data: data
  })
}

// 编辑
export function updateLibraryPosition(data) {
  return request({
    url: '/bs/library-position/update',
    method: 'put',
    data: data
  })
}

// 根据ID查单条数据
export function getonetemplate(Id) {
  return request({
    url: '/bs/library-position/list?ids=' + Id,
    method: 'get'
  })
}
