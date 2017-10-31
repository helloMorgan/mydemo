/**
 * Created by liyang on 28/10/2016.
 */
controllerFunc('travel-choose-product', 'travel-choose', function ($scope, $http, $timeout) {
    [$scope.oldPrice, $scope.adultPrice, $scope.childPrice, $scope.adultPollRoom, $scope.chilNum, $scope.oldNum, $scope.adultNum]
        = [0, 0, 0, 0, 0, 0, 1];

    $scope.dateTagLength = 0;
    $scope.dialog = true;
    $scope.downPayment = 0;
    $scope.installmentSelectedRow = -1;
    $scope.dfcNum = 0;
    $scope.installmentNumShow = '未选择';
    $scope.pTitle = GetQueryString('pTitle');
    $scope.signing = GetQueryString('signing');
    // $scope.signing = false;
    console.info("singing:  " + $scope.signing);
    // $scope.signing = false;
    $scope.token = getToken();
    $scope.pId = GetQueryString('pId');
    $scope.installmentNum = GetQueryString('installment');
    $scope.pTitleSub = GetQueryString('pTitleSub');
    $scope.priceTag = false;
    $scope.rCode = GetQueryString('rCode') || '';
    $scope.creditMoney = 0;
    $scope.calTotalPrice = 0;
    var money = 0;

    $scope.isTicket = true;

    $scope.engineer = {
        adultCurrentNum: 1,
        chilCurrentNum: 0,
        oldCurrentNum: 0,
    };

    var index = 0;

    var dia = {
        ele: $('.trevel-issue-icon'),
        click_eve: function (nodes) {
            nodes.each(function (index) {
                nodes.eq(index).on('click', function () {
                    nodes.eq(index).prev().toggle();
                    nodes.eq(index).prev().animateCss('fadeInDown');
                })
            })
        },
        closeELe: $('.travel-info-dialog'),
        closeClick: function (nodes) {
            nodes.each(function (index) {
                nodes.eq(index).on('click', function () {
                    $(this).hide();
                })
            })
        }
    };
    init();
    getPackageInfo();
    //初始化套餐信息
    function getPackageInfo() {
        $http({
            method: 'POST',
            params: {
                pId: $scope.pId,
            },
            url: BaseUrl + 'product1/searchMealsYearMonthList'
        }).then((response) => {
            if (response.data.result) {
                //获取第一个套餐名
                $scope.comboName = response.data.data[0].mYearMonth;
                $scope.packageItems = response.data.data;

                let unSelectedVal = '&#xe672;';
                let selectedVal = '&#xe7c8;';
                //使用第一个套餐 初始化第一条日期信息
                getDateInfo(response.data.data[0].mName);
                //ng-repeat 执行回调
                $scope.renderFinish = function () {
                    $('.iconfont-checkbox').eq(0).html('&#xe7c8;');
                    $('.travel-choose-box').eq(0).select_css('selectCombo');
                    $('.iconfont-checkbox').eq(0).data('selected', 'true');
                };
                //单选框样式
                $scope.selectCheckBox = function (pName, $event, $index) {
                    //convert to zepto obj
                    var jqEle = $('.travel-choose-box').eq($index).children('i');
                    if (jqEle.data('selected')) {
                        // jqEle.html(unSelectedVal);
                        jqEle.data('selected', 'false');
                    } else {
                        jqEle.parent('section')
                            .siblings()
                            .children('i')
                            .html(unSelectedVal);
                        jqEle.parent('section')
                            .siblings()
                            .children('i')
                            .data('selected', 'false');
                        jqEle.parent('section').animateCss('pulse');
                        jqEle.html(selectedVal);
                        jqEle.parent('section').select_css('selectCombo');
                        // jqEle.parent('section').animateCss('pulse');
                        jqEle.data('selected', 'true');
                        //调用入口方法 更新数据 使用对应的pid 值
                        // $('#dynamic-ul')&&$('#dynamic-ul').remove();
                        $scope.comboName = pName;
                        getDateInfo(pName);
                    }

                };
                //   $scope.packageItems = response.data.data;
                //默认进行一次查询  当checkbox 进行选择
            }
        }, (response) => {
            console.error('数据请求失败');
        });
    }

    //获取日期按钮信息
    function getDateInfo(packName) {
        $http({
            method: 'POST',
            params: {
                mName: packName,
                pId: $scope.pId,
            },
            url: BaseUrl + 'product1/searchMealsYearMonthList',
        }).then((response) => {
            if (response.data.result === SUCCESS_CODE) {
                $scope.dateItems = response.data.data;
                //获取日期组件数据,初始使用第一条数据
                getDayInfo(packName, response.data.data[0].mYearMonth, response.data.data[0].mYearMonth);
                $scope.dateTagLength = response.data.data.length;
                $scope.dateItems = response.data.data;
                //默认选中第一个 调用查询天数 接口当非点击日期时
                $scope.selectedRow = 0;
                $scope.renderDateFinish = function () {
                    //植入滑动事件 解决 多条目 swiper 滑动问题
                    $timeout(swiperInit(), 300);
                }

            }
        }, () => {
        });
    }


    //选择完日期之后再选数量  提交订单按钮
    function resetDateButton() {
        //  console.info($scope.installmentSelectedRow.length);
        if ($scope.installmentSelectedRow != -1) {
            console.log('pppp' + $scope.installmentItems[$scope.installmentSelectedRow].price);
            var price = $scope.installmentItems[$scope.installmentSelectedRow].price;
            var fq = $scope.installmentItems[$scope.installmentSelectedRow].fq;
            $scope.installmentNumShow = price + '×' + fq + '期';
            $scope.installmentNumShowPass = formatNum(price) + '×' + fq + '期';
            $scope.newInstallmentNumShowPass = formatNum(price) + '元 ×' + fq + '期';
            $scope.oTotalDuration = fq;
            $scope.oDurationMoney = price;
            $scope.installmentEachPrice = price;
        }

    }


    // 最终手续费=【订单金额 * 手续费比例】
    // 最终手续费= 手续费金额
    // 最终手续费=【订单金额 * (手续费比例 - 供应商贴息比例)】
    // 最终手续费=【订单金额 * 手续费比例 - 供应商贴补金额】

    /**
     * 最终手续费=【(订单金额-首付) * 手续费比例】 1 1
     * 最终手续费=【手续费金额】 1 2
     * 最终手续费=【(订单金额-首付) * (手续费比例- 供应商贴息比例)】 2 1 1
     * 最终手续费=【(订单金额-首付) * 手续费比例 - 供应商贴补金额】2 1 2
     */
    function calculateInstallment() {
        //calculate pollRoomPrice

        // $scope.fBtype = '3';
        var installmentArr = [];
        var pay = $scope.pFirstFee || '0';

        // //利息类型
        // $scope.fBtype = '3';
        // //可分期数
        // $scope.fDuration = "3,3";
        // //分期利率
        // $scope.fFee = "0.02,0.03";


        $scope.downPayment = parseInt($scope.downPayment);
        switch ($scope.fBtype) {
            case '1':
                if ($scope.fCmethodType === '1') {
                    $scope.rateDescription = "与最低手续费相加不超过总额";
                    //计算费率
                    $scope.poundage = ($scope.calTotalPrice - $scope.downPayment) * $scope.fFee;
                    console.log("计算费率   :" + $scope.downPayment + "    aaaaaa");
                    $scope.poundage = parseFloat($scope.poundage.toFixed(2));
                    console.log("计算费率   :" + $scope.poundage + "    ssssss");

                } else if ($scope.fCmethodType === '2') {
                    $scope.rateDescription = "与最低手续费相加不超过总额";
                    $scope.poundage = $scope.fFee;
                }
                break;

            case '2':
                if ($scope.fCmethodType === '1' && $scope.fSwayType === '1') {
                    $scope.rateDescription = "与最低手续费相加不超过总额";
                    $scope.poundage = ($scope.calTotalPrice - $scope.downPayment) * ($scope.fFee - $scope.fSwayFee);
                    $scope.poundage = parseFloat($scope.poundage.toFixed(2));

                }

                else if ($scope.fCmethodType === '1' && $scope.fSwayType === '2') {
                    $scope.rateDescription = "与最低手续费相加不超过总额";
                    $scope.poundage = ($scope.calTotalPrice - $scope.downPayment) * $scope.fFee - $scope.fSwayFee;
                    $scope.poundage = parseFloat($scope.poundage.toFixed(2));
                }
                break;
            case '3':
                $scope.rateDescription = "与最低手续费相加不超过总额";
                var fenqinum = $scope.installmentNum.split(",");
                var fenqiFree = $scope.fFee.split(",");

                var newNums = conversion(fenqinum);
                var newFrees = conversion(fenqiFree);

                $scope.poundages = [];
                if (fenqiFree.length == fenqinum.length) {
                    for (let i = 0; i < fenqinum.length; i++) {
                        $scope.poundages[i] = ($scope.calTotalPrice - $scope.downPayment) * newFrees[i];

                        console.log($scope.poundages[i] + "AA 费率" + "最低lilv： " + newFrees[i]);
                    }
                }

                for (var i = 0; i < newNums.length; i++) {
                    var item = {};
                    let installmentAllMoney = $scope.calTotalPrice - $scope.downPayment;
                    $scope.allTotalMoney = installmentAllMoney;
                    console.info('AA计算费率为' + $scope.poundages[i] + '计算总价为' + installmentAllMoney);
                    // item.price = ((installmentAllMoney + $scope.poundages[i]) / newNums[i]).toFixed(2);
                    item.price = ((installmentAllMoney / newNums[i]) + $scope.poundages[i]).toFixed(2);
                    // alert($scope.poundages[i]);
                    console.info("分期数： " + newNums[i]);
                    console.info($scope.poundages[i] + "ttttttttttttt1111");
                    item.fq = newNums[i];
                    item.pFirstFee = $scope.pFirstFee;
                    item.poundage = $scope.poundages[i] / item.fq;
                    item.fFee = newFrees[i];
                    item.initFee = newFrees[i] * 100;
                    // item.initFee =  newFrees[i];
                    console.log(item.initFee + "   显示费率");
                    installmentArr.push(item);
                }
                $scope.installmentItems = installmentArr;


                $scope.aomountInstallment = $scope.installmentItems[0].price;
                console.error($scope.aomountInstallment + "11111111");
                // alert($scope.installmentItems[0].price);
                $scope.staging = $scope.installmentItems[0].fq;

                break;

            default:
                break;
        }

        if ($scope.fBtype == '3') {
            return;
        }


        for (var i = 0; i < $scope.fqNum.length; i++) {
            var item = {};
            // $scope.calTotalPrice = Math.floor($scope.calTotalPrice);

            let installmentAllMoney = $scope.calTotalPrice - $scope.downPayment;
            $scope.allTotalMoney = installmentAllMoney;
            console.log("installmentAllMoney: " + $scope.downPayment);
            console.info('AA计算费率为' + $scope.poundage + '计算总价为' + installmentAllMoney);

            item.price = (installmentAllMoney / $scope.fqNum[i] + $scope.poundage).toFixed(2);
            item.fq = $scope.fqNum[i];
            installmentArr.push(item)
        }
        $scope.installmentItems = installmentArr;
    }


    //验证最低首付 总价改变的时候  || 用户输入首付的时候
    function verifyMinPay() {
        // 那这一块便存在问题了 if else 不成立 最低首付小于最低首付时
        // var num = $scope.adultNum + $scope.oldNum + $scope.chilNum;
        // var price = parseFloat($scope.mFirstFee);
        // var money = num * price;


        if (!money) {
            money = 0;
            return;
        }

        if (money > $scope.downPayment || $scope.downPayment < $scope.mFirstFee) {

            $scope.downPayInfo = '*首付价不可低于最低首付';
            // $scope.downPayment = money;
            console.error(money + "zzzzzzzzzzzzzzzzzzzzzzz");

            $scope.downPayment = money;
            // $scope.mFirstFee = $scope.downPayment;
            // $scope.verifyPay = {'color':'black'};
            $scope.isError = true;
            $scope.payCheckInfo = true;
        } else {
            if ($scope.calTotalPrice < $scope.downPayment) {
                $scope.downPayInfo = '*首付价不可超出总价';
                $scope.isError = true;
                $scope.payCheckInfo = true;
            } else {
                $scope.isError = false;
                $scope.payCheckInfo = false;
            }
        }
    }

    function verifyMinPay2() {
        // 那这一块便存在问题了 if else 不成立 最低首付小于最低首付时
        // var num = $scope.adultNum + $scope.oldNum + $scope.chilNum;
        // var price = parseFloat($scope.mFirstFee);
        // var money = num * price;


        if (!money) {
            money = 0;
            return;
        }

        if (money > $scope.downPayment || $scope.downPayment < $scope.mFirstFee) {

            $scope.downPayInfo = '*首付价不可低于最低首付';
            // $scope.downPayment = money;
            // $scope.mFirstFee = $scope.downPayment;
            console.error(money + "zzzzzzzzzzzzzzzzzzzzzzz");

            // $scope.verifyPay = {'color':'black'};
            $scope.isError = true;
            $scope.payCheckInfo = true;
        } else {
            if ($scope.calTotalPrice < $scope.downPayment) {
                $scope.downPayInfo = '*首付价不可超出总价';
                $scope.isError = true;
                $scope.payCheckInfo = true;
            } else {
                $scope.isError = false;
                $scope.payCheckInfo = false;
            }
        }
    }


    //判断提交按钮是否可以点击
    $scope.canSubmitOrder = function () {
        $scope.shopNum = $scope.getShopNum();
        if ($scope.installmentSelectedRow < 0 || $scope.payCheckInfo || $scope.shopNum == 0) {
            $scope.installmentCheck = false;
        } else {
            $scope.installmentCheck = true;

        }
    };

    //检测首付是否等于总价 监听首付方法中
    $scope.checkFirstPayment = function () {
        //验证如果首付 等于总价
        if (!$scope.downPayment) {
            $scope.downPayment = 0;
        }
        console.info('bbb' + $scope.downPayment);

        var allPay = ($scope.downPayment == $scope.calTotalPrice);
        //totalPrice equal downPayment
        if (allPay) {
            $scope.installmentNumShowPass = formatNum($scope.calTotalPrice) + '×' + 0 + '期';
            $scope.oTotalDuration = 0;
            $scope.installmentEachPrice = 0;
            $scope.installmentNumShow = '无分期';
            $scope.installmentSelectedRow = -1;
            $scope.installmentCheck = true;
            $scope.equalPrice = true;
        }
        else {
            $scope.equalPrice = false;
            //check can submit
            $scope.canSubmitOrder();
        }
    };

    //开始监听
    function startWatch() {
        $scope.$watch('calTotalPrice', function (newValue, oldValue, scope) {
            calculateInstallment();
            verifyMinPay();
            resetDateButton();
        });

        //watch data change
        $scope.$watch('downPayment', function (newValue, oldValue, scope) {

            if (!newValue) {

            }
            else if (newValue == oldValue) {

            } else {
                calculateInstallment();
                verifyMinPay2();
                //检测最低首付
                $scope.checkFirstPayment();
                //选择完月份之后 总价自然会变  此时重置 样式 也可
                resetDateButton();
            }


        });
    }

    function toInt(number) {
        return number && +number | 0 || 0;
    }


    //获取日期信息
    function getDayInfo(packageName, dateInfo, dateTime) {
        $http({
            method: 'POST',
            params: {
                mYearMonth: dateInfo,
                // mName: packageName,
                pId: $scope.pId
            },
            url: BaseUrl + 'product1/searchMealsDetailList',

        }).then((response) => {
            if (response.data.result === SUCCESS_CODE) {
                //默认选中第一个日期
                //默认存第一个 combo
                var combo = response.data.data[0];
                //init default choose data
                var fee = response.data.feeData;
                $scope.oMealsId = combo.mId;
                $scope.adultPollRoom = combo.mOutDfc;
                $scope.adultPrice = combo.mOutPriceYoung;
                $scope.childPrice = combo.mOutPriceChildren;
                $scope.oldPrice = combo.mOutPriceOld;
                //初始化库存信息
                $scope.AdultRemainTicket = combo.mStock;
                $scope.ChildRemainTicket = combo.mStockChilren;
                $scope.OldRemainTicket = combo.mStockOld;

                $scope.mTotalStock = combo.mTotalStock;
                logTicketRemian();
                $scope.mFirstFee = parseInt(combo.pFirstFee);
                //todo
                $scope.downPayment = combo.pFirstFee;
                $scope.showDownPayment = parseInt($scope.downPayment);
                // alert($scope.downPayment);

                $scope.backupDownPayment = combo.mFirstFee;
                //手续费类型
                $scope.fBtype = fee.fBtype;
                //手续费收取方式
                $scope.fCmethodType = fee.fCmethodType;
                //手续费收取比例或金额
                $scope.fFee = fee.fFee;
                //津贴收取方式
                $scope.fSwayType = fee.fSwayType;
                //津贴比例或实际金额
                $scope.fSwayFee = fee.fSwayFee;

                console.log($scope.adultPollRoom + "   wwwww");

                //计算最终手续费
                calculateInstallment();
                // 计算分期依赖 回调结果 监控依赖 计算分期
                startWatch();
                //显示总价
                $scope.calTotalPrice = calculateTotalPrice();
                daySelectEve(dateTime, response.data.data);
                //默认选中第一个
                $scope.selectDate = function (date, $event, $index) {
                    $scope.selectedRow = $index;
                    $('.swiper-slide').eq($index).animateCss('pulse');
                    getDayInfo(packageName, date, date);
                }
            }
        });
    }

    //渲染组件
    function daySelectEve(date, comboData) {
        let dateinfo = date.split('-');
        let year = dateinfo[0];
        let month = dateinfo[1];
        let days = getDays(year, month);
        let offset = new Date(year, month - 1, 1).getDay();
        let filling = new Date(year, month, 1).getDay();
        // 移除并渲染新的组件
        $('#dynamic-ul').length > 0 && $('#dynamic-ul').remove();
        renderDate(days, comboData, offset, month, year);


    }

//获取每月多少天
    function getDays(year, month) {
        //定义当月的天数；
        var days;
        //当月份为二月时，根据闰年还是非闰年判断天数
        if (month == 2) {
            days = year % 4 == 0 ? 29 : 28;
        } else if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
            //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
            days = 31;
        } else {
            //其他月份，天数为：30.
            days = 30;
        }
        //输出天数
        return days;
    }


    //计算总价格
    function calculateTotalPrice() {
        //extra add dfc
        //  let dfc = $scope.adultNum*$scope.dfcNum;

        // $scope.calTotalPrice = ($scope.engineer.chilCurrentNum * $scope.childPrice
        // + $scope.engineer.adultCurrentNum * $scope.adultPrice
        // + $scope.engineer.oldCurrentNum * $scope.oldPrice + $scope.SingleRoomPoll ).toFixed(2);

        $scope.calTotalPrice = ($scope.engineer.chilCurrentNum * $scope.childPrice
        + $scope.engineer.adultCurrentNum * $scope.adultPrice
        + $scope.engineer.oldCurrentNum * $scope.oldPrice + $scope.SingleRoomPoll );
        // $scope.calTotalPrice = parseInt($scope.calTotalPrice);
        changeLowPay();


        console.info('AA计算总价为' + $scope.calTotalPrice);
        console.info('AA分别计算价格为' +
            'AA小孩' + ($scope.engineer.chilCurrentNum * $scope.childPrice) +
            'AA成人' + ($scope.engineer.adultCurrentNum * $scope.adultPrice) +
            'AA老人' + ($scope.engineer.oldCurrentNum * $scope.oldPrice));
        return $scope.calTotalPrice;
    }

    function getCreditMoney() {
        $http({
            method: 'POST',
            params: {
                token: $scope.token
            },
            url: BaseUrl + '/members/searchCredit',
        }).then((response) => {
            if (response.data.result === SUCCESS_CODE) {
                console.log(response.data.data);
                $scope.startInfo = response.data.data.startInfo;
                if ($scope.startInfo == '0') {
                    $scope.creditMoney = 0;
                } else if ($scope.startInfo == '3') {
                    $scope.creditMoney = 5000;
                } else if ($scope.startInfo == '4') {
                    $scope.creditMoney = 10000;
                } else if ($scope.startInfo == '5') {
                    $scope.creditMoney = 15000;
                } else {
                    $scope.creditMoney = 0;
                }
                console.info("星星  : " + typeof $scope.startInfo);
            }

        }, () => {
        });
    }

    //更改最低首付
    function changeLowPay() {
        //绑定数据的中间过程 有string
        // var money = parseFloat((parseFloat($scope.calTotalPrice) - parseFloat($scope.creditMoney)).toFixed(2));
        // var money = parseFloat((parseFloat($scope.calTotalPrice) ).toFixed(2));

        // console.error($scope.creditMoney);
        // console.error("money  " + money);
        // if (money > $scope.downPayment) {
        //     $scope.downPayment = money;
        //     $scope.mFirstFee = money;
        // }else {

        var num = $scope.adultNum + $scope.oldNum + $scope.chilNum;
        var price = parseInt($scope.mFirstFee);
        // $scope.downPayment = $scope.mFirstFee;
        $scope.downPayment = parseInt($scope.mFirstFee);
        money = num * price;
        console.error(price + "zzzzzzzzzzzzzzzzzzzzzzz");

        $scope.downPayment = money;
        // $scope.mFirstFee = money;
        $scope.showDownPayment = $scope.downPayment;

        // }
    }

    //渲染日期组件
    function renderDate(days, combo, offset, month, year) {
        var ul = document.createElement('ul');
        ul.setAttribute('id', 'dynamic-ul');
        for (let i = 0; i < offset; i++) {
            var li = document.createElement('li');
            $(li).addClass('date-li');
            ul.appendChild(li);
        }
        for (var i = 0; i < days; i++) {
            var li = document.createElement('li');
            $(li).addClass('date-li');
            li.innerHTML = i + 1;
            ul.appendChild(li);
        }

        // alert(getFirstAndLastMonthDay(year, month));
        var tempDate = getFirstAndLastMonthDay(year, month);

        var date = new Date(tempDate);

        var tempDay = date.getDay();

        var temp = 6 - tempDay;


        for (let i = 0; i < temp; i++) {
            var li = document.createElement('li');
            $(li).addClass('date-li');
            ul.appendChild(li);
        }
        // ul.firstElementChild.style.marginLeft = offset * 14.28 + '%';
        var di = document.createElement('div');
        di.style.cssText = 'clear:both';
        ul.appendChild(di);
        document.getElementById('travel_pick_wrap').appendChild(ul);
        $(ul).animateCss('fadeInRight');
        //为当前选日期下选中产品添加价格样式
        // $scope.$apply();
        var tag = true;

        // alert(typeof offset);
        for (let i = 0; i < combo.length; i++) {
            //取日的信息
            var position = combo[i].mDate.split('-')[2] - 1 + offset;
            var liEle = $('#dynamic-ul').children().eq(position);
            //使用 自定义参数 dataSet 为li 存值
            //此处显示价格的div 每一次都要动态生成一次
            var div_price_tag = document.createElement('div');
            var div_price_show = document.createElement('span');
            var div_price_left = document.createElement('span');
            div_price_tag.appendChild(div_price_show);
            div_price_tag.appendChild(div_price_left);
            // div_price_show.innerHTML = '￥' + combo[i].mOutPriceYoung.toFixed(0);
            div_price_show.innerHTML = '￥' + combo[i].mOutPrice.toFixed(0);
            div_price_left.innerHTML = '余' + combo[i].mStock;
            div_price_show.className = 'travel-price-tag';
            div_price_left.className = 'travel-price-tag';
            liEle.children('div').children('span').css('color', '#ea530c');
            // liEle.select_css('no_click');
            liEle.addClass('no_click');
            liEle.addClass('click_li');
            liEle.append(div_price_tag);
            //将数据位置与li进行绑定  x --> 绑定的应该是 位置不是日期
            $scope.dialog = false;
            liEle.data('pos', i + 1);
            if (tag) {
                liEle.addClass('grad');
                liEle.addClass('click_li');
                liEle.removeClass('no_click');
                $scope.departureDate = combo[0].mDate;
                console.log('初始化--->成人价格为显示精确两位后结果测试' + $scope.adultPrice);
                liEle.children('div').children('span').addClass('gead_font');
                tag = false;
            }
        }
        $('#dynamic-ul li').on('click', function () {
            var i = $(this).data('pos') - 1;

            //选中之后 进行判断是否为有日期标志 ： 若是有 取到  对应 单房差等价格
            if ($(this).children('div').children('span').html()) {
                //取值计算价格,用于单房差选择计算
                // $(this).removeClass('no_click');
                // $(this).siblings().addClass('no_click');
                $('.click_li').addClass('no_click');
                $(this).removeClass('no_click');
                $(this).siblings().children('div').children('span').removeClass('gead_font');
                $(this).children('div').children('span').removeClass('travel-price-tag').addClass('gead_font');
                $(this).select_css('grad');
                $(this).children('div').children('span').css('color', '#fffff');

                $(this).children('div').children('span').addClass('travel-price-tag');


                // 绑定单房差选择时  价格等信息
                $scope.priceTag = false;
                //将数据放到 li里边  点击的时候 显示出来
                $scope.adultPrice = combo[i].mOutPriceYoung;
                $scope.childPrice = combo[i].mOutPriceChildren;
                $scope.oldPrice = combo[i].mOutPriceOld;
                $scope.adultPollRoom = combo[i].mOutDfc;
                $scope.oMealsId = combo[i].mId;
                $scope.AdultRemainTicket = combo[i].mStock;
                $scope.ChildRemainTicket = combo[i].mStockChilren;
                $scope.OldRemainTicket = combo[i].mStockOld;
                logTicketRemian();
                $scope.departureDate = combo[i].mDate;
                calculateTotalPrice();
                $scope.$apply();
            }
        });
    }

    function getFirstAndLastMonthDay(year, month) {
        var firstdate = year + '-' + month + '-01';
        var day = new Date(year, month, 0);
        var lastdate = year + '-' + month + '-' + day.getDate();//获取当月最后一天日期
        return lastdate;
    }

    //订单信息传参
    function passValueToNext(orderDetailInfo) {
        localStorage.setItem('orderDetailInfo', orderDetailInfo);
    }

    function logTicketRemian() {
        console.info('cc剩余票数统计为'
            + '成人:' + $scope.AdultRemainTicket
            + '老人:' + $scope.OldRemainTicket
            + '儿童:' + $scope.ChildRemainTicket
        );
        console.log('AA初始化信息为' + '单防差' + $scope.adultPollRoom + '成人价格' + $scope.adultPrice + '小孩价格:' + $scope.childPrice + '老人价格' + $scope.oldPrice);
    }


//要在angular 初始化完成之后  初始化
    function swiperInit() {
        var slideWidth = parseInt($('#travel_slide').css('width')) / 3;
        var swiper = new Swiper('.swiper-container', {
            slidesPerView: 4.6,
            spaceBetween: 15,
            freeMode: true,
            initialSlide: 0.5,
        });

        if ($scope.dateTagLength > 4) {
            swiper.setWrapperTranslate(-slideWidth);
            $('.swiper-slide').css('left', '1rem');
            $('.swiper-slide').last().css('left', '1rem');
        } else {
            //禁止swiper 滑动
            swiper.detachEvents();
            swiper.setWrapperTranslate(slideWidth);
        }

        window.onload = function () {
            $('.iconfont-checkbox').eq(0).html('&#xe7c8;');

        };
    }

    function init() {
        dia.click_eve(dia.ele);
        dia.closeClick(dia.closeELe);
        getCreditMoney();
        console.log($scope.installmentNum);
        $scope.fqNum = $scope.installmentNum.split(',');
        $scope.selectInstallment = function (item, $index) {
            $scope.installmentSelectedRow = $index;
            $scope.oTotalDuration = item.fq;
            $scope.oDurationMoney = item.price;

            $scope.installmentNumShow = item.price + '×' + item.fq + '期';
            $scope.installmentNumShowPass = formatNum(item.price) + '×' + item.fq + '期';

            // 选择完日期之后 判断是否开启预定按钮
            $scope.canSubmitOrder();
            //选择完之后 提交按钮才变为可点 因而 在此设置 获取每期价格值 并不会造成错误
            $scope.installmentEachPrice = item.price;
        };


        $scope.$watch('dfcNum', function (newValue, oldValue, scope) {
            calculatePollRoom($scope.dfcNum);
        });

        $scope.$watch('calTotalPrice', function (newValue, oldValue, scope) {
            calculatePollRoom($scope.dfcNum);
        });

        //calculateTotalPrice
        $scope.$watch('SingleRoomPoll', function (newValue, oldValue, scope) {
            console.info($scope.SingleRoomPoll + '单房差价格显示精确两位 计算使用四位');
            calculateTotalPrice();
        });

        //单房差增加方法
        $scope.dfcAdd = function () {
            let num = $scope.adultNum + $scope.oldNum + $scope.chilNum;
            $scope.dfcNum < num && $scope.dfcNum++;
        };

        //单房差减少方法
        $scope.dfcReduce = function () {
            if ($scope.adultNum + $scope.chilNum + $scope.oldNum === 0) {
                $scope.dfcNum > 1 && $scope.dfcNum--;
            } else {
                $scope.dfcNum > 0 && $scope.dfcNum--;
            }
        };


        //$scope.installmentItems=installmentNum.split(',');
        function calculatePollRoom(num) {
            $scope.SingleRoomPoll = $scope.adultPollRoom * num;
        }


        var num = [];
        for (var i = 0; i < 10; i++) {
            num.push(i);
        }
        $scope.poll = num;
        $scope.tickets = 0;
        //进行余票验证
        $scope.selectNum = function (type) {
            if (!$scope.signing) {
                switch (type) {
                    case 'chil':
                        $scope.chilNum = $scope.engineer.chilCurrentNum;
                        break;
                    case 'adult':
                        $scope.adultNum = $scope.engineer.adultCurrentNum;
                        console.error("yyyy票数库存" + $scope.tickets);
                        break;

                    case 'old':
                        $scope.oldNum = $scope.engineer.oldCurrentNum;
                        break;
                    default:
                        break;
                }
                $scope.tickets = $scope.chilNum + $scope.adultNum + $scope.oldNum;
                $scope.canSubmitOrder();


                if ($scope.tickets > $scope.AdultRemainTicket) {
                    alert("票数库存不足");
                    $scope.isTicket = false;
                } else {
                    $scope.isTicket = true;
                }
            } else {
                switch (type) {
                    case 'chil':
                        $scope.chilNum = $scope.engineer.chilCurrentNum;

                        break;
                    case 'adult':
                        $scope.adultNum = $scope.engineer.adultCurrentNum;

                        break;
                    case 'old':
                        $scope.oldNum = $scope.engineer.oldCurrentNum;
                        break;
                    default:
                        break;
                }
                $scope.canSubmitOrder();
            }


            //根据 index 进行匹配
            resetDateButton();


            // if ($scope.chilNum + $scope.adultNum + $scope.oldNum === 1) {
            //     $scope.dfcNum = 1;
            // }

            //执行完监听
            if ($scope.priceTag) {
                $scope.calTotalPrice = 0;
                $scope.downPayment = 0;
            } else {
                $('#total_price').animateCss('flipInX');
                setTimeout(
                    function () {
                        $scope.calTotalPrice = calculateTotalPrice();
                        $scope.$apply();
                    },
                    300
                );
            }
        };

        // 获取购买数量
        $scope.getShopNum = function () {
            // var isAnum = $scope.adultNum;
            // // var strAdult = '成人' + $scope.adultNum;
            // var isCnum = $scope.chilNum;
            // // var strChild = '儿童' + $scope.chilNum;
            // var isOnum = $scope.oldNum;
            // var strOld = '老人' + $scope.oldNum;

            // if (isAnum) {
            //     if (isAnum && (isCnum || isOnum)) {
            //         str += strAdult + '、';
            //     } else {
            //         str += strAdult;
            //     }
            // }
            //
            // if (isOnum) {
            //     if (isOnum && isCnum) {
            //         str += strOld + '、';
            //     } else {
            //         str += strOld;
            //     }
            // }
            //
            // if (isCnum) {
            //     str += strChild;
            // }
            let num = $scope.adultNum + $scope.chilNum + $scope.oldNum;
            return num;
        };


        //因该是在数据初始化完成之后 苟泽没有总价格
        $scope.reserveNow = function () {
            if (!$scope.isTicket) {
                alert("票数库存不足");
                return;
            }
            //当数据加载回来为可点击 切可点击时绑定点击事件？
            //界面 传值
            //全额首付 ---> 首付等于总价
            $scope.installmentCheck && (function () {
                //var shopNum = '成人' + $scope.adultNum + '儿童' + $scope.chilNum + '老人' + $scope.oldNum;
                //首付==总价更改 分期数  分期价格为0
                $scope.shopNum = $scope.getShopNum();
                if ($scope.shopNum == 0) {
                    alert('购买数量必须大于等于1');
                    return;
                }
                if ($scope.downPayment == $scope.calTotalPrice) {
                    $scope.oTotalDuration = 0;
                    $scope.installmentEachPrice = 0;
                }

                //$scope.installmentSelectedRow
                var orderInfo;
                if ($scope.fBtype == '3') {
                    orderInfo = {
                        //标题
                        title: $scope.pTitle,
                        //上传合同码
                        rCode: $scope.rCode,
                        //子标题
                        subTitle: $scope.pTitleSub,
                        //首付
                        downPayment: $scope.downPayment,
                        //套餐名
                        comboName: $scope.comboName,
                        //分期价格 x 数量
                        installment: $scope.installmentNumShowPass,
                        //出发日期
                        departureDate: $scope.departureDate,
                        //购买数量 成人、老人、儿童、
                        shopNum: $scope.shopNum,
                        //授信额度
                        creditMoney: $scope.creditMoney,
                        //套餐id
                        oMealsId: $scope.oMealsId,
                        //老人购买数量
                        oldNum: $scope.oldNum,
                        //购买儿童数量
                        childNum: $scope.chilNum,
                        //成人购买数量
                        adultNum: $scope.adultNum,
                        //计算总价 | 不含手续费
                        calTotalPrice: $scope.allTotalMoney,
                        //分期数
                        oTotalDuration: $scope.oTotalDuration,
                        //商品id
                        pId: $scope.pId,
                        //每期金额
                        installmentEachPrice: $scope.installmentEachPrice,
                        // 总价 | 含有手续费
                        totalMoney: parseFloat($scope.calTotalPrice) + parseFloat($scope.poundages[$scope.installmentSelectedRow] * $scope.oTotalDuration),
                        //单房查价格
                        oTotalDfcMoney: $scope.SingleRoomPoll,
                        //手续费价格
                        oTotalSxfMoney: $scope.poundages[$scope.installmentSelectedRow],
                        // 单房差数
                        dfcNum: $scope.dfcNum,
                        rateDescription: $scope.rateDescription
                    };
                } else {
                    orderInfo = {
                        //标题
                        title: $scope.pTitle,
                        //上传合同码
                        rCode: $scope.rCode,
                        //子标题
                        subTitle: $scope.pTitleSub,
                        //首付
                        downPayment: $scope.downPayment,
                        //套餐名
                        comboName: $scope.comboName,
                        //分期价格 x 数量
                        installment: $scope.installmentNumShowPass,
                        //出发日期
                        departureDate: $scope.departureDate,
                        //购买数量 成人、老人、儿童、
                        shopNum: $scope.shopNum,
                        //授信额度
                        creditMoney: $scope.creditMoney,
                        //套餐id
                        oMealsId: $scope.oMealsId,
                        //老人购买数量
                        oldNum: $scope.oldNum,
                        //购买儿童数量
                        childNum: $scope.chilNum,
                        //成人购买数量
                        adultNum: $scope.adultNum,
                        //计算总价 | 不含手续费
                        calTotalPrice: $scope.allTotalMoney,
                        //分期数
                        oTotalDuration: $scope.oTotalDuration,
                        //商品id
                        pId: $scope.pId,
                        //每期金额
                        installmentEachPrice: $scope.installmentEachPrice,
                        // 总价 | 含有手续费
                        totalMoney: parseFloat($scope.calTotalPrice) + parseFloat($scope.poundage * $scope.oTotalDuration),
                        //单房查价格
                        oTotalDfcMoney: $scope.SingleRoomPoll,
                        //手续费价格
                        oTotalSxfMoney: $scope.poundage,
                        // 单房差数
                        dfcNum: $scope.dfcNum,
                        rateDescription: $scope.rateDescription
                    };
                }

                localStorage.getItem('orderDetailInfo') && localStorage.removeItem('orderDetailInfo');
                passValueToNext(JSON.stringify(orderInfo));
                go_page('./travel_order_detail.html');
            })();

        }
    }
});




