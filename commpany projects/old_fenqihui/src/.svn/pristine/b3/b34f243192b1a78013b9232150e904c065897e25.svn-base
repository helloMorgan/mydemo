controllerFunc('myDetails', 'myDetailsCtrl', function ($scope, $http, $timeout, $q) {
    var pId = GetQueryString('pId');
    $scope.data = {
        popup: '',
        stages: '',
        switch: false,
        dataList: [],
        businessName: '',
        firstPrice: '',
        monthPayLowest: '',
        duration: '',
        select: '',
        selectList: [],
        imgUrl: '',
        Text: false
    };

    // var TOKEN = getToken();
    //
    // function init() {
    //     checkRealName();
    // }
    //
    //
    // init();

    var flag = false;


    function http(uri, dataList) { // http请求
        var deferred = $q.defer();
        $http({
            url: uri,
            method: "POST",
            params: dataList
        }).success(function (res) {
            if (res.result == '0000') {
                deferred.resolve(res);
            }
        }).error(function (error) {
            deferred.reject(error)
        });
        return deferred.promise
    }


    $scope.dataHttp = function () {
        var data = {
            pId: pId
        };
        http(BaseUrl + 'fqhpro/getProductDetailByPid', data).then(
            function (res) {
                $scope.data.dataList = res.data;
                $scope.data.businessName = $scope.data.dataList.sName;
                $scope.data.firstPrice = $scope.data.dataList.firstPrice;
                $scope.data.monthPayLowest = $scope.data.dataList.monthPayLowest.mPay;
                $scope.data.duration = $scope.data.dataList.monthPayLowest.duration;
                $scope.data.select = $scope.data.dataList.select;
                $scope.data.selectList = $scope.data.dataList.selectList;
                $scope.data.pId = $scope.data.dataList.pId;
                $scope.data.pName = $scope.data.dataList.title;
                $scope.data.sId = $scope.data.dataList.sId;
                document.getElementById('text').innerHTML = $scope.data.dataList.pictureInfo;
                document.getElementById('mainDetails_title').innerHTML = $scope.data.dataList.serviceInfo;
                $scope.data.imgUrl = OSS_IMG_URL + $scope.data.dataList.url;
                if ($scope.data.dataList.serviceInfo) {
                    $scope.data.Text = true;
                } else {
                    $scope.data.Text = false;
                }
            }
        )
    };
    $scope.dataHttp();
    $scope.popupVanish = function () {
        $scope.data.popup = false;
        $scope.data.stages = false;
    };
    $scope.stages = function () {
        $scope.data.popup = true;
        $scope.data.stages = true;
    };
    $scope.chooseTab = function (value) {
        if (value == 1) {
            document.getElementsByClassName('mainDetails_chooseTwo')[0].style.borderBottomColor = '#D8D8D8';
            document.getElementsByClassName('mainDetails_chooseOne')[0].style.borderBottomColor = 'red';
            document.getElementsByClassName('mainDetails_chooseOne')[0].style.color = 'red';
            document.getElementsByClassName('mainDetails_chooseTwo')[0].style.color = 'black';
            $scope.data.switch = false;
        } else {
            document.getElementsByClassName('mainDetails_chooseOne')[0].style.borderBottomColor = '#D8D8D8';
            document.getElementsByClassName('mainDetails_chooseTwo')[0].style.borderBottomColor = 'red';
            document.getElementsByClassName('mainDetails_chooseOne')[0].style.color = 'black';
            document.getElementsByClassName('mainDetails_chooseTwo')[0].style.color = 'red';
            $scope.data.switch = true;
        }
    };


    function checkRealName() {
        if (getToken()) {
            $http({
                method: 'POST',
                params: {
                    token: getToken()
                },
                url: BaseUrl + 'members/searchRealNameStatus',
            }).then(function (response) {
                if (response.data.result === SUCCESS_CODE) {
                    //$('#recommended_real_name').css('backgroundSize','0px');
                    if (response.data.status === '1' && response.data.accountStatus === '1') {
                        flag = true;
                    }
                }

            }, function (response) {
                console.error('数据请求失败');
                return false;
            });
        } else {
            return false;
        }
    }

    checkRealName();


    $scope.load = function () {
        if (getToken()) {
            if (!flag) {
                alert("请先进行实名认证");
                go_page('../travel/travel_upload_cdCard.html');
            } else {
                go_page('../../pages/travel/decoration_order.html', [{'urlState': 1},
                    {'selectShope': $scope.data.businessName},
                    {'pName': $scope.data.pName},
                    {'sId': $scope.data.sId},
                    {'pId': $scope.data.pId}]);
            }


        } else {
            go_page('../../pages/account/new_login.html');
        }
    };


})