/**
 * Created by frank on 2017/6/30.
 * ffmpeg推流播放视频
 */
import {Router} from 'express'
import {config} from '../config'
import ffmpeg from 'fluent-ffmpeg'

const router = Router()
router.prefix = config.location

router.get('/video/:videoName', (req, res)=> {
  res.contentType('flv')
  //const videoPath = 'C:\\Users\\wikeL\\Desktop\\HICAMP\\hicamp_tv_demo\\video\\' + req.params.videoName + '.ts'
  const videoPath = `/home/demo/video/${req.params.videoName}.ts`
  ffmpeg(videoPath)
  // use the 'flashvideo' preset (located in /lib/presets/flashvideo.js)
  //  .preset('flashvideo')
    .format('flv')
    .flvmeta()
    .size('1280x?')
    .videoBitrate('512k')
    .videoCodec('libx264')
    .fps(24)
    .audioBitrate('96k')
    //.audioCodec('aac')
    //.audioFrequency(22050)
    //.audioChannels(2)
    .outputOptions('-preset veryfast')
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

export default router