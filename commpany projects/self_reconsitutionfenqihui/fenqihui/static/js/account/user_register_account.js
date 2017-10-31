'use strict';

controllerFunc('userRegisterAccount', 'userRegisterAccountController', function ($scope, $http, $timeout) {
    // 切换是否显示密码
    $('.swap_eye').bind('click', function () {
        var str = $('.swap_eye .eye_img')[0].src.match(/\/(\w+\.(?:png))$/i)[1];
        if (str == "open_eyes.png") {
            $('.swap_eye .eye_img').css('height', '.875rem');
            $('.swap_eye .eye_img').attr('src', "../../static/bitmap/account/close_eyes.png");
            $('.basic_password').attr('type', 'password');
        } else {
            $('.swap_eye .eye_img').css('height', '1.3rem');
            $('.swap_eye .eye_img').attr('src', "../../static/bitmap/account/open_eyes.png");
            $('.basic_password').attr('type', 'text');
        }
    });
    $("input").focus(function () {
        $("footer").hide();
    });

    var validCode = true;

    //  倒计时 timeout：倒计时时间参数
    $scope.backTime = function (time) {
        var code = $('.sms-bg');

        if (validCode) {
            validCode = false;

            var t = setInterval(function () {
                time--;
                code.html("重发  " + time + "秒");
                if (time == 0) {
                    clearInterval(t);
                    code.html("重新获取");
                    validCode = true;
                    $scope.getCodeClick = false;
                }
            }, 1000);
        } else {
            return false;
        }
    };

    // 手机是否正确
    $scope.isPhone = false;
    // 验证码是否正确
    $scope.isSms = false;
    //密码验证
    $scope.isPass = false;
    $scope.prompt_text = "";
    // 短信发送是否成功
    $scope.getCodeClick = false;
    // 短信验证是否被点击
    $scope.isClick = false;
    $scope.flag = false;

    var nativeType = getTypeNative();

    $scope.checkPhone = function () {
        var mobile = $scope.phone + "";
        if (mobile == null || mobile.length == 0) {
            $scope.prompt_text = '请输入手机号码！';
            $scope.isPhone = true;
            return false;
        }
        if (mobile.length != 11) {
            $scope.prompt_text = '请输入有效的手机号码！';
            $scope.isPhone = true;
            return false;
        }

        var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if (!myreg.test(mobile)) {
            $scope.prompt_text = '请输入有效的手机号码！';
            $scope.isPhone = true;
            return false;
        }
        return true;
    };

    $scope.$watch('password', function (newPassword, oldPassword) {
        if (newPassword == oldPassword) return;

        if ($scope.isClick && $scope.checkPhone() && $scope.checkSms()) {
            if (newPassword.length > 5) {
                $('.btn').removeClass('gray').addClass('blue');
                $scope.flag = true;
            } else {
                $('.btn').removeClass('blue').addClass('gray');
                $scope.flag = false;
            }
        }
    });

    $scope.checkSms = function () {
        var sms = $scope.sms + "";
        if (sms.length < 6) {
            $scope.isSms = true;
            $scope.prompt_text = '请输入验证码';
            return false;
        }
        return true;
    };

    //设置登录密码
    $scope.checkPassword = function () {
        var password = $scope.password + '';
        if (password.length < 6) {
            $scope.isPass = true;
            $scope.prompt_text = '请输入密码';
            return false;
        }

        if (!$scope.isClick) {
            return false;
        }

        if (!$scope.getCodeClick) {
            return false;
        }
        return true;
    };

    $scope.getSmsCode = function () {
        $scope.checkPhone();
        $scope.isClick = true;
        if ($scope.checkPhone() && !$scope.getCodeClick) {
            $scope.getCodePortSms();
        }
    };

    //  获取验证码接口--设置密码
    $scope.getCodePortSms = function () {
        $http({
            method: 'POST',
            url: BaseUrl + 'members/PhoneValidate',
            params: {
                'phoneNum': $scope.phone,
                'type': '3',
                'token': getToken()
            }
        }).success(function (response) {
            switch (response.result) {
                case '0000':
                    $scope.prompt_text = "发送成功";
                    $scope.backTime(60);
                    $scope.getCodeClick = true;
                    break;
                case '1007':
                    $scope.prompt_text = "输入手机号与注册手机号码不匹配!";
                    $('.prompt_box>p').css('font-size', '.7rem');
                    $scope.backTime(60);
                    prompt($scope.prompt_text);
                    $scope.getCodeClick = false;
                    break;
                case '9999':
                    $scope.prompt_text = "发送短信失败";
                    prompt($scope.prompt_text);
                    $scope.getCodeClick = false;
                    break;
                case '9998':
                    $scope.prompt_text = "系统异常";
                    prompt($scope.prompt_text);
                    $scope.getCodeClick = false;
                    break;
                case '1001':
                    $scope.prompt_text = "手机号无效";
                    prompt($scope.prompt_text);
                    $scope.getCodeClick = false;
                    break;
                case '1002':
                    $scope.prompt_text = "手机号已经被注册";
                    prompt($scope.prompt_text);
                    $scope.getCodeClick = false;
                    break;
                case '1005':
                    $scope.prompt_text = "用户不存在";
                    prompt($scope.prompt_text);
                    $scope.getCodeClick = false;
                    break;
                default:
                    $scope.getCodeClick = false;
                    break;
            }
        });
    };

    //设置登录密码
    $scope.setPassword = function () {
        if (!$scope.flag) {
            return;
        }
        if (!$scope.checkPhone() || !$scope.checkSms() || !$scope.checkPassword() || !$scope.getCodeClick || $scope.password.length < 6) {
            prompt("输入有误");
        } else {
            $http({
                method: 'POST',
                params: {
                    'token': getToken(),
                    'password': $scope.password,
                    'smsCode': $scope.sms,
                    'phoneNum': $scope.phone
                },
                url: BaseUrl + 'members/setLoginPwd'
            }).success(function (response) {

                switch (response.result) {
                    case '0000':
                        var url = '../../pages/account/user_login.html';
                        prompt("密码修改成功", url);
                        break;
                    case '1006':
                        $scope.prompt_text = '密码与支付密码不能相同';
                        prompt($scope.prompt_text);
                        break;
                    case '1102':
                        $scope.prompt_text = '手机验证码不正确或已过期';
                        prompt($scope.prompt_text);
                        break;

                    case '9999':
                        $scope.prompt_text = '网络加载失败，请重试';
                        prompt($scope.prompt_text);
                        break;
                    default:
                        mygoLogin();
                        break;
                }
            });
        }
    };

    function mygoLogin() {
        if (nativeType == 'ios') {
            goLogin();
        } else if (nativeType === 'android') {
            android.goLogin();
        } else {
            var url = window.location.href = getAbsolutePath() + '/fenqihui/pages/account/user_login.html';
            go_page(url, [{ 'toUrl': window.location.href }]);
        }
    }

    //提示
    function prompt(str, url) {
        $timeout(function () {
            if (str.length > 10) {
                $('.prompt_box>p').css('font-size', '.8rem');
                $scope.$apply(function () {
                    $scope.pro_text = str;
                });
            } else {
                $('.prompt_box>p').css('font-size', '1rem');
                $scope.$apply(function () {
                    $scope.pro_text = "亲，" + str;
                });
            }
        }, 100);
        $('#layer').css('display', 'block');
        $('.close_btn').click(function () {

            if (url) {
                mygoLogin();
            }
            $('#layer').css('display', 'none');
        });
    }
});