/**
 * Created by Timor on 2017/2/24.
 */

var flag = GetQueryString('flag');
controllerFunc('installApp', 'installCtrl', function ($scope, $http) {
    $scope.flag = flag;
    $scope.orderShow = false;
    $scope.signShow = false;
    $scope.rd = false;
    // $scope.order = JSON.parse(localStorage.getItem('orderDetailInfo'));
    // console.log($scope.order );
    if (flag == 0) {
        $scope.rd = true;
        $scope.rateDes = sessionStorage.getItem('rateDes');
    } else {
        $scope.rd = false;
    }
    function getInstall() {
        $http({
            method: 'POST',
            url: baseUrl + 'order/agreement',
            params: {
                token: getToken(),
                pId: GetQueryString('pId'),
                oId: GetQueryString('oId'),
                flag: flag
            }
        }).then(function (res) {
            if (res.data.result == SUCCESS_CODE) {
                $scope.signRegion = res.data.data.signRegion;
                $scope.idInfo = res.data.data.headInfo;
                $scope.orderInfo = res.data.data.orderInfo;
                if (res.data.data.display == 0) {
                    $scope.orderShow = false;
                    $scope.signShow = false;
                } else if (res.data.data.display == 1) {
                    $scope.orderShow = true;
                    $scope.signShow = false;
                } else if (res.data.data.display == 2) {
                    $scope.orderShow = true;
                    $scope.signShow = true;
                }

                if (flag == 1) {
                    $scope.signInfo = res.data.data.signInfo;
                    $scope.date1 = $scope.signInfo.firstparty[0].signDate.split('-');
                    $scope.date2 = $scope.signInfo.secondparty[0].signDate.split('-');
                    $scope.date3 = $scope.signInfo.thirdparty[0].signDate.split('-');
                }
            }
        }, function () {
            console.log("网络异常")
        })
    }

    getInstall();
});