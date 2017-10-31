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
            url: BaseUrl + 'fqhpro/getProductSecondType',
        }).then(function (response) {
            if (response.data.result === SUCCESS_CODE) {
                $scope.destNameList = response.data.data;
                $scope.destList = [];
                var index = GetQueryString('index');
                if(index) {
                    $timeout(function () {
                        var temp = parseInt(index);
                        $scope.changeList(temp);
                    },200);
                } else {
                    $timeout(function () {
                        $('.container_left>ul>li').eq(0).addClass('visted');
                        changListData(0);
                    },200);
                }

            }
        }, function (response) {
            console.error('数据请求失败');
        });
    }
    

    function changListData(index) {
        $scope.list = [];
        // alert("index= " + index);
        for (var j = 0; j < $scope.destNameList[index].secLevel.length; j++) {
            $scope.list.push($scope.destNameList[index].secLevel[j]);
        }
    }

    $scope.changeList = function (i) {
        // alert("i= " + i);
        $('.container_left>ul>li').eq(i).addClass('visted').siblings().removeClass('visted');
        changListData(i);
    };

    function getBanner() {
        $http({
            method: 'POST',
            params: {
                start: 1,
                bType: 2,
                // pTypeId: 1
            },
            url: BaseUrl + 'fqhpro/getFqhProductCarouselImgList',
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
        go_page('../travel/travel_myDetails.html', [{'pId': pId}]);
    };


});