controllerFunc('userSetAccountPsw', 'userSetAccountPswController', function ($scope, $http, $timeout) {

    $scope.pro_text = "";
    $scope.isMsg=true;


    function prompt(str, url) {
        $scope.isMsg=false;
        $scope.pro_text = str;
        $timeout(function () {
            $scope.isMsg=true;
        }, 2000);
        if(url){
            var appType = getTypeNative();
            if (appType == 'ios') {
                goLogin();
            } else if (appType === 'android') {
                android.goLogin();
            }else{
                window.location.href = url + "?v=" + Math.random();
            }
        }
    }
    // 检查身份证
    function checkID(ID) {
        if (typeof ID !== 'string') return '非法字符串';
        var city = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江 ",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北 ",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏 ",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        };
        var birthday = ID.substr(6, 4) + '/' + Number(ID.substr(10, 2)) + '/' + Number(ID.substr(12, 2));
        var d = new Date(birthday);
        var newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate());
        var currentTime = new Date().getTime();
        var time = d.getTime();
        var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
        var sum = 0,
            i, residue;
        //if(!/^\d{17}(\d|x)$/i.test(ID)) return '非法身份证';
        if (!/^\d{17}(\d|x)$/i.test(ID)) return false;
        //if(city[ID.substr(0,2)] === undefined) return "非法地区";
        if (city[ID.substr(0, 2)] === undefined) return false;
        //if(time >= currentTime || birthday !== newBirthday) return '非法生日';
        if (time >= currentTime || birthday !== newBirthday) return false;
        for (i = 0; i < 17; i++) {
            sum += ID.substr(i, 1) * arrInt[i];
        }
        residue = arrCh[sum % 11];
        //if (residue !== ID.substr(17, 1)) return '非法身份证哦';
        if (residue !== ID.substr(17, 1)) return false;
        //return city[ID.substr(0,2)]+","+birthday+","+(ID.substr(16,1)%2?" 男":"女");
        return true;

    }

    //设置密码
    $scope.setPwd = function () {
        if (checkID($scope.idCard) == true) {
            if ($scope.pass == "") {
                prompt('密码不能为空');
                return;
            }
            if ($scope.pass.length < 6) {
                prompt('请输入6-16个字符的密码');
            } else {
                $http({
                    method: 'POST',
                    params: {
                        'token': getToken(),
                        'idCard': $scope.idCard,
                        'password': $scope.pass
                    },
                    url: BaseUrl + 'members/setLoginPwdWithRealName'
                }).success(function (response) {
                    switch (response.result) {
                        case '0000':
                            var url = '../../pages/account/user_login.html';
                            $scope.prompt_text = '密码设置成功';
                            prompt($scope.prompt_text, url);
                            break;
                        case '1201':
                            $scope.prompt_text = '身份证格式不正确';
                            prompt($scope.prompt_text);
                            break;
                        case '1202':
                            $scope.prompt_text = '身份证号与账号不匹配';
                            prompt($scope.prompt_text);
                            break;
                        case '1003':
                            $scope.prompt_text = '请输入6-16个字符的密码';
                            prompt($scope.prompt_text);
                            break;
                        case '1006':
                            $scope.prompt_text = '密码与支付密码不能相同!';
                            prompt($scope.prompt_text);
                            break;
                        case '9999':
                            $scope.prompt_text = '网络忙， 请稍后再试';
                            prompt($scope.prompt_text);
                            break;
                        default:
                            $scope.prompt_text = '系统刷新中';
                            prompt($scope.prompt_text);
                    }
                }).error(function (response) {
                    $scope.prompt_text = '网络忙， 请稍后再试';
                    prompt($scope.prompt_text);
                });
            }

        } else {
            prompt('身份证号输入有误');
        }


    }


});