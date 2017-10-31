'use strict';

/**
 * Created by wuzhicheng on 2017/6/26.
 */
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
console.log(dataUrl);
var otherData = "其他凭证";
var pType = JSON.parse(dataUrl).pType;
var dialog = new Dialog(DIALOG_LOAD);

var uploadContractObj = {
    deleteItem: '',
    deleteindex: '',
    sType: pType,
    imgstring: '',
    onlyShowContract: false,
    onlyShowVisa: false,
    onlyShowPay: false,
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
    init: function() {
        this.initData();
        this.inputClick();
    },
    initData: function () {
        $(".travel-head-nav h1").html(pType + "合同");
        $(".travel-upload-content:eq(0) h2 span").html(pType + "合同");
    },
    //input 点击事件
    inputClick: function () {
        var that = this;
        var touristAdd = document.getElementById("touristAdd");
        var paymentAdd = document.getElementById("paymentAdd");
        var vasaAdd = document.getElementById("vasaAdd");
        $("#travelImgsFull").click(function () {
            console.log("旅游");
            that.addTravelImg(touristAdd, ".tourist-img-list", 1);
        });
        $("#receiptImgsFull").click(function () {
            console.log("签证");
            that.addTravelImg(paymentAdd, ".payment-img-list", 2);
        });
        $("#otherImgsFull").click(function () {
            console.log("其他");
            that.addTravelImg(vasaAdd, ".vasa-img-list", 3);
        });
    },

    //添加旅游照片
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
                        that.compressImg= compress(img);
                        console.warn('image data size:' + that.compressImg.length);
                        if (that.compressImg.length > 1800000) {
                            alert("image too large,pls retry");
                            return;
                        };
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
            var data={
                token: getToken(),
                imgType: 2,
                imgLabelType: imgLabelType,
                imgfile: fileName,
                base64str:imgfilestring
            };
            $.ajax({
                type: "POST",
                url: BaseUrl + "imgupload/upload",
                data:data,
                beforeSend: function () {
                    dialog.show(100);
                },
                dataType:"json",
                success: function (res) {
                    dialog.hide(100);
                    $(".travel-upload-btn").html("提交");
                    $(".travel-upload-btn").css("color", "#96adb3");
                    function creatLi(imglist,imgId){
                        alert("123")
                        var li = $('<li></li>');
                        that.imgIds = li.attr("imgId",imgId);
                        that.count++;
                        li.html('<img src="data:image/jpeg;base64,'+that.compressImg +'" alt="上传图片" /><p class="travel-img-remove" onclick="uploadContractObj.deleteImg(this)"><i class="iconfont ">&#xe63d;</i></p>');
                        imglist.prepend(li);
                    };
                    if(res.result=="0000"){
                        console.log("添加图片成功");
                        if (imgLabelType == 1) {
                            var imgTouristId=res.imgId;
                            that.travelImgs.push(imgTouristId);
                            var tourist= $(".tourist-img-list");
                            creatLi(tourist,imgTouristId);
                        } else if (imgLabelType == 2) {
                            var imgPayId=res.imgId;
                            that.receiptImgs.push(imgPayId);
                            var payment = $(".payment-img-list");
                            creatLi(payment,imgPayId);

                        } else if(imgLabelType == 3){
                            var imgOtherId=res.imgId;
                            that.otherImgs.push(imgOtherId);
                            var vasa = $(".vasa-img-list");
                            creatLi(vasa,imgOtherId);

                        }
                        that.imgarr = that.travelImgs.concat(that.receiptImgs).concat(that.otherImgs);
                        that.imgstring = that.imgarr.toString();
                        console.log("添加后不删除直接提交的总数组:"+that.imgstring);

                    } else if(res.result=="9001"){
                        alert(res.message);
                        return false;
                    }else{
                        alert("系统异常")
                    }

                },
                error: function () {
                    alert("添加失败");
                }
            });
        }
    },

    //删除图片
    deleteImg: function (item) {
        var that = this;
        $(item.parentNode).click(function(){
            var imgId=$(this).attr("imgId");
            console.log("要删除的下标："+imgId);
            console.log("删除前的旅游数组:"+that.travelImgs);
            deleteimgAjax(imgId);
            //获得各自url的ID
            var parentId=$(this).parent().attr("id");
            item.parentNode.parentNode.removeChild(item.parentNode);
            console.log(parentId);
            if(parentId=="tourist-img-list"){
                that.travelImgs.rM(imgId, 1);
                console.log("删除后的旅游数组:"+that.travelImgs);
            }else if(parentId=="payment-img-list"){
                that.receiptImgs.rM(imgId, 1);
                console.log("删除后的付款数组:"+that.receiptImgs);
            }else if(parentId=="vasa-img-list"){
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

                } else if (res.result == "9001") {
                    alert("删除图片失败");
                }
            },
                function(){
                    alert("删除失败");
                }
            )

        };
    },

    //提交合同
    submitContract: function () {
        var that = this;
        console.log("删除后的提交" + that.imgstring);
        if (that.travelImgs.length + that.receiptImgs.length + that.otherImgs.length == 0) {
            alert("请上传拍摄图片");
            return false;
        } else {
            var data= $.param({
                imgIds: that.imgstring,
                token: getToken()
            });
            $.ajax({
                type: "POST",
                url: BaseUrl + "/contract/saveContract?"+data,
                dataType:"json",
                success: function (res) {
                    if (res.result === SUCCESS_CODE) {
                        //获得合同随机码
                        var contractNum = res.contractRandomCode;
                        alert("上传成功");
                        go_page('../../pages/travel/decoration_order.html', [{ 'urlState': 2 }, { 'contractNum': contractNum }, { 'dataUrl': dataUrl }]);
                    } else {
                        alert('上传失败');
                        loadDialog.hide();
                    }
                },
                error: function error() {
                    alert("失败");
                    loadDialog.hide();
                }
            });
        }
    }
};
$(function () {
    uploadContractObj.init();
});