controllerFunc('userSetAccount', 'userSetAccountController', function($scope, $http) {
    //  校验失败提示信息
    $scope.msg = '';
    //  手机号校验结果
    $scope.resultPhone = false;
    //  验证码校验结果
    $scope.resultCode = false;
    //  倒计时开始
    $scope.resultTime = false;
    //  获取验证码按钮是否可用
    $scope.getCodeClick = true;
    //  验证码发送状态显示弹窗
    $scope.codestate = false;
    //  密码校验结果
    $scope.resultPassword = false;


    //  手机号校验
    $scope.blurPhone = function() {
        $scope.checkPhone();
        if ($scope.resultPhone) $scope.msg = "";
    }
    $scope.checkPhone = function() {
        var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
        if ($scope.phoneNum == '' || $scope.phoneNum == null) {
            $scope.resultPhone = false;
            $scope.msg = '* 手机号不能为空！';
            return;
        } else if (!reg.test($scope.phoneNum)) {
            $scope.resultPhone = false;
            $scope.msg = "* 手机号输入错误！";
            return;
        } else {
            $scope.resultPhone = true;
        }

    }

    //  倒计时 timeout：倒计时时间参数
    $scope.backTime = function(timeout) {
        var time = timeout;
        var timeController = setInterval(function() {
            time--;
            $('#getCode-button').val("重发(" + time + ")").attr('disabled', 'disabled').css('background', '#AAAAAA');
            if (time <= 0) {
                clearInterval(timeController);
                $('#getCode-button').val("重新发送").removeAttr('disabled').css('background', '#ebc023');
                //按钮变为可用状态
                $scope.getCodeClick = true;
            }
        }, 1000)

    }


    //  获取验证码--注册
    $scope.getCodeRegister = function() {
        $scope.checkPhone();
        if ($scope.resultPhone && $scope.getCodeClick) {
            $scope.msg = "";
            $scope.getCodeClick = false;
            $scope.getCodePortRegister();

        }
    };

    //  获取验证码接口--注册
    $scope.getCodePortRegister = function() {
        $http({
            // timeout:10,
            method: 'POST',
            url: BaseUrl + 'members/PhoneValidate',
            params: {
                'phoneNum': $scope.phoneNum,
                'type': '1'
            }
        }).success(function(response) {
            // response={
            //     result:'0000'
            // }
            //验证码发送状态弹窗显示
            $scope.codestate = { 'display': 'block' };
            setTimeout(function() {
                //验证码发送状态弹窗隐藏
                $scope.$apply(function() {
                    $scope.codestate = { 'display': 'none' };
                })
            }, 1000)
            switch (response.result) {
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

        });
    };

    //  获取验证码--设置密码
    $scope.getCodeFind = function() {
        $scope.checkPhone();
        if ($scope.resultPhone && $scope.getCodeClick) {
            $scope.msg = "";
            $scope.getCodeClick = false;
            $scope.getCodePortFind();
        }
    };

    //  获取验证码接口--设置密码
    $scope.getCodePortFind = function() {
        $http({
            // timeout:10,
            method: 'POST',
            url: BaseUrl + '/members/PhoneValidate',
            params: {
                'phoneNum': $scope.phoneNum,
                'type': '3',
                'token': getToken()
            }
        }).success(function(response) {
            // response={
            //     result:'0000'
            // }
            //验证码发送状态弹窗显示
            $scope.codestate = { 'display': 'block' };
            setTimeout(function() {
                //验证码发送状态弹窗隐藏
                $scope.$apply(function() {
                    $scope.codestate = { 'display': 'none' };
                })
            }, 1000)
            switch (response.result) {
                case '0000':
                    $scope.state = "发送成功";
                    $scope.backTime(60);
                    break;
                case '9999':
                    $scope.state = "发送短信失败";
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

        });
    };

    //  校验验证码规则
    $scope.blurCode = function() {
        $scope.checkCode();
        if ($scope.resultCode) $scope.msg = "";
    }
    $scope.checkCode = function() {
        if ($scope.userCode == "" || $scope.userCode == null) {
            $scope.msg = "* 验证码不能为空！";
            $scope.resultCode = false;
            return;
        } else {
            $scope.resultCode = true;
        }
    };

    //  密码校验
    $scope.blurPassword = function() {
        $scope.checkPassword();
        if ($scope.resultPassword) $scope.msg = "";
    };
    $scope.checkPassword = function() {
        var reg = /^([a-z]|[A-Z]|[0-9]){6,16}$/;
        if ($scope.userPassword == '' || $scope.userPassword == null) {
            $scope.msg = "* 密码不能为空！";
            $scope.resultPassword = false;
            return;
        } else if (!reg.test($scope.userPassword)) {
            $scope.msg = "* 密码错误，请输入6-16位数字字母组合密码！";
            $scope.resultPassword = false;
            return;
        } else {
            $scope.resultPassword = true;
        }
    };

    //userPassword
    $scope.setPassword = function() {
        if ($scope.resultPhone && $scope.resultCode && $scope.resultPassword) {
            $http({
                // timeout:10,
                method: 'POST',
                url: BaseUrl + 'members/setLoginPwd',
                params: {
                    'token': getToken(),
                    'password': $scope.userPassword,
                    'smsCode': $scope.userCode,
                    'phoneNum': $scope.phoneNum,

                }
            }).success(function(response) {
                if (response.result === '0000') {
                    //TODO 弹窗提示
                    alert('设置密码成功');
                    window.location.href = '/user_login.html' + "?v="+Math.random();
                }
            }).error(function(response) {
                //TODO 错误提示
            });
        }
    }






});