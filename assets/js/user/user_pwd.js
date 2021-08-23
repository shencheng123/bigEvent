$(function() {
    var form = layui.form;
    //表单校验
    form.verify({
        newpwd: function(value) { //value：表单的值、item：表单的DOM对象
            if (value == $('[name=old_pwd]').val()) {
                return '新密码不能与原密码相同';
            }
        },
        repassword: function(value) { //value：表单的值、item：表单的DOM对象
            if (value != $('[name=new_pwd]').val()) {
                return '确认密码输入错误';
            }
        }

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        ,
        password: [
            /^[0-9]{2,6}$/,
            '密码必须2到6位纯数字'
        ]
    });

    //提交修改密码接口
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        console.log($('.layui-form').serialize());
        changePassword();
    });

});

var layer = layui.layer;

function changePassword() {
    $.ajax({
        type: "PATCH",
        url: "/my/updatepwd",
        data: $('.layui-form').serialize(),
        success: function(response) {
            console.log(response);
            if (response.code !== 0) {
                layer.msg(response.message, { icon: 2 });
                return;
            }
            layer.msg(response.message);

            $('.layui-form')[0].reset();
        }
    });
}