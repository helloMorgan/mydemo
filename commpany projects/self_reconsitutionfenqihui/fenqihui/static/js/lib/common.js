
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

document.config_start;
//测试地址
var BaseUrl = 'http://ceshi1.fenqihui.com/';
var OSS_IMG_URL = 'http://fenqihuiyou.oss-cn-qingdao.aliyuncs.com/';

//生产地址
// var BaseUrl = 'http://fqh.fenqihui.com/';
// var OSS_IMG_URL = 'http://fqh-public.oss-cn-beijing.aliyuncs.com/';

document.config_end;

var DIALOG_TOAST = '1',
    DIALOG_DIALOG = '2',
    DIALOG_LOAD = '3',

// 生产地址
SUCCESS_CODE = '0000',
    ERROR_CODE = '9999',
    Reset_LOGIN = '4004',
    CLIENT_SOURCE = 1,

// TOKEN = 'fqhy_token',
ERROR = '网络请求异常',
    loginTag = true,
    ENCRYPT_CODE = '333';
var ele = {
    docEl: document.documentElement,
    docBase: document.getElementsByTagName('html')[0],
    baseFontSize: '40px'
};
// iphone 6 1 rem = 20px;
ele.docBase.style.fontSize = ele.docEl.clientWidth / 375 * 20 + 'px';
var rem = function (doc, win) {
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function recalc() {
        var clientWidth = ele.docEl.clientWidth;
        if (!clientWidth) return;
        if (clientWidth == 750) {
            ele.docBase.style.fontSize = ele.baseFontSize;
        } else {
            ele.docBase.style.fontSize = parseInt(ele.baseFontSize) * (clientWidth / 750) + 'px';
        }
    };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
}(document, window);

//get project absolute path
function getAbsolutePath() {
    //改变路由的函数
    var localhostPath = window.document.location.href.substring(0, window.document.location.href.indexOf(window.document.location.pathname));
    return localhostPath;
}

getAbsolutePath();

