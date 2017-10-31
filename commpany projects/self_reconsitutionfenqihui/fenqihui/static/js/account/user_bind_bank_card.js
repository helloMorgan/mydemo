'use strict';

controllerFunc('userBindBank', 'userBindBankController', function ($scope, $http, $timeout) {
    //  手机号校验结果
    $scope.resultPhone = false;
    //  密码校验结果
    $scope.resultPassword = false;
    //  验证码校验结果
    $scope.resultCode = false;
    //  验证码发送状态显示弹窗
    $scope.codestate = false;
    //  倒计时开始
    $scope.resultTime = false;
    //  获取验证码按钮是否可用
    $scope.getCodeClick = true;

    $scope.isLoader = false;

    $scope.dialog = false;

    var flag = true;

    var loadDialog = new Dialog(DIALOG_LOAD);

    // $scope.phoneNum = '15140506380';
    var selectedBank = $(".bankList option:checked").val();
    var selectedPro = $(".proList option:checked").val();
    var selectedCity = $(".cityList option:checked").val();
    var selectedName = $(".bankList option:checked").text();

    $scope.prompt_text = "";
    // 提示方法
    function prompt(str, url) {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.pro_text = "亲，" + str;
            });
        }, 200);

        $('#layer').css('display', 'block');
        $('.close_btn').click(function () {
            $('#layer').css('display', 'none');
            if (url != null) {
                window.location.href = url;
            }
        });
    }

    // 原生方法
    function nativePrompt(str) {

        $timeout(function () {
            $scope.$apply(function () {
                $scope.pro_text = "亲，" + str;
            });
        }, 200);
        var naviveType = getTypeNative();
        $('#layer').css('display', 'block');
        $('.close_btn').click(function () {
            $('#layer').css('display', 'none');
            if (naviveType == 'android') {
                android.idCardBack();
            } else if (naviveType == 'ios') {
                idCardBack();
            } else {
                toIndex();
            }
        });
    }

    $scope.blurPhone = function () {
        $scope.checkPhone();
        selectedBank = $(".bankList option:checked").val();
        selectedPro = $(".proList option:checked").val();
        selectedCity = $(".cityList option:checked").val();
        if ($scope.resultPhone) $scope.msg = "";
    };

    $scope.$watch('userCode', function (newValue, oldValue) {
        if (oldValue == newValue) return;
        if ($scope.resultPhone) {
            if (newValue.length > 3 && selectedBank != '-1' && selectedPro != '-1' && selectedCity != '-1' && newValue != "null") {
                $('button').removeClass("gray").addClass("pink").removeAttr('disabled');
            } else {
                $('button').removeClass("pink").addClass("gray").attr('disabled', 'disabled');
            }
        }
    });

    $scope.checkPhone = function () {
        var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
        if ($scope.phoneNum == '' || $scope.phoneNum == null) {
            $scope.resultPhone = false;
            prompt('手机号不能为空！');
            return false;
        } else if (!reg.test($scope.phoneNum)) {
            $scope.resultPhone = false;
            prompt('手机号输入错误！');
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
            $('#getCode-button').val("重发(" + time + ")").attr('disabled', 'disabled');
            if (time <= 0) {
                clearInterval(timeController);
                $('#getCode-button').val("重新发送").removeAttr('disabled');
                //按钮变为可用状态
                $scope.getCodeClick = true;
            }
        }, 1000);
    };

    // 验证码
    $scope.blurCode = function () {
        $scope.checkCode();
    };
    $scope.checkCode = function () {
        if ($scope.userCode == "" || $scope.userCode == null) {
            $scope.resultCode = false;
            return;
        } else {
            $scope.resultCode = true;
        }
    };

    //  获取验证码--开户
    $scope.getCodeAccount = function () {
        $scope.checkPhone();
        if ($scope.resultPhone && $scope.getCodeClick) {
            $scope.getCodeClick = false;
            $scope.getCodePortAccount();
        }
    };
    //完成绑定
    $scope.complete = function () {
        if (flag) {
            flag = false;
            $scope.isLoader = true;
            $('button').attr('disabled', 'true');
            selectedName = $(".bankList option:checked").text();
            selectedBank = $(".bankList option:checked").val();
            selectedPro = $(".proList option:checked").val();
            selectedCity = $(".cityList option:checked").val();
            var myBankName = $(".bankList option:checked").attr('name');
            loadDialog.show();

            if (selectedPro != -1 && selectedBank != -1 && selectedCity != -1) {
                if ($scope.resultCode) {
                    $http({
                        method: 'POST',
                        params: {
                            'token': getToken(),
                            'code': $scope.userCode,
                            'mobileNo': $scope.phoneNum,
                            'bankCode': selectedBank,
                            'cityCode': selectedCity,
                            'proCode': selectedPro,
                            'capAcntNo': $scope.bankCode,
                            'bankName': myBankName
                        },
                        url: BaseUrl + 'account/openAccount'
                    }).success(function (response) {
                        if (response == undefined) {
                            var url = "./user_login.html";
                            prompt("登陆过期， 请重新登陆", url);
                        }
                        $scope.isLoader = false;

                        if (response.result == '0000') {
                            // var url = './user_forget_pay_password.html';
                            // prompt('绑卡成功', url);
                            nativePrompt('绑卡成功');
                            loadDialog.hide();
                            // nativePrompt('绑卡成功');
                        } else if (response.result == '2004') {
                            prompt('请填写各类选项');
                            loadDialog.hide();
                        } else if (response.result == '4009') {
                            prompt('网咯忙， 请稍后再试');
                            loadDialog.hide();
                        } else if (response.result == '4010') {
                            url = './user_add_card.html';
                            prompt('用户信息不一致', url);
                            loadDialog.hide();
                        } else if (response.result == '4011') {
                            prompt('请先实名验证');
                            loadDialog.hide();
                        } else if (response.result == '4012') {
                            prompt('短信验证码有误');
                            loadDialog.hide();
                        } else if (response.result == '2009') {
                            prompt('该银行卡已被其他帐号绑定');
                            loadDialog.hide();
                        } else {
                            // var url = './user_forget_pay_password.html';
                            // prompt('绑卡成功', url);
                            // TODO
                            var url = './user_add_card.html';
                            prompt('绑卡失败， 请重新绑定', url);
                            loadDialog.hide();
                            // nativePrompt('绑卡成功');
                        }
                    }).error(function (response) {
                        prompt('网络忙');
                        loadDialog.hide();
                    });
                }
            }
            $scope.isLoader = false;
        }
    };

    //  获取验证码接口-开户
    $scope.getCodePortAccount = function () {
        $http({
            method: 'POST',
            url: BaseUrl + 'members/PhoneValidate',
            params: {
                'phoneNum': $scope.phoneNum,
                'type': '2'
            }
        }).success(function (response) {
            //验证码发送状态弹窗显示
            $scope.codestate = true;
            setTimeout(function () {
                //验证码发送状态弹窗隐藏
                $scope.$apply(function () {
                    $scope.codestate = false;
                });
            }, 1000);
            switch (response.result) {
                case '0000':
                    $scope.state = "发送成功";
                    $scope.backTime(60);
                    break;
                case '9999':
                    $scope.prompt_text = "发送短信失败";
                    $scope.getCodeClick = true;
                    break;
                case '9998':
                    $scope.prompt_text = "系统异常";
                    prompt($scope.prompt_text);
                    $scope.getCodeClick = true;
                    break;
                case '1001':
                    $scope.prompt_text = "手机号无效";
                    prompt($scope.prompt_text);
                    $scope.getCodeClick = true;
                    break;
                case '1002':
                    $scope.prompt_text = "手机号已经被注册";
                    prompt($scope.prompt_text);
                    $scope.getCodeClick = true;
                    break;
                case '1005':
                    $scope.prompt_text = "用户不存在";
                    prompt($scope.prompt_text);
                    $scope.getCodeClick = true;
                    break;
                default:
                    $scope.getCodeClick = true;
                    break;
            }
        }).error(function (response) {
            $scope.prompt_text = "网络忙";
            prompt($scope.prompt_text);
        });
    };

    $(document).ready(function () {
        // $scope.isLoader = true;
        loadDialog.show();
        $scope.dialog = true;
        //页面加载
        var temp = window.location.href.split('?');
        var tempUrl = Decrypt(temp[1], "333");
        var tempData = tempUrl.split('&');

        $scope.bankCode = tempData[0].split('=')[1];
        $scope.name = tempData[1].split('=')[1];

        if ($scope.name != undefined && $scope.bankCode != undefined) {
            $http({
                method: 'POST',
                params: {
                    'token': getToken(),
                    'realName': $scope.name,
                    'capAcntNo': $scope.bankCode
                },
                url: BaseUrl + 'account/openAccountFirst'
            }).success(function (response) {
                if (response.result == SUCCESS_CODE) {
                    // $scope.isLoader = false;
                    loadDialog.hide();
                    var result = response.result;

                    if (!response || !response.data) {
                        var url = "./user_login.html";
                        prompt("登陆过期， 请重新登陆", url);
                    }
                    var data = response.data;
                    var bankList = data.bankList;
                    var proList = data.proList;
                    var cityList = data.cityList;
                    for (var i = 0; i < bankList.length; i++) {
                        $(".bankList").append("<option value=" + bankList[i].bankCode + " name=" + bankList[i].bankName + ">" + bankList[i].bankName + "</option>");
                    }

                    $(proList).each(function (idexs, eles) {
                        $(".proList").append("<option value=" + eles.proCode + ">" + eles.proName + "</option>");
                    });

                    $('.proList').change(function () {
                        // 清空下拉列表
                        $(".cityList option").remove();
                        $(".cityList").append("<option value=>请选择地</option>");
                        var option2 = '';
                        var selectedIndex = $(".proList option:checked").val();

                        $(cityList).each(function (idex, ele) {
                            if (selectedIndex == ele.cityCode) {
                                $(".cityList").append("<option value=" + ele.proCode + ">" + ele.cityName + "</option>");
                            }
                        });
                    });
                } else {
                    // $scope.isLoader = false;
                    loadDialog.hide();
                    $scope.prompt_text = "网络繁忙";
                    prompt($scope.prompt_text);
                }
            }).error(function (response) {
                // $scope.isLoader = false;
                loadDialog.hide();
                $scope.prompt_text = "网络忙";
                prompt($scope.prompt_text);
            });
        } else {
            $scope.prompt_text = "数据加载失败， 请重新绑定";
            var url = '../../pages/account/user_add_card.html';
            prompt($scope.prompt_text, url);
            // $scope.isLoader = false;
            loadDialog.hide();
        }
    });
});