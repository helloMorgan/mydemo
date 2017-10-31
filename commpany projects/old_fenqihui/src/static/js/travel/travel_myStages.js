controllerFunc('myStages', 'myStagesCtrl', function ($scope, $http, $timeout, $q) {
    $scope.data = {
        popup: '',
        stages: '',
        switch: false,
        aClass: false,
        list: [],
        firstPay: '',//首付金额
        prepay: '',//分期金额
        time: '',// 分期月数
        shouldPay: '',//每月应还
        delayPay: '',// 本月待还总额
        payTime: '',//本月还款日期
        residueTime: '',//剩余还款期数
        overdueTime: '', // 逾期未还期数
        data: '',
        dataList: [], //列表数组
        num: 1,
        monthList: [],// 月付账单
        overdueFeeInit: 0
    };


    function init() {
        searchCredit();
        getAccountName();
    }


    function navive() {
        var naviveType = getTypeNative();
        if (naviveType == 'ios') {
            if (window.webkit) {
                window.webkit.messageHandlers.realNameAuthentication.postMessage({token: TOKEN});
            } else {
                realNameAuthentication(TOKEN);
            }
        } else if (naviveType == 'android') {
            android.realNameAuthentication(TOKEN);
        } else {
            go_page('../../pages/travel/travel_upload_cdCard.html');
        }
    }

    init();
    function http(uri, dataList) { // http请求 
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


    $scope.popupVanish = function () {
        $scope.data.popup = false;
        $scope.data.stages = false;
    }
    $scope.stages = function () {
        $scope.data.popup = true;
        $scope.data.stages = true;
    }
    $scope.chooseTab = function (value) {
        $scope.data.aClass = !$scope.data.aClass;
        if (value == 1) {
            document.getElementsByClassName('mainDetails_chooseOne')[0].style.borderBottomColor = '#D8D8D8';
            document.getElementsByClassName('mainDetails_chooseTwo')[0].style.borderBottomColor = '#00ceb7';
            $scope.data.switch = false;

        } else {
            document.getElementsByClassName('mainDetails_chooseTwo')[0].style.borderBottomColor = '#D8D8D8';
            document.getElementsByClassName('mainDetails_chooseOne')[0].style.borderBottomColor = '#00ceb7';
            $scope.data.switch = true;
        }
    }

    $scope.load = function () {
        window.location.href = "http://localhost:5000/fenqihui/pages/travel/decoration_order.html"
    }
    $scope.goAccountSet = function () {
        go_page('../account/user_set.html');
    };


    //信用评估
    $scope.goCredit = function () {
        realName();
    };


    $scope.goMonthPay = function (item) {
        if(item.isPaid == '0') {
            go_page('../travel/travel_checkstand.html', [{'oId': item.oId}, {'rId': item.rIds}, {'isOverdue': item.isOverdue}]);
        }
    };


    // 实名认证
    function realName() {
        var token = getToken();
        $http({
            method: 'POST',
            params: {
                token: token
            },
            url: BaseUrl + 'members/searchRealNameStatus'
        }).success(function (response) {
            if (response.result == '4004') {
                var url = "./new_login.html";
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


    function searchCredit() {
        $http({
            method: 'POST',
            params: {
                token: getToken(),
            },
            url: BaseUrl + 'members/searchCredit',
        }).then(function (response) {

            if (response.data.result == '0000') {
                $scope.startInfo = parseInt(response.data.data.startInfo);
                console.error($scope.startInfo);
                for (let i = 0; i < $scope.startInfo; i++) {
                    $('.title_star').find('i').eq(i).html("&#xe650;");
                }
            }
        }, (response) => {
            console.error('数据请求失败');
        });


    }


    $scope.httpData = function () {// 月付账单
        console.log(typeof token);
        http(BaseUrl + 'fenqh/monthPayOrder', {token: getToken()}).then(
            function (res) {
                if (res.result == '0000') {
                    $scope.data.monthList = res.data
                }
            },
            function (error) {
                console.log(error)
            }
        )
    }
    $scope.httpData();

    $scope.myData = function (value) {// 我的订单
        http(BaseUrl + "fqhord/getOrderListByToken", {token: getToken(), start: value, limit: 10}).then(
            function (res) {
                console.log(res);

                if (res.result == '0000') {
                    $scope.data.num++;
                    if( res.result==''){

                    }

                    for (var i = 0; i < res.data.length; i++) {
                        $scope.data.dataList.push(res.data[i])
                    }
                    console.log($scope.data.dataList);
                }
            },
            function (error) {
                console.log(error)
            }
        )

    };
    $scope.myData($scope.data.num);

    //判断是否隐藏按钮
    $scope.isHide = function (item) {
        if (item.orderStatus == "303" || item.orderStatus == "108") {
            return true;
        }
        return false;
    };


    $scope.isShow = function (item) {
        if (item.orderStatus == '104') {
            return true;
        }
        return false;
    };


    $scope.toPay = function (item) {
        if(item.isPaid == '0') {
            go_page('./travel_checkstand_first.html',
                [{'oId': item.oId}, {'oNo': item.oNo}
                ]);
        }

    };


    //滚动条在Y轴上的滚动距离
    function getScrollTop() {
        var scrollTop = 0, bodyScrollTop = 0, documentScrollTop = 0;
        if (document.body) {
            bodyScrollTop = document.body.scrollTop;
        }
        if (document.documentElement) {
            documentScrollTop = document.documentElement.scrollTop;
        }
        scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
        return scrollTop;
    }

    //文档的总高度
    function getScrollHeight() {
        var scrollHeight = 0, bodyScrollHeight = 0, documentScrollHeight = 0;
        if (document.body) {
            bodyScrollHeight = document.body.scrollHeight;
        }
        if (document.documentElement) {
            documentScrollHeight = document.documentElement.scrollHeight;
        }
        scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
        return scrollHeight;
    }

    //浏览器视口的高度
    function getWindowHeight() {
        var windowHeight = 0;
        if (document.compatMode == "CSS1Compat") {
            windowHeight = document.documentElement.clientHeight;
        } else {
            windowHeight = document.body.clientHeight;
        }
        return windowHeight;
    }

    window.onscroll = function () {

        if (getScrollTop() + getWindowHeight() == getScrollHeight()) {
            if (!$scope.data.switch) {
                $scope.myData($scope.data.num)
            }
        }
    };


    //获取用户名
    function getAccountName() {
        $http({
            method: 'POST',
            params: {
                token: getToken()
            },
            url: BaseUrl + 'members/findNickNameByToken',
        }).then(function (response) {
            if (response.data.result === SUCCESS_CODE) {
                $scope.accountName = response.data.nickName;
            }
        }, function (response) {
            console.error('数据请求失败');
        });
    }


    $scope.datum = function (item) {

        if (item.orderStatus == '108') {
            go_page('./travel_upload_contract2.html', [{'conId': item.conId},
                {'isQianyue': 0},
                {'processStatus': item.orderStatus},
                {'oId': item.oId},
                {'pType' : item.pType}
            ]);
        } else if (item.orderStatus == '303') {
            go_page('./travel_view_bcontract.html', [{'conId': item.conId},
                {'isQianyue': 0},
                {'processStatus': item.orderStatus},
                {'oId': item.oId},
                {'pType' : item.pType}
            ]);
        } else {
            go_page('./travel_view_contract.html', [{'conId': item.conId},
                {'isQianyue': 0},
                {'processStatus': item.orderStatus},
                {'oId': item.oId},
                {'pType' : item.pType}
            ]);
        }
    };


    $scope.details = function (item) {
        if (item.orderStatus == 103 || item.orderStatus == 201 || item.orderStatus == 106) {
            go_page('../../pages/account/order_detail.html', [{"oId": item.oId}, {'conId': item.conId}]);
        } else {
            go_page('../../pages/account/order_detail.html', [{"oId": item.oId},
                {'conId': item.conId},
                {"processStatus": item.orderStatus},
                {"isQianyue": "0"}
            ]);
        }
    };

});