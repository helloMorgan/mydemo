$(function() {
    'use strict';

    var nativeType = getTypeNative();
    var keys = $('#keybord ul li'),
        wrap = $('#pass_show li'),
        len = 6,
        i = 0,
        password = [];

    if(nativeType == 'ios') {
        $('#keybord ul li').bind('touch click', function(e) {
            var _index = $(this).index(),
                key_value = $(keys.eq(_index)).children('i').html();
            if (_index === 11) {
                updateValue('remove');
            } else {
                password.push(key_value);
                updateValue('*');
            }
        });
    } else {
        $('#keybord ul li').bind('click', function(e) {
            var _index = $(this).index(),
                key_value = $(keys.eq(_index)).children('i').html();
            if (_index === 11) {
                updateValue('remove');
            } else {
                password.push(key_value);
                updateValue('*');
            }
        });
    }


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
            go_page('./user_modify_password_dconfirm.html',[{'pass':str}]);
        }
    }

});

