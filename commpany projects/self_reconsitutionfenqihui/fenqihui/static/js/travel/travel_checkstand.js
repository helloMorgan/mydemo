'use strict';

/**
 * Created by wuzhicheng on 06/29/2017.
 */
var oId = GetQueryString('oId');
var rId = GetQueryString('rId');
var isOverdue = GetQueryString('isOverdue');
var appType = getTypeNative();
var checkstandObj = {
    firstPay: {},
    oDurationMoney: '',
    payStatus: '',
    bankImageUrl: '',
    bankName: '',
    init: function() {
        var that = this;
        if (rId) {
            that.getMonthInfo();
        } else {
            that.getCardInfo();
        }
        ;

        that.clickAll();
    },
    //初始化赋值
    initData: function () {
        var that = this;
        $(".travel-user-name>label").html(that.firstPay.realName);
        var amt = that.showPrice(that.firstPay.amt);
        $(".travel-user-name-price").html(amt);
        $(".bankImage img").attr("src", that.bankImageUrl);
        $(".bankName").html(that.bankName);
        $(".bankNo").html(that.firstPay.bankNo);
    },
    clickAll: function () {
        var that = this;
        // 跳转首页
        $(".pays-back").click(function () {
            that.backIndex();
        });
        //跳转我的订单页
        $(".backTravel").click(function () {
            that.backTravel();
        });
        //付款
        $(".checkStand").click(function () {
            that.payMonth();
        });
        //首付
        $(".checkStandFirst").click(function () {
            that.payNow();
        });
    },
    //   获取银行卡信息
    getCardInfo: function() {
        var that = this;
        var data = $.param({
            'token': getToken(),
            'oId': oId
        });
        $.ajaxPackagain(BaseUrl + 'fenqh/toPayment?'+data,
         function(res){
             if (res.result == SUCCESS_CODE) {
                 that.firstPay = res.data;
                 that.oDurationMoney = parseFloat(that.firstPay.oDurationMoney).toFixed(2);
                 //银行信息
                 that.cardLogo(that.firstPay.bankId);
                 that.initData();
                 localStorage.setItem('paid_type', 2);
                 localStorage.setItem('rId', rId);
             } else if (res.result == "4001") {
                 // that.payStatus = false;
                 // that.shelterShow();
             }
         },
            function(){
                console.log("请求数据失败");
            }
        )

    },
    getMonthInfo: function() {
        var that = this;
        var data = $.param({
            'token': getToken(),
            'oId': oId,
            'rId': rId
        });

        $.ajaxPackagain(BaseUrl + 'fqhord/toRecharge?'+data,
        function(res){
            if (res.result == SUCCESS_CODE) {
                that.firstPay = res;
                console.log(that.firstPay);
                that.oDurationMoney = parseFloat(that.firstPay.oDurationMoney).toFixed(2);
                //银行信息
                that.cardLogo(that.firstPay.bankId);
                that.initData();
            } else if (res.result == "4001") {
                // that.payStatus = false;
                // that.shelterShow();
            }
        },
            function(){
                console.log("网络异常,请求数据失败");
        }
        )

    },

    //返回上一级
    goBack: function () {
        if (appType == 'android') {
            android.backAccount();
        } else if (appType == 'ios') {
            backAccount();
        } else {
            window.history.back();
        }
    },
    //    立即支付
    payNow: function() {
        var that = this;
        var params = {
            'token': getToken(),
            'oId': oId,
            'amt': parseInt(that.firstPay.amt + "")
        };
        var url = BaseUrl + 'order/recharge';
        StandardPost(url, params);
    },
    //   立即支付 月付
    payMonth: function () {
        var that = this;
        var params = {
            'token': getToken(),
            'oId': oId,
            'rId': rId,
            'isOverdue': isOverdue,
            'amt': that.firstPay.amt,
            'rechargeType': 1
        };
        var url = BaseUrl + 'order/recharge';
        StandardPost(url, params);
    },
    //    根据bankId获取银行卡logo 银行名称
    cardLogo: function (cardId) {
        var that = this;
        that.bankImageUrl = '../../static/bitmap/account/bank_icon/' + cardId + '.png';
        switch (cardId) {
            case '0308':
                that.bankName = '招商银行';
                break;
            case '0104':
                that.bankName = '中国银行';
                break;
            case '0102':
                that.bankName = '中国工商银行';
                break;
            case '0105':
                that.bankName = '中国建设银行';
                break;
            case '0103':
                that.bankName = '中国农业银行';
                break;
            case '0403':
                that.bankName = '中国邮政储蓄银行';
                break;
            case '0310':
                that.bankName = '上海浦东发展银行';
                break;
            case '0307':
                that.bankName = '平安银行';
                break;
            case '0305':
                that.bankName = '中国民生银行';
                break;
            case '0309':
                that.bankName = '兴业银行';
                break;
            case '0304':
                that.bankName = '华夏银行';
                break;
            case '0303':
                that.bankName = '光大银行';
                break;
            case '0306':
                that.bankName = '广发银行';
                break;
            case '0302':
                that.bankName = '中信银行';
                break;
            case '0301':
                that.bankName = '交通银行';
                break;
        }
    },

    //    订单失效的遮罩层
    shelterShow: function () {
        $('.pays-container').css('display', 'block').animateCss('fadeInDown');
    },

    backIndex: function () {
        var typeNative = getTypeNative();
        if (typeNative === 'ios') {
            backHome();
        } else if (typeNative === 'android') {
            android.backHome();
        } else {
            go_page('../recommended/recommended_index.html');
        }
    },

    backTravel: function() {
        var typeNative = getTypeNative();
        if (typeNative === 'ios') {
            backAccount();
        } else if (typeNative === 'android') {
            android.backAccount();
        } else {
            go_page('../account/user_personal.html');
        }
    },

    //显示金额格式修改
    showPrice: function(price) {
        return formatNum(parseFloat(price).toFixed(2));
    }
};

$(function () {
    checkstandObj.init();
});