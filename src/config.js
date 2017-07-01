/**
 * Created by frank on 2016/9/20.
 */
//前端地址
const HOST = process.env.HOST || 'localhost'
const PORT = process.env.PORT || 8088
//前端访问地址前缀地址
const LOCATION = process.env.LOCATION || ''

//门户信息服务地址
const TPS_HOST = process.env.TPS_HOST || 'http://47.93.116.9:15025'
//用户业务数据服务地址
const CBS_HOST = process.env.CBS_HOST || 'http://47.93.116.9:15045'
//静态资源服务地址
const ASSETS_HOST = process.env.ASSETS_HOST || 'http://47.93.116.9:15020/Application'
//站点码
const WEBSITE_CODE = process.env.WEBSITE_CODE || 'WS20170415001'
//区域码
const AREA_CODE = process.env.AREA_CODE || '10100003'
//父母挑选前端限制数量
const PARENT_CHOOSE_LIMIT = process.env.PARENT_CHOOSE_LIMIT || 20
//最近观看前端显示数量限制
const USE_HISTORY_LIMIT = process.env.USE_HISTORY_LIMIT || 10

export const config = {
  url: HOST,
  port: PORT,
  location: LOCATION,
  parent_choose_limt: PARENT_CHOOSE_LIMIT,
  use_history_limit: USE_HISTORY_LIMIT,
  tpsHost: TPS_HOST,
  cbsHost: CBS_HOST,
  assets_host: ASSETS_HOST,
  areacode: AREA_CODE,
  websitecode: WEBSITE_CODE
}
