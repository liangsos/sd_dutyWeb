$(function (){
    var tableDoc = null;
    var tableEmail = null;
    var tableMat = null;
    var tableAnno = null;
    var beginTime = null;
    var endTime = null;

    var url = window.location.href;
    var backId = getQueryString("id");

    //日期控件初始化
    initDatePicker('.form_date', "yyyy-mm-dd", 2);
    initDatePicker('.date-hour', "yyyy-mm-dd hh:00:00", 1);

    if (backId != "5") {
        $("#comList").hide();
        initTable(backId);
    } else {
        //水情通讯录
        $('.zy_title h2').html("通讯录");
        $('#locationNow').html("通讯录");
        $("#comList").show();
        $("#doc").hide()
    }

    /**
     * 查询按钮事件
     **/
    $("#btnSearch").click(function () {
        if(backId == "1"){
            tableDoc.fnDraw();
        }
        if(backId == "2"){
            tableEmail.fnDraw();
        }
        if(backId == "3"){
            tableMat.fnDraw();
        }
        if(backId == "4"){
            tableAnno.fnDraw();
        }
    });

    function initTable(id){
        switch (id){
            case "1"://防汛文档
                $('#docTable').show();
                $('#emailTable').hide();
                $('#matTable').hide();
                $('#annoTable').hide();
                $('.zy_title h2').html("水情文档");
                $('#locationNow').html("水情文档");
                $('#docFix').addClass("cur");
                $('#homeFix').removeClass("cur");
                $('#emailFix').removeClass("cur");
                $('#matFix').removeClass("cur");
                $('#annoFix').removeClass("cur");
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
                    }
                    // {
                    //     "mDataProp": "",
                    //     "sDefaultContent": "Edit"
                    // }
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
                    "bServerSide": true,             //服务器端
                    "sAjaxSource": baseUrl + "file/GetDutyDoc",
                    "fnRowCallback":function(nRow, aData, iDisplayIndex){//nRow 当前行元素 aData当前行数据源（obj） iDisplayIndex当前行索引
                        var data = aData;
                        var file = "";
                        if(data.soure != ""){
                            file = "<a href='#' onclick='downloadDocFile(this)' uploadUrl=" + data.soure + ">&nbsp;&nbsp;<span class='fa fa-arrow-circle-o-down'></span></a>"; 
                            $('td:eq(1)', nRow).append(file);
                        }
                    },
                    //查询条件
                    "fnServerParams": function (aoData) {
                        // aoData.push({ "name": "search_type", "value": $("#fileType").val() });
                        aoData.push({ "name": "search_begin_time", "value": $("#txtBeginTimeD").val() });
                        aoData.push({ "name": "search_end_time", "value": $("#txtEndTimeD").val() });
                        aoData.push({ "name": "isHome", "value": "1"});
                    },
                    //服务器端，数据回调处理
                    "fnServerData": function (sSource, aoData, fnCallback) {
                        $.ajax({
                            // headers:{
                            //     "Authorization" : "2003979a-37e3-448e-a374-fa566609c7cd"
                            // },
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

            case "2"://邮件
                $('#docTable').hide();
                $('#emailTable').show();
                $('#matTable').hide();
                $('#annoTable').hide();
                $('.zy_title h2').html("邮件管理");
                $('#locationNow').html("邮件管理");
                $('#docFix').removeClass("cur");
                $('#homeFix').removeClass("cur");
                $('#emailFix').addClass("cur");
                $('#matFix').removeClass("cur");
                $('#annoFix').removeClass("cur");
                tableEmail = $('#emailTable').dataTable({
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
                        "mDataProp": "subject",
                        "className": "wordBreak",
                        // "style": "word-break: break-all;white-space:normal"
                    }, {
                        "mDataProp": "files",
                        "className": "wordBreak"
                    }, {
                        "mDataProp": "content"
                    }, {
                        "mDataProp": "fromAddress"
                    }, {
                        "mDataProp": "sentDate"
                    },{
                        "mDataProp": "",
                        "sDefaultContent": "Edit"
                    }
                    ],
                    "oLanguage": {     //国际化配置  
                        "sProcessing": "<img src='../images/loading.gif'/>",
                        "sLengthMenu": "每页显示 _MENU_ 条",
                        "sZeroRecords": "没有邮件信息",
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
                    "bServerSide": true,             //服务器端
                    "sAjaxSource": baseUrl + "email/getEmails",
                    "fnRowCallback":function(nRow, aData, iDisplayIndex){//nRow 当前行元素 aData当前行数据源（obj） iDisplayIndex当前行索引
                        var row = nRow;
                        var data = aData;
                        var index = iDisplayIndex;
                        if(data.files != ""){
                            var files = data.files.split("|");
                            var file;
                            var fileName = "";
                            if(files.length > 1){

                                for(i=0;i < files.length ; i++){
                                    file = files[i].split("/");
                                    fileName += file[file.length - 1]  + "<span style='display:none'>" + files[i] + "</span>" + "<br/>"
                                    $('td:eq(1)', nRow).html(fileName);
                                }
                            }else{
                                file = files[0].split("/");
                                fileName = file[file.length - 1]
                                $('td:eq(1)', nRow).html(fileName);
                            }
                        }
                        
                        var txtHtml = "";
                        txtHtml += "<button class='btn btn-default btn_download' type='button'><span class='fa fa-download'></span></span>&nbsp;&nbsp;下载附件</button>&nbsp;&nbsp;";
                        // txtHtml += "<button class='btn btn-default btn_reply' type='button'><span class='fa fa-reply'></span>&nbsp;&nbsp;回复</button>";
                        $('td:eq(5)', nRow).html(txtHtml);
                        return nRow;
                    },
                    // 查询条件
                    "fnServerParams": function (aoData) {
                        var number = aoData[3].value;
                        size = aoData[4].value;
                        current = parseInt(number/size) + 1;
                        beginTime = $("#txtBeginTimeD").val();
                        endTime = $("#txtEndTimeD").val()
                    },
                    //服务器端，数据回调处理
                    "fnServerData": function (sSource, aoData, fnCallback) {
                        $.ajax({
                            // headers:{
                            //     "Authorization" : "4def9320-0c5a-4889-a80b-46be5bda5829"
                            // },
                            "type": "get",
                            // "contentType": "application/json; charset=utf-8",
                            // "dataType": 'json',
                            "contentType":"application/x-www-form-urlencoded; charset=utf-8",
                            "url": sSource,
                            "data": {current:current,size:size,beginTime:beginTime,endTime:endTime},
                            "success": function (res) {
                                var resultCollection = res.data;
                                var result = {
                                    data: resultCollection.records,
                                    draw: resultCollection.draw,
                                    recordsFiltered: resultCollection.total,
                                    recordsTotal: resultCollection.total
                                }
                                fnCallback(result);
                            }
                        });
                    }
                });
                break;

            case "3":         //阶段材料
                $('#docTable').hide();
                $('#emailTable').hide();
                $('#matTable').show();
                $('#annoTable').hide();
                $('.zy_title h2').html("阶段材料");
                $('#locationNow').html("阶段材料");
                $('#docFix').removeClass("cur");
                $('#homeFix').removeClass("cur");
                $('#emailFix').removeClass("cur");
                $('#matFix').addClass("cur");
                $('#annoFix').removeClass("cur");
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
                    // "fnRowCallback": function (nRow, aData, iDisplayIndex) {
                    //     var txtHtml = "<button class='btn btn-default btn_edit' type='button'><span class='fa fa-edit'></span></span>&nbsp;&nbsp;编辑</button>&nbsp;&nbsp;";
                    //     txtHtml += "<button class='btn btn-default btn_del' type='button'><span class='fa fa-trash-o'></span>&nbsp;&nbsp;删除</button>";
                    //     $('td:eq(3)', nRow).html(txtHtml);

                    //     return nRow;
                    // },
                    "bServerSide": true,             //服务器端
                    "sAjaxSource": baseUrl + "file/GetDutyMat",
                    //查询条件
                    "fnServerParams": function (aoData) {
                        aoData.push({ "name": "search_begin_time", "value": $("#txtBeginTimeD").val() });
                        aoData.push({ "name": "search_end_time", "value": $("#txtEndTimeD").val() });
                        aoData.push({"name": "isHome", "value": "1"});
                    },
                    "fnRowCallback":function(nRow, aData, iDisplayIndex){//nRow 当前行元素 aData当前行数据源（obj） iDisplayIndex当前行索引
                        var data = aData;
                        var file = "";
                        if(data.soure != ""){
                            file = "<a href='#' onclick='downloadDocFile(this)' uploadUrl=" + data.soure + ">&nbsp;&nbsp;<span class='fa fa-arrow-circle-o-down'></span></a>"; 
                            $('td:eq(0)', nRow).append(file);
                        }
                    },
                    //服务器端，数据回调处理
                    "fnServerData": function (sSource, aoData, fnCallback) {
                        $.ajax({
                            // headers:{
                            //     "Authorization" : "2003979a-37e3-448e-a374-fa566609c7cd"
                            // },
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

                case "4":         //系统公告
                $('#docTable').hide();
                $('#emailTable').hide();
                $('#matTable').hide();
                $('#annoTable').show();
                $('.zy_title h2').html("系统公告");
                $('#locationNow').html("系统公告");
                $('#docFix').removeClass("cur");
                $('#homeFix').removeClass("cur");
                $('#emailFix').removeClass("cur");
                $('#matFix').removeClass("cur");
                $('#annoFix').addClass("cur");
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
                            aoData.push({ "name": "search_begin_time", "value": $("#txtBeginTimeD").val() });
                            aoData.push({ "name": "search_end_time", "value": $("#txtEndTimeD").val() });
                            aoData.push({ "name": "isHome", "value": "1"});
                        },
                        "fnRowCallback":function(nRow, aData, iDisplayIndex){//nRow 当前行元素 aData当前行数据源（obj） iDisplayIndex当前行索引
                            var data = aData;
                            var file = "";
                            if(data.soure != ""){
                                file = "<a href='#' onclick='downloadDocFile(this)' uploadUrl=" + data.soure + ">&nbsp;&nbsp;<span class='fa fa-arrow-circle-o-down'></span></a>"; 
                                $('td:eq(0)', nRow).append(file);
                            }
                        },
                        //服务器端，数据回调处理
                        "fnServerData": function (sSource, aoData, fnCallback) {
                            $.ajax({
                                // headers:{
                                //     "Authorization" : "2003979a-37e3-448e-a374-fa566609c7cd"
                                // },
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
     * 下载附件按钮点击事件
     */
    $('#emailTable tbody').on('click', 'button.btn_download', function(){
        var emailData = tableEmail.fnGetData(this.parentNode.parentNode);
        emailId = emailData.id;
        if(emailData.files != ""){
            var files = emailData.files.split('|');
            for(i=0;i<files.length;i++){
                downloadEmail(files[i]);
            }
        }else{
            alert("邮件无附件")
        }
    })
    

})

function downloadDocFile(e){
    var url = e.attributes[2].value;
    var form=$("<form>");
      form.attr("style","display:none");
      form.attr("target","");
      form.attr("method","get"); 
     form.attr("action",url);
      $("body").append(form);
      form.submit();//表单提交
}


function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    };
    return null;
 }

 function downloadEmail(url){
    const iframe = document.createElement("iframe");
    iframe.style.display = "none"; // 防止影响页面
    iframe.style.height = 0; // 防止影响页面
    iframe.src = url; 
    document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
    // 5分钟之后删除
    setTimeout(function(){
        iframe.remove();
    }, 5 * 60 * 1000);
}