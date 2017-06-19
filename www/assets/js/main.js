/**
 * Created by frank on 2016/9/21.
 */

  //注册键盘事件
document.onkeydown = grabEvent

//封装页面焦点控制的方法
// xIndex标记li的索引  yIndex标记ul索引 xMax表示当前yIndex中的li最大索引
var xIndex = parseInt(defaultX)
var yIndex = parseInt(defaultY)
var uls = $.select('ul')
var xMax = uls[yIndex].children.length - 1
var yMax = uls.length - 1

//返回时 主页默认菜单焦点项
if (yIndex == 0) {
  xIndex = menuIndex - 1
  yIndex = 0
}
if (yIndex == 2 && !uls[2].children[xIndex]) xIndex = 0//显示为最近播放的第一个
defaultFocus(xIndex, yIndex, uls)
function defaultFocus(xIndex, yIndex, uls) {
  var ul = uls[yIndex]
  var activeLi = ul.children[xIndex]
  if (yIndex == 0) {//菜单焦点
    activeLi.style.borderColor = '#f1f1f1'
  } else if (yIndex == 1) {  //小伙伴获取焦点
    activeLi.style.borderBottomColor = '#f1f1f1'
  } else {
    activeLi.style.borderColor = '#FF57A7'
  }
  $.css($.select('i', ul.parentNode)[0].parentNode, {
    visibility: 'visible'
  })
  //更新count
  $.select('i', ul.parentNode)[0].innerHTML = xIndex + 1
  //显示视频图标
  if (yIndex == 2) {
    $.showVideoIcon(xIndex, activeLi)
  } else {
    $.hideVideoIcon()
  }
}

//默认栏目显示
if (yIndex == 2) {
  showColumns(2, Math.ceil((xIndex + 1) / 4), uls)
  showFellows(1, uls)
} else {
  if (uls[2]) showColumns(2, 1, uls)
  if (uls[1]) {
    showFellows(1, uls)
    if (yIndex == 1) showFellows(Math.ceil((xIndex + 1) / 8), uls)
  }
}
function showColumns(yIndex, showRowIndex, uls) {
  var ul = uls[yIndex]
  var lis = ul.children
  var rows = Math.ceil(lis.length / 4)
  var len = lis.length
  //隐藏所有条目
  for (var i = 0; i < len; i++) {
    lis[i].style.display = 'none'
    lis[i].style.visibility = 'hidden'
  }
  //显示的条目
  var start = (showRowIndex - 1) * 4
  var end = showRowIndex == rows ? len : showRowIndex * 4
  for (var j = start; j < end; j++) {
    lis[j].style.visibility = 'visible'
    lis[j].style.display = 'block'
  }
}

function showFellows(showRowIndex, uls) {
  var ul = uls[1]
  var lis = ul.children
  var rows = Math.ceil(lis.length / 8)
  var len = lis.length
  //隐藏所有条目
  for (var i = 0; i < len; i++) {
    lis[i].style.display = 'none'
    lis[i].style.visibility = 'hidden'
  }
  //显示的条目
  var start = (showRowIndex - 1) * 8
  var end = showRowIndex == rows ? len : showRowIndex * 8
  for (var j = start; j < end; j++) {
    lis[j].style.visibility = 'visible'
    lis[j].style.display = 'block'
  }
}


//翻页提示箭头
if (page < maxPage) {
  var downArrow = document.getElementById('downArrow')
  downArrow.style.display = 'block'
}


//左右焦点控制
function xFocusControl(currentIndex, nextIndex, uls) {
  var ul = uls[yIndex]
  var lis = ul.children

  //下一个元素获取焦点
  if (yIndex == 0) {//菜单焦点
    lis[nextIndex].style.borderColor = '#f1f1f1'
  } else if (yIndex == 1) {  //小伙伴获取焦点
    lis[nextIndex].style.borderBottomColor = '#f1f1f1'
  } else {
    lis[nextIndex].style.borderColor = '#FF57A7'
  }

  //当前元素失去焦点
  lis[currentIndex].style.borderColor = 'transparent'


  //左右挑选栏目
  if (yIndex == 2) {
    if (nextIndex % 4 == 0 || (nextIndex + 1) % 4 == 0) {
      var showRowIndex = Math.ceil((nextIndex + 1) / 4)
      showColumns(yIndex, showRowIndex, uls)
    }
  }

  //我的小伙伴
  if (yIndex == 1) {
    if (nextIndex % 8 == 0 || (nextIndex + 1) % 8 == 0) {
      var showRowIndex = Math.ceil((nextIndex + 1) / 8)
      showFellows(showRowIndex, uls)
    }
  }


  //更新count
  $.select('i', ul.parentNode)[0].innerHTML = nextIndex + 1

  //显示视频图标
  if (yIndex == 2) {
    $.showVideoIcon(nextIndex, lis[nextIndex])
  } else {
    $.hideVideoIcon()
  }
}

