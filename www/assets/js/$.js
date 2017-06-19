/**
 * Created by frank on 2016/9/21.
 * 根据重庆盒子对js支持的程度 封装的一些常用方法
 */
;(function (window) {

  //each方法  可以遍历数组 对象 伪数组
  var each = function (obj, fn) {
    var i;
    if (obj.length) {
      for (i = 0; i < obj.length;) {
        //fn.call(ojb[i], i, ojb[i++]  使用call改变this指向
        if (fn.call(obj[i], i, obj[i++]) === false) {
          break;
        }
      }
    } else {
      for (i in obj) {
        if (fn.call(obj[i], i, obj[i]) === false) {
          break;
        }
      }
    }
  }

  //选择器   可传入id值和标签元素  其中标签选择器支持传入第二个参数 即要获取的标签元素的父节点
  var select = (function () {


//document.getElementsByTagName封装
    function getTags(tagName, parent) {
      parent = parent || document;
      return parent.getElementsByTagName(tagName);
    }

//document.getElementById封装
    function getId(idName) {
      return document.getElementById(idName);
    }

    // 以类名获取dom元素
    function getClass(className) {
      var elements = $.select('div');
      if (!elements)
        return null;

      var rlt = [];
      for (var i = 0; i < elements.length; i++) {
        if ($.hasClass(elements[i], className))
          rlt.push(elements[i]);
      }
      return rlt;
    }

//封装选择器
    /**
     * get("div",dom)
     * @param selector:#id  /tag
     * @param parent : dom节点
     */

    function select(selector, parent) {
      if (selector.indexOf('#') == 0) {
        return getId(selector.slice(1))
      } else if (selector.indexOf('.') == 0) {
        return getClass(selector.slice(1));
      } else {
        return getTags(selector, parent)
      }
    }

    return select

  })();

  //css样式操作 设置样式的api  第一个参数为dom元素或者dom数组  第二个参数为设置样式的对象
  var css = function (dom, obj) {
    if (dom.length) {
      each(dom, function () {
        var that = this;
        each(obj, function (k, v) {
          that.style[k] = v;
        });
      });
    } else {
      //单个dom直接设置样式
      each(obj, function (k, v) {
        dom.style[k] = v;
      });
    }

  }

  //类名相关操作
  var hasClass = function (dom, class_name) {
    if (dom) {
      var classNames = " " + dom.className + " ";
      class_name = " " + class_name + " ";
      if (classNames.indexOf(class_name) !== -1) {
        return true
      } else {
        return false
      }
    } else {
      return false;
    }
  }
  var addClass = function (dom, class_name) {
    if (!hasClass(dom, class_name)) {
      dom.className = dom.className + " " + class_name
    }
    return this //链式编程
  }
  var removeClass = function (dom, class_name) {
    if (hasClass(dom, class_name)) {
      dom.className = " " + dom.className + " "
      dom.className = dom.className.replace(" " + class_name + " ", " ")
    }

    return this //链式编程

  }
  //ajax请求
  var params = function (data) {
    if (typeof data == 'object') {
      var s = "";
      for (var k in data) {
        s += k + "=" + data[k] + "&";
      }
      s = s.slice(0, -1);
      return s;
    } else {
      return data;
    }
  }
  var ajax = function (obj) {
    var type = obj.type || 'get';
    var url = obj.url || location.pathname;
    var data = params(obj.data);
    var success = obj.success;
    var fail = obj.fail;
    var isAsync = obj.async || true;

    var xhr = new XMLHttpRequest();
    if (type == 'get') {
      url += "?" + data;
      data = null;
    }
    xhr.open(type, url, isAsync);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var result = xhr.responseText;
          //解析json数据
          var data = eval('(' + result + ')')
          success(data);
        } else {
          fail()
        }
      }
    }

    var headers = obj.headers || {};
    for (var h in headers) {
      xhr.setRequestHeader(h, headers[h]);
    }
    if (type == 'post' && !headers['Content-Type']) {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    xhr.send(data);
  }

  //动画函数
  var animate = function (dom, obj, duration) {
    duration = duration || 1000;
    each(obj, function (styleName, targetValue) {
      //获得元素属性的当前值
      var currentValue = parseFloat(dom.style[styleName]) || 0;
      //开始时间
      var startTime = new Date().valueOf();

      var timer = setInterval(function () {
        //动画的当前时间
        var currentTime = new Date().valueOf();
        //动画的运行时间
        var timeTween = currentTime - startTime;

        if (timeTween >= duration) {
          clearInterval(timer);
          dom.style[styleName] = targetValue + getStyleUnit(styleName);
        } else {
          //改变元素属性的变化
          var distance = linear(null, timeTween, currentValue, targetValue, duration);
          dom.style[styleName] = currentValue + distance + getStyleUnit(styleName);
        }

      }, 20);
    });
    //匀速动画
    function linear(x, t, b, c, d) {
      return (c - b) * t / d;
    }

    function getStyleUnit(sName) {
      switch (sName) {
        case "width":
        case "height":
        case "left":
        case "right":
        case "top":
        case "bottom":
          return "px";
        case "opacity":
          return "";
      }
    }
  }

  // 设置cookie
  var setCookie = function (name, value) {
    var days = 1;
    var exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + encodeURI(value) + ";path=/;expires=" + exp.toGMTString();
  }

  // 读取cookie
  var getCookie = function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
      return decodeURI(arr[2]);
    else
      return null;
  }

  // 删除cookie
  var delCookie = function (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";path=/;expires=" + exp.toGMTString();
  }

  // cookie转成字参数串
  var strCookie = function () {
    var query = '';
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].replace(/(^\s*)|(\s*$)/g, '');
      query += cookie;
      if (i < cookies.length - 1)
        query += '&';
    }
    return query;
  }

  // 封装重定向方法，页面跳转统一调用此方法
  var redirect = function (url) {
    var imgSrc = prefix + "/assets/img/loading.gif"
    document.body.innerHTML = '<div class="container" style="width: 100%; height: 100%; padding: 250px;text-align: center;"><span style="font-size: 40px;color: #B5B0AC;">正在加载中...</span>' +
      '<div class="loading"></div>';
    setTimeout(function () {
      window.location.replace(url)
    }, 0)
  }

  //退出应用
  var exit = function () {
    var hCount = window.history.length
    window.history.go(-hCount + 6)
    window.history.back()
  }

  //栏目焦点项图标显示控制
  var showVideoIcon = function (index, activeElement, iconSrc) {
    arguments[2] = arguments[2] ? arguments[2] : '/assets/img/button_video.png'
    arguments[2] = prefix + arguments[2]
    var videoIcon = document.getElementById('videoIcon')
    videoIcon.style.display = 'block'
    var img = videoIcon.children[0]
    img.src = arguments[2]
    img.onload = function () {
      // 166 40
      videoIcon.style.left = activeElement.offsetLeft + 166 + 'px'
      videoIcon.style.top = activeElement.parentNode.offsetTop + 40 + 'px'
    }
    videoIcon.style.left = activeElement.offsetLeft + 166 + 'px'
    videoIcon.style.top = activeElement.parentNode.offsetTop + 40 + 'px'
  }

  var hideVideoIcon = function () {
    var videoIcon = document.getElementById('videoIcon')
    videoIcon.style.display = 'none'
  }
  //获取用户cardId
  var getCardId = function () {
    if (typeof Utility !== 'undefined' && Utility.getSystemInfo('SID')) {
      return Utility.getSystemInfo('SID')
    }
    return ''
  }
  //获取用户id
  var getUserId = function () {
    if (typeof Utility !== 'undefined' && Utility.getSystemInfo('UID')) {
      return Utility.getSystemInfo('UID')
    }
    return ''
  }
  //获取区域码
  var getAreaCode = function () {
    if (typeof Utility !== 'undefined' && Utility.getSystemInfo('ARC')) {
      return Utility.getSystemInfo('ARC')
    }
    return ''
  }
  //获取认证码
  var getAuthentyCode = function () {
    if (typeof Utility !== 'undefined' && Utility.getSystemInfo('AUC')) {
      return Utility.getSystemInfo('AUC')
    }
    return ''
  }
  //获取设备序列号
  var getDeviceSerialNumber = function () {
    if (typeof hardware !== 'undefined' && hardware.STB.serialNumber) {
      return hardware.STB.serialNumber
    }
    return ''
  }
  //封装拼接请求地址的方法
  var getUrl = function (url, paramsObj) {
    var paramsStr = ''
    if (typeof paramsObj === 'object') {
      for (var v in paramsObj) {
        paramsStr += v + '=' + encodeURI(paramsObj[v]) + '&'
      }
      paramsStr = '?' + paramsStr.slice(0, -1)
    }
    return (url + paramsStr)
  }
  //格式化时间 如'2017-07-07 17:54:06' 格式化成毫秒形式
  var formatTime = function (str) {
    str = str.replace(/-/g, "/")
    return +new Date(str)
  }

  //将封装的方法添加到hicamp对象中
  var hicamp = {
    each: each,
    select: select,
    css: css,
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    animate: animate,
    ajax: ajax,
    setCookie: setCookie,
    getCookie: getCookie,
    delCookie: delCookie,
    strCookie: strCookie,
    redirect: redirect,
    showVideoIcon: showVideoIcon,
    hideVideoIcon: hideVideoIcon,
    getCardId:getCardId,
    getUserId: getUserId,
    getAreaCode: getAreaCode,
    getAuthentyCode: getAuthentyCode,
    getDeviceSerialNumber: getDeviceSerialNumber,
    exit: exit,
    getUrl: getUrl,
    formatTime: formatTime
  }


  //暴露接口对象
  return window.$ = window.hicamp = hicamp
})(window)
