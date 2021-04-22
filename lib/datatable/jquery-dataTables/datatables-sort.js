//数字排序 空值放在最后
jQuery.fn.dataTableExt.oSort['number-sort-asc'] = function (s1, s2) {
    if (s1 == "")
        return 1;
    if (s2 == "")
        return -1;

    return s1 - s2;
};
jQuery.fn.dataTableExt.oSort['number-sort-desc'] = function (s1, s2) {
    if (s2 == "")
        return -1;

    return s2 - s1;
};

//中文排序  
jQuery.fn.dataTableExt.oSort['chinese-string-asc'] = function (s1, s2) {
    return s1.localeCompare(s2);
};
jQuery.fn.dataTableExt.oSort['chinese-string-desc'] = function (s1, s2) {
    return s2.localeCompare(s1);
};

//河道告警信息排序
jQuery.fn.dataTableExt.oSort['chinese-hdgj-asc'] = function (s1, s2) {
    if (s1.indexOf("超历史") > -1)
        s1 = "E" + s1;
    if (s1.indexOf("超保证") > -1)
        s1 = "D" + s1;
    if (s1.indexOf("超警戒") > -1)
        s1 = "C" + s1;
    if (s1.indexOf("正常水位") > -1)
        s1 = "B" + s1;
    if (s1.indexOf("无信息") > -1)
        s1 = "A" + s1;

    if (s2.indexOf("超历史") > -1)
        s2 = "E" + s2;
    if (s2.indexOf("超保证") > -1)
        s2 = "D" + s2;
    if (s2.indexOf("超警戒") > -1)
        s2 = "C" + s2;
    if (s2.indexOf("正常水位") > -1)
        s2 = "B" + s2;
    if (s2.indexOf("无信息") > -1)
        s2 = "A" + s2;

    return s1.localeCompare(s2);
};
jQuery.fn.dataTableExt.oSort['chinese-hdgj-desc'] = function (s1, s2) {
    if (s1.indexOf("超历史") > -1)
        s1 = "E" + s1;
    if (s1.indexOf("超保证") > -1)
        s1 = "D" + s1;
    if (s1.indexOf("超警戒") > -1)
        s1 = "C" + s1;
    if (s1.indexOf("正常水位") > -1)
        s1 = "B" + s1;
    if (s1.indexOf("无信息") > -1)
        s1 = "A" + s1;

    if (s2.indexOf("超历史") > -1)
        s2 = "E" + s2;
    if (s2.indexOf("超保证") > -1)
        s2 = "D" + s2;
    if (s2.indexOf("超警戒") > -1)
        s2 = "C" + s2;
    if (s2.indexOf("正常水位") > -1)
        s2 = "B" + s2;
    if (s2.indexOf("无信息") > -1)
        s2 = "A" + s2;

    return s2.localeCompare(s1);
};

//水库蓄量统计-水库类型
jQuery.fn.dataTableExt.oSort['chinese-xltj-asc'] = function (s1, s2) {
    if (s1.indexOf("大(一)型") > -1) {
        s1 = "G" + s1;
    } else if (s1.indexOf("大(二)型") > -1) {
        s1 = "F" + s1;
    } else if (s1.indexOf("中型") > -1) {
        s1 = "E" + s1;
    } else if (s1.indexOf("小(一)型") > -1) {
        s1 = "D" + s1;
    } else if (s1.indexOf("小(二)型") > -1) {
        s1 = "C" + s1;
    } else if (s1 == "") {
        s1 = "B" + s1;
    } else {
        s1 = "A" + s1;
    }

    if (s2.indexOf("大(一)型") > -1) {
        s2 = "G" + s2;
    } else if (s2.indexOf("大(二)型") > -1) {
        s2 = "F" + s2;
    } else if (s2.indexOf("中型") > -1) {
        s2 = "E" + s2;
    } else if (s2.indexOf("小(一)型") > -1) {
        s2 = "D" + s2;
    } else if (s2.indexOf("小(二)型") > -1) {
        s2 = "C" + s2;
    } else if (s2 == "") {
        s2 = "B" + s2;
    } else {
        s2 = "A" + s2;
    }

    return s1.localeCompare(s2);
};
jQuery.fn.dataTableExt.oSort['chinese-xltj-desc'] = function (s1, s2) {
    if (s1.indexOf("大(一)型") > -1) {
        s1 = "G" + s1;
    } else if (s1.indexOf("大(二)型") > -1) {
        s1 = "F" + s1;
    } else if (s1.indexOf("中型") > -1) {
        s1 = "E" + s1;
    } else if (s1.indexOf("小(一)型") > -1) {
        s1 = "D" + s1;
    } else if (s1.indexOf("小(二)型") > -1) {
        s1 = "C" + s1;
    } else if (s1 == "") {
        s1 = "B" + s1;
    } else {
        s1 = "A" + s1;
    }

    if (s2.indexOf("大(一)型") > -1) {
        s2 = "G" + s2;
    } else if (s2.indexOf("大(二)型") > -1) {
        s2 = "F" + s2;
    } else if (s2.indexOf("中型") > -1) {
        s2 = "E" + s2;
    } else if (s2.indexOf("小(一)型") > -1) {
        s2 = "D" + s2;
    } else if (s2.indexOf("小(二)型") > -1) {
        s2 = "C" + s2;
    } else if (s2 == "") {
        s2 = "B" + s2;
    } else {
        s2 = "A" + s2;
    }

    return s2.localeCompare(s1);
};

//百分率排序  
jQuery.fn.dataTableExt.oSort['number-fate-asc'] = function (s1, s2) {
    s1 = s1.replace('%', '');
    s2 = s2.replace('%', '');
    return s1 - s2;
};

jQuery.fn.dataTableExt.oSort['number-fate-desc'] = function (s1, s2) {
    s1 = s1.replace('%', '');
    s2 = s2.replace('%', '');
    return s2 - s1;
};

//DataTables默认配置修改
$.extend(true, $.fn.dataTable.defaults, {
    "scrollY": false,
    "scrollX": false,
    "processing": true,             //进度
    "scrollCollapse": true,         //高度自适应
    "paginate": false,               //显示分页器
    "lengthChange": false,          //改变每页数量
    "displayLength": 10,            //默认记录数
    "filter": false,                //启动过滤、搜索功能
    "sort": false,                  //是否启动各个字段的排序功能
    "stateSave": false,              //客户端状态记录功能                    
    "jQueryUI": false,              //是否使用 jQury的UI them
    "info": false,                   //表格底部说明
    "autoWidth": true,
    "oLanguage": { //语言设置
        "sProcessing": "<img src='../Images/loading.gif'/>",
        "sLengthMenu": "每页显示 _MENU_ 条",
        "sInfo": "从 _START_ 到  _END_ 条记录 总记录数为 _TOTAL_ 条",
        "sInfoEmpty": "记录数为0",
        "sInfoFiltered": "(全部记录数 _MAX_ 条)",
        "sInfoPostFix": "",
        "sSearch": "搜索",
        "sUrl": "",
        "oPaginate": {
            "sFirst": "首页",
            "sPrevious": "上页",
            "sNext": "下页",
            "sLast": "末页"
        }
    }
});