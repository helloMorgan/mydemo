/**
 * Created by liyang on 14/12/2016.
 */
controllerFunc('ngScope', 'ngController', function ($scope, $http, $timeout, $q) {

        var i = 0;
        var cd_imgId = "";
        $scope.submitText = "下一步";

        class UploadCd {

            constructor() {
                $scope.preview = '预览';
                $scope.canSubmit = false;
                $scope.uploadCd = () => this.uploadCd(true);
                //点击进行微信摄像头调用 进行头像上传

                $scope.ALREADY_REAL = '1203';
                $scope.FORMAT_ERROR = '1201';
                $scope.toast = new Dialog(DIALOG_TOAST);
                $scope.dialog = new Dialog(DIALOG_LOAD);
                $scope.submitCdCard = () => {
                    //todo :// 前往人脸识别界面
                    // $scope.canSubmit&&this.uploadToWx()3
                    $scope.canSubmit && (() => {
                        this.uploadCd();
                    })();
                }

            }

            //上传到自己服务器
            passToServer(imgId) {
                $scope.toast.dialog.innerHTML = '身份证识别失败,请按规范进行拍照';
                $http({
                    method: 'POST',
                    url: BaseUrl + 'ocr/ocrInfoWx',
                    params: {
                        imageId: imgId,
                        token: getToken()
                    }
                }).then((res) => {
                    if (res.data.result === SUCCESS_CODE) {
                        $scope.idCard = res.data.idCard;
                        $scope.name = res.data.name;
                        $scope.canSubmit = true;
                        alert("身份证识别成功, 请继续下一步人脸识别");
                        $scope.submitText = "身份证识别成功, 请进行自拍";
                    } else if (res.data.result == '7002') {
                        alert("请拍摄清晰身份证照片!");
                    } else {
                        $scope.toast.show(3000, '10rem');
                    }
                    $scope.dialog.hide();

                }, () => {
                    $scope.toast.show(3000, '10rem');
                    $scope.dialog.hide();
                })
            }

            //上传人脸到服务器
            passFaceToServer(imgId) {
                $scope.defer = $q.defer();

                $http({
                    method: 'POST',
                    url: BaseUrl + 'ocr/verifyInfoWx',
                    params: {
                        imageId: imgId,
                        token: getToken(),
                        idCard: $scope.idCard,
                        name: $scope.name
                    }
                }).then((res) => {
                    // alert(res.data.confidenceRst);
                    if (res.data.result === SUCCESS_CODE && res.data.confidenceRst && res.data.confidenceRst == 1) {
                        $scope.dialog.hide();
                        $scope.toast.dialog.innerHTML = '人脸识别成功';
                        $scope.toast.show(3000);
                        // 实名验证
                        $scope.defer.resolve(imgId);
                        //  this.certification(imgId);


                    } else {
                        $scope.dialog.hide();
                        $scope.toast.dialog.innerHTML = '人脸识别失败';
                        $scope.toast.show(3000);
                    }

                }, () => {
                    $scope.toast.dialog.innerHTML = '人脸识别失败';
                    $scope.toast.show(3000);
                    $scope.dialog.hide()
                });

                return $scope.defer.promise;
            }


            //验证成功
            certification() {
                $http({
                    method: 'POST',
                    url: BaseUrl + 'members/realNameCertificationForWx',
                    params: {
                        imageId: cd_imgId,
                        token: getToken(),
                        idCard: $scope.idCard,
                        realName: $scope.name
                    }
                }).then((res) => {
                    if (res.data.result === SUCCESS_CODE) {
                        // alert("人脸识别成功");
                        go_page('../account/user_add_card.html');
                    }
                    else if (res.data.result === $scope.ALREADY_REAL) {
                        $scope.toast.dialog.innerHTML = '身份证已被绑定';
                        $scope.toast.show(3000, '10rem');
                        //todo://  若是我在别的机器上登录 岂不是用不了了 身份证已被绑定  不能用于其他账号了
                        // alert('实名认证成功');
                        // go_page('../account/user_add_card.html');

                    } else if (res.data.result === $scope.FORMAT_ERROR) {
                        $scope.toast.dialog.innerHTML = '身份证号格式不正确';
                        $scope.toast.show(3000, '10rem');
                    }
                    else {
                        alert('实名认证失败');

                    }

                }, () => {
                    alert('实名认证失败');
                })
            }


            uploadCd(tag) {
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['compressed'],
                    sourceType: ['camera'],
                    success: (res) => {

                        $scope.$apply(() => {
                            // $scope.wxImgId = res.localIds[0];
                            if (tag) {
                                $scope.haveImg = true;
                                // $('#imgShow').attr('src', res.localIds[0]);
                                // var svalue = "${basePath}/CheckCodeServlet?id=" + Math.random();
                                document.getElementById("imgShow").setAttribute("src", res.localIds[0]);
                                // $scope.cdImg = res.localIds[0];
                                this.uploadToWx(res.localIds, 'ok');
                            } else {
                                this.uploadToWx(res.localIds);
                            }
                        });
                    }
                });
            }

            //上传到微信服务器
            uploadToWx(localIds, tag) {
                $scope.dialog.show();
                var localIdImg;
                if (localIds.length > 0) {
                    localIdImg = localIds[0];
                }
                wx.uploadImage({
                    localId: localIdImg.toString(), // 需要上传的图片的本地ID，由chooseImage接口获得
                    isShowProgressTips: 0, // 默认为1，显示进度提示
                    success: (res) => {
                        if (i++ == 0) {
                            cd_imgId = res.serverId;
                        }

                        if (tag) {
                            this.passToServer(res.serverId);
                        } else {
                            this.passFaceToServer(res.serverId).then(this.certification)
                        }
                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            }
        }


        var uploadCD = new UploadCd();


    }
);