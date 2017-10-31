'use strict';

/**
 * Created by wuzhicheng on 2017/6/29.
 */
var oId = GetQueryString('oId');
var conId = GetQueryString('conId');
var isQianyue = GetQueryString('isQianyue');
var pType = GetQueryString('pType');
var processStatus = GetQueryString('processStatus');
var orderDetailObj = {
    detailData: {},
    //初始化数据
    init: function () {
        this.initData();
        this.clickAll();
    },
    // 请求数据
    initData: function () {
        var that = this;
        var data = $.param({
            'token': getToken(),
            'oId': oId
        });
        $.ajaxPackagain(BaseUrl + 'fqhord/getOrderDetailByOid?'+data,
        function(res){
            console.log(res.data);
            that.detailData = res.data;
            that.evalValue();
        },
        function(){
            console.log("数据请求失败");
        });

    },
    //赋值
    evalValue: function () {
        var that = this;
        console.log(that.detailData);
        $(".order_detail_title").html(that.detailData.title);
        $(".firstPrice").html("￥" + that.detailData.firstPrice);
        $(".prepayMoney").html("￥" + that.detailData.prepayMoney);
        $(".duration").html(that.detailData.duration);
        $(".durationMoney").html("￥" + that.detailData.durationMoney);
    },
    clickAll: function () {
        var that = this;
        $(".viewContract").click(function () {
            that.goContract();
        });
    },

    //    查看旅行合同
    goContract: function () {
        if (processStatus == '108') {
            go_page('../travel/travel_upload_contract2.html', [{ 'conId': conId }, { 'isQianyue': isQianyue }, { 'processStatus': processStatus }, { 'oId': oId },{'pType':pType}]);
        } else if (processStatus == '303') {
            go_page('../travel/travel_view_bcontract.html', [{ 'conId': conId }, { 'isQianyue': isQianyue }, { 'processStatus': processStatus }, { 'oId': oId },{'pType':pType}]);
        } else {
            go_page('../travel/travel_view_contract.html', [{ 'conId': conId }, { 'isQianyue': isQianyue }, { 'processStatus': processStatus }, { 'oId': oId },{'pType':pType}]);
        }
    }

};
$(function () {
    orderDetailObj.init();
    console.log("测试");
});