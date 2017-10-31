'use strict';

controllerFunc('userForgetPayPassword', 'userForgetPayPasswordController', function ($scope, $http, $timeout, $compile) {

    //  手机号校验结果
    $scope.resultPhone = false;
    //  验证码校验结果
    $scope.resultCode = false;
    //  倒计时开始
    $scope.resultTime = false;
    //  获取验证码按钮是否可用s
    $scope.getCodeClick = true;

    $scope.click = false;

    $scope.isSetPasswod = false;

    var str = "";
    //  手机号校验
    $scope.blurPhone = function () {
        $scope.checkPhone();
        if ($scope.resultPhone) $scope.msg = "";
    };

    //弹框提示
    $scope.isMsg = true;
    function prompt(str, url) {
        $scope.isMsg = false;
        $scope.pro_text = str;
        $timeout(function () {
            $scope.isMsg = true;
        }, 1000);
    }

    $scope.checkPhone = function () {
        var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
        if ($scope.phoneNum == '' || $scope.phoneNum == null) {
            $scope.resultPhone = false;
            prompt("手机号不能为空！");
            return false;
        } else if (!reg.test($scope.phoneNum)) {
            $scope.resultPhone = false;
            prompt('手机号输入有误');
            return false;
        } else {
            $scope.resultPhone = true;
        }
        return true;
    };

    //  倒计时 timeout：倒计时时间参数
    $scope.backTime = function (timeout) {
        var time = timeout;
        var timeController = setInterval(function () {
            time--;
            $('#getCode-button').val("重发(" + time + ")").attr('disabled', 'disabled').css('background', '#ccc');
            if (time <= 0) {
                clearInterval(timeController);
                $('#getCode-button').val("重新发送").removeAttr('disabled').css('background', '#ef6f00');
                //按钮变为可用状态
                $scope.getCodeClick = true;
            }
        }, 1000);
    };

    //  获取验证码--设置登陆密码
    $scope.getCodePay = function () {
        $scope.checkPhone();
        if ($scope.resultPhone && $scope.getCodeClick) {
            $scope.getCodeClick = false;
            $scope.getCodePortPay();
        }

        return true;
    };

    //  获取验证码接口--设置密码
    $scope.getCodePortPay = function () {
        $http({
            method: 'POST',
            url: BaseUrl + 'members/PhoneValidate',
            params: {
                'phoneNum': $scope.phoneNum,
                'type': '5',
                'token': getToken()

            }
        }).success(function (response) {
            switch (response.result) {
                case '0000':
                    $scope.backTime(60);
                    $scope.click = true;
                    prompt("发送短信成功");

                    break;
                case '9999':
                    prompt("发送短信失败");
                    $scope.getCodeClick = true;
                    break;
                case '9998':
                    prompt("系统异常");
                    $scope.getCodeClick = true;
                    break;
                case '1001':
                    prompt("手机号无效");
                    $scope.getCodeClick = true;
                    break;
                case '1002':
                    prompt("手机号已经被注册");
                    $scope.getCodeClick = true;
                    break;
                case '1005':
                    prompt("用户不存在");
                    $scope.getCodeClick = true;
                    break;
                case '1007':
                    prompt("输入手机号与注册时的手机号码不匹配!");
                    $scope.getCodeClick = true;
                    break;
                default:
                    $scope.getCodeClick = true;
                    break;
            }
        }).error(function () {
            prompt("网络忙");
        });
    };
    $scope.codeUp = function () {
        if ($scope.click && $scope.checkPhone()) {
            if ($scope.userCode.length == 6 && $scope.userCode != "null") {
                $('.register-now ').removeClass('gray').addClass('blue');
                $scope.isSetPasswod = true;
            } else {
                $('.register-now ').removeClass('blue').addClass('gray');
                $scope.isSetPasswod = false;
            }
        }
    };

    //  校验验证码规则
    $scope.checkCode = function () {
        if (!$scope.userCode) {
            $scope.userCode = "";
        }
        $scope.userCode += "";
        var str = $scope.userCode + "";
        if (str == "" || str == null) {
            prompt("验证码不能为空！");
            $scope.resultCode = false;
        } else if (str.length < 6) {
            prompt("验证码错误");
        } else {
            $scope.resultCode = true;
        }
    };

    //修改密码
    $scope.changePassword = function () {
        if (!$scope.isSetPasswod) {
            return;
        }

        $scope.checkCode();
        if ($scope.resultPhone && $scope.resultCode) {
            $http({
                method: 'POST',
                params: {
                    'token': getToken(),
                    'mobile': $scope.phoneNum,
                    'code': $scope.userCode
                },
                url: BaseUrl + 'account/toValiaMassage'
            }).success(function (response) {
                if (response.result == '0000') {
                    window.location.href = '../../pages/account/user_modify_password_confirm.html';
                } else if (response.result == '1102') {
                    prompt('验证码输入有误或过期');
                } else {
                    str = "网络异常";
                    prompt(str);
                }
            }).error(function () {
                str = "网络异常";
                prompt(str);
            });
        } else {
            if (!$scope.resultPhone) {
                str = "手机号输入错误";
            } else {
                str = "验证码输入错误";
            }
            prompt(str);
        }
    };
});