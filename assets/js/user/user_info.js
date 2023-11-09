$(function () {
  //校验表单输入格式
  const form = layui.form
  const layer = layui.layer
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return '昵称长度必须在1~6个字符之间!'
      }
    }
  })


  initUserInfo()

  //初始化用户信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败！')
        }
        // console.log(res);
        //调用form.val()为表单快速赋值
        form.val('formUserInfo', res.data)
      }
    })
  }

  //重置用户信息
  $('#btnReset').on('click', function (e) {
    e.preventDefault()
    initUserInfo()
  })

  //监听表单提交事件
  $('.layui-form').on('submit', function (e) {
    e.preventDefault()

    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $('.layui-form').serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！')
        }
        layer.msg('更新用户信息成功！')
        //调用父页面中的方法，重新渲染用户头像和用户信息
        window.parent.getUserInfo()
      }
    })

  })
})