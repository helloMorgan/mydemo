/**
 * Created by yu on 2017/3/6.
 */
/**
 * Created by ZHB on 2016/10/29.
 */

var app = angular.module('loginApp', []);
app.controller('loginCtrl', ['$scope', '$http', '$timeout', function ($scope, $http, $timeout) {
//  注册遮罩层隐藏
    $scope.register = {'display': 'none'};
//  手机号校验结果
    $scope.resultPhone = false;
//  密码校验结果
    $scope.resultPassword = false;
//  验证码校验结果
    $scope.resultCode = false;
//  倒计时开始
    $scope.resultTime = false;
//  获取验证码按钮是否可用
    $scope.getCodeClick = true;
    //阅读协议
    $scope.isReadDeal = true;
    //验证码获取状态
    $scope.codeSend=false;

    //app类型
    $scope.app = getTypeNative();

//  清除输入框中的内容
    $scope.clearInput = function ($event) {
        $scope.phoneNum = '';
    };
//  输入框清除按钮显示/隐藏
    $scope.clearShow = {
        display: 'block'
    };
    $scope.clearHidden = {
        display: 'none'
    };

    $scope.agreeDeal = function () {
        $scope.isReadDeal = !$scope.isReadDeal;
    };

    //todo 判断是否是普惠家用户  如果是则直接实名成功

    $scope.toRealName = function () {
        var token = getToken();
        if ($scope.app) {
            if ($scope.app === 'ios') {
                if (window.webkit) {
                    window.webkit.messageHandlers.realNameAuthentication.postMessage({token: token});
                } else {
                    realNameAuthentication(getToken());
                }
            } else if ($scope.app === 'android') {
                android.realNameAuthentication(getToken());
            } else if ($scope.app === 'weixin') {
                go_page('../travel/travel_upload_cdCard.html');
            }
        }
        else {
            go_page('../../pages/recommended/recommended_index.html');
        }

    };

//  手机号校验
    $scope.blurPhone = function () {
        $scope.checkPhone();

    };
    $scope.checkPhone = function () {
        var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
        if ($scope.phoneNum == '' || $scope.phoneNum == null) {
            $scope.resultPhone = false;
            promptMsg("* 手机号不能为空！");
            return;
        }
        else if (!reg.test($scope.phoneNum)) {
            $scope.resultPhone = false;
            promptMsg("* 手机号输入错误！");
            return;
        } else {
            $scope.resultPhone = true;
        }

    };

//  倒计时 timeout：倒计时时间参数
    $scope.backTime = function (timeout) {
        var time = timeout;
        var timeController = setInterval(function () {
            time--;
            $('#getCode-button').val("重发(" + time + ")").attr('disabled', 'disabled').css('background', '#AAAAAA');
            if (time <= 0) {
                clearInterval(timeController);
                $('#getCode-button').val("重新发送").removeAttr('disabled').css('background', '#ebc023');
                //按钮变为可用状态
                $scope.getCodeClick = true;
            }
        }, 1000)

    };

//  获取验证码--注册
    $scope.getCodeRegister = function () {
        $scope.checkPhone();
        if ($scope.resultPhone && $scope.getCodeClick) {
            $scope.getCodeClick = false;
            $scope.getCodePort('0000');

        }
    };
//    提示信息弹窗
    function promptMsg(msg) {
        $scope.state=msg;
        $scope.codestate = {'display': 'block'};
        $timeout(function () {
            $scope.codestate = {'display': 'none'};
        }, 1000);
    }

//  获取验证码接口
    $scope.getCodePort = function (type) {
        $http({
            method: 'POST',
            url: BaseUrl + 'members/PhoneValidate',
            params: {
                'phoneNum': $scope.phoneNum,
                'type': type,
                'plat': 1
            }
        }).then(function (response) {
            switch (response.data.result) {
                case '0000':
                    $scope.codeSend=true;
                    promptMsg("发送成功");
                    $scope.backTime(60);
                    break;
                case '9999':
                    promptMsg("发送成功");
                    $scope.getCodeClick = true;
                    break;
                case '9998':
                    promptMsg("系统异常");
                    $scope.getCodeClick = true;
                    break;
                case '1001':
                    promptMsg("手机号无效");
                    $scope.getCodeClick = true;
                    break;
                case '1002':
                    promptMsg("手机号已经被注册");
                    $scope.getCodeClick = true;
                    break;
                case '1005':
                    promptMsg("用户不存在");
                    $scope.getCodeClick = true;
                    break;
                default:
                    promptMsg(response.data.message);
                    $scope.getCodeClick = true;
                    break;
            }
        }, function () {
            alert('网络异常！')
        });
    };


//  校验验证码规则
    $scope.blurCode = function () {
        $scope.checkCode();
    };
    $scope.checkCode = function () {
        if ($scope.userCode == "" || $scope.userCode == null) {
            promptMsg("* 验证码不能为空！")
            $scope.resultCode = false;
            return;
        }
        else {
            $scope.resultCode = true;
        }
    };

    //    登录成功，执行的函数
    $scope.loginSuccess = function (token) {
        // localStorage.removeItem("fqhy_token");

        var typeNative = getTypeNative();
        switch (typeNative) {
            case 'ios':
                if (window.webkit) {
                    window.webkit.messageHandlers.setToken.postMessage({token: token});
                } else {
                    setToken(token);
                }

                $('.login-head').css('marginTop', '1.1rem');
                break;
            case 'android':
                android.setToken(token);
                $('.login-head').css('marginTop', '1.1rem');
                break;
        }

        promptMsg("登录成功！正在跳转……")
        //跳转到登录之前的页面  此时获取为完整参数  先获取toUrl 之后的完整内容再进行解码
        let href = GetQueryString('toUrl');
        if (GetQueryString("toUrl") != null && GetQueryString("toUrl").length > 1) {
            if (href.indexOf('?') > 0) {
                window.location.href = decodeURI(href + "&isLogin=1");
            } else {
                window.location.href = decodeURI(href + "?isLogin=1");
            }
        } else {
            window.location.href = "../../pages/recommended/recommended_index.html";
        }
    };

    $scope.backHistory = ()=>{history.go(-1)};

//  注册
    $scope.registerNow = function () {

        if ($scope.isReadDeal) {
            $scope.checkPhone();
            if($scope.resultPhone){
                if($scope.codeSend){
                    $scope.checkCode();
                    if ( $scope.resultCode == true) {
                        // $scope.register = {'display': 'block'};
                        // $('.register-shelter').animateCss('bounceInDown');

                        $http({
                            method: 'POST',
                            url: BaseUrl + 'members/registOrLogin',
                            params: {
                                'phoneNum': $scope.phoneNum,
                                'code': $scope.userCode,
                                'from': '3'
                            }
                        }).then(function (response) {
                            //验证码发送状态弹窗显示
                            promptMsg(response.data.message);
                            switch (response.data.result) {
                                case '0000':
                                    localStorage.setItem("fqhy_token", response.data.token);
                                    localStorage.setItem("realName", false);
                                    $scope.flag = response.data.flag;

                                    if (response.data.status == '1' || $scope.flag == '1') {
                                        $scope.loginSuccess(response.data.token);
                                    } else {
                                        $scope.register = {'display': 'block'};
                                        $('.register-shelter').animateCss('bounceInDown');
                                    }
                                    break;
                            }
                        }, function () {
                            alert('网络异常！')
                        });


                    } else {
                        $scope.register = false;
                    }
                }else{
                    promptMsg("请先获取验证码");
                }
            }
        } else {
            promptMsg("请先阅读协议")
        }
    };
    $scope.shelterHidden = function () {
        $scope.register = {'display': 'none'};
    };
//   跳过实名完成注册
    $scope.registerSuccess = function () {
        // 若是普惠家用户 直接进入首页
        go_page('../../pages/travel/decoration_order.html');
    };


}]);






