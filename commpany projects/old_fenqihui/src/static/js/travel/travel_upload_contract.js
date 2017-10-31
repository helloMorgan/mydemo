controllerFunc('ngScope', 'ngController', function ($scope, $http, $timeout, $q) {


    // var BaseUrl = 'http://fenqihui.jinnuofeng.com/';
    // var BaseUrl = 'http://1y60698h03.51mypc.cn/';
    //生产
    // var BaseUrl = 'http://fenqihui.puhuijia.com:8888/';
    var storage = window.localStorage;
    var pId = GetQueryString('pId');

    var fDuration = GetQueryString('fDuration');
    var pTitle = GetQueryString('pTitle');
    var pTitleSub = GetQueryString('pTitleSub');
    var isOrder = GetQueryString('isOrder');
    var loadDialog = new Dialog(DIALOG_LOAD);

    var onLine = GetQueryString('onLine');


    var oid = GetQueryString('oid');
    var processStatus = GetQueryString('processStatus');
    var isQianyue = GetQueryString('isQianyue');
    var dataUrl = GetQueryString('dataUrl');

    $scope.otherData = "其他凭证";

    $scope.sType = JSON.parse(dataUrl).pType;




    if (isOrder) {
        isQianyue = isOrder;
    }

    $scope.onlyShowContract = false;
    $scope.onlyShowVisa = false;
    $scope.onlyShowPay = false;

    if (!oid) {
        oid = "0"
    }


    class Contract {

        constructor() {
            [$scope.travelImgs, $scope.receiptImgs, $scope.otherImgs] = [[], [], []];
            [$scope.travelImgs1, $scope.receiptImgs1, $scope.otherImgs1] = [[], [], []];
            [$scope.travelImgsPass, $scope.receiptImgsPass, $scope.otherImgsPass] = [[], [], []];
            $scope.images = {
                localId: [],
                serverId: [],
                mediaId: []
            };
            $scope.serverIds = [];

            if(JSON.parse(dataUrl).pType == "旅游") {
                $scope.otherData = "签证资料";
                $('title').html("上传" + $scope.sType + "合同");
            }

            if (processStatus == '110') {
                $scope.onlyShowContract = false;
                $scope.onlyShowVisa = true;
                $scope.onlyShowPay = true;
            } else if (processStatus == '111') {
                $scope.onlyShowContract = true;
                $scope.onlyShowVisa = true;
                $scope.onlyShowPay = false;
            } else {
                $scope.onlyShowContract = false;
                $scope.onlyShowVisa = false;
                $scope.onlyShowPay = false;
            }

        }


        //上传到服务器
        passToSever(param) {

            // alert('start pass to server');

            $http({
                method: 'POST',
                url: BaseUrl + 'contractInfo/addContractInfoForWx',
                params: {'imageIds': param, token: getToken(), "isQianyue": isQianyue, "oId": oid, 'source': 'fqh'}
            }).then((res) => {
                // alert('得到请求结果');
                // alert(res.data.result);

                if (res.data.result === SUCCESS_CODE) {
                    //获得合同随机码
                    var contractNum = res.data.contractNum;
                    // alert('success');
                    //  alert('合同随机码为' + contractNum);
                    $scope.passToServerNum++;
                    //all success pass to server
                    loadDialog.hide();

                    if (isOrder) {
                        alert("上传成功");
                        go_page('../../pages/travel/decoration_order.html', [{'urlState': 2}, {'contractNum': contractNum}, {'dataUrl': dataUrl}]);
                    }

                    // if (onLine) {
                    //     alert("上传成功");
                    //
                    //     go_page('../account/user_personal.html', {'signing': false});
                    // } else {
                    //     alert("上传成功");
                    //     go_page('./travel_choose_product.html',
                    //         [
                    //             {pId: pId},
                    //             {rCode: contractNum},
                    //             {installment: fDuration},
                    //             {pTitle: pTitle},
                    //             {pTitleSub: pTitleSub},
                    //             {'signing': false}
                    //             // {signing: 'false'}
                    //         ]);
                    // }


                } else {
                    alert('获取合同随机码失败');
                    loadDialog.hide();
                }

            }, () => {
                alert('error');
                loadDialog.hide();
            });
        };

        //添加旅游照片
        addTravelImg(imgArr) {
            //.1 调用微信摄像头
            //.2 预览照片 每上传一张显示一张  数量限制 1~6
            //.3 提交将照片等信息上传oss

            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['compressed'],
                sourceType: ['camera'],
                success: (res) => {
                    $scope.images.localId.push(res.localIds);
                    // alert('已选择 ' + res.localIds.length + ' 张图片');
                    // $('#img1').attr('src',res.localIds);
                    $scope.$apply(function () {
                        //可以选两张上传所以是 ids
                        $scope[imgArr].push(...res.localIds);
                        if ($scope[imgArr].length == 6) {
                            let key = imgArr + 'Full';
                            $scope[key] = true;
                            //$('#${key}').animateCss('bounceOutUp');
                        }
                    });
                }
            });


        }


        //上传合同到微信服务器
        uploadToWeChat(localIds) {

            var localIdImg;
            if (localIds.length > 0) {
                localIdImg = localIds.pop().toString();
            }

            // var test = true;
            var _that = this;
            wx.uploadImage({
                localId: localIdImg, // 需要上传的图片的本地ID，由chooseImage接口获得
                isShowProgressTips: 0, // 默认为1，显示进度提示
                success: (res) => {
                    //图片进行分类
                    //todo :// 进行分组
                    $scope.serverIds.push(res.serverId);
                    if (localIds.length > 0) {
                        _that.uploadToWeChat(localIds);
                    } else {
                        //序列化参数上传到服务器
                        _that.serializeData();
                    }

                },
                fail: function (res) {

                    alert('上传到微信服务器失败');

                }
            });
        }

        // 从微信服务器下载图片获取 mediaId
        downLoadImg() {
            if ($scope.images.serverId.length === 0) {
                alert('请先使用 uploadImage 上传图片');
                return;
            }
            var i = 0, length = $scope.images.serverId.length;
            $scope.images.mediaId = [];
            function download() {
                wx.downloadImage({
                    //此时this 变成了  wx
                    serverId: $scope.images.serverId[i],
                    success: (res) => {
                        i++;
                        $scope.images.mediaId.push(res.localId);
                        alert('下载成功');
                        // alert('已下载：' + i + '/' + length);
                        //this.images.mediaId.push(res.localId);
                        if (i < length) {
                            download();
                        }
                    }
                });
            }

            download();
        }


        verify() {
            return $scope.travelImgs.length >= 0
                && $scope.travelImgs.length < 7    //$scope.receiptImgs,$scope.otherImgs
                && $scope.receiptImgs.length >= 0
                && $scope.receiptImgs.length < 7
                && $scope.otherImgs.length < 10;
        }

        //提交合同
        submitContract() {
            // todo://上传到微信服务器的时候
            //todo://  imgarr   scope 域名 imgArr 对应 1 2 3     receiptImgs 借款    其他otherImgs   合同 travelImgs
            if ($scope.travelImgs.length + $scope.otherImgs.length + $scope.otherImgs.length == 0) {
                alert("请上传拍摄图片");
                return false;
            }
            this.verify() && (() => {
                loadDialog.show();
                //参数合并
                this.mergeArr();
                // go_page('../../pages/travel/decoration_order.html',[{"reloadState":1}]);
                return true;
            })();

        }


        removeImg(imgArr, $index) {
            $scope[imgArr].splice($index, 1);
            //删除一张图的时候 显示出上传按钮
            let imgs = imgArr + 'Full';
            $scope[imgs] = false;
        }


        // 上传图片处理逻辑  |  如单一职责 我怎么分方法 这一个是 还是带有直接调用微信
        mergeArr() {
            $scope.allImgsArr = [...$scope.otherImgs, ...$scope.receiptImgs, ...$scope.travelImgs];
            $scope.travelLen = $scope.travelImgs.length;
            $scope.receiptLen = $scope.receiptImgs.length;
            $scope.otherImgsLen = $scope.travelImgs.length;
            //     alert('长度其他' + $scope.otherImgsLen + '长度协议' + $scope.receiptLen + '长度合同' + $scope.travelLen);
            this.uploadToWeChat($scope.allImgsArr);
        }


        //todo:// 处理 serverIds数组  ..根据数组下标进行位置分发
        //序列化格式数据
        serializeData() {

            //传递 给服务器的参数
            let passParams = [];

            //push all to array

            //参数分类处理
            for (let i = 0, len = $scope.serverIds.length; i < len; i++) {

                let obj = {
                    imageId: $scope.serverIds[i],
                };
                if (i < $scope.travelLen) {
                    //   alert(1);
                    obj.subType = '1';
                } else if (i < $scope.receiptLen + $scope.travelLen) {
                    obj.subType = '2';
                    // alert(2);
                } else {
                    // alert(3);
                    obj.subType = '3'
                }
                passParams.push(obj)
            }
            //传递到服务器
            this.passToSever(JSON.stringify(passParams));
        }


    }

    let contract = new Contract();


    // $scope.addTravelImg = contract.addTravelImg;
    $scope.addTravelImg = imgArr => {
        contract.addTravelImg(imgArr);
    };
    $scope.submitContract = () => {
        //    
        contract.submitContract();
        // var contractNum = "111";
        // go_page('../../pages/travel/decoration_order.html',[{'urlState':2}, {'contractNum' : contractNum}, {'dataUrl' : dataUrl}]);
        contract.submitContract();
        // var contractNum = "111";
        // go_page('../../pages/travel/decoration_order.html',[{'urlState':1}, {'contractNum' : contractNum}, {'dataUrl' : dataUrl}]);
    };

    $scope.removeImg = (imgArr, $index) => {
        contract.removeImg(imgArr, $index);
    };

    $scope.saveTest = function () {
        go_page('../../pages/travel/decoration_order.html', [{'urlState': 1}, {'dataUrl': dataUrl}]);
    };


});