//系统名称
var _system_name = "防汛抗旱值班管理系统 -";

/**
* 初始化日期控件
**/
function initDatePicker(className, format, minView) {
    $(className).datetimepicker({
        language: 'zh-CN',
        format: format,
        weekStart: 1,
        autoclose: true,
        startView: 2,
        todayBtn: true,
        todayHighlight: true,
        minView: minView,
        forceParse: false
    });
}


/**
* 判断浏览器类型
**/
function msieVersion() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    if (msie > 0) // If Internet Explorer, return version number
    {
        return true;
    }
    else  // If another browser, return 0
    {
        return false;
    }
    return false;
}

/**
* 字符串中删除指定文档
**/
function delStrFiles(files, file) {
    var res = "";
    var str = files.replace(file, "");
    var arr = str.split(";");
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == "")
            continue;

        if (res != "") {
            res += ";";
        }
        res += arr[i];
    }

    return res;
}

/**
* 传真记录-文件名显示时 去除年月
**/
function delYMStrFile(str) {
    if (str.length > 7) {
        if (str.indexOf(";") > -1) {
            var temp = "";
            var arr = str.split(";");
            for (var i = 0; i < arr.length; i++) {
                if (temp != "") {
                    temp += ";";
                }
                temp += arr[i].substr(7);
            }

            str = temp;
        }
        else {
            str = str.substr(7);
        }
    }

    return str;
}

/**
* 获取预览传真html
**/
function getFaxTiff(path, width, height) {
    var h5 = "<object width='" + width + "' height='" + height + "' classid='CLSID:106E49CF-797A-11D2-81A2-00E02C015623'>";
    h5 += "若加载失败,请先下载插件<a href='../Uploads/fax/alternatiff-1.8.exe'>点击下载(IE版)</a><a href='../Uploads/fax/alternatiff-pl-w32-2.0.8.exe'>点击下载(非IE版)</a>";
    h5 += "<param name='src' value='" + path + "'>";
    h5 += "<embed width='" + width + "' height='" + height + "' src='" + path + "' wmode='transparent' type='application/x-alternatiff' bgcolor='#FFFFFF' mousemode='pan' toolbaritems='PA,BF,FW,FH,FS,SS,O4,O1,O2,O3,O6,O5,SM,PG,PP,NP'></object>";

    return h5;
}

/**
* JS校验日期格式
**/
function checkDate(d) {
    var ds = d.match(/\d+/g);
    var ts = ['getFullYear', 'getMonth', 'getDate', 'getHours', 'getMinutes'];
    var d = new Date(d.replace(/-/g, '/'));
    var i = 4;
    ds[1]--;  //月份减一

    try {
        while (i--) {
            if (ds[i] * 1 != d[ts[i]]())
                return false;
        }
    } catch (e) {
        return false
    }
    return true;
}