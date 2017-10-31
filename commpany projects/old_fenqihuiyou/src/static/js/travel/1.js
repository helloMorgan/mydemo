var isIE6 = /msie 6/i.test(navigator.userAgent);
function shake(ele, cls, times) {
    var i = 0,
    t = false,
    o = ele.attr("class") + " ",
    c = "",
    times = times || 3;
    if (t) return;
    t = setInterval(function() {
        i++;
        c = i % 2 ? o + cls: o;
        ele.attr("class", c);
        if (i == 2 * times) {
            clearInterval(t);
            ele.removeClass(cls)
        }
    },
    200)
}

function validate_input(value, name) {
    value = $.trim(value);
    if (!value) return false;
    switch (name) {
    case "fullname":
        var pattern = /^[\w\.\-\u0391-\uFFE5]{2,30}$/;
        break; 
    case "content":
        var len = value.length;
        if (len < 6 || len > 600) return false;
        break;
    }
    if (name && pattern) {
        return pattern.test(value)
    } else {
        return true
    }
}
var ajax_isOk = 1;
function ajax(url, send_data, callback) {
    if (!ajax_isOk) return false;
    $.ajax({
        url: url,
        data: send_data,
        type: "post",
        cache: false,
        dataType: "json",
        beforeSend: function() {
            ajax_isOk = 0;
            $("#ajax-loader").addClass('loading2')
        },
        complete: function() {
            ajax_isOk = 1;
            $("#ajax-loader").removeClass('loading2')
        },
        success: function(data) {
            if (callback) callback(data)
        },
        error: function(XHR, Status, Error) {
            console.log("Data: " + XHR.responseText + "\r\nStatus: " + Status + "\r\nError: " + Error)
        }
    })
}
function setCookie(n, val, d) {
    var e = "";
    if (d) {
        var dt = new Date();
        dt.setTime(dt.getTime() + parseInt(d) * 24 * 60 * 60 * 1000);
        e = "; expires=" + dt.toGMTString()
    }
    document.cookie = n + "=" + val + e + "; path=/"
}
function getCookie(n) {
    var a = document.cookie.match(new RegExp("(^| )" + n + "=([^;]*)(;|$)"));
    if (a != null) return a[2];
    return ''
}
function parseJSON(data) {
    if (window.JSON && window.JSON.parse) return window.JSON.parse(data);
    if (data === null) return data;
    if (typeof data === "string") {
        data = $.trim(data);
        if (data) {
            var rvalidchars = /^[\],:{}\s]*$/,
            rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
            rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
            rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;
            if (rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, ""))) {
                return (new Function("return " + data))()
            }
        }
    }
    return false
}
function flashTitle() {
   
}
function stopFlashTitle() {
 
}
function getLocalTime() {
    var date = new Date();
    function addZeros(value, len) {
        var i;
        value = "" + value;
        if (value.length < len) {
            for (i = 0; i < (len - value.length); i++) value = "0" + value
        }
        return value
    }
    return addZeros(date.getHours(), 2) + ':' + addZeros(date.getMinutes(), 2) + ':' + addZeros(date.getSeconds(), 2)
}
var WebSocket = window.WebSocket || window.MozWebSocket;
if (!WebSocket) {
    var ws_obj = {};
    var ws_ready = false;
    $(window).load(function() {
        ws_ready = true
    });
    $(function() {
        $.ajax({
            url: SYSDIR + 'public/jquery.swfobject.js',
            dataType: 'script',
            async: false,
            cache: true
        });
        window.WebSocket = function(a) {
            a = a.match(/wss{0,1}\:\/\/([0-9a-z_.-]+)(?:\:(\d+)){0,1}/i);
            this.host = a[1];
            this.port = a[2] || 843;
            this.onopen = function() {};
            this.onclose = function() {};
            this.onmessage = function() {};
            this.onerror = function() {};
            this.ready = function(b) {
                return true
            };
            this.send = function(b) {
                return ws_obj.call.Send(b)
            };
            this.close = function() {
                return ws_obj.call.Close()
            };
            this.ping = function() {
                return ws_obj.call.Ping()
            };
            this.connect = function() {
                ws_obj.call = $('#flash_websocket')[0];
                ws_obj.call.Connect(this.host, this.port)
            };
            this.onmessage_escape = function(d) {
                this.onmessage({
                    data: unescape(d)
                })
            };
            if ($('#websocket1212').size()) {
                this.connect()
            } else {
                var div = $('<div id="websocket1212"></div>').css({
                    position: 'absolute',
                    top: -999,
                    left: -999
                });
                div.flash({
                    swf: SYSDIR + 'public/websocket.swf?r=' + Math.random(),
                    wmode: "window",
                    scale: "showall",
                    allowFullscreen: true,
                    allowScriptAccess: 'always',
                    id: 'flash_websocket',
                    width: 1,
                    height: 1,
                    flashvars: {
                        call: 'ws_obj._this'
                    }
                });
                $('body').append(div);
            }
            ws_obj._this = this;
        }
    })
}
function format_output(data) {
	console.log('format_output',data);
    data = data.replace(/((href=\"|\')?(((https?|ftp):\/\/)|www\.)([\w\-]+\.)+[\w\.\/=\?%\-&~\':+!#;]*)/ig,
    function($1) {
        return getURL($1)
    });
    data = data.replace(/([\-\.\w]+@[\.\-\w]+(\.\w+)+)/ig, '<a href="mailto:$1" target="_blank">$1</a>');
    data = data.replace(/\[:(\d*):\]/g, '<img src="' + SYSDIR + 'public/smilies/$1.png">').replace(/\\/g, '');
    return data
}
function getURL(url, limit) {
    if (url.substr(0, 5).toLowerCase() == 'href=') return url;
    if (!limit) limit = 60;
    var urllink = '<a href="' + (url.substr(0, 4).toLowerCase() == 'www.' ? 'http://' + url: url) + '" target="_blank" title="' + url + '">';
    if (url.length > limit) {
        url = url.substr(0, 30) + ' ... ' + url.substr(url.length - 18)
    }
    urllink += url + '</a>';
    return urllink
}
function insertSmilie(code) {
    code = '[:' + code + ':]';
    var obj = msger[0];
    var selection = document.selection;
    obj.focus();
    if (typeof obj.selectionStart != 'undefined') {
        var opn = obj.selectionStart + 0;
        obj.value = obj.value.substr(0, obj.selectionStart) + code + obj.value.substr(obj.selectionEnd)
    } else if (selection && selection.createRange) {
        var sel = selection.createRange();
        sel.text = code;
        sel.moveStart('character', -code.length)
    } else {
        obj.value += code
    }
}
function welive_link() { 
    console.warn('welive_link',WS_HOST,WS_PORT); 
    console.warn('welive_link',WS_HOST,WS_PORT);
    
    welive.ws = new WebSocket('ws://' + WS_HOST + ':' + WS_PORT + '/');
    
    
    welive.ws.onopen = function() {
        setTimeout(welive_verify, 100)
    };
    welive.ws.onclose = function() {
        welive_close()
    };
    welive.ws.onmessage = function(get) {
        welive_parseOut(get);
    }
}
function welive_parseOut(get) {
    var d = false,
    type = 0,
    data = parseJSON(get.data); 
    
	console.log("data:",data); 
    if (!data) return;
    
    switch (data.x) {
    case 5:
        if (data.a == 1) {
            welive.flashTitle = 1;
            type = 1;
            d = data.i
        } else {
            type = 2;
            d = welive.msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            welive.status = 1
        }
        break;
    case 6:
        switch (data.a) {
        case 8:  
            welive.status = 1;
            welive.autolink = 1;
            guest.gid = data.gid;
            guest.fn = data.fn;
            guest.aid = data.aid;
            guest.an = data.an;
            setCookie(COOKIE_USER, data.gid, 365); 
            console.log("guest:",guest); 
            //welive_op.find("#welive_avatar").attr("src", SYSDIR + "avatar/" + data.av);
            //welive_op.find("#welive_name").html(data.an); 
            $(document.body).attr('an',data.an); 
            historyViewport.removeClass('loading3');
            var recs = '';
            msger.focus();
            welive.flashTitle = 1;
            type = 1;
            d = welcome;
            autoOffline();
            welive_runtime();
            break;
        case 1:
            welive.status = 1;
            welive.flashTitle = 1;
            type = 3;
            d = guest.an + langs.aback;
            autoOffline();
            break;
        case 2:
            welive.flashTitle = 1;
            welive.status = 0;
            type = 4;
            d = guest.an + langs.offline;
            break;
        case 4:
            welive.status = 0;
            welive.autolink = 0;
            type = 4;
            d = langs.relinked + '<br><a onclick="welive_link();$(this).parents(\'.msg\').hide();return false;" class="relink">' + langs.rebtn + ' >>></a>';
            stopFlashTitle();
            break;
        case 5:
            welive.status = 0;
            welive.autolink = 0;
            welive.flashTitle = 1;
            type = 4;
            d = langs.autooff + '<br><a onclick="welive_link();$(this).parents(\'.msg\').hide();return false;" class="relink">' + langs.rebtn + ' >>></a>';
            break;
        case 6:
            welive.autolink = 0;
            welive.flashTitle = 1;
            type = 4;
            d = langs.kickout;
            break;
        case 7:
            welive.status = 0;
            welive.autolink = 0;
            welive.flashTitle = 1;
            type = 4;
            d = langs.banned;
            break;
        case 9:
            welive.autolink = 0;
            welive.linked = 0;
            break;
        case 10:
            welive.status = 1;
            welive.autolink = 1;
            welive.flashTitle = 1;
            type = 3;
            d = langs.unbann;
            break;
        case 11:
            welive.status = 1;
            welive.autolink = 1;
            guest.aid = data.aid;
            guest.an = data.an; 
            welive_op.find("#ppname").html(data.an);
            welive_op.find("#ppname").html(data.p);
            msger.focus();
            welive.flashTitle = 1;
            type = 3;
            d = langs.transfer + data.an;
            autoOffline();
            break;
        }
        break;
    }
    welive_output(d, type)
}

var welcomeWord = '欢迎关注 '+pname+'产品,请问有什么可以帮您?';
	welcomeWord ='亲,有什么可以帮您?';
function welive_output(d, type) {
    if (d === false || !type) return;
    if (welive.flashTitle) {
        flashTitle();
        if (welive.sound) sounder.html(welive.sound1);
        welive.flashTitle = 0
    }
     
    d=  d.replace('@@welcome',welcomeWord); 
    //$(document.body).attr('an')  '+getLocalTime() +'   '+name+'  '+getLocalTime() +'
    switch (type) {
	    case 1:
	        d = '<div class="msg r"><p style="width: 11%;margin-left: 20rem;margin-top: 0.3rem;position: absolute;">'+$(document.body).attr('an')+'</p><i><img style="width:35px;height:35px;border-radius:50%;" src="public/img/tx.png" /><br/></i><div class="b"><div class="i">' + format_output(d) + '</div></div></div>';
	        break;
	    case 2:
	        d = '<div class="msg l"><p style="width: 11%;margin-top: 0.3rem;margin-left: 5rem;position: absolute;">'+name+'</p><i><img style="width:35px;height:35px;border-radius:50%;" src="public/img/tx.png" /><br/></i><div class="b"><div class="i">' +
	        format_output(d) + '</div></div></div>';
	        break;
	    case 3:
	        d = '<div class="msg s"><div class="b"><div class="ico"></div><div class="i">' + d + '</div></div></div>';
	        break;
	    case 4:
	        d = '<div class="msg e"><div class="b"><div class="ico"></div><div class="i">' + d + '</div></div></div>';
	        break;
    }
    historier.append(d);
    history_wrap.welivebar_update('bottom')
}
function welive_verify() {

    welive.linked = 1;  
    welive.ws.send('x=6&a=8&n='+name+'&gid=' +
    		guest.gid + '&fn=' + guest.fn + '&aid=' +
    		guest.aid + '&l=' + guest.lang + '&k=' + 
    		SYSKEY + '&c=' + SYSCODE + '&fr='+ GetQueryString('pname') + 
    		'&ag=' + guest.agent + '&i=' + welive.ic)
	
}
function welive_close() {
    welive.status = 0;
    if (welive.autolink) {
        $("#websocket1212").remove();
        welive_output(langs.failed, 4);
        welive.ttt = setTimeout(welive_link, 6000)
    } else if (!welive.linked) {
        welive_comment()
    }
    welive.linked = 0
}
function welive_send(msg_text) {
    sender.addClass('loading2');
    if (welive.status && welive.linked) {
        var msg =msg_text;
		if(!msg_text){
			msg = $.trim(msger.val());
		} 
        if (msg) {
            welive.msg = msg;
            msg = msg.replace(/&/g, "||4||");
            welive.ws.send('x=5&i=' + name+':'+msg);
            msger.val('');
            welive.status = 0;
            autoOffline()
        }
    }
    msger.focus();
    sender.removeClass('loading2')
}
function autoOffline() {
    clearTimeout(welive.ttt);
    welive.ttt = setTimeout(function() {
        if (welive.linked) welive.ws.send('x=6&a=5')
    },
    offline_time)
}
function welive_runtime() {
    setInterval(function() {
        if (welive.status && welive.linked) {
            var msg = $.trim(msger.val());
            msg = msg.replace(/&/g, "||4||");
            if (msg && msg != welive.temp && welive.status && welive.linked) {
                welive.ws.send('x=4&i=' + msg);
                welive.temp = msg
            }
        }
    },
    update_time)
}
function welive_comment() {
    clearTimeout(welive.ttt);
    historyViewport.removeClass('loading3');
    $(".enter").html('').html('<div id="ajax-loader"></div>');
    welive_op.find("#ppname").html("444");
    welive_op.find("#ppname").html("的");
    var vid = 0;
    $.ajaxSetup({
        async: false
    });
    ajax(SYSDIR + 'index.php?ajax=1&act=vvc', "",
    function(data) {
        vid = parseInt(data.s)
    });
    $.ajaxSetup({
        async: true
    }); 
	/*' + langs.content + '*/

   // historier.css("padding-bottom", 0).html('').append('<div><br/><br/><br/><br/><form style="margin-left: 2.4rem;" id="comment_form" onsubmit="return false;"><input type="hidden" id="vid" value="' + vid + '"><input type="hidden" id="key" value="' + SYSKEY + '"><input type="hidden" id="code" value="' + SYSCODE + '"><br/><li><i style="float: left;margin-left: -1.5rem;margin-top: 0.5rem;color: red;">*</i><b style="font-size:1.2rem">姓名:</b><input style="margin-left: 1rem;height:2rem;width:75%;" id="fullname" type="text"></li><br/><li style="margin-top:.8rem"><i style="float: left;margin-left: -1.5rem;margin-top: 0.8rem;color: red;">*</i><b style="font-size:1.2rem">' + 'QQ'+ ':</b><input style="margin-left: 1.3rem;height:2rem;width:75%;" id="email" type="text"></li><br/><li style="margin-top:.8rem"><b style="font-size:1.2rem">' + langs.phone + ':</b><input style="margin-left: 1rem;height:2rem;width:75%;" id="phone" type="text"></li><br/><li style="margin-top:.8rem"><i style="float: left;margin-left: -1.5rem;margin-top: 1rem;color: red;">*</i><b style="font-size:1.2rem;float: left;margin-top: 1rem;">问题:</b><textarea id="if"  style="margin-left: 1rem;height:6rem;width:75%;" id="content"></textarea></li></form></div>')

//  historier.css("padding-bottom", 0).html('').append('<div><br/><br/><br/><br/><form style="margin-left: 2.4rem;" id="comment_form" onsubmit="return false;"><input type="hidden" id="vid" value="' + vid + '"><input type="hidden" id="key" value="' + SYSKEY + '"><input type="hidden" id="code" value="' + SYSCODE + '"><br/><li><b style="font-size:1.2rem">姓名:</b><input style="margin-left: 1rem;height:2rem;width:75%;" id="fullname" type="text"></li><br/><li><b style="font-size:1.2rem">' + 'QQ'+ ':</b><input style="margin-left: 1.3rem;height:2rem;width:75%;" id="email" type="text"></li><br/><li><b style="font-size:1.2rem">' + langs.phone + ':</b><input style="margin-left: 1rem;height:2rem;width:75%;" id="phone" type="text"></li><br/><li><b style="font-size:1.2rem">问题:</b><textarea id="if"  style="margin-left: 1rem;height:6rem;width:75%;" id="content"></textarea></li></form></div>')
    historier.css("padding-bottom", 0).html('').append('<div><br/><br/><br/><br/><form style="margin-left: 2.4rem;" id="comment_form" onsubmit="return false;"><input type="hidden" id="vid" value="' + vid + '"><input type="hidden" id="key" value="' + SYSKEY + '"><input type="hidden" id="code" value="' + SYSCODE + '"><br/><li><i style="float: left;margin-left: -1.5rem;margin-top: 0.5rem;color: red;">*</i><b style="font-size:1.2rem">姓名:</b><input style="margin-left: 1rem;height:2rem;width:75%;" id="fullname" type="text"></li><br/><li><i style="float: left;margin-left: -1.5rem;margin-top: 0.8rem;color: red;">*</i><b style="font-size:1.2rem">' + 'QQ'+ ':</b><input style="margin-left: 1.3rem;height:2rem;width:75%;" id="email" type="text"></li><br/><li><b style="font-size:1.2rem">' + langs.phone + ':</b><input style="margin-left: 1rem;height:2rem;width:75%;" id="phone" type="text"></li><br/><li><i style="float: left;margin-left: -1.5rem;margin-top: 1rem;color: red;">*</i><b style="font-size:1.2rem;float: left;margin-top: 1rem;">问题:</b><textarea id="content"  style="margin-left: 1rem;height:6rem;width:75%;" id="content"></textarea></li></form></div><div id="nb" style="width:100%;text-align: -webkit-center;"><div class="savemsg" onclick="submit_comment();">' + langs.submit + '</div></div>')

	
}
 
var shakeobj = function(obj) {
    shake(obj, "shake");
    obj.focus();
    return false
};
function submit_comment() {
    console.log('::::',$("#fullname").val(),$("#email").val(),$("#phone").val(),$("#content").val());
    
    if(!$("#fullname").val() || !$("#email").val() || !$("#phone").val() || !$("#content").val()){
    	alert('请填写以上信息');
    	return;
    }
     
    $.post('index.php?ajax=1&gid=' + guest.gid ,
    		{fullname:$("#fullname").val(),email:$("#email").val(),phone:$("#phone").val(),content:$("#content").val(),vid:GetQueryString('aid')},
	    function(result){
    		console.log(result);
			if(result=='true'){
				alert('感谢您留言');
				location.reload();
			}else{
				alert('操作失败');
			} 
	    }
    ); 
}
function welive_init() {
    sender = $(".sender");
    msger = $(".msger");
    historier = history_wrap.find(".overview");
    sounder = $("#wl_sounder");
    welive.ic = welive_op.find("#|w|e|l|i|v|e|_|c|o|p|y|r|i|g|h|t|>|a".replace(/\|/ig, "")).attr("h|r|e|f".replace(/\|/ig, ""));
    welive_link();
    history_wrap.welivebar();
    msger.keyup(function(e) {
        if (e.keyCode == 13) welive_send()
    });
    $(window).resize(function() {
        history_wrap.height($(window).height() - 89);
        history_wrap.welivebar_update('bottom');
        msger.focus()
    });
    sender.click(function(e) {
        welive_send();
        e.preventDefault()
    });
    if (!isIE6) $(".s_face").tipTip({
        content: $(".smilies_div").html(),
        keepAlive: true,
        maxWidth: "260px",
        defaultPosition: "top",
        edgeOffset: -31,
        delay: 300
    });
    $(document).mousedown(stopFlashTitle).keydown(stopFlashTitle);
    welive.sound1 = '<object data="' + SYSDIR + 'public/sound1.swf" type="application/x-shockwave-flash" width="1" height="1" style="visibility:hidden"><param name="movie" value="' + SYSDIR + 'public/sound1.swf"><param name="quality" value="high"></object>';
    window.onbeforeunload = function(event) {
        clearTimeout(welive.ttt)
    };
    $(window).unload(function() {
        clearTimeout(welive.ttt)
    })
}
var tttt = 0,
pagetitle, flashtitle_step = 0,
sounder;
var welive_op, welive_cprt, wrapper_h = 0,
history_wrap, historyViewport, historier, sender, msger;
var welive = {
    ws: {},
    linked: 0,
    status: 0,
    autolink: 0,
    ttt: 0,
    flashTitle: 0,
    ic: '',
    sound: 1,
    sound1: '',
    msg: '',
    temp: ''
};

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

$(function() {
    welive_op = $("#welive_operator");
    welive_cprt = $("#welive_copyright");
    history_wrap = $(".history");
    historyViewport = history_wrap.find(".viewport");
    var gid = getCookie(COOKIE_USER);
    guest.gid = parseInt( GetQueryString('uid'));  
    guest.fn=name; 
    guest.fr="someone";
    guest.ag="my_in";
    //绑定的商家ID
    var aid=parseInt(GetQueryString('aid'));
    if(isNaN(aid)){ 
    	 guest.aid=-1;
    	  $(".db").show();
    }else{

    	if(parseInt(aid)==10){             

              $(".db").hide();
    	}else{
    		$(".db").show();
    	}
    		guest.aid=aid; 	   
    }
   
    
    $("#ppname").html(pname);
	 
    welive_init();
	
	setTimeout(function(){ 
	    welive_send('hi,我在关注 '+pname+' [打招呼消息]');
	},1000)
	 
});