$(function () {
    //token
    var token = $.session.get("sessionId");
    var addvcd = $.session.get("addvcd");//行政区划编码
    //修改网页标题
    $("title").html(_system_name + $("title").html());
    //获取值班人员类型
    var colType = get_webservice(token,{type:"0102"},baseUrl + "file/GetDutyDict");
    var tempType = "";
    $.each(colType, function (index, obj) {
        tempType += "<option value='" + obj["dabh"] + "'>" + obj["daxx"] + "</option>";
    });
    $("#listUserType").append(tempType);

    //下拉多选组件
    $('.selectpicker').selectpicker({
        style: 'btn-default',
        deselectAllText: "全不选",
        selectAllText: "全选",
        actionsBox: true,                 //全选、反选开启标志                
        multipleSeparator: ","            //分隔符 
    });
    //下拉框改变事件            
    $('.selectpicker').on('changed.bs.select', function (e) {
        if (_id == "") {
            var val = new Array($("#listUserType").selectpicker('val')).join(",");
            if (val != "") {
                var _sort = post_webservice_par(token,{userType:val}, baseUrl + "user/getDutyUserSort");
                $("#txtSort").val(parseInt(_sort) + 1);
            }
        }
    });                

    var table = null;
    table = $('#userTable').dataTable({
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
            "mDataProp": "userid",
            "sDefaultContent": "", //此列默认值为""，以防数据中没有此值，DataTables加载数据的时候报错  
            "bVisible": false //此列不显示  
        }, {
            "mDataProp": "userName"
        }, {
            "mDataProp": "realName"
        }, {
            "mDataProp": "phone"
        }, {
            "mDataProp": "role"
        }, {
            "mDataProp": "userType"
        }, 
        // {
        //     "mDataProp": "sort"
        // }, 
        {
            "mDataProp": "",
            "sDefaultContent": "Edit"
        }
        ],
        "oLanguage": {     //国际化配置  
            "sProcessing": "<img src='../images/loading.gif'/>",
            "sLengthMenu": "每页显示 _MENU_ 条",
            "sZeroRecords": "无登陆人员信息",
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
            txtHtml += "<button class='btn btn-default btn_load' type='button'><span class='fa fa-paw'></span>&nbsp;&nbsp;密码初始化</button>";
            $('td:eq(5)', nRow).html(txtHtml);

            return nRow;
        },
        "bServerSide": true,             //服务器端
        "sAjaxSource": baseUrl + "user/getDutyUser",
        //查询条件
        "fnServerParams": function (aoData){
            aoData.push({ "name": "addvcd", "value": addvcd });
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

    //ID
    var _id = "";
    //删除的ID
    var _del_id = "";

    /**
     * 新增按钮事件
     **/
    $("#btnAdd").click(function () {
        _id = "";
        $(".div-pass").hide();
        $(".errorInfo").text("");
        $("#userName").val("");
        $("#password").val("");
        $("#realName").val("");
        $("#phone").val("");
        $("#email").val("");
        $("#listRole").val("3");
        $("#listUserType").selectpicker("val", "".split(','));
        $("#txtSort").val("");
        //现在弹出框
        $("#modalUser").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 保存按钮事件
     **/
    $(".btnSave").click(function () {
        var userName = $("#userName").val();
        var password = $("#password").val();
        password = "000000";
        var realName = $("#realName").val();
        var phone = $("#phone").val();
        // var email = $("#email").val();
        var role = $("#listRole").val();
        var userType = new Array($("#listUserType").selectpicker('val')).join(",");
        var sort = $("#txtSort").val();

        var addUserAddvcd = addvcd;


        if (userName == "") {
            $(".errorInfo").text("用户名不能为空！");
            return;
        }
        if (_id == "" && password == "") {
            $(".errorInfo").text("密码不能为空！");
            return;
        }
        if (realName == "") {
            $(".errorInfo").text("真实姓名不能为空！");
            return;
        }
        if (userType == "") {
            $(".errorInfo").text("人员类型不能为空！");
            return;
        }

        //校验用户名重复 
        if(_id == ""){
            var chk = post_webservice_par(token,{userName:userName}, baseUrl + "user/isExistUser");
            if (chk) {
                $(".errorInfo").text("用户名已存在，请重新输入！");
                return;
            }
        }               
        
        //保存数据
        var _arr = { userid: _id, userName: userName, password: password,addvcd:addUserAddvcd, realName: realName, userTel: phone,roleId: role, userType: userType, sort: sort };
        var resSave = post_webservice_json_new(token,JSON.stringify(_arr) , baseUrl + "user/saveDutyUser");
        if (resSave > 0) {
            $(".errorInfo").text("值班人员保存成功！");
            if (_id == "")
                _id = resSave.toString();
            //关闭弹出框
            $("#modalUser").modal("hide");
            //刷新表格
            table.fnDraw(false);
        } else {
            $(".errorInfo").text("值班人员保存失败！");
            return;
        }
    });

    /**
     * 删除按钮事件
     **/
    $('#userTable tbody').on('click', 'button.btn_del', function () {
        var aData = table.fnGetData(this.parentNode.parentNode);
        _del_id = aData.userid;

        $("#labDel").text("确定删除该用户值班系统权限？");
        $("#modalDel").modal("show");
    });

    /**
     * 删除按钮确定事件
     **/
    $(".btnDelSure").click(function () {
        var res = post_webservice_par(token,{userid:_del_id},baseUrl + "user/delDutyUser");
        if (res) {
            //关闭model
            $("#modalDel").modal("hide");
            //判断当前页是否只有一条数据
            var start = $("#userTable").dataTable().fnSettings()._iDisplayStart;
            var total = $("#userTable").dataTable().fnSettings().fnRecordsDisplay();
            if ((total - start) == 1) {
                $("#userTable").dataTable().fnPageChange("previous", true);
            } else {
                //刷新表格
                table.fnDraw(false);
            }
        } else {
            alert("值班人员删除失败！");
            return;
        }
    });

    /**
     * 编辑按钮事件
     **/
    $('#userTable tbody').on('click', 'button.btn_edit', function () {
        $(".errorInfo").text("");
        var aData = table.fnGetData(this.parentNode.parentNode);
        _id = aData.userid;

        //获取值班人员信息
        var col = post_webservice_par(token,{userid:_id}, baseUrl + "user/getDutyUserInfo");
        if (col == null) {
            $(".errorInfo").text("获取值班人员信息失败！");
            return;
        }

        $("#userName").val(col["userName"]);
        $("#password").val(col["password"]);
        $("#realName").val(col["realName"]);
        $("#phone").val(col["userTel"]);
        $("#email").val(col["email"]);
        $("#listRole").val(col["roleId"]);
        $("#listUserType").selectpicker("val", col["userType"].split(','));
        $("#txtSort").val(col["sort"]);
        $(".div-pass").hide();

        //弹出框
        $("#modalUser").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 密码初始化
     **/
    $('#userTable tbody').on('click', 'button.btn_load', function () {
        $(".errorInfo").text("");
        var aData = table.fnGetData(this.parentNode.parentNode);

        var res = post_webservice_par(token,{userid:aData.userid,password:'000000'}, baseUrl + "user/initPassword");
        if (res) {
            alert("密码初始化成功！初始密码为:000000");
        } else {
            alert("密码初始化失败！");
        }
    });
});