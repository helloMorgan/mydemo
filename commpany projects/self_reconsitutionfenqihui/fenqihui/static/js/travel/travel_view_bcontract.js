'use strict';

/**
 * Created by wuzhicheng on 2017/7/3.
 */
var loadDialog = new Dialog(DIALOG_LOAD);
var oid = GetQueryString('oId');
var processStatus = GetQueryString('processStatus');
var isQianyue = GetQueryString('isQianyue');
var stype = GetQueryString('pType');
var touristAdd2 = document.getElementById("touristAdd2");
var paymentAdd2 = document.getElementById("paymentAdd2");
var vasaAdd2 = document.getElementById("vasaAdd2");
var dialog = new Dialog(DIALOG_LOAD);
var viewBcontractObj = {
    traveIndex: '',
    receiptIndex: '',
    otherIndex: '',
    deleteItem: '',
    deleteIndex: '',
    travelIndexs: '',
    receiptIndexs: '',
    otherIndexs: '',
    sType: stype,
    imgString: '',
    deleteIndex1: '',
    backImgarrstring: '',
    imgArr: [],
    backImgArr: [],
    travelImgs: [],
    receiptImgs: [],
    otherImgs: [],
    deleteImgs: [],
    imgIds: '',
    deleteIndexs: '',
    count: 0,
    travelImgsPass: [],
    receiptImgsPass: [],
    otherImgsPass: [],
    compressImg: '',
    init: function () {
        this.clickAll();
        this.getContractImg();
        this.initData();
    },
    initData: function () {
        // $(".sType").html(stype+"合同");
        $(".sType").html("旅游合同");
    },
    clickAll: function () {
        var that = this;
        $("#travelImgsFull2").click(function () {
            console.log("合同");
            that.addTravelImg(touristAdd2, ".tourist-img-list", 1);
        });
        $("#receiptImgsFull2").click(function () {
            console.log("付款收据");
            that.addTravelImg(paymentAdd2, ".payment-img-list", 2);
        });
        $("#otherImgsFull2").click(function () {
            console.log("签证资料");
            that.addTravelImg(vasaAdd2, ".vasa-img-list", 3);
        });

        //   提交 合同

        $(".travel-upload-btn").click(function () {
            that.submitContract();
        });
    },

    deleteImg: function (item) {
        var that = this;
        $(item.parentNode).click(function () {
            var imgId = $(this).attr("imgId");
            console.log("要删除的下标：" + imgId);
            console.log("删除前的旅游数组:" + that.travelImgs);
            deleteimgAjax(imgId);
            //获得各自url的ID
            var parentId = $(this).parent().attr("id");
            item.parentNode.parentNode.removeChild(item.parentNode);
            console.log(parentId);
            if (parentId == "tourist-img-list") {
                that.travelImgs.rM(imgId, 1);
                console.log("删除后的旅游数组:" + that.travelImgs);
            } else if (parentId == "payment-img-list") {
                that.receiptImgs.rM(imgId, 1);
                console.log("删除后的付款数组:" + that.receiptImgs);
            } else if (parentId == "vasa-img-list") {
                that.otherImgs.rM(imgId, 1);
                console.log("删除后的签证数组:" + that.otherImgs);
            }
            that.imgstring = that.travelImgs.concat(that.receiptImgs).concat(that.otherImgs).toString();
            console.log("删除后提交的总数组：" + that.imgstring);
        });
        function deleteimgAjax(deleteimgId) {
            var data = $.param({
                imgId: deleteimgId,
                token: getToken()
            });
            $.ajaxPackagain(BaseUrl + "/imgupload/delete?" + data,
                function (res) {
                    if (res.result == "0000") {
                        alert("删除图片成功");
                    } else if (res.result == "9001") {
                        alert("删除图片失败");
                    }
                },
                function () {
                    alert("删除失败");
                }
            )

        }
    },

    //  添加图片的操作
    addTravelImg: function (fileImg, imglist, imgLabelType) {
        var that = this;
        fileImg.onchange = function () {
            if (!this.files.length) return;
            var files = Array.prototype.slice.call(this.files);
            if (files.length > 1) {
                alert("最多同时只可上传1张图片");
                return;
            }
            files.forEach(function (file, i) {
                if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;
                var reader = new FileReader();
                var li = document.createElement("li");
                //                            获取图片大小
                var size = file.size / 1024 > 1024 ? ~~(10 * file.size / 1024 / 1024) / 10 + "MB" : ~~(file.size / 1024) + "KB";
                that.imgIds = $(li).attr("imgId", that.count);
                that.count++;
                li.innerHTML = '<p class="travel-img-remove" onclick="viewBcontractObj.deleteImg(this)"><i class="iconfont ">&#xe63d;</i></p>';
                $(imglist).prepend($(li));
                reader.onload = function () {
                    var result = this.result;
                    var img = new Image();
                    img.src = result;
                    var file = fileImg.value;
                    var index = file.lastIndexOf("\\");
                    var fileNames = file.substr(index + 1, file.length);
                    img.onload = function () {
                        that.compressImg = compress(img);
                        console.warn('image data size:' + that.compressImg.length);
                        if (that.compressImg.length > 1800000) {
                            alert("image too large,pls retry");
                            return;
                        }
                        ;
                        var imgfile2 = that.compressImg;
                        console.log("压缩后上传");
                        $(".travel-upload-btn").css("color", "gray");
                        $(".travel-upload-btn").html("图片上传中...");
                        addimgAjax(imgfile2, fileNames, imgLabelType);
                    };
                };
                reader.readAsDataURL(file);
            });
        };
        //添加图片的请求
        function addimgAjax(imgfilestring, fileName, imgLabelType) {
            $.ajax({
                type: "POST",
                url: BaseUrl + "imgupload/upload",
                dataType: "json",
                data: {
                    imgType: 2,
                    imgLabelType: imgLabelType,
                    imgfile: fileName,
                    base64str: imgfilestring,
                    token: getToken()
                },
                beforeSend: function () {
                    dialog.show(100);
                },
                success: function (res) {
                    dialog.hide(100);
                    $(".travel-upload-btn").html("提交");
                    $(".travel-upload-btn").css("color", "#96adb3");

                    function creatLi(imglist, imgId) {
                        var li = $('<li></li>');
                        that.imgIds = li.attr("imgId", imgId);
                        that.count++;
                        li.html('<img src="data:image/jpeg;base64,' + that.compressImg + '" alt="上传图片" /><p class="travel-img-remove" onclick="uploadContractObj.deleteImg(this)"><i class="iconfont ">&#xe63d;</i></p>');
                        imglist.prepend(li);
                    }
                    if(res.result=="0000"){
                        console.log("添加图片成功");
                        if (imgLabelType == 1) {
                            var imgTouristId = res.imgId;
                            that.travelImgs.push(imgTouristId);
                            var tourist = $(".tourist-img-list");
                            creatLi(tourist, imgTouristId);
                        } else if (imgLabelType == 2) {
                            var imgPayId = res.imgId;
                            that.receiptImgs.push(imgPayId);
                            var payment = $(".payment-img-list");
                            creatLi(payment, imgPayId);

                        } else if(imgLabelType == 3) {
                            var imgOtherId = res.imgId;
                            that.otherImgs.push(imgOtherId);
                            var vasa = $(".vasa-img-list");
                            creatLi(vasa, imgOtherId);

                        }

                        that.imgArr = that.travelImgs.concat(that.receiptImgs).concat(that.otherImgs);
                        that.backImgArr = that.travelImgsPass.concat(that.receiptImgsPass).concat(that.otherImgsPass);
                        that.imgString = that.imgArr.concat(that.backImgArr).toString();

                    }else if(res.result=="9001"){
                        alert(res.message);
                        return false;

                    }else{
                        alert("系统异常")
                    }



                },
                error: function error() {
                    alert("添加失败");
                }
            });
        }
    },

    //    获取合同图片数据
    getContractImg: function () {
        var conId = GetQueryString('conId');
        var that = this;
        if (!conId) {
            return false;
        }
        var data = $.param({
            'token': getToken(),
            'conId': conId
        });
        $.ajaxPackagain(BaseUrl + 'contractInfo/findConImgs?' + data,
            function (res) {
                //获取图片oss token
                console.log("获取的合同数据");
                console.log(res);
                if (res.result == SUCCESS_CODE) {
                    that.contracts = res.type1;
                    console.log(that.contracts[0].fileUrl);
                    that.travelLentgh = that.contracts.length;
                    for (var i = 0; i < that.travelLentgh; i++) {
                        that.travelImgsPass[i] = that.contracts[i].imgId;
                        var tourists = $('<figure class="travel-img-wrap tourist" classId="tourist"><p class="travel-img-remove" onclick="viewBcontractObj.deleteImg(this)"><i class="iconfont ">&#xe63d;</i></p> <img src="' + that.contracts[i].fileUrl + '" alt=""> </figure>');
                        $(".touristContent").prepend(tourists);
                    }
                    that.payContract = res.type2;
                    that.payLength = that.payContract.length;
                    console.log(that.payContract);
                    for (var i = 0; i < that.payLength; i++) {
                        that.receiptImgsPass[i] = that.payContract[i].imgId;
                        var payments = $('<figure class="travel-img-wrap payment" classId="payment"><p class="travel-img-remove" onclick="viewBcontractObj.deleteImg(this)"><i class="iconfont ">&#xe63d;</i></p> <img src="' + that.contracts[i].fileUrl + '" alt=""> </figure>');
                        $(".paymentContent").prepend(payments);
                    }
                    that.otherContract = res.type3;
                    that.otherLength = that.otherContract.length;
                    console.log(that.otherContract);
                    for (var i = 0; i < that.otherLength; i++) {
                        that.otherImgsPass[i] = that.otherContract[i].imgId;
                        var payments = $('<figure class="travel-img-wrap vasa" classId="vasa"><p class="travel-img-remove" onclick="viewBcontractObj.deleteImg(this)"><i class="iconfont ">&#xe63d;</i></p> <img src="' + that.otherContract[i].fileUrl + '" alt=""> </figure>');
                        $(".vasaContent").prepend(payments);
                    }
                } else if (res.result == ERROR_CODE) {
                    console.log('失败数据请求！');
                }
            },
            function () {
                console.log("数据请求失败");

            }
        )
    },
    //提交合同
    submitContract: function () {
        var that = this;
        console.log("删除后的提交" + that.imgString);
        if (that.travelImgs.length + that.otherImgs.length + that.otherImgs.length + that.travelImgsPass.length + that.receiptImgsPass.length + that.otherImgsPass.length == 0) {
            alert("请上传拍摄图片");
            return false;
        } else {
            console.log(that.travelImgsPass);
            console.log(that.receiptImgsPass);
            console.log(that.otherImgsPass);
            if (that.travelImgs.length + that.receiptImgs.length + that.otherImgs.length == 0) {
                that.imgString = that.travelImgsPass.concat(that.receiptImgsPass).concat(that.otherImgsPass).toString();
            }
            var data = $.param({
                imgIds: that.imgString,
                oId: oid,
                token: getToken()
            });
            $.ajaxPackagain(BaseUrl + "/contract/saveContract?" + data,
                function (res) {
                    if (res.result === SUCCESS_CODE) {
                        alert("修改合同成功");
                        go_page('../travel/tracel_myStages.html', {'signing': false});
                    } else {
                        alert('修改合同失败');
                        loadDialog.hide();
                    }
                },
                function () {
                    alert("修改合同失败");
                    loadDialog.hide();
                }
            )

        }
    }
};
$(function () {
    viewBcontractObj.init();
});