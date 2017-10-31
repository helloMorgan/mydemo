/**
 * Created by Timor on 2016/11/3.
 */


var app = angular.module('loginApp', []);
app.controller('loginCtrl', ['$scope', '$http', function ($scope, $http) {
    // BaseUrl="http://10.106.0.128:8080/phj_fqhy_business_web";
    //提示信息
    $scope.msg = "";
    //登录状态
    $scope.codestate = false;
    //记住密码
    // $scope.remPass=true;
    //登录判断条件
    $scope.isPhone = false;
    $scope.isPassword = false;

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

    $scope.backHistory = () => {
        history.go(-1)
    };

    if (isOpenInWeixin()) {
        // $('.login-head-tag').css('display','none');
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
    };

    //用户校验，判断是否为空或电话号码规则
    $scope.blurPhone = function () {
        $scope.checkPhone();
        if ($scope.isPhone) $scope.msg = "";
    };

    $scope.checkPhone = function () {
        var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/;
        if ($scope.phoneNum == '' || $scope.phoneNum == null) {
            $scope.isPhone = false;
            $scope.msg = '* 请输入用户名/手机号码！';
            return;
        }
        else if (!reg.test($scope.phoneNum)) {
            $scope.isPhone = false;
            $scope.msg = "* 请输入11位手机号码！";
            return;
        } else {
            $scope.isPhone = true;
        }
    };
    //密码校验、判断是否为空，符合密码规则
    $scope.blurPassword = function () {
        $scope.checkPassword();
        if ($scope.isPassword) $scope.msg = "";
    };
    $scope.checkPassword = function () {

        var reg = /^([a-z]|[A-Z]|[0-9]){6,16}$/;
        if ($scope.password == null || $scope.password == '') {
            $scope.msg = "* 请输入您的登录密码！";
            $scope.isPassword = false;
            return;
        } else if (!reg.test($scope.password)) {
            $scope.msg = "* 请输入6-16位数字/字母组合密码！";
            $scope.isPassword = false;
            return;
        } else {
            $scope.isPassword = true;
        }
    };
    $('#code-state').css('border', '1px solid red');
//    登录
    $scope.loginNow = function () {
        $scope.checkPassword();
        $scope.checkPhone();
        if ($scope.isPhone && $scope.isPassword) {
            $scope.msg = "";
            //  登录接口
            var params = {
                'phoneNum': $scope.phoneNum,
                'password': $scope.password,
                'from': '3'
            };
            $http({
                method: 'POST',
                url: BaseUrl + '/members/login',
                params: params
            }).success(function (response) {
                $scope.codestate = true;
                setTimeout(function () {
                    //验证码发送状态弹窗隐藏
                    $scope.$apply(function () {
                        $scope.codestate = false;
                    })
                }, 1000);
                switch (response.result) {
                    case '0000':
                        $scope.state = "登录成功";
                        $scope.codestate = true;
                        $('#code-state').css('display', 'block');
                        $scope.loginSuccess(response.token);
                        break;
                    case '1004':
                        $scope.codestate = true;
                        $scope.state = "用户名或密码错误";
                        break;
                    case '1005':
                        $scope.state = "用户不存在";
                        $scope.codestate = true;
                        break;
                    case '9999':
                        $scope.state = "网络异常";
                        $scope.codestate = true;
                        break;
                    default :
                        $scope.state = "未知错误";
                        $scope.codestate = true;
                        $('#code-state').css('display', 'block');

                        break;
                }
                setTimeout(function () {
                    $scope.$apply(function () {
                        $scope.codestate = false;
                        $scope.state = "";
                    })
                }, 1000)
            })

        }
    };


    $scope.password = '';
    $scope.$watch('password', function () {
        var len = $scope.password.length - 1;
        if (!(/^[a-zA-Z0-9]*$/.test($scope.password))) {
            $scope.msg = "* 请输入字母数字组合！";
            $scope.isPassword = false;
            $scope.password = $scope.password.slice(0, len);
        } else {
            $scope.msg = '';
        }
    });

//    登录成功，执行的函数
    $scope.loginSuccess = function (token) {
        // localStorage.removeItem("fqhy_token");
        localStorage.setItem("fqhy_token", token);
        localStorage.setItem("realName", false);
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

            // default:
            //     alert('未检测出平台信息');
            //     break;
        }

        // $scope.defaultRem();
        $scope.state = "登录成功！正在跳转……";

        //跳转到登录之前的页面  此时获取为完整参数  先获取toUrl 之后的完整内容再进行解码
        let href = GetQueryString('toUrl');
        // href = href.substring(href.indexOf('toUrl')+6,href.length);
        if (GetQueryString("toUrl") != null && GetQueryString("toUrl").length > 1) {
            if (href.indexOf('?') > 0) {
                window.location.href = decodeURI(href + "&isLogin=1");
            } else {
                window.location.href = decodeURI(href + "?isLogin=1");
            }


        } else {
            window.location.href = "../../pages/recommended/recommended_index.html";
        }
    }

}]);