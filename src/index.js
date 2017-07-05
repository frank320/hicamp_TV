/**
 * Created by frank on 2016/9/20.
 * 业务入口
 */

import path from 'path'
import glob from 'glob'
import express from 'express'
import template from 'art-template'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import {config} from './config'

const app = express()

// 模板引擎配置
app.engine('.html', template.__express)
app.set('view engine', 'html')
app.set('views', __dirname + '/views')

// 静态资源加载配置
if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  app.use(config.location, express.static(path.join(__dirname, '../public')))
} else {
  app.use(config.location, express.static(path.join(__dirname, '../www')))
}
//海报静态资源服务
app.use(config.location + '/static', express.static(path.join(__dirname, '../resource')))

//静态视频资源服务
app.use(config.location + '/staticVideo', express.static(path.join(__dirname, '../../video')))

//载入处理请求体的中间件
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//处理cookie的中间件
app.use(cookieParser())

// 自动载入所有控制器
glob.sync('./controllers/**/*.js', {cwd: __dirname}).forEach(item => {
  // const controller = require(item) // require的方式载入es6方式导出的成员会有问题
  // import controller from item 报错
  const controller = require(item).default
  app.use(controller.prefix, controller)
})

//监听端口
const server = app.listen(config.port, error => {
  if (error) throw error
  app.set('url', `${config.url}:${config.port}`)
  console.log(`server is ready at ${config.url}:${config.port}   the runtime is ${process.env.NODE_ENV}`)
})



