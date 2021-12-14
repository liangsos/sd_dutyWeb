var aoData = [
    {
        "name": "sEcho",
        "value": "1"
    },
    {
        "name": "iDisplayStart",
        "value": "0"
    },
    {
        "name": "iDisplayLength",
        "value": "1000"
    },
    {
        "name": "search_begin_time",
        "value": ""
    },
    {
        "name": "search_end_time",
        "value": ""
    }
];
  
$.ajax({
    // headers:{
    //     "Authorization" : "40ff4bf5-9acd-4d61-b6aa-a216be79b1d5"
    // },
    type: "POST",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    url: "http://10.37.1.155:9003/sd-duty/api/file/GetDutyDoc",
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
            $("#dutyDocUl").append(ulHtml);
        }else{
            console.log(res);
        }
    },
    error: function (err) {
        console.log(err);
    }
});