//angular controller
function controllerFunc(appName, ctrlName, ctrlFunc) {
    var app = angular.module(appName, []);
    // 拦截器
    app.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    }]);
    app.factory('httpInterceptor', ['$q', '$injector', function ($q, $injector) {
        var httpInterceptor = {
            'responseError': function responseError(response) {
                return $q.reject(response);
            },
            'response': function response(_response) {
                if (_response.data.result === Reset_LOGIN || _response.result === Reset_LOGIN) {
                    //When login fails, go to the login screen according to the absolute path
                    loginTag && function () {
                        loginTag = false;
                        // alert(response.data.result||response.result);
                        // if (!confirm('登录已失效，请重新登录'))return;
                        // alert('登录已失效，请重新登录');
                        // var appType = getTypeNative();
                        // if (appType == 'ios') {
                        //     goLogin();
                        // } else if (appType === 'android') {
                        //     android.goLogin();
                        // } else {
                        // let url = window.location.href = getAbsolutePath() + '/fenqihui/pages/account/new_login.html';
                        //    let url = window.location.href = getAbsolutePath() + '/static//pages/account/new_login.html';
                        var url = window.location.href = getAbsolutePath() + '/static/fenqihui/pages/account/new_login.html';
                        // let url = window.location.href = getAbsolutePath() + '/pages/account/user_login.html';
                        // alert('页面参数为' + window.location.href);、
                        // go_page(url, [{'toUrl': window.location.href}]);
                        // }
                    }();
                }
                return _response;
            }
        };
        return httpInterceptor;
    }]);

    //Custom filters are used for price display
    app.filter('formatNum', function () {
        // 千位字符的过滤器
        return function (str) {
            var newStr = "";
            var count = 0;
            str = str.toString();
            if (str.indexOf(".") == -1) {
                for (var i = str.length - 1; i >= 0; i--) {
                    if (count % 3 == 0 && count != 0) {
                        newStr = str.charAt(i) + "," + newStr;
                    } else {
                        newStr = str.charAt(i) + newStr;
                    }
                    count++;
                }
                str = newStr + ".00"; //自动补小数点后两位
            } else {
                for (var i = str.indexOf(".") - 1; i >= 0; i--) {
                    if (count % 3 == 0 && count != 0) {
                        newStr = str.charAt(i) + "," + newStr;
                    } else {
                        newStr = str.charAt(i) + newStr; //逐个字符相接起来
                    }
                    count++;
                }
                str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
            }
            return str;
        };
    });
    // 防止混淆错乱
    app.controller(ctrlName, ['$scope', '$http', '$timeout', '$q', function ($scope, $http, $timeout, $q) {
        $scope.OSS_IMG_URL = OSS_IMG_URL;
        ctrlFunc($scope, $http, $timeout, $q, BaseUrl, OSS_IMG_URL);
    }]);
    app.directive('repeatFinish', function () {
        return {
            link: function link(scope, element, attr) {
                if (scope.$last == true) {
                    scope.$eval(attr.repeatFinish);
                }
            }
        };
    });

    app.directive('wxImg', function () {
        return {
            restrict: 'E',
            replace: true,
            template: '<img src="">',
            link: function link($scope, elem, attr) {
                $scope.$watch('wxImgId', function (nowVal) {
                    elem.attr('src', nowVal);
                });
            }
        };
    });
    9;
    app.directive('numberConverter', function () {
        return {
            priority: 1,
            restrict: 'A',
            require: 'ngModel',
            link: function link(scope, element, attr, ngModel) {
                function toModel(value) {
                    return "" + value; // convert to string
                }
                function toView(value) {
                    return parseInt(value); // convert to number
                }

                ngModel.$formatters.push(toView);
                ngModel.$parsers.push(toModel);
            }
        };
    });

    app.directive('modelConvert', function () {
        return {
            priority: 1,
            restrict: 'A',
            require: 'ngModel',
            link: function link(scope, element, attr, ngModel) {

                //tel -> number number->tel
                function toModel(value) {
                    return parseFloat(value);
                }

                function toView(value) {
                    return parseFloat(value);
                }

                ngModel.$formatters.push(toView);
                ngModel.$parsers.push(toModel);
            }
        };
    });
    return app;
}

// check the app version \
function getPhoneVersion() {
    // 得到手机的版本号
    var userAgent = navigator.userAgent;
    var index = userAgent.indexOf("Android");
    if (index >= 0) {
        var androidVersion = parseFloat(userAgent.slice(index + 8));
        if (androidVersion > 5) {
            // 版本小于3的事情
        }
    }
}

//Remove the native app head
var ua = navigator.userAgent.toLowerCase();
$(function () {
    if (/fenqihui/.test(ua)) {
        $('.travel-head-nav').css('display', 'none');
        //$('.travel-head-guide').css('display', 'none');
        //$('#travel_detail_guideNav').css('display', 'block');
    } else {}
});

//获取app版本号的方法
function getAppVersion() {
    if (/fenqihui/.test(ua)) {
        var index = ua.indexOf("app/v");
        return ua.substr(index + 5);
    }
}

//判断不同平台
function getTypeNative() {
    if (/iphone|ipad|ipod/.test(ua) && /fenqihui/.test(ua)) {
        return 'ios';
    } else if (/android/.test(ua) && /fenqihui/.test(ua)) {
        return 'android';
    }
    // else if (isOpenInWeixin()) {
    //     return 'weixin'
    // }

    else {
            return false;
        }
}

//检测android ios 手机版本 当版本大于 ** 时  开启动画效果
$.fn.animateCss = function (animationName) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    $(this).addClass('animated ' + animationName).one(animationEnd, function () {
        $(this).removeClass('animated ' + animationName);
    });
};

//click toggle style
$.fn.select_css = function (className) {
    $(this).addClass(className);
    $(this).siblings().removeClass(className);
};

//convert tap event
$.fn.fastclick = function (fun) {
    $(this).on('click', fun);
};

//get url param
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        if (getTypeNative()) {
            return decodeURI(r[2]);
        }
        return Decrypt(decodeURI(r[2]), ENCRYPT_CODE);
    }
    return null;
}

