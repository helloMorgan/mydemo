/**
 * Created by liyang on 05/12/2016.
 */
//===================weChat====================
var wx_share_title = '【普惠家】安全透明的互联网金融信息服务平台';
var wx_share_desc = '普惠家（www.puhuijia.com）专业的互联网金融信息服务平台。旨在为有财富增值需求的出借人和有融资需求的借款人提供安全、高效、诚信、互惠互助的网络投融资信息服务';
var wx_share_link = 'https://www.puhuijia.com/app/p_home';
var wx_share_imgUrl = 'https://www.puhuijia.com/app/images/icon_red.jpg';
var baseUrl = "https://www.puhuijia.com/app";
function isOpenInWeixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}
if (isOpenInWeixin()) {
    alert(22);
    // wx.hideOptionMenu();
//js-sdk签名
    $.post(baseUrl + '/weixin/getJsSdkSign', {url: window.location.href}, function (data) {
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
            jsApiList: ['chooseImage','showMenuItems',
                'onMenuShareAppMessage', 'onMenuShareTimeline']
        });
        wx.ready(function () {
            // 隐藏菜单项
            // wx.hideOptionMenu();
            wx.showMenuItems({
                menuList: ['menuItem:share:timeline', // 分享到朋友圈
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
                    alert(888);
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
            var images = {
                localId: [],
                serverId: []
            };
            console.log(document.getElementById('fenqihui'));
            console.log('------------------------');
            document.querySelector('#fenqihui').onclick=function () {
                alert(1);
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        images.localId = res.localIds;
                        alert('已选择 ' + res.localIds.length + ' 张图片');
                    }
                });

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
