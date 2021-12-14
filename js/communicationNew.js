var token = $.session.get("sessionId");
var userAddvcd = $.session.get("addvcd");
// var userAddvcd = 3701;
var id = "";
var form;
var addvcdAdmin = '37';//点击树形结构节点的行政区码
var dataTree = new Array();
var table;

    var addvcdStcd;
    $.ajax({
        "headers":{
            "Authorization" : token
        },
        type: "get",
        async: false,
        dataType: "json",
        url: baseUrl + "getAddvcdStcd",
        success: function (res) {
            if (res.success) {
                addvcdStcd = res.data;
                var cityArr;
                for (i = 0; i < addvcdStcd.length; i++) {
                    if (addvcdStcd[i].city == null) {
                        if (cityArr != undefined) {
                            dataTree.push(cityArr);
                        }
                        cityArr = {
                            title: "",
                            id: "",
                            children: new Array(),
                            spread:false
                        }
                        cityArr.title = addvcdStcd[i].addvnm;
                        cityArr.id = addvcdStcd[i].addvcd;
                        if(userAddvcd.indexOf(addvcdStcd[i].addvcd) > -1){
                            cityArr.spread = true;
                        }
                    } else {
                        if (addvcdStcd[i].city == cityArr.id) {
                            cityArr.children.push({
                                title: addvcdStcd[i].addvnm.split("市")[1],
                                id: addvcdStcd[i].addvcd,
                            })
                        }
                    }
                }
                dataTree.unshift({
                    title: "山东省",
                    id: "37"
                })
                layui.use('tree', function () {
                    var tree = layui.tree;
                    //渲染
                    var inst = tree.render({
                        elem: '#cityTree',
                        data: dataTree,
                        id:'cityTree',
                        // showCheckbox: false,
                        // showLine: false,
                        // accordion: true
                        click: function (obj) {
                            //点击后更新表格
                            console.log(obj.data.id);
                            addvcdAdmin = obj.data.id
                            table.reload('comTable', {
                                where: {
                                    addvcd: addvcdAdmin
                                },
                                done:function(){
                                    if(userAddvcd != addvcdAdmin){
                                        $('.layui-table-tool').hide();
                                        $('.layui-btn').addClass("layui-btn-disabled")
                                    }else{
                                        $('.layui-table-tool').show();
                                        $('.layui-btn').removeClass("layui-btn-disabled")
                                    }
                                }
                            });
                        }
                    })

                //    var a = tree.setChecked('cityTree', 3701);
                })

            }
        },
        error: function (err) {
            console.log(err);
        }
    });


layui.use('table', function () {
    table = layui.table;
    var tableHeight = $('#tableDiv').height();
    //实例化
    //初始默认查询山东省水文中心数据
    // addvcdAdmin = dataTree[0].id;
    table.render({
        url: baseUrl + "getCommunicationNew",
        headers: {"Authorization" : token},
        elem: '#comTable',
        where: {
            addvcd: userAddvcd
        },
        page:false,
        toolbar: '#toolbarForCom',
        // defaultToolbar: ['filter', 'exports', 'print'],
        defaultToolbar: [],
        cols: [[//表头
            { type: 'numbers',title:'编号' },
            { field: 'name', title: '姓名' },
            { field: 'unit', title: '部门' },
            { field: 'position', title: '职务' },
            { field: 'tel', title: '电话' },
            { field: 'phone', title: '手机' },
            { fixed: 'right', title: '操作', toolbar: '#barDemo' }
        ]],
        // done:function(){
        //     if(userAddvcd != addvcdAdmin){
        //         $('.layui-table-tool').hide();
        //         $('.layui-btn').addClass("layui-btn-disabled")
        //     }else{
        //         $('.layui-table-tool').show();
        //         $('.layui-btn').removeClass("layui-btn-disabled")
        //     }
        // }
    })

    //工具栏触发事件
    table.on('toolbar(comTable)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        switch (obj.event) {
            case 'add': //新增
                form.val("communicationForm",{
                    "name":'',
                    "unit":'',
                    "position":'',
                    "tel":'',
                    "phone":''
                })
                layer.open({
                    type: 1,
                    title: "新增通讯录人员",
                    area: ['480px', '400px'],
                    content: $('#editPanel')
                })
                break;
        };
    });

    //行工具条事件
    table.on('tool(comTable)', function (obj) { 
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        id = data.id
        var isDis = $('.layui-btn').hasClass("layui-btn-disabled");//按钮是否禁用
        if (layEvent === 'del' && !isDis) { //删除
            layer.confirm('确认删除行么', function (index) {
                obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                layer.close(index);
                var del_id = data.id;
                //向服务端发送删除指令
                var res = post_webservice_par(token, {
                    id: del_id
                }, baseUrl + "communication/delCommunication");
                if (res) {
                    // console.log("删除成功")
                    layer.msg('删除成功！', {
                        icon: 6
                    });
                }
            });
        } else if (layEvent === 'edit' && !isDis) { //编辑
            //向表单填充值
            layer.open({
                type: 1,
                title: "编辑通讯录人员",
                area: ['480px', '400px'],
                content: $('#editPanel')
            })
            form.val("communicationForm",{
                "name":data.name,
                "unit":data.unit,
                "position":data.position,
                "tel":data.tel,
                "phone":data.phone
            })

        }
    });
})
layui.use('form', function () {
    form = layui.form;
    //监听提交
    form.on('submit(formSave)', function (data) {
        var formData = data.field;
        var objData = {
            name: formData.name,
            unit: formData.unit,
            position: formData.position,
            tel: formData.tel,
            phone: formData.phone,
            id: id,
            addvcd:addvcdAdmin
        };
        var params_info = JSON.stringify(objData);
        $.ajax({
            url: baseUrl + "saveCommunication",
            data: params_info,
            type: "post",
            headers: {"Authorization" : token},
            // traditional: true,
            async: false,
            contentType: "application/json; charset=utf-8",
            success: function (_res) {
                if (_res.success == true) {
                    layer.msg('保存成功！', {
                        icon: 6
                    });
                    layer.closeAll('page')
                    //执行重载
                    table.reload('comTable', {
                        where: {
                            addvcd: addvcdAdmin
                        }
                    });
                }
            },
            error: function (_res) {
                console.log(_res);
                layer.msg('保存失败！' + _res, {
                    icon: 5
                });
            },
        });
        return false;
    });
});