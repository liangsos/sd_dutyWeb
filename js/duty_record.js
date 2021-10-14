$(function () {
    //token
    // var token = $.session.get("sessionId");
    var token = $.cookie('sessionId');
    //addvcd
    // var addvcd = $.session.get("addvcd");
    var addvcd = $.cookie('addvcd');
    //登陆人员
    var _duty_user_name = $.session.get("userName");
    //值班真实姓名
    // var _duty_name = $.session.get("realName");
    var _duty_name = $.cookie('realName');
    //值班角色
    // var _duty_role = $.session.get("roleId");
    var _duty_role = $.cookie('roleId');
    //当天是否有记录
    var _is_have_today = null;
    //交接班标志 1今天不值班 2今天值班未接班(主班) 3今天值班未接班（副班） 4已接班
    var _type_work;
    //调班标志  1今天不值班 2今天值班
    var _type_exchange;
    //当前是否允许调班 0否1是
    // var _is_allow_exchange = $("#_hid_is_allow_exchange").val();
    //是否在值班室 0否1是
    // var _is_ip = $("#_hid_is_ip").val();
    //值班记录ID-今天
    var _duty_id_today;
    //今天的值班人员
    var _duty_member;
    //今天的带班
    var _duty_leader = $("#_hid_duty_leader").val();
    //日期-今天
    var _duty_time_today;
    //调班 是否为主班副班互调
    var _duty_exchange_zfb = "";

    //获取当前值班人员
    $.ajax({
        headers:{
            "Authorization" : token
        },
        type: "GET",
        dataType: "json",
        url: baseUrl + "getDutyToday",
        // xhrFields:{withCredentials: true},
        success: function (res) {
            if(res.success){
                var _duty_today = res.data;
                sessionStorage.setItem("duty_today", _duty_today);
                window.parent.updLoginUser(_duty_name, _duty_today);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });

    //查询今天是否有值班记录
    _duty_time_today = getNowFormatDate();
    $.ajax({
        headers:{
            "Authorization" : token
        },
        type: "post",
        dataType: "json",
        data:{time:_duty_time_today},
        async: false,
        url: baseUrl + "dutyRecordUser/getDutyRecordToday",
        // xhrFields:{withCredentials: true},
        success: function (res) {
            if(res.success){
                var data = res.data;
                if (data.length > 0){
                    _is_have_today = "1";
                    _duty_id_today = data[0].id;
                    _duty_member = data[0].member;
                    //调班标志
                    if(_duty_member.indexOf(_duty_name) > -1){
                        _type_exchange = "2";
                    }else{
                        _type_exchange = "1";
                    }
                    //交接班标志
                    if(_duty_member.indexOf(_duty_name) <= -1){
                        _type_work = "1";
                    }else{
                        if(data[0].duty == "1"){
                            _type_work = "4"
                        }else{
                            if(_duty_member.split(',')[0] == _duty_name){
                                _type_work = "2";
                            }else{
                                _type_work = "3";
                            }
                        }
                    }
                }else{
                    _is_have_today = "0";
                    _type_exchange = "";
                    _type_work = "1";
                }
            }
        },
        error: function (err) {
            console.log(err);
        }
    });


    //修改网页标题
    $("title").html(_system_name + $("title").html());
    //交换班按钮控制
    if (_is_have_today == "0") {
        $("#errorInfo").text(_duty_role == "1" ? "今日无值班记录,请排班！" : "今日无值班记录,请联系管理员进行排班！");
        $(".btnWorkExchange").hide();
    } else {
        //调班 允许当天非值班人员调班或者副班与主班对调
        initExchangeBody();

        //初始化交换班按钮
        initBtnWorkExchange();
    }

    //初始化日历
    var calendar = $('#calendar').fullCalendar({
        //defaultView: 'basicWeek',
        theme: true,
        header: {
            left: 'prev title next today',
            center: '',
            right: ''
        },
        isRTL: false,
        firstDay: 1,
        weekMode: 'fixed',
        handleWindowResize: true,
        today: ["今天"],
        firstDay: 1,
        buttonText: {
            prev: '上一月',
            next: '下一月'
        },
        //指定默认的列格式
        columnFormat: {
            month: 'dddd',
            week: 'dddd M-d',
            day: 'dddd M-d'
        },
        //标题格式化
        titleFormat: {
            month: 'yyyy年 M月',
            week: "[yyyy年] M月d日 { '&#8212;' [yyyy年] M月d日}",
            day: 'yyyy年 M月d日'
        },
        height: $(window).height() - 20,
        //width: ($(window).height() - 35)*1.2,
        //aspectRatio: 1.2,
        editable: false,   //不可拖动
        selectable: true,
        selectHelper: true,
        /**
         * 绑定数据源（根据时间查询值班记录）
         **/
        viewDisplay: function (view) {
            //短日期view.start view.end 长日期取 view.visStart view.visEnd
            var viewStart = $.fullCalendar.formatDate(view.start, "yyyy-MM-dd");
            var viewEnd = $.fullCalendar.formatDate(view.end, "yyyy-MM-dd");
            $("#calendar").fullCalendar('removeEvents');

            $.ajax({
                headers:{
                    "Authorization" : token
                },
                type: "get",
                // contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: baseUrl+"dutyRecord/getDutyRecord",
                data: "beginTime=" + viewStart + "&endTime=" + viewEnd,
                success: function (data) {
                    $.each(data.data, function (index, obj) {
                        $("#calendar").fullCalendar('renderEvent', obj, true);
                    });
                },
                error: function (err) {
                    alert("获取值班记录出错！" + err);
                }
            });
        },
        /**
         * 数据绑定后，自定义日历显示格式
         **/
        eventAfterRender: function (event, element, view) {
            //var fstart = $.fullCalendar.formatDate(event.start, "HH:mm");
            if (view.name == "month") {//按月份
                //主界面显示已经值班的电话 传真信息----dd hy hzx 2018-05-16
                var temp = '<div class="fc-event-vert">';
                if (event.duty == "1") {
                    if (event.tel != "" && parseInt(event.tel) > 0) {
                        temp += '<span class="fc-event-titlebg">电话：' + event.tel + '条</span></br>';
                    }
                    // if (event.fax != "" && parseInt(event.fax) > 0) {
                    //     temp += '<span class="fc-event-titlebg">传真：' + event.fax + '条</span>';
                    // }
                }
                temp += '</div>';
                element.html(temp);
                //主界面不显示值班人员 邱主任
                //var zb = "";
                //var fb = "";
                //if (event.member != "" && event.member.indexOf(",")>-1)
                //{
                //    zb = event.member.split(",")[0];
                //    fb = event.member.replace(zb, "").substr(1, event.member.length-1);
                //}
                //var temp = '<div class="fc-event-vert">';
                //temp += '<span class="fc-event-titlebg">主班：' + zb + '</span></br>';
                //temp += '<span class="fc-event-titlebg">副班：' + fb + '</span></div>';
                //element.html(temp);
            }
        },

        /**
         * 点击日期事件
         **/
        dayClick: function (date, allDay, jsEvent, view) {
            showDuty($.fullCalendar.formatDate(date, "yyyy-MM-dd"));
            return;
        },
        eventClick: function (event) {
            showDuty($.fullCalendar.formatDate(event.start, "yyyy-MM-dd"));
            return;
        },
        events: []
    });

    //获取值班人员下拉列表
    bindList("3", "listMemberWork");

    //下拉多选组件
    $('.selectpicker').selectpicker({
        style: 'btn-default',
        deselectAllText: "全不选",
        selectAllText: "全选",
        actionsBox: true,                 //全选、反选开启标志                
        //maxOptions: 2,                  //允许选择几条记录
        multipleSeparator: ","            //分隔符 
        //header:"",                      //新增头部标题
        //liveSearch:true,                //选择最上部添加查询框 自动查询
    });

    //交接班-值班人员
    if(_duty_member != null){
        $("#listMemberWork").selectpicker("val", _duty_member.split(','));
    }

    /**
     * 交换班(原交接班和调班功能的合并)
     **/
    $(".btnWorkExchange").click(function () {
        //接班
        if (_type_work == "2") {
            $("#errorWork").text("");
            $("#modalDutyWork").modal("show");
        } else {
            //调班
            $("#errorExchange").text("");
            $("#modalDutyExc").modal({ backdrop: 'static', keyboard: false, show: true });
        }
    });

    /**
     * 交接班确认按钮事件
     * 主班在此时可以修改值班人员 但是修改后当前登陆人员要保留
     **/
    $(".btnDutyWorkSave").click(function () {
        //验证登陆人员是否保留
        var memberWork = new Array($("#listMemberWork").selectpicker('val_title')).join(",");
        if (memberWork == "") {
            $("#errorWork").text("请选择值班人员！");
            return;
        }
        if (memberWork.indexOf(_duty_name) <= -1) {
            $("#errorWork").text("值班人员未包含" + _duty_name + ",请修改！");
            return;
        }

        $("#errorWork").text("交接班中，请稍后...");

        var res = post_webservice_par(token,{today:_duty_time_today,member:memberWork,member_old:_duty_member}, baseUrl + "dutyRecord/handOver")
        // var arr = res.split(';');
        if (res > 0) {
            $("#errorWork").text("交接班成功！");
            //修改最上部的今日值班
            window.parent.updDutyToday("今日值班：" + memberWork);
            _type_work = "4";
            //交换班按钮隐藏
            $(".btnWorkExchange").hide();
            //更新日历
            $('#calendar').fullCalendar('removeEvents', _duty_id_today);
            var arrNew = post_webservice_par(token,{time:_duty_time_today }, baseUrl + "dutyRecordUser/getDutyRecordToday");
            $('#calendar').fullCalendar('renderEvent', arrNew[0], true);
        } else {
            $("#errorWork").text("交接班失败！" + arr[1]);
            return;
        }
    });

    /**
     * 换班保存按钮事件
     **/
    $(".btnExchangeSave").click(function () {
        var exchangeVal = "";
        var type = "";
        if ($(this).text() == "确认") {
            exchangeVal = $('#modalDutyExc .modal-body input:radio:checked').val();
            if (exchangeVal == "") {
                $("#errorExchange").text("请选择值班人员！");
                return;
            }
        } else {
            type = "1";
            exchangeVal = _duty_member.replace(_duty_member.split(",")[0], "PPP").replace(_duty_name, _duty_member.split(",")[0]).replace("PPP", _duty_name);
        }

        //换班
        var res = post_webservice_par(token,{members:_duty_member,exchangeVal:exchangeVal,type:type,today:_duty_time_today},baseUrl + "dutyRecord/dutyExchange");
        // var arr = res.split(';');
        if (res > 0) {
            $("#errorExchange").text("换班成功！");
            $("#modalDutyExc").modal("hide");

            //更新日历 先删除原先事件
            $('#calendar').fullCalendar('removeEvents', _duty_id_today);
            var arrNew = post_webservice_par(token,{time:_duty_time_today }, baseUrl + "dutyRecordUser/getDutyRecordToday");
            $('#calendar').fullCalendar('renderEvent', arrNew[0], true);
            //获取最新的交接班标志
            var new_type_work = post_webservice_par(token,{id:_duty_id_today}, baseUrl + "dutyRecord/getTypeWorkNew");
            _type_work = new_type_work;
            //当前是否允许调班-获取最新
            // getAllowExchange();
            //值班标志
            _type_exchange = "2";
            //最新的值班人员
            _duty_member = arrNew[0]["member"];
            //修改最上部的今日值班
            window.parent.updDutyToday("今日值班：" + _duty_member + (_type_work=="4"?"":"(未接班)"));
            $("#listMemberWork").selectpicker("val", _duty_member.split(','));
            //重置换班界面
            initExchangeBody();
            //重置交换班按钮
            initBtnWorkExchange();
        } 
        // else if (arr[0] == "2") {
        //     $("#modalDutyExc").modal("hide");
        //     $("#errorExchange").text("超过普通值班人员换班时间！");

        //     //当前是否允许调班-获取最新
        //     // getAllowExchange();
        //     //重置交换班按钮
        //     initBtnWorkExchange();
        // } 
        else {
            $("#errorExchange").text("换班失败！" + arr[1]);
            return;
        }
    });

    /**
     * 弹出值班记录
     **/
    function showDuty(date) {
        //ext弹出子窗体
        sessionStorage.setItem("duty_date", date);
        window.parent.fnOpenTab("值班记录" + $.format.date(date + " 00:00:00", "MMdd"), "page/DutyRecordInfo.html?date=" + date);
        //window.open("DutyRecordInfo.aspx?date=" + date, "_blank");
    }

    /**
     * 多选下拉列表绑定
     **/
    function bindList(type, id) {
        var tempType = "";

        // var colType = "";
        // $.ajax({
        //     headers:{
        //         "Authorization" : token
        //     },
        //     type: "post",
        //     url : baseUrl + "dutyRecordUser/getUserByType",
        //     data: "type="+type,
        //     success: function (data) {
        //         colType = data;
        //         // console.log(data);
               
        //     }
        // });
        // var colType = jQuery.parseJSON(post_webservice_json("{'type':'" + type + "'}", "DutyRecord.aspx/getUserByType"));
        var colType = post_webservice_par(token,{type:type,addvcd:addvcd}, baseUrl + "dutyRecordUser/getUserByType");
        $.each(colType, function (index, obj) {
            tempType += "<option value='" + obj["realName"] + "'>" + obj["realName"] + "</option>";
        });
        $("#" + id + "").append(tempType);
        
    }

    /**
     * 当前是否允许调班-获取最新
     **/
    // function getAllowExchange() {
    //     _is_allow_exchange = post_webservice("DutyRecord.aspx/getAllowExchange");
    // }

    /**
     * 初始化交换班按钮
     **/
    function initBtnWorkExchange() {
        // if (_is_ip == "1" && _is_allow_exchange == "1" && (_type_work == "2" || (_type_work != "4" && (_type_exchange == "1" || _duty_exchange_zfb == "1")))) 
        if( _type_work == "2" || (_type_work != "4" && (_type_exchange == "1" || _duty_exchange_zfb == "1"))){
            $(".btnWorkExchange").show();
        } else {
            $(".btnWorkExchange").hide();
        }
    }

    /**
     * 初始化调班界面
     **/
    function initExchangeBody() {
        //是否为值班副班
        _duty_exchange_zfb = "";
        if (_type_exchange == "2") {
            if (_duty_member.split(',')[0] != _duty_name) {
                _duty_exchange_zfb = "1";
            }
        }

        //获取今天的值班人员列表 供调班用
        $("#modalDutyExc .modal-body").empty();
        if (_duty_exchange_zfb == "1") {
            var arrMember = _duty_member.split(',');
            var tempExchange = "<label class='control-label' style='color: blue'>值班人员信息</label>";
            for (var i = 0; i < arrMember.length; i++) {
                if (arrMember[i] == "")
                    continue;

                if (i == 0) {
                    tempExchange += "<div><label class='control-label'>" + arrMember[i] + "  ----（主班）" + "</label></div>";
                } else {
                    tempExchange += "<div><label class='control-label'>" + arrMember[i] + "</label></div>";
                }
            }
            $("#modalDutyExc .modal-body").append(tempExchange);
            $(".btnExchangeSave").text("调为主班");
        } else {
            var arrMember = null;
            if(_duty_member != ""){
                var arrMember = _duty_member.split(',');
            }
            var tempExchange = "<label class='control-label' style='color: blue'>请选择被替换的人员。</label>";
            for (var i = 0; i < arrMember.length; i++) {
                if (arrMember[i] == "")
                    continue;

                if (i == 0) {
                    tempExchange += "<div class='radio'><label><input type='radio' name='radioExchange' value='" + arrMember[i] + "'>" + arrMember[i] + "  ----（主班）" + "</label></div>";
                } else {
                    tempExchange += "<div class='radio'><label><input type='radio' name='radioExchange' value='" + arrMember[i] + "'>" + arrMember[i] + "</label></div>";
                }
            }
            $("#modalDutyExc .modal-body").append(tempExchange);
            $(".btnExchangeSave").text("确认");
        }
    }

});

//获取当前值班人员
function getDutyToday(){
    $.ajax({
        headers:{
            "Authorization" : token
        },
        type: "GET",
        dataType: "json",
        url: baseUrl + "getDutyToday",
        xhrFields:{withCredentials: true},
        success: function (res) {
            if(res.success){
                return res.data;
            }
        },
        error: function (err) {
            console.error(err);
        }
    });
}

//系统当前日期
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
