$(function () {
    // const baseUrl = "http://localhost:8088/sd-duty/api/";
    //token
    var token = sessionStorage.getItem("sessionId");
    //登陆人员
    var _duty_user_name = sessionStorage.getItem("userName");
    var _duty_name = sessionStorage.getItem("realName");
    //用户角色
    var _duty_role = sessionStorage.getItem("roleId");

    //当前登陆名
    // var _duty_user_name = $("#_hid_duty_user_name").val();
    //用户角色
    // var _duty_role = $("#_hid_duty_role").val();
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
    //修改网页标题
    $("title").html(_system_name + $("title").html());

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
    //             sessionStorage.setItem("duty_today", _duty_today);
    //             window.parent.updLoginUser(_duty_name, _duty_today);
    //         }
    //     },
    //     error: function (err) {
    //         console.log(err);
    //     }
    // });

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

    //初始化文档上传 控件
    // initUploadify("2");
    // initUploadify("3");
    // initUploadify("4");
    ///////////////////////////////////////////////传真记录/////////////////////////////////////////////////
    /**
     * 查询按钮事件
     **/
    // $("#btnSearchFax").click(function () {
    //     tableFax.fnDraw();
    // });

    // /**
    //  * 传真记录-查看按钮事件
    //  **/
    // $('#faxTable tbody').on('click', 'button.btn_watch', function () {
    //     $("#errorFax").text("");
    //     var aData = tableFax.fnGetData(this.parentNode.parentNode);

    //     //获取法定假信息
    //     var col = jQuery.parseJSON(post_webservice_json("{'id':'" + aData.id + "'}", "DutyFile.aspx/getDutyFaxById"));
    //     if (col.length < 1) {
    //         alert("获取传真记录失败！");
    //         return;
    //     }

    //     //赋值
    //     $("#txtRevTypeFax").val(col[0]["isRev"] == "0" ? "发传真" : "收传真");
    //     $("#txtItemTime").val(col[0]["itemTime"]);
    //     $("#txtUnitFax").val(col[0]["units"]);
    //     $("#txtItemTel").val(col[0]["itemTel"]);
    //     $("#txtRefNo").val(col[0]["refNo"]);
    //     $("#txtFileName").val(col[0]["fileName"]);
    //     $("#txtSuggestion").val(col[0]["suggestion"]);
    //     $("#txtContentFax").val(col[0]["content"]);

    //     //初始化传真文件列表
    //     initTableFax(col[0]["tiffName"]);
    //     //弹出框
    //     $("#modalFax").modal({ backdrop: 'static', keyboard: false, show: true });
    // });

    // /**
    //  * 传真-预览
    //  **/
    // $('#fileTableFax').delegate('.btn-watch', 'click', function () {
    //     var path = $(this).attr("_file");

    //     //使用alternatiff插件方式 必须在值班电脑上安装
    //     path = "../Uploads/fax/FAX_TIF/" + path;
    //     //判断文件是否存在
    //     var isExist = post_webservice_json("{'path':'" + path + "'}", "DutyFile.aspx/getFileExist");
    //     if (isExist) {
    //         $('#modalView .modal-body').empty();
    //         $('#modalView .modal-body').append(getFaxTiff(path, _fax_watch_width, _fax_watch_height));
    //         $("#modalView").modal({ backdrop: 'static', keyboard: false, show: true });
    //     }
    //     else {
    //         alert("文件不存在！");
    //     }
    // });

    // /**
    //  * 传真-下载(不兼容download属性处理)
    //  **/
    // $('#fileTableFax').delegate('.btn-download', 'click', function () {
    //     $("#_hid_file").val($(this).attr("_file"));        
    //     $("#btnExportConsult")[0].click();
    // });
    
    // /**
    //  * 已选传真列表
    //  **/
    // function initTableFax(strFiles) {
    //     if (strFiles == "")
    //         return;

    //     //是否支持download属性
    //     var isSupportDownload = 'download' in document.createElement('a');

    //     $("#fileTableFax tr").remove();
    //     var files = strFiles.split(";");
    //     for (var i = 0; i < files.length; i++) {
    //         if (files[i] == "")
    //             continue;

    //         var temp = "<tr><td class='td-name'>" + files[i].substr(7) + "</td>";
    //         temp += "<td><button class='btn btn-default btn-watch' _file='" + files[i] + "'><span class='fa fa-file-image-o'></span>&nbsp;&nbsp;预览</button></td>";
    //         //if (isSupportDownload) {
    //         //    temp += "<td><a href='" + "../Uploads/fax/FAX_TIF/" + files[i] + "' class='btn btn-default' download='" + files[i].substr(7) + "'><span class='fa fa-download'></span>&nbsp;&nbsp;下载</a></td>";
    //         //} else {
    //         temp += "<td><button class='btn btn-default btn-download' _file='" + "../Uploads/fax/FAX_TIF/" + files[i] + "'><span class='fa fa-download'></span>&nbsp;&nbsp;下载</button></td>";
    //         //}
    //         temp += "</tr>";
    //         $("#fileTableFax").append(temp);
    //     }
    // }

    // //判断浏览器类型 
    //  function myBrowser(){
    //      //取得浏览器的userAgent字符串 
    //      var userAgent = navigator.userAgent; 
    //      var isOpera = userAgent.indexOf("Opera") > -1;
    //      //判断是否Opera浏览器 
    //      if (isOpera) { 
    //          return "Opera" 
    //      }; 
    //      //判断是否Firefox浏览器
    //      if (userAgent.indexOf("Firefox") > -1) {
    //          return "FF"; 
    //      } 
    //      //判断是否Chrome浏览器
    //      if (userAgent.indexOf("Chrome") > -1){
    //          return "Chrome";
    //      } 
    //      //判断是否Safari浏览器 
    //      if (userAgent.indexOf("Safari") > -1) {
    //          return "Safari"; 
    //      } 
    //      //判断是否IE浏览器
    //      if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
    //          return "IE"; 
    //      }; 
    //      //判断是否Edge浏览器
    //      if (userAgent.indexOf("Trident") > -1) { 
    //          return "Edge"; 
    //      } 
    //  }
    // function SaveAs5(imgURL) { 
    //     var oPop = window.open(imgURL,"","width=1, height=1, top=5000, left=5000"); 
    //     for(; oPop.document.readyState != "complete"; ) {
    //         if (oPop.document.readyState == "complete") break; 
    //     } 
    //     oPop.document.execCommand("SaveAs"); 
    //     oPop.close();
    // } 
    // function oDownLoad(url) {
    //     myBrowser();
        
    //     if (myBrowser()==="IE"||myBrowser()==="Edge"){ 
    //         //IE 
    //         ele.href="#";
            
    //         var oImg=document.createElement("img");
            
    //         oImg.src=url;
            
    //         oImg.id="downImg";
            
    //         var odown=document.getElementById("down");
            
    //         odown.appendChild(oImg); 
            
    //         SaveAs5(document.getElementById('downImg').src)
            
    //     }else{
    //         //!IE 
    //         ele.href=url; 
                
    //         ele.download="";
    //     } 
    // }
    ///////////////////////////////////////////////传真记录/////////////////////////////////////////////////

    ///////////////////////////////////////////////交换系统文件/////////////////////////////////////////////
    /**
     * 查询按钮事件
     **/
    // $("#btnSearchFax_On").click(function () {
    //     tableFax_On.fnDraw();
    // });

    // /**
    //  * 新增按钮事件
    //  **/
    // $("#btnAddFax_On").click(function () {
    //     _id_fax_online = "";
    //     _time_fax_online = "";
    //     _file_fax_online = "";
    //     $("#errorFax_On").text("");
    //     $("#txtUnitFax_On,#txtRefNo_On,#txtFileName_On,#txtSuggestion_On,#txtContentFax_On").val("");
    //     $("#revTypeFax_On").val("1");
    //     //已传文档表格-清空
    //     $("#fileTableFax_On tr").remove();
    //     $("#btnChooseOrgan").attr("disabled", false);

    //     //只读相关控制-取消        
    //     _fax_online_only_watch = "";
    //     $("#txtUnitFax_On,#txtRefNo_On,#txtFileName_On,#txtSuggestion_On,#txtContentFax_On").attr("readonly", false);
    //     $("#revTypeFax_On").attr("disabled", false);
    //     $("#txtFax_On .swfupload").css("display", "block");
    //     $(".btnSaveFax_On").show();

    //     //现在弹出框
    //     $("#modalFax_On").modal({ backdrop: 'static', keyboard: false, show: true });
    // });

    // /**
    //  * 交换系统文件-编辑按钮事件
    //  **/
    // $('#faxTable_On tbody').on('click', '.btn_edit,.btn_watch', function () {
    //     //是否只读
    //     if ($(this).hasClass("btn_watch")) {
    //         _fax_online_only_watch = "1";
    //     } else {
    //         _fax_online_only_watch = "";
    //     }

    //     $("#errorFax_On").text("");
    //     var aData = tableFax_On.fnGetData(this.parentNode.parentNode);
    //     _id_fax_online = aData.id;

    //     //获取交换系统文件
    //     var col = jQuery.parseJSON(post_webservice_json("{'id':'" + _id_fax_online + "'}", "DutyFile.aspx/getDutyFaxById"));
    //     if (col.length < 1) {
    //         alert("获取交换系统文件失败！");
    //         return;
    //     }

    //     //赋值
    //     _time_fax_online = col[0]["time"];
    //     $("#revTypeFax_On").val(col[0]["isRev"]);
    //     $("#txtUnitFax_On").val(col[0]["units"]);
    //     $("#txtRefNo_On").val(col[0]["refNo"]);
    //     $("#txtFileName_On").val(col[0]["fileName"]);
    //     $("#txtSuggestion_On").val(col[0]["suggestion"]);
    //     $("#txtContentFax_On").val(col[0]["content"]);
    //     _file_fax_online = col[0]["tiffName"];

    //     if (_fax_online_only_watch == "1") {
    //         $("#txtUnitFax_On,#txtRefNo_On,#txtFileName_On,#txtSuggestion_On,#txtContentFax_On").attr("readonly", true);
    //         $("#revTypeFax_On").attr("disabled", true);
    //         $("#btnChooseOrgan").attr("disabled", true);
    //         $("#txtFax_On .swfupload").css("display", "none");
    //         $(".btnSaveFax_On").hide();
    //     } else {
    //         $("#txtUnitFax_On,#txtRefNo_On,#txtFileName_On,#txtSuggestion_On,#txtContentFax_On").attr("readonly", false);
    //         $("#revTypeFax_On").attr("disabled", false);
    //         $("#btnChooseOrgan").attr("disabled", false);
    //         $("#txtFax_On .swfupload").css("display", "block");
    //         $(".btnSaveFax_On").show();
    //     }

    //     //初始化文档表格-会商
    //     addFileTable("fileTableFax_On", col[0]["tiffName"], "0", "fax_online");
    //     //弹出框
    //     $("#modalFax_On").modal({ backdrop: 'static', keyboard: false, show: true });
    // });

    // /**
    //  * 交换系统文件-删除按钮事件
    //  **/
    // $('#faxTable_On tbody').on('click', 'button.btn_del', function () {
    //     var aData = tableFax_On.fnGetData(this.parentNode.parentNode);
    //     _del_id_fax_online = aData.id;
    //     _del_type = "4";

    //     $("#labDel").text("确定删除该交换系统文件？ ");
    //     $("#modalDel").modal({ backdrop: 'static', keyboard: false, show: true });
    // });

    // /**
    //  * 保存交换系统文件事件
    //  **/
    // $(".btnSaveFax_On").click(function () {
    //     var isRev = $("#revTypeFax_On").val();
    //     var units = $("#txtUnitFax_On").val();
    //     var refNo = $("#txtRefNo_On").val();
    //     var fileName = $("#txtFileName_On").val();
    //     var content = $("#txtContentFax_On").val();
    //     var suggestion = $("#txtSuggestion_On").val();

    //     //数据校验
    //     if (units == "") {
    //         $("#errorFax_On").text("发文单位不能为空！");
    //         return;
    //     }
    //     if (_file_fax_online == "") {
    //         $("#errorFax_On").text("请选择交换系统文件！");
    //         return;
    //     }
    //     if (fileName == "") {
    //         $("#errorFax_On").text("文件名称不能为空！");
    //         return;
    //     }

    //     //保存数据
    //     var _arr = [{ id: _id_fax_online, time: _time_fax_online, isRev: isRev, units: units, refNo: refNo, tiffName: _file_fax_online, fileName: fileName, content: content, suggestion: suggestion, itemTel: "", itemTime: "", type: "1", updateUser: _duty_user_name, date: _time_fax_online }];
    //     var resSave = post_webservice_json("{'data':'" + JSON.stringify(_arr) + "'}", "DutyFile.aspx/saveDutyFax");
    //     if (resSave > 0) {
    //         $("#errorFax").text("交换系统文件保存成功！");
    //         if (_id_fax_online == "")
    //             _id_fax_online = resSave.toString();
    //         //关闭弹出框
    //         $("#modalFax_On").modal("hide");
    //         //刷新表格
    //         tableFax_On.fnDraw(false);
    //     } else {
    //         $("#errorFax_On").text("交换系统文件保存失败！");
    //         return;
    //     }
    // });

    ///////////来文单位相关 add by hzx 2018-07-12
    //来文单位数据源
    // var arrFileOrgan = new Array();
    // /**
    //  * 选择按钮
    //  **/
    // $("#btnChooseOrgan").click(function () {
    //     //弹出modal框
    //     $("#modalFileOrgan").modal({ backdrop: 'static', keyboard: false, show: true });
    // });
    // /**
    //  * 初始化列表
    //  **/
    // function initFileOrgan() {
    //     $("#ulOrgan li").remove();
    //     $("#ulOrganAbbr li").remove();
    //     arrFileOrgan = new Array();
    //     $.ajax({
    //         headers:{
    //             "Authorization" : token
    //         },
    //         type: 'get',
    //         url: baseUrl + "/dutyRecord/getDutyFileOrganAll",
    //         success: function(res){
    //             var temp = "";
    //             $.each(res.data, function (index, obj) {
    //                 temp += "<li _abbr='" + obj["abbr"] + "'>" + obj["name"] + "</li>";
    //                 arrFileOrgan.push(obj);
    //             });
    //             $("#ulOrgan").append(temp);
    //         }
    //     });
    //     // var colList = jQuery.parseJSON(post_webservice("DutyFileOrgan.aspx/getDutyFileOrganAll"));
    // }
    // //初始化列表
    // initFileOrgan();

    // /**
    //  * 来文单位 单击事件
    //  **/
    // $("#ulOrgan").delegate("li", "click", function () {
    //     var abbr = $(this).attr("_abbr");

    //     //添加文号列表
    //     $("#ulOrganAbbr li").remove();
    //     var arr = abbr.split(";");
    //     var temp = "";
    //     for (var i = 0; i < arr.length; i++) {
    //         if (arr[i] == "")
    //             continue;

    //         temp += "<li>" + arr[i] + "</li>";
    //     }
    //     $("#ulOrganAbbr").append(temp);

    //     //选中状态切换
    //     $("#ulOrgan li").removeClass("active");
    //     $(this).addClass("active");

    //     //若文号只有一个-默认选中
    //     if (arr.length == 1) {
    //         $("#ulOrganAbbr li").addClass("active");
    //     }
    // });

    // /**
    //  * 文号 单击事件
    //  **/
    // $("#ulOrganAbbr").delegate("li", "click", function () {
    //     $("#ulOrganAbbr li").removeClass("active");
    //     $(this).addClass("active");
    // });

    // /**
    //  * 来文单位-确定按钮
    //  **/
    // $(".btnSureFileOrgan").click(function () {
    //     $("#errorFileOrgan").text("");

    //     //校验是否选中 来文单位+文号
    //     var _name = $("#ulOrgan li.active").text();
    //     var _abbr = $("#ulOrganAbbr li.active").text();
    //     if (_name == null || _name == "" || _name == undefined) {
    //         $("#errorFileOrgan").text("请先选择来文单位！");
    //         return;
    //     }
    //     if (_abbr == null || _abbr == "" || _abbr == undefined) {
    //         $("#errorFileOrgan").text("请先选择文号！");
    //         return;
    //     }

    //     //赋值
    //     $("#txtUnitFax_On").val(_name);
    //     $("#txtRefNo_On").val(_abbr + "【" + new Date().getFullYear() + "】");

    //     //隐藏model
    //     $("#modalFileOrgan").modal("hide");
    // });
    ///////////////////////////////////////////////交换系统文件/////////////////////////////////////////////

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
        //$("#txtBeginTimeC").val(addHours($.format.date(new Date(), "yyyy-MM-dd HH:mm"),-1));
        //$("#txtEndTimeC").val($.format.date(new Date(), "yyyy-MM-dd HH:mm"));                
        $("#txtBeginTimeC,#txtHost,#txtAttendees,#txtAttend,#txtContent").val("");
        //$("#txtEndTimeC").val("");
        $("#txtName").val("山东防汛会商会");
        $("#txtPlace").val("山东防汛会商室");
        //$("#txtConslusion").val("");
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

        //赋值
        $("#txtBeginTimeC").val($.format.date(new Date(Date.parse(col["beginTime"].replace(/-/g, "/"))), "yyyy-MM-dd HH:mm:ss"));
        //$("#txtEndTimeC").val($.format.date(new Date(Date.parse(col[0]["endTime"].replace(/-/g, "/"))), "yyyy-MM-dd HH:mm"));
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
        addFileTable("fileTableConsult", col["docment"], "0", "consult");
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
        }
        // else if (_del_type == "4") {            //交换系统文件
        //     var res = post_webservice_json("{'id':'" + _del_id_fax_online + "','type':'1'}", "DutyFile.aspx/delDutyFax");
        //     if (res) {
        //         //关闭model
        //         $("#modalDel").modal("hide");
        //         //判断当前页是否只有一条数据
        //         var start = $("#faxTable_On").dataTable().fnSettings()._iDisplayStart;
        //         var total = $("#faxTable_On").dataTable().fnSettings().fnRecordsDisplay();
        //         if ((total - start) == 1) {
        //             $("#faxTable_On").dataTable().fnPageChange("previous", true);
        //         } else {
        //             //刷新表格
        //             tableFax_On.fnDraw(false);
        //         }
        //     } else {
        //         alert("交换系统文件删除失败！");
        //         return;
        //     }
        // }
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

        //校验
        // var fileVal = $("#fileExport").val();
        // if (fileVal == "") {
        //     $("#errorExport").text("请先选择文件！");
        //     return;
        // }

        //获取文件名
        // var fileName = fileVal.substring(fileVal.lastIndexOf("\\") + 1);
        // if (fileVal.substring(fileName.lastIndexOf(".") + 1).indexOf("xls") <= -1) {
        //     $("#errorExport").text("请先选择excel文件！");
        //     return;
        // }

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
        //if (endTime == "") {
        //    $("#errorConsult").text("结束时间不能为空！");
        //    return;
        //}
        //if (new Date(beginTime) > new Date(endTime)) {
        //    $("#errorConsult").text("开始时间不能大于结束时间！");
        //    return;
        //}
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
    function addFileTable(tableId, strFiles, type, file_name) {
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

                    var temp = "<tr><td class='td-name'><a href='../Uploads/" + file_name + "/" + files[i] + "'>" + files[i] + "</a></td>";
                    temp += "<td><button class='btn btn-default btn-del' _file='" + files[i] + "' " + only_watch + "><span class='fa fa-trash-o'></span>&nbsp;&nbsp;删除</button></td></tr>";
                    $("#" + tableId + "").append(temp);
                }
                break;
            case "1":
                var temp = "<tr><td class='td-name'><a href='../Uploads/" + file_name + "/" + strFiles + "'>" + strFiles + "</a></td>";
                temp += "<td><button class='btn btn-default btn-del' _file='" + strFiles + "'><span class='fa fa-trash-o'></span>&nbsp;&nbsp;删除</button></td></tr>";
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
            alert("获取共享文件失败！");
            return;
        }

        //赋值
        $("#fileType2").val(col["fileType"]);
        $("#txtContentDoc").val(col["content"]);
        _file_doc = col["fileName"];

        //初始化文档表格
        addFileTable("fileTableDoc", col["fileName"], "0", "doc");
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

        $("#labDel").text("确定删除该共享文件？ ");
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
        if (fileObjDoc == "") {
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
            $("#errorDoc").text("共享文件保存成功！");
            if (_id_doc == "")
                _id_doc = resSave.toString();
            //关闭弹出框
            $("#modalDoc").modal("hide");
            //刷新表格
            tableDoc.fnDraw(false);
        } else {
            $("#errorDoc").text("共享文件保存失败！");
            return;
        }
    });
    //////////////////////////////////////////////共享文件/////////////////////////////////////////////////

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
        } else if ($(this).text() == "共享文件") {
            //强制设置宽度 datatables不显示时 宽度都改为0了
            $("#docTable th:eq(0)").css("width", "110px");
            $("#docTable th:eq(1)").css("width", "260px");
            $("#docTable th:eq(2)").css("width", "auto");
            $("#docTable th:eq(3)").css("width", "140px");
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
        }

    }

    /**
     * 初始化上传控件
     **/
    // function initUploadify(type) {
    //     switch (type) {
    //         case "2":
    //             //初始化交换系统文件-文件上传
    //             $("#txtFax_On").uploadify({
    //                 'swf': '../lib/uploadify/uploadify.swf',    //uploadify.swf 文件的相对路径
    //                 'uploader': 'UploadHandler.ashx',
    //                 'method': 'post',                  //提交方式
    //                 'width': '100',
    //                 'height': '30',                     //设置浏览按钮的高度 ，默认值30
    //                 'formData': { "_type": "fax_online", "id": _id_fax_online, "updateUser": _duty_user_name },   //JSON格式上传每个文件的同时提交到服务器的额外数据,可在’onUploadStart’事件中使用’settings’方法动态设置。
    //                 'fileTypeExts': '*.doc;*.docx;*.xls;*.xlsx;*.pdf;*.txt;*.png;*.jpg;', //设置可以选择的文件的类型，格式如：’*.doc;*.pdf;*.rar’ 。
    //                 'fileSizeLimit': '100MB',             //上传文件的大小限制 ，如果为整数型则表示以KB为单位的大小，如果是字符串，则可以使用(B, KB, MB, or GB)为单位，比如’2MB’ 如果设置为0则表示无限制
    //                 'fileObjName': 'Filedata',            //文件上传对象的名称
    //                 'buttonText': '添加文档',             //浏览按钮的文本
    //                 'buttonClass': 'upload_btn',          //按钮样式
    //                 'auto': true,                         //是否自动上传
    //                 'checkExisting': false,               //文件上传重复性检查程序，检查即将上传的文件在服务器端是否已存在，存在返回1，不存在返回0
    //                 'itemTemplate': false,                //用于设置上传队列的HTML模版，可以使用以下标签：
    //                 'multi': true,                       //是否允许多个同时上传
    //                 'progressData': 'percentage',         //设置上传进度显示方式，percentage显示上传百分比，speed显示上传速度

    //                 //选择文件
    //                 'onSelect': function (file) {
    //                     $("#errorFax_On").text("");
    //                 },
    //                 //选择文件失败
    //                 'onSelectError': function (file, errorCode, errorMsg) {
    //                     $("#errorFax_On").text(errorMsg);
    //                 },
    //                 //文件上传成功触发
    //                 'onUploadSuccess': function (file, data, response) {
    //                     if (data == "1") {
    //                         $("#errorFax_On").text("交换系统文件上传成功！");
    //                         //更新录音文件名称
    //                         if (_file_fax_online == "") {
    //                             _file_fax_online = file.name;
    //                             $("#txtFileName_On").val(file.name.replace(file.type, ""));
    //                         } else {
    //                             _file_fax_online += ";" + file.name;
    //                         }
    //                         //文件表格添加
    //                         addFileTable("fileTableFax_On", file.name, "1", "fax_online");
    //                     } else {
    //                         $("#errorFax_On").text("交换系统文件已存在，请重新选择！");
    //                     }
    //                 }
    //             });
    //             break;
    //         case "3":
    //             //初始化会商记录-文件上传
    //             $("#txtConsult").uploadify({
    //                 'swf': '../lib/uploadify/uploadify.swf',    //uploadify.swf 文件的相对路径
    //                 'uploader': baseUrl + 'file/uploadFile',
    //                 'method': 'post',                  //提交方式
    //                 'width': '100',
    //                 'height': '30',                     //设置浏览按钮的高度 ，默认值30
    //                 'formData': { "_type": "consult", "id": _id_consult, "updateUser": _duty_user_name },   //JSON格式上传每个文件的同时提交到服务器的额外数据,可在’onUploadStart’事件中使用’settings’方法动态设置。
    //                 'fileTypeExts': '*.doc;*.docx;*.xls;*.xlsx;*.pdf;*.txt;*.png;*.jpg;*.rmvb;*.avi;*.mp4;*.flv;', //设置可以选择的文件的类型，格式如：’*.doc;*.pdf;*.rar’ 。
    //                 'fileSizeLimit': '100MB',             //上传文件的大小限制 ，如果为整数型则表示以KB为单位的大小，如果是字符串，则可以使用(B, KB, MB, or GB)为单位，比如’2MB’ 如果设置为0则表示无限制
    //                 'fileObjName': 'Filedata',            //文件上传对象的名称
    //                 'buttonText': '添加文档',             //浏览按钮的文本
    //                 'buttonClass': 'upload_btn',          //按钮样式
    //                 'auto': true,                         //是否自动上传
    //                 'checkExisting': false,               //文件上传重复性检查程序，检查即将上传的文件在服务器端是否已存在，存在返回1，不存在返回0
    //                 'itemTemplate': false,                //用于设置上传队列的HTML模版，可以使用以下标签：
    //                 'multi': true,                       //是否允许多个同时上传
    //                 'progressData': 'percentage',         //设置上传进度显示方式，percentage显示上传百分比，speed显示上传速度

    //                 //选择文件
    //                 'onSelect': function (file) {
    //                     $("#errorConsult").text("");
    //                 },
    //                 //选择文件失败
    //                 'onSelectError': function (file, errorCode, errorMsg) {
    //                     $("#errorConsult").text(errorMsg);
    //                 },
    //                 //文件上传成功触发
    //                 'onUploadSuccess': function (file, data, response) {
    //                     if (data == "1") {
    //                         $("#errorConsult").text("会商文档上传成功！");
    //                         //更新录音文件名称
    //                         if (_file_consult == "")
    //                             _file_consult = file.name;
    //                         else
    //                             _file_consult += ";" + file.name;
    //                         //文件表格添加
    //                         addFileTable("fileTableConsult", file.name, "1", "consult");
    //                     } else {
    //                         $("#errorConsult").text("会商文档已存在，请重新选择！");
    //                     }
    //                 }
    //             });
    //             break;
    //         case "4":
    //             //初始化收发文档-文件上传
    //             $("#txtDoc").uploadify({
    //                 'swf': '../lib/uploadify/uploadify.swf',    //uploadify.swf 文件的相对路径
    //                 'uploader': 'UploadHandler.ashx',
    //                 'method': 'post',                  //提交方式
    //                 'width': '100',
    //                 'height': '30',                     //设置浏览按钮的高度 ，默认值30
    //                 'formData': { "_type": "doc", "id": _id_doc, "updateUser": _duty_user_name },   //JSON格式上传每个文件的同时提交到服务器的额外数据,可在’onUploadStart’事件中使用’settings’方法动态设置。
    //                 'fileTypeExts': '*.doc;*.docx;*.xls;*.xlsx;*.pdf;*.txt;*.png;*.jpg;*.rmvb;*.avi;*.mp4;*.flv;', //设置可以选择的文件的类型，格式如：’*.doc;*.pdf;*.rar’ 。
    //                 'fileSizeLimit': '100MB',             //上传文件的大小限制 ，如果为整数型则表示以KB为单位的大小，如果是字符串，则可以使用(B, KB, MB, or GB)为单位，比如’2MB’ 如果设置为0则表示无限制
    //                 'fileObjName': 'Filedata',            //文件上传对象的名称
    //                 'buttonText': '添加文件',             //浏览按钮的文本
    //                 'buttonClass': 'upload_btn',          //按钮样式
    //                 'auto': true,                         //是否自动上传
    //                 'checkExisting': false,               //文件上传重复性检查程序，检查即将上传的文件在服务器端是否已存在，存在返回1，不存在返回0
    //                 'itemTemplate': false,                //用于设置上传队列的HTML模版，可以使用以下标签：
    //                 'multi': true,                       //是否允许多个同时上传
    //                 'progressData': 'percentage',         //设置上传进度显示方式，percentage显示上传百分比，speed显示上传速度

    //                 //选择文件
    //                 'onSelect': function (file) {
    //                     $("#errorDoc").text("");
    //                 },
    //                 //选择文件失败
    //                 'onSelectError': function (file, errorCode, errorMsg) {
    //                     $("#errorDoc").text(errorMsg);
    //                 },
    //                 //文件上传成功触发
    //                 'onUploadSuccess': function (file, data, response) {
    //                     if (data == "1") {
    //                         $("#errorDoc").text("共享文件上传成功！");
    //                         //更新文件名称
    //                         if (_file_doc == "")
    //                             _file_doc = file.name;
    //                         else
    //                             _file_doc += ";" + file.name;
    //                         //文件表格添加
    //                         addFileTable("fileTableDoc", file.name, "1", "doc");
    //                     } else {
    //                         $("#errorDoc").text("共享文件已存在，请重新选择！");
    //                     }
    //                 }
    //             });
    //             break;
    //     }
    // }
});