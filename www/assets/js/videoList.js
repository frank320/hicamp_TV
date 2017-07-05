/**
 * Created by frank on 2017/4/1.
 */
//注册键盘事件
document.onkeydown = grabEvent

//封装页面焦点控制的方法
// xIndex标记li的索引  yIndex标记ul索引 xMax表示当前yIndex中的li最大索引
var xIndex = parseInt(defaultX)
//焦点所在行
var yIndex = 0
var lis = $.select('li')
var xMax = lis.length - 1
var yMax = Math.ceil(lis.length / 6) - 1
//已翻页码的视频数量
var preCount = 0
if (page > 1) {
  preCount = (page - 1) * 24 - 12
}

//焦点标识变量  1表示焦点在视频列表上 0表示焦点在弹窗上
var flag = 1


//订购弹窗
var orderTip = $.select('#orderTip')
var btns = orderTip.children[1].children
var btnFocus = 0


//返回时 页面默认菜单焦点项
defaultFocus(xIndex, lis)
function defaultFocus(xIndex, lis) {
  var activeLi = lis[xIndex]
  //更新count
  $.select('#count').innerHTML = xIndex + 1 + preCount
  //显示视频图标
  activeLi.style.borderColor = '#f1f1f1'
  startScroll(activeLi)
}

function stopScroll(li) {
  var marquee = li.children[1].children[0]
  if (!marquee) {
    return
  }
  marquee.stop()
  marquee.style.display = 'none'
}
function startScroll(li) {
  var marquee = li.children[1].children[0]
  if (!marquee) {
    return
  }
  marquee.start()
  marquee.style.display = 'block'
}

//左右焦点控制
function xFocusControl(currentIndex, nextIndex, lis) {
  //当前元素失去焦点
  lis[currentIndex].style.borderColor = 'transparent'
  stopScroll(lis[currentIndex])
  //更新count
  $.select('#count').innerHTML = nextIndex + 1 + preCount
  //下一个元素获取焦点
  lis[nextIndex].style.borderColor = '#f1f1f1'
  startScroll(lis[nextIndex])
}

//上下焦点控制
function yFocusControl(nextIndex, lis) {
  //当前元素失去焦点
  lis[xIndex].style.borderColor = 'transparent'
  stopScroll(lis[xIndex])
  //下一行第一个元素获取焦点
  xIndex = nextIndex * 6
  lis[xIndex].style.borderColor = '#f1f1f1'
  startScroll(lis[xIndex])
  //显示count
  $.select('#count').innerHTML = xIndex + 1 + preCount
}

function errTip() {
  var tip = $.select('#msgTip')
  tip.children[0].innerText = '播放失败，请重试...'
  tip.style.display = 'block'
  setTimeout(function () {
    tip.style.display = 'none'
  }, 1000)
}

function showOrderTip() {
  flag = 0
  btns[0].style.borderColor = '#ffffff'
  btns[1].style.borderColor = 'transparent'
  btnFocus = 0
  orderTip.style.display = 'block'
}
function hideorderTip() {
  flag = 1
  orderTip.style.display = 'none'
}

//回车键 跳转
function enterControl() {

  //获取视频id(运营商媒资系统中的资源id)和名称
  var vid = lis[xIndex].getAttribute('datacode')
  var contentname = lis[xIndex].getAttribute('contentname')

  //返回时的地址
  var localUrl = window.location.href.replace(/defaultX=\d+/, 'defaultX=' + xIndex).replace(/page=\d+/, 'page=' + page)

  //进入播放页面
  $.setCookie('playBackUrl', localUrl)
  if (window.navigator.platform.indexOf('Win') != -1 || window.navigator.platform.indexOf('win') != -1) {
    //pc平台 正常播放
    //ffmpeg直播流播放
    return $.redirect(prefix + '/player?videoName=' + album_name + '.mp4')
    //流播放
    //return $.redirect(prefix + '/videoPlayer?poster=' + poster + '&videoName=' + album_name + '.mp4')
  } else {
    return $.redirect(prefix + '/videoPlayer?poster=' + poster + '&videoName=' + album_name + '.mp4')
  }
}


//按键事件
function grabEvent(event) {
  var keycode = event.which || event.keyCode
  switch (keycode) {
    case 48:
      //0键刷新页面 开发时使用
      window.location.reload()
      return 0
    case 38:
      //上键
      if (flag == 1) {
        //焦点当前所在行
        yIndex = Math.floor(xIndex / 6)
        if (yIndex == 0) {
          //翻页 上一页
          if (page == 1) {
            return
          } else {
            return $.redirect(window.location.pathname + '?defaultX=0&page=' + (page - 1))
          }
        }
        yFocusControl(--yIndex, lis)
      }
      return 0
    case 37:
      //左键
      if (flag == 1) {
        if (xIndex == 0) break
        xFocusControl(xIndex, --xIndex, lis)
      } else if (flag == 0) {
        btns[0].style.borderColor = '#ffffff'
        btns[1].style.borderColor = 'transparent'
        btnFocus = 0
      }

      return 0
    case 39:
      //右键
      if (flag == 1) {
        if (xIndex == xMax) break
        xFocusControl(xIndex, ++xIndex, lis)
      } else if (flag == 0) {
        btns[1].style.borderColor = '#ffffff'
        btns[0].style.borderColor = 'transparent'
        btnFocus = 1
      }

      return 0
    case 40:
      //下键
      if (flag == 1) {
        //焦点当前所在行
        yIndex = Math.floor(xIndex / 6)
        if (yIndex == yMax) {
          //翻页 下一页
          if (typeof maxPage === 'undefined') return
          if (page == maxPage) {
            return
          } else {
            return $.redirect(window.location.pathname + '?defaultX=0&page=' + (parseInt(page) + 1))
          }
        }
        yFocusControl(++yIndex, lis)
      }
      return 0
    case 49:
      //esc键返回主页菜单 开发时暂用键盘1键代替
      var backUrl = $.getCookie('backUrl')
      $.delCookie('backUrl')
      $.redirect(backUrl)
      return 0
    case 13:
      //回车键
      enterControl()
      return 0
    case 27:
    case 640:
      //页面返回
      if (flag == 1) {
        var backUrl = $.getCookie('backUrl')
        $.delCookie('backUrl')
        $.redirect(backUrl)
      }
      return 0
    case 8:
      //页面返回
      if (flag == 1) {
        var backUrl = $.getCookie('backUrl')
        $.delCookie('backUrl')
        $.redirect(backUrl)
      }
      return 0

    default:
      return 1
  }
  return 1
}
