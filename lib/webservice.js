/**
 * ajax调用后台 无参数
 */
function post_webservice(url) {
    var returnStr = "";
    $.ajax({
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        async: false,
        url: url,
        success: function (data) {
            returnStr = data.d;
        }
    })
    return returnStr;
}

/**
 * ajax调用后台 无参数
 */
function post_webservice_new(token,url) {
    var returnStr = "";
    $.ajax({
        headers:{
            "Authorization" : token
        },
        type: 'post',
        // contentType: "application/json; charset=utf-8",
        dataType: 'json',
        async: false,
        url: url,
        success: function (res) {
            returnStr = res.data;
        }
    })
    return returnStr;
}

/**
 * ajax调用后台 传参json
 */
function post_webservice_json(paramObj, url) {
    var returnStr = "";
    $.ajax({
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        async: false,
        url: url,
        traditional: true,
        data: paramObj,
        success: function (data) {
            returnStr = data.d;
        }
    })
    return returnStr;
}

function post_webservice_text(paramObj) {
    console.log("开始");
    var returnStr = "";
    $.ajax({
        type: 'post',
        async: false,
        dataType: 'text',
        url: 'webserviceHandler.ashx',
        traditional: true,
        data: { paramInfo: JSON.stringify(paramObj) },
        success: function (data) {
            returnStr = data;
            console.log("成功");
        }
    })
    return returnStr;
}

function post_webservice_par(token,paramObj,url){
    var returnStr = "";
    $.ajax({
        headers:{
            "Authorization" : token
        },
        type: 'post',
        // contentType: "application/json; charset=utf-8",
        dataType: 'json',
        async: false,
        url: url,
        traditional: true,
        data: paramObj,
        success: function (res) {
            returnStr = res.data;
        }
    })
    return returnStr;
}

function get_webservice(token,paramObj,url){
    var returnStr = "";
    $.ajax({
        headers:{
            "Authorization" : token
        },
        type: 'get',
        // contentType: "application/json; charset=utf-8",
        // dataType: 'json',
        async: false,
        url: url,
        traditional: true,
        data: paramObj,
        success: function (res) {
            returnStr = res.data;
        }
    })
    return returnStr;
}

function post_webservice_json_new(token,paramObj,url){
    var returnStr = "";
    $.ajax({
        headers:{
            "Authorization" : token
        },
        type: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        async: false,
        url: url,
        traditional: true,
        data: paramObj,
        success: function (res) {
            returnStr = res.data;
        }
    })
    return returnStr;
}

function post_webservice_file(token,paramObj,url){
    var returnStr = "";
    $.ajax({
        headers:{
            "Authorization" : token
        },
        url: url,
        type: "post",
        data: paramObj,
        async: false,
        contentType: false,
        processData: false,
        success: function(res){
            returnStr = res.data;
        },
        error: function(err){
            console.error(err);
        }
    });
    return returnStr;
}
