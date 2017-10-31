'use strict';

controllerFunc('userModifyPassword', 'userModifyPasswordController', function ($scope, $http) {
    var keys = $('#keybord ul li'),
        wrap = $('#pass_show li'),
        len = 6,
        i = 0,
        password = [];

    $('#keybord ul li').on('click', function (e) {
        var _index = $(this).index(),
            key_value = $(keys.eq(_index)).children('i').html();
        if (_index === 11) {
            updateValue('remove');
        } else {
            password.push(key_value);
            updateValue('*');
        }
    });

    function updateValue(pass) {

        if (pass === 'remove') {
            wrap.eq(--i).html('');
            password.pop();
            return;
        }
        wrap.eq(i).html(pass);
        i++;
        if (i === len) {
            // 用户输入的密码
            var str = password.join("");
            $http({
                method: 'POST',
                params: {
                    'token': getToken(),
                    'payPwd': str
                },
                url: BaseUrl + 'account/modifyPayPwdFirst'
            }).success(function (response) {
                // window.location.href = './user_modify_password_confirm.html';
                window.location.href = '../../pages/account/user_modify_password_confirm.html';
            }).error(function (response) {
                alert("密码错误");
            });
            // window.location.href = './user_modify_password_confirm.html';
        }
    }

    // 版本更新弹窗
    $scope.noUpdate = function () {
        $(".popWindow").css('display', 'block');
        $('.prompt_for_no_updates').css('display', 'block');

        $(".close_btn").bind('click', function () {
            $(".popWindow").css('display', 'none');
            $('.prompt_for_no_updates').css('display', 'none');
        });
    };
});

// // override  for oop 
// $(function() {
//     //the class val and method 
//     var keyboard = {
//         keys: $('#keybord ul li'),
//         wrap: $('#pass_show li'),
//         len: 6,
//         i: 0,
//         password: [],
//         bind_click: function(e) {
//             var _index = $(this).index(),
//                 key_value = $(keys.eq(_index)).children('i').html();
//             if (_index === 11) {
//                 this.updateValue('remove');
//             } else {
//                 this.password.push(key_value);
//                 this.updateValue('*');
//             }
//         },
//         update: function(pass) {
//             if (pass === 'remove') {
//                 wrap.eq(--i).html('');
//                 this.password.pop();
//                 return;
//             }
//             this.wrap.eq(i).html(pass);
//             i++;
//             if (this.i === this.len) {
//                 console.info('the pass is' + this.password);
//                 alert('请求网络，自动回车');
//             }
//         }
//     };
//     keyboard.keys.on('click', keyboard.bind_click);
// });