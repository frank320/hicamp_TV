/**
 * Created by frank on 2017/5/22.
 * 支付相关接口
 */
//谢银鼎:
//  统一支付页面路径：(青岛有线)
//http://10.241.254.16/QD_Payment/dycp/swyw/swyw_Done.htm?productno=
//  调用统一支付路径之前，
//需要先保存退出统一支付页面后的打开地址。
//iPanel.setGlobalVar("wgPay_backUrll", returnUrl)

;(function (window, $) {
  //下单接口
  //cb回调参数说明  -1操作失败 string 操作成功 返回订单号
  var createOrder = function (productcode, backUrl, cb) {
    $.ajax({
      url: cbsHost + '/product/createorder',
      data: {
        usercode: $.getCookie('usercode'),
        user_session: $.getCookie('user_session'),
        productcode: productcode,
        backUrl: escape(backUrl)
      },
      success: function (res) {
        if (res.retcode == 0) {
          //成功 返回订单号 进行下一步
          cb(res.data.productorderno)
        } else {
          cb(-1)
        }
      },
      fail: function () {
        cb(-1)
      }
    })
  }
  //订单状态查询
  //cb回调参数说明  -1操作失败 0支付成功 1 待支付 2支付中 3取消 4超时 9失败
  var queryorderstatus = function (productorderno, cb) {
    $.ajax({
      url: cbsHost + '/product/queryorderstatus',
      data: {
        usercode: $.getCookie('usercode'),
        user_session: $.getCookie('user_session'),
        productorderno: productorderno
      },
      success: function (res) {
        if (res.retcode == 0) {
          //操作成功
          var orderstatus = res.data.orderstatus
          switch (orderstatus) {
            case 0:
              //支付成功
              cb(0)
              break
            case 1:
              cb(1)
              break
            case 2:
              cb(2, res)
              break
            case 3:
              cb(3)
              break
            case 4:
              cb(4)
              break
            case 9:
              cb(9)
              break
            default:
              break
          }
        } else {
          cb(-1)
        }
      },
      fail: function () {
        cb(-1)
      }
    })
  }
  //产品签权 判断用户是否订购该产品 及订购的有效期
  //cb回调参数说明 -1操作失败    object(订购信息) 成功
  var productauth = function (productcode, cb) {
    $.ajax({
      url: cbsHost + '/product/productauth',
      data: {
        usercode: $.getCookie('usercode'),
        user_session: $.getCookie('user_session'),
        productcode: productcode
      },
      success: function (res) {
        if (res.retcode == 0) {//操作成功 返回订购信息
          cb(res.data)
        } else {
          cb(-1)
        }
      },
      fail: function () {
        cb(-1)
      }
    })
  }
  //订购记录查询
  var queryOrderList = function (cb) {
    $.ajax({
      url: cbsHost + '/product/queryorderlist',
      data: {
        usercode: $.getCookie('usercode'),
        user_session: $.getCookie('user_session')
      },
      success: function (res) {
        if (res.retcode == 0) {//操作成功 返回订购信息
          cb(res.data)
        } else {
          cb(-1)
        }
      },
      fail: function () {
        cb(-1)
      }
    })
  }
  //内容产品关系查询
  var queryProductDetail = function (contentcode) {
    $.ajax({
      url: cbsHost + '/product/queryproductdetail',
      data: {
        areacode: $.getCookie('areacode'),
        contentcode: contentcode
      },
      success: function (res) {
        if (res.retcode == 0) {//操作成功 返回订购信息
          cb(res.data)
        } else {
          cb(-1)
        }
      },
      fail: function () {
        cb(-1)
      }
    })
  }
  var pay = {
    createOrder: createOrder,
    queryorderstatus: queryorderstatus,
    productauth: productauth,
    queryOrderList: queryOrderList,
    queryProductDetail: queryProductDetail
  }

  window.pay = pay
})(window, $)