/**
 * Created by frank on 2017/6/30.
 * ffmpeg推流播放视频
 */
import {Router} from 'express'
import {config} from '../config'
import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'

const router = Router()
router.prefix = config.location

//ffmpeg实时转码成直播流播放视频
router.get('/video/:videoName', (req, res)=> {
  res.contentType('flv')
  //const videoPath = 'C:\\Users\\wikeL\\Desktop\\HICAMP\\hicamp_tv_demo\\video\\' + req.params.videoName + '.ts'
  const videoPath = `/home/demo/video/${req.params.videoName}`
  ffmpeg(videoPath)
  // use the 'flashvideo' preset (located in /lib/presets/flashvideo.js)
  //  .preset('flashvideo')
    .format('flv')
    .flvmeta()
    .size('1280x?')
    .videoBitrate('512k')
    .videoCodec('libx264')
    .fps(25)
    .audioBitrate('96k')
    //.audioCodec('aac')
    //.audioFrequency(22050)
    //.audioChannels(2)
    //.outputOptions('-preset veryfast')
    //.outputOptions('-preset superfast','-c:a copy')
    .outputOptions('-preset ultrafast')
    // setup event handlers
    .on('end', function () {
      console.log('file has been converted succesfully');
    })
    .on('error', function (err) {
      console.log('an error happened: ' + err.message);
    })
    // save to stream
    .pipe(res, {end: true});

})

//直接以流的形式播放
router.get('/videoPlay/:videoName', (req, res)=> {
  const videoPath = `/home/demo/video/${req.params.videoName}`
  const stat = fs.statSync(videoPath)
  res.writeHead(200, {
    'Content-Type': 'video/mp4',
    'Content-Length': stat.size
  })
  const readableStream = fs.createReadStream(videoPath)
  readableStream.pipe(res)
})

export default router