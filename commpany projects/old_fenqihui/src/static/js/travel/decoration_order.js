/**
 * Created by yu on 2017/3/20.
 */
controllerFunc('ngOrder', 'ngOrderCtl', function ($scope, $http, $timeout, $q) {
    $scope.data = {
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
        interest: '',
        pId: '', // 产品的id
        poundage: ''//手续费

    };

    // var initUrl = GetQueryString('reloadState');
    var urlState = GetQueryString('urlState');
    var contractNum = GetQueryString('contractNum');
    var selectShope = GetQueryString('selectShope');
    var sId = GetQueryString('sId');
    var pId = GetQueryString('pId');
    var pName = GetQueryString('pName');
    var flag = true;
    var flag2 = true;
    var flag3 = true;
    var flag4 = true;

    var swiperId = 1;


    var data = {
        business: $scope.data.Business,
        produce: $scope.data.produce,
        firstPay: $scope.data.firstPay,
        prepay: $scope.data.prepay,
        price: $scope.data.price,
        time: $scope.data.time,
        shouldPay: $scope.data.shouldPay
    };


    var storage = window.sessionStorage;

    function http(uri, dataList) { // http封装请求
        var deferred = $q.defer();
        $http({
            url: uri,
            method: "POST",
            params: dataList
        }).success(function (res) {
            deferred.resolve(res);
        }).error(function (error) {
            deferred.reject(error)
        });
        return deferred.promise
    }

    $scope.state = GetQueryString('urlState');

    $scope.popup = function (value) {// 选择商家 产品触发弹出层和选项，用数字1,2,3进行区分
        $scope.data.popup = true;
        if (value == 1) {
            document.getElementsByClassName("swiper-containerBusiness")[0].style.visibility = "visible";
            document.getElementsByClassName("popupSubmit")[0].style.visibility = "visible";
            $scope.Business()
        } else if (value == 2) {
            document.getElementsByClassName("swiper-containerProduce")[0].style.visibility = "visible";
            document.getElementsByClassName("popupSubmit")[1].style.visibility = "visible";
            var businessIndex = swiperId;
            $scope.produce(businessIndex);
        } else {
            document.getElementsByClassName("swiper-containerTime")[0].style.visibility = "visible";
            document.getElementsByClassName("popupSubmit")[2].style.visibility = "visible";
            var timeIndex = storage.getItem('prudece');
            $scope.time(timeIndex)
        }
    };
    $scope.stages = function () {// 分期月数的弹窗控制
        $scope.data.popup = true;
        $scope.data.stages = true;
    };
    $scope.popupVanish = function () {// 隐藏背景弹框
        $scope.data.popup = false;
        document.getElementsByClassName("swiper-containerProduce")[0].style.visibility = "hidden";
        document.getElementsByClassName("swiper-containerTime")[0].style.visibility = "hidden";
        document.getElementsByClassName("swiper-containerBusiness")[0].style.visibility = "hidden";
        document.getElementsByClassName("popupSubmit")[0].style.visibility = "hidden";
        document.getElementsByClassName("popupSubmit")[1].style.visibility = "hidden";
        document.getElementsByClassName("popupSubmit")[2].style.visibility = "hidden";
        $scope.data.stages = false;
    }
    $scope.Business = function () {//请求商家的列表
        http(BaseUrl + 'suppliersInfo/getSuppliersInfoListByCondition').then(
            function (res) {
                $scope.data.businessArr = res.data;
                storage.setItem("businessArr", JSON.stringify($scope.data.businessArr));// 本地缓存商家列表
                $scope.data.businessList = true;
                $timeout(function () {
                    var mySwiper = new Swiper('.swiper-containerBusiness', {// swiper 滑动
                        initialSlide: 0,
                        direction: 'vertical',
                        slidesPerView: 3,
                        freeModeSticky: true,
                        spaceBetween: 0,
                        centeredSlides: true,
                        freeModeMomentumBounce: false,
                        onInit: function (swiper) {//初始化商家名
                            if (selectShope) {
                                $scope.data.Business = selectShope;
                            } else {
                                $scope.data.Business = $scope.data.businessArr[0].si_name;
                            }
                        },
                        onTransitionEnd: function (swiper) {// 滑动选择商家
                            $scope.data.businessArr[swiper.activeIndex].si_name ? $scope.data.Business = $scope.data.businessArr[swiper.activeIndex].si_name : alert("商家名字为空或者不存在")
                            //$scope.data.index = $scope.data.businessArr[swiper.activeIndex].si_id;
                            storage.setItem("business", $scope.data.businessArr[swiper.activeIndex].si_id);// 本地储存滑动选择的商家id
                            swiperId = $scope.data.businessArr[swiper.activeIndex].si_id;
                        }
                    })
                })
            },
            function (error) {
                console.log('接口请求失败');
                console.log(error)
            }
        )
    };

    $scope.Business() // 初始化数据
    $scope.produce = function (index) {// 请求产品的数据
        var businessArr = [];
        businessArr = JSON.parse(storage.getItem('businessArr'));
        var info;
        if (sId && flag2) {
            flag2 = false;
            info = sId;
        } else {
            if (index) {
                info = index;	// index 就是选择的那个id
            } else {
                // info = businessArr[0].si_id// info为默认ID
                info = swiperId;
            }

        }

        var data = {
            psiid: info
        };


        http(BaseUrl + 'fqhpro/getFqhProductByCondition', data).then(
            function (res) {
                $scope.data.produceArr = res.data;
                storage.setItem("produceArr", JSON.stringify($scope.data.produceArr));
                //TODO
                $scope.data.produceArr != ' ' ? $scope.data.produce = $scope.data.produceArr[0].p_title : alert("商家名字为空或者不存在");
                $scope.data.firstPay = $scope.data.produceArr[0].p_first_fee;//首付款、
                $scope.data.dataPay = $scope.data.produceArr[0].p_first_fee;//与首付款进行比较
                $scope.data.p_price = $scope.data.produceArr[0].p_price;// 总金额
                $scope.data.pType = $scope.data.produceArr[0].pType; // 商品类别
                if (pId) {
                    $scope.data.pId = pId;
                } else {
                    $scope.data.pId = $scope.data.produceArr[0].p_id;// 初始化产品id
                }


                $timeout(function () {
                    $scope.time()
                });
                $timeout(function () {
                    var mySwiper = new Swiper('.swiper-containerProduce', {//第二个swiper
                        initialSlide: 0,
                        direction: 'vertical',
                        slidesPerView: 3,
                        freeModeSticky: true,
                        spaceBetween: 0,
                        centeredSlides: true,
                        freeModeMomentumBounce: false,
                        onTransitionEnd: function (swiper) {
                            //TODO
                            if (flag && pName) {
                                flag = false;
                                $scope.data.produce = pName;
                            } else {
                                $scope.data.produceArr[swiper.activeIndex].p_title ? $scope.data.produce = $scope.data.produceArr[swiper.activeIndex].p_title : alert("商家名字为空或者不存在")
                            }
                            storage.setItem("prudece", $scope.data.produceArr[swiper.activeIndex].p_fee_id);
                            $scope.data.firstPay = $scope.data.produceArr[swiper.activeIndex].p_first_fee;// 首付金额
                            $scope.data.dataPay = $scope.data.produceArr[swiper.activeIndex].p_first_fee;//与首付金额进行对比
                            $scope.data.p_price = $scope.data.produceArr[swiper.activeIndex].p_price// 总金额
                            $scope.data.pType = $scope.data.produceArr[swiper.activeIndex].pType; // 商品类别
                            if (flag3 && pId) {
                                $scope.data.pId = pId;
                            } else {
                                $scope.data.pId = $scope.data.produceArr[swiper.activeIndex].p_id; //选择滑动商品的id
                            }


                        }
                    })
                })

            },
            function (error) {
                console.log('接口请求失败');
                console.log(error);
            }
        )

    }
    $timeout(function () {
        $scope.produce();
    });

    $scope.time = function (index) {// 选择期数
        var timeArr = JSON.parse(storage.getItem('produceArr'));
        var infoTime
        if (index) {
            infoTime = index
        } else {
            infoTime = timeArr[0].p_fee_id;
        }

        var data = {
            fId: infoTime
        }
        http(BaseUrl + 'feeRate/getFeeRateById', data).then(
            function (res) {

                if ($scope.data.price < 0) {
                    alert('请输入正确的金额(分期金额不能小于0)');
                    window.location.reload();
                }
                ;
                $scope.data.timeArr = res.data.fDuration.split(',');
                $scope.data.timeArr != ' ' ? $scope.data.time = $scope.data.timeArr[0] : alert("商家汇率为空或者不存在");
                $scope.update = function () {// 初始化利率
                    $scope.data.interest = res.data.fFee.split(',')[0]//获取利率
                    if ($scope.data.prepay >= 0 && $scope.data.firstPay) {
                        // // ttt
                        $scope.data.poundage = (($scope.data.p_price - $scope.data.firstPay - $scope.data.prepay) * $scope.data.interest) / $scope.data.time;// 计算利息
                        $scope.data.shouldPay = Math.ceil(($scope.data.p_price - $scope.data.prepay - $scope.data.firstPay) / $scope.data.time + $scope.data.poundage);
                        // 计算每月应还
                        console.log("选择期数计算：  " + $scope.data.shouldPay);

                    } else {
                        console.log('请填写正确的金额')
                    }
                }
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
                        $scope.data.timeArr != ' ' ? $scope.data.time = $scope.data.timeArr[swiper.activeIndex] : alert("商家汇率为空或者不存在");
                        $scope.data.interest = res.data.fFee.split(',')[swiper.activeIndex]//获取利率
                        if ($scope.data.prepay >= 0 && $scope.data.firstPay) {
                            $scope.data.poundage = (($scope.data.p_price - $scope.data.firstPay - $scope.data.prepay) * $scope.data.interest) / $scope.data.time;// 计算利息
                            $scope.data.shouldPay = Math.ceil(($scope.data.p_price - $scope.data.prepay - $scope.data.firstPay) / $scope.data.time + $scope.data.poundage)  // 计算每月应还
                            console.log("轮播结束： " + $scope.data.interest);
                        } else {

                            console.log('请填写正确的金额')
                        }
                        // 产品的id
                        /*$scope.data.produceArr[swiper.activeIndex].p_title?$scope.data.produce= $scope.data.produceArr[swiper.activeIndex].p_title:alert("商家名字为空或者不存在")
                         //$scope.data.index = $scope.data.businessArr[swiper.activeIndex].si_id;
                         storage.setItem("produceArr",$scope.data.produceArr);
                         storage.setItem("prudece",$scope.data.produceArr[swiper.activeIndex].p_fee_id);*/
                    }
                })
            },
            function (error) {
                console.log('接口请求失败');
                console.log(error)
            }
        )
    }

    $scope.popupSbumit = function (value) {// 弹出层的控制
        $scope.data.popup = false;
        document.getElementsByClassName("swiper-containerProduce")[0].style.visibility = "hidden";
        document.getElementsByClassName("swiper-containerTime")[0].style.visibility = "hidden";
        document.getElementsByClassName("swiper-containerBusiness")[0].style.visibility = "hidden";
        document.getElementsByClassName("popupSubmit")[0].style.visibility = "hidden";
        document.getElementsByClassName("popupSubmit")[1].style.visibility = "hidden";
        document.getElementsByClassName("popupSubmit")[2].style.visibility = "hidden";
        if (value == 1) {// 选择商家时电击确定触发的事件
            var businessIndex = storage.getItem('business');
            //fffff
            $scope.produce(swiperId);
        } else if (value == 2) {// 选择产品时确定触发的事件
            var timeIndex = storage.getItem('prudece');
            $scope.time(timeIndex)
        } else {

        }
    }
    $scope.load = function () {// 上传合同资料
        var data = {
            business: $scope.data.Business,
            produce: $scope.data.produce,
            firstPay: $scope.data.firstPay,
            prepay: $scope.data.prepay,
            price: $scope.data.price,
            time: $scope.data.time,
            shouldPay: $scope.data.shouldPay,
            poundage: $scope.data.poundage,
            si_id: swiperId,
            pType : $scope.data.pType
        };


        console.log(JSON.stringify(data));
        if ($scope.data.firstPay && $scope.data.prepay && $scope.data.price && $scope.data.shouldPay) {// 如果输入框都不为空的话，跳转到上传页面
            go_page('../../pages/travel/travel_upload_contract.html', [{'isOrder': 1}, {'dataUrl': JSON.stringify(data)}]);
        } else {
          if(parseInt($scope.data.prepay)==0){
            go_page('../../pages/travel/travel_upload_contract.html', [{'isOrder': 1}, {'dataUrl': JSON.stringify(data)}]);
          }else{
            alert('请输入正确金额')
            
          }

        }

    };


    $scope.onblue = function (value, num) { // input 失焦事件
        var re = new RegExp("^(([0-9]|([1-9][0-9]{0,9}))((\.[0-9]{1,2})?))$");// 金额的正则表达式
        function blue() {
            if ($scope.data.prepay >= 0 && $scope.data.firstPay) {
                $scope.data.price = $scope.data.p_price - $scope.data.firstPay - $scope.data.prepay// 计算分期金额
                // $scope.data.poundage = ($scope.data.p_price - $scope.data.firstPay) * $scope.data.interest * $scope.data.time// 计算利息
                // //ttt
                // $scope.data.shouldPay = Math.ceil(($scope.data.p_price - $scope.data.prepay - $scope.data.firstPay) / $scope.data.time + $scope.data.poundage)  // 计算每月应还
                //
                // console.log($scope.data.interest);

                $scope.time();
            }

        }

        if (num == 1) {
            re.test(value) ? $scope.data.warn = false : $scope.data.warn = true;
            if ($scope.data.firstPay < $scope.data.dataPay) {// 输入金额不能少于首付金额
                alert('首付金额请输入不小于最低首付' + $scope.data.dataPay);
            }
            blue()
        } else if (num == 2) {
            if ($scope.data.price < 0) {
                alert('请输入正确的金额(分期金额不能小于0)');
            } else {
                // console.log("金额大于0,正确");
                blue();
                $scope.update();
                re.test(value) ? $scope.data.warn1 = false : $scope.data.warn1 = true;
            }


        } else {
            re.test(value) ? $scope.data.warn2 = false : $scope.data.warn2 = true;
        }
    }
    $scope.orderPay = function () {//提交预定


        var data = {  // url带过去的数据
            token: getToken(),
            oPId: $scope.data.pId,// 商品Id
            oTotalPrice: $scope.data.price,//商品总价
            oTotalFirstPrice: $scope.data.firstPay,//首付款
            oPrepayMoney: $scope.data.prepay,//预付款
            oTotalDuration: $scope.data.time,// 分期月数
            oDurationMoney: $scope.data.shouldPay,//每月应还
            oIsQianyue: 0, // 是否签约订单
            oTotalSxfMoney: $scope.data.poundage * $scope.data.time,//手续费
            // oRemark: '备注', // 备注
            // contractNum:parseInt(Math.random()*10000)// 合同随机码
        };

        var data = {};

        if ($scope.state == 2) {
            data = {  // url带过去的数据
                token: getToken(),
                oPId: $scope.data.pId,// 商品Id
                oTotalPrice: $scope.data.price,//商品总价
                oTotalFirstPrice: $scope.data.firstPay,//首付款
                oPrepayMoney: $scope.data.prepay,//预付款
                oTotalDuration: $scope.data.time,// 分期月数
                oDurationMoney: $scope.data.shouldPay,//每月应还
                oIsQianyue: 1, // 是否签约订单
                oTotalSxfMoney: $scope.data.poundage * $scope.data.time,//手续费
                // oRemark: '备注', // 备注
                contractNum: contractNum// 合同随机码
            };
        } else {
            data = {  // url带过去的数据
                token: getToken(),
                oPId: $scope.data.pId,// 商品Id
                oTotalPrice: $scope.data.price,//商品总价
                oTotalFirstPrice: $scope.data.firstPay,//首付款
                oPrepayMoney: $scope.data.prepay,//预付款
                oTotalDuration: $scope.data.time,// 分期月数
                oDurationMoney: $scope.data.shouldPay,//每月应还
                oIsQianyue: 0, // 是否签约订单
                oTotalSxfMoney: $scope.data.poundage * $scope.data.time,//手续费
                // oRemark: '备注', // 备注
            };
        }
        if ($scope.data.firstPay && $scope.data.prepay && $scope.data.price && $scope.data.shouldPay) {
            if ($scope.data.firstPay >= $scope.data.dataPay) {
                if (($scope.data.prepay < $scope.data.price)) {
                    go_page('../../pages/travel/orderDetail.html', [{'urlData': JSON.stringify(data)}, {'name': $scope.data.Business}]);

                } else {
                    alert("预付款金额不能大于分期金额");
                }
            } else {
                alert('首付金额请输入不小于最低首付' + $scope.data.dataPay);
            }
        }
        else {
            var res = new RegExp("^([0-9])|([1-9]\d+)\.\d?$");//小数的正则表达式
            var prepays = res.test($scope.data.prepay);
            var firstpays = res.test($scope.data.firstPay);
            if (parseInt($scope.data.prepay) == 0) {

                if ($scope.data.firstPay >= $scope.data.dataPay) {
                    go_page('../../pages/travel/orderDetail.html', [{'urlData': JSON.stringify(data)}, {'name': $scope.data.Business}]);

                } else {
                    if (firstpays) {
                        alert('首付金额请输入不小于最低首付' + $scope.data.dataPay);
                    } else {

                        alert('首付输入金额不能是小数,空值');

                    }
                }
            }
            else if (!firstpays) {
                alert('首付输入金额不能是小数,空值');

            }
            else if (!prepays) {
                alert('预付款输入金额不能是小数,空值');

            }
            else {
                alert('金额不能为空，请检查');
            }
        }

    };

    function urlInit() {
        var initDate = JSON.parse(GetQueryString('dataUrl'));
        console.log(initDate);
        if (urlState == 2) {
            $scope.data.Business = initDate.business;
            $scope.data.produce = initDate.produce;
            $scope.data.firstPay = initDate.firstPay;
            $scope.data.prepay = initDate.prepay;
            $scope.data.price = initDate.price;
            $scope.data.time = initDate.time;
            $scope.data.shouldPay = initDate.shouldPay;
            $scope.data.oIsQianyue = 1;
            $scope.data.contractNum = contractNum;
            $scope.data.poundage = initDate.poundage;
            swiperId = initDate.si_id;

            $scope.produce(initDate.si_id);

        }


    }

    $timeout(function () {
        $scope.$apply(function () {
            urlInit();
        });
    }, 200)
});