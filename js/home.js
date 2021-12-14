$(function () {
    var _duty_time_today = getNowFormatDate();
    //获取当前值班人员
    $.ajax({
        type: "GET",
        dataType: "json",
        url: baseUrl + "getDuty",
        // xhrFields:{withCredentials: true},
        // data:{today:_duty_time_today},
        success: function (res) {
            if(res.success){
                var dutyTody = res.data;
                // var li = '<li>局领导：' + dutyTody.leaderComm + '&nbsp;&nbsp;&nbsp;' + '带班：' + dutyTody.leader + '&nbsp;&nbsp;&nbsp;' + '值班人员：' + dutyTody.member  + '</li>';
                var li = '<li>主班：' + dutyTody.member.split(',')[0] + '&nbsp;&nbsp;&nbsp;' + '副班：' + dutyTody.member[1] + '</li>';
                $("#dutyToday").append(li);
                
            }else{
                if(res.message = "今日未排班"){
                    var li = '<li>今日未排班</li>'
                    $("#dutyToday").append(li);
                }
                console.log(res);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });

    //获取防汛文档
    var aoData = [{
        "name":"iDisplayStart",
        "value":"0"
    },{
        "name":"iDisplayLength",
        "value":"8"
    },{
        "name":"isHome",
        "value":"1"
    }];
    // var aoData = [
    //     {
    //         "name": "sEcho",
    //         "value": "1"
    //     },
    //     {
    //         "name": "iDisplayStart",
    //         "value": "0"
    //     },
    //     {
    //         "name": "iDisplayLength",
    //         "value": "1000"
    //     },
    //     {
    //         "name": "search_begin_time",
    //         "value": "2021-11-01"
    //     },
    //     {
    //         "name": "search_end_time",
    //         "value": "2021-11-30"
    //     }
    // ]
      
    $.ajax({
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url:baseUrl + "file/GetDutyDoc",
        // url:baseUrl + "phone/getDutyBb",
        // url: "http://10.37.1.155:9003/sd-duty/api/file/GetDutyDoc",
        // url:"http://60.216.119.102:10086/sd-duty/api/phone/getDutyBb",
        data:JSON.stringify(aoData),
        success: function (res) {
            if(res.success){
                // var data = res;
                var ulData = res.data.data;
                var ulHtml = "";
                for(i=0;i<ulData.length;i++){
                    ulHtml += "<li><a href='#' onclick='downloadDocFile(this)' uploadUrl='" + ulData[i].soure + "'>" +  ulData[i].content + "</a><span class='date'>" + ulData[i].updateDate + "</span></li>"
                }
                $("#dutyDocUl").append(ulHtml);
            }else{
                console.log(res);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });

    //获取邮件
    $.ajax({
        headers:{
            "Authorization" : "40ff4bf5-9acd-4d61-b6aa-a216be79b1d5"
        },
        type: "get",
        // contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: baseUrl + "email/getEmails",
        data:{current:1,size:8,beginTime:"",endTime:""},
        // crossDomain:true,
        // async:false,
        contentType:"application/x-www-form-urlencoded; charset=utf-8",
        // xhrFields: { withCredentials: true },
        success: function (res) {
            if(res.success){
                // var data = res;
                var ulData = res.data.records;
                var ulHtml = "";
                for(i=0;i<ulData.length;i++){
                    var emailDate = (new Date(ulData[i].sentDate)).getTime();
                    ulHtml += "<li><a href='#' onclick='downloadEmailFile(this)' uploadUrl='" + ulData[i].files + "'>" +  ulData[i].subject + "</a><span class='date'>" + new Date(emailDate).format("yyyy-MM-dd") + "</span></li>"
                }
                $("#emailUl").append(ulHtml);
            }else{
                console.log(res);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });

    //获取阶段材料
    var aoData = [{
        "name":"iDisplayStart",
        "value":"0"
    },{
        "name":"iDisplayLength",
        "value":"8"
    },{
        "name":"isHome",
        "value": "1"
    }
    ];
      
    $.ajax({
        headers:{
            "Authorization" : "40ff4bf5-9acd-4d61-b6aa-a216be79b1d5"
        },
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: baseUrl + "file/GetDutyMat",
        data:JSON.stringify(aoData),
        // crossDomain:true,
        // async:false,
        // xhrFields: { withCredentials: true },
        success: function (res) {
            if(res.success){
                // var data = res;
                var ulData = res.data.data;
                var ulHtml = "";
                for(i=0;i<ulData.length;i++){
                    ulHtml += "<li><a href='#' onclick='downloadDocFile(this)' uploadUrl='" + ulData[i].soure + "'>" +  ulData[i].content + "</a><span class='date'>" + ulData[i].updateDate + "</span></li>"
                }
                $("#matUl11").append(ulHtml);
                $(".bd .mat").append(ulHtml);
            }else{
                console.log(res);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });

    //获取系统公告
    var aoData = [{
        "name":"iDisplayStart",
        "value":"0"
    },{
        "name":"iDisplayLength",
        "value":"7"
    },{
        "name": "isHome"
    }];
      
    $.ajax({
        headers:{
            "Authorization" : "40ff4bf5-9acd-4d61-b6aa-a216be79b1d5"
        },
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        url: baseUrl + "file/GetDutyAnno",
        data:JSON.stringify(aoData),
        // crossDomain:true,
        // async:false,
        // xhrFields: { withCredentials: true },
        success: function (res) {
            if(res.success){
                // var data = res;
                var ulData = res.data.data;
                var ulHtml = "";
                for(i=0;i<ulData.length;i++){
                    ulHtml += "<li><a href='#' onclick='downloadDocFile(this)' uploadUrl='" + ulData[i].soure + "'>" + "<b>·</b><span>" +  ulData[i].content + "</span>" + "</a><span class='date'>" + ulData[i].updateDate + "</span></li>"
                }
                $("#annoUl").append(ulHtml);
            }else{
                console.log(res);
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
});

Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,                 //月份 
       "d+" : this.getDate(),                    //日 
       "h+" : this.getHours(),                   //小时 
       "m+" : this.getMinutes(),                 //分 
       "s+" : this.getSeconds(),                 //秒 
       "q+" : Math.floor((this.getMonth()+3)/3), //季度 
       "S"  : this.getMilliseconds()             //毫秒 
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}

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

function downloadEmailFile(e){
    var url = e.attributes[2].value;
    if(url != ""){
        var files = url.split('|');
        for(i=0;i<files.length;i++){
            downloadEmail(files[i]);
        }
    }   
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

//系统当前日期
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}