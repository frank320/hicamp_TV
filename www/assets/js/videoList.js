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

  //是否去订购
  if (flag == 0 && btnFocus == 1) {
    //去订购页面
    $.setCookie('payReturnUrl', localUrl)
    return $.redirect(prefix + '/vip')
  } else if (flag == 0 && btnFocus == 0) {
    //取消去订购页面
    return hideorderTip()
  }

  //获取VOD点播串 cb函数参数说明 -1获取失败  其他 rtsp点播串
  function getRtspUrl(paramObj, cb) {
    var url = 'http://43.247.148.246:8080/playurl/getOnDemandUrl.do'
    $.ajax({
      url: url,
      data: paramObj,
      success: function (res) {
        if (res.returnCode == 0) {
          cb(res.rtspUrl)
        } else {
          cb(-1)
        }
      },
      fail: function () {
        cb(-1)
      }
    })
  }

  //获取rtsp点播串 测试
  var tryFlag = 1
  var paramObj = {
    areaCode: $.getAreaCode(),
    //assetID: vid + '002',
    assetID: 'JYCM201705090000004Y',
    providerID: 'JYCM',
    userCode: $.getUserId(),
    tryFlag: tryFlag,//1 试看   0订购使用,
    //goodsCode: '',//已购买使用的商品编码 当 trayFlag=0或者未填写 必填
    columnId: album_name//栏目ID 可做统计使用
  }
  getRtspUrl(paramObj, function (res) {
    if (res == -1) {
      return errTip()
    } else {
      var rtsp = res
      //测试播放器
      $.setCookie('rtspUrl', rtsp)
      $.setCookie('videoListUrl', localUrl)
      window.location.replace(prefix + '/player')
      //完整播放器
      //function setGlobalVar(sName, sValue) {
      //  try {
      //    Utility.setEnv(sName, sValue);
      //  } catch (e) {
      //    $.setCookie(sName, sValue)
      //  }
      //}
      //
      ////获取到RTSP串成功之后，需要设置4个全局变量，供播放器使用
      //setGlobalVar("vod_play_type", tryFlag);//0正常点播  1试看
      //setGlobalVar("vod_ctrl_rtsp", rtsp);//将RTSP串设置为全局变量
      //setGlobalVar("displayName", contentname);//将片名设置为全局变量
      //setGlobalVar("vod_ctrl_backurl", localUrl);//将点播完成之后，需要返回的页面地址设为全局变量
      //window.location.replace(prefix + '/assets/vodPlayer/vodplay.html');//播放器地址URL
    }
  })

  //产品订购签权 可在用户第一次进入应用时调用并记录签权结果
  //测试用产品包
  //var productcode = 'product01'
  //pay.productauth(productcode, function (res) {
  //  if (res == -1) {
  //    //操作失败
  //    errTip()
  //  } else {
  //    if (res && res.productorderno) {
  //      var expiredtime = $.formatTime(res.expiredtime)
  //      if (expiredtime > +new Date()) {//订购产品在有效期内
  //        //播放
  //        playVideo(vid)
  //      }
  //    } else {
  //      //未订购或到期
  //      showOrderTip()
  //    }
  //  }
  //})

  //var isVip = $.getCookie('isVip')
  //if (isVip == 1) {
  //  //是会员 直接播放视频
  //} else if (isVip == 0) {
  //  //非会员或者会员到期
  //  showOrderTip()
  //} else {
  //  //查询失败  重新查询一次啊
  //}


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
