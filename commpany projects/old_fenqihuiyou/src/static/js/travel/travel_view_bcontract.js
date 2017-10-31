/**
 * Created by yu on 2017/3/9.
 */
controllerFunc('ngScope', 'ngController', function ($scope, $http, $timeout, $q) {


    // var BaseUrl = 'http://fenqihui.jinnuofeng.com/';
    // var BaseUrl = 'http://1y60698h03.51mypc.cn/';
    //生产
    // var BaseUrl = 'http://fenqihui.puhuijia.com:8888/';


    var loadDialog = new Dialog(DIALOG_LOAD);
    $scope.imgSelect = false;
    $scope.imgShow = {'display': 'block'};
    $scope.imgHidden = {'display': 'none'};

    var oid = GetQueryString('oId');
    var processStatus = GetQueryString('processStatus');
    var isQianyue = GetQueryString('isQianyue');


    //是否删除
    $scope.isToDelete = false;
    //是否添加
    $scope.isToAdd = false;
    $scope.deleteImgs = [];


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

            this.getContractImg();

        }

        //上传到服务器
        passToSever(param) {
            $http({
                method: 'POST',
                url: BaseUrl + 'contractInfo/addContractInfoForWx',
                params: {'imageIds': param, token: getToken(), "isQianyue": isQianyue, "oId": oid}
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
                    alert("上传成功");
                    go_page('../account/user_personal.html', {'signing': false});

                } else {
                    alert('上传合同失败');
                    loadDialog.hide();
                }
            }, () => {
                alert('error');
                loadDialog.hide();
            });

            $scope.isToAdd = false;


        };

        //TODO
        removeToServer(param) {
            if ($scope.isToDelete) {
                $http({
                    method: 'POST',
                    url: BaseUrl + 'contractInfo/delContract',
                    params: {'imgIds': param, token: getToken()}
                }).then((res) => {
                    alert(res.data.result);
                    if (res.data.result === SUCCESS_CODE) {
                        alert("修改合同成功");
                        if (!$scope.isToAdd) {
                            go_page('../account/user_personal.html', {'signing': false});
                        } else {
                            //参数合并
                            this.mergeArr();
                        }
                    } else {
                        alert('修改合同失败');
                        if (!$scope.isToAdd) {
                        } else {
                            //参数合并
                            this.mergeArr();
                        }

                    }
                }, () => {
                    alert('error');
                });
            } else {
                if ($scope.isToAdd) {
                    this.mergeArr();
                }
            }

        }

        //添加旅游照片
        //TODO
        addTravelImg(imgArr, type) {
            //.1 调用微信摄像头
            //.2 预览照片 每上传一张显示一张  数量限制 1~6
            //.3 提交将照片等信息上传oss
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['compressed'],
                sourceType: ['camera'],
                success: (res) => {
                    // alert('已选择 ' + res.localIds.length + ' 张图片');
                    //$('#img1').attr('src',res.localIds);

                    $scope.$apply(function () {
                        //可以选两张上传所以是 ids
                        $scope[imgArr].push(...res.localIds);
                        if (type == 1) {
                            $scope.isToAdd = true;
                            $scope.travelImgs1.push(...res.localIds);
                        }
                        if (type == 2) {
                            $scope.isToAdd = true;
                            $scope.receiptImgs1.push(...res.localIds);
                        }
                        if (type == 3) {
                            $scope.isToAdd = true;
                            // $scope.types.push(type);
                            $scope.otherImgs1.push(...res.localIds);
                        }

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
                    alert(JSON.stringify(res));
                    loadDialog.hide();
                }
            });
        }

        //    获取合同图片数据
        getContractImg() {
            var conId = GetQueryString('conId');

            if (!conId) {
                return false;
            }


            $http({
                method: 'POST',
                url: BaseUrl + 'contractInfo/findConImgs',
                params: {
                    'token': getToken(),
                    'conId': conId
                }
            }).then(function (response) {
                //获取图片oss token
                if (response.data.result == SUCCESS_CODE) {

                    $scope.contracts = response.data.type1;
                    $scope.travelLentgh = $scope.contracts.length;

                    for (let i = 0; i < $scope.travelLentgh; i++) {
                        $scope.travelImgs[i] = $scope.contracts[i].fileUrl;
                        $scope.travelImgsPass[i] = $scope.contracts[i].imgId;
                    }
                    // $scope.travelImgs = url;

                    $scope.payContract = response.data.type2;
                    $scope.payLength = $scope.payContract.length;
                    for (let i = 0; i < $scope.payLength; i++) {
                        $scope.receiptImgs[i] = $scope.payContract[i].fileUrl;
                        $scope.receiptImgsPass[i] = $scope.payContract[i].imgId;
                    }

                    $scope.otherContract = response.data.type3;
                    $scope.otherLength = $scope.otherContract.length;

                    for (let i = 0; i < $scope.otherLength; i++) {
                        $scope.otherImgs[i] = $scope.otherContract[i].fileUrl;
                        $scope.otherImgsPass[i] = $scope.otherContract[i].imgId;
                    }
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
            if ($scope.travelImgs.length + $scope.otherImgs.length + $scope.otherImgs.length == 0) {
                alert("请上传拍摄图片");
                return false;
            }
            this.verify() && (() => {
// //参数合并
//                 this.mergeArr();
                //删除操作
                this.removeToServer($scope.deleteImgs);

                return true;
            })();
        }

        removeImg(imgArr, $index, type) {
            $scope.isToDelete = true;
            var idx;
            //判断是否是新上传图片
            if (processStatus == '303') {
                if(type == '1') {
                    idx = $scope.travelImgs[$index].indexOf("http");
                }else if (type == '2') {
                    idx = $scope.receiptImgs[$index].indexOf("http");
                } else {
                    idx = $scope.otherImgs[$index].indexOf("http");
                }
            }
            //删除预览
            $scope[imgArr].splice($index, 1);
            if (idx == 0) {
                if (type == 1) {
                    if ($scope.travelImgsPass[$index]) {
                        $scope.deleteImgs.push($scope.travelImgsPass[$index]);
                        $scope.travelImgsPass.splice($index, 1);
                        $scope.isToDelete = true;
                    }
                } else if (type == 2) {
                    //todo
                    if ($scope.receiptImgsPass[$index]) {
                        $scope.deleteImgs.push($scope.receiptImgsPass[$index]);
                        $scope.receiptImgsPass.splice($index, 1);
                        $scope.isToDelete = true;
                    }
                } else {
                    if ($scope.otherImgsPass[$index]) {
                        $scope.deleteImgs.push($scope.otherImgsPass[$index]);
                        $scope.otherImgsPass.splice($index, 1);
                        $scope.isToDelete = true;
                    }
                }
            }  else {
                //微信新增状态
                //如果是删除合同状态
                if (processStatus == '303') {
                    if(type == '1') {
                        //确定下标 新上传合同是没有imgId的
                        let i = $scope.travelImgs1.length - 1 - ($scope[imgArr].length - $index);
                        $scope.travelImgs1.splice(i, 1);
                        // $scope.travelImgs1.splice();
                    } else if(type == '2') {
                        let i = $scope.receiptImgs1.length - 1 - ($scope[imgArr].length - $index);
                        $scope.receiptImgs1.splice(i, 1);
                    } else {
                        let i = $scope.otherImgs1.length - 1 - ($scope[imgArr].length - $index);
                        $scope.otherImgs1.splice(i, 1);
                    }

                }

                if ($scope.deleteImgs.length == 0) {
                    $scope.isToDelete = false;
                }
            }



            // $scope.travelImgsPass.splice($index, 1);
            //删除一张图的时候 显示出上传按钮
            let imgs = imgArr + 'Full';
            $scope[imgs] = false;
        }


        // 上传图片处理逻辑  |  如单一职责 我怎么分方法 这一个是 还是带有直接调用微信
        mergeArr() {
            // $scope.allImgsArr = [...$scope.otherImgs, ...$scope.receiptImgs, ...$scope.travelImgs];
            //增加状态下

            if (processStatus == '303') {
                $scope.allImgsArr = [...$scope.travelImgs1, ...$scope.receiptImgs1, ...$scope.otherImgs1];
            }
            // $scope.travelLen = $scope.travelImgs.length;
            // $scope.receiptLen = $scope.receiptImgs.length;
            // $scope.otherImgsLen = $scope.travelImgs.length;

            $scope.travelLen = $scope.travelImgs1.length;
            $scope.receiptLen = $scope.receiptImgs1.length;
            $scope.otherImgsLen = $scope.otherImgs1.length;

            if ($scope.travelLen + $scope.receiptLen + $scope.otherImgsLen == 0) {
                $scope.isToAdd = false;
            } else {
                $scope.isToAdd = true;
            }
            //     alert('长度其他' + $scope.otherImgsLen + '长度协议' + $scope.receiptLen + '长度合同' + $scope.travelLen);
            if ($scope.isToAdd) {
                loadDialog.show();
                this.uploadToWeChat($scope.allImgsArr);
            }
        }


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
                //
                // if (processStatus == '303') {
                //     obj.subType = '1';
                // } else if (processStatus == '304') {
                //     if (i < $scope.receiptLen) {
                //         obj.subType = '3';
                //     } else {
                //         obj.subType = '2';
                //     }
                // }
                if (i < $scope.travelLen) {
                    obj.subType = '1';
                } else if (i < $scope.receiptLen + $scope.travelLen) {
                    obj.subType = '2';
                } else {
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


    $scope.addTravelImg = (imgArr, type) => {
        contract.addTravelImg(imgArr, type);
    };

    $scope.submitContract = () => {
        contract.submitContract();
    };
    $scope.removeImg = (imgArr, $index, type) => {
        contract.removeImg(imgArr, $index, type);
    };


    $scope.scaleImg = function ($event, $index) {
        //图片展示
        $scope.imgSelect = true;
        $scope.imgUrl = $($event.target).attr('src');
    };


//    图片展示框点击隐藏
    $scope.shelterHidden = function () {
        $scope.imgSelect = false;
        $scope.tit = "查看旅行合同";
    };

})
;