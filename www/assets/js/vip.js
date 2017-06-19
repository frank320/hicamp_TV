/**
 * Created by frank on 2016/11/17.
 */

  //注册键盘事件
document.onkeydown = grabEvent

var btns = $.select('#btns').children
var tip = $.select('#tip')
var lock = $.select('#childLock')
var payTip = $.select('#payTip')
var orders = $.select('#orders').children
var tipBtns = tip.children[1].children

var focusBtnIndex = 0
var btnsNum = btns.length

var focusOrderIndex = 0
var ordersNum = orders.length

var flag = 1// 0代表焦点在按钮上 1代表焦点在产品包上  2代表焦点在弹窗上 3代表焦点在童锁弹窗 4代表焦点在支付结果弹窗上

//童锁结果变量声明
var rightNum = ''
var inputNum = ''
//光标定时器变量
var timer = null

//订购记录查询
pay.queryOrderList(function (res) {
  if (res == -1) {
    $.select('#vipState').innerHTML = '会员信息: 会员信息查询失败'
  } else {
    if (res && res.length == 0) {
      $.select('#vipState').innerHTML = '会员信息: 未订购该产品包'
    } else if (res && res.length > 0) {
      var expiredTime = res[0].expiredtime
      var formatTime = $.formatTime(expiredTime)
      if (formatTime < +new Date()) {
        //会员已到期
        $.select('#vipState').innerHTML = '会员信息: 会员已到期, 请重新订购'
      } else {
        $.select('#vipState').innerHTML = '会员信息: 会员有效期至  ' + expiredTime
      }
    }

  }
})

function orderSelect(selectIndex) {
  orders[selectIndex].style.borderColor = '#FF9849'
}
function focusControl(doms, current, next) {
  if (doms == orders) {
    doms[current].style.borderColor = 'transparent'
    doms[next].style.borderColor = '#FF9849'
  } else {
    doms[current].style.borderColor = 'transparent'
    doms[next].style.borderColor = '#fff'
  }

}

function showConfirmTip() {
  flag = 2
  tip.children[0].innerHTML = '确认订购【' + orders[focusOrderIndex].children[0].innerText + '】?'
  tip.style.display = 'block'
}
function hideTip() {
  flag = 0
  focusBtnIndex = 0
  tip.style.display = 'none'
}
function goBack() {
  $.redirect($.getCookie('payReturnUrl'))
}
function randomNum() {
  return Math.ceil(Math.random() * 6)//1-6随机数
}
function childLockTip() {
  flag = 3
  //生成随机数
  var num1 = randomNum() + 10
  var num2 = randomNum()
  rightNum = num1 * num2
  //初始化
  lock.children[1].children[0].innerHTML = num1 + ' X ' + num2 + ' = '
  lock.children[1].children[1].innerHTML = ''
  inputNum = ''
  lock.style.display = 'block'
  //显示输入光标
  inputCursor()
}
function hideLockTip() {
  flag = 2
  lock.style.display = 'none'
}
function startPay() {
  hideLockTip()
  flag = 4
  payTip.style.display = 'block'
  var producecode = orders[focusOrderIndex].getAttribute('productno')
  var payReturnUrl = $.getCookie('payReturnUrl')
  pay.createOrder(producecode, payReturnUrl, function (orderno) {
      if (orderno == -1) {
        payTip.children[0].innerHTML = '订购失败,请重试...'
        setTimeout(function () {
          flag = 2
          payTip.style.display = 'none'
        }, 1000)
      } else {
        //订单状态查询
        var timer = null
        var checkCount = 30 //默认设置30秒内或者查询30次
        timer = setInterval(function () {
          pay.queryorderstatus(orderno, function (code, res) {
            if (code == 0) {
              clearInterval(timer)
              payTip.children[0].innerHTML = '订购成功,跳转到...'
              setTimeout(function () {
                $.redirect(payReturnUrl)
              }, 1000)
            } else if (code == 2) {
              //支付中
              var paymode = res.data.orderpay.paymode
              if (paymode == 1) {
                //web网页支付
                clearInterval(timer)
                var data = eval('(' + res.data.orderpay.paydata + ')')
                window.location.replace(data.url)
              }
            } else if (code == 4 || code == 9 || code == 3) {
              clearInterval(timer)
              payTip.children[0].innerHTML = '订购失败,请重试...'
              setTimeout(function () {
                flag = 2
                payTip.style.display = 'none'
              }, 1000)
            } else {
              checkCount--
              if (checkCount == 0) {
                clearInterval(timer)
                payTip.children[0].innerHTML = '订购失败,请重试...'
                setTimeout(function () {
                  flag = 2
                  payTip.style.display = 'none'
                }, 1000)
              }
            }
          })
        }, 1000)

      }
    }
  )


}
function verifyLock(num) {
  if (flag == 3) {
    //显示输入
    inputNum += num
    var inputText = inputNum.substr(-2)
    lock.children[1].children[1].innerHTML = inputText
    if (parseInt(inputText) == rightNum) {
      clearInterval(timer)
      //开始支付
      startPay()
    }
  }
}
function inputCursor() {
  var cursor = lock.children[1].children[2]
  timer = setInterval(function () {
    cursor.style.visibility === 'visible' ? cursor.style.visibility = 'hidden' : cursor.style.visibility = 'visible'
  }, 500)
}
function enterControl() {
  //按钮交互
  if (flag == 0) {
    if (focusBtnIndex == 1) {
      //取消  返回原页面
      goBack()
    } else {
      //订购确认弹窗
      showConfirmTip()
    }
  } else if (flag == 2) {
    if (focusBtnIndex == 0) {
      //取消
      hideTip()
    } else {
      //确认订购 显示童锁 若不需要童锁 则直接下单支付starPay()
      childLockTip()
    }
  }
}

