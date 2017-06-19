import {config} from '../config'

//后台相关地址
const tpsHost = config.tpsHost//门户信息
const cbsHost = config.cbsHost//用户信息
const assets_host = config.assets_host//静态资源地址

import fetch from 'node-fetch'

//说明 所有请求必须传token中的参数  token为记录用户相关信息的对象

//定义公共接口
let CommonApi = {}

//地址和请求参数的拼接
CommonApi.getUrl = function (url, paramsObj) {
  var paramsStr = ''
  if (typeof paramsObj === 'object') {
    for (var v in paramsObj) {
      paramsStr += v + '=' + encodeURI(paramsObj[v]) + '&'
    }
    paramsStr = '?' + paramsStr.slice(0, -1)
  }
  return (url + paramsStr)
}


//门户数据接口
const MainApi = {}

//主页菜单数据
MainApi.getMenus = function (token) {
  const opt =
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }
  const url = CommonApi.getUrl(tpsHost + '/pageconfig/getpagedata', token)
  return fetch(url, opt)
    .then(res=>res.json())
}

//获取菜单页面数据
MainApi.getMenuPageInfo = function (token, DGid) {
  const opt =
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }
  const url = CommonApi.getUrl(tpsHost + '/pageconfig/getcategorydetail', Object.assign(token, {
    category_code: DGid//分类列表id
  }))
  return fetch(url, opt)
    .then(res=>res.json())
}


//获取内容列表信息
MainApi.getContentList = function (token, DGid, start, count) {
  start = start || 0
  count = count || -1
  const opt =
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }
  const url = CommonApi.getUrl(tpsHost + '/pageconfig/getcontentlist', Object.assign(token, {
    category_code: DGid,//分类列表id
    offset: start,
    count: count,
    content_scope: 'category'
  }))
  return fetch(url, opt)
    .then(res=>res.json())
}

//获取指定剧集下的视频列表
MainApi.getVideoList = function (token, album_code, start, count) {
  start = start || 0
  count = count || 24
  const opt =
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }
  const url = CommonApi.getUrl(tpsHost + '/pageconfig/getcontentlist', Object.assign(token, {
    album_code: album_code,
    offset: start,
    count: count,
    content_scope: 'album'
  }))
  return fetch(url, opt)
    .then(res=>res.json())
}

//获取指定内容信息
MainApi.getContentInfo = function (token, content_code) {
  const opt =
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }
  const url = CommonApi.getUrl(tpsHost + '/pageconfig/getcontentinfo', Object.assign(token, {
    content_code: content_code//内容id
  }))
  return fetch(url, opt)
    .then(res=>res.json())
}

//批量获取指定内容信息
MainApi.getArrayCodeInfo = function (token, code_array, start, count) {
  start = start || 0
  count = count || -1
  const opt =
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }
  const content_code_array = code_array.join(',')
  const url = CommonApi.getUrl(tpsHost + '/pageconfig/getcontentlist', Object.assign(token, {
    content_code_array: content_code_array,//内容id字符串
    offset: start,
    count: count,
    content_scope: 'list'
  }))
  return fetch(url, opt)
    .then(res=>res.json())
}

//获取收藏列表
MainApi.getCollectList = function (token, count) {
  const opt =
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }
  const url = CommonApi.getUrl(cbsHost + '/user/getusercollect', Object.assign(token, {
    count
  }))
  return fetch(url, opt)
    .then(res=>res.json())
}
//记录用户最近使用信息
MainApi.recordInfo = function (token, contentcode) {
  const opt =
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }
  const url = CommonApi.getUrl(cbsHost + '/user/recordcontentuseinfo', Object.assign(token, {
    contentcode
  }))
  return fetch(url, opt)
    .then(res=>res.json())
}
//最近使用内容列表
MainApi.getUseHistory = function (token, count) {
  const opt =
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }
  const url = CommonApi.getUrl(cbsHost + '/user/getcontentusehis', Object.assign(token, {
    count
  }))
  return fetch(url, opt)
    .then(res=>res.json())
}
//用户行为上报接口
MainApi.actionLog = function (data) {
  const opt =
  {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }
  const url = CommonApi.getUrl(cbsHost + '/actionlog/record', data)
  return fetch(url, opt)
    .then(res=>res.json())
}
export {
  MainApi,
  CommonApi,
  assets_host
}
