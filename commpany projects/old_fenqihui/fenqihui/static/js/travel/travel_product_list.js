"use strict";var lbId=GetQueryString("lbId"),laName=GetQueryString("laName");controllerFunc("ngScope","ngController",function(t,a){function e(){var e={start:1,pTypeId:lbId};a({method:"POST",params:e,url:BaseUrl+"fqhpro/getProductListBySecondType"}).then(function(a){a.data.result===SUCCESS_CODE&&(0==a.data.data.length&&(t.totalCount=!0),(a.data.data||a.data.data.length)&&(10==a.data.data.length&&(l=!1,r++),""==a.data.data&&(l=!0),t.items=t.items.concat(a.data.data)))},function(t){console.error("数据请求失败")})}if(t.laName=laName,t.totalCount=!1,GetQueryString("source")){var l=!0,r=1;if(t.items=[],$(window).scroll(function(){var t=$(this).scrollTop(),a=$(document).height(),r=$(this).height();20>a-t-r&&0==l&&(l=!0,e())}),"label"==GetQueryString("source"));else;e()}else t.items=JSON.parse(sessionStorage.getItem("data"));t.toDetail=function(t){lbId?go_page("../travel/travel_myDetails.html",[{pId:t},{lbId:lbId}]):go_page("../travel/travel_myDetails.html",[{pId:t}])}});