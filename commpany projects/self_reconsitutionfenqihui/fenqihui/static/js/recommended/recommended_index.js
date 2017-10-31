'use strict';

/**
 * Created by wuzhicheng on 06/19/2017.
 */
var recommendedObj = {
    TOKEN: getToken(),
    page: 1,
    proItems: [],
    loginTag: true,
    isRealName: "",
    init: function(){
        this.initView();
        this.getBanner();
        this.checkRealName();
        this.getLabelInfo();
        this.getProductList();
        this.scrollFunction();
        this.clickAll();
    },
    initView: function () {
        var ele = {
            head: $('.route-search').eq(0),
            offsetTop: $('.route-search').eq(0).offset().top,
            search: $('#route_search')
        };
        $('#main-wrap section').css('display', 'none');
        $('#foot_check1').siblings('span').css('color', 'red');
    },
    scrollFunction: function () {
        var that = this;
        that.isLoading = true;
        $(window).scroll(function () {
            var then = that;
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            if (scrollHeight - scrollTop - windowHeight < 20 && that.isLoading == false) {
                that.isLoading = true;
                then.getProductList();
            }
        });
    },
    initSwiper: function () {
        var mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal',
            //auto slide
            autoplay: 5000,
            loop: true,
            freeModeMomentumBounce: false,
            pagination: '.swiper-pagination'
        });
    },
    clickAll: function () {
        var that = this;
        $(".realName-icon").click(function () {
            that.toRealName();
        });
    },
    checkRealName: function () {
        var that = this;
        var data = $.param({
            token: that.TOKEN
        });
        that.isRealName = true;
        $(".realName-icon").show();
        if (that.TOKEN) {
            $.ajaxPackagain(BaseUrl + 'members/searchRealNameStatus?' + data, function (res) {
                if (res.result === SUCCESS_CODE) {
                    if (res.status === '1' && res.accountStatus === '1') {
                        that.isRealName = false;
                        $(".realName-icon").hide();
                    }
                } else {
                    that.isRealName = true;
                    $(".realName-icon").show();
                }
            }, function () {
                console.error('数据请求失败');
                that.isRealName = true;
                $(".realName-icon").show();
            });
        } else {
            that.isRealName = true;
            $(".realName-icon").show();
        }
    },
    //查询产品类型
    getLabelInfo: function () {
        var that = this;
        var data = $.param({
            start: 1
        });
        $.ajaxPackagain(BaseUrl + 'fqhpro/getAllProductSuperType?' + data, function (res) {
            var then = that;
            if (res.result === SUCCESS_CODE) {
                var labelArray = res.data;
                for (var i = 0; i < labelArray.length; i++) {
                    var section = $('<section class="main-label"></section>');
                    var sectionImg = $('<img src="' + OSS_IMG_URL + labelArray[i].url + '" alt="">');
                    section.append(sectionImg);
                    $("#main-wrap").append(section);
                };
                $("#main-wrap>.main-label").each(function () {
                    $(this).click(function () {
                        var mainLabelindex = $(this).index();
                        then.searchBourn(1, "2", mainLabelindex);
                    });
                });
            }
        }, function () {
            console.error('数据请求失败');
        });
    },
    getBanner: function () {
        var that = this;
        var data = $.param({
            start: 1,
            bType: 1
        });
        $.ajaxPackagain(BaseUrl + 'fqhpro/getFqhProductCarouselImgList?' + data, function (response) {
            var then = that;
            if (response.result === SUCCESS_CODE) {
                var bannerList = response.data;
                for (var i = 0; i < bannerList.length; i++) {
                    var bannerDiv = $('<div class="swiper-slide"></div>');
                    var bannerDivimg = $('<img src="' + OSS_IMG_URL + bannerList[i].url + '" alt="轮播图">');
                    bannerDiv.append(bannerDivimg);
                    $("#bannerSwiper").append(bannerDiv);
                }
                $("#bannerSwiper .swiper-slide").click(function () {
                    var swiperSlideindex = $(this).index() - 1;
                    var pId = bannerList[swiperSlideindex].pId;
                    then.toDetail(pId);
                });
                setTimeout(function () {
                    that.initSwiper();
                }, 500);
            }
        }, function () {
            console.error('数据请求失败');
        });
    },
    getProductList: function () {
        var that = this;
        var data = $.param({
            start: 1
        });
        $.ajaxPackagain(BaseUrl + 'fqhpro/getHotSellProduct?' + data, function (res) {
            var then = that;
            if (res.result === SUCCESS_CODE) {
                if (res.data || res.data.length) {
                    if (res.data.length == 10) {
                        that.isLoading = false;
                    }
                    that.proItems = that.proItems.concat(res.data);

                    $(that.proItems).each(function (index, elem) {
                        var routeDiv = $('<div class="route-sales route-sales-begin"><div class="route-sale-bg" style="background:url(' + OSS_IMG_URL + elem.imgUrl + ')"><div class="route-sale-price"><div class="route_tp"><p class="route-price-month"><i>月付</i><span class="route-price-tag">￥</span><span class="route-price-number">' + elem.monthPay.toFixed(0) + '</span><span class="route-price-tag">起</span></p> </div></div><div class="tit_content"><p>' + elem.proType + '</p></div></div><p class="route-place">' + elem.title + '</p></div>');
                        $(".route-sales-wrap").append(routeDiv);
                    });

                    $(".route-sales-wrap .route-sales-begin").each(function () {
                        $(this).click(function () {
                            var swiperSlideindex = $(this).index();
                            var pId = that.proItems[swiperSlideindex].pId;
                            then.searchDetail(pId);
                        });
                    });
                }
            }
        }, function () {
            console.error('数据请求失败');
        });
    },
    //跳转详情页
    toDetail: function (pId) {
        go_page('../travel/travel_myDetails.html', [{ 'pId': pId }]);
    },
    searchBourn: function (lbId, name, index) {
        go_page('../../pages/recommended/recommendation_destination.html', [{ 'index': index }]);
    },
    searchDetail: function (pId) {
        go_page('../travel/travel_myDetails.html', [{ 'pId': pId }]);
    },
    toRealName: function () {
        var that = this;
        if (that.TOKEN) {
            if (that.isRealName) {
                go_page('../travel/travel_upload_cdCard.html');
            }
        } else {
            go_page('../account/new_login.html');
        }
    }
};
$(function () {
    recommendedObj.init();
});