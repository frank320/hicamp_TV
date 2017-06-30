;(function () {
  //注册键盘事件
  document.onkeydown = grabEvent

  var player = document.getElementById('player')

  flowplayer('player', prefix + '/assets/swf/flowplayer-3.2.18.swf', {
    onLoad: function () {
      //视频默认获取焦点
      player.getElementsByTagName('object')[0].focus()
    },
    wmode: "opaque",
    clip: {
      autoPlay: true,
      autoBuffering: true,
      provider: "flashls",
      urlResolvers: "flashls",
      start: 5,
      url: videoUrl
    },
    plugins: {
      flashls: {
        url: prefix + '/assets/swf/flashlsFlowPlayer.swf'
      }
    },
    onStart: function () {
    },
    onPause: function () {
    },
    onResume: function () {
    },
    onFinish: function () {
      goBack()
    }
  })

  function goBack() {
    $.redirect($.getCookie('playBackUrl'))
  }

  //按键事件函数
  function grabEvent(event) {
    var keycode = event.keyCode;
    switch (keycode) {
      case 27:
        //返回键
        goBack()
        break
      case 13:
        //enter键
        break
      default:
        break;
    }
  }


})()
