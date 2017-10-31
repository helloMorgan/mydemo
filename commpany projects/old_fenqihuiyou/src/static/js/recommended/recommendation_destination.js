/**
 * Created by D on 2017/2/11.
 */
controllerFunc('destination', 'destinationController', function ($scope, $http, $timeout) {

    $scope.list = [];
    function initView() {
        getBanner();
        initInfoList();
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



    function initInfoList() {
        $http({
            method: 'POST',
            url: BaseUrl + 'product1/searchDestInfoList',
        }).then(function (response) {
            if (response.data.result === SUCCESS_CODE) {
                $scope.destNameList = response.data.data;
                $scope.destList = [];

                $timeout(function () {
                    $('.container_left>ul>li').eq(0).addClass('visted');
                    changListData(0);
                },200);
            }
        }, function (response) {
            console.error('数据请求失败');
        });
    }
    

    function changListData(index) {
        $scope.list = [];
        for (var j = 0; j < $scope.destNameList[index].destList.length; j++) {
            $scope.list.push($scope.destNameList[index].destList[j]);
        }
    }

    $scope.changeList = function (i) {
        $('.container_left>ul>li').eq(i).addClass('visted').siblings().removeClass('visted');
        changListData(i);
    };

    function getBanner() {
        $http({
            method: 'POST',
            params: {
                type: 12,
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

    initView();

    $scope.searchBourn = function (lbId, name) {
        go_page('../../pages/travel/travel_product_list.html', [{'lbId': lbId}, {'laName': name},{'source':'label22'}]);
    };

    $scope.goSearch=function () {
        go_page('../../pages/account/home_search.html');
    };

    $scope.toDetail = function (pId) {
        go_page('../travel/travel_detail_info.html', [{'pId': pId}]);
    };


});