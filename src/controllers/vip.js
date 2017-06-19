/**
 * Created by frank on 2016/11/17.
 * 开通会员 会员相关信息
 */

import path from 'path'
import {Router} from 'express'

import {config} from '../config'

const router = Router()
router.prefix = config.location

router.get('/vip', (req, res)=> {
  //用户信息
  const token = {
    areacode: req.cookies.areacode,
    websitecode: req.cookies.websitecode,
    usercode: req.cookies.usercode,
    user_session: req.cookies.user_session
  }
  let data = {}
  data.location = config.location
  data.cbsHost = config.cbsHost
  data.orders = [
    {
      productno: 'product01',
      vipType: '月度会员',
      pricePerMonth: 39,
      totalPrice: 39 * 1 + '.00'
    },
    {
      productno: '6521478',
      vipType: '季度会员',
      pricePerMonth: 39,
      totalPrice: 39 * 3 + '.00'
    },
    {
      productno: '6521478',
      vipType: '半年会员',
      pricePerMonth: 35,
      totalPrice: 35 * 6 + '.00'
    },
    {
      productno: '652123478',
      vipType: '年度会员',
      pricePerMonth: 29,
      totalPrice: 29 * 12 + '.00'
    },

  ]

  //渲染模板 响应给客户端
  res.render('vip', data)

})

export default router
