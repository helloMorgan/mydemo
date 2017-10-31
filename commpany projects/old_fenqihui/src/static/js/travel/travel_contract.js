/**
 * Created by Timor on 2016/11/22.
 */


controllerFunc('contractApp', 'contractCtrl', function ($scope, $http) {
//    图片展示、隐藏
    $scope.imgSelect = false;
    $scope.imgShow = {'display': 'block'};
    $scope.imgHidden = {'display': 'none'};

    $scope.imgList = [];

    $scope.oss = OSS_IMG_URL;

    $scope.tit = "查看旅行合同";

//    获取合同图片数据
    function getContractImg() {
        var conId = GetQueryString('conId');
        $http({
            method: 'POST',
            url: BaseUrl + 'contractInfo/findConImgs',
            params: {
                'token': getToken(),
                'conId': conId
            }
        }).then(function (response) {
            //获取图片oss token
            getImgToken();
            if (response.data.result == SUCCESS_CODE) {
                // $scope.travelContract = response.data.type1;
                $scope.travelContract = ['3166'];

                $scope.payContract = response.data.type2;
                $scope.otherContract = response.data.type3;

                //
                // if($scope.payContract.length == 0) {
                //     $scope.payShow = true;
                // }
                //
                // if($scope.otherContract.length == 0) {
                //     $scope.otherShow = true;
                // }


            } else if (response.data.result == ERROR_CODE) {
                console.log('失败数据请求！');
            }
        }, function () {
            console.log('网络异常！');
        })
    }

    //获取图片token接口
    function getImgToken() {
        // var BaseOssUrl = 'http://test.51fenqihui.com/';
        $http({
            method: 'POST',
            url: BaseUrl + 'oss/searchToken',
            params: {}
        }).then(function (response) {
            // console.log(response.data.accessKeySecret);
            if (response.data.result == SUCCESS_CODE) {

            } else if (response.data.result == ERROR_CODE) {
                console.log('数据请求失败！')
            }
        }, function () {

        })
    }

    $scope.scaleImg = function ($event, $index) {
        //图片展示
        // initSwiper();
        $scope.imgSelect = true;
        $scope.imgUrl = $($event.target).attr('src');
        let sum = $scope.travelContract.length;


        // $scope.tit = $index+1 + " / " + sum;
    };

    // function initSwiper() {
    //     var mySwiper = new Swiper('.swiper-container', {
    //         direction: 'horizontal',
    //         autoplay: 500,
    //         //auto slide
    //         loop: true,
    //         freeModeMomentumBounce: false,
    //         pagination: '.swiper-pagination',
    //     });
    //     // mySwiper.slideTo(2, 0);
    // }


//    图片展示框点击隐藏
    $scope.shelterHidden = function () {
        $scope.imgSelect = false;
        $scope.tit = "查看旅行合同";
    };


    getContractImg();
});
