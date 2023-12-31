$(function () {

  //调用getUserInfo获取用户信息
  getUserInfo()


  //点击退出按钮，实现退出功能
  const layer = layui.layer
  $('#btnLogOut').on('click', function () {
    //询问用户是否退出
    layer.confirm('确定退出?', { icon: 3, title: '提示' }, function (index) {
      //do something
      //1、清除本地存储的token
      localStorage.removeItem('token')
      //2、跳转到登录注册页面
      location.href = './login.html'

      //关闭confirm询问框
      layer.close(index);
    });
  })
})

//获取用户基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    //headers就是请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''
    // },
    success: function (res) {
      if (res.status !== 0) return layui.layer.msg('获取用户信息失败！')
      //调用 randerAvatar渲染用户头像
      randerAvatar(res.data)
    },
  })
}

//渲染用户头像
function randerAvatar(user) {
  //1、获取用户名称
  const name = user.nickname || user.username
  //2、设置欢迎文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  //3、按需渲染用户的头像
  if (user.user_pic !== null) {
    //3.1、渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    //3.2、渲染文本头像
    $('.layui-nav-img').hide()
    const first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}