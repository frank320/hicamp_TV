/**
 * Created by frank on 2016/9/20.
 * 父母挑选
 */
import {Router} from 'express'

import {getFilterInfo} from '../models/filter'
import {config} from '../config'

const router = Router()
router.prefix = config.location

router.get('/filter/:id', (req, res)=> {
  // 菜单ID：
  const id = req.params.id
  //拿到page
  const page = parseInt(req.query.page || 0)
  //菜单索引
  const menuIndex = parseInt(req.query.menuIndex || 1)
  //默认焦点
  const defaulX = req.query.defaultX || 0
  const defaulY = req.query.defaultY || 0
  //用户信息
  const token = {
    areacode: req.cookies.areacode,
    websitecode: req.cookies.websitecode,
    usercode: req.cookies.usercode,
    user_session: req.cookies.user_session
  }

  // 获取菜单信息：
  getFilterInfo(token, id, page)
    .then(data=> {
      data.page = page
      data.menuIndex = menuIndex
      data.location = config.location
      data.defaultX = defaulX
      data.defaultY = defaulY
      data.cbsHost = config.cbsHost
      //渲染模板 响应给客户端
      res.render('filter', data)
    })
})

export default router
