;(function () {
  //注册键盘事件
  document.onkeydown = grabEvent

  var player = document.getElementById('player')

  flowplayer('player', prefix + '/assets/flowplayer/flowplayer.swf', {
    onLoad: function () {
      //视频默认获取焦点
      player.getElementsByTagName('object')[0].focus()
    },
    wmode: "opaque",
    clip: {
      autoPlay: true,
      start: 0,
      scaling: 'scale',//全屏播放
      url: videoUrl
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
