function btnLogin_Click(){
    var username = $("#userName").val();
    var password = $("#password").val();
    $.ajax({
        url: loginUrl,
        data: {username:username,password:password},
        type: "get",
        dataType: "json",
        // traditional: true,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        xhrFields:{withCredentials: true},
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
                window.location = '../index.html';
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