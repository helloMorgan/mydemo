'use strict';

var personalOrder = 1,
    toTravel = 3;
var app = controllerFunc('userPersonal', 'userPersonalController', function ($scope, $http) {

    if (!getToken()) {
        alert('您尚未登录,请先登录');
        window.location.href = './user_login.html';
    }

    clickChange();
    $scope.userName = "*****";
    $scope.creditLeaveMoney = "*****";
    //我的订单数组
    $scope.myOrder = [];
    //月付账单数组
    $scope.monthBill = [];
    //待出行数组
    $scope.waitGo = [];
    //没有订单的时候 显示框
    $scope.orderShow = { 'display': 'block' };
    $scope.orderHidden = { 'display': 'none' };
    $scope.token = getToken();

    //去逛逛
    $scope.goTo = function () {
        go_page('../../pages/recommended/recommended_index.html');
    };
    //信用评估
    $scope.goCredit = function () {
        realName();
    };
    function navive() {
        var naviveType = getTypeNative();
        if (naviveType == 'ios') {
            if (window.webkit) {
                window.webkit.messageHandlers.realNameAuthentication.postMessage({ token: TOKEN });
            } else {
                realNameAuthentication(TOKEN);
            }
        } else if (naviveType == 'android') {
            android.realNameAuthentication(TOKEN);
        } else {
            alert("无web版本服务，请在App或微信端打开");
        }
    }

    // 实名认证
    function realName() {
        $http({
            method: 'POST',
            params: {
                'token': getToken()
            },
            url: BaseUrl + 'members/searchRealNameStatus'
        }).success(function (response) {
            if (response.result == '4004') {
                var url = "./user_login.html";
                prompt2("登陆失效请先登陆", url);
                return;
            }
            // if(response.status == 1)
            if (response.result == '0000') {
                var accountStatus = response.accountStatus;
                // 0是判断非实名 1判断实名
                if (response.accountStatus == 1) {
                    console.log("实名认证成功");
                    go_page('../../pages/account/user_increase_star.html');
                } else {
                    console.log("未实名认证");
                    navive();
                }
            } else {
                prompt('网络忙');
            }
        }).error(function (response) {
            prompt('网络忙');
        });
    }

    init();
    function init() {
        $('#my_order').css("display", 'block').addClass('travel_order_active');
        getPersonalOrder(personalOrder);
        getPersonalOrder(toTravel);
    }

    function searchCredit() {
        $http({
            method: 'POST',
            params: {
                token: $scope.token
            },
            url: BaseUrl + 'members/searchCredit'
        }).then(function (response) {
            if (response.data.result == '0000') {
                $scope.startInfo = parseInt(response.data.data.startInfo);
                for (var i = 0; i < $scope.startInfo; i++) {
                    $('.my_credit').find('i').eq(i).html("&#xe650;");
                }
            }
        }, function (response) {
            console.error('数据请求失败');
        });
    }

    searchCredit();

    //todo put the result to the three arr
    function getPersonalOrder(type) {
        $http({
            method: 'POST',
            params: {
                token: $scope.token,
                type: type
            },
            url: BaseUrl + 'order/findOrderList/v1'
        }).then(function (response) {
            if (response.data.result === SUCCESS_CODE) {
                //账户名
                $scope.userName = response.data.loginName;
                //剩余授信额度
                $scope.creditLeaveMoney = response.data.creditLeaveMoney;
                if (type === 1) {
                    $scope.myOrder = response.data.orderList;
                } else if (type === 3) {
                    $scope.waitGo = response.data.orderList;
                    $scope.dCfNum = response.data.dCfNum;
                }
                // else if (type === 2) {
                //     $scope.monthBill = response.data.orderList;
                // }
            }
        }, function (response) {
            console.error('数据请求失败');
        });
    }

    //月付账单
    function monthlyPayment() {
        $http({
            method: 'POST',
            params: {
                token: $scope.token
            },
            url: BaseUrl + 'repaymentPlan/findMonthOrder/v1'
        }).then(function (response) {
            if (response.data.result = SUCCESS_CODE) {
                $scope.monthBill = response.data.data;
            }
        }, function (response) {});
    }

    monthlyPayment();

    function initColl() {
        $http({
            method: 'POST',
            url: BaseUrl + 'product1/searchProductCollectionList',
            params: {
                token: getToken(),
                pageSize: '1'
            }
        }).then(function (response) {
            if (response.data.result === SUCCESS_CODE) {
                $scope.items = response.data.data;

                //window.res = response;
                // $scope.labelName = items.pLaId.replace(/,/g,'#');
            }
        }, function (response) {
            console.error('数据请求失败');
        });
    }

    initColl();

    //待出发查看详情
    $scope.waitShow = { display: 'inline-block' };
    //我的订单查看详情按钮显示设置
    $scope.isShow = function (item) {
        if (item.order.processStatus == 104 || item.order.processStatus == 105) {
            return { display: 'block' };
        } else {
            return { display: 'none' };
        }
    };
    //我的订单去支付按钮显示设置
    $scope.isHidden = function (item) {
        if (item.order.processStatus == 104 || item.order.processStatus == 105) {
            return { display: 'none' };
        } else {
            return { display: 'block' };
        }
    };

    $scope.isShowSubmit = function (item) {
        if (item.order.processStatus == '108' || item.order.processStatus == '110') {
            return { display: 'block' };
        } else {
            return { display: 'none' };
        }
    };

    $scope.isShowSubmitCont = function (item) {
        if (item.order.processStatus == '111') {
            return { display: 'block' };
        } else {
            return { display: 'none' };
        }
    };

    //去支付接口
    $scope.productPay = function (item) {
        localStorage.setItem('myOrderPay', JSON.stringify(item));
        go_page('../../pages/travel/travel_checkstand.html', [{ 'oId': item.order.oId }]);
    };

    //        去支付 月付
    $scope.productMonthPay = function (item) {
        go_page('../../pages/travel/travel_checkstand.html', [{ 'oId': item.oId }, { 'rId': item.rId }]);
    };

    //    查看详情
    $scope.checkInfo = function (item) {
        //判断状态吗，决定详情跳往的页面 303修改合同 304修改剩下两个 显示查看合同
        if (item.order.processStatus == 103 || item.order.processStatus == 201 || item.order.processStatus == 106) {
            go_page('../../pages/travel/travel_order_state_details.html', [{ "oId": item.order.oId }]);
        } else {
            go_page('../../pages/travel/travel_order_sucess_details.html', [{ "oId": item.order.oId }, { "processStatus": item.order.processStatus }, { "isQianyue": "0" }]);
        }
    };

    //收藏点击对应列表页
    $scope.toDetail = function (pId) {
        go_page('../travel/travel_detail_info.html', [{ 'pId': pId }]);
    };

    $scope.submitContract = function (item) {
        go_page('../../pages/travel/travel_upload_contract.html', [{ "onLine": "onLine" }, { "oid": item.order.oId }, { "processStatus": item.order.processStatus }, { "isQianyue": "0" }]);
    };

    function clickChange() {
        $('.my_order').bind('click', function () {
            $('.travel_order_myOrder').addClass('travel_order_active').siblings().removeClass('travel_order_active');
            $('#my_order').removeClass('not_show');
            $('#to_set').addClass('not_show');
            $('#my_bill').addClass('not_show');
            $('.travel-walk-list').addClass('not_show');
            $('#my_order').css("display", 'block');
        });

        $('.my_bill').bind('click', function () {
            $('.travel_order_monOrder').addClass('travel_order_active').siblings().removeClass('travel_order_active');
            $('#my_bill').removeClass('not_show');
            $('#my_order').addClass('not_show');
            $('#to_set').addClass('not_show');
            $('.travel-walk-list').addClass('not_show');
            $('#my_order').css("display", 'none');
        });

        $('.to_set').bind('click', function () {
            $('.travel_order_waiting').addClass('travel_order_active').siblings().removeClass('travel_order_active');
            $('#to_set').removeClass('not_show');
            $('#my_order').addClass('not_show');
            $('#my_bill').addClass('not_show');
            $('#to_set').addClass('not_show');
            $('.travel-walk-list').addClass('not_show');
            $('#my_order').css("display", 'none');
        });

        $('.to_collection').bind('click', function () {
            $('.travel_order_collection').addClass('travel_order_active').siblings().removeClass('travel_order_active');
            $('.travel-walk-list').removeClass('not_show');
            $('#my_order').addClass('not_show');
            $('#my_bill').addClass('not_show');
            $('#to_set').addClass('not_show');
            $('#my_order').css("display", 'none');
        });

        //待出发
        function waiGo() {
            $('.travel_order_waiting').addClass('travel_order_active').siblings().removeClass('travel_order_active');
            $('#to_set').removeClass('not_show');
            $('#my_order').addClass('not_show');
            $('#my_bill').addClass('not_show');
            $('#my_order').css("display", 'none');
            getPersonalOrder(toTravel);
        }

        //title 待出发个数
        $('.wait-go').bind('click', waiGo);
        //tab 待出发
        $('#to_set_out').bind('click', waiGo);
    }
});

//过滤器 过滤订单状态 返回相应状态
app.filter('orderStatus', function () {
    return function (code) {
        switch (code) {
            case '101':
            case '102':
                return "待确认";
                break;
            case '103':
                return "预定失败";
                break;
            case '104':
            case '105':
                return "待支付";
                break;
            case '106':
                return "订单已取消";
                break;
            case '107':
            case '110':
            case '111':
                return " 预定中";
                break;
            case '108':
                return " 待签约";
                break;
            case '109':
            case '304':
            case '305':
            case '306':
                return "待审核";
                break;
            case '201':
                return "出行失败 ";
                break;
            case '202':
                return "出行成功";
                break;

            case '203':
            case '302':
            case '401':
            case '402':
                return "待出行";
                break;
            case '204':
                return "待返回";
                break;
            case '303':
                return "待确认";
                break;
            case '501':
                return "还款中";
                break;
            case '502':
                return "还款中（已逾期）";
                break;
            case '503':
                return "已还款";
                break;
            case '504':
                return "还款失败";
                break;
            case '601':
                return "纠纷中";
                break;
            case '602':
                return "纠纷已解决";
                break;
            // default :
            //     return "订单状态错误"；
            //     break;
        }
    };
});

//tab changes