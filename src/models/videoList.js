/**
 * Created by frank on 2017/3/31.
 * 获取剧集下所有单集视频列表
 */
import {MainApi} from './api'

export const getVideoList = (token, bid, page)=> {

  const start = page == 1 ? 0 : ((page - 1) * 24 - 12)
  const count = page == 1 ? 12 : 24
  return MainApi.getVideoList(token, bid, start, count)

}