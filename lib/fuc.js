$(function(){
    var homepage = "http://10.37.1.17:9003/sdsq_web/login";
    let userAddvcd = "";
    let userId = "";
    var urlParm = window.location.search;
    var tokenArr = urlParm.split("token=");
    var urlToken;
    if(tokenArr.length > 1){//url带了token，则说明从水信息页面跳转过来，进行登录操作，否则说明不是水信息跳转过来，
                            //不需要判断用户信息进行登录，不然会出现无用户信息重定向到水信息登录页面的bug
        urlToken = tokenArr[1];
        var params = getUrlParam("token");

        var userinfo = null;
        
        if (params != null)
        {
            var str_userinfo = Decrypt(params);
            if (str_userinfo != "")
            userinfo = JSON.parse(str_userinfo);
        }
        if (userinfo == null) 
        {
            $(window).attr('location', homepage);
        }
        else {
            if (userinfo.roleId != "1")
                $("#export_btn").hide();

            if (moment(userinfo.expireTime).isBefore(moment()))
                $(window).attr('location', homepage);
        }
        userAddvcd = userinfo.addvcd;
        userId = userinfo.userId;

        //登录
        if(userId != "" || userId != null){
            $.ajax({
                url: loginUrl,
                data: {username:userinfo.userName,password:"KwO7Joe9HkkdSZPQui9&*^%Uxm!"},
                type: "get",
                dataType: "json",
                // traditional: true,
                contentType: "application/x-www-form-urlencoded; charset=utf-8",
                // xhrFields:{withCredentials: true},
                success: function (_res) {
                    var data = _res;
                    if(_res.success){
                        $.session.set('userName', _res.data.user.userName);
                        $.session.set('realName', _res.data.user.realName);
                        $.session.set('roleId', _res.data.user.roleId);
                        $.session.set("sessionId",_res.data.token);
                        $.session.set("_duty_time_today",_res.data.duty_time_today);
                        $.session.set("_duty_role_db",_res.data.duty_role_db);
                        $.session.set('addvcd',_res.data.user.addvcd);
                        // window.location = '../index.html';
                    }else{
                        var message = _res.message;
                        $(".errorInfo").text(message);
                    }
                },
                error: function (_res) {
                    var message = _res.message;
                    $(".errorInfo").text(message);
                    console.log(_res);
                },
            });
        }
    }
})

function loadJS(url, callback) {
    var script = document.createElement('script'),
        fn = callback || function () { };
    script.type = 'text/javascript';
    //IE
    if (script.readyState) {
        script.onreadystatechange = function () {
            if (script.readyState == 'loaded' || script.readyState == 'complete') {
                script.onreadystatechange = null;
                fn();
            }
        };
    } else {
        //其他浏览器
        script.onload = function () {
            fn();
        };
    }
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
}

//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}

var key =  CryptoJS.enc.Utf8.parse("463DBAF82395A511D4123456789ABCDF");
var iv = CryptoJS.enc.Utf8.parse('14933B77D14933B7');

//加密方法
function Encrypt(word) {
    var data = JSON.stringify(word);
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.ciphertext.toString();
}

//解密方法
function Decrypt(word) {
    var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    var decrypt = CryptoJS.AES.decrypt(CryptoJS.enc.Base64.stringify(encryptedHexStr), key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}