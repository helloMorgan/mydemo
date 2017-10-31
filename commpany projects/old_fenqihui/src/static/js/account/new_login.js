/**
 *
 * Created by yu on 2017/4/11.
 */


var app = controllerFunc('newLoginApp', 'newLoginCtrl', function ($scope, $http, $timeout) {
    $scope.msText = "获取验证码";
    //  注册遮罩层隐藏
    $scope.register = {'display': 'none'};
    //阅读协议
    $scope.isReadDeal = true;
    //  获取验证码按钮是否可用
    $scope.getCodeClick = true;

    $scope.state = "1111111111";

    //验证码获取状态
    $scope.codeSend = false;


    //  手机号校验结果
    $scope.resultPhone = false;

    $scope.backTime = function () {
        var timeout = 60;

        $scope.msText = timeout + "秒后重新获取";
        $scope.msStyle = {'fontSize': ".55rem"};
        var timeController = setInterval(function () {
            timeout--;
            $scope.$apply(function () {
                $scope.msText = timeout + "秒后重新获取";
            });
            if (timeout <= 0) {
                clearInterval(timeController);
                $scope.msStyle = {'fontSize': ".8rem"};
                $scope.$apply(function () {
                    $scope.msText = "重新发送";
                });
                //按钮变为可用状态
                $scope.getCodeClick = true;
            }
        }, 1000)
    };

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
                    $scope.codeSend = true;
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

    //检测手机规则
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



    $scope.toRealName = function () {
        go_page('../travel/travel_upload_cdCard.html');

    };




    //  校验验证码规则
    $scope.checkCode = function () {
        if ($scope.userCode == "" || $scope.userCode == null) {
            promptMsg("* 验证码不能为空！");
            $scope.resultCode = false;
            return;
        }
        else {
            $scope.resultCode = true;
        }
    };

    var clickLogin = true;
    //  注册
    $scope.login = function () {

        if(clickLogin) {
            clickLogin = false;
            if ($scope.isReadDeal) {
                $scope.checkPhone();
                if ($scope.resultPhone) {
                    if ($scope.codeSend) {
                        $scope.checkCode();
                        if ($scope.resultCode == true) {
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
                                clickLogin = true;
                                //验证码发送状态弹窗显示
                                promptMsg(response.data.message);
                                switch (response.data.result) {
                                    case '0000':
                                        localStorage.setItem("fqh_token", response.data.token);
                                        // localStorage.setItem("realName", false);
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
                                clickLogin = true;
                                alert('网络异常！')
                            });


                        } else {
                            clickLogin = true;
                            $scope.register = false;
                        }
                    } else {
                        clickLogin = true;
                        promptMsg("请先获取验证码");
                    }
                }
            } else {
                clickLogin = true;
                promptMsg("请先阅读协议")
            }
        }

    };


    //    登录成功，执行的函数
    $scope.loginSuccess = function (token) {

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



    //  获取验证码--注册
    $scope.getCode = function () {
        $scope.checkPhone();
        if ($scope.resultPhone && $scope.getCodeClick) {
            $scope.getCodeClick = false;
            $scope.getCodePort('0000');
        }
    };

    //  清除输入框中的内容
    $scope.clearInput = function () {
        $scope.phoneNum = '';
    };

    $scope.agreeDeal = function () {
        $scope.isReadDeal = !$scope.isReadDeal;
    };

    $scope.shelterHidden = function () {
        $scope.register = {'display': 'none'};
    };


    //    提示信息弹窗
    function promptMsg(msg) {
        $scope.state = msg;
        $scope.codestate = {'display': 'block'};
        $timeout(function () {
            $scope.codestate = {'display': 'none'};
        }, 1000);
    }

    //   跳过实名完成注册
    $scope.registerSuccess = function () {
        // 若是普惠家用户 直接进入首页
        go_page('../../pages/recommended/recommended_index.html');
    };

});