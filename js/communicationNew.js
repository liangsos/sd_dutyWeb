var token = $.cookie('sessionId');
$(function () {
    var addvcdStcd;
    var dataTree = new Array();
    $.ajax({
        type: "get",
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
                            children: new Array()
                        }
                        cityArr.title = addvcdStcd[i].addvnm;
                        cityArr.id = addvcdStcd[i].addvcd;
                    } else {
                        if (addvcdStcd[i].city == cityArr.id) {
                            cityArr.children.push({
                                title: addvcdStcd[i].addvnm.split("市")[1],
                                id: addvcdStcd[i].addvcd
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
                        // showLine: false,
                        // accordion: true
                        click: function (obj) {
                            console.log(obj.data);
                            console.log(obj.elem);
                        }
                    })
                })
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
})

layui.use('table', function () {
    var table = layui.table;
    var tableHeight = $('#tableDiv').height();
    //实例化
    table.render({
        url: baseUrl + "getCommunicationNew",
        elem: '#comTable',
        defaultToolbar: ['filter', 'exports', 'print'],
        cols: [[//表头
            { type: 'numbers' },
            { field: 'name', title: '姓名' },
            { field: 'unit', title: '部门' },
            { field: 'position', title: '职务' },
            { field: 'tel', title: '电话' },
            { field: 'phone', title: '手机' },
            { fixed: 'right', title: '操作', toolbar: '#barDemo' }
        ]]
    })

    //工具条事件
    table.on('tool(comTable)', function (obj) { 
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值
        var tr = obj.tr; //获得当前行 tr 的 DOM 对象

        if (layEvent === 'del') { //删除
            layer.confirm('确认删除行么', function (index) {
                obj.del(); //删除对应行（tr）的DOM结构，并更新缓存
                layer.close(index);
                var del_id = data.id;
                //向服务端发送删除指令
                var res = post_webservice_par(token, {
                    id: del_id
                }, baseUrl + "communication/delCommunication");
                if (res) {
                    console.log("删除成功")
                }
            });
        } else if (layEvent === 'edit') { //编辑
            //do something

            //同步更新缓存对应的值
            obj.update({
                username: '123',
                title: 'xxx'
            });
        }
    });
})