controllerFunc('userAccountSet', 'userAccountSetController', function ($scope, $http, $timeout) {
    // 判断用户是否实名
    $scope.realName = false;
    $scope.isHide=true;
    $scope.prompt_text = "";
    $scope.bank = "";
    $scope.setPass = "";
    $scope.setAccount = "";
    $scope.haveCard = true;
    $scope.isName=true;
    $scope.setName='../../pages/account/user_set_username.html'+"?v=" + Math.random();
    const TOKEN = getToken();
    if(TOKEN) {
        $http({
            method: 'POST',
            params: {
                'token': TOKEN
            },
            url: BaseUrl + 'members/bankInfo'
        }).success(function(response) {

            if (response.result == '0000') {
                var bankId = response.bankId;
                var bankNo = response.bankNo;
                $scope.bandCode = bankNo;
                var imgSrc = "../../static/bitmap/account/bank_icon/"+bankId+".png";
                $scope.bankImg = imgSrc;
                $scope.haveCard = true;
            } else if (response.result == "1501") {
                $scope.haveCard = false;
            } else {
                $scope.haveCard = false;
            }
        }).error(function(response) {
            $scope.haveCard = false;
        });
    }

    var flag = true;
    
    function navive() {
        var naviveType = getTypeNative();
        if (naviveType == 'ios') {
            if (window.webkit) {
                window.webkit.messageHandlers.realNameAuthentication.postMessage({token:TOKEN});
            }else {
                realNameAuthentication(TOKEN);
            }
        } else if (naviveType == 'android') {
            android.realNameAuthentication(TOKEN);
        } else {
            alert('无web版本服务,请在微信或者App中打开');
        }

        flag = true;
    }


    $scope.goto_mod=function () {
        navive();
    }

    $(document).ready(function () {
        // 实名认证
        $http({
            method: 'POST',
            params: {
                'token': TOKEN
            },
            url: BaseUrl + 'members/searchRealNameStatus'
        }).success(function (response) {
            if (response.result == '4004') {
                go_page('./user_login.html');
                return;
            }
            if (response.result == '0000') {
                var accountStatus = response.accountStatus;
                // 0是判断非实名 1判断实名
                if (response.accountStatus == 1) {
                    $scope.realName = true;
                    $scope.bank = './user_show_card.html' + "?v=" + Math.random();
                    $scope.setPass = '../../pages/account/user_forget_pay_password.html' + "?v=" + Math.random();
                    $scope.setAccount = '../../pages/account/user_set_login_password1.html' + "?v=" + Math.random();

                    if (accountStatus == 0) {

                    } else {
                        $scope.bank = './user_show_card.html' + "?v=" + Math.random();
                        $scope.setPass = '../../pages/account/user_forget_pay_password.html' + "?v=" + Math.random();
                    }
                    // $scope.setAccount = './user_register_account.html';
                    //  $scope.bank = './user_add_card.html';
                    // $scope.setPass = '../../pages/account/user_forget_pay_password.html';
                    // $scope.setAccount = '../../pages/account/user_register_account.html';
                } else {
                    console.log("未实名认证");
                    $scope.realName = false;
                    $scope.setPass = '#';
                    $scope.setAccount = '../../pages/account/user_register_account.html' + "?v=" + Math.random();

                    $('.setPay').bind('click', function () {
                        $('.prompt_box p').css('font-size', '.7rem');
                        $scope.$apply(function () {
                            $scope.isHide=false;
                        })
                    });

                    $('.set_authentication').bind('click', function () {
                        $('.prompt_box p').css('font-size', '1rem');
                        $scope.$apply(function () {
                            $scope.isHide=false;
                        })
                    });

                }
            } else {
                $scope.bank = "";
                $scope.setPass = "";
                $scope.setAccount = "";
                console.log('网络异常');

            }
        }).error(function (response) {
            $scope.bank = "";
            $scope.setPass = "";
            $scope.setAccount = "";
            console.log('网络异常');
        });
        

    });
    
//查询用户名
    function checkName() {
        $http({
            method:"POST",
            url:BaseUrl+"members/findNickNameByToken",
            params:{
                'token':getToken()
            }
        }).then(function (res) {
            if(res.data.result==SUCCESS_CODE){
                if(res.data.nickName == ''){
                    $scope.isName=false;
                    $scope.userName='';
                }else{
                    $scope.isName=true;
                    $scope.userName=res.data.nickName;
                    sessionStorage.removeItem('userName');
                    sessionStorage.setItem('userName',$scope.userName);
                }
            }
        },function () {
            console.log("网路异常")
        })
    }
    checkName();
    $scope.back=function () {

        if(sessionStorage.getItem('save')){
            history.go(-sessionStorage.getItem('save'));
        }else{
            history.go(-1);
        }
    }
});






