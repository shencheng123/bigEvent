$(function() {
    var layer = layui.layer;
    //调用个人信息接口
    getUserInfo();
    //渲染头像
    //退出模块
    $('.exit').on('click', function() {
        //点击退出按钮,跳转至登录页面,并且清空这个local里的token值
        location.href = '/login.html';
        localStorage.removeItem('token');

    });

});

function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // headers: {
        //     //使用||更加严谨,如果local里没有token这个键,name我们就默认返回个'';
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(response) {
            if (response.code !== 0) {
                layer.msg(response.message, { icon: 2 });
            }
            // layer.msg(response.message, { icon: 1 });
            //渲染这个头像
            getUserPic(response.data);
        },
        // complete: function(response) {
        //     // console.log(response);
        //     if (response.responseJSON.code !== 0 && response.responseJSON.message !== '获取用户基本信息成功！') {
        //         location.href = '/login.html';
        //     }
        // }
    });
}


function getUserPic(data) {
    if (data.nickname) {
        $('.welcome').html(data.nickname);
    } else {
        $('.welcome').html(data.username);
    }

    //如果信息中包含头像pic,就把该pic渲染到对应位置,如果不包含pic,就使用默认的头像
    if (data.user_pic) {
        $('.default_pic').hide();
        $('.default_pic').siblings('img').show().prop('src', data.user_pic);
    } else {
        console.log($('.default_pic'));
        //如果用户信息中包含昵称,优先展示昵称信息,再是登录信息
        if (data.nickname) {
            $('.default_pic').html(data.nickname[0].toUpperCase());
        } else {
            $('.default_pic').html(data.username[0].toUpperCase());
        }

        $('.default_pic').show();
        $('.default_pic').siblings('img').hide();
    }
}