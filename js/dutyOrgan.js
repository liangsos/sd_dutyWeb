$(function () {
    //token
    var token = $.session.get("sessionId");
    //修改网页标题
    $("title").html(_system_name + $("title").html());

    var table = null;
    table = $('#organTable').dataTable({
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
            "mDataProp": "name"
        }, {
            "mDataProp": "leader"
        }, {
            "mDataProp": "comments"
        }, {
            "mDataProp": "",
            "sDefaultContent": "Edit"
        }
        ],
        "oLanguage": {     //国际化配置  
            "sProcessing": "<img src='../images/loading.gif'/>",
            "sLengthMenu": "每页显示 _MENU_ 条",
            "sZeroRecords": "无机构信息",
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
        "sAjaxSource": baseUrl + "dutyOrgan/getDutyOrgan",
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

    //ID
    var _id = "";
    //删除的ID
    var _del_id = "";
    
    /**
     * 新增按钮事件
     **/
    $("#btnAdd").click(function () {
        _id = "";
        $(".errorInfo").text("");
        $("#txtName").val("");
        $("#txtLeader").val("");
        $("#txtComments").val("");
        //现在弹出框
        $("#modalOrgan").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 保存按钮事件
     **/
    $(".btnSave").click(function () {
        var _name = $("#txtName").val();
        var _leader = $("#txtLeader").val();
        var _comments = $("#txtComments").val();

        if (_name == "") {
            $(".errorInfo").text("机构名称不能为空！");
            return;
        }

        //校验名称是否重复  
        if(_id == ""){
            var chk = post_webservice_par(token,{name:_name}, baseUrl + "dutyOrgan/checkOrgan");
            if (chk) {
                $(".errorInfo").text("机构名称已存在，请重新输入！");
                return;
            }
        }              
       

        //保存数据
        var _arr = { id: _id, name: _name,leader:_leader, comments: _comments};
        var resSave = post_webservice_json_new(token,JSON.stringify(_arr), baseUrl + "dutyOrgan/saveDutyOrgan");
        if (resSave > 0) {
            $(".errorInfo").text("机构信息保存成功！");
            if (_id == "")
                _id = resSave.toString();
            //关闭弹出框
            $("#modalOrgan").modal("hide");
            //刷新表格
            table.fnDraw(false);
        } else {
            $(".errorInfo").text("机构信息保存失败！");
            return;
        }
    });

    /**
     * 删除按钮事件
     **/
    $('#organTable tbody').on('click', 'button.btn_del', function () {
        var aData = table.fnGetData(this.parentNode.parentNode);
        _del_id = aData.id;

        $("#labDel").text("确定删除该机构？");
        $("#modalDel").modal("show");
    });

    /**
     * 删除按钮确定事件
     **/
    $(".btnDelSure").click(function () {
        var res = post_webservice_par(token,{id:_del_id},  baseUrl + "dutyOrgan/delDutyOrgan");
        if(res)
        {
            //关闭model
            $("#modalDel").modal("hide");
            //判断当前页是否只有一条数据
            var start = $("#organTable").dataTable().fnSettings()._iDisplayStart;
            var total = $("#organTable").dataTable().fnSettings().fnRecordsDisplay();
            if ((total - start) == 1) {
                $("#organTable").dataTable().fnPageChange("previous", true);
            } else {
                //刷新表格
                table.fnDraw(false);
            }
        } else {
            alert("机构信息删除失败！");
            return;
        }                
    });
    
    /**
     * 编辑按钮事件
     **/
    $('#organTable tbody').on('click', 'button.btn_edit', function () {
        $(".errorInfo").text("");
        var aData = table.fnGetData(this.parentNode.parentNode);
        _id = aData.id;

        //获取值班机构信息
        var col = post_webservice_par(token,{id:_id}, baseUrl +"dutyOrgan/getDutyOrganInfo");
        if (col.length < 1) {
            $(".errorInfo").text("获取机构信息失败！");
            return;
        }

        //赋值
        $("#txtName").val(col["name"]);
        $("#txtLeader").val(col["leader"]);
        $("#txtComments").val(col["comments"]);

        //弹出框
        $("#modalOrgan").modal({ backdrop: 'static', keyboard: false, show: true });
    });
});