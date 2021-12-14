var tables = null;
var arrList = new Array();
//带班领导行索引最小值
var index_db = -1;
$(function () {
    //登陆人员行政编码
    var addvcd = $.session.get("addvcd");
    //登陆人员用户名
    var _duty_user_name = $.session.get("userName");
    //登陆人姓名
    var _duty_name = $.session.get("realName");
    //值班角色
    var _duty_role = $.session.get("roleId");
    //token
    var token = $.session.get("sessionId");
    //日期-今天
    var _duty_time_today = $.session.get("_duty_time_today");
    //是否为今天的带班
    var _duty_role_db = $.session.get("_duty_role_db");
    //登陆人员
    // var _duty_user_name = $("#_hid_duty_user_name").val();
    //值班角色
    // var _duty_role = $("#_hid_duty_role").val();
    //日期-今天
    // var _duty_time_today = $("#_hid_duty_time_today").val();
    //是否为今天的带班
    // var _duty_role_db = $("#_hid_duty_role_db").val();

    //获取当前值班人员
    // $.ajax({
    //     headers:{
    //         "Authorization" : token
    //     },
    //     type: "GET",
    //     dataType: "json",
    //     url: baseUrl + "getDutyToday",
    //     xhrFields:{withCredentials: true},
    //     success: function (res) {
    //         if(res.success){
    //             var _duty_today = res.data;
    //             window.parent.updLoginUser(_duty_name, _duty_today);
    //         }
    //     },
    //     error: function (err) {
    //         console.log(err);
    //     }
    // });

    //当前值班记录的ID
    var selectId = "";
    //日历的宽高
    var calendar_width = $(window).width();
    var calendar_height = $(window).height();
    if (calendar_height < (770-43)) {
        calendar_height = (770-43) * (calendar_width < 1220 ? 1024 / calendar_width : 1) - 20;
    } else {               //43为 Tab导航的高度
        calendar_height = calendar_height - 20 - 43;
    }    
    //修改网页标题
    $("title").html(_system_name + $("title").html());

    //编辑值班人员按钮 只有当天的带班和管理员可见
    if (_duty_role == "1" || _duty_role_db == "1") {
        $(".btnDutyUser").show();
    } else {
        $(".btnDutyUser").hide();
    }

    //批量导入按钮只有管理员可见
    if (_duty_role == "1") {
        $(".btnExportIn,.btnExportOut").show();
    } else {
        $(".btnExportIn,.btnExportOut").hide();
    }

    //初始化排班表-日历
    var calendar = $('#calendar').fullCalendar({
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
        height: calendar_height,
        //width: calendar_width,
        //aspectRatio: 2,
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
                type: "POST",
                // contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: baseUrl + "dutyRecordUser/getDutyRecordPlan",
                data: {beginTime:viewStart,endTime:viewEnd},
                // xhrFields:{withCredentials: true},
                success: function (data) {
                    var resultCollection = data.data;
                    $.each(resultCollection, function (index, obj) {
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
                var temp = '<div class="fc-event-vert">';
                temp += '<span class="fc-event-titlebg">局&nbsp;领&nbsp;&nbsp;导：' + event.leaderComm + '</span></br>';
                temp += '<span class="fc-event-titlebg">带&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;班：' + event.leader + '</span></br>';
                temp += '<span class="fc-event-titlebg">值班人员：' + event.member + '</span></div>';
                element.html(temp);
            }
        },

        /**
         * 点击日期事件
         **/
        dayClick: function (date, allDay, jsEvent, view) {
            return;
        },
        eventClick: function (event) {
            return;
        },
        events: []
    });

    //值班表-日历控件
    var calendar_record = $('#calendar_record').fullCalendar({
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
        height: calendar_height,
        //width: calendar_width,
        //aspectRatio: 2,
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
            $("#calendar_record").fullCalendar('removeEvents');

            $.ajax({
                headers:{
                    "Authorization" : token
                },
                type: "POST",
                // contentType: "application/json; charset=utf-8",
                dataType: "json",
                url: baseUrl + "dutyRecordUser/getDutyRecord",
                data: {beginTime:viewStart,endTime:viewEnd},
                success: function (data) {
                    var resultCollection = data.data
                    $.each(resultCollection, function (index, obj) {
                        $("#calendar_record").fullCalendar('renderEvent', obj, true);
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
            //只显示已经交接班的数据
            if (event.duty == "1" && view.name == "month") {//按月份
                var temp = '<div class="fc-event-vert">';
                temp += '<span class="fc-event-titlebg">局&nbsp;领&nbsp;&nbsp;导：' + event.leaderComm + '</span></br>';
                temp += '<span class="fc-event-titlebg">带&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;班：' + event.leader + '</span></br>';
                temp += '<span class="fc-event-titlebg">值班人员：' + event.member + '</span></div>';
                element.html(temp);
            }
        },

        /**
         * 点击日期事件
         **/
        dayClick: function (date, allDay, jsEvent, view) {
            return;
        },
        eventClick: function (event) {
            return;
        },
        events: []
    });


    //获取委领导下拉列表
    bindList("1", "listLeaderComm");
    //获取带班下拉列表
    bindList("2", "listLeader");
    //获取值班人员下拉列表
    bindList("3", "listMember");

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

    $(".date_change").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        weekStart: 1,
        autoclose: true,
        startView: 2,
        todayBtn: true,
        todayHighlight: true,
        minView: 2,
        forceParse: false
    }).on('changeDate', function (e) {
        //编辑值班人员中的日期改变事件 动态获取当天的值班记录
        initDutyUser();
    });

    var _record_show = false;
    /**
    * Nav切换时 强制显示值班表
    **/
    $("#linkRecord").on('shown.bs.tab', function (e) {
        if (!_record_show) {
            $("#calendar_record").fullCalendar('render');
            _record_show = true;
        }
    });

    /**
    * 编辑值班人员（带班修改 管理员可修改可新增）
    **/
    $(".btnDutyUser").click(function () {
        //默认设置
        $("#errorDutyUser").text("");
        $("#txtDutyDate").val(_duty_time_today);

        //初始化权限控制
        initDutyUserRole();
        //初始化值班人员情况
        initDutyUser();

        $("#modalDutyUser").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
    * 值班人员保存
    **/
    $(".btnDutyUserSave").click(function () {
        //获取最新的下拉列表值
        var leaderComm = new Array($("#listLeaderComm").selectpicker('val_title')).join(",");
        var leader = new Array($("#listLeader").selectpicker('val_title')).join(",");
        var member = new Array($("#listMember").selectpicker('val_title')).join(",");
        var comments = $("#txtComments").val();

        //验证数据
        if (leaderComm == "") {
            $("#errorDutyUser").text("请选择局领导！");
            return;
        }
        if (leader == "") {
            $("#errorDutyUser").text("请选择带班！");
            return;
        }
        if (member == "") {
            $("#errorDutyUser").text("请选择值班人员！");
            return;
        }
        if ($("#listMember").selectpicker('val').length < 2) {
            $("#errorDutyUser").text("值班人员不得少于2人！");
            return;
        }

        var data = { id: selectId, time: $("#txtDutyDate").val(), leaderComm: leaderComm, leader: leader, member: member, comments: comments };
        var resRecord = post_webservice_json_new(token,JSON.stringify(data),baseUrl + "dutyRecordUser/saveDutyRecord");
        // var arrRecord = resRecord.split(';');
        if (resRecord >= 0) {
            $("#errorDutyUser").text("保存值班人员成功！");
            //$("#modalDutyUser").hide();
            //日历清空
            if (selectId == "") {
                selectId = resRecord;
            } else {
                $('#calendar_record').fullCalendar('removeEvents', selectId);
            }

            var arrNew = post_webservice_par(token,{time: $("#txtDutyDate").val()}, baseUrl + "dutyRecordUser/getDutyRecordToday");
            $('#calendar_record').fullCalendar('renderEvent', arrNew[0], true);

            //判断是否新增今天的值班记录
            if (_duty_time_today == $("#txtDutyDate").val()) {
                $("#errorInfo").text("");
                //修改最上部的今日值班
                window.parent.updDutyToday("今日值班：" + member + ((arrNew != null && arrNew[0] != null && arrNew[0].duty == "1") ? "" : "未接班"));
            }
        } else {
            $("#errorDutyUser").text(arrRecord[1]);
            return;
        }
    });
    
    /**
    * 导出值班表
    **/
    $(".btnExportOut").click(function () {
        $("#modalExportRecord").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
    * 批量导入
    **/
    $(".btnExportIn").click(function () {
        $("#modalDutyExport").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
    * 批量导入-确定按钮
    **/
    $(".btnExportSure").click(function () {
        //校验
        var fileVal = $("#fileExport").val();
        if (fileVal == "") {
            $("#errorExport").text("请先选择文件！");
            return;
        }

        //获取文件名
        var fileName = fileVal.substring(fileVal.lastIndexOf("\\") + 1);
        if (fileVal.substring(fileName.lastIndexOf(".") + 1).indexOf("xls") <= -1) {
            $("#errorExport").text("请先选择excel文件！");
            return;
        }

        var fileObj = document.getElementById("fileExport").files[0];

        //调用ajax
        var form = new FormData();
        form.append("user", _duty_user_name);
        form.append("file", fileObj);

        // XMLHttpRequest 对象  
        var xhr = new XMLHttpRequest();
        xhr.open("post", baseUrl +"dutyRecordUser/uploadExcel", true);
        xhr.setRequestHeader('Authorization',token);
        xhr.onload = function (e) {
            var res = jQuery.parseJSON(xhr.responseText);
            // var arr = res.split(';');
            if (res.success) {
                $("#errorExport").text("批量导入成功！");

                //刷新页面
                location.reload();
            } else {
                $("#errorExport").text(arr[1]);
            }
        };
        xhr.send(form);
    });
    $("#fileExport").change(function () {
        $(".right-text").text($(this).val().substring($(this).val().lastIndexOf("\\") + 1));
    });

    /**
     * 多选下拉列表绑定
     **/
    function bindList(type, id) {
        var tempType = "";
        var colType = post_webservice_par(token,{type:type,addvcd:addvcd}, baseUrl + "dutyRecordUser/getUserByType");
        if(colType != undefined){
            $.each(colType, function (index, obj) {
                tempType += "<option value='" + obj["realName"] + "'>" + obj["realName"] + "</option>";
            });
        }
        
        $("#" + id + "").append(tempType);
    }

    /**
     * 初始化值班人员-权限
     **/
    function initDutyUserRole() {
        if (_duty_role == "1") {
            setDutyEnabled("modalDutyUser", false);
            $("#txtDutyDate").attr("readonly", true);
        }
        else if (_duty_role == "2") {
            //日期不可修改
            $("#txtDutyDate").attr("disabled", true);
            $("#spanDutyDate").hide();
            //带班可修改值班人员和备注
            var role_db = (_duty_time_today == $("#txtDutyDate").val() && _duty_role_db=="1") ? false : true;
            $("#listLeaderComm").attr("disabled", true);
            $(".dropdown-toggle[data-id='listLeaderComm']").attr("disabled", true);
            $("#listLeader").attr("disabled", true);
            $(".dropdown-toggle[data-id='listLeader']").attr("disabled", true);

            if (role_db) {
                $("#listMember").attr("disabled", role_db);
                $(".dropdown-toggle[data-id='listMember']").attr("disabled", role_db);
            } else {
                $("#listMember").removeAttr("disabled");
                $(".dropdown-toggle[data-id='listMember']").removeAttr("disabled");
            }
            $("#txtComments").attr("disabled", role_db);
        }
    }

    /**
     * 初始化值班人员-情况
     **/
    function initDutyUser() {
        var tempRecord = post_webservice_par(token,{time: $("#txtDutyDate").val()}, baseUrl + "dutyRecordUser/getDutyRecordToday");
        //有值班记录的情况
        if (tempRecord.length > 0) {
            selectId = tempRecord[0]["id"];
            $("#listLeaderComm").selectpicker("val", tempRecord[0]["leaderComm"].split(','));
            $("#listLeader").selectpicker("val", tempRecord[0]["leader"].split(','));
            $("#listMember").selectpicker("val", tempRecord[0]["member"].split(','));
            $("#txtComments").val(tempRecord[0]["comments"]);
        } else {
            //无值班记录的情况
            selectId = "";
            $("#listLeaderComm").selectpicker("val", "");
            $("#listLeader").selectpicker("val", "");
            $("#listMember").selectpicker("val", "");
            $("#txtComments").val("");

            //只有管理员可新增
            if (_duty_role == "1") {
                $(".btnDutyUserSave").attr("disabled", false);
                $("#errorDutyUser").text("管理员可新增值班人员。");
            } else {
                $(".btnDutyUserSave").attr("disabled", true);
            }
        }
    }

    /**
     * 设置值班记录、防汛抗旱工作、来电记录是否可编辑
     **/
    function setDutyEnabled(content, flag) {
        $("#" + content + " select").attr("disabled", flag);
        $("#" + content + " input,#" + content + " textarea").attr("readonly", flag);
    }

    /**
     * 值班表导出
     */
    $("#btnExportDetail").click(function (){
        var beginTime = $("#txtBeginRecord").val();
        var endTiem = $("#txtEndRecord").val();

        $.ajax({
            headers:{
                "Authorization" : token
            },
            type: "POST",
            // contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: baseUrl + "dutyRecordUser/exportDutyExcel",
            data: {beginTime:beginTime,endTime:endTiem},
            success: function (res) {
                if(res.success){
                    var downloadUrl = res.data;
                    downloadFile(downloadUrl);
                }
            },
            error: function (err) {
                alert("导出值班表出错！" + err);
            }
    });

    })


    ///////////////////////////////////////////////////值班统计////////////////////////////////////////////
    // var tables = null;
    
    //默认查询时间
    var nowdays = new Date();
    var year = nowdays.getFullYear();
    var month = nowdays.getMonth();
    if (month == 0) {
        month = 12;
        year = year - 1;
    }
    if (month < 10) {
        month = "0" + month;
    }
    $("#txtBegin").val(year + "-" + month + "-" + "01");
    $("#txtEnd").val($.format.date(new Date(), "yyyy-MM-dd"));
    $("#txtBeginRecord").val(year + "-" + month + "-" + "01");
    $("#txtEndRecord").val($.format.date(new Date(), "yyyy-MM-dd"));
    //日期控件初始化
    initDatePicker('.form_date', "yyyy-mm-dd", 2);

    /**
     * 导出Excel事件
     **/
    $("#btnExport").click(function () {
        $('.DTTT_button_xls').click();
    });

    /**
     * 查询按钮事件
     **/
    $("#btnSearch").click(function () {
        //校验时间
        var beginTime = $("#txtBegin").val();
        var endTime = $("#txtEnd").val();
        var bTime = new Date(beginTime);
        var eTime = new Date(endTime);
        if(bTime.getTime() > eTime.getTime()){
            layer.msg('开始时间不能大于结束时间！', {
                icon: 5
            });
            return;
        }

        $(".duty_loading").show();

        $.ajax({
            headers:{
                "Authorization" : token
            },
            type: "POST",
            // contentType: "application/json; charset=utf-8",
            dataType: "json",
            url: baseUrl + "dutyRecordUser/getDutyTj",
            data: {"beginTime":beginTime,"endTime":endTime},
            success: function (res) {
                if (res.success) {
                    //隐藏域保存
                    $("#hid_begin_time_tj").val(beginTime);
                    $("#hid_end_time_tj").val(endTime);

                    //清空原先数据
                    if (tables != null) {
                        tables.fnClearTable();
                        tables.fnDestroy();
                        // tables.clear(); //清空一下table
                        // tables.destroy(); //还原初始化了的dataTable
                    }

                    //修改数据源格式
                    //带班领导行索引最小值
                    // var index_db = -1;
                    arrList = [];
                    for (var i = 0; i < res.data.length; i++) {
                        var temp_arr = new Array();
                        var temp_arr_deault = new Array();
                        var temp_index = 0;
                        for (obj in res.data[i]) {
                            if (obj != "角色") {
                                temp_arr[temp_index] = res.data[i][obj];
                                temp_index += 1;
                            }                            
                        }

                        //获取带班索引
                        if (res.data[i]["角色"] != "3" && index_db == -1) {
                            index_db = i;
                        }

                        arrList.push(temp_arr);
                    }

                    //绘制table表头
                    $("#countTable").remove();
                    var objFirst = res.data[0];
                    var arr = new Array();
                    var html = "<table id='countTable' class='table table-hover btn-table'><thead><tr role='row'>";

                    for (var item in objFirst) {
                        //表头隐藏角色
                        if (item == "角色")
                            continue;

                        html += "<th class='table-header'>" + item + "</th>";
                        var o = new Object();
                        o.title = item;
                        arr.push(o);
                    }
                    html += "</tr></thead></table>";
                    $(".duty_count_page").append(html);
                    
                    createTable();

                    // $("#dutyTjSearch").append(tables.buttons().container());

                    //$('.DTTT_button_xls').addClass("btn btn-info btn-color");
                    $(".duty_loading").hide();
                }
            },
            error: function (err) {
                alert("获取值班统计信息失败！");
            }
        });

    });
});

//JS端 导出按钮验证数据
function btnExportCheck() {
    if ($("#txtBeginRecord").val() == "") {
        $("#error").text("开始时间不能为空！");
        return false;
    }
    if ($("#txtEndRecord").val() == "") {
        $("#error").text("开始时间不能为空！");
        return false;
    }
    if (new Date($("#txtBeginRecord").val()) > new Date($("#txtEndRecord").val())) {
        $("#error").text("开始时间不能大于结束时间！");
        return false;
    }

    $("#_hid_begin_time").val($("#txtBeginRecord").val());
    $("#_hid_end_time").val($("#txtEndRecord").val());
    return true;
}

//JS端 导出统计表按钮验证数据
function btnExportTjbCheck() {
    if ($("#hid_begin_time_tj").val() == "") {
        alert("请先查询数据！");
        return false;
    }

    return true;
}

function createTable(){

    //清空原先数据
    // if (tables != null) {
    //     tables.fnClearTable();
    //     tables.fnDestroy();
    // }

    tables = $('#countTable').dataTable({
        "bProcessing": true,             //加载数据时，是否显示‘进度’提示
        //"sScrollY": "100%",              //高度
        //"sScrollX": "100%",              //宽度
        "bScrollCollapse": true,         //是否开启DataTables的高度自适应，当数据条数不够分页数据条数的时候，插件高度是否随数据条数而改变  
        "bPaginate": false,               //是否显示分页器
        "bLengthChange": false,
        "bFilter": false,                //是否启动过滤、搜索功能
        "bSort": false,                   //是否启动各个字段的排序功能
        "bInfo": true,                   //是否显示页脚信息，DataTables插件左下角显示记录数
        //"bAutoWidth": true,              //是否自适应宽度
        "bStateSave": false,              //是否打开客户端状态记录功能,此功能在ajax刷新纪录的时候不会将个性化设定回复为初始化状态
        "sPaginationType": "full_numbers", //详细分页组，可以支持直接跳转到某页 默认two_button
        "bJQueryUI": false,               //是否使用 jQury的UI them
        //"sDom": '<"top"i>rt<"bottom"flp><"clear">',  //修改表单各元素显示位置
        //详细说明 l-每页数量选择select;f-搜索框search;t-表单内容table;i-当前条数/总共条数information
        //p-翻页按钮pagination ;r-请求中的提示信息 ;< 和 >一个div的开始与结束 ;<"class"> 为div的class名称
        // "buttons": [
        //     {
        //         extend: 'excel',
        //         text: '导出Excel',
        //         className: 'btn btn-info btn-color'
        //     }],
        "aaData": arrList,//jQuery.parseJSON(data.d),
        // "destroy":true,
        "oLanguage": { //国际化配置  
            "sProcessing": "<img src='../Img/loading.gif'/>",
            "sLengthMenu": "每页显示 _MENU_ 条",
            "sZeroRecords": "没有值班人员信息",
            "sInfo": "从 _START_ 到  _END_ 条记录 总记录数为 _TOTAL_ 条",
            "sInfoEmpty": "记录数为0",
            "sInfoFiltered": "(全部记录数 _MAX_ 条)",
            "sInfoPostFix": "",
            "sSearch": "搜索",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上一页",
                "sNext": "下一页",
                "sLast": "末页"
            }
        },
        dom: 'Bfrtip',
        "buttons": [
        {
            extend: 'excel',
            className: 'btn btn-success exportExcel',
            text: "导出excel",
            modifier: {
                selected: true
            }
        }],
        // dom: 'T<"clear">lfrtip',
        //del by hzx 自带导出excel插件不能实现带班领导加背景色处理 后台查询时自动生成
        //tableTools: {
        //    "sSwfPath": "../Scripts/jquery-dataTables/tableTools/copy_csv_xls_pdf.swf",
        //    "aButtons": [
        //       {
        //           "sExtends": "xls",
        //           "sFileName": "值班统计表.xls",
        //           "bFooter": false,
        //           //"sToolTip":"导出Excel",
        //           "sButtonText": "<span class='fa fa-download'></span>&nbsp;&nbsp;导出统计表"
        //       }]
        //},
        //绘制行之前的回调函数
        "rowCallback": function (row, data, index) {
            console.log(index_db + ":" + index);
            if (index >= index_db)
            {
                $(row).addClass('duty-count-db');
            }
        }
        
        //dom: 'Bfrtip',  <span class='halflings-icon folder-open white'></span>&nbsp;&nbsp;
        //buttons: [
        //    'colvis',
        //    'excel',
        //    'print'
        //]
        //"oTableTools": {
        //    "aButtons": [
        //    {
        //        "sExtends": "csv",
        //        "sButtonText": "导出Excel",
        //        "sCharSet": "utf8"
        //    }
        //    ]
        //}

    });
}

function downloadFile(url){
    var form=$("<form>");
      form.attr("style","display:none");
      form.attr("target","");
      form.attr("method","get"); 
     form.attr("action",url);
      $("body").append(form);
      form.submit();//表单提交
}