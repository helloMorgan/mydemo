"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function getAbsolutePath(){var e=window.document.location.href.substring(0,window.document.location.href.indexOf(window.document.location.pathname));return e}function controllerFunc(e,t,n){var i=angular.module(e,[]);return i.config(["$httpProvider",function(e){e.interceptors.push("httpInterceptor")}]),i.factory("httpInterceptor",["$q","$injector",function(e,t){var n={responseError:function(t){return e.reject(t)},response:function(e){return(e.data.result===Reset_LOGIN||e.result===Reset_LOGIN)&&loginTag&&function(){loginTag=!1;var e=window.location.href=getAbsolutePath()+"/fenqihui/pages/account/user_login.html";go_page(e,[{toUrl:window.location.href}])}(),e}};return n}]),i.filter("formatNum",function(){return function(e){var t="",n=0;if(e=e.toString(),-1==e.indexOf(".")){for(var i=e.length-1;i>=0;i--)t=n%3==0&&0!=n?e.charAt(i)+","+t:e.charAt(i)+t,n++;e=t+".00"}else{for(var i=e.indexOf(".")-1;i>=0;i--)t=n%3==0&&0!=n?e.charAt(i)+","+t:e.charAt(i)+t,n++;e=t+(e+"00").substr((e+"00").indexOf("."),3)}return e}}),i.controller(t,["$scope","$http","$timeout","$q",function(e,t,i,r){e.OSS_IMG_URL=OSS_IMG_URL,n(e,t,i,r,BaseUrl,OSS_IMG_URL)}]),i.directive("repeatFinish",function(){return{link:function(e,t,n){1==e.$last&&e.$eval(n.repeatFinish)}}}),i.directive("wxImg",function(){return{restrict:"E",replace:!0,template:'<img src="">',link:function(e,t,n){e.$watch("wxImgId",function(e){t.attr("src",e)})}}}),i.directive("numberConverter",function(){return{priority:1,restrict:"A",require:"ngModel",link:function(e,t,n,i){function r(e){return""+e}function a(e){return parseInt(e)}i.$formatters.push(a),i.$parsers.push(r)}}}),i.directive("modelConvert",function(){return{priority:1,restrict:"A",require:"ngModel",link:function(e,t,n,i){function r(e){return parseFloat(e)}function a(e){return parseFloat(e)}i.$formatters.push(a),i.$parsers.push(r)}}}),i}function getPhoneVersion(){var e=navigator.userAgent,t=e.indexOf("Android");if(t>=0){parseFloat(e.slice(t+8))}}function getAppVersion(){if(/fenqihui/.test(ua)){var e=ua.indexOf("app/v");return ua.substr(e+5)}}function getTypeNative(){return/iphone|ipad|ipod/.test(ua)&&/fenqihui/.test(ua)?"ios":/android/.test(ua)&&/fenqihui/.test(ua)?"android":isOpenInWeixin()?"weixin":!1}function GetQueryString(e){var t=new RegExp("(^|&)"+e+"=([^&]*)(&|$)"),n=window.location.search.substr(1).match(t);return null!=n?getTypeNative()?decodeURI(n[2]):Decrypt(decodeURI(n[2]),ENCRYPT_CODE):null}function GetQueryString2(e){var t=new RegExp("(^|&)"+e+"=([^&]*)(&|$)","i"),n=window.location.search.substr(1).match(t),i="";return null!=n&&(i=n[2]),t=null,n=null,null==i||""==i||"undefined"==i?"":i}function go_page(e,t){if(!t instanceof Array,t&&t.length)for(var n=0;n<t.length;n++)for(var i in t[n])e=0===n?getTypeNative()?e+"?"+i+"="+t[n][i]:e+"?"+i+"="+Encrypt(t[n][i],ENCRYPT_CODE):getTypeNative()?e+"&"+i+"="+t[n][i]:e+"&"+i+"="+Encrypt(t[n][i],ENCRYPT_CODE);window.location.href=encodeURI(e)}function getToken(){return localStorage.getItem("fqhy_token")}function toIndex(){go_page("../../pages/recommended/recommended_index.html")}function toMine(){$("#nav_mine").animateCss("pulse"),go_page(getToken()?"../../pages/account/user_personal.html":"../../pages/account/user_login.html")}function toDest(){go_page("../../pages/recommended/recommendation_destination.html")}function StandardPost(e,t){var n=$("<form method='post' accept-charset='utf-8'></form>");n.attr({action:e});for(var i in t){var r=$("<input type='hidden'>");r.attr({name:i}),r.val(t[i]),n.append(r)}n.submit()}function formatNum(e){var t="",n=0;if(e=e.toString(),-1==e.indexOf(".")){for(var i=e.length-1;i>=0;i--)t=n%3==0&&0!=n?e.charAt(i)+","+t:e.charAt(i)+t,n++;e=t+".00"}else{for(var i=e.indexOf(".")-1;i>=0;i--)t=n%3==0&&0!=n?e.charAt(i)+","+t:e.charAt(i)+t,n++;e=t+(e+"00").substr((e+"00").indexOf("."),3)}return e}function StandardPost(e,t){var n=$("<form method='post' accep t-charset='utf-8'></form>");n.attr({action:e});for(var i in t){var r=$("<input type='hidden'>");r.attr({name:i}),r.val(t[i]),n.append(r)}n.submit()}function Encrypt(e,t){if(""==e)return"";if(e=encodeURI(e),!t||""==t)var t="1234";if(t=encodeURI(t),null==t||t.length<=0)return null;for(var n="",i=0;i<t.length;i++)n+=t.charCodeAt(i).toString();var r=Math.floor(n.length/5),a=parseInt(n.charAt(r)+n.charAt(2*r)+n.charAt(3*r)+n.charAt(4*r)+n.charAt(5*r)),o=Math.ceil(t.length/2),s=Math.pow(2,31)-1;if(2>a)return null;var c=Math.round(1e9*Math.random())%1e8;for(n+=c;n.length>10;)n=(parseInt(n.substring(0,10))+parseInt(n.substring(10,n.length))).toString();n=(a*n+o)%s;for(var l="",u="",i=0;i<e.length;i++)l=parseInt(e.charCodeAt(i)^Math.floor(n/s*255)),u+=16>l?"0"+l.toString(16):l.toString(16),n=(a*n+o)%s;for(c=c.toString(16);c.length<8;)c="0"+c;return u+=c}function toDecimal2(e){var t=parseFloat(e);if(isNaN(t))return!1;var t=Math.round(100*e)/100,n=t.toString(),i=n.indexOf(".");for(0>i&&(i=n.length,n+=".");n.length<=i+2;)n+="0";return n}function toDecimal1(e){var t=parseFloat(e);if(isNaN(t))return!1;var t=Math.round(10*e)/10,n=t.toString(),i=n.indexOf(".");for(0>i&&(i=n.length,n+=".");n.length<=i+1;)n+="0";return n}function conversion(e){for(var t=[],n=0;n<e.length;n++)t[n]=parseFloat(e[n]);return t}function Decrypt(e,t){if(""==e)return"";if(!t||""==t)var t="1234";if(t=encodeURI(t),!(null==e||e.length<8||null==t||t.length<=0)){for(var n="",i=0;i<t.length;i++)n+=t.charCodeAt(i).toString();var r=Math.floor(n.length/5),a=parseInt(n.charAt(r)+n.charAt(2*r)+n.charAt(3*r)+n.charAt(4*r)+n.charAt(5*r)),o=Math.round(t.length/2),s=Math.pow(2,31)-1,c=parseInt(e.substring(e.length-8,e.length),16);for(e=e.substring(0,e.length-8),n+=c;n.length>10;)n=(parseInt(n.substring(0,10))+parseInt(n.substring(10,n.length))).toString();n=(a*n+o)%s;for(var l="",u="",i=0;i<e.length;i+=2)l=parseInt(parseInt(e.substring(i,i+2),16)^Math.floor(n/s*255)),u+=String.fromCharCode(l),n=(a*n+o)%s;return decodeURI(u)}}function isOpenInWeixin(){var e=navigator.userAgent.toLowerCase();return"micromessenger"==e.match(/MicroMessenger/i)?!0:!1}var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),BaseUrl="http://fqh.fenqihui.com/",OSS_IMG_URL="http://fenqihuiyou.oss-cn-qingdao.aliyuncs.com/",DIALOG_TOAST="1",DIALOG_DIALOG="2",DIALOG_LOAD="3",SUCCESS_CODE="0000",ERROR_CODE="9999",Reset_LOGIN="4004",CLIENT_SOURCE=1,ERROR="网络请求异常",loginTag=!0,ENCRYPT_CODE="333",ele={docEl:document.documentElement,docBase:document.getElementsByTagName("html")[0],baseFontSize:"40px"};ele.docBase.style.fontSize=ele.docEl.clientWidth/375*20+"px";var rem=function(e,t){var n="orientationchange"in window?"orientationchange":"resize",i=function(){var e=ele.docEl.clientWidth;e&&(750==e?ele.docBase.style.fontSize=ele.baseFontSize:ele.docBase.style.fontSize=parseInt(ele.baseFontSize)*(e/750)+"px")};e.addEventListener&&(t.addEventListener(n,i,!1),e.addEventListener("DOMContentLoaded",i,!1))}(document,window);getAbsolutePath();var ua=navigator.userAgent.toLowerCase();$(function(){/fenqihui/.test(ua)&&$(".travel-head-nav").css("display","none")}),$.fn.animateCss=function(e){var t="webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";$(this).addClass("animated "+e).one(t,function(){$(this).removeClass("animated "+e)})},$.fn.select_css=function(e){$(this).addClass(e),$(this).siblings().removeClass(e)},$.fn.fastclick=function(e){$(this).on("click",e)};var wx_share_title="分期惠游",wx_share_desc="先旅行后付款，让旅行快乐无忧",wx_share_link="https://fenqihuiyou.fenqihui.com",wx_share_imgUrl="https://fenqihuiyou.fenqihui.com/static/bitmap/https://fenqihuiyou.fenqihui.com/static/bitmap/travel/weixin_share.pngtravel/weixin_share.png",baseUrl="http://ceshi.fenqihui.com/";isOpenInWeixin()&&$.post(baseUrl+"wx/getJsAuth",{url:window.location.href},function(e){e=JSON.parse(e);var t=e.appid,n=e.timestamp,i=e.nonceStr,r=e.signature;wx.config({debug:!1,appId:t,timestamp:parseInt(n),nonceStr:i,signature:r,jsApiList:["chooseImage","uploadImage","downloadImage","showMenuItems","onMenuShareAppMessage","onMenuShareTimeline"]}),wx.ready(function(){wx.showMenuItems({menuList:["menuItem:share:tim      eline","menuItem:share:appMessage"]}),wx.onMenuShareAppMessage({title:wx_share_title,desc:wx_share_desc,link:wx_share_link,imgUrl:wx_share_imgUrl,type:"",dataUrl:"",success:function(){},cancel:function(){}}),wx.callCamera=function(){},wx.onMenuShareTimeline({title:wx_share_title,link:wx_share_link,imgUrl:wx_share_imgUrl,success:function(){},cancel:function(){}})})}),$(function(){var e={tag:!0,num:1,ele:document.createElement("div"),icon:"&#xe6a2;",homeIcon:"&#xe643;",moreIcon:"&#xe627;",personalIcon:"&#xe644;",closeIcon:"&#xe628;",distance:"500000",css:"position:fixed;bottom:4rem;box-shadow:10px 10px 10px gray;right:10px;display:none;font-size:1.5rem;color:#fff;z-index:1000;height:2.5rem;width:2.5rem;background:#f44336;border-radius:50%;line-height:2.5rem;text-align:center",menuCss:"position:absolute;display:none;box-shadow:10px 10px 10px gray;font-size:1.2rem;color:#fff;background:orange;height:2rem;width:2rem;border-radius:50%;text-align:center;line-height:2rem;"},t=function(e){e.style.background=arguments.length<=1?void 0:arguments[1],e.style.bottom=arguments.length<=2?void 0:arguments[2],e.style.right=arguments.length<=3?void 0:arguments[3],e.innerHTML=arguments.length<=4?void 0:arguments[4],e.id=arguments.length<=5?void 0:arguments[5]};document.querySelector("body").appendChild(function(n){n.className="scroll iconfont",n.innerHTML=e.moreIcon,n.style.cssText=e.css;for(var i=0;3>i;i++){var r=document.createElement("a");switch(r.className="iconfont",r.style.cssText=e.menuCss,i){case 0:t(r,"#2196f3","2.4rem","2.4rem",e.homeIcon,"home");break;case 1:t(r,"#4caf50",0,"3.5rem",e.personalIcon,"personal");break;case 2:t(r,"#fdd835","3.5rem","0",e.icon,"top")}e.ele.appendChild(r)}return n}(e.ele)),$(window).scroll(function(){var t=$(window).scrollTop();t>e.distance?e.tag&&($(e.ele).css("display","block").animateCss("fadeInRight"),e.tag=!e.tag):e.tag||($(e.ele).css("display","none"),$(e.ele).children().css("display","none"),e.num++,e.tag=!e.tag)}),$(e.ele).click(function(t){switch(window.e=t,t.target.id){case"home":getTypeNative()?"ios"===getTypeNative()?backHome():"android"===getTypeNative()&&android.backHome():window.location.href=getAbsolutePath()+"/pages/recommended/recommended_index.html";break;case"personal":getTypeNative()?"ios"===getTypeNative()?backAccount():"android"===getTypeNative()&&android.backAccount():window.location.href=getAbsolutePath()+"/pages/account/user_personal.html";break;case"top":$(window).scrollTop(0)}e.num%2==0&&$(e.ele).children().css("display","none")||$(e.ele).children().css("display","block").animateCss("swing"),e.num++})});var Dialog=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:DIALOG_DIALOG,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"请求失败",i=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"common-dialog-wrap",r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"common-dialog-content-wrap",a=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"common-dialog-content",o=arguments.length>5&&void 0!==arguments[5]?arguments[5]:"common-btn",s=arguments.length>6&&void 0!==arguments[6]?arguments[6]:"确定";_classCallCheck(this,e),this.type=t,t==DIALOG_TOAST?(this.dialog=document.createElement("div"),this.dialog.className="common-toast",this.dialog.innerHTML=n):t==DIALOG_LOAD?(this.dialog=document.createElement("div"),this.dialog.className=i,this.figure=document.createElement("figure"),this.figure.className="common-loadGif",this.img=document.createElement("img"),this.img.src=getAbsolutePath()+"/static/bitmap/travel/loadgif.gif",this.figure.appendChild(this.img),this.dialog.appendChild(this.figure)):t==DIALOG_DIALOG&&(this.dialog=document.createElement("div"),this.dialog.className=i,this.dialogWrap=document.createElement("div"),this.dialogWrap.className=r,this.conetent=document.createElement("p"),this.conetent.innerHTML=n,this.conetent.className=a,this.confirmButton=document.createElement("p"),this.confirmButton.innerHTML=s,this.confirmButton.className=o,this.dialog.appendChild(this.dialogWrap),this.dialogWrap.appendChild(this.conetent),this.dialogWrap.appendChild(this.confirmButton),this.bindEvent())}return _createClass(e,[{key:"bindEvent",value:function(){var e=this;this.confirmButton.addEventListener("click",function(){e.hide()})}},{key:"show",value:function(e,t){var n=this;document.querySelector("body").appendChild(this.dialog),$(this.dialog).css("display","block"),t&&$(this.dialog).css("width",t),this.type==DIALOG_TOAST&&setTimeout(function(){$(n.dialog).css("display","none")},e)}},{key:"hide",value:function(){$(this.dialog).css("display","none")}}]),e}();