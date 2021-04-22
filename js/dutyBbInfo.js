$(function (){ 
    var token = $.session.get("sessionId");
    var date = $.session.get("searchDate");
    getDutyBbInfo(date,token);
    $('#labDate').text(date);
    $.session.remove('searchDate');
}); 

/**
 * 获取值班记录详细信息
 * @param {*} time 
 * @param {*} token 
 */
function getDutyBbInfo(time,token) {
        $.ajax({
            headers:{
                "Authorization" : token
            },
            "type": "POST",
            // "contentType": "application/json; charset=utf-8",
            "dataType": 'json',
            "url": baseUrl + "dutyQuery/getDutyBbInfo",
            "data": {date:time},
            "async":false, 
            "success": function (res) {
                if(res.success){
                    $('#labLeader').text(res.data.leader);
                    $('#labMember').text(res.data.member);
                    $('#recordBody').html(res.data.infoBody);
                }
                
            }
        });
    }