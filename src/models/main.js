/**
 * Created by frank on 2016/9/21.
 * 主页数据获取
 */
import {MainApi, assets_host} from './api'
import {config} from '../config'

//请求首页数据
export const getHomeData = (token, page)=> {
  const homeData = {}
  let mainInfoId = ''
  let columns = []
  let columnName = ''

  return MainApi.getMenus(token)
    .then(res=> {
      const menuItems = res.data.slice(1, 7)
      //首页内容id
      mainInfoId = res.data[0].categorycode
      if (page == 0) {
        //添加一个背景色字段和顺序索引
        const bgcList = ['#EB648D', '#FF9442', '#3BC18F', '#2B92D5', '#EB6060', '#BA5CE6']
        menuItems.forEach((v, k)=> {
          v.bgc = bgcList[k]
          v.index = k + 1
        })
        //菜单数据
        homeData.menuName = '菜单'
        homeData.menuItems = menuItems
        //静态资源地址
        homeData.assets_host = config.assets_host
      }

      //父母挑选列表 播放记录 首页栏目信息
      const promiseArray = [MainApi.getCollectList(token, config.parent_choose_limt), MainApi.getUseHistory(token, config.use_history_limit), MainApi.getMenuPageInfo(token, mainInfoId)]
      //首页栏目数据
      return Promise.all(promiseArray)
    })
    .then(res=> {
      let column_promise_array = []
      let column_count = res[2].data.detail_list.length
      let column_array = res[2].data.detail_list
      let hasParentChoose = res[0].data.contentlist.length != 0 ? true : false
      let hasHistory = res[1].data.contentlist.length != 0 ? true : false
      if (hasParentChoose) {
        column_count++
      }
      if (hasHistory) {
        column_count++
      }
      //最大页码
      homeData.maxPage = Math.ceil((column_count - 2) / 3)
      if (page == 0) {
        if (hasParentChoose) {//父母挑选显示在首页
          //我的小伙伴
          column_array.slice(0, 1).forEach(v=> {
            column_promise_array.push(MainApi.getContentList(token, v.category_code))
          })
          //父母挑选
          columnName = '我的播单'
          const code_array = res[0].data.contentlist.map(v=> {
            return v.contentcode
          })
          column_promise_array.push(MainApi.getArrayCodeInfo(token, code_array))

        } else if (hasHistory) {
          //我的小伙伴
          column_array.slice(0, 1).forEach(v=> {
            column_promise_array.push(MainApi.getContentList(token, v.category_code))
          })
          //播放记录
          columnName = '最近播放'
          const code_array = res[1].data.contentlist.map(v=> {
            return v.contentcode
          })
          column_promise_array.push(MainApi.getArrayCodeInfo(token, code_array))
        } else {
          column_array.slice(0, 2).forEach(v=> {
            column_promise_array.push(MainApi.getContentList(token, v.category_code))
          })
        }
      } else if (page == 1) {
        if (hasParentChoose && hasHistory) {
          //首行播放记录
          columnName = '最近播放'
          const code_array = res[1].data.contentlist.map(v=> {
            return v.contentcode
          })
          column_promise_array.push(MainApi.getArrayCodeInfo(token, code_array))
          column_array.slice(1, 3).forEach(v=> {
            column_promise_array.push(MainApi.getContentList(token, v.category_code))
          })
        } else if (!hasHistory && !hasParentChoose) {
          column_array.slice(2, 5).forEach(v=> {
            column_promise_array.push(MainApi.getContentList(token, v.category_code))
          })
        } else {
          column_array.slice(1, 4).forEach(v=> {
            column_promise_array.push(MainApi.getContentList(token, v.category_code))
          })
        }
      } else {
        //分页处理
        let start = 0
        if (hasHistory && hasParentChoose) {
          start = (page - 1) * 3
        } else if (!hasHistory && !hasParentChoose) {
          start = (page - 1) * 3 + 2
        } else {
          start = (page - 1) * 3 + 1
        }
        column_array.slice(start, start + 3).forEach(v=> {
          column_promise_array.push(MainApi.getContentList(token, v.category_code))
        })

      }

      return Promise.all(column_promise_array)
    })
    .then(res=> {
      if (page == 0) {
        if (res[0]) {
          homeData.myfellow = res[0]
        }
        //栏目
        if (res[1]) {
          homeData.column = res[1]
        }
      } else {
        for (let v of res) {
          columns.push(v)
        }
        homeData.columns = columns
      }
      homeData.columnName = columnName
      return homeData
    })


}
