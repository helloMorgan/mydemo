/**
 * Created by wuzhicheng on 2017/6/22.
 */
var urlState = GetQueryString('urlState');
var contractNum = GetQueryString('contractNum');
var selectShope = GetQueryString('selectShope');
var sId = GetQueryString('sId');
var pId = GetQueryString('pId');
var pName = GetQueryString('pName');
var firstPrice = GetQueryString('firstPrice');
var price = GetQueryString("price");
var state = GetQueryString('urlState');
var initDate = JSON.parse(GetQueryString('dataUrl'));
var storage = window.localStorage;
var decorationObj = {
    firstPay: '',
    prepay: '',
    price: '',
    produceArr: [],
    businessArr: [],
    timeArr: [],
    produce: '',
    Business: '',
    time: '',
    popup: false,
    stages: false,
    businessList: false,
    timeList: false,
    produceList: false,
    initIndex: '',
    index: false,
    warn: false,
    warn1: false,
    warn2: false,
    dataPay: '',
    paymenPay: '',
    monthPay: '',
    p_price: '',
    shouldPay: '2000',//每月应还
    interest: [],
    pId: '', // 产品的id
    poundage: '',//手续费
    initDate: '',
    flag: true,
    flag2: true,
    flag3: true,
    flag4: true,
    swiperId: 1,
    swiperId2:'',
    timefFees: [],
    evalValue: {},
    produceIndex: '',
    priceTime: '',
    tprice0:'',
    TotalPrice:'',
    flags:1,
    init: function () {
        this.Business();
        this.produces();
        this.clickAll();
        this.time();
        this.onblurs();
        setTimeout(function () {
            decorationObj.urlInit();
        }, 1000)

    },
    //从提交合同页面跳转回来的时候
    urlInit: function () {
        var that = this;
        if (state == 2) {
            var initDate = that.initDate = JSON.parse(GetQueryString('dataUrl'));
            console.log(initDate);
            var data = {};
            data.Business = initDate.business;
            data.produce = initDate.produce;
            data.firstPay = initDate.firstPay;
            data.prepay = initDate.prepay;
            data.prices = initDate.price;
            data.time = initDate.time;
            data.shouldPay = initDate.shouldPay;
            data.oIsQianyue = 1;
            data.contractNum = contractNum;
            data.poundage = initDate.poundage;
            data.swiperId = initDate.si_id;

            //从上传页面跳转回来的时候赋值
            $(".business").html(data.Business);
            $(".produce").html(data.produce);
            $(".firstPay").val(data.firstPay);
            $(".prepay").val(data.prepay);
            $(".price").html(data.prices);
            $(".timeChoose").html(data.time);
            $(".shouldPay").html(data.shouldPay);

        }


    },

    //遍历内容中的所有列表项添加点击事件
    clickAll: function () {
        var that = this;
        var clickIndex;
        var mainLi = $("#main .order_content li");

        function swiperHide() {
            $("#popup").hide();
            $(".swiper-containerBusiness,.swiper-containerProduce,.swiper-containerTime").hide();

        };

        $(mainLi).click(function () {
            clickIndex = $(this).index() + 1;
            that.popup(clickIndex);
            return clickIndex;
        });
        $("#popup").click(function () {
            swiperHide();
        });
        // 点击确定时
        $(".popupSubmit").click(function () {
            var submitIndex = clickIndex;
            swiperHide();

        });
        //点击商家确定时更新产品
        $(".swiper-containerBusiness .popupSubmit").click(function () {
            that.produces(that.swiperId);
        });

        //分期展示
        $(".submit_notice").click(function () {
            $(that.timeArr).each(function (index, ele) {
                var stagesOrderBorder = $(' <div class="slide"><i>' + ele + '期&nbsp;: &nbsp; </i> 首付<i> &nbsp;' +firstPrice + '</i> &nbsp;起 &nbsp; <a>' + that.shouldPay + '×' + ele + '</a>  期</div>');
                $(".stagesOrder").append(stagesOrderBorder);
                $(".stagesOrder").show();
                $("#popup").show();
            });

        });
        //点击确定时
        $("#popup").click(function () {
            $("#popup").hide();
            $(".stagesOrder").hide();
            $(".stagesOrder .slide").remove();
        });

        //    跳转到上传页面
        $(".submit_uploading").click(function () {
            that.load();
        })

        //    提交申请
        $(".order_submit").click(function () {
            that.orderPay();

        })

    },
    popup: function (value) {// 选择商家 产品触发弹出层和选项，用数字1,2,3进行区分
        var that = this;

        if (value == 1) {
            $(".prepay").val("");
            $("#popup,.swiper-containerBusiness").show();
            $(".popupSubmit").eq(0).show();
            var mySwiper = new Swiper('.swiper-containerBusiness', {// swiper 滑动
                initialSlide: 0,
                direction: 'vertical',
                slidesPerView: 3,
                freeModeSticky: true,
                spaceBetween: 0,
                centeredSlides: true,
                freeModeMomentumBounce: false,
                onInit: function (swiper) {//初始化商家名
                    // selectShope 前面页面带过来的商家名
                },
                onTransitionEnd: function (swiper) {// 滑动选择商家
                    that.flags=2;
                    that.businessArr[swiper.activeIndex].si_name ? that.Business = that.businessArr[swiper.activeIndex].si_name : alert("商家名字为空或者不存在")
                    //$scope.data.index = $scope.data.businessArr[swiper.activeIndex].si_id;
                    $(".business").html(that.businessArr[swiper.activeIndex].si_name);
                    storage.setItem("business", that.businessArr[swiper.activeIndex].si_id);// 本地储存滑动选择的商家id
                    that.swiperId = that.businessArr[swiper.activeIndex].si_id;


                }

            });

        } else if (value == 2) {
            $(".prepay").val("");
            $("#popup,.swiper-containerProduce").show();
            $(".popupSubmit").eq(1).show();
            var mySwiper = new Swiper('.swiper-containerProduce', {//第二个swiper
                initialSlide: 0,
                direction: 'vertical',
                slidesPerView: 3,
                freeModeSticky: true,
                spaceBetween: 0,
                centeredSlides: true,
                freeModeMomentumBounce: false,
                //初始化产品
                onInit: function () {

                },
                onTransitionEnd: function (swiper) {
                    that.produceIndex = swiper.activeIndex;
                    //TODO
                    if (that.flag && pName) {
                        that.flag = false;
                        that.produce = pName;
                        $(".produce").html(pName);

                    } else {
                        that.produceArr[swiper.activeIndex].p_title ? $(".produce").html(that.produceArr[swiper.activeIndex].p_title) : alert("商家名字为空或者不存在")
                    }
                    storage.setItem("prudece", that.produceArr[swiper.activeIndex].p_fee_id);
                    that.firstPay = that.produceArr[swiper.activeIndex].p_first_fee;// 首付金额
                    that.dataPay = that.produceArr[swiper.activeIndex].p_first_fee;//与首付金额进行对比
                    that.p_price = that.produceArr[swiper.activeIndex].p_price// 总金额
                    that.pType = that.produceArr[swiper.activeIndex].pType; // 商品类别
                    if (that.flag3 && pId) {
                        that.pId = pId;
                    } else {
                        that.pId = that.produceArr[swiper.activeIndex].p_id; //选择滑动商品的id
                    }
                    $(".firstPay").val(that.produceArr[swiper.activeIndex].p_first_fee);
                    storage.setItem("priceTime", that.p_price);
                    that.TotalPrice= that.p_price;
                    that.swiperId2=that.produceArr[swiper.activeIndex].p_fee_id;
                    var timeIndex = that.produceArr[swiper.activeIndex].p_fee_id;
                    that.time(timeIndex,that.TotalPrice);

                }

            })

        } else if (value == 6) {
            $(".timeChoose").click(function () {
                $("#popup,.swiper-containerTime").show();
                $(".popupSubmit").eq(2).show();
                var mySwiper = new Swiper('.swiper-containerTime', {// 选择分期数的swiper
                    initialSlide: 0,
                    direction: 'vertical',
                    slidesPerView: 3,
                    freeModeSticky: true,
                    spaceBetween: 0,
                    centeredSlides: true,
                    freeModeMomentumBounce: false,
                    onInit: function (swiper) {

                    },
                    onTransitionEnd: function (swiper) {
                        that.timeArr != ' ' ? $(".timeChoose").html(that.timeArr[swiper.activeIndex]) : alert("商家汇率为空或者不存在");
                        that.interest = that.timefFees[swiper.activeIndex]//获取利率
                        var firstpayValue = parseInt($(".firstPay").val());
                        var prepayValue = parseInt($(".prepay").val());
                        var timeValue = parseInt($(".timeChoose").html());
                        //获取总额
                        var pprice = price;
                        if (firstpayValue) {
                            if(!$(".prepay").val()){
                                prepayValue=0;
                            }else{
                                prepayValue=parseInt($(".prepay").val())
                            }
                            that.poundage = ((pprice - firstpayValue - prepayValue) * that.interest) / timeValue;

                            that.shouldPay = Math.ceil((pprice - firstpayValue - prepayValue) / timeValue + that.poundage);  // 计算每月应还
                            console.log("轮播结束： " + that.interest);
                            $(".shouldPay").html(that.shouldPay);
                        } else {
                            console.log('请填写正确的金额')
                        }

                    }
                })
            });
        }
    },
    Business: function () {//请求商家的列表
        var that = this;
        $.ajaxPackagain(BaseUrl + 'suppliersInfo/getSuppliersInfoListByCondition?',
            function (res) {
                console.log("商家。。。。。。");
                console.log(res.data);
                var then = that;
                that.businessArr = res.data;
                storage.setItem("businessArr", JSON.stringify(that.businessArr));// 本地缓存商家列表
                console.log(that.businessArr);
                //商家遍历渲染数据
                $(that.businessArr).each(function (index, ele) {
                    var swiperBusiness = $('<div class="swiper-slide" ></div>');
                    $(".swiper-containerBusiness .swiper-wrapper").append(swiperBusiness);
                    $(swiperBusiness).html(ele.si_name);
                });
                if (selectShope) {
                    $(".business").html(selectShope);
                } else {
                    $(".business").html(that.businessArr[0].si_name);
                }
            },
            function () {
                console.log('接口请求失败');
                console.log(error)
            }
        );
    },

    produces: function (index) {// 请求产品的数据
        var that = this;
        var businessArr = [];
        businessArr = JSON.parse(storage.getItem('businessArr'));
        var info;
        if (sId) {
            info = sId;
            if (index) {
                info = index;
            }
        } else {
            if (index) {
                info = index;	// index 就是选择的那个id
            }
            else {
                info = that.swiperId;
            }
        }
        console.log("info:" + info);
        var formData = $.param({
            psiid: info
        });

        $.ajaxPackagain(BaseUrl + 'fqhpro/getFqhProductByCondition?' + formData,
            function (res) {
                console.log("产品。。。。。。");
                console.log(res);
                var then = that;
                that.produceArr = res.data;
                storage.setItem("produceArr", JSON.stringify(that.produceArr));
                //TODO
                that.produceArr != ' ' ? that.produce = that.produceArr[0].p_title : alert("商家名字为空或者不存在");
                that.firstPay = that.produceArr[0].p_first_fee;//首付款、
                that.dataPay = that.produceArr[0].p_first_fee;//与首付款进行比较
                that.p_price = that.produceArr[0].p_price;// 总金额
                that.pType = that.produceArr[0].pType; // 商品类别
                console.log(that.produceArr);
                that.tprice0=that.produceArr[0].p_price;
                //产品遍历渲染数据
                $(".swiper-containerProduce .swiper-slide").remove();

                $(that.produceArr).each(function (index, ele) {
                    var swiperProduce = $('<div class="swiper-slide"></div>');
                    $(".swiper-containerProduce .swiper-wrapper").append(swiperProduce);
                    $(swiperProduce).html(ele.p_title);

                });
                if (pId) {
                    that.pId = pId;
                    $(".produce").html(pName);
                    if (index) {
                        $(".produce").html(that.produceArr[0].p_title);
                    }

                } else {
                    that.pId = that.produceArr[0].p_id;// 初始化产品id
                }
                //初始化首付
                if (firstPrice) {
                    $(".firstPay").val(firstPrice);
                    if (index) {
                        $(".firstPay").val(that.produceArr[0].p_first_fee);
                        that.time(that.produceArr[0].p_fee_id,that.tprice0);
                    }
                }

            },
            function () {
                console.log('接口请求失败');

            }
        );

    },

    time: function (index,p) {// 选择期数
        var that = this;
        var timeArr = JSON.parse(storage.getItem('produceArr'));
        console.log(timeArr);
        var infoTime;
        if (index) {
            infoTime = index;
            // alert("选择1："+infoTime)
        } else {
            infoTime = timeArr[0].p_fee_id;
        }
        var data = $.param({
            fId: infoTime
        });
        $.ajaxPackagain(BaseUrl + 'feeRate/getFeeRateById?' + data,
            function (res) {
                console.log("期数。。。。。。");
                console.log(res.data);
                //获得的时间数组
                that.timeArr = res.data.fDuration.split(',');
                //活得的利率数组
                that.timefFees = res.data.fFee.split(',');

                $(".swiper-containerTime .swiper-slide").remove();
                //期数遍历渲染数据
                $(that.timeArr).each(function (index, ele) {
                    var swiperTime = $('<div class="swiper-slide"></div>');
                    $(".swiper-containerTime .swiper-wrapper").append(swiperTime);
                    $(swiperTime).html(ele);
                });
                //初始化分期数
                that.timeArr != ' ' ? $(".timeChoose").html(that.timeArr[0]) : alert("商家汇率为空或者不存在");
                var timefFee = that.timefFees[0];
                console.log("初始化利率：" + timefFee);
                var firstpay,totalPrice;
                if(index){
                    //滑动时初始
                    //首付
                    firstpay=$(".firstPay").val();

                }else{
                    firstpay = firstPrice;
                }

                if(p){
                    //总金额
                    totalPrice=p;
                    console.log("滑动2时的总金额:"+totalPrice);
                }else{
                    totalPrice=price;
                }

                //预付款初始值设为0
                var prepay = 0;
                //分几期
                var time1 = that.timeArr[0];
                //利息
                var timefFees = that.timefFees[0];
                that.onblur(totalPrice,firstpay, prepay, time1, timefFees);
            },
            function () {
                console.log('接口请求失败');
                console.log(error);
            }
        );

    },
    onblurs: function () {
        var that = this;
        var prepayValue;
        var firstpayValue;
        var timeValue;
        var interest;
        $(".firstPay").blur(function () {
            bl();
            if (firstpayValue < firstPrice) {
                alert("请输入的金额不小于最低首付" + firstPrice);
            }

        });

        $(".prepay").blur(function () {
            bl();
        });
        var pricess;
        function bl() {
            if(that.flag){
                pricess=price;
            }else{
                pricess=that.TotalPrice
            }
            console.log("不滑动时失去焦点事件获取的总金额："+price);
            console.log("滑动时失去焦点事件获取的总金额："+that.TotalPrice);
            firstpayValue = $(".firstPay").val();
            prepayValue = $(".prepay").val();
            timeValue = $(".timeChoose").html();
            if (that.interest == "") {
                var timefFee = that.timefFees[0];
                interest = timefFee;
            } else {
                interest = that.interest;
            }
            that.onblur(pricess,firstpayValue, prepayValue, timeValue, interest);

            if (prepayValue.indexOf(".") > -1 || parseInt(prepayValue) < 0) {
                alert("首付金额不能是小数和负数");
            }
            if(parseInt($(".price").html())<0){
                alert("分期金额数不能小于0,请重新输入");
                window.location.reload();
            }
        }
    },



    onblur: function (prices,firstpay, prepay, time, timefFees) {
        var that = this;
        that.poundage = ((prices - firstpay - prepay) * timefFees) / time;// 计算利息
        console.log("利息:" + that.poundage);
        that.shouldPay = ((prices - firstpay - prepay) / time + that.poundage).toFixed(2);  // 计算每月应还
        console.log("每月应该还:" + that.shouldPay);
        $(".shouldPay").html(that.shouldPay);
        that.price = prices - firstpay - prepay;
        // if ($(".prepay").val()) {
            $(".price").html(that.price.toFixed(2));

        // }

    },
    load: function () {// 上传合同资料
        var that = this;
        var business = $(".business").html();
        var produce = $(".produce").html();
        var firstPay = $(".firstPay").val();
        var prepay = $(".prepay").val();
        var price = $(".price").html();
        var time = $(".timeChoose").html();
        var shouldPay = $(".shouldPay").html();

        var data = {
            business: business,
            produce: produce,
            firstPay: firstPay,
            prepay: prepay,
            price: price,
            time: time,
            shouldPay: that.shouldPay,
            poundage: shouldPay,
            si_id: that.swiperId,
            pType: that.pType
        };


        if (firstPay && prepay && price && shouldPay) {// 如果输入框都不为空的话，跳转到上传页面
            go_page('../../pages/travel/travel_upload_contract.html', [{'isOrder': 1}, {'dataUrl': JSON.stringify(data)}]);
        } else {
            if (parseInt(that.prepay) == 0) {
                go_page('../../pages/travel/travel_upload_contract.html', [{'isOrder': 1}, {'dataUrl': JSON.stringify(data)}]);
            } else {
                alert('请输入正确金额')

            }

        }

    },
    evalvalue: function () {

        var that = this;
        var business = $(".business").html();
        var produce = $(".produce").html();
        var firstPay = $(".firstPay").val();
        var prepay = $(".prepay").val();
        var price = $(".price").html();
        var time = $(".timeChoose").html();
        var shouldPay = $(".shouldPay").html();
        //利息先设个值
        var poundage = 0.015;
        that.evalValue = {};
        that.evalValue.Business = business;
        that.evalValue.produce = produce;
        that.evalValue.prepay = prepay;
        that.evalValue.firstPay = firstPay;
        that.evalValue.price = price;
        //
        that.evalValue.poundage = poundage;
        that.evalValue.time = time;
        that.evalValue.shouldPay = shouldPay;
        return that.evalValue;
    },
    orderPay: function () {//提交预定
        var that = this;
        that.evalvalue();
        var datas = that.evalValue;
        console.log(datas);
        var data = {  // url带过去的数据
            token: getToken(),
            oPId: pId,// 商品Id
            oTotalPrice: datas.price,//商品总价
            oTotalFirstPrice: datas.firstPay,//首付款
            oPrepayMoney: datas.prepay,//预付款
            oTotalDuration: datas.time,// 分期月数
            oDurationMoney: datas.shouldPay,//每月应还
            oIsQianyue: 0, // 是否签约订单
            oTotalSxfMoney: parseInt(datas.poundage) * parseInt(datas.time),//手续费
        };

        var data = {};

        if (state == 2) {
            data = {  // url带过去的数据
                token: getToken(),
                oPId: that.pId,// 商品Id
                oTotalPrice: datas.price,//商品总价
                oTotalFirstPrice: datas.firstPay,//首付款
                oPrepayMoney: datas.prepay,//预付款
                oTotalDuration: datas.time,// 分期月数
                oDurationMoney: datas.shouldPay,//每月应还
                oIsQianyue: 1, // 是否签约订单
                oTotalSxfMoney: datas.poundage * datas.time,//手续费
                // oRemark: '备注', // 备注
                contractNum: contractNum// 合同随机码
            };
        } else {
            data = {  // url带过去的数据
                token: getToken(),
                oPId: that.pId,// 商品Id
                oTotalPrice: datas.price,//商品总价
                oTotalFirstPrice: datas.firstPay,//首付款
                oPrepayMoney: datas.prepay,//预付款
                oTotalDuration: datas.time,// 分期月数
                oDurationMoney: datas.shouldPay,//每月应还
                oIsQianyue: 0, // 是否签约订单
                oTotalSxfMoney: datas.poundage * datas.time,//手续费
                // oRemark: '备注', // 备注
            };
        }
        ;

        var firstPayvalue = $(".firstPay").val();
        var prepayValue = $(".prepay").val();
        if (firstPayvalue.indexOf(".") > -1 || parseInt(firstPayvalue) < 0) {
            alert("首付金额不能是小数和负数");
        } else {
            if (prepayValue == "") {
                alert("请输入预付款金额");
            } else if (prepayValue.indexOf(".") > -1 || parseInt(prepayValue) < 0) {
                alert("预付款金额不能是小数和负数");
            } else {
                if (parseInt(firstPayvalue) >= firstPrice) {
                    var business = $(".business").html();
                    that.Business = business;
                    go_page('../../pages/travel/orderDetail.html', [{'urlData': JSON.stringify(data)}, {'name': that.Business}]);
                } else {
                    alert("首付的输入金额不低于最低首付");
                }
            }

        }
    }
};

$(function () {
    decorationObj.init();

});