'use strict';

controllerFunc('userSet', 'userSetController', function ($scope, $http) {
    // 判断用户是否实名
    $scope.realName = false;
    // 是否显示 退出登陆
    $scope.isDisplay = false;
    //去除设置用户名时的变量
    var TOKEN = getToken();
    //客服电话弹窗
    $scope.hotLine = function () {
        $('.hotline').bind('click', function () {
            $(".popWindow2").css('display', 'block');
            $('.bomb_box').css('display', 'block');
            $(".popWindow2").bind('click', function () {
                $(".popWindow2").css('display', 'none');
                $('.bomb_box').css('display', 'none');
            });

            $('#cancel_phone').bind('click', function () {
                $(".popWindow2").css('display', 'none');
                $('.bomb_box').css('display', 'none');
            });
        });
    };
    //提示
    $scope.prompt_text = "";
    function prompt(str) {
        $scope.pro_text = "亲，" + str;
        $('#layer').css('display', 'block');
        $('.close_btn').click(function () {
            $('#layer').css('display', 'none');
            $scope.isDisplay = false;
            $scope.$apply();
        });
    }

    // // 版本更新弹窗
    // $scope.noUpdate = function() {
    //     $('.update_version').bind('click', function() {
    //         $(".popWindow").css('display', 'block');
    //
    //         $(".close_btn").bind('click', function() {
    //             $(".popWindow").css('display', 'none');
    //         });
    //     });
    // };

    //判断设备
    $scope.judgmenEquipment = function () {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        if (isAndroid) {
            return 'android';
        } else if (isiOS) {
            return 'ios';
        } else {
            return 'wap';
        }
    };
    //取消
    $scope.cancel = function () {
        $scope.isDisplay = false;
    };
    // 确认
    $scope.confirm = function () {
        $http({
            method: 'POST',
            params: {
                'token': getToken(),
                'from': CLIENT_SOURCE
            },
            url: BaseUrl + 'members/logout'
        }).success(function (response) {
            if (response.result === SUCCESS_CODE) {
                localStorage.removeItem('fqh_token');
                $scope.isDisplay = false;
                go_page('../../pages/recommended/recommended_index.html');
            } else {
                localStorage.removeItem('fqh_token');
                $scope.isDisplay = false;
                go_page("../../pages/account/new_login.html");
            }
        }).error(function (response) {
            localStorage.removeItem('fqh_token');
            $scope.isDisplay = false;
            go_page("../../pages/account/new_login.html");
        });
    };

    // 退出登陆
    $scope.lagout = function () {
        $scope.isDisplay = true;
    };
});