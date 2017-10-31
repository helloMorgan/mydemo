
//===================weChat====================
var wx_share_title = '分期惠';
var wx_share_desc = '分期惠是英泰福信息科技（北京）有限公司推出的多场景互联网消费金融服务平台，旨在为有消费分期需求、并对品质生活和优质服务有更高要求的消费用户，提供优质、高效、便捷的互联网消费金融服务。';
var wx_share_link = 'http://fqh.fenqihui.com/static/fenqihui';
var wx_share_imgUrl = 'http://fqh.fenqihui.com/static/fenqihui/static/bitmap/account/WechatIMG4.png';
// var baseUrl = "https://www.puhuijia.com/app";

//生产环境
// var baseUrl = "http://fenqihui.puhuijia.com:8888/";
//http://fenqihuiyou.puhuijia.com:8888/
//http://fenqihui.jinnuofeng.com/
// http://fqh.fenqihui.com/
//http://fqh.fenqihui.com/"
//测试环境
var baseUrl = "http://ceshi1.fenqihui.com/";

// var baseUrl = "http://fenqihuiyou.fenqihui.com:8888/";
//演示环境
// var baseUrl = 'http://fenqihuiyou.puhuijia.com:8080/';

// var baseUrl = 'http://fenqihuiyou.puhuijia.com:9090/';
// var baseUrl =  "http://1y60698h03.51mypc.cn/";

function isOpenInWeixin() {// 检查是否在微信里面打开
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    return true;
  } else {
    return false;
  }
}
if (isOpenInWeixin()) {

  // wx.hideOptionMenu();
//js-sdk签名
  ///weixin/getJsSdkSign
  $.post(BaseUrl + 'wx/getJsAuth', {url: window.location.href}, function (data) {
    data = JSON.parse(data);
    var appId = data.appid;
    var timestamp = data.timestamp;
    var nonceStr = data.nonceStr;
    var signature = data.signature;
    wx.config({
      debug: false,
      appId: appId,
      timestamp: parseInt(timestamp),
      nonceStr: nonceStr,
      signature: signature,
      jsApiList: ['chooseImage', 'uploadImage', 'downloadImage', 'showMenuItems',
        'onMenuShareAppMessage', 'onMenuShareTimeline', 'getLocalImgData']
    });





    wx.ready(function () {
      // 隐藏菜单项
      // wx.hideOptionMenu();
      wx.showMenuItems({
        menuList: ['menuItem:share:tim      eline', // 分享到朋友圈
          'menuItem:share:appMessage' // 发送给朋友
        ]
      });

      // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
      wx.onMenuShareAppMessage({
        title: wx_share_title, // 分享标题
        desc: wx_share_desc, // 分享描述
        link: wx_share_link, // 分享链接
        imgUrl: wx_share_imgUrl, // 分享图标
        type: '', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      });

      // console.log(document.getElementById('fenqihui'));
      // console.log('------------------------');
      //     alert(1);
      wx.callCamera = function () {

      };


      // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
      wx.onMenuShareTimeline({
        title: wx_share_title, // 分享标题
        link: wx_share_link, // 分享链接
        imgUrl: wx_share_imgUrl, // 分享图标
        success: function () {
          // 用户确认分享后执行的回调函数
        },
        cancel: function () {
          // 用户取消分享后执行的回调函数
        }
      });
    });
  });
}