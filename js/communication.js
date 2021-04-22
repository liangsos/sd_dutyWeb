$(function () {
    //token
    var token = $.session.get("sessionId");

    var table = null;
    table = $('#commTable').dataTable({
        "bProcessing": true,             //进度
        "bScrollCollapse": true,         //高度自适应
        "bPaginate": false,               //显示分页器
        "bLengthChange": false,           //改变每页数量
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
            "mDataProp": "unit"
        },{
            "mDataProp": "position"
        }, {
            "mDataProp": "tel"
        }, {
            "mDataProp": "phone"
        }, {
            "mDataProp": "dutyTel"
        }, {
            "mDataProp": "sort"
        }, {
            "mDataProp": "",
            "sDefaultContent": "Edit"
        }
        ],
        "oLanguage": {     //国际化配置  
            "sProcessing": "<img src='../images/loading.gif'/>",
            "sLengthMenu": "每页显示 _MENU_ 条",
            "sZeroRecords": "无水情人员信息",
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
            var txtHtml = "<button class='btn btn-default btn_edit' type='button'><span class='fa fa-edit'></span></span>&nbsp;&nbsp;编辑</button>&nbsp;&nbsp;";
            txtHtml += "<button class='btn btn-default btn_del' type='button'><span class='fa fa-trash-o'></span>&nbsp;&nbsp;删除</button>&nbsp;&nbsp;";
            $('td:eq(7)', nRow).html(txtHtml);

            return nRow;
        },
        "bServerSide": true,             //服务器端
        "sAjaxSource": baseUrl + "communication/getCommunication",
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
        // $(".div-pass").hide();
        $(".errorInfo").text("");
        $("#name").val("");
        // $("#password").val("");
        $("#unit").val("");
        $("#position").val("");
        $("#tel").val("");
        $("#phone").val("");
        $("#dutyTel").val("");
        $("#txtSort").val("");
        //现在弹出框
        $("#modalUser").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 保存按钮事件
     **/
    $(".btnSave").click(function () {
        var name = $("#name").val();
        // var password = $("#password").val();
        // password = "123456";
        var unit = $("#unit").val();
        var position = $("#position").val();
        var tel = $("#tel").val();
        var phone = $("#phone").val();
        var dutyTel = $("#dutyTel").val();
        var sort = $("#txtSort").val();

        if (name == "") {
            $(".errorInfo").text("用户名不能为空！");
            return;
        }
        if (unit == "") {
            $(".errorInfo").text("单位不能为空！");
            return;
        }              
        
        //保存数据
        var _arr = { id: _id, name: name,unit: unit,  position: position,tel: tel, phone: phone, dutyTel: dutyTel, sort: sort };
        var resSave = post_webservice_json_new(token,JSON.stringify(_arr) , baseUrl + "communication/saveCommunication");
        if (resSave > 0) {
            $(".errorInfo").text("新增人员保存成功！");
            if (_id == "")
                _id = resSave.toString();
            //关闭弹出框
            $("#modalUser").modal("hide");
            //刷新表格
            table.fnDraw(false);
        } else {
            $(".errorInfo").text("新增人员保存失败！");
            return;
        }
    });

    /**
     * 删除按钮事件
     **/
    $('#commTable tbody').on('click', 'button.btn_del', function () {
        var aData = table.fnGetData(this.parentNode.parentNode);
        _del_id = aData.id;

        $("#labDel").text("确定删除该水情人员？");
        $("#modalDel").modal("show");
    });

    /**
     * 删除按钮确定事件
     **/
    $(".btnDelSure").click(function () {
        var res = post_webservice_par(token,{id:_del_id},baseUrl + "communication/delCommunication");
        if (res) {
            //关闭model
            $("#modalDel").modal("hide");
            //判断当前页是否只有一条数据
            var start = $("#commTable").dataTable().fnSettings()._iDisplayStart;
            var total = $("#commTable").dataTable().fnSettings().fnRecordsDisplay();
            if ((total - start) == 1) {
                $("#commTable").dataTable().fnPageChange("previous", true);
            } else {
                //刷新表格
                table.fnDraw(false);
            }
        } else {
            alert("水情人员删除失败！");
            return;
        }
    });

    /**
     * 编辑按钮事件
     **/
    $('#commTable tbody').on('click', 'button.btn_edit', function () {
        $(".errorInfo").text("");
        var aData = table.fnGetData(this.parentNode.parentNode);
        _id = aData.id;

        //获取通讯录人员信息
        var col = post_webservice_par(token,{id:_id}, baseUrl + "communication/getCommunicationById");
        if (col == null) {
            $(".errorInfo").text("获取水情人员信息失败！");
            return;
        }

        $("#name").val(col["name"]);
        // $("#password").val(col["password"]);
        $("#unit").val(col["unit"]);
        $("#position").val(col["position"]);
        $("#tel").val(col["tel"]);
        $("#phone").val(col["phone"]);
        $("#dutyTel").val(col["dutyTel"]);
        $("#txtSort").val(col["sort"]);
        // $(".div-pass").hide();

        //弹出框
        $("#modalUser").modal({ backdrop: 'static', keyboard: false, show: true });
    });
});