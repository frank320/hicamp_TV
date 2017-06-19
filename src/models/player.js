/**
 * Created by frank on 2016/10/20.
 * 播放页面数据模型
 */
import {MainApi} from './api'

export const getRecommendation = (token, vid, bid)=> {
  return MainApi.getRecommendation(token, vid, bid)
    .then(data=> {
      return data
    })
}