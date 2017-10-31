/**
 * Created by wuzhicheng on 06/27/2017.
 */
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
var myStagesObj = {
    popup: '',
    stages: '',
    switch: false,
    aClass: false,
    list: [],
    firstPay: '', //首付金额
    prepay: '', //分期金额
    time: '', // 分期月数
    shouldPay: '', //每月应还
    delayPay: '', // 本月待还总额
    payTime: '', //本月还款日期
    residueTime: '', //剩余还款期数
    overdueTime: '', // 逾期未还期数
    data: '',
    dataList: [], //列表数组
    num: 1,
    monthList: [], // 月付账单
    overdueFeeInit: 0,
    dataListLi: [],
    //初始化调用函数
    init: function () {
        this.initData();
        this.tabChoose();
        this.searchCredit();
        this.getAccountName();
        this.httpData();
        this.myData(1);
        this.scrollFunction();
        this.showHide();
    },
    //初始化数据，赋值
    initData: function () {
    },
    //所有点击事件归类
    clickAll: function () {
        //补充资料
        var that = this;
        $(".updateInformation").click(function () {
            var index = $(this).parent().parent().index();
            that.updateInformation(that.dataList[index]);
        });
        //查看详情
        $(".viewDetails").click(function () {
            var index = $(this).parent().parent().index();
            that.details(that.dataList[index]);
        });
        //去支付
        $(".item_pay").click(function () {
            var index = $(this).parent().index();
            that.toPay(that.dataList[index]);
        });

        //去还款
        $(".goPay").click(function () {
            var index = $(this).parent().index();
            console.log($(this).parent());
            that.goMonthPay(that.monthList[index]);
        });
    },
    // tab切换
    tabChoose: function () {
        var currentIndex = 0;
        $(".main_tab>span").click(function () {
            var index = $(this).index();
            if (currentIndex != index) {
                currentIndex = index;
                $(this).removeClass("normalSpan").addClass("selectedSpan");
                $(this).siblings().removeClass("selectedSpan").addClass("normalSpan");
                var contents = $(".mainPlace>div");
                $(contents[index]).show();
                $(contents[index]).siblings().hide();
            }
        });
    },
    navive: function () {
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
    },
    //获得星级
    searchCredit: function () {

        var data = $.param({
            token: getToken()
        });
        $.ajaxPackagain(BaseUrl + 'members/searchCredit?' + data,
            function (res) {
                if (res.result == '0000') {
                    var startInfo = parseInt(res.data.startInfo);
                    console.log("获得的星级:" + startInfo);
                    for (var i = 0; i < startInfo; i++) {
                        $('.title_star').find('i').eq(i).html("&#xe650;");
                    }
                }
            }, function () {
                console.error('数据请求失败');

            }
        )


    },
    //获取用户名
    getAccountName: function () {
        var data = $.param({
            token: getToken()
        });
        $.ajaxPackagain(BaseUrl + 'members/findNickNameByToken?' + data,
            function (res) {
                if (res.result === SUCCESS_CODE) {
                    var accountName = res.nickName;
                    $(".title_phone").html(accountName);
                }
            },
            function () {
                console.error('数据请求失败');
            }
        )

    },

    load: function () {
        window.location.href = "http://localhost:5000/fenqihui/pages/travel/decoration_order.html";
    },
    goAccountSet: function () {
        go_page('../account/user_set.html');
    },
    //信用评估
    goCredit: function () {
        var that = this;
        that.realName();
    },
    // 实名认证
    realName: function () {
        var token = getToken();
        var that = this;

        var data = $.param({
            token: token
        });
        $.ajaxPackagain(BaseUrl + 'members/searchRealNameStatus?' + data,

            function (res) {
                if (res.result == '4004') {
                    var url = "./new_login.html";
                    prompt2("登陆失效请先登陆", url);
                    return;
                }
                if (res.result == '0000') {
                    var accountStatus = res.accountStatus;
                    // 0是判断非实名 1判断实名
                    if (parseInt(accountStatus) == 1) {
                        console.log("实名认证成功");
                        go_page('../../pages/account/user_increase_star.html');
                    } else {
                        console.log("未实名认证");
                        that.navive();
                    }
                } else {
                    prompt('网络忙');
                }
            },
            function () {
                prompt('网络忙');

            }
        );
    },
    // 我的订单
    myData: function (value) {
        var that = this;

        var data = $.param({
            token: getToken(),
            start: value,
            limit: 10
        });
        $.ajaxPackagain(BaseUrl + "fqhord/getOrderListByToken?" + data,

            function (res) {
                console.log(res);

                if (res.result == '0000') {
                    that.num++;
                    //放在数组里面，可以自己做分页
                    for (var i = 0; i < res.data.length; i++) {
                        that.dataList.push(res.data[i]);
                    }
                    console.log(that.dataList);

                    $(res.data).each(function (index, elem) {
                        var mydataListLi = $('<div class="dataList_li"> <div class="badge">'
                            + elem.pTitle + '</div> <div class="dataListItem dataListItemTop"> <div class="listText"> <span class="iconfont">&#xe66c;</span> <p>首付金额</p> </div> <div class="listNum">'
                            + elem.firstPrice + '</div> </div> <div class="dataListItem"> <div class="listText"> <span class="iconfont">&#xe66c;</span> <p>预付款</p> </div> <div class="listNum">'
                            + elem.prepayMoney + '</div> </div> <div class="dataListItem"> <div class="listText"> <span class="iconfont">&#xe66c;</span> <p>分期金额 (元)</p> </div> <div class="listNum">'
                            + elem.totalDurationPrice + '</div> </div> <div class="dataListItem"> <div class="listText"> <span class="iconfont">&#xe66c;</span> <p>分期期数 (月)</p> </div> <div class="listNum"></div>'
                            + elem.duration + ' </div> <div class="dataListItem" style="border-bottom: 1px solid #f4f4f4;"> <div class="listText"> <span class="iconfont">&#xe66c;</span> <p>每月应还 (元)</p> </div> <div class="listNum"></div>'
                            + elem.durationMoney + ' </div> <div class="itemState">' + elem.orderStatusDesc + '</div> <div class="item_pay" firstpay="'
                            + elem.orderStatus + '" >首付</div> <div class="clearfix"></div> <div class="itemDetalis"> <div class="itemTab updateInformation" updateMsg="'
                            + elem.orderStatus + '">补充资料</div> <div class="itemTab viewDetails">查看详情</div> </div> <div class="border"></div> </div>');

                        $(".mydataList").append(mydataListLi);
                    });
                    that.showHide();
                    that.clickAll();
                }
            },
            function () {
                console.log("请求列表数据失败");

            }
        );

    },

    showHide: function () {
        //判断首付的显示隐藏
        $(".item_pay").each(function () {
            var firstpay = $(this).attr("firstpay");
            if (firstpay == "104") {
                $(this).show();
            } else {
                $(this).hide();
                $(this).css("border", "1px solid blue");
            }
        });

        //判断补充资料的显示隐藏
        $(".updateInformation").each(function () {
            var updateMsg = $(this).attr("updateMsg");
            if (updateMsg == "303" || updateMsg == "108") {
                $(this).hide();
            } else {
                $(this).show();
            }
        });

        //判断去还款的显示隐藏
        $(".overdueFee").each(function () {
            var overdueFee = $(this).attr("hasoverdueFee");
            if (overdueFee) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    },

    // 月付账单
    httpData: function () {
        var that = this;
        console.log(typeof token === "undefined" ? "undefined" : _typeof2(token));
        var data = $.param({
            token: getToken()
        });
        $.ajaxPackagain(BaseUrl + 'fenqh/monthPayOrder?' + data,
            function (res) {
                if (res.result == '0000') {
                    that.monthList = res.data;
                    $(that.monthList).each(function (index, elem) {
                        var monthListLi = $('<div class="dataList_li"><div class="badge">'
                            + elem.pTitle + '</div> <div class="dataListItem"> <div class="listText"> <span class="iconfont">&#xe66c;</span> <p>本月待付总额</p> </div> <div class="listNum">￥'
                            + elem.rCurrPaidMoney + '</div><p class="overdueFee" hasoverdueFee="'
                            + elem.overdueFee + '">含逾期费:￥'
                            + elem.overdueFee + '</p></div><div class="dataListItem"> <div class="listText"> <span class="iconfont">&#xe66c;</span> <p>本月还款日期</p> </div> <div class="listNum">'
                            + elem.rDueDate + '</div></div><div class="dataListItem"> <div class="listText"> <span class="iconfont">&#xe66c;</span> <p>剩余还款期数</p> </div> <div class="listNum">'
                            + elem.leaveDuration + '</div></div><div class="dataListItem"> <div class="listText"> <span class="iconfont">&#xe66c;</span> <p>到期未还款期数</p> </div> <div class="listNum">'
                            + elem.overdueDuration + '</div></div><div class="dataListItem goPay">去还款 </div> <div  class="dataListItem  forwardPay" style="display:none"> <u>提前还款</u> </div>  <div class="border"></div></div>');
                        $(".monthList").append(monthListLi);
                    });
                    that.showHide();
                    that.clickAll();
                }
            },
            function () {
                console.log("请求错误");

            }
        )

    },
    //去还款
    goMonthPay: function (item) {
        if (item.isPaid == '0') {
            go_page('../travel/travel_checkstand.html', [{'oId': item.oId}, {'rId': item.rIds}, {'isOverdue': item.isOverdue}]);
        }
    },
    //去支付
    toPay: function (item) {
        if (item.isPaid == '0') {
            go_page('./travel_checkstand_first.html', [{'oId': item.oId}, {'oNo': item.oNo}]);
        }
    },
    //补充资料
    updateInformation: function (item) {
        if (item.orderStatus == '108') {
            go_page('./travel_upload_contract2.html', [{'conId': item.conId}, {'isQianyue': 0}, {'processStatus': item.orderStatus}, {'oId': item.oId}, {'pType': item.pType}]);
        } else if (item.orderStatus == '303') {
            go_page('./travel_view_bcontract.html', [{'conId': item.conId}, {'isQianyue': 0}, {'processStatus': item.orderStatus}, {'oId': item.oId}, {'pType': item.pType}]);
        } else {
            go_page('./travel_view_contract.html', [{'conId': item.conId}, {'isQianyue': 0}, {'processStatus': item.orderStatus}, {'oId': item.oId}, {'pType': item.pType}]);
        }
    },
    //查看详情
    details: function (item) {
        console.log(item.oId+","+item.conId+","+item.orderStatus);
        if (item.orderStatus == 103 || item.orderStatus == 201 || item.orderStatus == 106) {
            go_page('../../pages/account/order_detail.html', [{"oId": item.oId}, {'conId': item.conId},{'pType':item.pType}]);
        } else {
            go_page('../../pages/account/order_detail.html', [{"oId": item.oId}, {'conId': item.conId}, {"processStatus": item.orderStatus}, {"isQianyue": "0"},{'pType':item.pType}]);
        }
    },
    // 下拉加载数据
    scrollFunction: function () {
        var that = this;
        window.onscroll = function () {
            if (that.getScrollTop() + that.getWindowHeight() == that.getScrollHeight()) {
                if ($(".dataList").children().length) {
                    that.myData(that.num);
                }
            }
        };
    },
    //滚动条在Y轴上的滚动距离
    getScrollTop: function () {
        var scrollTop = 0,
            bodyScrollTop = 0,
            documentScrollTop = 0;
        if (document.body) {
            bodyScrollTop = document.body.scrollTop;
        }
        if (document.documentElement) {
            documentScrollTop = document.documentElement.scrollTop;
        }
        scrollTop = bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop;
        return scrollTop;
    },

    //文档的总高度
    getScrollHeight: function () {
        var scrollHeight = 0,
            bodyScrollHeight = 0,
            documentScrollHeight = 0;
        if (document.body) {
            bodyScrollHeight = document.body.scrollHeight;
        }
        if (document.documentElement) {
            documentScrollHeight = document.documentElement.scrollHeight;
        }
        scrollHeight = bodyScrollHeight - documentScrollHeight > 0 ? bodyScrollHeight : documentScrollHeight;
        return scrollHeight;
    },

    //浏览器视口的高度
    getWindowHeight: function () {
        var windowHeight = 0;
        if (document.compatMode == "CSS1Compat") {
            windowHeight = document.documentElement.clientHeight;
        } else {
            windowHeight = document.body.clientHeight;
        }
        return windowHeight;
    }
};
$(function () {
    myStagesObj.init();
});