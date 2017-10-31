/**
 * Created by ZHB on 2016/10/29.
 */

var app = angular.module('myApp', []);
app.controller('myCtrl', ['$scope', '$http', function ($scope, $http) {

//  校验失败提示信息
    $scope.msg = '';
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

    //app类型
    $scope.app = getTypeNative();

//  验证码发送状态显示弹窗
    $scope.codestate = false;
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
        if ($scope.resultPhone) $scope.msg = "";
    };
    $scope.checkPhone = function () {
        var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
        if ($scope.phoneNum == '' || $scope.phoneNum == null) {
            $scope.resultPhone = false;
            $scope.msg = '* 手机号不能为空！';
            return;
        }
        else if (!reg.test($scope.phoneNum)) {
            $scope.resultPhone = false;
            $scope.msg = "* 手机号输入错误！";
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
            $scope.msg = "";
            $scope.getCodeClick = false;
            $scope.getCodePort('1');

        }
    };

//  获取验证码接口
    $scope.getCodePort = function (type) {
        $http({
            method: 'POST',
            url: BaseUrl + 'members/PhoneValidate',
            params: {
                'phoneNum': $scope.phoneNum,
                'type': type
            }
        }).then(function (response) {
            //验证码发送状态弹窗显示
            $scope.codestate = {'display': 'block'};
            setTimeout(function () {
                //验证码发送状态弹窗隐藏
                $scope.$apply(function () {
                    $scope.codestate = {'display': 'none'};
                })
            }, 1000);
            switch (response.data.result) {
                case '0000':
                    $scope.state = "发送成功";
                    $scope.backTime(60);
                    break;
                case '9999':
                    $scope.state = "发送短信失败";
                    $scope.getCodeClick = true;
                    break;
                case '9998':
                    $scope.state = "系统异常";
                    $scope.getCodeClick = true;
                    break;
                case '1001':
                    $scope.state = "手机号无效";
                    $scope.getCodeClick = true;
                    break;
                case '1002':
                    $scope.state = "手机号已经被注册";
                    $scope.getCodeClick = true;
                    break;
                case '1005':
                    $scope.state = "用户不存在";
                    $scope.getCodeClick = true;
                    break;
                default:
                    $scope.getCodeClick = true;
                    break;
            }

        }, function () {
            alert('网络异常！')
        });
    }

//  获取验证码--找回密码
    $scope.getCodeFind = function () {
        $scope.checkPhone();
        if ($scope.resultPhone && $scope.getCodeClick) {
            $scope.msg = "";
            $scope.getCodeClick = false;
            $scope.getCodePort('4');

        }
    };


//  密码校验
    $scope.blurPassword = function () {
        $scope.checkPassword();
        if ($scope.resultPassword) $scope.msg = "";
    }
    $scope.checkPassword = function () {
        var reg = /^([a-z]|[A-Z]|[0-9]){6,16}$/;
        if ($scope.userPassword == '' || $scope.userPassword == null) {
            $scope.msg = "* 密码不能为空！";
            $scope.resultPassword = false;
            return;
        }
        else if (!reg.test($scope.userPassword)) {
            $scope.msg = "* 密码错误，请输入6-16位数字字母组合密码！";
            $scope.resultPassword = false;
            return;
        } else {
            $scope.resultPassword = true;
        }
    }

//  校验验证码规则
    $scope.blurCode = function () {
        $scope.checkCode();
        if ($scope.resultCode) $scope.msg = "";
    }
    $scope.checkCode = function () {
        if ($scope.userCode == "" || $scope.userCode == null) {
            $scope.msg = "* 验证码不能为空！";
            $scope.resultCode = false;
            return;
        }
        else {
            $scope.resultCode = true;
        }
    }

//  密码眼睛
    $scope.passwordEye = function ($event) {
        if ($('.login-eye').prev().attr('type') == 'password') {
            $('.login-eye').prev().attr('type', 'text');
            $('.login-eye').html("&#xe634;").css('color', '#EC6700');
        } else {
            $('.login-eye').prev().attr('type', 'password');
            $('.login-eye').html("&#xe621;").css('color', '#2b677b');
        }
    }
//  注册
    $scope.registerNow = function () {

        if ($scope.isReadDeal) {
            $scope.checkPassword();
            $scope.checkCode();
            $scope.checkPhone();
            if ($scope.resultPhone = true && $scope.resultCode == true && $scope.resultPassword == true) {
                $scope.msg = "";
                $scope.register = {'display': 'block'};
                $('.register-shelter').animateCss('bounceInDown');
            } else {
                $scope.register = false;
            }
        } else {
            $scope.codestate = {'display': 'block'};
            $scope.state = "请先阅读协议";
            setTimeout(function () {
                $scope.$apply(() => {
                    $scope.codestate = {'display': 'none'};
                })
            }, 1000)
        }
    };
    $scope.shelterHidden = function () {
        $scope.register = {'display': 'none'};
    };
//   跳过实名完成注册
    $scope.registerSuccess = function () {
        var params = {
            'phoneNum': $scope.phoneNum,
            'password': $scope.userPassword,
            'code': $scope.userCode,
            'from': '3'
        };
        $http({
            // timeout:100,
            method: 'POST',
            url: BaseUrl + '/members/regist',
            params: params
        }).success(function (response) {
            $scope.codestate = {'display': 'block'};
            setTimeout(function () {
                //验证码发送状态弹窗隐藏
                $scope.$apply(function () {
                    $scope.codestate = {'display': 'none'};
                })
            }, 1000);
            //todo ； add register from puhuijia go_page index but realNmae success
            switch (response.result) {
                case '1001':
                    $scope.state = "手机号无效";
                    $scope.register = {'display': 'none'};
                    break;
                case '1002':
                    $scope.state = "该手机号已被注册";
                    $scope.register = {'display': 'none'};
                    break;
                case '1003':
                    $scope.state = "请输入6-16位长度密码";
                    $scope.register = {'display': 'none'};
                    break;
                case '1102':
                    $scope.state = "验证码输入有误或过期";
                    $scope.register = {'display': 'none'};
                    break;
                case '0000':

                    $scope.state = "注册成功,正在跳转中...";
                    // 若是普惠家用户 直接进入首页
                    if (status == 1 && accountStatus == 1) {
                        go_page('../../pages/recommended/recommended_index.html');
                    }

                    $scope.register = {'display': 'none'};
                    localStorage.removeItem("fqhy_token");
                    localStorage.setItem("fqhy_token", response.token);
                    //注册成功跳转至首页
                    setTimeout(function () {
                        if ($scope.app) {
                            if ($scope.app === 'ios') {
                                backHome();
                            } else if ($scope.app === 'android') {
                                android.backHome();
                            }
                        }
                        else {
                            go_page('../../pages/recommended/recommended_index.html');
                        }
                    }, 1000);
                    break;
                default:
                    $scope.state = "未知错误，请重新注册！";
                    $scope.register = {'display': 'none'};
                    break;
            }

        });
    };
//  找回密码
    $scope.findPassword = function () {
        $scope.checkPassword();
        $scope.checkCode();
        $scope.checkPhone();
        if ($scope.resultPhone = true && $scope.resultCode == true && $scope.resultPassword == true) {
            $scope.msg = "";
            var params = {
                'phoneNum': $scope.phoneNum,
                'password': $scope.userPassword,
                'smsCode': $scope.userCode
            };
            $http({
                method: 'POST',
                url: BaseUrl + '/members/updateLoginPwd',
                params: params
            }).success(function (response) {
                // response={
                //     result:'0000'
                // }
                $scope.codestate = {'display': 'block'};
                setTimeout(function () {
                    //验证码发送状态弹窗隐藏
                    $scope.$apply(function () {
                        $scope.codestate = {'display': 'none'};
                    })
                }, 1000);
                switch (response.result) {
                    case '1102':
                        $scope.state = "手机验证码不正确或已过期";
                        break;
                    case '1005':
                        $scope.state = "用户不存在";
                        break;
                    case '1006':
                        $scope.state = "密码与支付密码不能相同";
                        break;
                    case '9999':
                        $scope.state = "失败（系统内部错误）";
                        break;
                    case '0000':
                        $scope.state = "密码修改成功";
                        //修改密码成功跳转至登录页
                        setTimeout(function () {
                            window.location.href = '../../pages/account/user_login.html';
                        }, 1000);
                        break;
                    default:
                        break;
                }

            });
        }
    }
}]);






