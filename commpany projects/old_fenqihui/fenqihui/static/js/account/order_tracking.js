"use strict";var app=controllerFunc("orderTrack","orderTrackCtr",function(r,o,e,t){function a(){o({method:"POST",params:{token:n},url:BaseUrl+"fqhorder/queryOrderList"}).then(function(o){console.log(o),"0000"==o.data.result&&(r.orderList=o.data.orderList)},function(r){console.error("数据请求失败"),alert("接口请求失败")})}var n=getToken();r.goWithdraw=function(r){go_page("../../pages/travel/travel_checkstand.html",[{oPId:r.oPId},{oMId:r.oMId}])},a()});