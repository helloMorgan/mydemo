"use strict";var lbId=GetQueryString("lbId"),laName=GetQueryString("laName");controllerFunc("ngScope","ngController",function(t,a){if(t.laName=laName,t.totalCount=!1,GetQueryString("source")){var e=function(){var e={isHot:1,queryType:o,id:lbId,pageSize:r};a({method:"POST",params:e,url:BaseUrl+"product1/searchProductList"}).then(function(a){a.data.result===SUCCESS_CODE&&(0==a.data.totalCount&&(t.totalCount=!0),(a.data.data||a.data.data.length)&&(10==a.data.data.length&&(l=!1,r++),t.items=t.items.concat(a.data.data)))},function(t){console.error("数据请求失败")})},l=!0,r=1;if(t.items=[],$(window).scroll(function(){var t=$(this).scrollTop(),a=$(document).height(),r=$(this).height();20>a-t-r&&0==l&&(l=!0,e())}),"label"==GetQueryString("source"))var o=1;else var o=2;e()}else t.items=JSON.parse(sessionStorage.getItem("data"));t.toDetail=function(t){lbId?go_page("../travel/travel_detail_info.html",[{pId:t},{lbId:lbId}]):go_page("../travel/travel_detail_info.html",[{pId:t}])}});