//上下焦点控制
function yFocusControl(currentIndex, nextIndex, uls) {
  //焦点控制 当前元素失去焦点
  var ul = uls[currentIndex]
  var lis = ul.children
  //当前元素失去焦点
  lis[xIndex].style.borderColor = 'transparent'
  $.css($.select('i', ul.parentNode)[0].parentNode, {
    visibility: 'hidden'
  })
  //下一个ul中第一个元素获取焦点
  if (nextIndex == 2) {
    showColumns(2, 1, uls)
  } else if (nextIndex == 1) {
    showFellows(1, uls)
    $.hideVideoIcon()
  } else {
    $.hideVideoIcon()
  }
  ul = uls[nextIndex]
  lis = ul.children

  //更新xMax xIndex
  xMax = lis.length - 1
  xIndex = 0
  //下一个元素获取焦点
  if (yIndex == 0) {//菜单焦点
    lis[0].style.borderColor = '#f1f1f1'
  } else if (yIndex == 1) {  //小伙伴获取焦点
    lis[0].style.borderBottomColor = '#f1f1f1'
  } else {
    lis[0].style.borderColor = '#FF57A7'
  }

  //显示count
  $.css($.select('i', ul.parentNode)[0].parentNode, {
    visibility: 'visible'
  })
  $.select('i', ul.parentNode)[0].innerHTML = 1

  //第一个显示视频图标
  if (yIndex == 2) {
    $.showVideoIcon(0, lis[0])
  } else {
    $.hideVideoIcon()
  }

}

//回车键 跳转
function enterControl() {
  //处理弹窗
  var tip = document.getElementById('tip')
  if (tip && tip.style.display == 'block' && tipFlag == 0) {
    return hideTip(tip)
  }
  if (tip && tip.style.display == 'block' && tipFlag == 1) {
    return $.exit()
  }
  //当前的处于焦点的li元素
  var li = uls[yIndex].children[xIndex]

  //进入个人信息页面
  if (yIndex == 1 && xIndex == 0) {
    //保存当前地址
    $.setCookie('payReturnUrl', window.location.href)
    return $.redirect(prefix + '/vip')
  }
  //跳转页面
  if (yIndex == 0) {
    //切换菜单页面
    var url = li.getAttribute('targetUrl')
    return $.redirect(url)
  } else {
    var contentcode = li.getAttribute('contentcode')
    var isalbum = li.getAttribute('isalbum')
    //存储当前页面的地址
    var backUrl = window.location.href
    if (!/&defaultX=\d+/.test(backUrl)) {
      backUrl += '&defaultX=' + xIndex + '&defaultY=' + yIndex
    } else {
      backUrl = backUrl.replace(/&defaultX=\d+/, '&defaultX=' + xIndex)
      backUrl = backUrl.replace(/&defaultY=\d+/, '&defaultY=' + yIndex)
    }
    $.setCookie('backUrl', backUrl)
    //进入视频列表页面
    $.redirect(prefix + '/videoList/' + contentcode + '?page=1&defaultX=0')
  }
}

//处理弹窗相关函数
var tipFlag = 0

function showTip(tip) {
  $.css(tip, {
    'transform': 'scale(1)',
    'display': 'block',
    'visibility': 'visible',
    'zIndex': 8
  })
}

function hideTip(tip) {
  $.css(tip, {
    'display': 'none',
    'visibility': 'hidden'
  })
}

//按键事件函数
function grabEvent(event) {
  var tip = document.getElementById('tip')
  var keycode = event.which;
  switch (keycode) {
    case 48:
      //0键刷新页面 开发时使用
      window.location.reload();
      return 0
    case 38:
      //上键
      event.preventDefault()
      if (yIndex == 0) {
        if (typeof page === 'undefined') return
        //翻页 上一页
        if (page == 0) {
          return
        } else {

          return $.redirect(window.location.pathname + '?menuIndex=' + menuIndex + '&page=' + (page - 1))
        }
      }
      yFocusControl(yIndex, --yIndex, uls)
      return 0
    case 37:
      //左键
      event.preventDefault()
      if (tip && tip.style.display == 'block' && tipFlag == 1) {
        tip.children[1].children[1].style.borderColor = 'transparent'
        tip.children[1].children[0].style.borderColor = '#fff'
        return tipFlag = 0
      }
      if (tip && tip.style.display == 'block') {
        return
      }
      if (xIndex == 0) break
      xFocusControl(xIndex, --xIndex, uls)
      return 0
    case 39:
      //右键
      event.preventDefault()
      if (tip && tip.style.display == 'block' && tipFlag == 0) {
        tip.children[1].children[0].style.borderColor = 'transparent'
        tip.children[1].children[1].style.borderColor = '#fff'
        return tipFlag = 1
      }
      if (tip && tip.style.display == 'block') {
        return
      }
      if (xIndex == xMax) break
      xFocusControl(xIndex, ++xIndex, uls)
      return 0
    case 40:
      //下键
      event.preventDefault()
      if (yIndex == yMax) {
        //翻页 下一页
        if (typeof maxPage === 'undefined') return
        if (page == maxPage) {
          return
        } else {
          return $.redirect(window.location.pathname + '?menuIndex=' + menuIndex + '&page=' + (parseInt(page) + 1))
        }
      }
      yFocusControl(yIndex, ++yIndex, uls)
      return 0
    case 49:
      //esc键返回主页菜单 开发时暂用键盘1键代替
      event.preventDefault()
      return showTip(tip)
      break
    case 13:
      //回车键 页面跳转
      event.preventDefault()
      enterControl()
      return 0
      break
    case 640:
      //退出应用
      showTip(tip)
      return 0
    case 8:
      //退出应用
      showTip(tip)
      return 0

    case 27:
      //退出应用
      showTip(tip)
      return 0
    default:
      return 1
  }
  return 1
}




