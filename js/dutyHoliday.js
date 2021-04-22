$(function () {
    //token
    var token = $.session.get("sessionId");
    //修改网页标题
    $("title").html(_system_name + $("title").html());
    //当前登陆名
    var _duty_user_name = $.session.get("userName");

    //获取法定假日类型
    var colType = get_webservice(token,{type:'0101'},baseUrl + "file/GetDutyDict");
    var tempType = "";
    $.each(colType, function (index, obj) {
        tempType += "<option value='" + obj["dabh"] + "'>" + obj["daxx"] + "</option>";
    });
    $("#listType").append(tempType);

    //日期控件初始化
    $('.date').datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd",
        weekStart: 1,             //一周从哪一天开始
        autoclose: true,          //当选择一个日期之后是否立即关闭此日期时间选择器
        startView: 2,             //日期时间选择器打开之后首先显示的视图 0小时1天2月3年4大年份
        todayBtn: true,           //日历上是否有当天按钮
        todayHighlight: true,     //日历中当天是否高亮
        minView: 2,
        forceParse: false
    });

    var table = null;
    table = $('#holidayTable').dataTable({
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
            "mDataProp": "time",
            "sTitle": "日期",
            "sDefaultContent": ""
        }, {
            "mDataProp": "type",
            "sTitle": "类型",
            "sDefaultContent": ""
        }, {
            "mDataProp": "comments",
            "sTitle": "备注",
            "sDefaultContent": ""
        }, {
            "mDataProp": "",
            "sTitle": "操作",
            "sDefaultContent": ""
        }
        ],
        "oLanguage": {     //国际化配置  
            "sProcessing": "<img src='../images/loading.gif'/>",
            "sLengthMenu": "每页显示 _MENU_ 条",
            "sZeroRecords": "没有法定假日信息",
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
            var txtHtml = "<button id='btnEdit' class='btn btn-default btn_edit' type='button'><span class='fa fa-edit'></span></span>&nbsp;&nbsp;编辑</button>&nbsp;&nbsp;";
            txtHtml += "<button id='btnDel' class='btn btn-default btn_del' type='button'><span class='fa fa-trash-o'></span>&nbsp;&nbsp;删除</button>";
            $('td:eq(3)', nRow).html(txtHtml);

            return nRow;
        },
        "bServerSide": true,             //服务器端
        "sAjaxSource": baseUrl + "dutyHoliday/getDutyHoliday",
        //查询条件
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "search_year", "value": $("#txtYear").val() });
        },
        //服务器端，数据回调处理
        "fnServerData": function (sSource, aoData, fnCallback) {
            $.ajax({
                "headers":{
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

    /**
     * 查询按钮事件
     **/
    $("#btnSearch").click(function () {
        table.fnDraw();
    });

    //法定假日ID
    var _id = "";
    //删除的ID
    var _del_id = "";
    //上一次保存的日期
    var _save_date = "";

    /**
     * 新增按钮事件
     **/
    $("#btnAdd").click(function () {
        _id = "";
        $(".errorInfo").text("");
        //默认选中
        $("#listType").val("1");
        if (_save_date != "") {
            $("#txtDate").val(_save_date);
        }
        $("#txtComments").val("");
        //现在弹出框
        $("#modalHoliday").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 保存按钮事件
     **/
    $(".btnSave").click(function () {
        var _type = $("#listType").val();
        var _date = $("#txtDate").val();
        var _comments = $("#txtComments").val();

        if (_date == "") {
            $(".errorInfo").text("日期不能为空！");
            return;
        }

        //校验日期是否重复  
        if(_id == ""){
            var chk = post_webservice_par(token,{date:_date}, baseUrl + "dutyHoliday/checkHoliday");
            if (chk) {
                $(".errorInfo").text("日期已存在，请重新输入！");
                return;
            }
        }              
        

        //保存数据
        var _arr = { id: _id, type: _type, time: _date, comments: _comments, updateUser: _duty_user_name };
        var resSave = post_webservice_json_new(token,JSON.stringify(_arr), baseUrl + "dutyHoliday/saveHoliday");
        if (resSave > 0) {
            $(".errorInfo").text("法定假日保存成功！");
            if (_id == "")
                _id = resSave.toString();
            _save_date = _date;
            //关闭弹出框
            $("#modalHoliday").modal("hide");
            //刷新表格
            table.fnDraw(false);
        } else {
            $(".errorInfo").text("法定假日保存失败！");
            return;
        }
    });

    /**
     * 删除按钮事件
     **/
    $('#holidayTable tbody').on('click', 'button.btn_del', function () {
        var aData = table.fnGetData(this.parentNode.parentNode);
        _del_id = aData.id;

        $("#labDel").text("确定删除法定假【" + aData.time + "】？");
        $("#modalDel").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 删除按钮确定事件
     **/
    $(".btnDelSure").click(function () {
        var res = post_webservice_par(token,{id:_del_id}, baseUrl + "dutyHoliday/delHoliday");
        if(res)
        {
            //关闭model
            $("#modalDel").modal("hide");
            //判断当前页是否只有一条数据
            var start = $("#holidayTable").dataTable().fnSettings()._iDisplayStart;
            var total = $("#holidayTable").dataTable().fnSettings().fnRecordsDisplay();
            if ((total - start) == 1) {
                $("#holidayTable").dataTable().fnPageChange("previous", true);
            } else {
                //刷新表格
                table.fnDraw(false);
            }
        } else {
            alert("法定假日删除失败！");
            return;
        }                
    });
    
    /**
     * 编辑按钮事件
     **/
    $('#holidayTable tbody').on('click', 'button.btn_edit', function () {
        $(".errorInfo").text("");
        var aData = table.fnGetData(this.parentNode.parentNode);
        _id = aData.id;

        //获取法定假信息
        var col = post_webservice_par(token,{id:_id}, baseUrl + "dutyHoliday/getHolidayInfo");
        if (col.length < 1) {
            $(".errorInfo").text("获取法定假信息失败！");
            return;
        }
        
        //赋值
        $("#listType").val(col["type"]);
        $("#txtDate").val($.format.date(new Date(Date.parse(col["time"].replace(/-/g, "/"))), "yyyy-MM-dd"));
        //根据文本内的值更新日期时间选择器
        $('.date').datetimepicker('update');
        $("#txtComments").val(col["comments"]);

        //弹出框
        $("#modalHoliday").modal({ backdrop: 'static', keyboard: false, show: true });
    });
});