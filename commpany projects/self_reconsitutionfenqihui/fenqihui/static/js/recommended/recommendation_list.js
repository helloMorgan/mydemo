'use strict';

controllerFunc('recommedationList', 'recommendationListController', function ($scope, $http) {

    var RecommendationList = function () {
        var title = GetQueryString('laName');
        var lbId = GetQueryString('lbId');

        function _recommend() {
            this.getTitle = function () {
                return title;
            };
            this.getLbId = function () {
                return lbId;
            };
        }
        _recommend.prototype = {
            //getLabelList
            getLabelList: function getLabelList() {
                $http({
                    method: 'POST',
                    params: {
                        labelId: lbId
                    },
                    url: BaseUrl + 'product1/searchDestInfoList'
                }).then(function (response) {
                    if (response.data.result === SUCCESS_CODE) {
                        $scope.items = response.data.data;
                    }
                });
            },
            searchDetail: function searchDetail(lbId, index, name) {
                $scope.selectedRow = index;
                go_page('../travel/travel_product_list.html', [{ 'lbId': lbId }, { 'laName': name }]);
            }
        };
        return _recommend;
    }();

    var RecommendationListObj = new RecommendationList();
    $scope.title = RecommendationListObj.getTitle();
    $('#title').html($scope.title);
    RecommendationListObj.getLabelList();
    $scope.searchDetail = function (lbId, index, name) {
        RecommendationListObj.searchDetail(lbId, index, name);
    };
});