$(function () {
    //修改网页标题
    $("title").html(_system_name + $("title").html());
    //当前登陆名
    var _duty_user_name = "<%=_duty_user_name%>";
    //当前类别
    var _type = "1";
    //待选列表array
    var arrNot = new Array();
    //模糊查询结果列表
    var arrFuzzy = new Array();
    //已选列表array
    var arrYes = new Array();
    //删除的站码
    var _del_stcd = "";

    //获取待选列表
    initArr();

    //查询列表
    var table = null;
    table = $('#stationTable').dataTable({
        "bProcessing": true,             //进度
        "bScrollCollapse": true,         //高度自适应
        "bPaginate": true,               //显示分页器
        "bLengthChange": true,           //改变每页数量
        "aLengthMenu": [10, 25, 50],     //记录数选项
        "iDisplayLength": 10,            //默认记录数
        "bFilter": false,                //启动过滤、搜索功能
        "bSort": false,                  //是否启动各个字段的排序功能
        "bStateSave": true,              //客户端状态记录功能
        "sPaginationType": "full_numbers", //详细分页组
        "bJQueryUI": false,               //是否使用 jQury的UI them
        "aoColumns": [{
            "mDataProp": "id",
            "sDefaultContent": "", //此列默认值为""，以防数据中没有此值，DataTables加载数据的时候报错  
            "bVisible": false //此列不显示  
        }, {
            "mDataProp": "stcd"
        }, {
            "mDataProp": "stnm"
        }, {
            "mDataProp": "",
            "sTitle": "操作",
            "sDefaultContent": "Edit"
        }
        ],
        "oLanguage": {     //国际化配置  
            "sProcessing": "<img src='../Img/loading.gif'/>",
            "sLengthMenu": "每页显示 _MENU_ 条",
            "sZeroRecords": "没有主要站点信息",
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
            var txtHtml = "<button id='btnDel' class='btn btn-default btn_del' type='button'><span class='fa fa-trash-o'></span>&nbsp;&nbsp;删除</button>";
            $('td:eq(2)', nRow).html(txtHtml);

            return nRow;
        },
        "bServerSide": true,             //服务器端
        "sAjaxSource": "DutyStation.aspx/getDutyStation",
        //查询条件
        "fnServerParams": function (aoData) {
            aoData.push({ "name": "search_type", "value": $("#listType").val() });
        },
        //服务器端，数据回调处理
        "fnServerData": function (sSource, aoData, fnCallback) {
            $.ajax({
                "type": "POST",
                "contentType": "application/json; charset=utf-8",
                "dataType": 'json',
                "url": sSource,
                "data": "{'data':'" + JSON.stringify(aoData) + "'}",
                "success": function (data) {
                    var resultCollection = jQuery.parseJSON(data.d);
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
        
        //获取新的待选列表
        if (_type != $("#listType").val()) {
            _type = $("#listType").val();
            initArr();
        }
    });

    /**
     * 模糊查询
     **/
    $("#txtName").keyup(function () {
        var val = $.trim($(this).val());
        arrFuzzy = new Array();

        if (val == "") {
            arrFuzzy = arrNot;
        } else {
            //获取符合条件的值
            $.each(arrNot, function (index, obj) {
                if (obj["STCD"].indexOf(val) > -1 || obj["STNM"].indexOf(val) > -1 || obj["PHCD"].indexOf(val.toUpperCase()) > -1) {
                    arrFuzzy.push(obj);
                }
            });
        }

        //重新生成列表
        $("#ulNot li").remove();
        var tempNot = "";

        $.each(arrFuzzy, function (index, obj) {
            tempNot += "<li _stcd='" + obj["STCD"] + "' _stnm='" + obj["STNM"] + "' _phcd='" + obj["PHCD"] + "'>" + obj["STCD"] + "--" + obj["STNM"] + "</li>";
        });
        $("#ulNot").append(tempNot);
    });

    /**
     * 待选列表 单击事件
     **/
    $("#ulNot").delegate("li", "click", function () {
        var stcd = $(this).attr("_stcd");
        var tempObj = new Object();

        //左侧列表删除
        $(this).remove();
        //待选arr删除
        $.each(arrNot, function (index, obj) {
            if (obj["STCD"] == stcd) {
                tempObj = obj;
                arrNot.splice(index, 1);
                return false;
            }
        });

        //右侧列表添加
        $("#ulYes").append("<li _stcd='" + tempObj["STCD"] + "' _stnm='" + tempObj["STNM"] + "' _phcd='" + tempObj["PHCD"] + "'>" + tempObj["STCD"] + "--" + tempObj["STNM"] + "</li>");
        //已选arr添加
        arrYes.push(tempObj);
    });

    /**
     * 已选列表 单击事件
     **/
    $("#ulYes").delegate("li", "click", function () {
        var stcd = $(this).attr("_stcd");
        var tempObj = new Object();

        //右侧列表删除
        $(this).remove();
        //已选arr删除
        $.each(arrYes, function (index, obj) {
            if (obj["STCD"] == stcd) {
                tempObj = obj;
                arrYes.splice(index, 1);
                return false;
            }
        });

        //左侧列表添加
        $("#ulNot").append("<li _stcd='" + tempObj["STCD"] + "' _stnm='" + tempObj["STNM"] + "' _phcd='" + tempObj["PHCD"] + "'>" + tempObj["STCD"] + "--" + tempObj["STNM"] + "</li>");
        //待选arr添加
        arrNot.push(tempObj);
    });


    /**
     * 保存按钮事件
     **/
    $("#btnSave").click(function () {
        if ($("#ulYes li").length == 0) {
            $(".errorInfo").text("请先选择站点！");
            return;
        }

        //发送数据格式 类别*站码,站名#站码,站名。。。
        var data = _type + "*";
        $("#ulYes li").each(function (index, element) {
            data += $(this).attr("_stcd") + "," + $(this).attr("_stnm") + "#";
        });
        data = data.substr(0, data.length - 1);

        //保存数据
        var resSave = post_webservice_json("{'data':'" + data + "'}", "DutyStation.aspx/saveDutyStation");
        if (resSave)
        {
            $(".errorInfo").text("保存站点成功！");
            //刷新表格数据
            $("#listType").val(_type);
            table.fnDraw();
            //初始化待选列表
            initArr();
        } else {
            $(".errorInfo").text("保存站点失败！");
            return;
        }
    });

    /**
     * 删除按钮事件
     **/
    $('#stationTable tbody').on('click', 'button.btn_del', function () {
        var aData = table.fnGetData(this.parentNode.parentNode);
        _del_stcd = aData.stcd;

        $("#labDel").text("确定删除站点【" + aData.stnm + "】？");
        $("#modalDel").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 删除按钮确定事件
     **/
    $(".btnDelSure").click(function () {
        var res = post_webservice_json("{'type':'" + _type + "','stcd':'" + _del_stcd + "'}", "DutyStation.aspx/delDutyStation");
        if (res) {
            //关闭model
            $("#modalDel").modal("hide");
            //判断当前页是否只有一条数据
            var start = $("#stationTable").dataTable().fnSettings()._iDisplayStart;
            var total = $("#stationTable").dataTable().fnSettings().fnRecordsDisplay();
            if ((total - start) == 1) {
                $("#stationTable").dataTable().fnPageChange("previous", true);
            } else {
                //刷新表格
                table.fnDraw(false);
            }

            //初始化待选列表
            initArr();
        } else {
            alert("删除站点失败！");
            return;
        }
    });

    /**
     * 初始化列表
     **/
    function initArr() {
        //先清空
        $("#ulNot li").remove();
        $("#ulYes li").remove();
        arrNot = new Array();
        arrFuzzy = new Array();
        arrYes = new Array();
        var colList = jQuery.parseJSON(post_webservice_json("{'type':'" + $("#listType").val() + "'}", "DutyStation.aspx/getDutyStationNot"));
        var temp = "";
        $.each(colList, function (index, obj) {
            temp += "<li _stcd='" + obj["STCD"] + "' _stnm='" + obj["STNM"] + "' _phcd='" + obj["PHCD"] + "'>" + obj["STCD"] + "--" + obj["STNM"] + "</li>";

            if (obj["PHCD"] == "") {
                obj["PHCD"] = pinyin.getCamelChars(obj["STNM"]);
            } else {
                obj["PHCD"] = obj["PHCD"].toUpperCase();
            }
            arrNot.push(obj);
        });
        $("#ulNot").append(temp);
    }

    //屏幕大小改变事件 自适应
    resize();

    $(window).resize(function () {
        resize();
    });

    function resize() {
        $('#stationTable_wrapper,#stationTable').css('width', $(window).width() - 530);
    }
});