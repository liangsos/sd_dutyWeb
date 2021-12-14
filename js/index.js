//用户角色 1管理员 2值班领导 3普通用户
var _duty_role = $.session.get("roleId");
// var _duty_role = $.cookie('roleId');
var token = $.session.get("sessionId");
// var token = $.cookie('sessionId');
var addvcd = $.session.get("addvcd");
// var addvcd = $.cookie('addvcd');
// var _duty_role = "<%=_duty_role%>";
var extNodes = new Array({ text: "值班记录", leaf: true, icon: "images/icon/record.png", qtip: "page/DutyRecord.html", qtitle: '值班记录' },
                 { text: "文件管理", leaf: true, icon: "images/icon/file.png", qtip: "page/DutyFile.html", qtitle: '文件管理' },
                 { text: "值班查询", leaf: true, icon: "images/icon/search.png", qtip: "page/DutyBb.html", qtitle: '值班查询' },
                 { text: "排班管理", leaf: true, icon: "images/icon/plan.png", qtip: "page/DutyRecordUser.html", qtitle: '排班管理' },
                 { text: "水情通讯录", leaf: true, icon: "images/icon/communication.png", qtip: "page/CommunicationNew.html", qtitle: '水情通讯录' }
                //  { text: "邮件管理", leaf: true, icon: "images/icon/import.png", qtip: "page/DutyEmail.html", qtitle: '邮件管理' }
                 );
//省级用户能看到邮件管理
if(addvcd == "37"){
    extNodes.push({text: "邮件管理", leaf: true, icon: "images/icon/import.png", qtip: "page/DutyEmail.html", qtitle: '邮件管理'});
}
                 
//管理员可看到后台菜单                 
if (_duty_role == "1")
{
    extNodes.push({
        text: "后台管理", qtitle: 'parent2', expanded: true, icon: "images/icon/htgl.png", children:
          [
            { text: "人员管理", leaf: true, qtip: "page/DutyUser.html", qtitle: '人员管理' },
            // { text: "站点管理", leaf: true, qtip: "page/DutyStation.html", qtitle: '站点管理' },
            // { text: "机构管理", leaf: true, qtip: "page/DutyOrgan.html", qtitle: '机构管理' },
            // { text: "来文单位", leaf: true, qtip: "page/DutyFileOrgan.html", qtitle: '来文单位' },
            { text: "法定假管理", leaf: true, qtip: "page/DutyHoliday.html", qtitle: '法定假管理' },
            { text: "值班IP管理", leaf: true, qtip: "page/DutyAddress.html", qtitle: '值班IP管理' },
            // { text: "水情通讯录", leaf: true, qtip: "page/Communication.html", qtitle: '水情通讯录' }
          ]
    });
}

window.moveTo(0, 0);
window.resizeTo(screen.availWidth, screen.availHeight);
Ext.require(['*']);
var tabPanel;
Ext.onReady(function () {
    var store = Ext.create('Ext.data.TreeStore', {
        autoLoad: true,
        root: {
            expanded: false,
            children: extNodes
        }
    });
    var firstTag = true;
    var treePanel = Ext.create('Ext.tree.Panel', {
        title: 'Simple Tree',
        width: 120,
        store: store,
        rootVisible: false,
        region: 'west',
        title: '系统功能目录',
        split: true,
        collapsible: true,
        listeners: {
            itemclick: function (view, record, item, index, e, opt) {
                var id = record.get('qtitle');
                var url = record.get('qtip');
                if (url != '') {
                    fnOpenTab(id, url);
                }
            },
            collapse: function () {
                if (firstTag) {
                    Ext.get('treepanel-1009-placeholder').addListener('click', function (e1) {
                        e1.stopEvent();
                    });
                    Ext.get('treepanel-1009-placeholder_hd').addListener('click', function (e1) {
                        e1.stopEvent();
                    });
                    Ext.get('ext-gen1058').addListener('click', function (e1) {
                        e1.stopEvent();
                    });
                }
                firstTag = false;
            }
        }
    });

    tabPanel = Ext.create('Ext.tab.Panel', {
        region: 'center',
        items: [
            {
                id: '值班记录', title: '<div style="font-size:14px;">值班记录</div>', qtip: "page/DutyRecord.html", qtitle: '值班记录',
                closable: true,
                html: "<iframe src='page/DutyRecord.html' frameborder='0' style='width:100%; height:100%;' scrolling='no' ></iframe>"
            }
        ]
    });

    var viewport = Ext.create('Ext.Viewport', {
        layout: {
            type: 'border',
            padding: 5
        },
        defaults: {
            split: true
        },
        top:0,
        items: [
        {
            region: 'north',
            collapsible: false,
            height: 50,
            html: "<div style='width: 100%; height: 50px; background-color: #4284D9;'><img src='images/duty_logo2.jpg' /><label id='exit'>退出</label><label id='home'>首页</label><label id='changePassword'>修改密码</label><label id='labUserName'></label><span class='spanTop'><i class='fa fa-user-circle-o fa-2x fa-fw'></i></span><label id='labTodayDuty'></label></div>"
        }, tabPanel, treePanel
        ]
    });
});


