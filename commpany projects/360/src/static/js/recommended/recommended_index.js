controllerFunc('mainPage', 'mainController', function ($scope, $http, $timeout) {
    const TOKEN = getToken();
    var page=1;
    $scope.proItems=[];
    $scope.loginTag = true;
    {
        initView();
        getBanner();
        checkRealName();
        getLabelInfo();
        getProductList();
        bindEvent();
        // getBanner();
    }
    $scope.goSearch=function () {
        go_page('../../pages/account/home_search.html');
    };
    var isLoading=true;
    $(window).scroll(function () {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();

        if ((scrollHeight - scrollTop - windowHeight < 20) && (isLoading == false)) {
            isLoading = true;
            getProductList();
         }
    });
    function initView() {
        var ele = {
            head: $('.route-search').eq(0),
            offsetTop: $('.route-search').eq(0).offset().top,
            search: $('#route_search')
        };
        $('#main-wrap section').css('display', 'none');
        $('#foot_check1').siblings('span').css('color', 'red');

        $scope.dialog = new Dialog(DIALOG_DIALOG,"请在微信中打开此功能");
        // $(window).scroll(function (event) {
        //     /* Act on the event */
        //     ele.scrollTop = $(window).scrollTop();
        //     var pos = ele.offsetTop - ele.scrollTop;
        //     var param = (-pos / 100);
        //     if (pos <= 0) {
        //         ele.head.css('position', 'fixed').css('top', '0');
        //         console.log(parseInt(ele.head.css('opacity')) + '----');
        //         var opacityVal = ele.search.css('opacity');
        //         if (param > opacityVal) {
        //             ele.search.css('opacity', param);
        //             if (opacityVal > 1) {
        //                 //  ele.head.css('background', 'red').css('opacity', param/2);
        //             }
        //         }
        //     } else {
        //         ele.head.css('position', 'absolute').css('top', '10px');
        //         ele.search.css('opacity', 0.7);
        //         //    ele.head.css('background', '').css('opacity','');
        //     }
        // });

    }

    function initSwiper() {
        var mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal',
            //auto slide
            autoplay: 5000,
            loop: true,
            freeModeMomentumBounce: false,
            pagination: '.swiper-pagination',
        });

    }


    function checkRealName() {
        $scope.isRealName = true;
        if (TOKEN) {
            $http({
                method: 'POST',
                params: {
                    token: TOKEN
                },
                url: BaseUrl + 'members/searchRealNameStatus',
            }).then(function (response) {
                if (response.data.result === SUCCESS_CODE) {
                    //$('#recommended_real_name').css('backgroundSize','0px');
                    if (response.data.status === '1' && response.data.accountStatus === '1') {
                        $scope.isRealName = false;
                    }
                }
                else {
                    $scope.isRealName = true;
                }
            }, function (response) {
                console.error('数据请求失败');
                $scope.isRealName = true;
            });
        } else {
            $scope.isRealName = true;
        }
    }


    function getLabelInfo() {
        $http({
            method: 'POST',
            url: BaseUrl + 'product1/searchLabelList',
        }).then(function (response) {
            if (response.data.result === SUCCESS_CODE) {
                $scope.labelArray=response.data.data;
            }
        }, function (response) {
            console.error('数据请求失败');
        });
    }

    function getBanner() {
        $http({
            method: 'POST',
            params: {
                type: 1,
                pageSize: 1
            },
            url: BaseUrl + 'product1/searchCarouselImgList',
        }).then(function (response) {
            if (response.data.result === SUCCESS_CODE) {
                $scope.bannerList = response.data.data;
                $timeout(function () {
                    initSwiper();
                }, 500);
            }
        }, function (response) {
            console.error('数据请求失败');
        });
    }

    function getProductList() {
        $http({
            method: 'POST',
            url: BaseUrl + 'product1/searchProductList',
            params:{
                isHot:2,
                pageSize:page,
                id:0
            }
        }).then(function (response) {
            if (response.data.result === SUCCESS_CODE) {
                if(response.data.data||response.data.data.length){
                    if(response.data.data.length==10){
                        isLoading = false;
                        page++;
                    }
                    $scope.proItems=$scope.proItems.concat(response.data.data);

                }

            }
        }, function (response) {
            console.error('数据请求失败');
        });
    }


    function bindEvent() {

        $scope.toDetail = function (pId) {
            go_page('../travel/travel_detail_info.html', [{'pId': pId}]);
    };


    $scope.searchBourn = function (lbId, name) {
        go_page('../../pages/travel/travel_product_list.html', [{'lbId': lbId}, {'laName': name},{'source':'label'}]);
    };

    $scope.searchDetail = function (item) {
        go_page('../travel/travel_detail_info.html', [{'pId': item.pId}]);
    };

        //
        $scope.toRealName = function () {
            if (TOKEN) {
                if ($scope.isRealName) {
                    go_page('../travel/travel_upload_cdCard.html');
                }
            } else {
                go_page('../account/user_login.html');
            }
        }
    }

});


