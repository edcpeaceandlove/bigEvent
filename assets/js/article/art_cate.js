$(function () {

  const layer = layui.layer
  const form = layui.form
  initArtCateList()

  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        const htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  //为添加类别按钮绑定点击事件
  let indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    });
  })

  //通过代理的形式为form-add添加提交事件监听
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()

    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增分类失败！')
        }
        initArtCateList()
        layer.msg('新增分类成功！')
        //根据索引，关闭相应的弹出层
        layer.close(indexAdd)
      }
    })
  })

  //通过代理的形式为form-edit添加点击事件监听
  let indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })


    let id = $(this).attr('data-id')
    //发起请求获取对应分类的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        // console.log(res);
        form.val('form-edit', res.data)
      }
    })
  })

  //通过代理的形式为修改文章分类表单添加提交事件监听
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()

    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          // console.log(res);
          return layer.msg('分类修改失败！')
        }
        layer.msg('分类修改成功！')

        layer.close(indexEdit)
        initArtCateList()

      }
    })
  })

  //通过代理的形式，为删除按钮添加点击事件监听
  $('body').on('click', '.btn-delete', function () {
    let id = $(this).attr('data-id')
    //提示用户是否确认删除
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除失败！')
          }
          layer.msg('删除成功！')
          layer.close(index);
          initArtCateList()
        }
      })
    });

  })
})