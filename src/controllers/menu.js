/**
 * 通用菜单页控制器
 */

import path from 'path'
import {Router} from 'express'

import {getMenuInfo} from '../models/menu'
import {config} from '../config'

const router = Router()
router.prefix = config.location

router.get('/menu/:id', (req, res)=> {
  // 菜单ID：
  const id = req.params.id
  //拿到page
  const page = parseInt(req.query.page || 0)
  //菜单索引
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
  // 获取菜单信息：
  getMenuInfo(token, id, page)
    .then(data=> {
      data.page = page
      data.menuIndex = menuIndex
      data.location = config.location
      data.defaultX = defaultX
      data.defaultY = defaultY
      //渲染模板 响应给客户端
      res.render('columns', data)

    })
})

export default router
