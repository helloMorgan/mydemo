'use strict';

$(document).ready(function () {
    function initPro() {
        var option1 = '';
        var name = '于路';
        var code = '1111111111111111111';
        alert(111);
        $.ajax({
            //提交数据的类型 POST GET
            type: "POST",
            //提交的网址
            url: BaseUrl + 'account/openAccountFirst',
            //提交的数据
            data: { realName: name, capAcntNo: code },
            // //在请求之前调用的函数
            // beforeSend: function() { $("#msg").html("logining"); },
            //成功返回之后调用的函数             
            success: function success(response) {},
            // //调用执行后调用的函数
            // complete: function(XMLHttpRequest, textStatus) {
            //     alert(XMLHttpRequest.responseText);
            //     alert(textStatus);
            //     //HideLoading();
            // },
            //调用出错执行的函数
            error: function error() {
                //请求出错处理
            }
        });
    }
    // $.getJSON("js/text.json", function(jsonData) {
    //     $.each(jsonData, function(index, indexItems) {
    //         option1 += "<option id=" + indexItems.id + ">" +
    //             indexItems.name + "</option>";
    //     });
    //     $("#provice").append(option1);
    //     $("#provice").bind("change", function() {
    //         selectCity(jsonData);
    //     })
    // });

    function selectCity(data) {
        var option2 = '';
        var selectedIndex = $("#provice :selected").text();
        $("#selectCity").empty();
        if ($("#provice :selected").val() == -1) {
            $("#selectCity").append("<option id=\"-1\">请选择城市</option>");
        }
        $.each(data, function (index, indexItems) {
            var proName = indexItems.name;
            $.each(indexItems.items, function (index, indexItems) {
                if (indexItems.parentNode != selectedIndex) {
                    return;
                } else {
                    option2 += "<option id=" + indexItems.id + ">" + indexItems.name + "</option>";
                }
            });
        });
        $("#selectCity").append(option2);
    };

    initPro();
});