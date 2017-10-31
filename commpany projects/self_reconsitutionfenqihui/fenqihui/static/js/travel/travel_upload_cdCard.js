"use strict";

/**
 * Created by wuzhicheng on 06/30/2017.
 */
var toast = new Dialog(DIALOG_TOAST);
var dialog = new Dialog(DIALOG_LOAD);
var token = getToken();
var uploadCdCardObj = {
    i: 0,
    cd_imgId: "aa",
    submitText: "下一步",
    preview: "预览",
    canSubmit: false,
    ALREADY_REAL: '1203',
    FORMAT_ERROR: '1201',
    idCard: '',
    init: function () {
        this.clickALL();
    },
    initData: function () {
        $(".travel_submit").addClass("unSubmit");
    },
    clickALL: function () {
        var that = this;
        //下一步
        $(".travel_submit").click(function () {
            that.submitCdCard();
        });
    },

    //点击下一步
    submitCdCard: function () {
        var that = this;
        // 前往人脸识别界面
        if (that.canSubmit) {
            console.log("能点击了");

            $("#thubm").attr({
                "src": "",
                "alt": "img"
            });

            $("#fileImage").click();
        }
    },

    // 上传图片预览
    previewImg: function (input, obj) {
        var that = undefined;
        $(".travel_preview>span").hide();
        if (input.files && input.files[0]) {
            var reader = new FileReader(),
                img = new Image();
            reader.onload = function (e) {
                var file = input.value;
                var index = file.lastIndexOf("\\");
                var filename = file.substr(index + 1, file.length);
                console.log("文件名字：" + filename);
                img.src = e.target.result;
                img.onload = function () {
                    var data = compress(img);
                    console.warn('image data size:' + data.length);
                    if (data.length > 1800000) {
                        alert("image too large,pls retry");
                        return;
                    }
                    var imgfile = data;
                    console.log(imgfile.length);
                    console.log("压缩后上传");
                    if ($("#thubm").attr("alt") == "img") {
                        ajaxload(imgfile, filename, 2);
                    } else {
                        ajaxload(imgfile, filename, 1);
                    }
                    setTimeout(function () {
                        $(obj).attr('src', "data:image/jpeg;base64," + data);
                    }, 1000);
                };
            };
            reader.readAsDataURL(input.files[0]);
            return 1;
        }


        function ajaxload(imgfilestring, fileName, imgLabelType) {
            var then = that;
            var data = {
                "imgType": "3",
                "imgLabelType": imgLabelType,
                "imgfile": fileName,
                "base64str": imgfilestring,
                "token": getToken()
            };
            $.ajax({
                type: "POST",
                url: BaseUrl + "imgupload/upload",
                data:data,
                dataType: "json",
                beforeSend: function () {
                    dialog.show(100);
                },
                success: function (res) {
                    dialog.hide(100);
                    console.log("返回的imgUrl:" + res.imgUrl);
                    if (res.result == "0000") {
                        if ($("#thubm").attr("alt") == "img") {
                            uploadCdCardObj.passFaceToServer(res.imgUrl);
                        } else {
                            uploadCdCardObj.passToServer(res.imgUrl);
                        }
                    } else if(res.result=="9001"){
                        alert(res.message);
                        return false;
                    }else{
                        alert("系统异常")
                    }
                },
                complete:function(){
                    dialog.hide(100);

                },
                error: function () {
                    alert("添加失败");
                    dialog.hide(100);

                }
            });
        }
    },

    //上传到自己服务器
    passToServer: function (imgurl) {
        var that = this;
        var data=$.param({
            imgUrl: imgurl,
            token: getToken()
        });
        toast.dialog.innerHTML = '身份证识别失败,请按规范进行拍照';
        $.ajax({
            type: "POST",
            url: BaseUrl + 'ocr/ocrInfoWx?'+data,
            dataType: "json",
            beforeSend: function () {
                dialog.show();
            },
            success: function (res) {
                if (res.result === SUCCESS_CODE) {
                    dialog.hide();
                    that.idCard = res.idCard;
                    that.name = res.name;
                    that.canSubmit = true;
                    $(".travel_submit").removeClass("unSubmit");

                    if (that.idCard && that.name) {
                        alert("身份证识别成功, 请继续下一步人脸识别");
                        that.submitText = "身份证识别成功, 请进行自拍";
                        $(".travel_submit").html(that.submitText);
                    }
                } else if (res.result == '7002') {
                    alert("请拍摄清晰身份证照片!");
                } else {
                    toast.show(3000, '10rem');
                }
                dialog.hide();
            },
            error: function () {
                toast.show(3000, '10rem');
                dialog.hide();
            }
        });
    },

    //上传人脸到服务器
    passFaceToServer: function (imgUrl) {
        var that = this;
        var data=$.param({
            imgUrl: imgUrl,
            token: token,
            idCard: that.idCard,
            name: that.name
        });
        $.ajax({
            type: "POST",
            url: BaseUrl + 'ocr/verifyInfoWx?'+data,
            dataType: "json",
            beforeSend: function beforeSend() {
                dialog.show();
            },
            success: function (res) {
                if (res.result === SUCCESS_CODE && res.confidenceRst && res.confidenceRst == 1) {
                    dialog.hide();
                    toast.dialog.innerHTML = '人脸识别成功';
                    toast.show(3000);
                    // 实名验证
                    that.certification();
                } else {
                    dialog.hide();
                    toast.dialog.innerHTML = '人脸识别失败';
                    toast.show(3000);
                }
            },
            error: function () {
                toast.dialog.innerHTML = '人脸识别失败';
                toast.show(3000);
                dialog.hide();
            }
        });
    },

    //验证成功
    certification: function () {
        var that = this;
        var data=$.param({
            imageId: that.cd_imgId,
            token: getToken(),
            idCard: that.idCard,
            realName: that.name
        });
        $.ajax({
            type: "POST",
            url: BaseUrl + 'members/realNameCertificationForWx?'+data,
            dataType: "json",
            success: function success(res) {
                if (res.result === SUCCESS_CODE) {
                    alert("人脸识别成功");
                    go_page('../account/user_add_card.html');
                } else if (res.result === that.ALREADY_REAL) {
                    toast.dialog.innerHTML = '身份证已被绑定';
                    toast.show(3000, '10rem');
                    //  若是我在别的机器上登录 岂不是用不了了 身份证已被绑定  不能用于其他账号了
                } else if (res.result === that.FORMAT_ERROR) {
                    toast.dialog.innerHTML = '身份证号格式不正确';
                    toast.show(3000, '10rem');
                } else {
                    alert('实名认证失败');
                }
            },
            error: function error() {
                alert('实名认证失败');
            }

        });
    }
};

$(function () {
    uploadCdCardObj.init();
});