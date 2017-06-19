/**
 * 通用菜单数据模型
 */

import {MainApi,host} from './api'

export const getMenuInfo = (token, id, page)=> {
  const menuInfo = {}
  let columns = []
  //带banner图的数据
  //if (page == 0) {
  //  return MainApi.getMenuPageInfo(token, id)
  //    .then(res=> {
  //      menuInfo.maxPage = Math.ceil((res.data.detail_list.length - 2) / 3)
  //      const column_array = res.data.detail_list.slice(0, 2).map(v=> {
  //        return MainApi.getContentList(token, v.category_code)
  //      })
  //      return Promise.all(column_array)
  //    })
  //    .then(res=> {
  //      //海报
  //      if (res[0]) {
  //        menuInfo.banner = res[0]
  //      }
  //      //栏目
  //      if (res[1]) {
  //        menuInfo.column = res[1]
  //      }
  //      return menuInfo
  //    })
  //} else {
  //  return MainApi.getMenuPageInfo(token, id)
  //    .then(res=> {
  //      menuInfo.maxPage = Math.ceil((res.data.detail_list.length - 2) / 3)
  //      //分页处理
  //      const start = (page - 1 ) * 3 + 2
  //      const column_array = res.data.detail_list.slice(start, start + 3).map(v=> {
  //        return MainApi.getContentList(token, v.category_code)
  //      })
  //      return Promise.all(column_array)
  //    })
  //    .then(res=> {
  //      for (let v of res) {
  //        columns.push(v)
  //      }
  //      menuInfo.columns = columns
  //      return menuInfo
  //    })
  //}

  //不带banner图

  return MainApi.getMenuPageInfo(token, id)
    .then(res=> {
      menuInfo.maxPage = Math.ceil((res.data.detail_list.length - 3) / 3)
      //分页处理
      const start = page * 3
      const column_array = res.data.detail_list.slice(start, start + 3).map(v=> {
        return MainApi.getContentList(token, v.category_code)
      })
      return Promise.all(column_array)
    })
    .then(res=> {
      for (let v of res) {
        columns.push(v)
      }
      menuInfo.columns = columns
      return menuInfo
    })

}