function GetQueryString2(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null) context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}

//jump page
function go_page(url, params) {
    //js 对象遍历
    if (!params instanceof Array) {
        // alert('参数异常');
    }
    if (params && params.length) {
        for (var i = 0; i < params.length; i++) {
            for (var key in params[i]) {
                // alert(params[i]);
                if (i === 0) {
                    if (getTypeNative()) {
                        url = url + '?' + key + '=' + params[i][key];
                    } else {
                        url = url + '?' + key + '=' + Encrypt(params[i][key], ENCRYPT_CODE);
                    }
                } else {
                    if (getTypeNative()) {
                        url = url + '&' + key + '=' + params[i][key];
                    } else {
                        url = url + '&' + key + '=' + Encrypt(params[i][key], ENCRYPT_CODE);
                    }
                }
            }
        }
    }
    window.location.href = encodeURI(url);
};

function getToken() {
    return localStorage.getItem('fqh_token');
}

function toIndex() {
    // $('#nav_home').css('background', 'url(boutique travel_access.png)');
    go_page('../../pages/recommended/recommended_index.html');
}
function toMine() {
    // $('#nav_mine').animateCss('pulse');
    if (getToken()) {
        go_page('../../pages/travel/tracel_myStages.html');
    } else {
        go_page('../../pages/account/new_login.html');
    }
}

function toDest() {
    go_page('../../pages/recommended/recommendation_destination.html');
}

function toReal() {
    go_page('../../pages/travel/travel_upload_cdCard.html');
}

function toOrder() {
    go_page('../../pages/travel/decoration_order.html');
};
//jquery tab切换
function clickTab(mainTab, mainPlace) {
    var currentIndex = 0;
    $(mainTab).click(function () {
        var index = $(this).index();
        if (currentIndex != index) {
            currentIndex = index;
            $(this).removeClass("normalSpan").addClass("selectedSpan");
            $(this).siblings().removeClass("selectedSpan").addClass("normalSpan");
            var contents = $(mainPlace);
            $(contents[index]).show();
            $(contents[index]).siblings().hide();
        }
    });
};


//format the price
function formatNum(str) {
    // 自动添加千位符
    var newStr = "";
    var count = 0;
    str = str.toString();
    if (str.indexOf(".") == -1) {
        for (var i = str.length - 1; i >= 0; i--) {
            if (count % 3 == 0 && count != 0) {
                newStr = str.charAt(i) + "," + newStr;
            } else {
                newStr = str.charAt(i) + newStr;
            }
            count++;
        }
        str = newStr + ".00"; //自动补小数点后两位
    } else {
        for (var i = str.indexOf(".") - 1; i >= 0; i--) {
            if (count % 3 == 0 && count != 0) {
                newStr = str.charAt(i) + "," + newStr;
            } else {
                newStr = str.charAt(i) + newStr; //逐个字符相接起来
            }
            count++;
        }
        str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
    }
    return str;
}

function StandardPost(url, args) {
    var data = {};
    for (var arg in args) {
        data[arg] = args[arg];
    }
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function success(res) {
            // document.write(res);
            document.body.innerHTML = res;
            console.log(res);
            document.E_FORM.submit();
        }
    });
}

// 加密方法
function Encrypt(str, pwd) {
    if (str == "") return "";
    str = encodeURI(str);
    if (!pwd || pwd == "") {
        var pwd = "1234";
    }
    pwd = encodeURI(pwd);
    if (pwd == null || pwd.length <= 0) {
        return null;
    }
    var prand = "";
    for (var I = 0; I < pwd.length; I++) {
        prand += pwd.charCodeAt(I).toString();
    }
    var sPos = Math.floor(prand.length / 5);
    var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    var incr = Math.ceil(pwd.length / 2);
    var modu = Math.pow(2, 31) - 1;
    if (mult < 2) {
        return null;
    }
    var salt = Math.round(Math.random() * 1000000000) % 100000000;
    prand += salt;
    while (prand.length > 10) {
        prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
    }
    prand = (mult * prand + incr) % modu;
    var enc_chr = "";
    var enc_str = "";
    for (var I = 0; I < str.length; I++) {
        enc_chr = parseInt(str.charCodeAt(I) ^ Math.floor(prand / modu * 255));
        if (enc_chr < 16) {
            enc_str += "0" + enc_chr.toString(16);
        } else enc_str += enc_chr.toString(16);
        prand = (mult * prand + incr) % modu;
    }
    salt = salt.toString(16);
    while (salt.length < 8) {
        salt = "0" + salt;
    }enc_str += salt;
    return enc_str;
}

