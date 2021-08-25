$(function() {
    var layer = layui.layer;
    // 初始化富文本编辑器
    initEditor();

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options);

    $('.layui-btn-danger').on('click', function() {
        $('input[type=file]').click();
    });
    //点击上传文件
    $('input[type=file]').change(function(e) {
        $('.cover-left span').hide();
        var file = e.target.files[0];
        if (file) {
            var newImgURL = URL.createObjectURL(file);
            $image
                .cropper('destroy') // 销毁旧的裁剪区域
                .attr('src', newImgURL) // 重新设置图片路径
                .cropper(options) // 重新初始化裁剪区域
        }
    });

    //点击发布按钮,发起新增文章请求
    //状态为已发布 state = '已发布'
    //注册表单提交事件,获取表单的数据
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        let formdata = new FormData($('.layui-form')[0]);
        let file = $('input[type=file]')[0].files[0];
        console.log(file);
        formdata.append('state', '已发布');
        formdata.append('cover_img', file);

        $.ajax({
            type: "post",
            url: "/my/article/add",
            data: formdata,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(response) {
                if (response.code !== 0) {
                    layer.msg(response.message);
                }
                console.log(response);
            }
        });
    });
});