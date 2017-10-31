/**
 * Created by Timor on 2016/11/11.
 */

controllerFunc('orderDetailsApp', 'orderDetailsCtrl', function ($scope, $http) {
//    获取产品的对象
    var oId = GetQueryString('oId');
    var isQianyue = GetQueryString('isQianyue');
    var processStatus = GetQueryString('processStatus');
    var appType = getTypeNative();
    $scope.submitCon = false;
    if (getToken()) {
        $http({
            method: 'POST',
            url: BaseUrl + "order/findOrderInfo/v1",
            params: {
                'token': getToken(),
                'oId': oId
            }
        }).then(function (response) {
            if (response.data.result == '0000') {
                $scope.productItem = response.data;
                //产品图片
                $scope.imgList = response.data.product.lunboUrl.split(',');
                // $scope.imgUrl = response.data.product.imgUrl;
                $scope.imgUrl = $scope.imgList[0];
                $scope.submitCon = statusContract($scope.productItem.order.processStatus);
                setTimeout(function () {
                    swiperRun();
                }, 500)
            }

        }, function () {
            console.error('网络异常');
        });
        //查看合同详情
        $scope.goDeal = function () {
            go_page('./travel_installment_contract_text.html', [{'pId': $scope.productItem.product.pId}, {'oId': $scope.productItem.order.oId},
                {'flag': 1},
                {'isQianyue': isQianyue},
                {'processStatus': processStatus},
            ])
        };
        //查看产品详情
        $scope.productInfo = function () {
            go_page('../../pages/travel/travel_detail_info.html', [{'pId': $scope.productItem.product.pId}, {'ps': 'pi'}]);
        };

        //    查看旅行合同
        $scope.goContract = function () {
            if (appType == 'android') {
                android.showContract($scope.productItem.order.conId);
            } else if (appType == 'ios') {
                showContract($scope.productItem.order.conId);
            } else {
                // go_page('./travel_contract.html',[{'conId':$scope.productItem.order.conId}]);

                if (processStatus == '108') {
                    go_page('./travel_upload_contract2.html', [{'conId': $scope.productItem.order.conId},
                        {'isQianyue': isQianyue},
                        {'processStatus': processStatus},
                        {'oId': $scope.productItem.order.oId}
                    ]);
                } else if(processStatus == '303') {
                    go_page('./travel_view_bcontract.html', [{'conId': $scope.productItem.order.conId},
                        {'isQianyue': isQianyue},
                        {'processStatus': processStatus},
                        {'oId': $scope.productItem.order.oId}
                    ]);
                } else {
                    go_page('./travel_view_contract.html', [{'conId': $scope.productItem.order.conId},
                        {'isQianyue': isQianyue},
                        {'processStatus': processStatus},
                        {'oId': $scope.productItem.order.oId}
                    ]);
                }
            }
        };

        $scope.goBack = function () {
            if(appType == 'android'){
                android.backAccount();
            }else if(appType == 'ios') {
                backAccount();
            } else {
                window.history.back();
            }
        };

        //    查看付款详情
        $scope.goPayDetail = function () {
            go_page('../../pages/pays/pays_info.html', [{'oId': oId}]);
        };

        // $scope.submitContract=function () {
        //     go_page('../../pages/travel/travel_upload_contract.html', [{"onLine": "onLine"},
        //         {"oid": $scope.productItem.order.oId},
        //         {"processStatus": $scope.productItem.order.processStatus},
        //         {"isQianyue": "0"}
        //     ]);
        // }
        //    订单风控审核成功之前的状态
        function statusContract(code) {
            switch (code) {
                case '101':
                    return true;
                    break;
                case '102':
                    return true;
                    break;
                case '107':
                    return true;
                    break;
                case '108':
                    return true;
                    break;
                case '110':
                    return true;
                    break;
                case '111':
                    return true;
                    break;
                case '303':
                    return true;
                    break;
                case '304':
                    return true;
                    break;
                case '305':
                    return true;
                    break;
                case '306':
                    return true;
                    break;
                default :
                    return false;
                    break;
            }
        }

    }

});
//轮播图
function swiperRun() {
    var taboffset = 0;
    var tabs = $('.tab');
    // var mySwiper = new Swiper('.swiper-container', {
    //         direction: 'horizontal',
    //         autoplay: 5000, //可选选项，自动滑动
    //         loop: true,
    //         freeModeMomentumBounce: false,
    //         pagination: '.swiper-pagination',
    //     }),
    //     mySwiperContent = new Swiper('.swiper-container-content', {
    //         direction: 'horizontal',
    //         scrollbar: '.swiper-scrollbar',
    //         scrollbarHide: false,
    //         onSlideChangeEnd: function (swiper) {
    //             alelrt(2);
    //             // console.error(swiper.activeIndex) //每次切换时，提示现在是第几个slide
    //         },
    //         onSlideChangeEnd: function (swiper) {
    //             dealEve(tabs.eq(swiper.activeIndex));
    //         }
    //     });
    $(tabs).on('click', function () {
        var _index = $(this).index();
        dealEve(tabs.eq(_index));
        mySwiperContent.slideTo(_index, 1000, false); //切换到第一个slide，速度为1秒

    });

    function dealEve(target) {
        target.addClass('travel-tab-active');
        target.siblings().removeClass('travel-tab-active');
    }
}