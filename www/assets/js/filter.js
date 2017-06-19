/**
 * Created by frank on 2017/3/13.
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


function contentcollect(contentcode, collecttype, cb) {
  $.ajax({
    url: cbsHost + '/user/contentcollect',
    data: {
      usercode: $.getCookie('usercode'),
      user_session: $.getCookie('user_session'),
      areacode: $.getCookie('areacode'),
      websitecode: $.getCookie('websitecode'),
      contentcode: contentcode,
      collecttype: collecttype
    },
    success: function (res) {
      if (res.retcode == 0) {
        //收藏成功
        cb()
      } else {
        console.log('collect err')
      }
    },
    fail: function () {
      window.location.reload()
    }
  })
}


//页面默认菜单焦点项
defaultFocus(xIndex, yIndex, uls)


function defaultFocus(xIndex, yIndex, uls) {
  var ul = uls[yIndex]
  var activeLi = ul.children[xIndex]
  $.css($.select('i', ul.parentNode)[0].parentNode, {
    visibility: 'visible'
  })
  //更新count
  $.select('i', ul.parentNode)[0].innerHTML = xIndex + 1
  activeLi.style.borderColor = '#60DAA2'

}


//默认栏目显示
for (var m = 0; m < uls.length; m++) {
  showColumns(m, 1, uls)
}
showColumns(yIndex, Math.ceil((xIndex + 1) / 4), uls)

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


//左右焦点控制
function xFocusControl(currentIndex, nextIndex, uls) {
  var ul = uls[yIndex]
  var lis = ul.children

  //当前元素失去焦点
  lis[currentIndex].style.borderColor = 'transparent'
  //左右挑选栏目
  if (nextIndex % 4 == 0 || (nextIndex + 1) % 4 == 0) {
    var showRowIndex = Math.ceil((nextIndex + 1) / 4)
    showColumns(yIndex, showRowIndex, uls)
  }

  //更新count
  $.select('i', ul.parentNode)[0].innerHTML = nextIndex + 1
  var activeLi = lis[nextIndex]
  activeLi.style.borderColor = '#60DAA2'

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
  showColumns(nextIndex, 1, uls)
  ul = uls[nextIndex]
  lis = ul.children
  //更新xMax xIndex
  xMax = lis.length - 1
  xIndex = 0

  //显示count
  $.css($.select('i', ul.parentNode)[0].parentNode, {
    visibility: 'visible'
  })
  $.select('i', ul.parentNode)[0].innerHTML = 1

  //显示视频图标
  var activeLi = lis[0]
  activeLi.style.borderColor = '#60DAA2'
}

//回车键 跳转
function enterControl() {
  //当前的处于焦点的li元素
  var li = uls[yIndex].children[xIndex]
  //获取li中的contentcode
  var contentcode = li.getAttribute('contentcode')
  //判断需要收藏或者取消
  var collecttype = li.getAttribute('collecttype')

  contentcollect(contentcode, collecttype, function () {
    var reloadUrl = window.location.href
    if (!/&defaultX=\d+/.test(reloadUrl)) {
      reloadUrl += '&defaultX=' + xIndex + '&defaultY=' + yIndex
    } else {
      reloadUrl = reloadUrl.replace(/&defaultX=\d+/, '&defaultX=' + xIndex)
      reloadUrl = reloadUrl.replace(/&defaultY=\d+/, '&defaultY=' + yIndex)
    }
    window.location.replace(reloadUrl)
  })

}


//按键事件函数
function grabEvent(event) {
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
      if (xIndex == 0) break
      xFocusControl(xIndex, --xIndex, uls)
      return 0
    case 39:
      //右键
      event.preventDefault()
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
      $.redirect(prefix + '/main?' + 'page=0&menuIndex=' + menuIndex)
      return 0
    case 13:
      //回车键 页面跳转
      event.preventDefault()
      enterControl()
      return 0
    case 640:
      event.preventDefault()
      //页面返回
      $.redirect(prefix + '/main?' + 'page=0&menuIndex=' + menuIndex)
      return 0
     case 8:
      event.preventDefault()
      //页面返回
      $.redirect(prefix + '/main?' + 'page=0&menuIndex=' + menuIndex)
      return 0
    default:
      return 1
  }
  return 1
}









