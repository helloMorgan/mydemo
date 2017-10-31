controllerFunc('userShowCard', 'userShowCardController', function($scope, $http) {

    // 用户无银行卡不显示
    $scope.haveCard = false;

    var ua = navigator.userAgent.toLowerCase();
    $(function () {
        if (/fenqihui/.test(ua)) {
           $scope.isWap = false;

        } else {
            $scope.isWap = true;

        }
    });
    const token = getToken();
    if(token) {
        $http({
            method: 'POST',
            params: {
                'token': token
            },
            url: BaseUrl + 'members/bankInfo'
        }).success(function(response) {

            if (response.result == '0000') {
                var bankId = response.bankId;
                var bankNo = response.bankNo;
                var bankName = response.bankName;


                $scope.bandCode = bankNo;
                $scope.bankName = bankName;
                var imgSrc = "../../static/bitmap/account/bank_icon/"+bankId+".png";
                $scope.bankImg = imgSrc;
                // $('.bank_info_top h1').css('background', imgSrc);
                $('.bank_info_top h1').css({
                    'background_image': imgSrc,
                    'background-size': '100% 100%'
                });
                $scope.haveCard = true;
            } else if (response.result == "1501") {
                $scope.haveCard = false;
            } else {
                $scope.haveCard = false;
            }
        }).error(function(response) {
            alert("请求接口失败");
            $scope.haveCard = false;
        });
    }



});