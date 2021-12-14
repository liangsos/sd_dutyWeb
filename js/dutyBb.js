$(function () {
    //修改网页标题
    $("title").html(_system_name + $("title").html());
    //登陆人员用户名
    var _duty_user_name = $.session.get("userName");
    //登录人角色
    var _duty_role = $.session.get("roleId");
    // var _duty_role = $.cookie('roleId');
    //token
    var token = $.session.get("sessionId");
    // var token = $.cookie('sessionId');
    //登陆人姓名
    var _duty_name = $.session.get("realName");
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
    if (_duty_role != "1")
    {
        $("#btnExport").hide();
    }

    //表格
    var table = null;
    //选择的日期
    var _time = "";
    
    //初始化查询时间  这样日期控件实际的值和界面的一样 update by hzx 2017-07-03
    $("#txtBegin").val($.format.date(new Date(), "yyyy-MM-01"));
    $("#txtEnd").val($.format.date(new Date(), "yyyy-MM-dd"));
    //日期控件初始化
    initDatePicker(".date", "yyyy-mm-dd", 2);

    /**
     * 查询按钮事件
     **/
    $("#btnSearch").click(function () {
        //校验时间
        if ($("#txtBegin").val() == "") {
            $("#error").text("开始时间不能为空！");
            return;
        }
        if ($("#txtEnd").val() == "") {
            $("#error").text("开始时间不能为空！");
            return;
        }
        if (new Date($("#txtBegin").val()) > new Date($("#txtEnd").val())) {
            $("#error").text("开始时间不能大于结束时间！");
            return;
        }

        if (table == null) {
            $(".search-bb").css("margin-bottom", "-32px");
            table = $('#detailTable').dataTable({
                "bProcessing": true,             //进度
                "bScrollCollapse": true,         //高度自适应
                "bPaginate": true,               //显示分页器
                "bLengthChange": true,           //改变每页数量
                "aLengthMenu": [10, 25, 50],     //记录数选项
                "iDisplayLength": 10,            //默认记录数
                "bFilter": false,                 //启动过滤、搜索功能
                "bSort": false,                  //是否启动各个字段的排序功能
                "bStateSave": true,              //客户端状态记录功能
                "sPaginationType": "full_numbers", //详细分页组
                "bJQueryUI": false,               //是否使用 jQury的UI them
                "aoColumns": [{
                    "mDataProp": "id",
                    "sDefaultContent": "", //此列默认值为""，以防数据中没有此值，DataTables加载数据的时候报错  
                    "bVisible": false //此列不显示  
                }, {
                    "mDataProp": "time"
                }, {
                    "mDataProp": "leaderComm"
                }, {
                    "mDataProp": "leader"
                }, {
                    "mDataProp": "member"
                }, {
                    "mDataProp": "duty"
                }, {
                    "mDataProp": "comments"
                }, {
                    "mDataProp": "",
                    "sTitle": "操作",
                    "sDefaultContent": "Edit"
                }],
                "oLanguage": {     //国际化配置  
                    "sProcessing": "<img src='../images/loading.gif'/>",
                    "sLengthMenu": "每页显示 _MENU_ 条",
                    "sZeroRecords": "没有值班记录信息",
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
                //表格的行绘制好还没有显示之前调用 添加按钮
                //nRow 当前行元素 aData当前行数据源（obj） iDisplayIndex当前行索引
                "fnRowCallback": function (nRow, aData, iDisplayIndex) {
                    var txtHtml = "<button class='btn btn-default btn_watch' type='button'><span class='fa fa-search-plus'></span></span>&nbsp;&nbsp;详细</button>&nbsp;&nbsp;";
                    $('td:eq(6)', nRow).html(txtHtml);
                    return nRow;
                },
                "bServerSide": true,             //服务器端
                "sAjaxSource": baseUrl + "dutyQuery/getDutyBb",
                //查询条件
                "fnServerParams": function (aoData) {
                    aoData.push({ "name": "search_begin_time", "value": $("#txtBegin").val() });
                    aoData.push({ "name": "search_end_time", "value": $("#txtEnd").val() });
                },
                //服务器端，数据回调处理
                "fnServerData": function (sSource, aoData, fnCallback) {
                    $.ajax({
                        headers:{
                            "Authorization" : token
                        },
                        "type": "POST",
                        "contentType": "application/json; charset=utf-8",
                        "dataType": 'json',
                        "url": sSource,
                        "data": JSON.stringify(aoData),
                        "success": function (res) {
                            var resultCollection = res.data;
                            fnCallback(resultCollection);
                        }
                    });
                }
            });
        } else {
            table.fnDraw();
        }
    });

    /**
     * 查看详细按钮
     **/
    $('#detailTable').delegate('.btn_watch ', 'click', function () {
        var aData = table.fnGetData(this.parentNode.parentNode);
        _time = aData.time;

        $.session.set("searchDate",_time);

        //打开新页
        window.parent.fnOpenTab("值班记录详细" + $.format.date(_time + " 00:00:00", "MMdd"), "page/DutyBbInfo.html?date=" + _time);
        //window.open("DutyBbInfo.aspx?date=" + _time, "_blank");

        
        // getDutyBbInfo(_time,token);

        // $.ajax({
        //     headers:{
        //         "Authorization" : token
        //     },
        //     "type": "POST",
        //     // "contentType": "application/json; charset=utf-8",
        //     "dataType": 'json',
        //     "url": baseUrl + "dutyQuery/getDutyBbInfo",
        //     "data": {date:_time},
        //     "success": function (res) {
        //         window.parent.htmlInfo(res.data);
        //     }
        // });
    });

    //自动查询
    $("#btnSearch").click();
});

//JS端 导出按钮验证数据
function btnExportCheck() {
    console.log(11111);
    if ($("#txtBegin").val() == "") {
        $("#error").text("开始时间不能为空！");
        return false;
    }
    if ($("#txtEnd").val() == "") {
        $("#error").text("开始时间不能为空！");
        return false;
    }
    if (new Date($("#txtBegin").val()) > new Date($("#txtEnd").val())) {
        $("#error").text("开始时间不能大于结束时间！");
        return false;
    }

    $("#<%=_hid_begin_time.ClientID%>").val($("#txtBegin").val());
    $("#<%=_hid_end_time.ClientID%>").val($("#txtEnd").val());
    return true;
}
