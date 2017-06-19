/**
 * 父母挑选页面数据模型
 */

import {MainApi} from './api'

export const getFilterInfo = (token, id, page) => {
  const filterInfo = {}
  const columns = []
  return MainApi.getMenuPageInfo(token, id)
    .then(res=> {
      //处理分页逻辑
      filterInfo.maxPage = Math.ceil((res.data.detail_list.length - 3) / 3)
      //分页处理
      const start = page * 3
      const column_array = res.data.detail_list.slice(start, start + 3).map(v=> {
        return MainApi.getContentList(token, v.category_code)
      })
      column_array.push(MainApi.getCollectList(token))
      return Promise.all(column_array)
    })
    .then(res=> {
      //父母挑选内容编码列表
      const collectList = res.pop().data.contentlist
      let codeArray = []
      for (let i of collectList) {
        codeArray.push(i.contentcode)
      }
      //展示栏目列表
      for (let v of res) {
        columns.push(v)
      }
      filterInfo.columns = columns
      filterInfo.codeArray = codeArray
      return filterInfo
    })
}
