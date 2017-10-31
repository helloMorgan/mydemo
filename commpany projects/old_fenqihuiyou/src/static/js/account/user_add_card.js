controllerFunc('userAddCard', 'userAddCardController', function ($scope, $http, $timeout) {
    $scope.cardCorrect = false;
    $scope.card = "";
    $scope.prompt_text = "";
    $scope.cardisName = false;


    $scope.next = function () {
        var flag = $scope.checkName();
        if(!flag) {
            $scope.myPrompt($scope.prompt_text);
        }

        if (!$scope.cardisName || !$scope.cardCorrect) {
            $scope.myPrompt($scope.prompt_text);
        }

        if ($scope.cardCorrect) {
            var str = "bankCode=" + $scope.card +  "&name=" + $scope.name;
            var temp = Encrypt(str, "333");
            var url = '../../pages/account/user_bind_bank_card.html?' + temp;
            $('.travel-card-samebg2').attr('href', url);
        }
    };


    $scope.myPrompt = function (str) {
        $timeout(function () {
            $scope.$apply(function () {
                $scope.pro_text = "亲，" + str;
            });
        }, 200);
        $('#layer').css('display', 'block');
        $('.close_btn').click(function () {
            $('#layer').css('display', 'none');
        });
    };


    $scope.checkName = function () {
        var reg = /^\d{16,19}$/;
        if ($scope.name == undefined || $scope.cardNum == undefined) {
            $scope.prompt_text = "请输入";
            return false;
        }

        if ($scope.name.length != 0) {

            if ($scope.name.match(/^[\u4e00-\u9fa5]+$/)) {
                $scope.cardisName = true;
                $scope.card = $scope.cardNum.replace(/\s/g, '');
                if (reg.test($scope.card)) {
                    $scope.cardCorrect = true;
                    return true;
                } else {
                    $scope.prompt_text = "卡号输入错误";
                }
            } else {
                $scope.prompt_text = "请输入中文";
            }

        } else {
            $scope.prompt_text = "请输入";
        }
    };


});