/**
 * Created by Timor on 2016/11/14.
 */
controllerFunc('checkStandApp', 'checkStandCtrl', function ($scope, $http) {
    var oId = GetQueryString('oId');


    function  init() {
        getCardInfo();
    }

    init();
    //   获取银行卡信息
    function getCardInfo() {
        $http({
            method: 'POST',
            url: BaseUrl + 'withdraw/applyWithdraw',
            params: {
                'token': getToken(),
                'oId': oId
            }
        }).then(function (response) {
            console.log(response);
            if (response.data.result == SUCCESS_CODE) {
                $scope.firstPay = response.data;
                $scope.oDurationMoney = parseFloat($scope.firstPay.oDurationMoney).toFixed(2);
                //银行信息
                cardLogo($scope.firstPay.bankId);
                $scope.orderPay = payNow;

                $scope.bankName = $scope.firstPay.bankName;
                $scope.bankNo = $scope.firstPay.bankNo;

                $scope.allowWithdrawMoney = $scope.firstPay.allowWithdrawMoney;

                $scope.inMoney = $scope.allowWithdrawMoney;
            } else if (response.data.result == "4001") {

            } else if (response.data.result == '7002') {
                alert("账户余额不足");
            } else if(response.data.result == '7001') {
                alert('查询不到金账户余额信息');
            }

        }, function () {
            console.error('网络异常');
        })
    }


    var appType = getTypeNative();

    $scope.goBack=function(){
        window.history.back();
    };


//    立即提现
    function payNow() {
        var tempMoney = parseInt($scope.inMoney);
        var myMoney = parseInt($scope.allowWithdrawMoney);
        if(myMoney < tempMoney) {
            alert("账户余额不足");
        } else {
            var params = {
                'token': getToken(),
                'oId': oId,
                'amt': $scope.inMoney
            };
            var url = BaseUrl + 'withdraw/withdraw';
            StandardPost(url, params);
        }
    }

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

});