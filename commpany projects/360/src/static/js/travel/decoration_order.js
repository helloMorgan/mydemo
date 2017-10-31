/**
 * Created by yu on 2017/3/20.
 */
controllerFunc('ngOrder', 'ngOrderCtl', function ($scope, $http, $timeout, $q) {

    $scope.showPayment = true;
    $scope.staging = '12';

    //阅读协议
    $scope.isReadDeal = true;

    var token = getToken();


    $scope.displayList = function () {
        $scope.showPayment = false;

        //点击关闭按钮的时候，遮罩层关闭
        $(".payment_time_mask2 li").on('click', function () {
            $scope.showPayment = true;
            // $(".payment_time_title em").text();
            var temp = $(this).html();
            $scope.$apply(function () {
                $scope.staging = temp;
            });
        });
    };

    $scope.agreeDeal = function () {
        $scope.isReadDeal = !$scope.isReadDeal;
    };

    function checkMoney() {
        var money = parseInt($scope.fqMoney);

        if (money < 0 || money > 1000000) {
            alert("输入金额不正确");
            return false;
        }

        return true;
    }



    $scope.orderPay = function () {
        if (!$scope.isReadDeal) {
            alert("请确认分期协议");
        }

        var flag1 = checkMoney();

        if (flag1) {
            $http({
                method: 'POST',
                params: {
                    token: token,
                    pId: '1',
                    oTotalDuration: $scope.staging,
                    oTotalPrice: $scope.fqMoney
                },
                url: BaseUrl + 'fqhorder/createOrder',
            }).then(function (response) {
                if (response.data.result == SUCCESS_CODE) {
                    $('.layer').css('display', 'block');
                } else {

                }
            }, (response) => {
                console.error('数据请求失败');
            });
        }


    };

    $scope.backAccount = function () {
        window.location.href = "../../pages/account/order_tracking.html";
    };


    function getInfo() {
        $http({
            method: 'POST',
            params: {
                pId: '1'
            },
            url: BaseUrl + 'fqhproduct/queryProductDetail',
        }).then(function (response) {
            if (response.data.result == SUCCESS_CODE) {
                var data = response.data.productDetail;
                $scope.shopeName = data.sName;
                $scope.proName = data.pTitle;
                $scope.nums = data.pDuration.split(',');
                $scope.staging = $scope.nums[$scope.nums.length - 1];
                console.log($scope.staging);
                $scope.installmentArr = [];
                for (let i = 0; i < $scope.nums.length; i++) {
                    var item = {};
                    item.fq = $scope.nums[i];
                    $scope.installmentArr.push(item);
                }
            }
        }, (response) => {
            console.error('数据请求失败');
        });
    }


    $scope.goTrack = function () {
        go_page('../../pages/account/order_tracking.html');
    };

    getInfo();

});