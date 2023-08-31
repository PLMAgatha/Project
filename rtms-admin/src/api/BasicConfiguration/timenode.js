import request from '@/utils/request'
import qs from "qs";

//获取列表
export function getTimeNodeList(query) {
  return request({
    url: '/bs/tnode-conf/page',
    method: 'get',
    params: query
  })
}

// 新增
export function addTimeNode(data) {
  return request({
    url: '/bs/tnode-conf/create',
    method: 'post',
    data: data
  })
}

// 编辑
export function updateTimeNode(data) {
  return request({
    url: '/bs/tnode-conf/update',
    method: 'put',
    data: data
  })
}


//批量删除
export function delTimeNodeList(data) {
  return request({
    url: '/bs/tnode-conf/deletes',
    method: 'delete',
    params: {
      ids: data
    },
    paramsSerializer: function (params) {
      return qs.stringify(params, { arrayFormat: "repeat" });
    },
  })
}
