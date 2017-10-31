'use strict';

/**
 * Created by wuzhicheng on 06/21/2017.
 */
var pId = GetQueryString('pId');
var myDetailsObj = {
    popups: '',
    stages1: '',
    switch: false,
    dataList: [],
    businessName: '',
    firstPrice: '',
    price: '',
    monthPayLowest: '',
    duration: '',
    select: '',
    selectList: [],
    imgUrl: '',
    Text: false,
    flag: false,
    init: function () {
        this.dataHttp();
        this.checkRealName();
    },
    initData: function () {},
    dataHttp: function () {
        var that = this;
        var formData = $.param({
            pId: pId
        });
        $.ajaxPackagain(BaseUrl + 'fqhpro/getProductDetailByPid?'+formData,
        function (res){
            var then = that;
            console.log(res.data);
            that.dataList = res.data;
            that.businessName = that.dataList.sName;
            that.firstPrice = that.dataList.firstPrice;
            that.price = that.dataList.price;
            that.monthPayLowest = that.dataList.monthPayLowest.mPay;
            that.duration = that.dataList.monthPayLowest.duration;
            that.select = that.dataList.select;
            that.selectList = that.dataList.selectList;
            that.pId = that.dataList.pId;
            that.pName = that.dataList.title;
            that.sId = that.dataList.sId;
            var imgUrl = OSS_IMG_URL + that.dataList.url;
            $(".headerImg").attr("src", imgUrl);
            var mainorder = $('<div id="mainOrder"> <p class="mainOrder_title">' + that.pName + '</p> <div class="mainOrder_info"> <div class="firstPay" style="border-bottom:1px solid #DEDEDE ;"> <span>最低首付</span><i style="position: relative;left: 1.2rem;" >' + that.firstPrice + '</i><a style="flex: 2;display: inline-block; text-align: center;">' + that.businessName + '</a> </div> <div class="leastPay"><span>最低月付</span><i>' + that.monthPayLowest + '*' + that.duration + '期</i><a  class="select">' + that.select + '种选择</a><label class="submit_notice" ng-click="stages()"></label></div> </div> </div>');

            var mainDetails = $('<div id="mainDetails"><div class="mainDetails_tab"> <span class="mainDetails_chooseOne" >图文详情</span> <span class="mainDetails_chooseTwo"  >服务内容</span> </div> <div class="mainDetails_content"><div class="mainDetails_text" style="display: block"> <p class="mainDetails_title"></p> <div class="mainDetails_word"> <div class="mainDetails_article"> <p id="text"> </p> </div> </div> </div> <div class="mainDetails_text"> <p id="mainDetails_title"></p> </div> </div></div>');
            $("#mainDetail").append(mainorder).append(mainDetails);
            $('#text').html(that.dataList.pictureInfo);
            $('#mainDetails_title').html(that.dataList.serviceInfo);
            //查看几种选择
            $(".leastPay").click(function () {
                $(that.selectList).each(function (index, ele) {
                    console.log(ele);
                    var stagesOrderBorder = $(' <div class="slide stagesOrderBorder"><i>' + ele.duration + '期&nbsp;: &nbsp; </i> 首付<i> &nbsp;' + that.firstPrice + '</i> &nbsp;起 &nbsp; <a>' + ele.mPay + '×' + ele.duration + '</a>  期</div>');
                    $(".stagesOrder").append(stagesOrderBorder);
                    $(".stagesOrder").show();
                    $("#popup").show();
                });
            });
            $("#popup").click(function () {
                $("#popup").hide();
                $(".stagesOrder").hide();
                $(".stagesOrderBorder").remove();
            });
            //tab切换
            var mainTabs = $(".mainDetails_tab>span");
            var mainPlaces = $(".mainDetails_content>div");
            clickTab(mainTabs, mainPlaces);
            //没有服务隐藏
            if (that.dataList.serviceInfo) {
                $(".mainDetails_chooseTwo").show();
            } else {
                $(".mainDetails_chooseTwo").hide();
            }
        },
            function(){
                console.error('数据请求失败');
                return false;
            }
        );
    },
    checkRealName: function () {
        var that = this;
        if (getToken()) {

            var data=$.param({
                token: getToken()
            });
            $.ajaxPackagain(BaseUrl + 'members/searchRealNameStatus?'+data,
            function(res){
                if (res.result === SUCCESS_CODE) {
                    if (res.status === '1' && res.accountStatus === '1') {
                        that.flag = true;
                    }
                }
            },
                function(){
                    console.error('数据请求失败');
                    return false;
            }

            );
        } else {
            return false;
        }
    },
    load: function () {
        var that = this;
        if (getToken()) {
            if (!that.flag) {
                alert("请先进行实名认证");
                go_page('../travel/travel_upload_cdCard.html');
            } else {
                go_page('../../pages/travel/decoration_order.html', [{ 'urlState': 1 }, { 'selectShope': that.businessName }, { "firstPrice": that.firstPrice }, { "price": that.price }, { 'pName': that.pName }, { 'sId': that.sId }, { 'pId': that.pId }]);
            }
        } else {
            go_page('../../pages/account/new_login.html');
        }
    }

};
$(function () {
    myDetailsObj.init();
});