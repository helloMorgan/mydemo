controllerFunc('orderDetailApp', 'orderDetailCtrl', function ($scope, $http, $timeout, $q) {
    $scope.data = {
        shopName: '',
        firstPay: '1000',
        readyPay: '',
        privilege: ' ',
        payNum: '',
        repayNum: '',
        alreadyPay: '',
        dataArr: {},
        message: ' ',
        layer: false,
        info: false,
        bange: false
    }
    $scope.isReadDeal = true;
    $scope.agreeDeal = function () {
        $scope.isReadDeal = !$scope.isReadDeal;
    };
    $scope.data.dataArr = JSON.parse(GetQueryString('urlData'));
    $scope.data.shopName = GetQueryString('name');
    $scope.submit = function () {

    }

    /*data={
     token:getToken(),
     oPId:$scope.data.pId,// 商品Id
     oTotalPrice:$scope.data.price,//商品总价
     oTotalFirstPrice:$scope.data.firstPay,//首付款
     oPrepayMoney:$scope.data.prepay,//预付款
     oTotalDuration:$scope.data.time,// 分期月数
     oDurationMoney:$scope.data.shouldPay,//每月应还
     oIsQianyue:0, // 是否签约订单
     oTotalSxfMoney:$scope.data.poundage,//手续费
     oRemark: '备注' , // 备注
     contractNum:parseInt(Math.random()*10000)  // 合同随机码

     }*/
    function http(uri, dataList) { // http请求

        console.log(dataList);
        var deferred = $q.defer();
        $http({
            url: uri,
            method: "POST",
            params: dataList
        }).success(function (res) {
            deferred.resolve(res);
        }).error(function (error) {
            deferred.reject(error)
        });
        return deferred.promise
    }

    $scope.orderPay = function () {

        if ($scope.isReadDeal) {
            console.log($scope.data.dataArr);
            http(BaseUrl + 'fqhord/saveFenqihuiOrder', $scope.data.dataArr).then(function (res) {
                $scope.data.layer = true;
                if (res.result == '0000') {
                    $scope.data.bange = true;
                } else {
                    $scope.data.info = true;
                }
            })

        } else {
            alert('请同意购买协议')
        }
    };
    $scope.layer = function () {
        $scope.data.layer = false;
        if ($scope.data.info) {

        } else {
            go_page('../../pages/travel/tracel_myStages.html');
        }
    }
})
