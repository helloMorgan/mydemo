/**
 * Created by Timor on 2016/11/14.
 */
controllerFunc('checkStandApp', 'checkStandCtrl', function ($scope, $http) {
    var oId = GetQueryString('oId');
    var rId = GetQueryString('rId');
    var isOverdue = GetQueryString('isOverdue');

    // BaseUrl="http://192.168.1.101:8088/phj_fqhy_business_web/";
    //   获取银行卡信息
    function
    getCardInfo() {
        $http({
            method: 'POST',
            url: BaseUrl + 'fenqh/toPayment',
            params: {
                'token': getToken(),
                'oId': oId
            }
        }).then(function (response) {
            if (response.data.result == SUCCESS_CODE) {
                $scope.firstPay = response.data;
                $scope.oDurationMoney = parseFloat($scope.firstPay.oDurationMoney).toFixed(2);
                //银行信息
                cardLogo($scope.firstPay.bankId);

                localStorage.setItem('paid_type', 2);
                localStorage.setItem('rId', rId);
                // if($scope.firstPay.leastDate>0){
                //     $scope.payStatus=true;
                // }else{
                //     $scope.payStatus=false;
                //     shelterShow();
                //     changeOrderStatus();
                // }
                // //倒计时
                // var min= parseInt($scope.firstPay.leastDate/60);
                // var sec= $scope.firstPay.leastDate%60;
                // $scope.timeBack(min, sec, oId);
                //   立即支付




                $scope.orderPay = payMonth;
            } else if (response.data.result == "4001") {
                $scope.payStatus = false;
                shelterShow();
                // changeOrderStatus();
            }

        }, function () {
            console.error('网络异常');
        })
    }

    function getMonthInfo() {
        $http({
            method: 'POST',
            url: BaseUrl + 'fqhord/toRecharge',
            params: {
                'token': getToken(),
                'oId': oId,
                'rId': rId
            }
        }).then(function (response) {
            if (response.data.result == SUCCESS_CODE) {
                $scope.firstPay = response.data;
                $scope.oDurationMoney = parseFloat($scope.firstPay.oDurationMoney).toFixed(2);
                //银行信息
                cardLogo($scope.firstPay.bankId);
                //   立即支付
                $scope.orderPay = payMonth;
            } else if (response.data.result == "4001") {
                $scope.payStatus = false;
                shelterShow();
                // changeOrderStatus();
            }

        }, function () {
            console.error('网络异常');
        })
    }

    var appType = getTypeNative();

    $scope.goBack=function(){
        if(appType=='android'){
            android.backAccount();
        }else if(appType=='ios'){
            backAccount();
        }else{
            window.history.back();
        }
    };


//    立即支付
    function payNow() {
        var params = {
            'token': getToken(),
            'oId': oId,
            'amt': parseInt($scope.firstPay.amt + "")
        };
        var url = BaseUrl + 'order/recharge';
        StandardPost(url, params);
    }

//    月付
    function payMonth() {
        var params = {
            'token': getToken(),
            'oId': oId,
            'rId': rId,
            'isOverdue' : isOverdue,
            'amt': $scope.firstPay.amt,
            'rechargeType' : 1
        };
        var url = BaseUrl + 'order/recharge';
        StandardPost(url, params);
    }

// //   倒计时 param min:分 second:秒 oId：订单id
//     $scope.timeBack = function (min, second, oId) {
//         var startTime = new Date().getTime();
//         localStorage.setItem(oId, startTime)
//         $scope.min = min;
//         $scope.second = second;
//         //判断是否是最后一次60秒倒计时
//         if(min==0){
//             var config = true;
//         }else{
//             var config = false;
//         }
//         var timmerA = setInterval(function () {
//             $scope.$apply(function () {
//                 $scope.second--;
//                 if ($scope.second == -1) {
//                     if (config) {
//                         //倒计时结束 订单过期
//                         $scope.payStatus=false;
//                         changeOrderStatus();
//                         shelterShow();
//                         clearInterval(timmerA);
//                         $scope.second = 0;
//                     } else {
//                         $scope.min--;
//                         $scope.second = 59;
//                     }
//                     if ($scope.min == 0) {
//                         config = true;
//                     }
//                 }
//             })
//
//         }, 1000);
//
//     };
//
//     //倒计时结束更改订单状态
//     function changeOrderStatus() {
//         $http({
//             method:'POST',
//             url:BaseUrl+"order/toModifyOrderFail",
//             params:{
//                 'token':getToken(),
//                 'oId':oId
//             }
//         }).then(function(response){
//             console.log(response.message)
//         },function(){
//             console.error('网络异常')
//         })
//     }


//    根据bankId获取银行卡logo 银行名称
    function cardLogo(cardId) {
        $scope.bankImageUrl = '../../static/bitmap/account/bank_icon/' + cardId + '.png';
        switch (cardId) {
            case '0308':
                $scope.bankName = '招商银行';

                break;
            case '0104':
                $scope.bankName = '中国银行';
                break;
            case '0102':
                $scope.bankName = '中国工商银行';
                break;
            case '0105':
                $scope.bankName = '中国建设银行';
                break;
            case '0103':
                $scope.bankName = '中国农业银行';
                break;
            case '0403':
                $scope.bankName = '中国邮政储蓄银行';
                break;
            case '0310':
                $scope.bankName = '上海浦东发展银行';
                break;
            case '0307':
                $scope.bankName = '平安银行';
                break;
            case '0305':
                $scope.bankName = '中国民生银行';
                break;
            case '0309':
                $scope.bankName = '兴业银行';
                break;
            case '0304':
                $scope.bankName = '华夏银行';
                break;
            case '0303':
                $scope.bankName = '光大银行';
                break;
            case '0306':
                $scope.bankName = '广发银行';
                break;
            case '0302':
                $scope.bankName = '中信银行';
                break;
            case '0301':
                $scope.bankName = '交通银行';
                break;
        }
    }


//    订单失效的遮罩层
    function shelterShow() {
        $('.pays-container').css('display', 'block').animateCss('fadeInDown');
    }

    $scope.backIndex = function () {
        var typeNative = getTypeNative();
        if (typeNative === 'ios') {
            backHome();
        } else if (typeNative === 'android') {
            android.backHome();
        } else {
            go_page('../recommended/recommended_index.html');
        }
    };

    $scope.backTravel = function () {
        var typeNative = getTypeNative();
        if (typeNative === 'ios') {
            backAccount();
        } else if (typeNative === 'android') {
            android.backAccount();
        } else {
            go_page('../account/user_personal.html');

        }
    };

    //显示金额格式修改
    $scope.showPrice = function (price) {
        return formatNum(parseFloat(price).toFixed(2));
    };

    if (rId) {
        getMonthInfo();
    } else {
        getCardInfo();
    }
});