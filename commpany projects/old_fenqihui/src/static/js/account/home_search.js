var app=controllerFunc('searchApp', 'searchCtrl', function ($scope, $http, $timeout) {
    $scope.cancel=false;
    $scope.search=true;
    $scope.isHistory=false;
    $scope.isThink=true;
    $scope.isHis=true;
    var searchHistory=localStorage.getItem('sh');
    if(searchHistory){
        $scope.isHis=false;
        var hh=searchHistory.split(',');
        $scope.searchArray=hh;
    }else{
        $scope.isHis=true;
        $scope.searchArray =[];
    }
    $scope.$watch('address',function(newValue,oldValue){
        if(newValue && newValue!=''){
            $scope.cancel=true;
            $scope.search=false;
        }else{
            $scope.cancel=false;
            $scope.search=true;
        }

    },false);
//   删除输入框中的内容
    $scope.delValue=function () {
        $scope.address='';
    }
//    搜索
    $scope.goSearch=function () {
        searchIn();
    }
//   搜索接口
    function searchIn(item) {
        $http({
            method:'POST',
            url: BaseUrl+'product1/searchInfo',
            params:{
                'info':item || $scope.address
            }
        }).success(function (response) {
            if(response.result==SUCCESS_CODE ){
                if(response.data.length>0){
                    if(!item){
                        if($scope.searchArray.length>0){
                            var mark=true;
                            for(var i=0;i<$scope.searchArray.length;i++){
                                if($scope.address == $scope.searchArray[i]){
                                    $scope.searchArray.splice(i,1);
                                    $scope.searchArray.unshift($scope.address);
                                    mark=false;
                                    break;
                                }
                            }
                            if(mark){
                                $scope.searchArray.unshift($scope.address);
                            }
                        }else{
                            $scope.searchArray.push($scope.address);
                        }
                        var saveSh=$scope.searchArray.join(',');
                        localStorage.removeItem('sh');
                        localStorage.setItem('sh',saveSh);
                    }
                    var data=JSON.stringify(response.data);
                    sessionStorage.removeItem('data');
                    sessionStorage.setItem('data',data);
                    go_page('../../pages/travel/travel_product_list.html', [ {'laName': item||$scope.address}]);
                }else{
                    go_page('../../pages/account/search_fail.html');
                }

            }else{
                alert(response.message);
            }
        })
    }
    $('form').on('submit', function(res){
        if($scope.address&&$scope.address!=''){
            searchIn();
        }
        return false;
    });
//    历史搜索
    $scope.hisSearch=function (item) {
        searchIn(item);
    }
//   清空历史
    $scope.delHis=function () {
        localStorage.removeItem('sh');
        $scope.searchArray=[];
        $scope.isHis=true;
    }
});

