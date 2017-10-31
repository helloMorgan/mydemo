/**
 * Created by yu on 2017/3/22.
 */
controllerFunc('getToken', 'getTokenCtr', function ($scope, $http, $timeout, $q) {
    var homeUrl = GetQueryString('homeUrl');
    var weBaseUrl = "";
    // if (homeUrl) {
    //     window.location.href = decodeURIComponent(homeUrl);
    // }

    var code = "";

    function getInfo() {
        // $http({
        //     method: 'POST',
        //
        //     url: BaseUrl + 'fqhwechat/getWechatCode',
        // }).then(function (response) {
        //     console.log(response);
        //     if (response.data.result == SUCCESS_CODE) {
        //         // window.location.href = weBaseUrl + '/oauth?homeUrl=' + encodeURI(homeUrl);
        //
        //     }
        //
        //
        // }, (response) => {
        //     console.error('数据请求失败');
        // });

        localStorage.clear();
    }

    getInfo();
});