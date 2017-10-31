'use strict';

/**
 * Created by wuzhicheng on 06/21/2017.
 */

var lbId = GetQueryString('lbId');
var productlistObj = {
    laName: GetQueryString('laName'),
    totalCount: false,
    items: [],
    isLoading: true,
    page: 1,
    init: function () {
        // this.scrollFunction();
        this.getData();
    },
    scrollFunction: function () {
        var that = this;
        if (GetQueryString('source')) {
            var isLoading = true;
            // var page = 1;
            that.items = [];
            $(window).scroll(function () {
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(document).height();
                var windowHeight = $(this).height();

                if (scrollHeight - scrollTop - windowHeight < 20 && that.isLoading == false) {
                    that.isLoading = true;
                    that.getData();
                }
            });

            if (GetQueryString('source') == 'label') {
                var queryType = 1;
            } else {
                var queryType = 2;
            }
            that.getData();
        } else {
            that.items = JSON.parse(sessionStorage.getItem('data'));
        }
    },
    getData: function () {
        var that = this;
        var formData = $.param({
            start: 1,
            pTypeId: lbId
        });
        $.ajaxPackagain(BaseUrl + 'fqhpro/getProductListBySecondType?' + formData,

            function (res) {
                var then = that;
                that.page = 1;
                if (res.result === SUCCESS_CODE) {
                    if (res.data.length == 0) {
                        $(".list_none").show();
                        $(".travel-head-nav h1").html("暂无产品");
                    }
                    if (res.data || res.data.length) {
                        if (res.data.length == 10) {
                            that.isLoading = false;
                            // that.page++;
                        }
                        if (res.data == "") {
                            that.isLoading = true;
                        }
                        that.items = that.items.concat(res.data);
                        $(that.items).each(function (index, ele) {
                            console.log(ele);
                            var creatLi = $('<li class="travel-product-item"><div class="travel-walk-imgcon"> <img alt="" src="' + OSS_IMG_URL + ele.url + '"> <div class="route-sale-price"> <div class="route_tp"> <p class="route-price-month"><i>月付</i><span class="route-price-tag">￥</span><span class="route-price-number">' + ele.monthPay.toFixed(0) + '</span><span class="route-price-tag">起</span></p> </div> </div> </div> <p class="travel-walk-tag">' + ele.proType + '</p> </li>');
                            $(".travel-walk-list>ul").append(creatLi);
                            $(".travel-head-nav>h1").html(ele.proType);
                        });
                        $(".travel-walk-list>ul li").click(function () {
                            var clickIndex = $(this).index();
                            that.toDetail(that.items[clickIndex].pId);
                        });
                    }
                }
            },
            function () {
                console.error('数据请求失败');
            }
        );

    },
    toDetail: function (pId) {
        if (lbId) {
            go_page('../travel/travel_myDetails.html', [{'pId': pId}, {'lbId': lbId}]);
        } else {
            go_page('../travel/travel_myDetails.html', [{'pId': pId}]);
        }
    }
};

$(function () {
    productlistObj.init();
});