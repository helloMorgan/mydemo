'use strict';

/**
 * Created by wuzhicheng on 2017/6/27.
 */
var dataArr = JSON.parse(GetQueryString('urlData'));
console.log(dataArr);
var shopName = GetQueryString('name');
var orderDetailObj = {
    shopName: shopName,
    isReadDeal: true,
    layer: false,
    info: false,
    bange: false,
    dataArr: dataArr,
    init: function init() {
        this.initData();
    },
    //初始赋值
    initData: function () {
        var that = this;
        $(".order_detail_info .title").html(that.shopName);
        $(".oTotalFirstPrice").html(dataArr.oTotalFirstPrice);
        $(".oPrepayMoney").html(dataArr.oPrepayMoney);
        $(".fenQi").html("￥" + dataArr.oDurationMoney + "x" + dataArr.oTotalDuration + "期");
        $(".oTotalDuration").html(dataArr.oTotalDuration);
        $(".oDurationMoney").html("￥" + dataArr.oDurationMoney);
        $(".oTotalFirstPrices").html("￥" + dataArr.oTotalFirstPrice);
        $(".fenQis").html("￥" + dataArr.oDurationMoney + "x" + dataArr.oTotalDuration + "期");
    },
    //同意协议样式的切换
    agreeDeal: function () {
        var that = this;
        that.isReadDeal = !that.isReadDeal;
        if (!that.isReadDeal) {
            $(".order_detail_radio>i").addClass("read-deal");
        } else {
            $(".order_detail_radio>i").removeClass("read-deal");
        }
    },
    //提交预定
    orderPay: function () {
        var that = this;
        if (that.isReadDeal) {
            var data = $.param(that.dataArr);
            $.ajaxPackagain(BaseUrl + 'fqhord/saveFenqihuiOrder?' + data,
                function (res) {
                    console.log(res);
                    that.layer = true;
                    $("#popup,.layer").show();
                    if (res.result == '0000') {
                        that.bange = true;
                        $(".successP").show();
                    } else {
                        that.info = true;
                        $(".errorP").show();
                    }
                },
                function () {
                    console.log("请求数据失败");
                }
            )

        } else {
            alert('请同意购买协议');
        }
    },
    //订单提交后的状态展示
    layers: function () {
        var that = this;
        that.layer = false;
        $("#popup,.layer").hide();
        if (that.info) {
        } else {
            go_page('../../pages/travel/tracel_myStages.html');
        }
    }
};
$(function () {
    orderDetailObj.init();
});