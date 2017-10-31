/**
 * Created by liyang on 05/11/2016.
 */
var lbId = GetQueryString('lbId');
var laName = GetQueryString('laName');
controllerFunc('ngScope', 'ngController', function ($scope, $http) {
    $scope.laName = laName;
    $http({
        method: 'POST',
        params: {
            destId: lbId,
            pageSize: 1
        },
        url: BaseUrl + 'product/searchProductList',
    }).then(function (response) {
        if (response.data.result === SUCCESS_CODE) {
            $scope.items = response.data.data;
            //window.res = response;
            // $scope.labelName = items.pLaId.replace(/,/g,'#');

        }
    }, (response) => {
        console.error('数据请求失败');
    });

    $scope.toDetail = function (pId) {
        // window.location.href='../travel/travel_walk.html?lbid='+lbId;
        go_page('../travel/travel_detail_info.html', [{'pId': pId}, {'lbId': lbId}]);
    };

});