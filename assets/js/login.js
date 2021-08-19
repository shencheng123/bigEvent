$(function() {
    //登录与注册表单切换事件
    $('.reg_link a').on('click', function() {
        $('#login_form').hide();
        $('#reg_form').show();
    });

    $('.login_link a').on('click', function() {
        $('#reg_form').hide();
        $('#login_form').show();
    });

    //表单校验
    var form = layui.form;
    form.verify({
        //密码
        password: [
            /^[0-9]{6,12}$/,
            '密码必须为6到12位纯数字'
        ],
        //用户名
        user_name: function(value) {
            if (!/^[a-zA-Z]{2,6}$/.test(value)) {
                return '用户名必须2到6位纯小写字母';
            }
        },
        //确认密码
        repassword: function(value) {
            console.log($('#reg_form [name="password"]').val());
            console.log(value);
            if ($('#reg_form [name="password"]').val() != value) {
                return '两次输入密码必须保持一致';
            }
        }
    });

    var layer = layui.layer;
    //发送注册请求
    //http://api-breakingnews-web.itheima.net
    //shenz 123456
    $('#reg_form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/reg",
            data: $(this).serialize(),
            success: function(response) {
                if (response.code != 0) {
                    layer.msg(response.message, { icon: 2, time: 2000 });
                    return;
                }
                //注册成功,模拟执行去登陆的链接
                $('.login_link a').click();
                layer.msg(response.message, { icon: 1, time: 2000 });
            }
        });
    });

    //发送登录请求
    $('#login_form').submit(function(e) {
        e.preventDefault();
        console.log($(this).serialize());
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function(response) {
                console.log(response);
                if (response.code != 0) {
                    layer.msg(response.message, { icon: 2, time: 2000 });
                    return;
                }
                //登录成功后,把生成的token存入到localStorage中,带着token才能访问后续的功能接口
                localStorage.setItem('token', response.token);
                //登录成功跳转到index.html页面
                location.href = '/index.html';
                layer.msg(response.message, { icon: 1, time: 1000 });
            }
        });
    });
})