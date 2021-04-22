$(function () {
    //token
    var token = sessionStorage.getItem("sessionId");
    //登陆人员
    var _duty_user_name = sessionStorage.getItem("userName");
    var _duty_name = sessionStorage.getItem("realName");
    //用户角色
    var _duty_role = sessionStorage.getItem("roleId");

    //邮件表格
    var tableEmail = null;
    //邮件ID
    var emailId = "";

    initDatePicker('.form_date', "yyyy-mm-dd", 2);
    initDatePicker('.date-hour', "yyyy-mm-dd hh:00:00", 1);

    //初始化表格 
    initTable("1");

    /**
     * 查询按钮事件
     **/
    $("#btnSearchEmail").click(function () {
        tableEmail.fnDraw();
    });

    /**
     * 下载附件按钮点击事件
     */
    $('#emailTable tbody').on('click', 'button.btn_download', function(){
        var emailData = tableEmail.fnGetData(this.parentNode.parentNode);
        emailId = emailData.id;
        if(emailData.files != ""){
            var files = emailData.files.split('|');
            for(i=0;i<files.length;i++){
                downloadFile(files[i]);
            }
        }else{
            alert("邮件无附件")
        }
    })

    //回复确认按钮点击事件
    $(".btnEmailReply").click(function () {
        var content = $("#txtContent").val();

        $.ajax({
            headers:{
                "Authorization" : token
            },
            type: 'post',
            url: baseUrl + "/email/reply",
            data:{id:emailId,content:content},
            success:function(res){
                var data = res.data;
                if(res.success){
                    $("#errorEmail").text("会商记录保存成功！");
                    //关闭弹出框
                    $("#modalEmailReply").modal("hide");
                }
            }
        })
    })

    /**
     * 回复按钮点击事件
     */
    $('#emailTable tbody').on('click', 'button.btn_reply', function(){

        $("#errorEmail").text("");
        var emailData = tableEmail.fnGetData(this.parentNode.parentNode);
        emailId = emailData.id;

        $("#txtName").val(emailData.fromAddress);
        $("#txtSubject").val("Re:" + emailData.subject);
        //弹出框
        $("#modalEmailReply").modal({ backdrop: 'static', keyboard: false, show: true });
    })

    /**
     * 初始化表格
     **/
    function initTable(type) {
        var current = 0;
        var size = 10;
        switch (type) {
            case "1":           //邮件
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
                        txtHtml += "<button class='btn btn-default btn_reply' type='button'><span class='fa fa-reply'></span>&nbsp;&nbsp;回复</button>";
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
                            headers:{
                                "Authorization" : token
                            },
                            "type": "get",
                            // "contentType": "application/json; charset=utf-8",
                            // "dataType": 'json',
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
        }
    }
});

function downloadFile(url){
    // var url = e.attributes[2].value;
    // var url = $(this).attr("_url");
    // var form=$("<form>");
    //   form.attr("style","display:none");
    //   form.attr("target","");
    //   form.attr("method","get"); 
    //  form.attr("action",url);
    //   $("body").append(form);
    //   form.submit();//表单提交

    const iframe = document.createElement("iframe");
    iframe.style.display = "none"; // 防止影响页面
    iframe.style.height = 0; // 防止影响页面
    iframe.src = url; 
    document.body.appendChild(iframe); // 这一行必须，iframe挂在到dom树上才会发请求
    // 5分钟之后删除
    setTimeout(()=>{
        iframe.remove();
    }, 5 * 60 * 1000);
}

