  $(function() {

      //页面加载,渲染裁剪区的图片为用户上传的图片
      getUserPic();

      var layer = layui.layer;
      // 1.1 获取裁剪区域的 DOM 元素
      var $image = $('#image')
          // 1.2 配置选项
      const options = {
          // 纵横比
          aspectRatio: 1,
          // 指定预览区域
          preview: '.img-preview'
      }

      // 1.3 创建裁剪区域
      $image.cropper(options);

      $('.upload').on('click', function(e) {
          $('[type=file]').click();
          //   console.log($('[type=file]'));
          //   var file = $('[type=file]')[0].files[0];
          //   console.log(file);
      });
      //自动调用点击input按钮
      $('[type=file]').on('change', function(e) {
          var flie = e.target.files[0];

          var newImgURL = URL.createObjectURL(flie);
          //   console.log(newImgURL);

          $image
              .cropper('destroy') // 销毁旧的裁剪区域
              .attr('src', newImgURL) // 重新设置图片路径
              .cropper(options) // 重新初始化裁剪区域
      });

      //点击确定发送更新头像请求
      $('.confirm').on('click', function() {

          var dataURL = $image
              .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                  width: 100,
                  height: 100
              })
              .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
          $.ajax({
              type: "PATCH",
              url: "/my/update/avatar",
              data: {
                  avatar: dataURL
              },
              success: function(response) {
                  if (response !== 0) {
                      layer.msg(response.message);
                  }
                  layer.msg(response.message);
                  //渲染首页上的头像
                  window.parent.getUserInfo();
              }
          });
      });
  });

  function getUserPic() {
      $.ajax({
          type: "GET",
          url: "/my/userinfo",
          success: function(response) {
              if (response.code !== 0) {
                  layer.msg(response.message, { icon: 2 });
              }
              //   layer.msg(response.message, { icon: 1 });
              console.log(response);
          },
      });
  }