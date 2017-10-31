var app = controllerFunc('ngScope', 'ngController', function ($scope, $http, $timeout, $q) {
    $scope.dialogObj = new Dialog(DIALOG_DIALOG);
    $scope.dialog = false;
    $scope.msg = '';
    $scope.isMsg = true;
    $scope.isShelter = false;
    var pId = GetQueryString('pId');
    var sourcePage = GetQueryString('sourcePage') || '';
    //页面跳转来源 ps==pi  来自产品详情页
    var ps = GetQueryString('ps');
    $scope.nowSubmit = true;
    if (ps == 'pi' || ps) {
        $scope.nowSubmit = false;
    }
    $scope.appType = getTypeNative();
    var TOKEN = getToken();
    // alert(getToken());
    // alert(TOKEN);
    //get line of credit
    var isCollection = '2';
    // TOKEN && getCreditMoney() || (function () {
    //     $scope.creditMoney = '0';
    // })();
    //swiper 创建标识
    var swiperId = 0;
    var createSwiper = 0;
    if ($scope.appType == 'ios') {
        $('#travel_detail_guideNav').css('top', '30px');
    }

    //若用户未进行登录时不进行接口请求
    init();
    $scope.renderFinish = function () {
        initView();
    }
    $scope.initBanner = function () {
        var mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal',
            autoplay: 5000, //可选选项，自动滑动
            loop: true,
            pagination: '.swiper-pagination',
            observer: true, //修改swiper自己或子元素时，自动初始化swiper
            observeParents: true, //修改swiper的父元素时，自动初始化swiper
            lazyLoading: true

        });
        $scope.$apply(() => {
            $scope.dialog = false;
        })
    };

    function init() {
        $scope.checkUse = true;
        if (TOKEN) {
            // getCreditMoney();
            //若是没有登录 则一定跳往登录界面  再次进入时才会查询到 实名信息 进行网络请求因此 将 绑定事件分别分在 请求结果 与 else 没有token 处即可
            checkRealName();
        } else {
            bindEvent();
        }
        getBodyData();
    }

    getInfo("2", '10');
    getInfo('3', '10');
    getInfo('4', '10');
    var type2 = true, type3 = true, type4 = true;

    function getInfo(type, num) {
        $http({
            method: 'POST',
            params: {
                pageSize: '1',
                type: type,
                pIds: pId,
                pageNum: num
            },
            url: BaseUrl + 'product1/searchProductImgList',
        }).then((response) => {
            console.log(response);
            console.log(response.data.totalCount > 10);
            if (response.data.totalCount > 10) {
                console.log(response.data.totalCount);
                switch (type) {
                    case '2':
                        if (type2) {
                            getInfo(type, response.data.totalCount);
                            type2 = false;
                            return;
                        }
                        break;
                    case '3':
                        if (type3) {
                            getInfo(type, response.data.totalCount);
                            type3 = false;
                            return;
                        }
                        break;
                    case '4':
                        if (type4) {
                            getInfo(type, response.data.totalCount);
                            type4 = false;
                            return;
                        }
                        break;
                }

            }
            if (type == 2) {
                $scope.travelList = response.data.data;
            } else if (type == 3) {
                $scope.payList = response.data.data;
                if(!$scope.payList) {
                    $scope.payListShow = true;
                }
            } else if (type == 4) {
                $scope.infoList = response.data.data;
                console.error($scope.infoList);
                if(!$scope.infoList) {
                    $scope.infoListShow = true;
                }
            }

        }, (response) => {
            console.error('数据请求失败');
        });
    }

    var initSize = parseFloat(document.getElementsByTagName('html')[0].style.fontSize);
    var slideAHeight;
    var slideBHeight;
    var slideCHeight;
    var imgArr2;

    function initView() {
        if (swiperId == 2) {
            setTimeout(function () {
                slideAHeight = initSize * 0.7;
                var imgArr1 = document.documentElement.getElementsByClassName('info_imgA');
                for (var i = 0; i < imgArr1.length; i++) {
                    slideAHeight += imgArr1[i].offsetHeight;
                }
                if (slideAHeight > 50) {
                    $('.swiper-container-content').css('height', slideAHeight);
                }
                var tabs = $('.tab'),
                    mySwiperContent = new Swiper('.swiper-container-content', {
                        direction: 'horizontal',
                        scrollbar: '.swiper-scrollbar',
                        scrollbarHide: false,
                        onSlideChangeEnd: function (swiper) {
                        },
                        onSlideChangeEnd: function (swiper) {
                            // console.error(swiper.activeIndex); //每次切换时，提示现在是第几个slide
                            let _index = swiper.activeIndex;
                            if (_index == '1') {
                                slideBHeight = initSize * 0.7;
                                if($scope.payListShow) {
                                    imgArr2 = document.documentElement.getElementsByClassName('info_imgB');
                                } else {
                                    imgArr2 = document.documentElement.getElementsByClassName('info_imgC');
                                }
                                // imgArr2 = document.documentElement.getElementsByClassName('info_imgB');

                                for (var i = 0; i < imgArr2.length; i++) {
                                    slideBHeight += imgArr2[i].offsetHeight;
                                }
                                $('.swiper-container-content').css('height', slideBHeight);
                            } else if (_index == '2') {
                                slideCHeight = initSize * 0.7;

                                // var imgArr3 = document.documentElement.getElementsByClassName('info_imgC');

                                var imgArr3 = document.documentElement.getElementsByClassName('info_imgC');

                                console.log(imgArr3);

                                for (var i = 0; i < imgArr3.length; i++) {
                                    slideCHeight += imgArr3[i].offsetHeight;
                                }
                                $('.swiper-container-content').css('height', slideCHeight);

                            } else {
                                slideAHeight = initSize * 0.7;
                                var imgArr1 = document.documentElement.getElementsByClassName('info_imgA');
                                for (var i = 0; i < imgArr1.length; i++) {
                                    slideAHeight += imgArr1[i].offsetHeight;
                                }
                                $('.swiper-container-content').css('height', slideAHeight);
                            }
                            dealEve(tabs.eq(swiper.activeIndex));
                        }
                    });
                $(tabs).on('click', function () {
                    var _index = $(this).index();
                    if (_index == '1') {
                        slideBHeight = initSize * 0.7;
                        if($scope.payListShow) {
                            imgArr2 = document.documentElement.getElementsByClassName('info_imgB');
                        } else {
                            imgArr2 = document.documentElement.getElementsByClassName('info_imgC');
                        }
                        // var imgArr2 = document.documentElement.getElementsByClassName('info_imgB');
                        for (var i = 0; i < imgArr2.length; i++) {
                            slideBHeight += imgArr2[i].offsetHeight;
                        }
                        $('.swiper-container-content').css('height', slideBHeight);
                    } else if (_index == '2') {
                        slideCHeight = initSize * 0.7;
                        var imgArr3 = document.documentElement.getElementsByClassName('info_imgC');
                        for (var i = 0; i < imgArr3.length; i++) {
                            slideCHeight += imgArr3[i].offsetHeight;
                        }
                        $('.swiper-container-content').css('height', slideCHeight);

                    } else {
                        slideAHeight = initSize * 0.7;
                        var imgArr1 = document.documentElement.getElementsByClassName('info_imgA');
                        for (var i = 0; i < imgArr1.length; i++) {
                            slideAHeight += imgArr1[i].offsetHeight;
                        }
                        $('.swiper-container-content').css('height', slideAHeight);
                    }
                    dealEve(tabs.eq(_index));
                    mySwiperContent.slideTo(_index, 1000, false); //切换到第一个slide，速度为1秒
                });
            }, 200);

        } else {
            swiperId++;
        }
        function dealEve(target) {
            target.addClass('travel-tab-active');
            target.siblings().removeClass('travel-tab-active');
        }
    }

    //收藏
    $scope.$watch('msg', function (newVal, oldVal) {
        $timeout(function () {
            $scope.isMsg = true;
        }, 1000, true)
    }, false);

    $scope.telPhone = function () {
        var appType = getTypeNative();
        if (appType == 'android') {
            android.callPhone($scope.siKefuMobile);
        }
        else if (appType == 'ios') {
            callPhone($scope.siKefuMobile);
        } else {

        }
    };


    $scope.collection = function () {
        if (TOKEN) {
            if (isCollection == '0') {
                $http({
                    method: 'POST',
                    url: BaseUrl + 'product1/addProductCollection',
                    params: {
                        token: getToken(),
                        pId: pId
                    },


                }).then((res) => {
                    isCollection = '1';
                    $scope.msg = "收藏" + res.data.message;
                    $scope.isMsg = false;
                    $('.col').html("&#xe650;").css("color", "#ebba24");
                }, () => {
                    $scope.msg = "收藏失败";
                    $scope.isMsg = false;
                });


            } else {
                isCollection = '0';
                $http({
                    method: 'POST',
                    url: BaseUrl + 'product1/cancelProductCollection',
                    params: {
                        token: getToken(),
                        pId: pId
                    },
                }).then((res) => {
                    $scope.msg = "取消" + res.data.message;
                    $scope.isMsg = false;
                    $('.col').html("&#xe683;").css("color", "#ebba24");
                }, () => {
                    $scope.msg = "取消失败";
                    $scope.isMsg = false;

                });
            }
        } else {
            $scope.dialogInfo = '还没登录,立即登录';
            $scope.dialogDown = '取消';
            $('#detailMenu').animateCss('fadeInUp');
            $('#travel-choose-dialog').css('display', 'block');
        }

    };

    function calculateInstallment() {
        //calculate pollRoomPrice


        var installmentArr = [];
        var pay = $scope.pFirstFee || '0';
        // //利息类型
        // $scope.fBtype = '3';
        // //可分期数
        // $scope.fDuration = "3,3";
        // //分期利率
        // $scope.fFee = "0.02,0.03";
        switch ($scope.fBtype) {
            case '1':
                if ($scope.fCmethodType === '1') {
                    $scope.rateDescription = "最终手续费=【(订单金额-首付) * 手续费比例】";
                    //计算费率
                    $scope.poundage = ($scope.forTotalMoney - $scope.pFirstFee) * $scope.fFee;

                } else if ($scope.fCmethodType === '2') {
                    $scope.rateDescription = "最终手续费=【手续费金额】】";
                    $scope.poundage = $scope.fFee;
                }
                break;

            case '2':
                if ($scope.fCmethodType === '1' && $scope.fSwayType === '1') {
                    $scope.rateDescription = "最终手续费=【(订单金额-首付) * (手续费比例- 供应商贴息比例)】";
                    $scope.poundage = ($scope.forTotalMoney - $scope.pFirstFee) * ($scope.fFee - $scope.fSwayFee);
                }

                else if ($scope.fCmethodType === '1' && $scope.fSwayType === '2') {
                    $scope.rateDescription = "最终手续费=【(订单金额-首付) * 手续费比例 - 供应商贴补金额】";
                    $scope.poundage = ($scope.forTotalMoney - $scope.pFirstFee) * $scope.fFee - $scope.fSwayFee;
                }

                break;

            case '3':
                var fenqinum = $scope.fDuration.split("/");
                var fenqiFree = $scope.fFee.split(",");

                var newNums = conversion(fenqinum);
                var newFrees = conversion(fenqiFree);
                $scope.poundages = [];
                if (fenqiFree.length == fenqinum.length) {
                    for (let i = 0; i < fenqinum.length; i++) {
                        $scope.poundages[i] = ($scope.forTotalMoney - $scope.pFirstFee) * newFrees[i];
                    }
                }

                for (var i = 0; i < newNums.length; i++) {
                    var item = {};
                    let installmentAllMoney = $scope.forTotalMoney - pay;
                    $scope.allTotalMoney = installmentAllMoney;
                    item.price = ((installmentAllMoney / newNums[i]) + $scope.poundages[i]).toFixed(2);
                    item.fq = newNums[i];
                    item.pFirstFee = $scope.pFirstFee;
                    item.poundage = $scope.poundages[i] / item.fq;
                    item.fFee = newFrees[i];
                    item.initFee = parseInt(newFrees[i] * 100);
                    // item.initFee =  newFrees[i];
                    installmentArr.push(item);
                }
                $scope.installmentItems = installmentArr;


                $scope.aomountInstallment = $scope.installmentItems[newNums.length - 1].price;
                $scope.staging = $scope.installmentItems[newNums.length - 1].fq;

                break;


            default:
                break;
        }


        if ($scope.fBtype == '3') {
            return;
        }


        for (var i = 0; i < $scope.fqNum.length; i++) {
            var item = {};
            let installmentAllMoney = $scope.forTotalMoney - pay;
            $scope.allTotalMoney = installmentAllMoney;
            item.price = ((installmentAllMoney / $scope.fqNum[i] + $scope.poundage)).toFixed(2);
            item.fq = $scope.fqNum[i];
            item.pFirstFee = $scope.pFirstFee;
            item.poundage = $scope.poundage / item.fq;
            item.fFee = $scope.fFee;
            item.initFee = (item.fFee * 100).toPrecision(1);
            installmentArr.push(item);
        }
        $scope.installmentItems = installmentArr;


        $scope.aomountInstallment = $scope.installmentItems[$scope.fqNum.length - 1].price;
        $scope.staging = $scope.installmentItems[$scope.fqNum.length - 1].fq;
    }
    
    
    function isTokenDetail() {
        if(TOKEN) {
            $http({
                method: 'POST',
                params: {
                    pId: pId,
                    token:TOKEN
                },
                url: BaseUrl + 'product1/searchProductDetail',
            }).then(function (response) {
                if (true) {
                    $scope.siKefuMobile = response.data.data.siKefuMobile;
                    $scope.pTotalMoney = formatNum(response.data.data.pTotalMoney);
                    $scope.pYoungMoney = formatNum(response.data.data.pYoungMoney);

                    $scope.departureMonth = response.data.data.departureMonth.replace(/,/g, '、');
                    $scope.pTitle = response.data.data.pTitle;
                    var fDuration = response.data.data.fDuration;
                    $scope.fDuration = fDuration.replace(/,/g, "/");
                    $scope.pTitleSub = response.data.data.pTitleSub;
                    $scope.salesCount = response.data.data.saleCount;
                    $scope.images = response.data.imageData;
                    $scope.status = response.data.data.status;
                    isCollection = $scope.status;
                    if ($scope.status == '1') {
                        $('.col').html("&#xe650;").css('color', '#ebc223');
                    } else {
                        $('.col').html("&#xe683;").css('color', '#ffff');
                    }

                    $scope.fBtype = response.data.fDurationData.fBtype;
                    $scope.fCmethodType = response.data.fDurationData.fCmethodType;
                    $scope.fFee = response.data.fDurationData.fFee;
                    $scope.fSwayType = response.data.fDurationData.fSwayType;
                    $scope.pFirstFee = toDecimal2(response.data.data.pFirstFee);
                    $scope.myFistFee = parseInt($scope.pFirstFee);
                    $scope.pFirstFee = parseInt($scope.pFirstFee);
                    $scope.fSwayFee = response.data.fDurationData.fSwayFee;
                    $scope.fqNum = fDuration.split(',');
                    let len = $scope.fqNum.length;

                    $scope.forTotalMoney = parseFloat($scope.pYoungMoney.replace(/,/g, ""));
                    $scope.fenNum = len;
                    // $scope.renderFinish = function () {
                    // };

                    calculateInstallment();


                    //oss上传文件

                    setTimeout(function () {
                        $scope.initBanner();
                    }, 500);
                    $scope.toPage = function (menu) {
                        if (!TOKEN) {
                            go_page('../account/user_login.html', [{'toUrl': window.location.href}]);
                        } else {
                            //alert(pId+'--'+fDuration+'----'+$scope.pTitle+'--'+$scope.pTitleSub);
                            // debugger;
                            if ($scope.appType === 'ios') {
                                // $scope.checkUse&& uploadContract(pId, fDuration, $scope.pTitle, $scope.pTitleSub) || realNameAuthentication(TOKEN);
                                if (window.webkit) {
                                    if ($scope.checkUse) {
                                        window.webkit.messageHandlers.uploadContract.postMessage({
                                            pId: pId,
                                            installment: fDuration,
                                            pTitle: $scope.pTitle,
                                            subTitle: $scope.pTitleSub
                                        });
                                    } else {
                                        window.webkit.messageHandlers.realNameAuthentication.postMessage({token: TOKEN});
                                    }
                                } else {
                                    if ($scope.checkUse) {
                                        uploadContract(pId, fDuration, $scope.pTitle, $scope.pTitleSub)
                                    } else {
                                        realNameAuthentication(TOKEN);
                                    }
                                }

                                // if ($scope.checkUse) {
                                //     uploadContract(pId, fDuration, $scope.pTitle, $scope.pTitleSub)
                                // } else {
                                //     realNameAuthentication(TOKEN);
                                // }
                            } else if ($scope.appType === 'android') {
                                if ($scope.checkUse) {
                                    android.uploadContract(pId, fDuration, $scope.pTitle, $scope.pTitleSub);
                                } else {
                                    android.realNameAuthentication(TOKEN);
                                }
                                //$scope.checkUse&& android.uploadContract(pId, fDuration, $scope.pTitle, $scope.pTitleSub) || android.realNameAuthentication(TOKEN);
                            } else {
                                //call wx camera
                                // isOpenInWeixin();
                                if (true) {
                                    if ($scope.checkUse) {
                                        go_page('./travel_upload_contract.html', [
                                            {pId: pId},
                                            {fDuration: response.data.data.fDuration},
                                            {pTitle: response.data.data.pTitle},
                                            {pTitleSub: response.data.data.pTitleSub},
                                            {isQianyue: "1"}
                                        ]);
                                    } else {
                                        go_page('./travel_upload_cdCard.html');
                                    }

                                } else {
                                    $scope.dialogObj.conetent.innerHTML = '请在微信中使用此功能';
                                    $scope.dialogObj.show();
                                }
                            }

                        }
                    };

                    $scope.hideDialog = function () {
                        $('#travel-choose-dialog').css('display', 'none');
                    };

                    $scope.toPage1 = function (name) {
                        switch (name) {
                            case '取消':
                                $('#travel-choose-dialog').css('display', 'none');
                                break;
                            case '未签约':
                                go_page('./travel_choose_product.html', [
                                    {'pId': pId},
                                    {'signing': true},
                                    {'installment': response.data.data.fDuration},
                                    {'pTitle': response.data.data.pTitle},
                                    {'pTitleSub': response.data.data.pTitleSub},

                                ]);
                                break;
                        }
                        // $('#travel-choose-dialog').css('display', 'none');
                    };
                }
            }, function (response) {
                console.error('数据请求失败');
            });
        } else {
            $http({
                method: 'POST',
                params: {
                    pId: pId,
                },
                url: BaseUrl + 'product1/searchProductDetail',
            }).then(function (response) {
                if (true) {
                    $scope.siKefuMobile = response.data.data.siKefuMobile;
                    $scope.pTotalMoney = formatNum(response.data.data.pTotalMoney);
                    $scope.pYoungMoney = formatNum(response.data.data.pYoungMoney);

                    $scope.departureMonth = response.data.data.departureMonth.replace(/,/g, '、');
                    $scope.pTitle = response.data.data.pTitle;
                    var fDuration = response.data.data.fDuration;
                    $scope.fDuration = fDuration.replace(/,/g, "/");
                    $scope.pTitleSub = response.data.data.pTitleSub;
                    $scope.salesCount = response.data.data.saleCount;
                    $scope.images = response.data.imageData;
                    $scope.status = response.data.data.status;
                    isCollection = $scope.status;
                    if ($scope.status == '1') {
                        $('.col').html("&#xe650;").css('color', '#ebc223');
                    } else {
                        $('.col').html("&#xe683;").css('color', '#ffff');
                    }

                    $scope.fBtype = response.data.fDurationData.fBtype;
                    $scope.fCmethodType = response.data.fDurationData.fCmethodType;
                    $scope.fFee = response.data.fDurationData.fFee;
                    $scope.fSwayType = response.data.fDurationData.fSwayType;
                    $scope.pFirstFee = toDecimal2(response.data.data.pFirstFee);
                    $scope.myFistFee = parseInt($scope.pFirstFee);
                    $scope.pFirstFee = parseInt($scope.pFirstFee);
                    $scope.fSwayFee = response.data.fDurationData.fSwayFee;
                    $scope.fqNum = fDuration.split(',');
                    let len = $scope.fqNum.length;

                    $scope.forTotalMoney = parseFloat($scope.pYoungMoney.replace(/,/g, ""));
                    $scope.fenNum = len;
                    // $scope.renderFinish = function () {
                    // };

                    calculateInstallment();


                    //oss上传文件

                    setTimeout(function () {
                        $scope.initBanner();
                    }, 500);
                    $scope.toPage = function (menu) {
                        if (!TOKEN) {
                            go_page('../account/user_login.html', [{'toUrl': window.location.href}]);
                        } else {
                            //alert(pId+'--'+fDuration+'----'+$scope.pTitle+'--'+$scope.pTitleSub);
                            // debugger;
                            if ($scope.appType === 'ios') {
                                // $scope.checkUse&& uploadContract(pId, fDuration, $scope.pTitle, $scope.pTitleSub) || realNameAuthentication(TOKEN);
                                if (window.webkit) {
                                    if ($scope.checkUse) {
                                        window.webkit.messageHandlers.uploadContract.postMessage({
                                            pId: pId,
                                            installment: fDuration,
                                            pTitle: $scope.pTitle,
                                            subTitle: $scope.pTitleSub
                                        });
                                    } else {
                                        window.webkit.messageHandlers.realNameAuthentication.postMessage({token: TOKEN});
                                    }
                                } else {
                                    if ($scope.checkUse) {
                                        uploadContract(pId, fDuration, $scope.pTitle, $scope.pTitleSub)
                                    } else {
                                        realNameAuthentication(TOKEN);
                                    }
                                }

                                // if ($scope.checkUse) {
                                //     uploadContract(pId, fDuration, $scope.pTitle, $scope.pTitleSub)
                                // } else {
                                //     realNameAuthentication(TOKEN);
                                // }
                            } else if ($scope.appType === 'android') {
                                if ($scope.checkUse) {
                                    android.uploadContract(pId, fDuration, $scope.pTitle, $scope.pTitleSub);
                                } else {
                                    android.realNameAuthentication(TOKEN);
                                }
                                //$scope.checkUse&& android.uploadContract(pId, fDuration, $scope.pTitle, $scope.pTitleSub) || android.realNameAuthentication(TOKEN);
                            } else {
                                //call wx camera
                                // isOpenInWeixin();
                                if (true) {
                                    if ($scope.checkUse) {
                                        go_page('./travel_upload_contract.html', [
                                            {pId: pId},
                                            {fDuration: response.data.data.fDuration},
                                            {pTitle: response.data.data.pTitle},
                                            {pTitleSub: response.data.data.pTitleSub},
                                            {isQianyue: "1"}
                                        ]);
                                    } else {
                                        go_page('./travel_upload_cdCard.html');
                                    }

                                } else {
                                    $scope.dialogObj.conetent.innerHTML = '请在微信中使用此功能';
                                    $scope.dialogObj.show();
                                }
                            }

                        }
                    };

                    $scope.hideDialog = function () {
                        $('#travel-choose-dialog').css('display', 'none');
                    };

                    $scope.toPage1 = function (name) {
                        switch (name) {
                            case '取消':
                                $('#travel-choose-dialog').css('display', 'none');
                                break;
                            case '未签约':
                                go_page('./travel_choose_product.html', [
                                    {'pId': pId},
                                    {'signing': true},
                                    {'installment': response.data.data.fDuration},
                                    {'pTitle': response.data.data.pTitle},
                                    {'pTitleSub': response.data.data.pTitleSub},

                                ]);
                                break;
                        }
                        // $('#travel-choose-dialog').css('display', 'none');
                    };
                }
            }, function (response) {
                console.error('数据请求失败');
            });
        }

    }

    function getBodyData() {
        isTokenDetail();
    }


    // function getCreditMoney() {
    //     $http({
    //         method: 'POST',
    //         params: {
    //             token: TOKEN
    //         },
    //         url: BaseUrl + '/members/searchCredit',
    //     }).then((response) => {
    //         if (response.data.result === SUCCESS_CODE) {
    //             console.log(response.data.data);
    //             if (response.data.data.leaveMoney == 0) {
    //                 $scope.creditMoney = response.data.data.leaveMoney;
    //             } else {
    //                 $scope.creditMoney = '￥' + response.data.data.leaveMoney;
    //             }
    //         }
    //     }, (response) => {
    //         console.error('数据请求失败');
    //     });
    // }

    //todo：判断是否实名
    function checkRealName() {
        // return true;
        $http({
            method: 'POST',
            params: {
                token: TOKEN
            },
            url: BaseUrl + 'members/searchRealNameStatus',
        }).then((response) => {
            if (response.data.result == SUCCESS_CODE) {
                //未实名
                if (response.data.status == 0 || response.data.accountStatus == 0) {
                    $scope.checkUse = false;
                }
            }

            bindEvent();

        });
    }

    function bindEvent() {
        $scope.goBack = function () {
            if (!!!sourcePage) {
                if (GetQueryString2('isLogin') && GetQueryString2('isLogin') == 1) {
                    if ($scope.appType == 'ios') {
                        backHome();
                    } else if ($scope.appType == 'android') {
                        android.backHome();
                    } else {
                        toIndex();
                    }
                } else {
                    if ($scope.appType == 'ios') {
                        backHome();
                    } else if ($scope.appType == 'android') {
                        android.backHome();
                    } else {
                        window.history.back();
                    }
                }
            } else {
                if ($scope.appType == 'ios') {
                    backHome();
                } else if ($scope.appType == 'android') {
                    android.backHome();
                }
            }
        };
        $scope.reservePro = function () {
            //check login and change the text
            // $scope.checkUse = checkRealName();
            if ($scope.nowSubmit) {
                if (TOKEN) {
                    //判断是否实名
                    if (!$scope.checkUse) {
                        $scope.dialogInfo = '前往实名认证';
                        $scope.dialogDown = '取消';
                    } else {
                        // $('#detail_to_login').html('已签订旅游合同开始上传');
                        $scope.dialogInfo = '已签订旅游合同开始上传';
                        $scope.dialogDown = '未签约';
                    }
                } else {
                    $scope.dialogInfo = '还没登录,立即登录';
                    $scope.dialogDown = '取消';
                }
                $('#detailMenu').animateCss('fadeInUp');
                $('#travel-choose-dialog').css('display', 'block');
                //  go_page('./travel_choose_product.html',[{'pId':pId},{'lbId':lbId}]);
            }

        };


        //share
        $scope.shareDetail = function () {
            switch ($scope.appType) {
                case 'android':
                    android.fenqihuiShare();
                    break;
                case 'ios':
                    fenqihuiShare();
                    break;
                case 'weixin':

                    break;
                default:
                    $scope.dialogObj.conetent.innerHTML = '请在微信中使用此功能';
                    $scope.dialogObj.show();
                    break;
            }


        }
    }


    $scope.closeStag = function () {
        $scope.isShelter = false;
    };

    $scope.showLayer = function () {
        $scope.isShelter = true;
    };

});