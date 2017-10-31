"use strict";

/**
 * Created by wuzhicheng on 06/20/2017.
 */
var destinationObj = {
  list: [],
  destNameList: [],
  destList: [],
  bannerList: [],
  selectIndex: "",
  Index: "",
  //初始化列表
  init: function () {
    this.getBanner();
    this.initInfoList();
  },
  initInfoList: function () {
    var that = this;
      $.ajaxPackagain(BaseUrl + 'fqhpro/getProductSecondType?',
          function(res){
              if(res.result === SUCCESS_CODE) {
                  var then = that;
                  that.destNameList = res.data;
                  var destNameList = that.destNameList;
                  console.log(destNameList);

                  for(var i = 0; i < destNameList.length; i++) {
                      var creatLi = $("<li></li>");
                      $(".destNameList").append(creatLi);
                      creatLi.html(destNameList[i].firLevelName);
                  };
                  $(".destNameList>li").click(function() {
                      var Index = $(this).index();
                      var elem = $(".container_right")[0];
                      while(elem.hasChildNodes()) {
                          elem.removeChild(elem.firstChild);
                      }
                      then.changeList(Index);
                  });

                  $(".destNameList>li").click(function() {
                      var Index = $(this).index();
                      var elem = $(".container_right")[0];
                      while(elem.hasChildNodes()) {
                          elem.removeChild(elem.firstChild);
                      }
                      then.changeList(Index);
                  });
                  that.destList = [];
                  var index = GetQueryString('index');
                  if(index) {
                      setTimeout(function() {
                          var temp = parseInt(index);
                          then.changeList(temp);
                      }, 200);
                  } else {
                      setTimeout(function() {
                          $('.container_left>ul>li').eq(0).addClass('visted');
                          then.changListData(0);
                      }, 200);
                  }
              }
          },
          function(){
              console.error('数据请求失败');
          }

      );

  },

  callbackSwiper: function () {
    var mySwiper = new Swiper('.swiper-container', {
      direction: 'horizontal',
      //auto slide
      autoplay: 5000,
      loop: true,
      freeModeMomentumBounce: false,
      pagination: '.swiper-pagination'
    });
  },
  getBanner: function getBanner() {
    var that = this;
      var data = $.param({
          start: 1,
          bType: 2
      });
      $.ajaxPackagain(BaseUrl + 'fqhpro/getFqhProductCarouselImgList?'+data,
          function(res){
              var then = that;
              if(res.result === SUCCESS_CODE) {
                  that.bannerList = res.data;
                  console.log(that.bannerList);
                  for(var i = 0; i < that.bannerList.length; i++) {
                      console.log(that.bannerList.length);
                      var bannerDiv = $('<div class="swiper-slide"></div>');
                      var bannerDivimg = $('<img src="' + OSS_IMG_URL + that.bannerList[i].url + '" alt="轮播图">');
                      bannerDiv.append(bannerDivimg);
                      $("#destinationBanner").append(bannerDiv);
                  };

                  $("#destinationBanner .swiper-slide").click(function() {
                      var swiperSlideindex = $(this).index() - 1;
                      console.log(that.bannerList[swiperSlideindex]);
                      var pId = that.bannerList[swiperSlideindex].pId;
                      console.log("pId：" + pId);
                      then.toDetail(pId);
                  });
                  setTimeout(function() {
                      that.callbackSwiper();
                  }, 500);
              }
          },
          function(){
              console.error('数据请求失败');
          }
      )
  },
  toDetail: function (pId) {
    go_page('../travel/travel_myDetails.html', [{
      'pId': pId
    }]);
  },
  //切换list添加样式，右侧图片列表的显示
  changeList: function (i) {
    $('.container_left>ul>li').eq(i).addClass('visted').siblings().removeClass('visted');
    if(i == 0) {
      $("title").html("新婚服务");
    } else if(i == 1) {
      $("title").html("目的地");
    } else if(i == 2) {
      $("title").html("其他");
    }
    this.changListData(i);
  },
  //切换左侧，右侧图片列表的展示
  changListData: function (index) {
    var that = this;
    var list = [];
    for(var i = 0; i < this.destNameList[index].secLevel.length; i++) {
      list.push(this.destNameList[index].secLevel[i]);
    };
    console.log(list);
    $(list).each(function(index2, element2) {
      var creatDiv = $("<div class='left_img'></div>");
      var creatImg = $('<img src="' + OSS_IMG_URL + element2.url + '" alt="">');
      creatDiv.append(creatImg);
      $(".container_right").append(creatDiv);
    });

    $(".container_right .left_img").click(function() {
      var clickIndex = $(this).index();
      that.searchBourn(list[clickIndex].pTypeId, list[clickIndex].pTypeId.name);
    });
  },

  searchBourn: function (lbId, name) {
    go_page('../../pages/travel/travel_product_list.html', [{
      'lbId': lbId
    }, {
      'laName': name
    }, {
      'source': 'label22'
    }]);
  }

};

$(function() {
  destinationObj.init();
});