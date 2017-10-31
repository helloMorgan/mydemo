controllerFunc('userDconfirm', 'userDconfirmController', function($scope, $http) {
    'use strict';
    var keys = $('#keybord ul li'),
        wrap = $('#pass_show li'),
        len = 6,
        i = 0,
        password = [];

    var nativeType = getTypeNative();

    if(nativeType == 'ios') {
        $('#keybord ul li').bind('touchstart touchend', function(e) {
            var _index = $(this).index(),
                key_value = $(keys.eq(_index)).children('i').html();
            if (_index === 11) {
                updateValue('remove');
            } else {
                password.push(key_value);
                updateValue('*');
            }
        });
    } else {
        $('#keybord ul li').bind('click', function(e) {
            var _index = $(this).index(),
                key_value = $(keys.eq(_index)).children('i').html();
            if (_index === 11) {
                updateValue('remove');
            } else {
                password.push(key_value);
                updateValue('*');
            }
        });
    }



    function prompt2(str, url) {
        $scope.$apply(function() {
            $scope.pro_text =str;
        });
        $('#layer').css('display', 'block');
        $('.close_btn').click(function() {
            $('#layer').css('display', 'none');
            if (url != null) {
                go_page(url);
            }
        });
    }

    function prompt(str, url) {
        $scope.pro_text = "亲，" + str;
        $('#layer').css('display', 'block');
        $('.close_btn').click(function() {
            $('#layer').css('display', 'none');
            if (url != null) {
                go_page(url);
            }
        });
    }

    function nativePrompt(str) {
        $scope.pro_text =str;
        var naviveType = getTypeNative();

        $('#layer').css('display', 'block');
        $('.close_btn').click(function() {
            $('#layer').css('display', 'none');
            if (naviveType == 'android') {
                android.idCardBack();
            } else if (naviveType == 'ios') {
                backAccount();
            } else {
                var url = '../../pages/recommended/recommended_index.html';
                prompt("支付密码设置成功", url);
            }

        });
    }


    function updateValue(pass) {
        if (pass === 'remove') {
            wrap.eq(--i).html('');
            password.pop();
            return;
        }
        wrap.eq(i).html(pass);
        i++;
        if (i === len) {
            // 用户输入的密码
            var str = password.join("");

            var pass = GetQueryString('pass');
            if (str == pass) {
                $http({
                    method: 'POST',
                    params: {
                        'token': getToken(),
                        'payPwd': str,
                    },
                    url: BaseUrl + 'account/modifyPayPwd'
                }).success(function(response) {
                    if (response.result == '0000') {

                        // 调用原生方法
                        nativePrompt("恭喜您， 设置成功");


                    } else {
                        var url = "account/user_forget_pay_password.html"
                        prompt("系统错误， 请重新修改", url);
                    }


                }).error(function(response) {
                    prompt("网络忙， 请重新修改");
                });
            } else {
                $scope.pro_text = '两次密码输入不一致';
                prompt2("两次密码输入不一致");
            }
        }
    }

});