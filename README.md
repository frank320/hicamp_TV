## 项目说明
```
 嗨学营 儿童电视 
 项目运行在天津盒子的中间件(深圳同洲)上
 使用nodejs作为中间层 渲染前端页面

```
## 环境
```
 nodejs >=4.x

```

## 开发
```
安装所有依赖
$ npm install
开发阶段 安装node-dev模块 便于实现热更新
$ npm install -g node-dev
启动应用:
开发环境
$ npm run dev
生产环境
$ npm run build

```
## 部署
```
安装node环境 4.x以上(建议6.x)
全局安装pm2模块
$ npm install -g pm2
在app.json文件中配置相关参数
启动应用
$ pm2 start app.json

```







