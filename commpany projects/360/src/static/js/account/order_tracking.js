/**
 * Created by yu on 2017/3/21.
 */
/**
 * Created by yu on 2017/3/20.
 */
var app = controllerFunc('orderTrack', 'orderTrackCtr', function ($scope, $http, $timeout, $q) {

    var token = getToken();

    $scope.realName = false;
    // 是否显示 退出登陆
    $scope.isDisplay = false;

    function realName() {
        $http({
            method: 'POST',
            params: {
                token: getToken(),
            },
            url: BaseUrl + 'members/searchRealNameStatus',
        }).then(function (response) {
            console.log(response);
            if (response.data.result == '0000') {
                console.log(response.data.status);
                if (response.data.accountStatus == '1') {
                    $scope.realName = true;
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }, (response) => {
            console.error('数据请求失败');
        });
        return false;
    }

    function init() {


        if(!getToken()) {
            $scope.noToken = true;
        } else {
            $scope.noToken = false;
            realName();

            getListInfo();
        }
    }


    //取消
    $scope.cancel = function () {
        $scope.isDisplay = false;
    };
    // 确认
    $scope.confirm = function () {

        $http({
            method: 'POST',
            params: {
                'token': getToken(),
                'from': CLIENT_SOURCE
            },
            url: BaseUrl + 'members/logout'
        }).success(function(response) {
            if (response.result === SUCCESS_CODE) {
                localStorage.removeItem('fqh_token');
                $scope.isDisplay = false;
                go_page('../../pages/account/user_login.html');
            } else {
                localStorage.removeItem('fqh_token');
                $scope.prompt_text = "退出失败， 网络忙";
                $scope.isDisplay = false;
                prompt($scope.prompt_text);
            }
        }).error(function (response) {
            localStorage.removeItem('fqh_token');
            $scope.prompt_text = "退出失败， 网络忙";
            $scope.isDisplay = false;
            prompt($scope.prompt_text);

        });
    };

    function getListInfo() {
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
        });
    }

    $scope.goWithdraw = function (item) {
        go_page('../../pages/travel/travel_checkstand.html', [{'oId' : item.oId}]);
    };

    $scope.goPayInfo = function () {
        go_page('../../pages/pays/pays_info.html');

    };

    $scope.goInstallment = function () {
        go_page('../../pages/travel/travel_installment_contract_text.html', [{'flag': '0'}, {'pId': '1'}]);
    };


    $scope.layIn = function () {
        go_page('../../pages/account/user_login.html');
    };

    $scope.toOrder = function () {
        console.log($scope.realName);
        if($scope.realName) {
            go_page('../../pages/travel/decoration_order.html');
        } else {
            $('.layer').css('display', 'block');
        }
    };


    $scope.backAccount = function () {
        if(!token) {
            go_page('../../pages/account/user_login.html');
        } else {
            go_page('../../pages/travel/travel_upload_cdCard.html');
        }
    };


    // 退出登陆
    $scope.lagout = function() {
        $scope.isDisplay = true;
    };

    init();
});