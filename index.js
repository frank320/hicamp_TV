/**
 * Created by frank on 2016/9/20.
 * 应用入口
 */
if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
  require('./dist')
} else {
  // 加载babel插件 运行时转码es6
  require('babel-register')
//开发阶段应用入口
  require('./src')
}
