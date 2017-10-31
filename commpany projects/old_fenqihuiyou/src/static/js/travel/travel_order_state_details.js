controllerFunc('travelOrderStateDetails', 'travelOrderStateDetailsController', function ($scope, $http) {
    //获取产品数据

    //    获取产品的对象
    var oId = GetQueryString('oId');

    if (getToken()) {
        $http({
            method: 'POST',
            url: BaseUrl + "order/findOrderInfo",
            params: {
                'token': getToken(),
                'oId': oId
            }
        }).then(function (response) {
            if (response.data.result == '0000') {

                //产品图片
                $scope.imgUrl = response.data.product.lunboUrl.split(',')[0];

                $scope.productItem = response.data;

                if ($scope.productItem.order.processStatus == 201) {
                    $scope.statusImg = {
                        background: "url('../../static/bitmap/travel/fail_trav.png')",
                        backgroundSize: '100%'
                    }

                } else if ($scope.productItem.order.processStatus == 103 || item.order.processStatus == 106) {
                    $scope.statusImg = {
                        background: "url('../../static/bitmap/travel/fail_detail.png')",
                        backgroundSize: '100%'
                    }
                } else {
                    $scope.statusImg = {
                        background: "url('../../static/bitmap/travel/fail_trav.png')",
                        backgroundSize: '100%'
                    }
                }
            }

        }, function () {
            console.error('网络异常');
        })


        $scope.productInfo = function () {
            go_page('../../pages/travel/travel_detail_info.html', [{'pId': $scope.productItem.product.pId}, {'ps': 'pi'}]);
        }
    } else {
        alert('您的登录已过期，请重新登录！');
        go_page('../../pages/account/user_login.html', [{'toUrl': window.location.href}]);
    }

});