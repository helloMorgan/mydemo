/**
 * Created by yu on 2017/3/21.
 */
/**
 * Created by yu on 2017/3/20.
 */
var app = controllerFunc('orderTrack', 'orderTrackCtr', function ($scope, $http, $timeout, $q) {

    var token = getToken();

    function init() {
        $http({
            method: 'POST',
            params: {
                token: token,
            },
            url: BaseUrl + 'fqhorder/queryOrderList',
        }).then(function (response) {
            console.log(response);
            if (response.data.result == '0000') {
                $scope.orderList = response.data.orderList;
            }
        }, (response) => {
            console.error('数据请求失败');
            alert("接口请求失败");
        });

    }

    $scope.goWithdraw = function (item) {
        go_page('../../pages/travel/travel_checkstand.html', [{'oPId': item.oPId}, {'oMId' : item.oMId}]);
    };

    init();
});