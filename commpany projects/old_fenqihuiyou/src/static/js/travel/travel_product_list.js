/**
 * Created by liyang on 05/11/2016.
 */
var lbId = GetQueryString('lbId');
var laName = GetQueryString('laName');
controllerFunc('ngScope', 'ngController', function ($scope, $http) {
    $scope.laName = laName;
    $scope.totalCount = false;
    if (GetQueryString('source')) {
        var isLoading = true;
        var page = 1;
        $scope.items = [];
        $(window).scroll(function () {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();

            if ((scrollHeight - scrollTop - windowHeight < 20) && (isLoading == false)) {
                isLoading = true;
                getData();
            }
        });

        if (GetQueryString('source') == 'label') {
            var queryType = 1;
        } else {
            var queryType = 2;
        }
        function getData() {
            var params = {
                isHot: 1,
                queryType: queryType,
                id: lbId,
                pageSize: page
            }
            $http({
                method: 'POST',
                params: params,
                url: BaseUrl + 'product1/searchProductList',
            }).then(function (response) {
                if (response.data.result === SUCCESS_CODE) {
                    if (response.data.totalCount == 0) {
                        $scope.totalCount = true;
                    }
                    if (response.data.data || response.data.data.length) {
                        if (response.data.data.length == 10) {
                            isLoading = false;
                            page++;
                        }
                        $scope.items = $scope.items.concat(response.data.data);

                    }

                }
            }, (response) => {
                console.error('数据请求失败');
            });
        }

        getData();
    } else {
        $scope.items = JSON.parse(sessionStorage.getItem('data'));
    }


    $scope.toDetail = function (pId) {
        if (lbId) {
            go_page('../travel/travel_detail_info.html', [{'pId': pId}, {'lbId': lbId}]);
        } else {
            go_page('../travel/travel_detail_info.html', [{'pId': pId}]);
        }
    };

});