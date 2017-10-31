/**
 * Created by Timor on 2017/3/7.
 */
controllerFunc('userForgetLoginPassword', 'userForgetLoginPasswordController', function ($scope, $http, $timeout) {
    $scope.isMsg=true;
    var uName=sessionStorage.getItem('userName');
    $scope.userName=uName;
    $scope.isClick=false;
    //提示
    function prompt(str) {
        $scope.pro_text =str;
        $scope.isMsg=false;
        $timeout(function () {
            $scope.isMsg=true;
        }, 1000,true);
    }
    $scope.saveName=function () {
        if($scope.userName==null || $scope.userName=='' || $scope.userName==undefined){
            prompt('用户名不能为空');
        }else{
            var strLen=0;
            for(var i=0;i<$scope.userName.length;i++){
                if(/^[\u4e00-\u9fa5]$/.test($scope.userName.charAt(i))){
                    strLen+=2;
                }else{
                    strLen++;
                }
            }
            if(strLen>16){
                prompt('超限不可输入,字母或数字16位，中文8位');
            }else{
                if($scope.isClick){
                    sentName();
                }

            }


        }
    }
    $scope.$watch('userName',function (newVal,oldVal) {
        if(newVal==uName){
            $('.login-user-login a').css('background','#ccc');
            $scope.isClick=false;
        }else{
            $scope.isClick=true;
            $('.login-user-login a').css({'background':'linear-gradient(to right,#F06E00, #E1281C)', 'border-color': '#E1281C #F06E00 #F06E00 #E1281C'});
        }
    },true)
    function sentName() {
        $http({
            method:'POST',
            url:baseUrl+'members/modifyNickName',
            params:{
                'token':getToken(),
                'nickName':$scope.userName
            }
        }).then(function (res) {
            prompt('用户名设置'+res.data.message);
            if(res.data.result==SUCCESS_CODE){

                if(!sessionStorage.getItem('save')){
                    sessionStorage.setItem('save',2);
                }else{
                    sessionStorage.setItem('save',parseInt(sessionStorage.getItem('save'))+1);
                }
                // location.replace(document.referrer);
                history.go(-1);
            }
        },function () {
            alert('网络异常')
        })
    }



})