orderSelect(focusOrderIndex)

//按键事件函数
function grabEvent(event) {
  var keycode = event.which
  switch (keycode) {
    case 37:
      //左键
      event.preventDefault()
      if (flag == 1) {
        if (focusOrderIndex == 0) return
        focusControl(orders, focusOrderIndex, --focusOrderIndex)
      } else if (flag == 0) {
        if (focusBtnIndex == 0) return
        focusControl(btns, focusBtnIndex, --focusBtnIndex)
      } else if (flag == 2) {
        if (focusBtnIndex == 0) return
        focusControl(tipBtns, focusBtnIndex, --focusBtnIndex)
      } else if (flag == 3) {
        //清空童锁 输入内容
        inputNum = ''
        lock.children[1].children[1].innerHTML = ''
      }
      return 0
    case 38:
      //上键
      event.preventDefault()
      if (flag == 1) {
        return
      } else if (flag == 0) {
        flag = 1
        for (var i = 0; i < btnsNum; i++) {
          btns[i].style.borderColor = 'transparent'
        }
        orderSelect(focusOrderIndex)
      }
      return 0
    case 39:
      //右键
      event.preventDefault()
      if (flag == 1) {
        if (focusOrderIndex == ordersNum - 1) return
        focusControl(orders, focusOrderIndex, ++focusOrderIndex)
      } else if (flag == 0) {
        if (focusBtnIndex == btnsNum - 1) return
        focusControl(btns, focusBtnIndex, ++focusBtnIndex)
      } else if (flag == 2) {
        if (focusBtnIndex == btnsNum - 1) return
        focusControl(tipBtns, focusBtnIndex, ++focusBtnIndex)
      }
      return 0
    case 40:
      //下键
      event.preventDefault()
      if (flag == 1) {
        flag = 0
        focusBtnIndex = 0
        btns[focusBtnIndex].style.borderColor = '#fff'
      } else if (flag == 0) {
        return
      }
      return 0
    case 13:
      //enter键
      event.preventDefault()
      enterControl()
      return 0
    case 640:
      //返回键
      if (flag == 2) {
        hideTip()
      } else if (flag == 3) {
        hideLockTip()
      } else {
        goBack()
      }
      return 0
    case 8:
      //返回键
      if (flag == 2) {
        hideTip()
      } else if (flag == 3) {
        hideLockTip()
      } else {
        goBack()
      }
      return 0

    case 48:
      //0键
      event.preventDefault()
      //window.location.reload()
      verifyLock(0)
      return 0
    case 49:
      //数字1键
      verifyLock(1)
      return 0
    case 50:
      //数字2键
      verifyLock(2)
      return 0
    case 51:
      //数字3键
      verifyLock(3)
      return 0
    case 52:
      //数字4键
      verifyLock(4)
      return 0
    case 53:
      //数字5键
      verifyLock(5)
      return 0
    case 54:
      //数字6键
      verifyLock(6)
      return 0
    case 55:
      //数字7键
      verifyLock(7)
      return 0
    case 56:
      //数字8键
      verifyLock(8)
      return 0
    case 57:
      //数字9键
      verifyLock(9)
      return 0
    default:
      return 1
  }
  return 1
}

