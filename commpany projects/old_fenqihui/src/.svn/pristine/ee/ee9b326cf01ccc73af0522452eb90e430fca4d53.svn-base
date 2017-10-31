var app = controllerFunc('detail', 'detailCtrl', function ($scope, $http) {

    var oId = GetQueryString('oId');
    var conId = GetQueryString('conId');

    var isQianyue = GetQueryString('isQianyue');
    var processStatus = GetQueryString('processStatus');

    function init() {
        $http({
            method: 'POST',
            params: {
                'token': getToken(),
                'oId': oId
            },
            url: BaseUrl + 'fqhord/getOrderDetailByOid'
        }).success(function (response) {
            $scope.data = response.data;

        }).error(function (response) {

        });
    }


    //    查看旅行合同
    $scope.goContract = function () {
        if (processStatus == '108') {
            go_page('../travel/travel_upload_contract2.html', [{'conId': conId},
                {'isQianyue': isQianyue},
                {'processStatus': processStatus},
                {'oId': oId}
            ]);
        } else if (processStatus == '303') {
            go_page('../travel/travel_view_bcontract.html', [{'conId': conId},
                {'isQianyue': isQianyue},
                {'processStatus': processStatus},
                {'oId': oId}
            ]);
        } else {
            go_page('../travel/travel_view_contract.html', [{'conId': conId},
                {'isQianyue': isQianyue},
                {'processStatus': processStatus},
                {'oId': oId}
            ]);
        }
    };


    init();
});

