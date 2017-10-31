var app = controllerFunc('credits', 'creditsController', function ($scope, $http, $timeout) {
    $scope.isDisplay = false;
    $scope.prompt_text = "";
    $scope.prompt = false;
    $scope.userError = false;
    $scope.path = "../../static/bitmap/pays/pays_fail_03.png";
    $scope.pro_text = "错误";

    $scope.sendData = {
        amount: "",
    };
    // 页面载入后查看用户信用额度
    $http({
        method: 'POST',
        params: {
            'token': getToken()
        },
        url: BaseUrl + 'members/searchCredit'
    }).success(function (response) {
        if (response.result == "0000") {
            var data = response.data;
            $scope.totalMoney = data.totalMoney;
            $scope.freezeMoney = data.freezeMoney;
            $scope.leaveMoney = data.leaveMoney;
        } else {
            $scope.pro_text = "网络忙，请稍后再试";
            $scope.userError = true;
        }

    }).error(function (response) {
        $scope.pro_text = "网络忙，请稍后再试";
        myPrompt($scope.pro_text);
    });


    function prompt(str) {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.pro_text = "亲，" + str;
            });
        }, 100);
        $scope.userError = true;
    }


    $scope.closeBtn = function () {
        $scope.userError = false;
    };


    function myPrompt(str) {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.pro_text = "亲，" + str;
            });
        }, 100);
        $('#layer').css('display', 'block');
        $('.close_btn').click(function () {
            $('#layer').css('display', 'none');
        });
    }


    $scope.promotion = function () {
        $scope.isDisplay = true;
    };


    $scope.closeDisplay = function () {
        $scope.isDisplay = false;
    };



    // 提升额度
    $scope.increaseAmount = function () {
        // 限制输入 输入为空或 三位数内 提示
        var str = $('.amount_text').val();
        str = str.replace(/,/g, '');
        if (str == "" || str == null) {
            myPrompt("请输入申请金额");
            return;
        } else if (isNaN(str)) {
            myPrompt("请输入正确的金额");
            return;
        } else if (str.length <= 3) {
            myPrompt("要申请就申请多一点嘛");
            return;
        }

        $http({
            method: 'POST',
            params: {
                'token': getToken(),
                'money': str
            },
            url: BaseUrl + 'members/promoteCredit'
        }).success(function (response) {
            if (response.result == '0000') {
                $scope.path = "../../static/bitmap/pays/pays_success.jpg";
                $scope.message = "恭喜您，成功申请，请等待审核";
                $scope.prompt = true;
            } else if (response.result == '1008') {
                $scope.message = "很遗憾，请先完成实名认证";
                $scope.prompt = true;
            } else if (response.result == '1009') {
                $scope.message = "很遗憾，您有一笔申请正在审核中";
                $scope.prompt = true;
            } else if (response.result == '1010') {
                $scope.message = "您的初步授信额度正在审批中!";
                $scope.prompt = true;
            } else {

            }

        }).error(function (response) {

        });


    };


    $scope.closePro = function () {
        $scope.prompt = false;
        $scope.isDisplay = false;
    };

    $scope.backIndex = function () {
        go_page('../recommended/recommended_index.html');
    };


});

var formatStr = function () {
    let str = $('.amount_text').val();
    if(!str) {
        return false;
    }
    $('.amount_text').val(parseFloat(str).toLocaleString());
};
