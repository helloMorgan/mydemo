/**
 * Created by liyang on 05/11/2016.
 */
controllerFunc('ngScope', 'ngController', function ($scope, $http) {

    var orderInfo = JSON.parse(localStorage.getItem('orderDetailInfo'));
    //商品id
    var pId = orderInfo.pId;
    //套餐Id
    var oMealsId = orderInfo.oMealsId;
    //成人购买数
    var adultNum = orderInfo.adultNum;
    //儿童购买数
    var childNum = orderInfo.childNum;
    //老人购买数
    var oldNum = orderInfo.oldNum;
    //总分期数
    var oTotalDuration = orderInfo.oTotalDuration;
    //总价 | 不含有手续费
    var calTotalPrice = orderInfo.calTotalPrice;
    //手续费
    var downPayment = orderInfo.downPayment;
    //每期价格
    var installmentEachPrice = orderInfo.installmentEachPrice;
    //总价含有手续费
    var totalMoney = orderInfo.totalMoney;
    //手续费价格
    var oTotalSxfMoney = orderInfo.oTotalSxfMoney;
    //单房差数
    var dfcNum = orderInfo.dfcNum;
    //单房差价格
    var oTotalDfcMoney = orderInfo.oTotalDfcMoney;
    //随机码
    var rCode = orderInfo.rCode;
    //标题
    var title = orderInfo.title;
    //子标题
    var subTitle = orderInfo.subTitle;
    //套餐名
    var comboName = orderInfo.comboName;
    //分期价格 x 数量
    var installment = orderInfo.installment;
    //出发日期
    var departureDate = orderInfo.departureDate;
    //购买数量 成人、老人、儿童、
    var shopNum = orderInfo.shopNum;
    //授信额度
    var creditMoney = orderInfo.creditMoney;

    var appType = getTypeNative();

    //分期说明
    // $scope.rateDescription = orderInfo.rateDescription;
    sessionStorage.setItem('rateDes', orderInfo.rateDescription);

    $scope.goInstallment = function () {
        go_page('../../pages/travel/travel_installment_contract_text.html', [{'flag': '0'}, {'pId': pId}]);
    };

    $scope.appType = getTypeNative();


    {
        // 获取模态窗口
        var modal = document.getElementById('myModal');
        // 获取图片模态框，alt 属性作为图片弹出中文本描述
        var img = document.getElementById('myImg');
        var modalImg = document.getElementById("img01");
        var captionText = document.getElementById("caption");
        img.onclick = function () {
            modal.style.display = "block";
            modalImg.src = this.src;
            modalImg.alt = this.alt;
            captionText.innerHTML = this.alt;
        };
        // 获取 <span> 元素，设置关闭模态框按钮
        var span = document.getElementsByClassName("close")[0];
        // 点击 <span> 元素上的 (x), 关闭模态框
        span.onclick = function () {
            modal.style.display = "none";
        }
    }


    {
        getImage();
        $scope.agreeDeal = true;
        $scope.clicNum = 2;
        //标题
        $scope.pTitle = title;
        //子标题
        $scope.subTitle = subTitle;
        //首付
        $scope.downPayment = downPayment;
        //套餐名
        $scope.comboName = comboName;
        //分期价格 x 数量
        $scope.installment = installment;
        //出发日期
        $scope.departureDate = departureDate;
        //购买数量 成人、小号、儿童、
        $scope.shopNum = shopNum;
        //授信额度
        $scope.creditMoney = creditMoney;
        //每期价格
        $scope.durationMoney = installmentEachPrice;
        //总分期数
        $scope.oTotalDuration = oTotalDuration;

        $scope.readDeal = function (ele) {
            angular.element(ele.target).toggleClass('deal-select');
            $scope.agreeDeal = $scope.clicNum % 2;
            $scope.canCreate = !$scope.agreeDeal;
            $scope.clicNum++;
        };


    }
    $scope.createOrder = function () {
        var params = {
            token: getToken(),
            //商品id
            oPid: pId,
            //套餐id
            oMealsId: oMealsId,
            //老人购票数
            oTicketOldNum: oldNum,
            //成人购票数
            oTicketYoungNum: adultNum,
            //儿童购票数
            oTicketChildrenNum: childNum,
            //首付价格
            oTotalFirstPrice: downPayment,
            //总分期金额 不含手续费
            oTotalPrice: calTotalPrice,
            // contractNum: code,
            //总分期数
            oTotalDuration: oTotalDuration,
            //每期价格
            oDurationMoney: installmentEachPrice,
            //含手续费
            totalMoney: totalMoney,
            //总单房差
            oTotalDfcMoney: oTotalDfcMoney,
            //总手续费
            oTotalSxfMoney: oTotalSxfMoney.toFixed(2),
            //单房差数量
            dfcNum: dfcNum,
        };
        rCode && (function () {
            params.contractNum = rCode;
        })();

        //create  order
        $http({
            method: 'POST',
            params: params,
            url: BaseUrl + 'order/createOrder/v1',

        }).then((response) => {
            if (response.data.result === SUCCESS_CODE) {
                if (!GetQueryString('isPay')) {
                    $('.layer').css('display', 'block');
                } else {
                    go_page('./travel_checkstand.html', [{'page': 'combo'}, {'oId': response.data.oId}]);
                }
            }
        }, () => {
            console.error('订单创建失败');
        });
    };

    $scope.showDialog = function () {
        $scope.isDialog = {'display': 'block'};
        $('.travel-info-cover').on('click', function () {
            $scope.$apply(function () {
                $scope.isDialog = {'display': 'none'};
            });
        });
    };

    $scope.goBack = function () {
        if (appType == 'android') {
            android.backAccount();
        }
        else if (appType == 'ios') {
            backAccount();
        }
        else {
            window.history.back();
        }
    };


    function getImage() {
        $http({
            method: 'POST',
            params: {
                pIds: pId,
                pageSize: 1,
                pageNum: 1,
                type: 9
            },
            url: BaseUrl + 'product1/searchProductImgList'

        }).then((response) => {
            if (response.data.result === SUCCESS_CODE) {
                $scope.imgPath = response.data.data[0].imgUrl;
            }

        }, () => {
            console.error('获取订单详情图失败');
        });

    }

    $scope.promptClose = function () {
        $('.layer').css('display', 'none');
    };


    $scope.backAccount = function () {
        if ($scope.appType == 'ios') {
            backAccount();
        } else if ($scope.appType == 'android') {
            android.backAccount();
        } else {
            window.location.href = "../../pages/account/user_personal.html";
        }
    };


    //提交订单
    $scope.submitOrder = function () {
        $scope.agreeDeal && $scope.createOrder();
    }

});