function toDecimal2(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

//保留一位小数
function toDecimal1(x) {
    var f = parseFloat(x);
    if (isNaN(f)) {
        return false;
    }
    var f = Math.round(x * 10) / 10;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 1) {
        s += '0';
    }
    return s;
}

//字符串转换为浮点数
function conversion(arr) {
    var newArr = [];
    for (var i = 0; i < arr.length; i++) {
        // newArr[i] = parseFloat(toDecimal2(arr[i]));
        newArr[i] = parseFloat(arr[i]);
    }

    return newArr;
}

// 解密方法
function Decrypt(str, pwd) {
    if (str == "") return "";
    if (!pwd || pwd == "") {
        var pwd = "1234";
    }
    pwd = encodeURI(pwd);
    if (str == null || str.length < 8) {
        return;
    }
    if (pwd == null || pwd.length <= 0) {
        return;
    }
    var prand = "";
    for (var I = 0; I < pwd.length; I++) {
        prand += pwd.charCodeAt(I).toString();
    }
    var sPos = Math.floor(prand.length / 5);
    var mult = parseInt(prand.charAt(sPos) + prand.charAt(sPos * 2) + prand.charAt(sPos * 3) + prand.charAt(sPos * 4) + prand.charAt(sPos * 5));
    var incr = Math.round(pwd.length / 2);
    var modu = Math.pow(2, 31) - 1;
    var salt = parseInt(str.substring(str.length - 8, str.length), 16);
    str = str.substring(0, str.length - 8);
    prand += salt;
    while (prand.length > 10) {
        prand = (parseInt(prand.substring(0, 10)) + parseInt(prand.substring(10, prand.length))).toString();
    }
    prand = (mult * prand + incr) % modu;
    var enc_chr = "";
    var enc_str = "";
    for (var I = 0; I < str.length; I += 2) {
        enc_chr = parseInt(parseInt(str.substring(I, I + 2), 16) ^ Math.floor(prand / modu * 255));
        enc_str += String.fromCharCode(enc_chr);
        prand = (mult * prand + incr) % modu;
    }
    return decodeURI(enc_str);
}

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
$(function () {
    var param = {
        tag: true,
        num: 1,
        ele: document.createElement('div'),
        icon: '&#xe6a2;',
        homeIcon: '&#xe643;',
        moreIcon: '&#xe627;',
        personalIcon: '&#xe644;',
        closeIcon: '&#xe628;',
        distance: '500000',
        css: "position:fixed;" + "bottom:4rem;" + "box-shadow:10px 10px 10px gray;" + "right:10px;" + "display:none;" + "font-size:1.5rem;" + "color:#fff;" + "z-index:1000;" + "height:2.5rem;" + "width:2.5rem;" + "background:#f44336;" + "border-radius:50%;" + "line-height:2.5rem;" + "text-align:center",
        menuCss: "position:absolute;" +
        // "bottom:3rem;" +
        "display:none;" + "box-shadow:10px 10px 10px gray;" + "font-size:1.2rem;" + "color:#fff;" + "background:orange;" + "height:2rem;" + "width:2rem;" + "border-radius:50%;" + "text-align:center;" + "line-height:2rem;"
        // type: '#top'
    };

    {
        var setStyle = function setStyle(ele) {
            ele.style.background = arguments.length <= 1 ? undefined : arguments[1];
            ele.style.bottom = arguments.length <= 2 ? undefined : arguments[2];
            ele.style.right = arguments.length <= 3 ? undefined : arguments[3];
            ele.innerHTML = arguments.length <= 4 ? undefined : arguments[4];
            ele.id = arguments.length <= 5 ? undefined : arguments[5];
        };

        document.querySelector('body').appendChild(function (ele) {
            ele.className = 'scroll iconfont';
            ele.innerHTML = param.moreIcon;
            // ele.href = param.type;
            ele.style.cssText = param.css;
            for (var i = 0; i < 3; i++) {
                var menu_personal = document.createElement('a');
                menu_personal.className = 'iconfont';
                menu_personal.style.cssText = param.menuCss;

                switch (i) {
                    case 0:
                        setStyle(menu_personal, '#2196f3', '2.4rem', '2.4rem', param.homeIcon, 'home');
                        break;

                    case 1:
                        setStyle(menu_personal, '#4caf50', 0, '3.5rem', param.personalIcon, 'personal');
                        break;

                    case 2:
                        setStyle(menu_personal, '#fdd835', '3.5rem', '0', param.icon, 'top');
                        break;

                }

                param.ele.appendChild(menu_personal);
            }
            return ele;
        }(param.ele));
    }
    {
        $(window).scroll(function () {
            var scrollValue = $(window).scrollTop();
            if (scrollValue > param.distance) {
                if (param.tag) {
                    $(param.ele).css('display', 'block').animateCss('fadeInRight');
                    param.tag = !param.tag;
                }
            } else {
                if (!param.tag) {
                    $(param.ele).css('display', 'none');
                    $(param.ele).children().css('display', 'none');
                    param.num++;
                    param.tag = !param.tag;
                }
            }
        });

        $(param.ele).click(function (e) {
            window.e = e;
            switch (e.target.id) {

                case 'home':
                    if (!getTypeNative()) {
                        // window.location.href = getAbsolutePath() + '/fenqihui/pages/recommended/recommended_index.html';
                        // window.location.href = getAbsolutePath() + '/static//pages/recommended/recommended_index.html';、
                        window.location.href = getAbsolutePath() + '/static/fenqihui/pages/recommended/recommended_index.html';
                        // window.location.href = getAbsolutePath() + '/pages/recommended/recommended_index.html';
                    } else if (getTypeNative() === 'ios') {
                        backHome();
                    } else if (getTypeNative() === 'android') {
                        android.backHome();
                    }

                    break;

                case 'personal':

                    if (!getTypeNative()) {
                        // window.location.href = getAbsolutePath() + '/fenqihui/pages/account/user_personal.html';
                        //    window.location.href = getAbsolutePath() + '/static//pages/account/user_personal.html';
                        window.location.href = getAbsolutePath() + '/static/fenqihui/pages/account/user_personal.html';
                        // window.location.href = getAbsolutePath() + '/pages/account/user_personal.html';
                    } else if (getTypeNative() === 'ios') {
                        //todo://前往个人中心
                        backAccount();
                    } else if (getTypeNative() === 'android') {
                        android.backAccount();
                    }
                    break;

                case 'top':
                    $(window).scrollTop(0);
                    break;
            }
            param.num % 2 == 0 && $(param.ele).children().css('display', 'none') || $(param.ele).children().css('display', 'block').animateCss('swing');
            param.num++;
        });
    }
});

