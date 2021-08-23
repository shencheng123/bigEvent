$(function() {
    //页面初始渲染表格
    getUserInfo();

    //点击重置按钮,相当于再掉一遍这个渲染
    $('[type=reset]').on('click', function(e) {
        e.preventDefault();
        getUserInfo();
    });

    //提交修改,调用修改用户信息接口
    $('[lay-submit]').on('click', function(e) {
        e.preventDefault();
        changeUserInfo();
        console.log(form.val('user_info'));
        //提交修改后渲染一下头像,前面已经写好了渲染头像的方法,这里直接调用相当于父页面的那个方法即可
        console.log(window.parentNode);
        window.parent.getUserInfo();
    });
});
var form = layui.form;
var layer = layui.layer;
//调用获取用户信息接口,初始渲染表单
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function(response) {
            console.log(response);
            //给表单赋值
            form.val("user_info", {
                "id": response.data.id,
                "username": response.data.username,
                "nickname": response.data.nickname,
                "email": response.data.email
            });
        }
    });
};

//表单校验
form.verify({
    demo: function(value) { //value：表单的
    },
    nickname: [
        /^[\S]{2,6}$/, '昵称必须2到6位，且不能出现空格'
    ]
});

function changeUserInfo() {
    $.ajax({
        type: "PUT",
        url: "/my/userinfo",
        data: form.val('user_info'),
        success: function(response) {
            console.log(response);
            if (response.code !== 0) {
                layer.msg('更新用户数据失败!');
            }
            layer.msg('更新用户数据成功!', { icon: 1 });
        }
    });
}