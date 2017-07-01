/**
 * Created by frank on 2016/10/20.
 * 播放页面推荐视频
 */
/**
 * Created by frank on 2016/10/20.
 * 播放页面
 */
import {Router} from 'express'
import {config} from '../config'

const router = Router()
router.prefix = config.location

//flowplayer page
router.get('/player', (req, res)=> {
  const videoUrl = `${config.location}/video/${req.query.videoName}`
  res.render('player', {location: config.location, videoUrl: videoUrl})

})

//h5 tag video  page
router.get('/videoPlayer', (req, res)=> {
  const videoUrl = `${config.location}/videoPlay/${req.query.videoName}`
  res.render('video', {location: config.location, videoUrl: videoUrl})
})

export default router
