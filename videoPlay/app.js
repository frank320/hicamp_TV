/**
 * Created by Frank on 2017/7/1.
 * mp4 视频点播
 */
const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname, './front')))

app.get('/videoPlay/:videoName', (req, res)=> {
  //const videoPath = path.join(__dirname, req.params.videoName)
  const videoPath = `/home/demo/video/${req.params.videoName}`
  const stat = fs.statSync(videoPath)
  res.writeHead(200, {
    'Content-Type': 'video/mp4',
    'Content-Length': stat.size
  })
  const readableStream = fs.createReadStream(videoPath)
  readableStream.pipe(res)
})


app.listen(3000, ()=> {
  console.log('server is running at prot 3000')
})