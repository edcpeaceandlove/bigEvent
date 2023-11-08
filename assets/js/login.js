$(function () {
  //点击“去注册账号”链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })
  //点击“去登录”链接
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  //从layui中获取form对象
  const form = layui.form
  //从layui中获取layer对象
  const layer = layui.layer
  //通过form().verify自定义校验规则
  form.verify({
    //自定义了一个叫pwd的校验规则
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    //校验两次密码是否一致的规则
    reppwd: function (value) {
      //通过形参拿到的是确认密码框中的内容
      //还需要拿到密码框中的内容
      //在进行是否相等的判断
      //如果不相等，return一个提示
      const pwd = $('[name=setPassword]').val()
      if (value !== pwd) {
        return '两次密码不一致！'
      }
    }
  })

  //监听注册表单提交事件
  $('#form_reg').on('submit', function (e) {
    //阻止默认的表单提交行为
    e.preventDefault()
    //发起AJAX的POST请求
    var data = {
      username: $('[name=setUserName]').val(), password: $('[name=setPassword]').val()
    }
    $.post('/api/reguser', data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message)
      }
      layer.msg('账号注册成功！请登录')
      //模拟人的点击事件
      $('#link_login').click()
    })
  })

  //监听登录表单提交事件
  $('#form_login').submit(function (e) {
    //阻止表单默认提交事件
    e.preventDefault()
    $.ajax({
      url: '/api/login',
      method: 'POST',
      //快速获取表单中的数据
      data: $('#form_login').serialize(),
      success: function (res) {
        // console.log(res.status);
        if (res.status !== 0) {
          return layer.msg('登录失败！')
        }
        layer.msg('登录成功！')
        //登录成功后，将token值存储到localstorge中
        localStorage.setItem('token', res.token)
        // 跳转到后台主页
        location.href = './index.html'
      }
    })
  })

})