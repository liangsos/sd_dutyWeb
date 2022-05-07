layui.define(['layer'], function (exports) {
    var $ = layui.$
    var obj = { //数字加减函数（基本参数对象，最大值返回函数，最小值返回函数）        
        plusminus: function () {
            $(".plus-minus").each(function () { //定义按钮HTML                
                var plusminusbutton = '<button type="button" class="layui-btn layui-btn-sm layui-btn-normal vk-minus"><i class="fa fa-minus"></i></button>' + '<button type="button" class="layui-btn layui-btn-sm layui-btn-normal vk-plus"><i class="fa fa-plus"></i></button>';
                var data = new Object;
                data.step = $(this).find('input').data('step');
                data.maxvalue = $(this).find('input').data('maxvalue');
                data.minvalue = $(this).find('input').data('minvalue'); //定义默认参数，合并参数                
                options = $.extend({
                    step: 1, //每次点击加减的值                    
                    maxvalue: false, //最大值，默认false，不限制                    
                    minvalue: false, //最小值，默认false，不限制                
                }, data);
                var elem = $(this).find('input'),
                    step = parseInt(options.step),
                    maxvalue = options.maxvalue,
                    minvalue = options.minvalue; //参数不规范则返回                
                if (elem == null || elem == undefined) {
                    return
                };
                if (step == 0 || step == undefined) {
                    return
                }; //加入按钮HTML                
                $(elem).after(plusminusbutton); //点击增加                
                $(elem).parent().on("click", ".vk-plus", function () {
                    var nowinput = $(this).siblings("input"), //当前输入框元素                   
                        nowbutton = $(this).siblings("button"), //当前按钮元素                    
                        oldval = $(nowinput).val(), //点击前的值                    
                        newval = parseInt(oldval) + step; //点击后的值                    
                    if (newval < maxvalue && newval > minvalue) {
                        $(nowbutton).removeClass("layui-btn-disabled");
                    } //判断条件。是否最大值                    
                    if (maxvalue == false) {
                        $(nowinput).val(parseInt(oldval) + step);
                    }
                    if (maxvalue != 0 && newval < maxvalue) {
                        $(nowinput).val(parseInt(oldval) + step);
                    }
                    if (maxvalue != 0 && newval >= maxvalue) {
                        $(nowinput).val(maxvalue);
                        $(this).addClass("layui-btn-disabled");
                    } //模拟change事件                    
                    $(nowinput).trigger('change');
                    return;
                }); //点击减少（同上）               
                $(elem).parent().on("click", ".vk-minus", function () {
                    var nowinput = $(this).siblings("input"),
                        nowbutton = $(this).siblings("button"), //当前按钮元素                    
                        oldval = $(elem).val(),
                        newval = parseInt(oldval) - step;
                    if (newval < maxvalue && newval > minvalue) {
                        $(nowbutton).removeClass("layui-btn-disabled");
                    }
                    if (minvalue == false) {
                        $(nowinput).val(parseInt(oldval) - step);
                    }
                    if (minvalue != 0 && newval > minvalue) {
                        $(nowinput).val(parseInt(oldval) - step);
                    }
                    if (minvalue != 0 && newval <= minvalue) {
                        $(nowinput).val(minvalue);
                        $(this).addClass("layui-btn-disabled");
                    } //模拟change事件                    
                    $(nowinput).trigger('change');
                    return;
                });
            });
        }
    };
    exports('common', obj);
});