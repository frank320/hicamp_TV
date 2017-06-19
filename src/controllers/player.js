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

router.get('/player', (req, res)=> {

  res.render('player', {location: config.location})

})

export default router
