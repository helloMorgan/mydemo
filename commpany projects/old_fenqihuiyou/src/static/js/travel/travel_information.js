$(function () {
    var taboffset = 0;
    var tabs = $('.tab');
    var mySwiper = new Swiper('.swiper-container', {
            direction: 'horizontal',
            autoplay: 5000, //可选选项，自动滑动
            loop: true,
            freeModeMomentumBounce: false,
            pagination: '.swiper-pagination',


        }),
        mySwiperContent = new Swiper('.swiper-container-content', {
            direction: 'horizontal',
            scrollbar: '.swiper-scrollbar',
            scrollbarHide: false,
            onSlideChangeEnd: function (swiper) {
                alelrt(2);
                alert(swiper.activeIndex) //每次切换时，提示现在是第几个slide
            },
            onSlideChangeEnd: function (swiper) {
                dealEve(tabs.eq(swiper.activeIndex));
            }

        });
    $(tabs).on('click', function () {
        var _index = $(this).index();
        dealEve(tabs.eq(_index));
        mySwiperContent.slideTo(_index, 1000, false); //切换到第一个slide，速度为1秒

    });

    function dealEve(target) {
        target.addClass('travel-tab-active');
        target.siblings().removeClass('travel-tab-active');
    }


});