//ajax 的二次封装 POST的请求
//不传入data
$.ajaxPackagain = function (url, successfn, errorfn) {
    $.ajax({
        type: "post",
        url: url,
        dataType: "json",
        success: function success(d) {
            successfn(d);
        },
        error: function error(e) {
            errorfn(e);
        }
    });
};
//传入data

$.ajaxPackagaind = function (url, data, successfn, errorfn) {
    data = data == null || data == "" || typeof data == "undefined" ? {
        "date": new Date().getTime()
    } : data;
    $.ajax({
        type: "post",
        data: data,
        url: url,
        dataType: "json",
        success: function success(d) {
            successfn(d);
        },
        error: function error(e) {
            errorfn(e);
        }
    });
};

//公共弹窗加载动画

var Dialog = function () {
    function Dialog() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DIALOG_DIALOG;
        var dialogContent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '请求失败';
        var wrapClassName = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'common-dialog-wrap';
        var dialogWrapClassName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'common-dialog-content-wrap';
        var contentClassName = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'common-dialog-content';
        var btnClassName = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'common-btn';
        var btnContent = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : '确定';

        _classCallCheck(this, Dialog);

        this.type = type;

        //吐司
        if (type == DIALOG_TOAST) {
            this.dialog = document.createElement('div');
            this.dialog.className = 'common-toast';
            this.dialog.innerHTML = dialogContent;
        }
        //加载动画
        else if (type == DIALOG_LOAD) {
                this.dialog = document.createElement('div');
                this.dialog.className = wrapClassName;
                this.figure = document.createElement('figure');
                this.figure.className = 'common-loadGif';
                this.img = document.createElement('img');
                // this.img.src = getAbsolutePath() + '/static/bitmap/travel/loadgif.gif';
                // this.img.src = getAbsolutePath() + '/fenqihui/static/bitmap/travel/loadgif.gif';
                // this.img.src = getAbsolutePath() + '/static/bitmap/travel/loadgif.gif';
                // this.img.src = getAbsolutePath() + '/static/fenqihui/static/bitmap/travel/loadgif.gif';
                this.img.src = 'http://fqh.fenqihui.com/static/fenqihui/static/bitmap/travel/loadgif.gif';

                this.figure.appendChild(this.img);
                this.dialog.appendChild(this.figure);
            } else if (type == DIALOG_DIALOG) {
                this.dialog = document.createElement('div');
                this.dialog.className = wrapClassName;
                this.dialogWrap = document.createElement('div');
                this.dialogWrap.className = dialogWrapClassName;
                this.conetent = document.createElement('p');
                this.conetent.innerHTML = dialogContent;
                this.conetent.className = contentClassName;
                this.confirmButton = document.createElement('p');
                this.confirmButton.innerHTML = btnContent;
                this.confirmButton.className = btnClassName;'';
                this.dialog.appendChild(this.dialogWrap);

                this.dialogWrap.appendChild(this.conetent);
                this.dialogWrap.appendChild(this.confirmButton);
                this.bindEvent();
            }
    }

    _createClass(Dialog, [{
        key: 'bindEvent',
        value: function bindEvent() {
            var _this = this;

            this.confirmButton.addEventListener('click', function () {
                _this.hide();
            });
        }

        /**
         *@param width 弹窗宽度
         *@param time  弹窗弹出时长
         **/

    }, {
        key: 'show',
        value: function show(time, width) {
            var _this2 = this;

            document.querySelector('body').appendChild(this.dialog);
            $(this.dialog).css('display', 'block');
            width && $(this.dialog).css('width', width);
            if (this.type == DIALOG_TOAST) {
                setTimeout(function () {
                    $(_this2.dialog).css('display', 'none');
                }, time);
            }
        }
    }, {
        key: 'hide',
        value: function hide() {
            $(this.dialog).css('display', 'none');
        }
    }]);

    return Dialog;
}();


Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.rM = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};



//    使用canvas对大图片进行压缩
function compress(img) {
    var MAX_ID_CARD_W = 1000;
    var MAX_ID_CARD_H = 1000;

    var cvs = document.createElement('canvas');
    var ctx = cvs.getContext('2d');
    var _w = img.width,
        _h = img.height;
    var _asp = img.width / img.height;
    //计算等比缩小后图片宽高
    if (_asp > 1) {
        cvs.width = MAX_ID_CARD_W;
        cvs.height = MAX_ID_CARD_W / _asp;
    } else {
        cvs.width = MAX_ID_CARD_H * _asp;
        cvs.height = MAX_ID_CARD_H;
    }
    ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
    var fileType = 'image/jpeg';
    var newImageData = cvs.toDataURL(fileType, 1);
    var sendData = newImageData.replace("data:" + fileType + ";base64,", '');
    console.warn("sendData size:" + sendData.length);
    var ndata = sendData;
    return ndata;
};

