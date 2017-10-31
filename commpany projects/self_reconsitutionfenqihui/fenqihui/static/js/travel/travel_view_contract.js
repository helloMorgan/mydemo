'use strict';

/**
 * Created by wuzhicheng on 2017/7/1.
 */
var loadDialog = new Dialog(DIALOG_LOAD);
var oid = GetQueryString('oId');
var processStatus = GetQueryString('processStatus');
var isQianyue = GetQueryString('isQianyue');
var stype = GetQueryString('pType');
var conId = GetQueryString('conId');
var viewContractObj = {
    imgSelect: false,
    sType: stype,
    //    是否删除
    isToDelete: false,
    //是否添加
    isToAdd: false,
    deleteImgs: [],
    travelImgs: [],
    receiptImgs: [],
    otherImgs: [],
    isShowRemove: true,
    isShowRemoveTravel: true,
    contracts: '',
    travelLentgh: '',
    payContract: '',
    init: function () {
        this.initData();
        this.getContractImg();
    },
    initData: function () {
        var that = this;
        $(".travelImgsTitle>span").html("旅游合同");
    },
    clickAll: function () {
    },
    //    获取合同图片数据
    getContractImg: function () {
        var that = this;
        if (!conId) {
            return false;
        }
        ;
        var data = $.param({
            'token': getToken(),
            'conId': conId
        });
        $.ajaxPackagain(BaseUrl + 'contractInfo/findConImgs?' + data,
            function (res) {
                //获取图片oss token
                if (res.result == SUCCESS_CODE) {
                    var imgShow = function imgShow(arr, parent) {
                        $(arr).each(function (index, elem) {
                            var imgBox = $('<figure class="travel-img-wrap"><img  src="' + elem.fileUrl + '" alt=""/> </figure>');
                            parent.append(imgBox);
                        });
                    };

                    that.contracts = res.type1;
                    that.payContract = res.type2;
                    that.otherContract = res.type3;

                    ;
                    imgShow(that.contracts, $(".travelImgContent"));
                    imgShow(that.payContract, $(".receiptImgContent"));
                    imgShow(that.otherContract, $(".otherImgContent"));
                } else if (res.result == ERROR_CODE) {
                    console.log('失败数据请求！');
                }
            },
            function () {
                console.log('网络异常！');

            }
        );
    }
};
$(function () {
    viewContractObj.init();
    if (processStatus == '303') {
        viewContractObj.isShowRemoveTravel = false;
    }

    if (processStatus == '304') {
        viewContractObj.isShowRemove = false;
    }
});