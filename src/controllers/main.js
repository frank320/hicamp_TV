/**
 * Created by frank on 2016/9/20.
 * 首页
 */
import path from 'path'
import { Router } from 'express'

import {MainApi} from '../models/api'
import {getHomeData} from '../models/main'
import {config} from '../config'

const router = Router()
router.prefix = config.location

//验证用户权限
router.get('/', (req, res)=> {
  //if (req.query.isVip != 'false') {
  //  return res.redirect('/vip') //开发时跳转到开通会员页面
  //}
  //if (!req.query.usercode) {
  //  return res.render('getUserInfo', {})
  //}
  //获取用户信息
  //window.location.replace('http://47.93.116.9:15008?websitecode=WS20170415001&areacode=10100003')
  ////接受后台传送过来的用户相关数据
  //const areacode = req.query.areacode
  //const websitecode = req.query.websitecode
  //const usercode = req.query.usercode
  //const user_session = req.query.user_session

  res.render('index', {
    areacode: config.areacode,
    websitecode: config.websitecode,
    location: config.location,
    cbsHost: config.cbsHost,
  })
})
//响应主页数据
router.get('/main', (req, res)=> {
  //拿到用户发来的查询数据
  const page = parseInt(req.query.page || 0)
  const menuIndex = parseInt(req.query.menuIndex || 1)
  const defaultX = parseInt(req.query.defaultX || 0)
  const defaultY = parseInt(req.query.defaultY || 0)
  //用户信息
  const token = {
    areacode: req.cookies.areacode,
    websitecode: req.cookies.websitecode,
    usercode: req.cookies.usercode,
    user_session: req.cookies.user_session
  }
  //用户行为上报
  //MainApi.actionLog({
  //  usercode: token.usercode,
  //  user_session: token.user_session,
  //  actiondata: JSON.stringify({
  //    sitecode: token.websitecode,
  //    action: "自动进入",
  //    page: "栏目页_[首页]",
  //    detail: {
  //
  //    }
  //  })
  //})

  //获取数据
  getHomeData(token, page)
    .then(data=> {
      data.page = page
      data.menuIndex = menuIndex
      data.location = config.location
      data.defaultX = defaultX
      data.defaultY = defaultY
      //渲染模板 响应给客户端
      if (page == 0) {
        res.render('main', data)
      } else {
        res.render('columns', data)
      }
    })
})
export default router
