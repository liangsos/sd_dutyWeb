$(function () {
    // const baseUrl = "http://localhost:8088/sd-duty/api/";
    //token
    // var token = sessionStorage.getItem("sessionId");
    var token = $.cookie('sessionId');
    //登陆人员
    // var _duty_user_name = sessionStorage.getItem("userName");
    var _duty_user_name = $.cookie('userName');
    var _duty_name = sessionStorage.getItem("realName");
    //用户角色
    // var _duty_role = sessionStorage.getItem("roleId");
    var _duty_role = $.cookie('roleId');

    //会商表格
    var tableConsult = null;
    //传真表格
    var tableFax = null;
    //交换系统文件-表格
    var tableFax_On = null;
    //普通文档表格
    var tableDoc = null;
    //会商记录ID
    var _id_consult = "";
    //会商文档
    var _file_consult = "";
    //会商-是否只读
    var _consult_only_watch = "";
    //删除-会商记录ID
    var _del_id_consult = "";
    //删除类别 删除确定按钮时 确认是删除了哪一个 1传真2会商3普通文档4电子传真
    var _del_type = "";
    //收发文档ID
    var _id_doc = "";
    //收发文档名称
    var _file_doc = "";
    //删除-收发文档ID
    var _del_id_doc = "";
    //传真预览-高和宽
    var _fax_watch_width = 898;
    var _fax_watch_height = document.documentElement.clientHeight - 70;
    //交换系统文件-ID
    var _id_fax_online = "";
    //交换系统文件-时间
    var _time_fax_online = "";
    //交换系统文件-文档
    var _file_fax_online = "";
    //删除-交换系统文件ID
    var _del_id_fax_online = "";
    //交换系统文件-是否只读
    var _fax_online_only_watch = "";

    //阶段材料table
    var tableMat = null;
    //系统公告table
    var tableAnno = null;
    //阶段材料文件ID
    var _id_mat = "";
    //阶段系统公告ID
    var _id_anno = "";
    //阶段材料文件名称
    var _file_mat = "";
    //系统公告文件名称
    var _file_anno = "";
    //删除-阶段材料ID
    var _del_id_mat = "";
    //删除-系统公告ID
    var _del_id_anno = "";

    //修改网页标题
    $("title").html(_system_name + $("title").html());


    //获取收发文档类型
    // var colType = jQuery.parseJSON(post_webservice_json("{'type':'0103'}", "file/GetDutyDict"));
    $("#fileType").append("<option value=''>全部</option>");
    $.ajax({
        headers:{
            "Authorization" : token
        },
        type: "get",
        data:{type:"0103"},
        url: baseUrl + "file/GetDutyDict",
        success: function(res){
            if(res.success){
                var tempType = "";
                $.each(res.data, function (index, obj) {
                    tempType += "<option value='" + obj["dabh"] + "'>" + obj["daxx"] + "</option>";
                });
                $("#fileType").append(tempType);
                $("#fileType2").append(tempType);
            }
        }
    });

    //日期控件初始化
    initDatePicker('.form_date', "yyyy-mm-dd", 2);
    initDatePicker('.date-hour', "yyyy-mm-dd hh:00:00", 1);

    //初始化表格 查询4个表
    // initTable("1");
    // initTable("2");
    initTable("3");
    initTable("4");
    initTable("5");
    initTable("6");
    //隐藏另外的2个
    $("#faxTable").css('width', "100%");
    $("#faxTable_On").css('width', "100%");
    $("#consulTable").css('width', "100%");
    $("#docTable").css('width', "100%");
    $("#matTable").css('width', "100%");
    $("#annoTable").css('width', "100%");

    //////////////////////////////////////////////会商记录//////////////////////////////////////////////////
    /**
     * 查询按钮事件
     **/
    $("#btnSearchConsult").click(function () {
        tableConsult.fnDraw();
    });

    /**
     * 新增按钮事件
     **/
    $("#btnAddConsult").click(function () {
        _id_consult = "";
        _file_consult = "";
        $("#errorConsult").text("");                
        $("#txtBeginTimeC,#txtHost,#txtAttendees,#txtAttend,#txtContent").val("");
        $("#txtName").val("山东防汛会商会");
        $("#txtPlace").val("山东防汛会商室");
        $("#fileTableConsult tr").remove();

        //只读相关控制-取消
        _consult_only_watch = "";
        $("#txtBeginTimeC").attr("disabled", false);
        $("#spanBeginTimeC").show();
        $("#txtName,#txtPlace,#txtHost,#txtAttendees,#txtAttend,#txtContent").attr("readonly", false);
        $("#btnChoose").attr("disabled", false);
        $("#txtConsult .swfupload").css("display", "block");
        $(".btnSaveConsult").show();

        //现在弹出框
        $("#modalConsult").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 会商记录-编辑按钮事件
     **/
    $('#consulTable tbody').on('click', '.btn_edit,.btn_watch', function () {
        //是否只读
        if ($(this).hasClass("btn_watch")) {
            _consult_only_watch = "1";
        } else {
            _consult_only_watch = "";
        }

        $("#errorConsult").text("");
        var aData = tableConsult.fnGetData(this.parentNode.parentNode);
        _id_consult = aData.id;

        //获取会商信息
        var col = get_webservice(token,{'id': _id_consult}, baseUrl + "file/getDutyConsultById");
        if (col.length < 1) {
            alert("获取会商记录失败！");
            return;
        }

        if(col["docment"] != null || col["docment"] != ""){
            $("#successSaveConsult").show();
        }

        //赋值
        $("#txtBeginTimeC").val($.format.date(new Date(Date.parse(col["beginTime"].replace(/-/g, "/"))), "yyyy-MM-dd HH:mm:ss"));
        //根据文本内的值更新日期时间选择器
        $('.date-hour').datetimepicker('update');
        $("#txtName").val(col["name"]);
        $("#txtPlace").val(col["place"]);
        $("#txtHost").val(col["host"]);
        $("#txtAttendees").val(col["attendees"]);
        $("#txtAttend").val(col["attend"]);
        $("#txtContent").val(col["content"]);
        //$("#txtConslusion").val(col[0]["conslusion"]);
        _file_consult = col["docment"];

        if (_consult_only_watch == "1") {
            $("#txtBeginTimeC").attr("disabled", true);
            $("#spanBeginTimeC").hide();
            $("#txtName,#txtPlace,#txtHost,#txtAttendees,#txtAttend,#txtContent").attr("readonly", true);
            $("#btnChoose").attr("disabled", true);
            // $("#txtConsult .swfupload").css("display", "none");
            $(".btnSaveConsult").hide();
        } else {
            $("#txtBeginTimeC").attr("disabled", false);
            $("#spanBeginTimeC").show();
            $("#txtName,#txtPlace,#txtHost,#txtAttendees,#txtAttend,#txtContent").attr("readonly", false);
            $("#btnChoose").attr("disabled", false);
            // $("#txtConsult .swfupload").css("display", "block");
            $(".btnSaveConsult").show();
        }

        //初始化文档表格-会商
        addFileTable("fileTableConsult", col["docment"], "0", "consult",col["conslusion"]);
        //弹出框
        $("#modalConsult").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 会商记录-删除按钮事件
     **/
    $('#consulTable tbody').on('click', 'button.btn_del', function () {
        var aData = tableConsult.fnGetData(this.parentNode.parentNode);
        _del_id_consult = aData.id;
        _del_type = "2";

        $("#labDel").text("确定删除该会商记录(同时删除会商文档)？ ");
        $("#modalDel").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 删除按钮确定事件
     **/
    $(".btnDelSure").click(function () {
        if (_del_type == "2") {
            var res = post_webservice_par(token,{id:_del_id_consult}, baseUrl + "file/delDutyConsult");
            if (res) {
                //关闭model
                $("#modalDel").modal("hide");
                //判断当前页是否只有一条数据
                var start = $("#consulTable").dataTable().fnSettings()._iDisplayStart;
                var total = $("#consulTable").dataTable().fnSettings().fnRecordsDisplay();
                if ((total - start) == 1) {
                    $("#consulTable").dataTable().fnPageChange("previous", true);
                } else {
                    //刷新表格
                    tableConsult.fnDraw(false);
                }
            } else {
                alert("会商记录删除失败！");
                return;
            }
        } else if (_del_type == "3") {
            var res = post_webservice_par(token,{id:_del_id_doc}, baseUrl + "file/delDutyDoc");
            if (res) {
                //关闭model
                $("#modalDel").modal("hide");
                //判断当前页是否只有一条数据
                var start = $("#docTable").dataTable().fnSettings()._iDisplayStart;
                var total = $("#docTable").dataTable().fnSettings().fnRecordsDisplay();
                if ((total - start) == 1) {
                    $("#docTable").dataTable().fnPageChange("previous", true);
                } else {
                    //刷新表格
                    tableDoc.fnDraw(false);
                }
            } else {
                alert("共享文件删除失败！");
                return;
            }
        } else if (_del_type == "4") {
            var res = post_webservice_par(token,{id:_del_id_mat}, baseUrl + "file/delDutyMat");
            if (res) {
                //关闭model
                $("#modalDel").modal("hide");
                //判断当前页是否只有一条数据
                var start = $("#matTable").dataTable().fnSettings()._iDisplayStart;
                var total = $("#matTable").dataTable().fnSettings().fnRecordsDisplay();
                if ((total - start) == 1) {
                    $("#matTable").dataTable().fnPageChange("previous", true);
                } else {
                    //刷新表格
                    tableMat.fnDraw(false);
                }
            } else {
                alert("阶段材料删除失败！");
                return;
            }
        } else if (_del_type == "5") {
            var res = post_webservice_par(token,{id:_del_id_anno}, baseUrl + "file/delDutyAnno");
            if (res) {
                //关闭model
                $("#modalDel").modal("hide");
                //判断当前页是否只有一条数据
                var start = $("#annoTable").dataTable().fnSettings()._iDisplayStart;
                var total = $("#annoTable").dataTable().fnSettings().fnRecordsDisplay();
                if ((total - start) == 1) {
                    $("#annoTable").dataTable().fnPageChange("previous", true);
                } else {
                    //刷新表格
                    tableAnno.fnDraw(false);
                }
            } else {
                alert("系统公告删除失败！");
                return;
            }
        }
    });

    /**
     * 保存会商记录事件
     **/
    $(".btnSaveConsult").click(function () {
        var beginTime = $("#txtBeginTimeC").val();
        //var endTime = $("#txtEndTimeC").val();
        var name = $("#txtName").val();
        var place = $("#txtPlace").val();
        var host = $("#txtHost").val();
        var attendees = $("#txtAttendees").val();
        var attend = $("#txtAttend").val();
        var content = $("#txtContent").val();
        //var conslusion = $("#txtConslusion").val();

    

        var fileObj = document.getElementById("fileExport").files[0];

       


        //数据校验
        if (beginTime == "") {
            $("#errorConsult").text("开始时间不能为空！");
            return;
        }
        if (!checkDate(beginTime)) {
            $("#errorConsult").text("请输入正确的日期格式！");
            return;
        }
        
        if (attendees == "") {
            $("#errorConsult").text("参加人员不能为空！");
            return;
        }
        if (attend == "") {
            $("#errorConsult").text("参加人数不能为空！");
            return;
        }
        if (content == "") {
            $("#errorConsult").text("会商内容不能为空！");
            return;
        }

        var consultfile = new FormData();
        consultfile.append("id", _id_consult);
        consultfile.append("beginTime", beginTime);
        consultfile.append("name", name);
        consultfile.append("place", place);
        consultfile.append("host", host);
        consultfile.append("attendees", attendees);
        consultfile.append("attend", attend);
        consultfile.append("content", content);
        consultfile.append("docment", _file_consult);
        consultfile.append("updateUser", _duty_user_name);
        if(fileObj != null){
            consultfile.append("file", fileObj);
        }

        //保存数据
        //var _arr = [{ id: _id_consult, beginTime: beginTime, endTime: endTime, attendees: attendees, attend: attend, content: content, conslusion: conslusion, docment: _file_consult, updateUser: _duty_user_name }];
        // var _arr = { id: _id_consult, beginTime: beginTime, name: name, place: place, host: host, attendees: attendees, attend: attend, content: content, docment: _file_consult, updateUser: _duty_user_name,file:fileObj };
        var resSave = post_webservice_file(token,consultfile, baseUrl + "file/saveDutyConsult");
        if (resSave > 0) {
            $("#errorConsult").text("会商记录保存成功！");
            if (_id_consult == "")
                _id_consult = resSave.toString();
            //关闭弹出框
            $("#modalConsult").modal("hide");
            //刷新表格
            tableConsult.fnDraw(false);
        } else {
            $("#errorConsult").text("会商记录保存失败！");
            return;
        }
    });

    /**
     * 已选列表删除
     **/
    $('#fileTableFax_On,#fileTableConsult,#fileTableDoc').delegate('.btn-del', 'click', function () {
        var file = $(this).attr("_file");
        //表格id
        var tableId = $(this).parent().parent().parent().parent().attr("id");
        //删除该行
        $(this).parent().parent().remove();

        //删除文档中的 交换系统文件
        if (tableId == "fileTableFax_On") {
            _file_fax_online = delStrFiles(_file_fax_online, file);
            //删除服务器文档
            var res = post_webservice_json("{'type':'fax_online','id':'" + _id_fax_online + "','file':'" + file + "'}", "DutyFile.aspx/delDutyFile");
            if (!res) {
                $("#errorFax_On").text("修改交换系统文件-文件删除失败！");
                return;
            }
        }
            //会商
        else if (tableId == "fileTableConsult") {
            _file_consult = delStrFiles(_file_consult, file);
            //删除服务器文档
            var res = post_webservice_json("{'type':'consult','id':'" + _id_consult + "','file':'" + file + "'}", "DutyFile.aspx/delDutyFile");
            if (!res) {
                $("#errorConsult").text("修改会商记录-会商文档失败！");
                return;
            }
        }
        else if (tableId == "fileTableDoc") {
            //共享文件
            _file_doc = delStrFiles(_file_doc, file);
            //删除服务器文档
            var res = post_webservice_json("{'type':'doc','id':'" + _id_doc + "','file':'" + file + "'}", "DutyFile.aspx/delDutyFile");
            if (!res) {
                $("#errorDoc").text("修改收发文档失败！");
                return;
            }
        }
    });

    /**
     * 生成已上传文档表格
     * type说明：0初始化 1直接添加 2删除(指定文件名称)
     **/
    function addFileTable(tableId, strFiles, type, file_name,uploadUrl) {
        if (type != "0" && strFiles == "")
            return;

        switch (type) {
            case "0":
                //先删除
                $("#" + tableId + " tr").remove();

                //是否只读
                var only_watch = "";
                if ((tableId == "fileTableConsult" && _consult_only_watch == "1") || (tableId == "fileTableFax_On" && _fax_online_only_watch == "1")) {
                    only_watch = 'disabled = "true"';
                }
                var files = strFiles.split(";");
                for (var i = 0; i < files.length; i++) {
                    if (files[i] == "")
                        continue;

                    var temp = "<tr><td class='td-name'><a href='#' onclick='downloadFile(this)' _url='" + uploadUrl + "'>" + files[i] + "</a></td>";
                    // temp += "<td><button class='btn btn-default btn-del' _file='" + files[i] + "' " + only_watch + "><span class='fa fa-trash-o'></span>&nbsp;&nbsp;删除</button></td></tr>";
                    $("#" + tableId + "").append(temp);
                }
                break;
            case "1":
                var temp = "<tr><td class='td-name'><a href='#' onclick='downloadFile(this)' _url='" + uploadUrl + "'>" + files[i] + "</a></td>";
                // temp += "<td><button class='btn btn-default btn-del' _file='" + strFiles + "'><span class='fa fa-trash-o'></span>&nbsp;&nbsp;删除</button></td></tr>";
                $("#" + tableId + "").append(temp);
                break;
            case "2":
                //遍历现有表格删除
                $("#" + tableId + " tr").each(function (index, element) {

                });
        }
    }

    /**
     * 会商时间焦点离开 验证日期有效性
     **/
    $("#txtBeginTimeC").blur(function () {
        if ($(this).val() == "")
            return true;

        if (checkDate($(this).val())) {
            $("#errorDate").text("");
        } else {
            $("#errorDate").text("请输入正确的日期格式!");
            $(this).focus();
        }
    });
    //////////////有关机构选择/////////////
    /**
     * 选择按钮
     **/
    $("#btnChoose").click(function () {
        //弹出modal框
        $("#modalOrgan").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    //待选列表array
    var arrNotOrgan = new Array();
    //已选列表array
    var arrYesOrgan = new Array();
    //初始化列表
    initOrgan();

    /**
     * 初始化列表
     **/
    function initOrgan() {
        $("#ulNotOrgan li").remove();
        $("#ulYesOrgan li").remove();
        arrNotOrgan = new Array();
        arrYesOrgan = new Array();
        // var colList = jQuery.parseJSON(post_webservice("DutyFile.aspx/getDutyOrgan"));
        $.ajax({
            headers:{
                "Authorization" : token
            },
            type: "get",
            url: baseUrl + "dutyRecord/getDutyOrgan",
            success: function(res){
                var temp = "";
                $.each(res.data, function (index, obj) {
                    temp += "<li _name='" + obj["name"] + "' _leader='" + obj["leader"] + "'>" + obj["name"] + "</li>";
                    arrNotOrgan.push(obj);
                });
                $("#ulNotOrgan").append(temp);
            }
        });
    }

    /**
     * 待选列表 单击事件
     **/
    $("#ulNotOrgan").delegate("li", "click", function () {
        var name = $(this).attr("_name");
        var tempObj = new Object();

        //左侧列表删除
        $(this).remove();
        //待选arr删除
        $.each(arrNotOrgan, function (index, obj) {
            if (obj["name"] == name) {
                tempObj = obj;
                arrNotOrgan.splice(index, 1);
                return false;
            }
        });

        //右侧列表添加
        $("#ulYesOrgan").append("<li _name='" + tempObj["name"] + "' _leader='" + tempObj["leader"] + "'>" + tempObj["name"] + "</li>");
        //已选arr添加
        arrYesOrgan.push(tempObj);
    });

    /**
     * 已选列表 单击事件
     **/
    $("#ulYesOrgan").delegate("li", "click", function () {
        var name = $(this).attr("_name");
        var tempObj = new Object();

        //右侧列表删除
        $(this).remove();
        //已选arr删除
        $.each(arrYesOrgan, function (index, obj) {
            if (obj["name"] == name) {
                tempObj = obj;
                arrYesOrgan.splice(index, 1);
                return false;
            }
        });

        //左侧列表添加
        $("#ulNotOrgan").append("<li _name='" + tempObj["name"] + "' _leader='" + tempObj["leader"] + "'>" + tempObj["name"] + "</li>");
        //待选arr添加
        arrNotOrgan.push(tempObj);
    });

    /**
     * 全选按钮事件
     **/
    $(".btnAll").click(function () {
        //先右侧添加
        $.each(arrNotOrgan, function (index, obj) {
            $("#ulYesOrgan").append("<li _name='" + obj["name"] + "' _leader='" + obj["leader"] + "'>" + obj["name"] + "</li>");
            arrYesOrgan.push(obj);
        });

        //待选清空
        $("#ulNotOrgan li").remove();
        arrNotOrgan = new Array();
    });

    /**
     * 反选按钮事件
     **/
    $(".btnAllNot").click(function () {
        //先左侧添加
        $.each(arrYesOrgan, function (index, obj) {
            $("#ulNotOrgan").append("<li _name='" + obj["name"] + "' _leader='" + obj["leader"] + "'>" + obj["name"] + "</li>");
            arrNotOrgan.push(obj);
        });

        //已选清空
        $("#ulYesOrgan li").remove();
        arrYesOrgan = new Array();
    });

    /**
     * 机构选择-确定按钮
     **/
    $(".btnSureOrgan").click(function () {
        $("#errorOrgan").text("");
        //校验是否选择站点
        if ($("#ulYesOrgan li").length == 0) {
            $("#errorOrgan").text("请先选择机构！");
            return;
        }

        //拼接机构
        var names = "";
        $("#ulYesOrgan li").each(function (index, element) {
            names += $(this).attr("_name") + " ";
        });

        //赋值
        $("#txtAttendees").val(names); 3
        //隐藏model
        $("#modalOrgan").modal("hide");
    });
    //////////////////////////////////////////////会商记录//////////////////////////////////////////////////

    //////////////////////////////////////////////共享文件/////////////////////////////////////////////////
    /**
     * 查询按钮事件
     **/
    $("#btnSearchDoc").click(function () {
        tableDoc.fnDraw();
    });

    /**
     * 新增按钮事件
     **/
    $("#btnAddDoc").click(function () {
        _id_doc = "";
        _file_doc = "";
        $("#errorDoc").text("");
        $("#fileType2,#txtContentDoc").val("");
        $("#fileTableDoc tr").remove();
        //现在弹出框
        $("#modalDoc").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 共享文件-编辑按钮事件
     **/
    $('#docTable tbody').on('click', 'button.btn_edit', function () {
        $("#errorDoc").text("");
        var aData = tableDoc.fnGetData(this.parentNode.parentNode);
        _id_doc = aData.id;

        //获取共享文件
        var col = post_webservice_par(token,{'id':_id_doc}, baseUrl + "file/getDutyDocById");
        if (col.length < 1) {
            alert("获取防汛文档失败！");
            return;
        }
        
        $("#successSaveDoc").show();

        //赋值
        $("#fileType2").val(col["fileType"]);
        $("#txtContentDoc").val(col["content"]);
        _file_doc = col["fileName"];

        //初始化文档表格
        addFileTable("fileTableDoc", col["fileName"], "0", "doc",col["source"]);
        //弹出框
        $("#modalDoc").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 共享文件-删除按钮事件
     **/
    $('#docTable tbody').on('click', 'button.btn_del', function () {
        var aData = tableDoc.fnGetData(this.parentNode.parentNode);
        _del_id_doc = aData.id;
        _del_type = "3";

        $("#labDel").text("确定删除该防汛文档？ ");
        $("#modalDel").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 保存共享文件
     **/
    $(".btnSaveDoc").click(function () {
        var fileType = $("#fileType2").val();
        var content = $("#txtContentDoc").val();

        var fileObjDoc = document.getElementById("txtDoc").files[0];

        //数据校验
        if (fileObjDoc == null || fileObjDoc == "") {
            $("#errorDoc").text("请选择文件！");
            return;
        }

        

        var docfile = new FormData();
        docfile.append("id", _id_doc);
        docfile.append("fileType",fileType);
        docfile.append("fileName", _file_doc);
        docfile.append("source", "");
        docfile.append("file", fileObjDoc);
        docfile.append("content", content);
        docfile.append("updateUser", _duty_user_name);
        

        //保存数据
        var _arr = [{ id: _id_doc, fileType: fileType, fileName: _file_doc, source: "", content: content, updateUser: _duty_user_name }];
        var resSave = post_webservice_file(token,docfile, baseUrl + "file/saveDutyDoc");
        if (resSave > 0) {
            $("#errorDoc").text("防汛文档保存成功！");
            if (_id_doc == "")
                _id_doc = resSave.toString();
            //关闭弹出框
            $("#modalDoc").modal("hide");
            //刷新表格
            tableDoc.fnDraw(false);
        } else {
            $("#errorDoc").text("防汛文档保存失败！");
            return;
        }
    });
    //////////////////////////////////////////////共享文件/////////////////////////////////////////////////

    //////////////////////////////////////////////阶段材料/////////////////////////////////////////////////
    /**
     * 查询按钮事件
     **/
    $("#btnSearchMat").click(function () {
        tableMat.fnDraw();
    });

    /**
     * 新增按钮事件
     **/
    $("#btnAddMat").click(function () {
        _id_mat = "";
        _file_mat = "";
        $("#errorMat").text("");
        $("#fileTableMat tr").remove();
        //现在弹出框
        $("#modalMat").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 阶段材料-编辑按钮事件
     **/
    $('#matTable tbody').on('click', 'button.btn_edit', function () {
        $("#errorMat").text("");
        var aData = tableMat.fnGetData(this.parentNode.parentNode);
        _id_mat = aData.id;

        //获取阶段材料
        var col = post_webservice_par(token,{'id':_id_mat}, baseUrl + "file/getDutyMatById");
        if (col.length < 1) {
            alert("获取阶段材料失败！");
            return;
        }
        
        $("#successSaveMat").show();

        //赋值
        // $("#fileType2").val(col["fileType"]);
        $("#txtContentMat").val(col["content"]);
        _file_mat = col["fileName"];

        //初始化文档表格
        addFileTable("fileTableMat", col["fileName"], "0", "doc",col["source"]);
        //弹出框
        $("#modalMat").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 阶段材料-删除按钮事件
     **/
    $('#matTable tbody').on('click', 'button.btn_del', function () {
        var aData = tableMat.fnGetData(this.parentNode.parentNode);
        _del_id_mat = aData.id;
        _del_type = "4";

        $("#labDel").text("确定删除该阶段材料？ ");
        $("#modalDel").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 保存阶段材料
     **/
    $(".btnSaveMat").click(function () {
        // var fileType = $("#fileType2").val();
        var content = $("#txtContentMat").val();

        var fileObjMat = document.getElementById("txtMat").files[0];

        //数据校验
        if (fileObjMat == null || fileObjMat == "") {
            $("#errorMat").text("请选择文件！");
            return;
        }

        

        var matfile = new FormData();
        matfile.append("id", _id_mat);
        // docfile.append("fileType",fileType);
        matfile.append("fileName", _file_mat);
        matfile.append("source", "");
        matfile.append("file", fileObjMat);
        matfile.append("content", content);
        matfile.append("updateUser", _duty_user_name);
        

        //保存数据
        var _arr = [{ id: _id_mat, fileType: fileType, fileName: _file_mat, source: "", content: content, updateUser: _duty_user_name }];
        var resSave = post_webservice_file(token,matfile, baseUrl + "file/saveDutyMat");
        if (resSave > 0) {
            $("#errorMat").text("阶段材料保存成功！");
            if (_id_mat == "")
                _id_mat = resSave.toString();
            //关闭弹出框
            $("#modalMat").modal("hide");
            //刷新表格
            tableMat.fnDraw(false);
        } else {
            $("#errorDoc").text("阶段材料保存失败！");
            return;
        }
    });
    //////////////////////////////////////////////阶段材料/////////////////////////////////////////////////

    //////////////////////////////////////////////系统公告/////////////////////////////////////////////////
    /**
     * 查询按钮事件
     **/
    $("#btnSearchAnno").click(function () {
        tableAnno.fnDraw();
    });

    /**
     * 新增按钮事件
     **/
    $("#btnAddAnno").click(function () {
        _id_anno = "";
        _file_anno = "";
        $("#errorAnno").text("");
        $("#fileTableAnno tr").remove();
        //现在弹出框
        $("#modalAnno").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 系统公告-编辑按钮事件
     **/
    $('#annoTable tbody').on('click', 'button.btn_edit', function () {
        $("#errorAnno").text("");
        var aData = tableAnno.fnGetData(this.parentNode.parentNode);
        _id_anno = aData.id;

        //获取阶段材料
        var col = post_webservice_par(token,{'id':_id_anno}, baseUrl + "file/getDutyAnnoById");
        if (col.length < 1) {
            alert("获取阶段材料失败！");
            return;
        }
        
        $("#successSaveAnno").show();

        //赋值
        // $("#fileType2").val(col["fileType"]);
        $("#txtContentAnno").val(col["content"]);
        _file_anno = col["fileName"];

        //初始化文档表格
        addFileTable("fileTableAnno", col["fileName"], "0", "doc",col["source"]);
        //弹出框
        $("#modalAnno").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 系统公告-删除按钮事件
     **/
    $('#annoTable tbody').on('click', 'button.btn_del', function () {
        var aData = tableAnno.fnGetData(this.parentNode.parentNode);
        _del_id_anno = aData.id;
        _del_type = "5";

        $("#labDel").text("确定删除该系统公告？ ");
        $("#modalDel").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 保存系统公告
     **/
    $(".btnSaveAnno").click(function () {
        // var fileType = $("#fileType2").val();
        var content = $("#txtContentAnno").val();

        var fileObjAnno = document.getElementById("txtAnno").files[0];

        //数据校验
        if (fileObjAnno == null || fileObjAnno == "") {
            $("#errorMat").text("请选择文件！");
            return;
        }

        

        var annofile = new FormData();
        annofile.append("id", _id_anno);
        // docfile.append("fileType",fileType);
        annofile.append("fileName", _file_anno);
        annofile.append("source", "");
        annofile.append("file", fileObjAnno);
        annofile.append("content", content);
        annofile.append("updateUser", _duty_user_name);
        

        //保存数据
        var _arr = [{ id: _id_anno, fileType: fileType, fileName: _file_anno, source: "", content: content, updateUser: _duty_user_name }];
        var resSave = post_webservice_file(token,annofile, baseUrl + "file/saveDutyAnno");
        if (resSave > 0) {
            $("#errorAnno").text("系统公告保存成功！");
            if (_id_anno == "")
                _id_anno = resSave.toString();
            //关闭弹出框
            $("#modalAnno").modal("hide");
            //刷新表格
            tableAnno.fnDraw(false);
        } else {
            $("#errorAnno").text("系统公告保存失败！");
            return;
        }
    });
    //////////////////////////////////////////////系统公告/////////////////////////////////////////////////

    /**
    * Nav切换显示按钮组
    **/
    $("#navFile a").on("click", function () {
        if ($(this).text() == "传真记录") {
            //强制设置宽度 datatables不显示时 宽度都改为0了
            $("#faxTable th:eq(0)").css("width", "60px");
            $("#faxTable th:eq(1)").css("width", "120px");
            $("#faxTable th:eq(2)").css("width", "150px");
            $("#faxTable th:eq(3)").css("width", "120px");
            $("#faxTable th:eq(4)").css("width", "auto");
            $("#faxTable th:eq(5)").css("width", "auto");
            $("#faxTable th:eq(6)").css("width", "80px");
            $("#faxTable th:eq(7)").css("width", "70px");
        } else if ($(this).text() == "交换系统文件") {
            //强制设置宽度 datatables不显示时 宽度都改为0了
            $("#faxTable_On th:eq(0)").css("width", "60px");
            $("#faxTable_On th:eq(1)").css("width", "120px");
            $("#faxTable_On th:eq(2)").css("width", "150px");
            $("#faxTable_On th:eq(3)").css("width", "auto");
            $("#faxTable_On th:eq(4)").css("width", "auto");
            $("#faxTable_On th:eq(5)").css("width", "80px");
            $("#faxTable_On th:eq(6)").css("width", "140px");
        } else if ($(this).text() == "会商记录") {
            //强制设置宽度 datatables不显示时 宽度都改为0了
            $("#consulTable th:eq(0)").css("width", "120px");
            $("#consulTable th:eq(1)").css("width", "110px");
            $("#consulTable th:eq(2)").css("width", "180px");
            $("#consulTable th:eq(3)").css("width", "80px");
            $("#consulTable th:eq(4)").css("width", "auto");
            $("#consulTable th:eq(5)").css("width", "60px");
            $("#consulTable th:eq(6)").css("width", "140px");
        } else if ($(this).text() == "防汛文档") {
            //强制设置宽度 datatables不显示时 宽度都改为0了
            $("#docTable th:eq(0)").css("width", "110px");
            $("#docTable th:eq(1)").css("width", "260px");
            $("#docTable th:eq(2)").css("width", "auto");
            $("#docTable th:eq(3)").css("width", "140px");
        } else if ($(this).text() == "阶段材料") {
            //强制设置宽度 datatables不显示时 宽度都改为0了
            $("#matTable th:eq(0)").css("width", "260px");
            $("#matTable th:eq(1)").css("width", "auto");
            $("#matTable th:eq(2)").css("width", "110px");
            $("#matTable th:eq(3)").css("width", "140px");
        } else if ($(this).text() == "系统公告") {
            //强制设置宽度 datatables不显示时 宽度都改为0了
            $("#annoTable th:eq(0)").css("width", "260px");
            $("#annoTable th:eq(1)").css("width", "auto");
            $("#annoTable th:eq(2)").css("width", "110px");
            $("#annoTable th:eq(3)").css("width", "140px");
        }
    });

    /**
     * 初始化表格
     **/
    function initTable(type) {
        switch (type) {
            case "3":           //会商
                tableConsult = $('#consulTable').dataTable({
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
                        "mDataProp": "host"
                    }, {
                        "mDataProp": "attendees"
                    }, {
                        "mDataProp": "attend"
                    }, {
                        "mDataProp": "content"
                    }, {
                        "mDataProp": "realName"
                    }, {
                        "mDataProp": "",
                        "sDefaultContent": "Edit"
                    }
                    ],
                    "oLanguage": {     //国际化配置  
                        "sProcessing": "<img src='../images/loading.gif'/>",
                        "sLengthMenu": "每页显示 _MENU_ 条",
                        "sZeroRecords": "没有会商记录信息",
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
                        var txtHtml = "";
                        if (_duty_role == "1" || _duty_user_name == aData.updateUser) {
                            txtHtml += "<button class='btn btn-default btn_edit' type='button'><span class='fa fa-edit'></span></span>&nbsp;&nbsp;编辑</button>&nbsp;&nbsp;";
                            txtHtml += "<button class='btn btn-default btn_del' type='button'><span class='fa fa-trash-o'></span>&nbsp;&nbsp;删除</button>";
                        }
                        else {
                            txtHtml += "<button class='btn btn-default btn_watch' type='button'><span class='fa fa-search-plus'></span></span>&nbsp;&nbsp;详细</button>&nbsp;&nbsp;";
                        }
                        $('td:eq(6)', nRow).html(txtHtml);

                        return nRow;
                    },
                    "bServerSide": true,             //服务器端
                    "sAjaxSource": baseUrl + "file/GetDutyConsult",
                    //查询条件
                    "fnServerParams": function (aoData) {
                        aoData.push({ "name": "search_begin_time", "value": $("#txtBeginTime").val() });
                        aoData.push({ "name": "search_end_time", "value": $("#txtEndTime").val() });
                    },
                    //服务器端，数据回调处理
                    "fnServerData": function (sSource, aoData, fnCallback) {
                        $.ajax({
                            headers:{
                                "Authorization" : token
                            },
                            "type": "post",
                            "contentType": "application/json; charset=utf-8",
                            "dataType": 'json',
                            "url": sSource,
                            "data": JSON.stringify(aoData),
                            "success": function (res) {
                                var resultCollection = res.data;
                                console.log("resultCollection----------");
                                console.log(resultCollection);
                                fnCallback(resultCollection);
                            }
                        });
                    }
                });
                break;

            case "4":         //共享文件
                tableDoc = $('#docTable').dataTable({
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
                        "mDataProp": "fileType"
                    }, {
                        "mDataProp": "fileName"
                    }, {
                        "mDataProp": "content"
                    }, {
                        "mDataProp": "",
                        "sDefaultContent": "Edit"
                    }
                    ],
                    "oLanguage": {     //国际化配置  
                        "sProcessing": "<img src='../images/loading.gif'/>",
                        "sLengthMenu": "每页显示 _MENU_ 条",
                        "sZeroRecords": "没有共享文件信息",
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
                        txtHtml += "<button class='btn btn-default btn_del' type='button'><span class='fa fa-trash-o'></span>&nbsp;&nbsp;删除</button>";
                        $('td:eq(3)', nRow).html(txtHtml);

                        return nRow;
                    },
                    "bServerSide": true,             //服务器端
                    "sAjaxSource": baseUrl + "file/GetDutyDoc",
                    //查询条件
                    "fnServerParams": function (aoData) {
                        aoData.push({ "name": "search_type", "value": $("#fileType").val() });
                        aoData.push({ "name": "search_begin_time", "value": $("#txtBeginTimeD").val() });
                        aoData.push({ "name": "search_end_time", "value": $("#txtEndTimeD").val() });
                    },
                    //服务器端，数据回调处理
                    "fnServerData": function (sSource, aoData, fnCallback) {
                        $.ajax({
                            headers:{
                                "Authorization" : token
                            },
                            "type": "post",
                            "contentType": "application/json; charset=utf-8",
                            "dataType": 'json',
                            "url": sSource,
                            "data": JSON.stringify(aoData),
                            "success": function (res) {
                                var resultCollection = res.data;
                                fnCallback(resultCollection);
                                // todo
                            }
                        });
                    }
                });
                break;

            case "5":         //阶段材料
            tableMat = $('#matTable').dataTable({
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
                        "mDataProp": "fileName"
                    }, {
                        "mDataProp": "content"
                    }, {
                        "mDataProp": "updateDate"
                    },{
                        "mDataProp": "",
                        "sDefaultContent": "Edit"
                    }
                    ],
                    "oLanguage": {     //国际化配置  
                        "sProcessing": "<img src='../images/loading.gif'/>",
                        "sLengthMenu": "每页显示 _MENU_ 条",
                        "sZeroRecords": "没有阶段材料信息",
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
                        txtHtml += "<button class='btn btn-default btn_del' type='button'><span class='fa fa-trash-o'></span>&nbsp;&nbsp;删除</button>";
                        $('td:eq(3)', nRow).html(txtHtml);

                        return nRow;
                    },
                    "bServerSide": true,             //服务器端
                    "sAjaxSource": baseUrl + "file/GetDutyMat",
                    //查询条件
                    "fnServerParams": function (aoData) {
                        aoData.push({ "name": "search_begin_time", "value": $("#txtBeginTimeE").val() });
                        aoData.push({ "name": "search_end_time", "value": $("#txtEndTimeE").val() });
                    },
                    //服务器端，数据回调处理
                    "fnServerData": function (sSource, aoData, fnCallback) {
                        $.ajax({
                            headers:{
                                "Authorization" : token
                            },
                            "type": "post",
                            "contentType": "application/json; charset=utf-8",
                            "dataType": 'json',
                            "url": sSource,
                            "data": JSON.stringify(aoData),
                            "success": function (res) {
                                var resultCollection = res.data;
                                fnCallback(resultCollection);
                                // todo
                            }
                        });
                    }
                });
                break;

                case "6":         //系统公告
                tableAnno = $('#annoTable').dataTable({
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
                            "mDataProp": "fileName"
                        },{
                            "mDataProp": "content"
                        }, {
                            "mDataProp": "updateDate"
                        },{
                            "mDataProp": "",
                            "sDefaultContent": "Edit"
                        }
                        ],
                        "oLanguage": {     //国际化配置  
                            "sProcessing": "<img src='../images/loading.gif'/>",
                            "sLengthMenu": "每页显示 _MENU_ 条",
                            "sZeroRecords": "没有系统公告信息",
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
                            txtHtml += "<button class='btn btn-default btn_del' type='button'><span class='fa fa-trash-o'></span>&nbsp;&nbsp;删除</button>";
                            $('td:eq(3)', nRow).html(txtHtml);
    
                            return nRow;
                        },
                        "bServerSide": true,             //服务器端
                        "sAjaxSource": baseUrl + "file/GetDutyAnno",
                        //查询条件
                        "fnServerParams": function (aoData) {
                            aoData.push({ "name": "search_begin_time", "value": $("#txtBeginTimeF").val() });
                            aoData.push({ "name": "search_end_time", "value": $("#txtEndTimeF").val() });
                        },
                        //服务器端，数据回调处理
                        "fnServerData": function (sSource, aoData, fnCallback) {
                            $.ajax({
                                headers:{
                                    "Authorization" : token
                                },
                                "type": "post",
                                "contentType": "application/json; charset=utf-8",
                                "dataType": 'json',
                                "url": sSource,
                                "data": JSON.stringify(aoData),
                                "success": function (res) {
                                    var resultCollection = res.data;
                                    fnCallback(resultCollection);
                                    // todo
                                }
                            });
                        }
                    });
                    break;
        }

    }

    
});

function downloadFile(e){
    var url = e.attributes[2].value;
    // var url = $(this).attr("_url");
    var form=$("<form>");
    form.attr("style","display:none");
    form.attr("target","");
    form.attr("method","get"); 
    form.attr("action",url);
    $("body").append(form);
    form.submit();//表单提交

    // window.location.href = url;
}