//打开tab
function fnOpenTab(id, url) {
    var newTab;
    var title = '<div style="font-size:14px;">' + id + '</div>';
    if (Ext.getCmp(id)) {
        newTab = Ext.getCmp(id);
    } else {
        newTab = Ext.create('Ext.panel.Panel', {
            closable: true,
            title: id,
            id: id,
            title: title,
            initEvents: function () {            //双击关闭事件
                var obj = this;
                //var id = 'tab-' + (this.id.split('-')[1] - 1 + 2) + '-btnWrap';
                Ext.get(this.id).dom.ondblclick = function () {
                    tabPanel.remove(obj);
                }
            },
            html: '<iframe src="' + url + '" height="100%" width="100%" frameborder=0/>'
        });
        tabPanel.add(newTab);
    }
    newTab.show();

}
//test
function testfunc() {
    alert("Ext调用外部js函数成功");
}

//更新登陆人员
function updLoginUser(_duty_user_name,_duty_today)
{
    $("#labUserName").text(_duty_user_name);
    $("#labTodayDuty").text(_duty_today);
}

//更新今日值班
function updDutyToday(_duty_today) {
    $("#labTodayDuty").text(_duty_today);
}

//跳转登陆页
function toLogin() {
    location.href = "DutyLogin.html";
}


$(function () {
    /**
     * 退出登陆
     **/
    $(document.body).delegate("#exit", "click", function () {
        if (confirm("是否确认退出系统?")) {
            $.ajax({
                headers:{
                    "Authorization" : token
                },
                type: "GET",
                timeout:300000,
                // contentType: "application/x-www-form-urlencoded; charset=utf-8",
                dataType: "json",
                url: systemLogoutUrl,
                // xhrFields:{withCredentials: true},
                success: function (res) {
                    if(res.success){
                        //清除本地登录信息
                        $.session.clear();
                        location.href = "page/DutyLogin.html";
                    }
                },
                error: function (err) {
                    alert("清除Cookie失败！");
                }
            });
        }
    });

    /**
     * 退出登陆
     **/
    $(document.body).delegate("#home", "click", function () {
        window.location = "home.html"
    })

    //修改密码弹出
    $(document.body).delegate("#changePassword", "click", function () {
        $("#modalChangePassword").show();
    });

    //修改密码
    $(".btn_change_password").click(function () {
        //验证数据
        var pass1 = $("#new_password").val();
        var pass2 = $("#new_password2").val();
        if (pass1 == "") {
            $(".change_password_error").text("新密码不能为空！");
            return;
        }
        if (pass2 == "") {
            $(".change_password_error").text("确认密码不能为空！");
            return;
        }
        if (pass1 != pass2) {
            $(".change_password_error").text("密码不一致！");
            return;
        }
        $(".change_password_error").text("");

        //修改密码
        $.ajax({
            headers:{
                "Authorization" : token
            },
            type: "POST",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            dataType: "json",
            url: changePasswordUrl,
            data:{"newPwd":pass1,"confirmPwd":pass2},
            // xhrFields:{withCredentials: true},
            success: function (res) {
                var data = res;
                if(res.success){
                    $(".change_password_error").text("修改密码成功！");
                    $("#modalChangePassword").hide();
                    $(".change_password_error").text("");

                    //调用退出按钮事件
                    $.ajax({
                        headers:{
                            "Authorization" : token
                        },
                        type: "GET",
                        timeout:300000,
                        // contentType: "application/x-www-form-urlencoded; charset=utf-8",
                        dataType: "json",
                        url: systemLogoutUrl,
                        // xhrFields:{withCredentials: true},
                        success: function (res) {
                            var data = res;
                            if(res.success){
                                //清除本地登录信息
                                $.session.clear();
                                location.href = "page/DutyLogin.html";
                            }
                        },
                        error: function (err) {
                            alert("清除Cookie失败！");
                        }
                    });

                } else {
                    $(".change_password_error").text("修改密码失败！");
                }

                // if (data.d) {
                //     $(".change_password_error").text("修改密码成功！");
                //     $("#modalChangePassword").hide();
                //     $(".change_password_error").text("");

                    
                //     $.ajax({
                //         type: "POST",
                //         contentType: "application/json; charset=utf-8",
                //         dataType: "json",
                //         url: systemLogoutUrl,
                //         success: function (data) {
                //             location.href = "page/DutyLogin.html";
                //         },
                //         error: function (err) {
                //             alert("清除Cookie失败！");
                //         }
                //     });
                // } else {
                //     $(".change_password_error").text("修改密码失败！");
                // }
            },
            error: function (err) {
                $(".change_password_error").text("修改密码失败！");
            }
        });
    });
    
    //关闭修改密码
    $(".img-close,.btn-close").click(function () {
        $("#modalChangePassword").hide();
    });
});