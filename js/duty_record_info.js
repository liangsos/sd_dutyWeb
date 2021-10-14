// $(document).ajaxError(function (event, request, settings) {
//     // console.log(request.status);
//     if (request.status == 401) {
//         window.location.replace("/page/DutyLogin.html");
//     }
// });

$(function () {
    // const baseUrl = "http://localhost:8088/sd-duty/api/";
    // const token = sessionStorage.getItem("sessionId");
    var token = $.session.get("sessionId");
    //登陆人员
    const _duty_user_name = sessionStorage.getItem("userName");
    //值班真实姓名
    const _duty_name = sessionStorage.getItem("realName");
    //值班角色
    var _duty_role = sessionStorage.getItem("roleId");
    //日期-今天
    var _duty_time_today = sessionStorage.getItem("_duty_time_today");
    //编辑日期
    var _duty_date = sessionStorage.getItem("duty_date");
    //今天的值班人员
    var _duty_member = "";
    //防汛抗旱工作ID
    var _duty_fxkh_id = "";
    //来电记录当前选中ID
    var _duty_tel_id = "";
    //来电记录 录音文件名称
    var _duty_tel_audio = "";
    //值班记录 来电记录 传真记录操作权限为：
    //管理员 当天的值班人员 或者最后一次接班的值班人员可以修改当天的记录
    //如：20170401的值班人员可在20170402 08：30时 新增来电记录等（未接班情况下）
    var isLastDutyUser = false;
    //今天是否值班
    var _is_duty = "";
    var tel_pause_tag = true;
    //值班人员信息
    var tempRecord = "";

    $("title").html(_system_name + $("title").html());

    //防汛抗旱工作是否可编辑
    var duty_fxkh_editable = false;
    //来电记录是否可编辑
    var duty_record_tel_editable = false;
    
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
                window.parent.updLoginUser(_duty_name, _duty_today);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });

    //初始化上传控件
    // initUploadify();

    //日期控件初始化
    $(".date-water").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd hh:00",
        weekStart: 1,
        autoclose: true,
        startView: 2,
        todayBtn: true,
        todayHighlight: true,
        minView: 1,
        forceParse: false,
        startDate: _duty_date,
        endDate: addDays(_duty_date, 1)
    });
    $(".date-rain").datetimepicker({
        language: 'zh-CN',
        format: "yyyy-mm-dd hh:ii",
        weekStart: 1,
        autoclose: true,
        startView: 2,
        todayBtn: true,
        todayHighlight: true,
        minView: 0,
        forceParse: false,
        startDate: addDays(_duty_date, -1),
        endDate: addDays(_duty_date, 1)
    });

    initDatePicker(".date-day", "yyyy-mm-dd", 2);

    //查询值班记录
    if (_duty_date != "") {
        showDuty();
    }

    /**
     * 弹出值班记录
     **/
    function showDuty() {
        $("#errorRecord,#errorZq,#errorTel,#errorFax,#errorFxkhxd,#errorConsult").text("");

        //先获取值班人员
        $.ajax({
            headers:{
                "Authorization" : token
            },
            type: "post",
            url: baseUrl + "dutyRecordUser/getDutyRecordToday",
            data: "time=" + _duty_date,
            async: false,
            success: function(res){
                tempRecord = res.data;
                if (tempRecord.length > 0) {
                    $(".record-title").append("<label class='title-label-bold'>日期：</label><label class='title-label'>" + _duty_date + "</label><label class='title-label-bold-left'>局领导：</label><label class='title-label'>" + tempRecord[0]["leaderComm"] + "</label><label class='title-label-bold-left'>带班：</label><label class='title-label'>" + tempRecord[0]["leader"] + "</label><label class='title-label-bold-left'>值班人员：</label><label class='title-label'>" + tempRecord[0]["member"] + "</label>");
                } else {
                    $(".record-title").append("<label class='title-label-bold'>日期：</label><label class='title-label'>" + _duty_date + "</label><label class='title-label-bold-left'>值班人员：</label><label class='title-label'>无</label>");
                }
            },
            error: function(err){
                console.error(err);
            }
        });

        //今日是否值班
        if (_duty_date == _duty_time_today && tempRecord.length > 0 && tempRecord[0]["member"].indexOf(_duty_name) > -1) {
            _is_duty = "1";
        }

        //当天的值班人员自动查询
        // if (_is_duty == "1") {
        //     reloadFax();
        // } else {
        //     reloadFax_2()
        // }

        //值班记录 来电记录 传真记录操作权限为：
        //管理员 当天的值班人员 或者最后一次接班的值班人员可以修改当天的记录
        //如：20210401的值班人员可在20210402 08：30时 新增来电记录等（未接班情况下）（废除逻辑）
        //新逻辑改为判断电脑IP，只要是值班电脑IP都能修改
        // $.ajax({
        //     headers:{
        //         "Authorization" : token
        //     },
        //     type: "get",
        //     url: baseUrl + "dutyRecord/getLastDutyUser",
        //     data: "time=" + _duty_date,
        //     success: function(res){
        //         console.log("res:"+res);
        //         isLastDutyUser = res.data;
        //     },
        //     error: function(err){
        //         console.error(err);
        //     }
        // });
        // console.log("isLastDutyUser:"+isLastDutyUser);
        // 获取防汛抗旱工作
        $.ajax({
            headers:{
                "Authorization" : token
            },
            type: "get",
            url: baseUrl + "dutyRecord/getFxkhByTime",
            data: "time=" + _duty_date,
            success: function(res){
                var tempFxkh = res.data;
                //有防汛抗旱情况
                if (tempFxkh.length > 0) {
                    _duty_fxkh_id = tempFxkh[0]["id"];
                    // $("#txtWaterInfo").val(tempFxkh[0]["waterInfo"]);
                    $("#txtWaterMain").val(tempFxkh[0]["waterMain"]);
                    $("#txtRainInfo").val(tempFxkh[0]["rainInfo"]);
                    $("#txtRainMain").val(tempFxkh[0]["rainMain"]);
        
                    //工情灾情
                    // $("#txtDisaster").val(tempFxkh[0]["disaster"]);
                    //防汛抗旱行动
                    // $("#txtAction").val(tempFxkh[0]["action"]);
                    //防汛会商
                    // $("#txtConsultTitle").val(tempFxkh[0]["consultTitle"]);
                    // $("#txtConsult").val(tempFxkh[0]["consult"]);
        
                    //管理员或者当天的值班人员可操作
                    if (_duty_role == "1" || (_duty_time_today == _duty_date && tempRecord.length > 0 && tempRecord[0]["member"].indexOf(_duty_name) > -1) || isLastDutyUser) {
                        setDutyEnabled("fxkh", false);
                        setDutyEnabled("gqzq", false);
                        setDutyEnabled("fxkhxd", false);
                        setDutyEnabled("consult", false);
                        $(".btnWaterInfo,.btnWaterMain,.btnWaterMainHd,.btnRainInfo,.btnRainMain").attr("disabled", false);
                        duty_fxkh_editable = true;
                    } else {
                        setDutyEnabled("fxkh", true);
                        setDutyEnabled("gqzq", true);
                        setDutyEnabled("fxkhxd", true);
                        setDutyEnabled("consult", true);
                        $(".btnWaterInfo,.btnWaterMain,.btnWaterMainHd,.btnRainInfo,.btnRainMain").attr("disabled", true);
                        duty_fxkh_editable = false;
                    }
                } else {
                    //无防汛抗旱工作情况
                    _duty_fxkh_id = "";
                    $("#txtWaterInfo,#txtWaterMain,#txtRainInfo,#txtRainMain,#txtDisaster,#txtAction,#txtConsultTitle,#txtConsult").val("");
        
                    //只有管理员可新增 或者 最新的接班人员可新增
                    // if (_duty_role == "1" || isLastDutyUser) {
                    //     setDutyEnabled("fxkh", false);
                    //     setDutyEnabled("gqzq", false);
                    //     setDutyEnabled("fxkhxd", false);
                    //     setDutyEnabled("consult", false);
                    //     $(".btnWaterInfo,.btnWaterMain,.btnWaterMainHd,.btnRainInfo,.btnRainMain").attr("disabled", false);
                    //     duty_fxkh_editable = true;
                    // } else {
                    //     setDutyEnabled("fxkh", true);
                    //     setDutyEnabled("gqzq", true);
                    //     setDutyEnabled("fxkhxd", true);
                    //     setDutyEnabled("consult", true);
                    //     $(".btnWaterInfo,.btnWaterMain,.btnWaterMainHd,.btnRainInfo,.btnRainMain").attr("disabled", true);
                    //     duty_fxkh_editable = false;
                    // }
                }
            },
            error: function(err){
                console.error(err);
            }
        });

        //管理员和当天的值班人员可编辑
        // if (_duty_role == "1" || (_duty_time_today == _duty_date && tempRecord.length > 0 && tempRecord[0]["member"].indexOf(_duty_name) > -1) || isLastDutyUser) {
        //     setDutyEnabled("phone", false);
        //     $(".btnAddTel").attr("disabled", false);
        //     $(".swfupload").css("display", "block");
        //     duty_record_tel_editable = true;
        // } else {
        //     setDutyEnabled("phone", true);
        //     $(".btnAddTel").attr("disabled", true);
        //     $(".swfupload").css("display", "none");
        //     duty_record_tel_editable = false;
        // }
        //默认清空
        $("#txtUnits,#txtTelephone,#txtContent").val("");
        //获取来电记录
        initRecordTel(_duty_date);

    }

    /**
     * 值班记录-保存
     **/
    $(".btnSave").click(function () {
        //保存水雨情
        if ($("#fxkh").hasClass("active")) {
            //废除逻辑，更改为只要是值班电脑IP都能够修改
            // console.log("duty_fxkh_editable:" +duty_fxkh_editable);
            // console.log("roleId"+_duty_role);
            // if (!duty_fxkh_editable) {
            //     $("#errorRecord").text("无权限修改水雨情！");
            //     return;
            // }

            //获取最新值
            // var waterInfo = $("#txtWaterInfo").val();
            var waterMain = $("#txtWaterMain").val();//水情
            var rainInfo = $("#txtRainInfo").val(); //雨情
            var rainMain = $("#txtRainMain").val();//值班概况
            var fxkh = new Object();
            fxkh.id = _duty_fxkh_id;
            fxkh.time = _duty_date;
            // fxkh.waterInfo = waterInfo;
            fxkh.waterMain = waterMain;
            // fxkh.rainInfo = rainInfo;
            // fxkh.rainMain = rainMain;

            //保存数据时在记录后标注上记录人和记录时间
            //记录人
            var dutyUser = _duty_name;
            //记录时间
            var notesTime = sysDate();
            fxkh.rainMain = rainMain + "——记录人:" + dutyUser + ",记录时间:" + notesTime;
            fxkh.rainInfo = rainInfo + "——记录人:" + dutyUser + ",记录时间:" + notesTime;
            fxkh.waterMain = waterMain + "——记录人:" + dutyUser + ",记录时间:" + notesTime;

            $.ajax({
                headers:{
                    "Authorization" : token
                },
                type: "post",
                contentType: "application/json; charset=utf-8",
                url: baseUrl + "dutyRecord/saveDutyFxkh",
                data: JSON.stringify(fxkh),
                success: function(res){
                    if (res.success) {
                        $("#errorRecord").text("保存雨水情成功！");
                        if (_duty_fxkh_id == "")
                            _duty_fxkh_id = res.data.id;
                    } else {
                        $("#errorRecord").text("保存雨水情失败！");
                        return;
                    }
                },
                error: function(err){
                    console.error(err);
                }
            });
        }

        //保存工情灾情
        // if ($("#gqzq").hasClass("active")) {
        //     if (!duty_fxkh_editable) {
        //         $("#errorZq").text("无权限修改工情灾情！");
        //         return;
        //     }
        //     var disaster = $("#txtDisaster").val();
        //     var fxkh = new Object();
        //     fxkh.id = _duty_fxkh_id;
        //     fxkh.time = _duty_date;
        //     fxkh.disaster = disaster;
        //     fxkh.type = "1";
        //     $.ajax({
        //         headers:{
        //             "Authorization" : token
        //         },
        //         type: "post",
        //         contentType: "application/json; charset=utf-8",
        //         url: baseUrl + "dutyRecord/saveDutyFxkh",
        //         data: JSON.stringify(fxkh),
        //         success: function(res){
        //             if (res.success) {
        //                 $("#errorZq").text("保存工情灾情成功！");
        //                 if (_duty_fxkh_id == "")
        //                     _duty_fxkh_id = res.data.id;
        //             } else {
        //                 $("#errorZq").text("保存工情灾情失败！");
        //                 return;
        //             }
        //         },
        //         error: function(err){
        //             console.error(err);
        //         }
        //     });
        // }

        //保存来电记录
        if ($("#phone").hasClass("active")) {
            // if (!duty_record_tel_editable) {
            //     $("#errorTel").text("无权限修改电话记录！");
            //     return;
            // }

            //获取最新值
            var type = $("#listTypeTel").val();
            var units = $("#txtUnits").val();
            var telephone = $("#txtTelephone").val();
            var content = $("#txtContent").val();

            //验证数据
            if (units == "") {
                $("#errorTel").text("来去电单位不能为空！");
                return;
            }
            if (telephone == "") {
                $("#errorTel").text("来去电号码不能为空！");
                return;
            }
            if (content == "") {
                $("#errorTel").text("来去电内容不能为空！");
                return;
            }

            var tel = new FormData();
            tel.append("id", _duty_tel_id);
            tel.append("time", _duty_date);
            tel.append("type", type);
            tel.append("units", units);
            tel.append("telephone", telephone);
            tel.append("content", content);
            var file = $("#txtAudio")[0].files[0];
            if(file != null){
                tel.append("file", $("#txtAudio")[0].files[0]);
            }
            $.ajax({
                headers:{
                    "Authorization" : token
                },
                url: baseUrl + "dutyRecord/saveDutyRecordTel",
                type: "post",
                data: tel,
                contentType: false,
                processData: false,
                success: function(res){
                    if (res.success) {
                        $("#errorTel").text("保存电话成功！");
                        if (_duty_tel_id == "")
                            _duty_tel_id = res.data.id;
                        //更新列表
                        initRecordTel(_duty_date);
                    } else {
                        $("#errorTel").text("保存电话失败！");
                        return;
                    }
                },
                error: function(err){
                    console.error(err);
                }
            });
        }

        //防汛抗旱行动
        // if ($("#fxkhxd").hasClass("active")) {
        //     if (!duty_fxkh_editable) {
        //         $("#errorFxkhxd").text("无权限修改防汛抗旱行动！");
        //         return;
        //     }

        //     var action = $("#txtAction").val();
        //     var fxkh = new Object();
        //     fxkh.id = _duty_fxkh_id;
        //     fxkh.time = _duty_date;
        //     fxkh.action = action;
        //     fxkh.type = "2";
        //     $.ajax({
        //         headers:{
        //             "Authorization" : token
        //         },
        //         type: "post",
        //         contentType: "application/json; charset=utf-8",
        //         url: baseUrl + "dutyRecord/saveDutyFxkh",
        //         data: JSON.stringify(fxkh),
        //         success: function(res){
        //             if (res.success) {
        //                 $("#errorFxkhxd").text("保存防汛抗旱行动成功！");
        //                 if (_duty_fxkh_id == "")
        //                     _duty_fxkh_id = res.data.id;
        //             } else {
        //                 $("#errorFxkhxd").text("保存防汛抗旱行动失败！");
        //                 return;
        //             }
        //         },
        //         error: function(err){
        //             console.error(err);
        //         }
        //     });
        // }

        //保存防汛会商
        // if ($("#consult").hasClass("active")) {
        //     if (!duty_fxkh_editable) {
        //         $("#errorConsult").text("无权限修改防汛会商！");
        //         return;
        //     }
        //     var consultTitle = $("#txtConsultTitle").val();
        //     var consult = $("#txtConsult").val();
        //     var data = [{ id: _duty_fxkh_id, time: _duty_date, consultTitle: consultTitle, consult: consult, type: "3" }];
        //     var fxkh = new Object();
        //     fxkh.id = _duty_fxkh_id;
        //     fxkh.time = _duty_date;
        //     fxkh.consultTitle = consultTitle;
        //     fxkh.consult = consult;
        //     fxkh.type = "3";
        //     $.ajax({
        //         headers:{
        //             "Authorization" : token
        //         },
        //         type: "post",
        //         contentType: "application/json; charset=utf-8",
        //         url: baseUrl + "dutyRecord/saveDutyFxkh",
        //         data: JSON.stringify(fxkh),
        //         success: function(res){
        //             if (res.success) {
        //                 $("#errorConsult").text("保存防汛会商成功！");
        //                 if (_duty_fxkh_id == "")
        //                     _duty_fxkh_id = res.data.id;
        //             } else {
        //                 $("#errorConsult").text("保存防汛会商失败！");
        //                     return;
        //             }
        //         },
        //         error: function(err){
        //             console.error(err);
        //         }
        //     });
        // }
    });

    /**
     * 取消按钮事件
     **/
    $(".btnCancel").click(function () {
        //刷新页面
        location.reload();
    });

    /**
     * 最新水情
     **/
    // $(".btnWaterInfo").click(function () {
    //     var info = post_webservice_json("{'time':'" + _duty_date + "'}", "DutyRecordInfo.aspx/getWaterInfoNew");
    //     var arrInfo = info.split('#');
    //     if (arrInfo[0] == "0") {
    //         $("#errorRecord").text("获取最新水情成功！");
    //         $("#txtWaterInfo").val(arrInfo[1]);
    //     } else {
    //         $("#errorRecord").text(arrInfo[1]);
    //         return;
    //     }
    // });

    /**
     * 最新雨情
     **/
    $(".btnRainInfo").click(function () {
        //系统当前时间
        var myDate = new Date;
        var year = myDate.getFullYear(); //获取当前年
        var mon = (myDate.getMonth() + 1) < 10 ? "0" + (myDate.getMonth() + 1) : (myDate.getMonth() + 1); //获取当前月份的日期，不足10补0
        var date = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate(); //获取当前日
        var h = myDate.getHours();//获取当前小时数(0-23)
        var eTime = year + "-" + mon + "-" + date + " " + h + ":00";

        //前一日时间
        var dd = new Date;
        dd.setDate(dd.getDate() - 1);
        var y = dd.getFullYear();
        var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); //获取当前月份的日期，不足10补0
        var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
        var bTime = y + "-" + m + "-" + d + " 08:00";

        var objData = {
            Btime: bTime,
            Etime: eTime,
            yljb: "10,25,50,100,250,400",
            frgrd:"1,2,3,4"
        }
        var params_info = JSON.stringify(objData);
        //查询数据
        $.ajax({
            url: rainUrl + "get_YL_Fbt_Sj",
            data: params_info,
            type: "post",
            contentType: "application/json; charset=utf-8",
            success: function (_res){
                if(_res.code == 1){
                    $("#errorRecord").text("获取最新雨情成功！");
                }
                var waterHtml = "";
                var dataArr = _res.areaRain.split('|');
                $.each(dataArr, function (index, item) {
                    var itemArr = item.split(',');
                    waterHtml += itemArr[0] + ":" + itemArr[2] + "  ";
                })
                //数据处理

                // var waterHtml = "";
                // for(i=0;i<data.length;i++){
                //     waterHtml += "站名：" + data[i].stnm  + "  雨量:" + data[i].rain + "mm" + ";  "
                // }
                $("#txtRainInfo").val($("#txtRainInfo").val() + waterHtml);
                // $("#modalWaterMain").modal("hide");
            }
            
        })

        // var info = post_webservice_json("{'time':'" + _duty_date + "'}", "DutyRecordInfo.aspx/getRainInfoNew");
        // var arrInfo = info.split('#');
        // if (arrInfo[0] == "0") {
        //     $("#errorRecord").text("获取最新雨情成功！");
        //     $("#txtRainInfo").val(arrInfo[1]);
        //     $("#txtRainMain").val(arrInfo[2]);            
        // } else {
        //     $("#errorRecord").text(arrInfo[1]);
        //     return;
        // }
    });

    //待选列表array-水库水情
    var arrNotWater = new Array();
    //已选列表array-水库水情
    var arrYesWater = new Array();
    //待选列表array-河道水情
    var arrNotWaterHd = new Array();
    //已选列表array-河道水情
    var arrYesWaterHd = new Array();
    //待选列表array-雨情
    var arrNotRain = new Array();
    //已选列表array-雨情
    var arrYesRain = new Array();
    //初始化列表
    initArr();

    /**
     * 主要站点水情
     **/
    $(".btnWaterMain").click(function () {
        //设置日期默认值
        $("#txtWaterDate").val($.format.date(new Date(), "yyyy-MM-dd HH:00"));
        $('.date-water').datetimepicker('update');

        //弹出modal框
        $("#modalWaterMain").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 主要站点水情
     **/
    $(".btnWaterMainHd").click(function () {
        //设置日期默认值
        $("#txtWaterDateHd").val($.format.date(new Date(), "yyyy-MM-dd HH:00"));
        $('.date-waterHd').datetimepicker('update');

        //弹出modal框
        $("#modalWaterMainHd").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 主要水情查询
     **/
    $(".btnSearchWater").click(function () {
        //校验是否选择站点
        if ($("#ulYesWater li").length == 0) {
            $("#errorWater").text("请先选择站点！");
            return;
        }

        $("#errorWater").text("");
        var time = $("#txtWaterDate").val();
        var bDate = addDate(time,-1);
        // var seleDate = (new Date(time)).getTime();
        // seleDate.setDate(seleDate.getDate()-1);
        // var beginDate = seleDate.Format("yyyy-MM-dd 08:00:00");
        //拼接站点
        var stcds = "";
        // var sttp = "";
        $("#ulYesWater li").each(function (index, element) {
            stcds += $(this).attr("_stcd") + ",";       //齐工的接口返回的是站名 先用站名吧

        });
        stcds = stcds.substr(0, stcds.length - 1);


        //查询数据
        $.ajax({
            url: sxxUrl + "GetSksq",
            data: {
                bTime:bDate,
                eTime:time,
                type:"3",
                typeInfo: stcds,
                frgrd:"1,2,3",
                bxOrGc:"2",
                ssOrZx:"1",
                isInq:"0",
                isOtq:"0",
                isYh:"0",
                skType:"1,2,3"},
            type: "get",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function (_res){
                var data = _res.data;
                var waterHtml = "";
                for(i=0;i<data.length;i++){
                    waterHtml += "站名：" + data[i].stnm + "  时间：" + data[i].tm + "  水位:" + data[i].z + "  蓄水量:" + data[i].w + ";  "
                }
                $("#txtWaterMain").val($("#txtWaterMain").val() + waterHtml);
                $("#modalWaterMain").modal("hide");
            }
            
        })
        // var strRes = post_webservice_json("{'stcds':'" + stcds + "','time':'" + time + "'}", "DutyRecordInfo.aspx/getWaterMain");
        // var arr = strRes.split('#');
        // if (arr[1] == "") {
        //     $("#txtWaterMain").val($("#txtWaterMain").val() + arr[0]);
        //     $("#modalWaterMain").modal("hide");
        // } else {
        //     $("#errorWater").text(arr[1]);
        // }
    });

    /**
     * 河道水情查询
     **/
    $(".btnSearchWaterHd").click(function () {
        //校验是否选择站点
        if ($("#ulYesWaterHd li").length == 0) {
            $("#errorWaterHd").text("请先选择站点！");
            return;
        }

        $("#errorWaterHd").text("");
        var time = $("#txtWaterDateHd").val();
        var bDate = addDate(time,-1);
        // var seleDate = (new Date(time)).getTime();
        // seleDate.setDate(seleDate.getDate()-1);
        // var beginDate = seleDate.Format("yyyy-MM-dd 08:00:00");
        //拼接站点
        var stcds = "";
        // var sttp = "";
        $("#ulYesWaterHd li").each(function (index, element) {
            stcds += $(this).attr("_stcd") + ",";       //齐工的接口返回的是站名 先用站名吧

        });
        stcds = stcds.substr(0, stcds.length - 1);

        var objData = {
            btime:bDate,
            etime:time,
            type:"3",
            typeInfo: stcds,
            frgrd:"1,2,3",
            bxOrGc:"2",
            ssOrZx:"1"
        };
        var params_info = JSON.stringify(objData);

        //查询数据
        $.ajax({
            url: sxxUrl + "GetHdsq",
            data: params_info,
            type: "post",
            contentType: "application/json; charset=utf-8",
            success: function (_res){
                var data = _res.data;
                var waterHtml = "";
                for(i=0;i<data.length;i++){
                    waterHtml += "站名：" + data[i].stnm + "  时间：" + data[i].tm + "  水位:" + data[i].z + "  流量:" + data[i].q + ";  "
                }
                $("#txtWaterMain").val($("#txtWaterMain").val() + waterHtml);
                $("#modalWaterMainHd").modal("hide");
            }
            
        })
        // var strRes = post_webservice_json("{'stcds':'" + stcds + "','time':'" + time + "'}", "DutyRecordInfo.aspx/getWaterMain");
        // var arr = strRes.split('#');
        // if (arr[1] == "") {
        //     $("#txtWaterMain").val($("#txtWaterMain").val() + arr[0]);
        //     $("#modalWaterMain").modal("hide");
        // } else {
        //     $("#errorWater").text(arr[1]);
        // }
    });

    /**
     * 主要站点雨情
     **/
    // $(".btnRainMain").click(function () {
    //     //设置日期默认值
    //     $("#txtRainDate").val(addDays(_duty_date, -1) + " 08:00");
    //     $("#txtRainDate2").val(_duty_date + " 08:00");
    //     $('.date-rain').datetimepicker('update');

    //     //弹出modal框
    //     $("#modalRainMain").modal({ backdrop: 'static', keyboard: false, show: true });
    // });

    /**
     * 主要雨情查询
     **/
    // $(".btnSearchRain").click(function () {
    //     $("#errorRain").text("");
    //     //校验是否选择站点
    //     if ($("#ulYesRain li").length == 0) {
    //         $("#errorRain").text("请先选择站点！");
    //         return;
    //     }

    //     var beginTime = $("#txtRainDate").val();
    //     var endTime = $("#txtRainDate2").val();
    //     //拼接站点
    //     var stcds = "";
    //     $("#ulYesRain li").each(function (index, element) {
    //         stcds += $(this).attr("_stcd") + ",";
    //     });
    //     stcds = stcds.substr(0, stcds.length - 1);

    //     //查询数据
    //     var strRes = post_webservice_json("{'stcds':'" + stcds + "','beginTime':'" + beginTime + "','endTime':'" + endTime + "'}", "DutyRecordInfo.aspx/getRainMain");
    //     var arr = strRes.split('#');
    //     if (arr[1] == "") {
    //         $("#txtRainMain").val($("#txtRainMain").val() + arr[0]);
    //         $("#modalRainMain").modal("hide");
    //     } else {
    //         $("#errorRain").text(arr[1]);
    //     }
    // });

    ////////////////////////////////////////////////电话记录/////////////////////////////////////////////////
    /**
     * 来电记录列表初始化
     **/
    function initRecordTel(time) {
        $.ajax({
            headers:{
                "Authorization" : token
            },
            type: "get",
            url : baseUrl + "dutyRecord/getDutyRecordTel",
            data: "time=" + time,
            success: function (res) {
                var tempTel = res.data;
                $("#tableRecordTel tr:not(:first)").remove();
                var _tel = "";
                $.each(tempTel, function (index, obj) {
                    _tel += "<tr><td>" + (obj["type"] == "0" ? "来电" : "去电") + "</td><td>" + $.trim(obj["telephone"]) + "</td><td>" + $.trim(obj["units"]) + "</td>";
                    _tel += "<td title='" + $.trim(obj["content"]) + "'>" + $.trim(obj["content"]) + "</td>";
                    if (duty_record_tel_editable) {
                        _tel += "<td><button class='btn btn-default btnEditTel' type='button' _id='" + obj["id"] + "'>编辑</button>";
                        _tel += "<button class='btn btn-default btnDelTel' type='button' _id='" + obj["id"] + "'>删除</button>";
                    } else {
                        _tel += "<td><button class='btn btn-default btnWatch' type='button' _id='" + obj["id"] + "'>详细</button>";
                    }
                    _tel += "<button class='btn btn-default btnPlayTel' type='button' _audio='" + obj["audio"] + "' " + (obj["audio"] == "" ? "disabled='true'" : "") + ">播放</button>";
                    _tel += "<audio id='" + obj["id"] + "' controls='controls' hidden='false' src='" + obj["audio"] + "' >播放</audio></td></tr>";
                });
                $("#tableRecordTel").append(_tel);
            }
        });
    }

    /**
     * 来电记录编辑按钮
     **/
    $("#tableRecordTel").delegate(".btnEditTel,.btnWatch", "click", function () {
        _duty_tel_id = $(this).attr("_id");

        //根据ID获取来电记录
        var tempTel = post_webservice_par(token,{'id':_duty_tel_id}, baseUrl + "dutyRecord/getDutyRecordTelById");
        if (tempTel != null) {
            //赋值
            _duty_tel_audio = tempTel["audio"];
            $("#listTypeTel").val(tempTel["type"]);
            $("#txtUnits").val(tempTel["units"]);
            $("#txtTelephone").val(tempTel["telephone"]);
            $("#txtContent").val(tempTel["content"]);
            $("#listTypeTel").change();
        } else {
            $("#errorTel").text("获取电话失败！");
            _duty_tel_id = "";
            _duty_tel_audio = "";
            return;
        }
    });

    var _duty_tel_id_del = "";
    var _del_type = ""; //删除类型
    /**
     * 来电记录删除按钮
     **/
    $("#tableRecordTel").delegate(".btnDelTel", "click", function () {
        if (!duty_record_tel_editable)
            return;

        _duty_tel_id_del = $(this).attr("_id");
        _del_type = "tel";

        $("#labDel").text("确定删除该来电记录？");
        $("#modalDel").modal({ backdrop: 'static', keyboard: false, show: true });
    });

    /**
     * 删除按钮确定事件
     **/
    $(".btnDelSure").click(function () {
        if (_del_type == "tel") {
            var res = post_webservice_par(token,{'id':_duty_tel_id_del }, baseUrl + "dutyRecord/delDutyRecordTel");
            if (res) {
                //关闭model
                $("#modalDel").modal("hide");
                //刷新列表
                initRecordTel(_duty_date);

                //若删除的ID为当前编辑的 清空
                if (_duty_tel_id_del == _duty_tel_id) {
                    $(".btnAddTel").click();
                }
            } else {
                alert("来单记录删除失败！");
                return;
            }
        }
    });

    //正在播放的音频文件
    var _duty_audio = null;
    //正在播放的音频文件id
    var _duty_audio_id = "";

    /**
     * 来电记录播放按钮
     **/
    $("#tableRecordTel").delegate(".btnPlayTel", "click", function () {
        console.log("点击播放暂停")
        if (!duty_record_tel_editable)
            return;
        // var audio = $("this").next();
        var a = $("this")

        var mp3 = $(".btnPlayTel").attr("_audio");
        var audio = new Audio(mp3);
        // audio = document.getElementById('20');
        // console.log("audio"+audio.id);
        if(audio.pause){
            console.log("播放")
            audio.play();
        }else{
            console.log("暂停")
            audio.pause();
        }
        // if(tel_pause_tag){
        //     console.log("播放")
        //     audio.play();
        // }else{
        //     console.log("暂停")
        //     audio.pause();
        // }
        tel_pause_tag = !tel_pause_tag;

    });

    /**
     * 新增按钮事件
     **/
    $(".btnAddTel").click(function () {
        $("#errorTel").text("");
        _duty_tel_id = "";
        _duty_tel_audio = "";
        $("#listTypeTel").val("0");
        $(".lab_tel_phone").text("来电号码");
        $(".lab_tel_units").text("来电单位");
        $(".lab_tel_content").text("来电内容");
        $("#txtUnits").val("");
        $("#txtTelephone").val("");
        $("#txtContent").val("");
    });

    $("#listTypeTel").change(function () {
        if ($("#listTypeTel").val() == "0") {
            $(".lab_tel_phone").text("来电号码");
            $(".lab_tel_units").text("来电单位");
            $(".lab_tel_content").text("来电内容");            
        } else {
            $(".lab_tel_phone").text("去电号码");
            $(".lab_tel_units").text("去电单位");
            $(".lab_tel_content").text("去电内容");
        }
    });

    /**
     * 初始化来电记录中的 音频上传控件
     **/
    // function initUploadify() {
    //     $("#txtAudio").uploadify({
    //         'swf': '../Scripts/uploadify/uploadify.swf',    //uploadify.swf 文件的相对路径
    //         'uploader': 'UploadHandler.ashx',
    //         'method': 'post',                  //提交方式
    //         'width': '100',
    //         'height': '30',                     //设置浏览按钮的高度 ，默认值30
    //         'formData': { "_type": "tel", "id": _duty_tel_id, "updateUser": _duty_user_name },   //JSON格式上传每个文件的同时提交到服务器的额外数据,可在’onUploadStart’事件中使用’settings’方法动态设置。
    //         'fileTypeExts': '*.mp3;*.wav;*.wma;',  //设置可以选择的文件的类型，格式如：’*.doc;*.pdf;*.rar’ 。
    //         'fileSizeLimit': '100MB',              //上传文件的大小限制 ，如果为整数型则表示以KB为单位的大小，如果是字符串，则可以使用(B, KB, MB, or GB)为单位，比如’2MB’ 如果设置为0则表示无限制
    //         'fileObjName': 'Filedata',            //文件上传对象的名称
    //         'buttonText': '添加录音',             //浏览按钮的文本
    //         'buttonClass': 'upload_btn',          //按钮样式
    //         'auto': true,                        //是否自动上传
    //         'checkExisting': false,               //文件上传重复性检查程序，检查即将上传的文件在服务器端是否已存在，存在返回1，不存在返回0
    //         'itemTemplate': false,                //用于设置上传队列的HTML模版，可以使用以下标签：
    //         'multi': false,                       //是否允许多个同时上传
    //         'progressData': 'percentage',         //设置上传进度显示方式，percentage显示上传百分比，speed显示上传速度

    //         //选择文件
    //         'onSelect': function (file) {
    //             $("#errorRecord").text("");
    //         },
    //         //选择文件失败
    //         'onSelectError': function (file, errorCode, errorMsg) {
    //             $("#errorRecord").text(errorMsg);
    //         },
    //         //单个文件上传成功触发
    //         'onUploadSuccess': function (file, data, response) {
    //             $("#errorRecord").text("录音上传成功！");
    //             //更新录音文件名称
    //             _duty_tel_audio = file.name;
    //         }
    //     });
    // }
    ////////////////////////////////////////////////电话记录/////////////////////////////////////////////////

    ////////////////////////////////////////////////传真记录/////////////////////////////////////////////////

    ///////////来文单位相关 add by hzx 2018-07-12
    //来文单位数据源
    // var arrFileOrgan = new Array();
    // /**
    //  * 选择按钮
    //  **/
    // $("#btnChoose").click(function () {
    //     //弹出modal框
    //     $("#modalFileOrgan").modal({ backdrop: 'static', keyboard: false, show: true });
    // });    
    /**
     * 初始化列表
     **/
    // function initFileOrgan() {
    //     $("#ulOrgan li").remove();
    //     $("#ulOrganAbbr li").remove();
    //     arrFileOrgan = new Array();
    //     $.ajax({
    //         headers:{
    //             "Authorization" : token
    //         },
    //         type: "get",
    //         dataType: "json",
    //         url: baseUrl + "dutyRecord/getDutyFileOrganAll",
    //         success: function(res){
    //             var temp = "";
    //             $.each(res.data, function (index, obj) {
    //                 temp += "<li _abbr='" + obj["abbr"] + "'>" + obj["name"] + "</li>";
    //                 arrFileOrgan.push(obj);
    //             });
    //             $("#ulOrgan").append(temp);
    //         },
    //         error: function(err){
    //             console.error(err);
    //         }
    //     });
    // }
    //初始化列表
    // initFileOrgan();

    /**
     * 来文单位 单击事件
     **/
    // $("#ulOrgan").delegate("li", "click", function () {
    //     var abbr = $(this).attr("_abbr");
        
    //     //添加文号列表
    //     $("#ulOrganAbbr li").remove();
    //     var arr = abbr.split(";");
    //     var temp = "";
    //     for (var i = 0; i < arr.length;i++)
    //     {
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

    /**
     * 文号 单击事件
     **/
    // $("#ulOrganAbbr").delegate("li", "click", function () {
    //     $("#ulOrganAbbr li").removeClass("active");
    //     $(this).addClass("active");
    // });

    /**
     * 来文单位-确定按钮
     **/
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
    //     $("#txtUnitFax").val(_name);
    //     $("#txtRefNoFax").val(_abbr + "【" + new Date().getFullYear() + "】");

    //     //隐藏model
    //     $("#modalFileOrgan").modal("hide");
    // });
    ////////////////////////////////////////////////传真记录/////////////////////////////////////////////////

    /**
     * 设置值班记录、防汛抗旱工作、来电记录是否可编辑
     **/
    function setDutyEnabled(content, flag) {
        $("#" + content + " select").attr("disabled", flag);
        $("#" + content + " input,#" + content + " textarea").attr("readonly", flag);
    }

    //拼音模糊查询
    var flag = true;
    $('#txt_py').on('compositionstart', function () {
        flag = false;
    })
    $('#txt_py').on('compositionend', function () {
        flag = true;
    })
    $('#txt_py').on('input', function () {
        setTimeout(function () {
            if (flag) {
                $('#ulNotWater li').each(function (i, n) {
                    var phcd = this.attributes[0].value;
                    var stcd = this.attributes[1].value;
                    if (phcd.indexOf($("#txt_py").val()) >= 0 || $(n).text().indexOf($("#txt_py").val()) >=0 || stcd.indexOf($("#txt_py").val()) >= 0)
                        $(n).show();
                    else
                        $(n).hide();
                });
            }

        }, 0)
    })

    //河道水情拼音模糊查询
    var flag = true;
    $('#txt_pyHd').on('compositionstart', function () {
        flag = false;
    })
    $('#txt_pyHd').on('compositionend', function () {
        flag = true;
    })
    $('#txt_pyHd').on('input', function () {
        setTimeout(function () {
            if (flag) {
                $('#ulNotWaterHd li').each(function (i, n) {
                    var phcd = this.attributes[0].value;
                    var stcd = this.attributes[1].value;
                    if (phcd.indexOf($("#txt_pyHd").val()) >= 0 || $(n).text().indexOf($("#txt_pyHd").val()) >=0 || stcd.indexOf($("#txt_pyHd").val()) >= 0)
                        $(n).show();
                    else
                        $(n).hide();
                });
            }

        }, 0)
    })

    /**
     * 初始化列表
     **/
    function initArr() {
        //水库水情
        $("#ulNotWater li").remove();
        $("#ulYesWater li").remove();
        arrNotWater = new Array();
        arrYesWater = new Array();
        var colList = "";
        $.ajax({
            headers:{
                "Authorization" : token
            },
            dataType: "json",
            type: "post",
            url: sxxUrl + "GetStationBySttp",
            data: {sttp:"RR"},
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function(res){
                colList = res.data;
                // var _html = "";
                // var pinyin = res;
                // var _len = pinyin.data.length;
                // for (var i = 0; i < _len; i++) {
                //     _html += "<li data-addvcd='" + pinyin.data[i].stcd + "' data-phcd='" + pinyin.data[i].phcd + "'>" + pinyin.data[i].stnm + "</li>";
                // }
    
                var temp = "";
                $.each(colList, function (index, obj) {
                    // _html += "<li data-addvcd='" + pinyin.data[i].stcd + "' data-phcd='" + pinyin.data[i].phcd + "'>" + pinyin.data[i].stcd + "-" + pinyin.data[i].stnm + "</li>";
                    temp += "<li _phcd='"+ obj["phcd"] + "' _stcd='" + obj["stcd"] + "' _stnm='" + obj["stnm"] + "'_sttp='" + obj["sttp"] + "'>" + obj["stnm"] + "</li>";
                    arrNotWater.push(obj);
                });
                $("#ulNotWater").append(temp);
            },
            error: function(err){
                console.error(err);
            }
        });

        //河道水情
        $("#ulNotWaterHd li").remove();
        $("#ulYesWaterHd li").remove();
        arrNotWaterHd = new Array();
        arrYesWaterHd = new Array();
        var colList = "";
        $.ajax({
            headers:{
                "Authorization" : token
            },
            dataType: "json",
            type: "post",
            url: sxxUrl + "GetStationBySttp",
            data: {sttp:"RRDD,ZZ,ZQ,TT"},
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            success: function(res){
                colList = res.data;
                // var _html = "";
                // var pinyin = res;
                // var _len = pinyin.data.length;
                // for (var i = 0; i < _len; i++) {
                //     _html += "<li data-addvcd='" + pinyin.data[i].stcd + "' data-phcd='" + pinyin.data[i].phcd + "'>" + pinyin.data[i].stnm + "</li>";
                // }
    
                var temp = "";
                $.each(colList, function (index, obj) {
                    // _html += "<li data-addvcd='" + pinyin.data[i].stcd + "' data-phcd='" + pinyin.data[i].phcd + "'>" + pinyin.data[i].stcd + "-" + pinyin.data[i].stnm + "</li>";
                    temp += "<li _phcd='"+ obj["phcd"] + "' _stcd='" + obj["stcd"] + "' _stnm='" + obj["stnm"] + "'_sttp='" + obj["sttp"] + "'>" + obj["stnm"] + "</li>";
                    arrNotWaterHd.push(obj);
                });
                $("#ulNotWaterHd").append(temp);
            },
            error: function(err){
                console.error(err);
            }
        });

        //雨情
        $("#ulNotRain li").remove();
        $("#ulYesRain li").remove();
        arrNotRain = new Array();
        arrYesRain = new Array();
        $.ajax({
            headers:{
                "Authorization" : token
            },
            dataType: "json",
            type: "get",
            url: baseUrl + "dutyRecord/getDutyStationByType",
            data: "type=2",
            success: function(res){
                colList = res.data;
                temp = "";
                $.each(colList, function (index, obj) {
                    temp += "<li _stcd='" + obj["stcd"] + "' _stnm='" + obj["stnm"] + "'>" + obj["stnm"] + "</li>";
                    arrNotRain.push(obj);
                });
                $("#ulNotRain").append(temp);
            },
            error: function(err){
                console.error(err);
            }
        });
    }

    /**
     * 待选列表 单击事件
     **/
    $("#ulNotWater,#ulNotRain").delegate("li", "click", function () {
        var stcd = $(this).attr("_stcd");
        var tempObj = new Object();
        var isWater = $(this).parent().attr("id") == "ulNotWater" ? true : false;

        //左侧列表删除
        $(this).remove();
        //待选arr删除
        $.each(isWater ? arrNotWater : arrNotRain, function (index, obj) {
            if (obj["stcd"] == stcd) {
                tempObj = obj;
                (isWater ? arrNotWater : arrNotRain).splice(index, 1);
                return false;
            }
        });

        //右侧列表添加
        $(isWater ? "#ulYesWater" : "#ulYesRain").append("<li _phcd='"+tempObj["phcd"] + "' _stcd='" + tempObj["stcd"] + "' _stnm='" + tempObj["stnm"] + "'_sttp='" + tempObj["sttp"] + "'>" + tempObj["stnm"] + "</li>");
        //已选arr添加
        (isWater ? arrYesWater : arrYesRain).push(tempObj);
    });

    /**
     * 河道待选列表 单击事件
     **/
    $("#ulNotWaterHd").delegate("li", "click", function () {
        var stcd = $(this).attr("_stcd");
        var tempObj = new Object();
        // var isWater = $(this).parent().attr("id") == "ulNotWater" ? true : false;

        //左侧列表删除
        $(this).remove();
        //待选arr删除
        $.each(arrNotWaterHd, function (index, obj) {
            if (obj["stcd"] == stcd) {
                tempObj = obj;
                (arrNotWaterHd).splice(index, 1);
                return false;
            }
        });

        //右侧列表添加
        $("#ulYesWaterHd").append("<li _phcd='"+tempObj["phcd"] + "' _stcd='" + tempObj["stcd"] + "' _stnm='" + tempObj["stnm"] + "'_sttp='" + tempObj["sttp"] + "'>" + tempObj["stnm"] + "</li>");
        //已选arr添加
        (arrYesWaterHd).push(tempObj);
    });

    /**
     * 已选列表 单击事件
     **/
    $("#ulYesWater,#ulYesRain").delegate("li", "click", function () {
        var stcd = $(this).attr("_stcd");
        var tempObj = new Object();
        var isWater = $(this).parent().attr("id") == "ulYesWater" ? true : false;

        //右侧列表删除
        $(this).remove();
        //已选arr删除
        $.each(isWater ? arrYesWater : arrYesRain, function (index, obj) {
            if (obj["stcd"] == stcd) {
                tempObj = obj;
                (isWater ? arrYesWater : arrYesRain).splice(index, 1);
                return false;
            }
        });

        //左侧列表添加
        $(isWater ? "#ulNotWater" : "#ulNotRain").append("<li _phcd='"+tempObj["phcd"] + "' _stcd='" + tempObj["stcd"] + "' _stnm='" + tempObj["stnm"] + "'_sttp='" + tempObj["sttp"] + "'>" + tempObj["stnm"] + "</li>");
        //待选arr添加
        (isWater ? arrNotWater : arrNotRain).push(tempObj);
    });

    /**
     * 河道水情已选列表 单击事件
     **/
    $("#ulYesWaterHd").delegate("li", "click", function () {
        var stcd = $(this).attr("_stcd");
        var tempObj = new Object();
        // var isWater = $(this).parent().attr("id") == "ulYesWater" ? true : false;

        //右侧列表删除
        $(this).remove();
        //已选arr删除
        $.each(arrYesWaterHd, function (index, obj) {
            if (obj["stcd"] == stcd) {
                tempObj = obj;
                (arrYesWaterHd).splice(index, 1);
                return false;
            }
        });

        //左侧列表添加
        $("#ulNotWaterHd").append("<li _phcd='"+tempObj["phcd"] + "' _stcd='" + tempObj["stcd"] + "' _stnm='" + tempObj["stnm"] + "'_sttp='" + tempObj["sttp"] + "'>" + tempObj["stnm"] + "</li>");
        //待选arr添加
        (arrNotWaterHd).push(tempObj);
    });

    /**
     * 全选按钮事件
     **/
    $(".btnAllWater,.btnAllRain").click(function () {
        var isWater = $(this).hasClass("btnAllWater") ? true : false;

        //先右侧添加
        $.each(isWater ? arrNotWater : arrNotRain, function (index, obj) {
            $(isWater ? "#ulYesWater" : "#ulYesRain").append("<li _phcd='"+ obj["phcd"] + "' _stcd='" + obj["stcd"] + "' _stnm='" + obj["stnm"] + "'_sttp='" + obj["sttp"] + "'>" + obj["stnm"] + "</li>");
            (isWater ? arrYesWater : arrYesRain).push(obj);
        });

        //待选清空
        $(isWater ? "#ulNotWater li" : "#ulNotRain li").remove();
        if (isWater)
            arrNotWater = new Array();
        else
            arrNotRain = new Array();
    });

    /**
     * 河道水情全选按钮事件
     **/
    $(".btnAllWaterHd").click(function () {
        // var isWater = $(this).hasClass("btnAllWater") ? true : false;

        //先右侧添加
        $.each(arrNotWaterHd, function (index, obj) {
            $("#ulYesWaterHd").append("<li _phcd='"+ obj["phcd"] + "' _stcd='" + obj["stcd"] + "' _stnm='" + obj["stnm"] + "'_sttp='" + obj["sttp"] + "'>" + obj["stnm"] + "</li>");
            (arrYesWaterHd).push(obj);
        });

        //待选清空
        $("#ulNotWaterHd li").remove();
        arrNotWaterHd = new Array();
    });

    /**
     * 反选按钮事件
     **/
    $(".btnAllNotWater,.btnAllNotRain").click(function () {
        var isWater = $(this).hasClass("btnAllNotWater") ? true : false;
        //先左侧添加
        $.each(isWater ? arrYesWater : arrYesRain, function (index, obj) {
            $(isWater ? "#ulNotWater" : "#ulNotRain").append("<li _phcd='"+ obj["phcd"] + "' _stcd='" + obj["stcd"] + "' _stnm='" + obj["stnm"] + "'_sttp='" + obj["sttp"] + "'>" + obj["stnm"] + "</li>");
            (isWater ? arrNotWater : arrNotRain).push(obj);
        });

        //已选清空
        $(isWater ? "#ulYesWater li" : "#ulYesRain li").remove();
        if (isWater)
            arrYesWater = new Array();
        else
            arrYesRain = new Array();
    });

    /**
     * 河道水情反选按钮事件
     **/
    $(".btnAllNotWater,.btnAllNotRain").click(function () {
        // var isWater = $(this).hasClass("btnAllNotWater") ? true : false;
        //先左侧添加
        $.each(arrYesWaterHd, function (index, obj) {
            $("#ulNotWaterHd").append("<li _phcd='"+ obj["phcd"] + "' _stcd='" + obj["stcd"] + "' _stnm='" + obj["stnm"] + "'_sttp='" + obj["sttp"] + "'>" + obj["stnm"] + "</li>");
            (arrNotWaterHd).push(obj);
        });

        //已选清空
        $("#ulYesWaterHd li").remove();

        arrYesWaterHd = new Array();
    });

    /**
     * 日期加减
     **/
    function addDays(str, days) {
        var date = new Date(str);
        date = date.setDate(date.getDate() + days) ;
        
        return $.format.date(date, "yyyy-MM-dd");
    }


    ///////////////////////////////////////////////传真自动查询处理/////////////////////////////////////////
    //传真数据源改变时 刷新自动查询
    // function reloadFax() {
    //     //获取传真数据源 最大ID
    //     _id_fax_max = post_webservice("DutyFile.aspx/getMaxFaxId");
    //     getFaxNew();
    // }
    // function reloadFax_2() {
    //     //获取传真数据源 最大ID
    //     _id_fax_max = post_webservice("DutyFile.aspx/getMaxFaxId");
    // }

    //长轮询
    // function getFaxNew() {
    //     $.ajax({
    //         type: 'GET',
    //         async: true,
    //         cache: false,
    //         url: 'FaxHandler.ashx',
    //         data: { id: _id_fax_max },
    //         success: function (data) {
    //             var $json = eval('(' + data + ')');
    //             if ($json["msg"] != "") {
    //                 $('#labFaxMsg').text($json['msg']);
    //                 //$(".fax-tip").show(100);
    //                 $(".fax-tip").slideDown(1000);
    //             } else {
    //                 getFaxNew();
    //             }
    //         },
    //         error: function (XMLHttpRequest, textState, error) {
    //             console.log("获取最新的未处理传真失败！" + error);
    //             setTimeout(getFaxNew(), 60000);
    //         }
    //     });
    // }

    // $("#btnFaxMsgClose,.fax-tip .close").click(function () {
    //     $(".fax-tip").slideUp(1000);
    // });
});

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function addDate(date,days){ 
    var d=new Date(date); 
    d.setDate(d.getDate()+days); 
    var m=d.getMonth()+1; 
    return d.getFullYear()+'-'+m+'-'+d.getDate() + " 08:00:00"; 
}

/**
 * 系统当前时间
 */
function sysDate() {
    var myDate = new Date;
    var year = myDate.getFullYear(); //获取当前年
    var mon = (myDate.getMonth() + 1) < 10 ? "0" + (myDate.getMonth() + 1) : (myDate.getMonth() + 1); //获取当前月份的日期，不足10补0
    var date = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate(); //获取当前日
    var h = myDate.getHours();//获取当前小时数(0-23)
    var m = myDate.getMinutes
    return sysTime = year + "-" + mon + "-" + date + " " + h + ":00";
}
 
 