'use strict';

/**
 * Created by wuzhicheng on 2017/7/3.
 */
var pId = GetQueryString('pId');
var fDuration = GetQueryString('fDuration');
var pTitle = GetQueryString('pTitle');
var pTitleSub = GetQueryString('pTitleSub');
var loadDialog = new Dialog(DIALOG_LOAD);
var increaseStarObj = {
    deleteItem: '',
    deleteindex: '',
    imgstring: '',
    imgarr: [],
    travelImgs: [],
    receiptImgs: [],
    otherImgs: [],
    imgIds: '',
    count: 0,
    travelindex: '',
    receiptindex: '',
    otherindex: '',
    compressImg:'',
    init: function init() {
        this.initData();
        this.inputClick();
    },
    initData: function initData() {},
    //input 点击事件
    inputClick: function inputClick() {
        var that = this;
        var personalNatural = document.getElementById("personalNatural");
        var assetCertificate = document.getElementById("assetCertificate");
        var otherCredentials = document.getElementById("otherCredentials");

        $("#personalNaturalFull").click(function () {
            console.log("个人资质");

            that.addTravelImg(personalNatural, ".personalNatural-img-list", 1);
        });
        $("#assetCertificateFull").click(function () {
            console.log("资产证明");

            that.addTravelImg(assetCertificate, ".assetCertificate-img-list", 2);
        });
        $("#otherCredentialsFull").click(function () {
            console.log("其他凭证");
            that.addTravelImg(otherCredentials, ".otherCredentials-img-list", 3);
        });
    },

    addTravelImg: function addTravelImg(fileImg, imglist, imgLabelType) {
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
                //                            获取图片大小
                var size = file.size / 1024 > 1024 ? ~~(10 * file.size / 1024 / 1024) / 10 + "MB" : ~~(file.size / 1024) + "KB";
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
                        $(".account-upload-btn").css("color", "gray");
                        $(".account-upload-btn").html("图片上传中...");
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
                data: {
                    token: getToken(),
                    imgType: 2,
                    imgLabelType: imgLabelType,
                    imgfile: fileName,
                    base64str: imgfilestring
                },
                dataType:"json",
                beforeSend: function beforeSend() {
                    loadDialog.show(100);
                },
                success: function success(res) {
                    loadDialog.hide(100);
                    $(".account-upload-btn").html("提交");
                    $(".account-upload-btn").css("color", "#96adb3");

                    function creatLi(imglist,imgId){
                            var li = $('<li></li>');
                            that.imgIds = li.attr("imgId",imgId);
                            li.html('<img src="data:image/jpeg;base64,'+that.compressImg +'" alt="上传图片" /><p class="travel-img-remove" onclick="increaseStarObj.deleteImg(this)"><i class="iconfont ">&#xe63d;</i></p>');
                            imglist.prepend(li);
                    }

                    // console.log("添加图片成功");
                    if (imgLabelType == 1) {
                        var travelData = res.imgId;
                        that.travelImgs.push(travelData);
                        var tourist = $(".personalNatural-img-list");
                        creatLi(tourist,travelData)
                    } else if (imgLabelType == 2) {
                        var receiptData = res.imgId;
                        that.receiptImgs.push(receiptData);
                        var payment = $(".assetCertificate-img-list");
                        creatLi(payment,receiptData)
                    } else {
                        var otherData = res.imgId;
                        that.otherImgs.push(otherData);
                        var vasa = $(".otherCredentials-img-list");
                        creatLi(vasa,otherData);
                    }
                    that.imgarr = that.travelImgs.concat(that.receiptImgs).concat(that.otherImgs);
                    that.imgstring = that.imgarr.toString();
                },
                complete:function(){
                    loadDialog.hide(100);

                },
                error: function () {
                    alert("添加失败");
                    loadDialog.hide(100);

                }
            });
        }
    },

    //删除图片
    deleteImg: function deleteImg(item) {
        var that = this;
        $(item.parentNode).click(function(){
            var imgId=$(this).attr("imgId");
            console.log("要删除的下标："+imgId);
            console.log("删除前的旅游数组:"+that.travelImgs);
            deleteimgAjax(imgId);
            //获得各自url的ID
            var parentId=$(this).parent().attr("id");
            console.log(parentId);
            if(parentId=="personalNatural-img-list"){
                that.travelImgs.rM(imgId, 1);
                console.log("删除后的旅游数组:"+that.travelImgs);
            }else if(parentId=="assetCertificate-img-list"){
                that.receiptImgs.rM(imgId, 1);
                console.log("删除后的付款数组:"+that.receiptImgs);
            }else if(parentId=="otherCredentials-img-list"){
                that.otherImgs.rM(imgId, 1);
                console.log("删除后的签证数组:"+that.otherImgs);
            }
            that.imgstring = that.travelImgs.concat(that.receiptImgs).concat(that.otherImgs).toString();
            console.log("删除后提交的总数组：" + that.imgstring);
        });
        //删除图片请求
        function deleteimgAjax(deleteimgId) {
            var data=$.param({
                imgId: deleteimgId,
                token: getToken()
            });
            $.ajaxPackagain(BaseUrl + "/imgupload/delete?"+data,
              function(res){
                  if (res.result == "0000") {
                      alert("删除图片成功");
                      item.parentNode.parentNode.removeChild(item.parentNode);

                  } else if (res.result == "9001") {
                      alert("删除图片失败");
                  }
              },
                function(){
                    alert("删除失败");

                }
            );
        };
    },

    //提交合同
    submitContract: function submitContract() {
        var that = this;
        console.log("删除后的提交" + that.imgstring);
        if (that.travelImgs.length + that.receiptImgs.length + that.otherImgs.length == 0) {
            alert("请上传拍摄图片");
            return false;
        } else {

            var data=$.param({
                imgIds: that.imgstring,
                token: getToken()
            });
            $.ajaxPackagain(BaseUrl + "/contract/saveContract?"+data,
            function (res){
                if (res.result === SUCCESS_CODE) {
                    loadDialog.hide();
                    alert("上传成功");
                    go_page("../../pages/travel/tracel_myStages.html");
                } else if (res.result == 1008) {
                    alert("请先实名");
                    loadDialog.hide();
                } else if (res.result == 1009) {
                    alert('已提交过申请，该申请正在审批');

                    loadDialog.hide();
                } else if (res.result == 2008) {
                    alert('请先开户');
                    loadDialog.hide();
                } else {
                    alert('上传失败');
                    loadDialog.hide();
                }
            },
                function(){
                    alert('上传失败了');
                    loadDialog.hide();
                }
            )
        }
    }

};

$(function () {
    increaseStarObj.init();
});