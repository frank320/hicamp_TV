/**
 * Created by frank on 2016/6/1.
 * 天津广电 同洲机顶盒中间件播放器接口
 * mp对应的操作(非获取)方法  成功时返回0 失败返回其他
 */
//var FORWARD_KEY = 39;
//var REWIND_KEY = 37;
//var FAST_FORWARD_KEY = 120;
//var FAST_REWIND_KEY = 121;
//var PAUSE_KEY = 3864;
//var ENTER_KEY = 13;
//var RETURN_KEY = 640;//);8;//
//var PLAY_KEY = 3862;
//var QUIT_KEY = 114;
//var KEY_PAGEUP = 49;
//var KEY_PAGEDOWN = 50;
//var YELLOW_KEY = 97;//113;
//var GREEN_KEY = 99;//114;
//var BLUE_KEY=98
//var KEY_LX=642;
//var STOP_KEY = 3863;
//var KEY_VOICEUP = 448;
//var KEY_VOICEDOWN = 447;
//var KEY_POSITION = 3880;
//var KEY_TRACK = 407;
//var KEY_STATIC = 449;
//var KEY_HOMEPAGE =  113;//( ||)3856;//
//var KEY_INFORMATION =  457;
//var KEY_LANGUAGE =  35;
//var KEY_SCREENDISPLAY = 42;
//var KEY_UP=38;
//var KEY_DOWN=40;

try {
  Utility.setDrawFocusRing(0)
} catch (e) {
  console.log('Utility not to be supported')
}
;(function (w) {
  //初始化一个全局变量 记录播放器实例
  var mp = null
  //设置播放窗口属性 默认全屏
  //mp.videoDisplayMode(1)
  //mp.videoDisplayArea()
  //mp.refreshVideoDisplay()

  var video = {}
  //播放
  video.play = function (mediaStr) {
    // mediaStr播放rtsp串
    mp = new MediaPlayer()
    if (Utility.getEnv('playerInstanceId') == '') {
      //播放器实例标识
      var nativePlayerInstanceId = mp.getNativePlayerInstanceId()
      Utility.setEnv('playerInstanceId', nativePlayerInstanceId)
    }
    //绑定播放器实例
    mp.bindNativePlayerInstance(Utility.getEnv('playerInstanceId'))
    //播放
    mp.setSingleMedia(mediaStr)
    return mp.playFromStart()
  }
  //快进
  video.fastForward = function (speed) {
    //seconds float 2-32
    speed = speed || 5
    return mp.fastForward(speed)
  }
  //快退
  video.fastRewind = function (speed) {
    //seconds float -2 - -32
    speed = speed || -5
    return mp.fastRewind(speed)
  }
  //暂停
  video.pause = function () {
    return mp.pause()
  }
  //从当前媒体的暂停/快进/快退状态恢复正常播放
  video.resume = function () {
    return mp.resume()
  }
  //停止正在播放的媒体，并释放机顶盒本地播放器的相关资源
  video.stop = function () {
    return mp.stop()
  }
  //设置静音
  video.setMute = function (muteFlag) {
    //muteFlag 0 有声  1 静音
    return mp.setMuteFlag(muteFlag)
  }
  //设置系统音量
  video.setVolume = function (volume) {
    //volume 0-100
    return mp.setVolume(volume)
  }
  //释放当前的播放器
  video.releaseMediaPlayer = function () {
    //重置为空字符串
    Utility.setEnv('playerInstanceId', '')
    return mp.releaseMediaPlayer(Utility.getEnv('playerInstanceId'))
  }

  w.video = video
})(window)

//播放逻辑
//播放器播放状态   默认设为2
//  0：STOP，停止状态。
//  1：PAUSE，暂停状态。
//  2：NORMAL_PLAY，正常播放状态。
//  3：TRICK_MODE，快进、快退、慢进、慢退的状态
function enterControl() {
  playMode == 1 ? video.resume() : video.pause()
}

//注册键盘事件
document.onkeypress = grabPressEvent
document.onkeydown = grabDownEvent

var playMode = null
var mediaStr = $.getCookie('rtspUrl')
video.play(mediaStr)

function grabPressEvent(event) {
  var keycode = event.which || event.keyCode
  switch (keycode) {
    case 768:
      //媒体状态键盘事件
      var mediaEvent = Utility.getEvent()
      var meiaEventObj = eval('(' + mediaEvent + ')')
      var mediaType = meiaEventObj.type
      switch (mediaType) {
        case 'EVENT_MEDIA_END':
          //媒体播放到末端

          break
        case 'EVENT_MEDIA_BEGINING':
          //媒体播放到起始端

          break
        case 'EVENT_MEDIA_ERROR':
          //媒体播放器发生异常
          alert('media error')
          break
        case 'EVENT_PLAYMODE_CHANGE':
          //媒体播放器的playback mode 发生改变
          playMode = meiaEventObj.new_play_mode
          break
        default:
          break
      }
      return 0

    default:
      return 1
  }
  return 1
}

function grabDownEvent(event) {
  var keycode = event.which || event.keyCode
  switch (keycode) {
    case 48:
      //0键刷新页面 开发时使用
      window.location.reload()
      return 0
    case 38:
      //上键
      return 0
    case 37:
      //左键
      return 0
    case 39:
      //右键
      return 0
    case 40:
      //下键
      return 0
    case 49:
      //esc键返回主页菜单 开发时暂用键盘1键代替
      var backUrl = $.getCookie('videoListUrl')
      $.delCookie('videoListUrl')
      $.redirect(backUrl)
      return 0
    case 13:
      //回车键 播放视频
      enterControl()
      return 0
    case 640:
      //页面返回
      video.stop()
      video.releaseMediaPlayer()
      //esc键返回主页菜单 开发时暂用键盘1键代替
      var backUrl = $.getCookie('videoListUrl')
      $.delCookie('videoListUrl')
      $.delCookie('rtspUrl')
      $.redirect(backUrl)
      return 0
    default:
      return 1
  }
  return 1
}

//var event = Utility.getEvent() 媒体事件对象 可在onkeydown onkeypress中使用
//alert(typeof eval('(' + event + ')'))