$(function() {
    //分析功能,不管我们点击上面的筛选还是下面的分页,本质上都是去调用查询接口,根据不同的查询条件,返回不同的数据,渲染到页面,因此我们定义一个全局变量q,用来接收当前状态下的查询条件

    //初始化渲染表格
    initList();

    //获取分类数据,并渲染到下拉框中
    initSelect();

    //点击筛选按钮,实际上只要修改下查询条件q,并发送请求数据即可
    //点击筛选按钮,自动将下拉菜单选中的值赋值给查询条件p
    $('[lay-submit]').on('click', function(e) {
        e.preventDefault();
        q.cate_id = $('select[name=cate_name]').val();
        q.state = $('select[name=state]').val();

        //如果没有选择下拉框,就不需要发送请求了
        // if (!$('select[name=cate_name]').val() && !$('select[name=state]').val()) {
        //     return;
        // }
        initList();
        //如果当前页的数据为空的话,就去取前一页的数据,重新渲染一下;
    });

    //点击修改按钮,直接跳到发布文章案例
    $('tbody').on('click', '.edit', function() {
        let id = $(this).attr('data-id');

        //并且渲染你点击的那个文章数据到页面上
        $.ajax({
            type: "get",
            url: "/my/article/info?id=" + id,
            success: function(response) {
                if (response.code !== 0) {
                    layer.msg(response.message);
                }
                console.log(response);
                let data = response.data;

                layer.open({
                    area: ['100%', '100%'],
                    type: 2,
                    content: '/article/article_pub.html',
                    success: function(layero, index) {
                        var body = layer.getChildFrame('body', index);
                        var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                        // console.log(body.html()) //得到iframe页的body内容
                        // body.find('input').val('Hi，我是从父页来的')
                        //给表单赋值
                        body.find('input[name=title]').val(data.title);
                        body.find('select[name=cate_id]').val(4);

                        //给value=4的这一项添加select属性
                        body.find('select[name=cate_id] option');
                        console.log(body.find('select[name=cate_id] option[value=4]').attr('selected', 'selected'));
                        layui.use('form', function() {
                            var form = layui.form;
                            form.render();
                            //各种基于事件的操作，下面会有进一步介绍
                        });

                        console.log(body.find('select[name=cate_id]').val());
                        body.find('textarea').text(data.content);
                        body.find('#image').attr('src', 'http://www.liulongbin.top:3008' + data.cover_img);

                    }
                });
            }
        });

    });

});

var layer = layui.layer;
var form = layui.form;
var total; //文章的总数
var q = {
    pagenum: 1, //默认查询第一页
    pagesize: 2, //默认一页显示2条
    cate_id: '',
    state: ''
};

//判断是否是个位数
function bu(params) {
    if (params < 10) {
        return '0' + params;
    }
    return params;
}

//格式化日期过滤器
template.defaults.imports.dateFormat = function(value) {
    let date = new Date(value);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return `${year}-${bu(month)}-${bu(day)} ${bu(hour)}:${bu(minute)}:${bu(second)}`;
}

function initList() {
    //在获取数据之前,先判断一下
    $.ajax({
        type: "get",
        url: "/my/article/list",
        data: q,
        success: function(response) {
            if (response.code !== 0) {
                layer.msg(response.message);
            }
            console.log(response);
            let htmlStr = template('articleList', response);

            //如果当前页返回的data为
            total = response.total;

            $('tbody').html(htmlStr);
            pageBreak(response.total);
            //创建分页模块

            //如果表格中没有数据,那么我们就去获取前一页的数据
            if ($('tbody tr').length == 0 && q.pagenum > 1) {
                q.pagenum -= 1;
                initList();
            }

        }
    });
}

function initSelect() {
    $.ajax({
        type: "get",
        url: "/my/cate/list",
        success: function(response) {
            if (response.code !== 0) {
                layer.msg(response.message);
            }
            console.log(response);

            let htmlStr = template('cateList', response);
            $('.option').html(htmlStr);
            form.render('select'); //刷新select选择框渲染
        }
    });

}

function pageBreak(total) {
    //创建分页模块
    layui.use('laypage', function() {
        //执行一个laypage实例
        var laypage = layui.laypage;
        laypage.render({
            elem: 'page_break',
            limit: q.pagesize, //每页显示多少条
            limits: [1, 2, 3, 4, 5],
            curr: q.pagenum, //默认显示第一页
            count: total,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            jump: function(obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                // 首次不执行
                if (!first) {

                    //do something
                    //切换分页触发jump函数,发送请求渲染表格数据
                    initList();
                }
            }
        });
    });
}