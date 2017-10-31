controllerFunc('userForgetLoginPassword', 'userForgetLoginPasswordController', function ($scope, $http, $timeout) {

    //  手机号校验结果
    $scope.resultPhone = false;
    //  验证码校验结果
    $scope.resultCode = false;
    //  倒计时开始
    $scope.resultTime = false;
    //  获取验证码按钮是否可用
    $scope.getCodeClick = true;

    var isClick = false;


    $scope.isSetPasswod = false;

    //  手机号校验
    $scope.blurPhone = function () {
        $scope.checkPhone();
        if ($scope.resultPhone) $scope.msg = "";
    };

    $scope.isMsg=true;
    //提示
    function prompt(str) {
        $scope.pro_text =str;
        $scope.isMsg=false;
        $timeout(function () {
            $scope.isMsg=true;
        }, 1000,true);
    }

    // 检查手机号是否正确
    $scope.checkPhone = function () {
        var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
        if ($scope.phoneNum == '' || $scope.phoneNum == null) {
            $scope.resultPhone = false;
            prompt('手机号不能为空！');
            return;
        } else if (!reg.test($scope.phoneNum)) {
            $scope.resultPhone = false;
            prompt("手机号输入错误！");
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
            $('#getCode-button').val("重发(" + time + ")").attr('disabled', 'disabled').css('background','#ccc');
            if (time <= 0) {
                clearInterval(timeController);
                $('#getCode-button').val("重新发送").removeAttr('disabled').css('background','#ef6f00');
                //按钮变为可用状态
                $scope.getCodeClick = true;
            }
        }, 1000);
    };

    $scope.codeUp=function () {
        if(isClick){
            if($scope.userCode.length==6 && $scope.userCode != "null"){
                $('.register-now ').removeClass('gray').addClass('blue');
                $scope.isSetPasswod = true;
            }else{
                $('.register-now ').removeClass('blue').addClass('gray');
                $scope.isSetPasswod = false;
            }
        }
    }

    //  获取验证码--设置登陆密码
    $scope.getCodeRegister = function () {
        $scope.checkPhone();
        if ($scope.resultPhone && $scope.getCodeClick) {
            $scope.msg = "";
            $scope.getCodeClick = false;
            $scope.getCodePortRegister();
        }
    };

//  获取验证码接口--设置密码
    $scope.getCodePortRegister = function () {

        $http({
            method: 'POST',
            url: BaseUrl + 'members/PhoneValidate',
            params: {
                'phoneNum': $scope.phoneNum,
                'type': '3',
                'token': getToken()

            }
        }).success(function (response) {
            switch (response.result) {
                case '0000':
                    prompt( "发送成功");
                    $scope.backTime(60);
                    isClick = true;
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
                case '4004':
                    prompt("登陆失效，请重新登陆");
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
            prompt("网络忙，请稍后再试");
        });

    };


    //  校验验证码规则
    $scope.checkCode = function () {
        if ($scope.userCode == "" || !$scope.userCode) {
            // prompt("验证码不能为空！");
            $scope.resultCode = false;
        } else {
            $scope.resultCode = true;
        }
    };


    $scope.changePassword = function () {
        if(!$scope.isSetPasswod) {
            return;
        }
        if (!$scope.phoneNum) {
            prompt("请输入手机号");
        } else if (!$scope.userCode) {
            prompt("请输入短信码");
        }

        $scope.checkPhone();
        $scope.checkCode();

        if ($scope.resultPhone && $scope.resultCode) {
            $http({
                method: 'POST',
                params: {
                    'token': getToken(),
                    'phoneNum': $scope.phoneNum,
                    'smsCode': $scope.userCode
                },
                url: BaseUrl + 'members/setPwdPhoneValidate'
            }).success(function (response) {
                if (response.result == '0000') {
                        window.location.href = '../../pages/account/user_set_account_psw.html' + "?v=" + Math.random();
                } else if (response.result == '1102') {
                    prompt("验证码错误");
                } else {
                    prompt("网络忙");
                }

            }).error(function () {
                prompt("网络忙");
            });

        } else {
            // prompt($scope.pro_text);
        }
    }


});