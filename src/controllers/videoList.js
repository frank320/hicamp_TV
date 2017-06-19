/**
 * Created by frank on 2017/3/31.
 */
import path from 'path'
import {Router} from 'express'
import qs from 'querystring'

import {getVideoList} from '../models/videoList'
import {MainApi} from '../models/api'
import {config} from '../config'

const router = Router()
router.prefix = config.location

router.get('/videoList/:id', (req, res)=> {
  const bid = req.params.id
  const defaultX = req.query.defaultX || 0
  const page = req.query.page || 1
  //用户信息
  const token = {
    areacode: req.cookies.areacode,
    websitecode: req.cookies.websitecode,
    usercode: req.cookies.usercode,
    user_session: req.cookies.user_session
  }
  //记录观看历史
  MainApi.recordInfo(token, bid)
  // 获取播放页面信息
  getVideoList(token, bid, page)
    .then(data=> {
      data.cbsHost = config.cbsHost
      data.prefix = config.location
      data.defaultX = defaultX
      if (data.totalcount < 13) {
        data.maxPage = 1
      } else {
        data.maxPage = Math.ceil((data.totalcount - 12) / 24) + 1
      }
      data.page = page
      //渲染模板 响应给客户端
      if (page == 1) {
        res.render('head_videoList', data)
      } else {
        res.render('videoList', data)
      }
    })

})

export default router
