$(function() {
    var addIndex;
    //初始调用获取列表接口并渲染数据到表格中,模板引擎
    initList();

    //弹出层
    $('#add_cate').on('click', function() {
        let htmlStr = template('addCate', {});
        // console.log(htmlStr);
        addIndex = layer.open({
            title: "添加文章分类",
            type: 1,
            content: htmlStr //这里content是一个普通的String
                ,
            area: ['500px', '250px']
        });
        //表单校验
        form.verify({
            demo: function(value, item) { //value：表单的值、item：表单的DOM对象
            },
            cate_alias: [
                /^[a-z|A-Z]{2,12}$/, '分类别名只能是2到12的字母'
            ]
        });
    });

    //点击确认添加,掉接口,成功后再渲染一遍表格
    $('body').on('click', '.addbtn', function(e) {
        e.preventDefault();

        $.ajax({
            type: "POST",
            url: "/my/cate/add",
            data: $('#add-form').serialize(),
            success: function(response) {
                if (response.code !== 0) {
                    layer.msg(response.message);
                }
                console.log(response);
                // layer.msg(response.message);
                layer.close(addIndex);
                //重新渲染表格
                initList();
            }
        });

    });

    //点击删除按钮,删除该处的数据
    $('tbody').on('click', '.removeCate', function() {
        $.ajax({
            type: "DELETE",
            url: "/my/cate/del?id=" + $(this).attr('data-id'),
            success: function(response) {
                if (response !== 0) {
                    layer.msg(response.message);
                }

                //删除成功,重新渲染
                initList();
            }
        });
    });
    var editIndex;
    //点击修改,弹出层
    $('tbody').on('click', '.editCate', function() {
        let htmlStr = template('editCate', {});
        editIndex = layer.open({
            title: "修改文章分类",
            type: 1,
            content: htmlStr //这里content是一个普通的String
                ,
            area: ['500px', '250px']
        });

        $.ajax({
            type: "GET",
            url: "/my/cate/info?id=" + $(this).attr('data-id'),
            success: function(response) {
                if (response.code !== 0) {
                    layer.msg(response.message);
                }
                console.log(response);
                // layer.msg(response.message);
                //渲染数据到表格
                //给表单赋值
                form.val("edit", { //formTest 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
                    "id": response.data.id,
                    "cate_name": response.data.cate_name // "name": "value"
                        ,
                    "cate_alias": response.data.cate_alias
                });
            }
        });
    });

    //点击确认修改
    $('body').on('click', '.editbtn', function(e) {
        e.preventDefault();
        $.ajax({
            type: "PUT",
            url: "/my/cate/info",
            data: $('[lay-filter="edit"]').serialize(),
            success: function(response) {
                if (response.code !== 0) {
                    layer.msg(response.message);
                }
                //成功,关闭弹窗并且重新渲染list
                layer.msg(response.message);
                layer.close(editIndex);

                initList();
            }
        });
    });

});
var layer = layui.layer;
var form = layui.form;

function initList() {
    $.ajax({
        type: "GET",
        url: "/my/cate/list",
        success: function(response) {
            if (response.code !== 0) {
                layer.msg(response.message);
            }
            // layer.msg(response.message);
            //渲染数据到表格

            var htmlStr = template('cateList', response);
            $('tbody').html(htmlStr);
        }
    });
}