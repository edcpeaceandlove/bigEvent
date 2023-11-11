$(function () {
  const layer = layui.layer
  const form = layui.form
  const layedit = layui.layedit;

  initCate()
  //定义加载文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败！')
        }
        //调用模板引擎，渲染分类的下拉菜单
        let htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        //记得一定要用form.render()
        form.render()
      }
    })
  }

  //建立编辑器
  layui.use('layedit', function () {
    layedit.build('content'); //建立编辑器
  });

  //自定义编辑器的工具Bar
  layedit.build('content', {
    tool: [
      'strong' //加粗
      , 'italic' //斜体
      , 'underline' //下划线
      , 'del' //删除线

      , '|' //分割线

      , 'left' //左对齐
      , 'center' //居中对齐
      , 'right' //右对齐
      , 'link' //超链接
      , 'unlink' //清除链接
      , 'face' //表情
      , 'image' //插入图片
      , 'help' //帮助
    ]
  });

  const $image = $('#image')
  const options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  $image.cropper(options)
  //为选择封面的按钮，绑定点击事件处理函数
  $('#btnChooseImage').on('click', function (e) {
    $('#file').click()
  })

  $('#file').on('change', function (e) {
    //获取到文件的列表数组
    const files = e.target.files
    //判断用户是否选择了文件
    if (files.lengh === 0) {
      return
    }
    //根据文件，创建对应的URL地址
    const newImgURL = URL.createObjectURL(files[0])
    //为裁剪区域重新设置图片
    $image
      .cropper('destroy')//销毁旧的剪裁区域
      .attr('src', newImgURL)//重新设置图片路径
      .cropper(options)//重新初始化剪裁区域

  })




  //定义文章的发布状态
  let art_state = '已发布'
  //为存为草稿，添加点击事件监听
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })

  //为表单添加submit提交事件
  $('#form-pub').on('submit', function (e) {
    //1.阻止表单的默认提交行为
    e.preventDefault()
    //2.基于form表单，快速创建一个FormData对象
    let fd = new FormData($(this)[0])
    //3.将文章的发布状态，存到fd中
    fd.append('state', art_state)
    //4.将裁剪后的图片，输出为文件
    $image
      .cropper('getCroppedCanvas', {//创建一个Canvas画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {//将Canvas画布上的内容，转化为文件对象
        //得到文件对象后，进行后续的操作\
        //5.将文件对象存储到fd中
        fd.append('cover_img', blob)
        //6.发起ajax请求  
        publishArticle(fd)
      })
  })

  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      //注意:如果想服务器提交的时FormData格式的数据，必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        //发布文章成功后，跳转到文章列表页面
        location.href = '../article/art_list.html'

      }
    })
  }
})