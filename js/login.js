$(function () {
  //登录
  $("#form-login").on("submit", function (e) {
    //阻止表单默认提交行为
    e.preventDefault();
    let data = {
      username: $("#form-login [name=username]").val(),
      password: $("#form-login [name=password]").val(),
      isAdministrator: getRedioValue("#form-login [name=status]"),
    };
    //是否勾选管理员
    if (data.isAdministrator == 1) {
      $.post("http://127.0.0.1:3007/api/loginAd", data, function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg("登录成功！");
        localStorage.setItem("username", data.username);
        location.href = "./bg.html";
      });
    } else {
      $.post("http://127.0.0.1:3007/api/login", data, function (res) {
        if (res.status !== 0) {
          console.log(res.message);
          return layer.msg(res.message);
        }
        console.log(res);
        layer.msg("登录成功！");
        localStorage.setItem("username", data.username);
        location.href = "./index.html";
      });
    }
  });

  //注册
  $("#form_reguser").on("click", function (e) {
    $("#form-login").hide();
    $("#form-reg").show();
  });
  $("#form-reg").on("submit", function (e) {
    //阻止表单默认提交行为
    e.preventDefault();
    let data = {
      username: $("#form-reg [name=username]").val(),
      password: $("#form-reg [name=password]").val(),
      isAdministrator: getRedioValue("#form-reg [name=status]"),
    };
    $.post("http://127.0.0.1:3007/api/reguser", data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg("注册成功！");
      if (data.isAdministrator == 1) {
        $.post("http://127.0.0.1:3007/api/loginAd", data, function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message);
          }
          layer.msg("登录成功！");
          localStorage.setItem("username", data.username);
          location.href = "./bg.html";
        });
      } else {
        $.post("http://127.0.0.1:3007/api/login", data, function (res) {
          if (res.status !== 0) {
            console.log(res.message);
            return layer.msg(res.message);
          }
          console.log(res);
          layer.msg("登录成功！");
          localStorage.setItem("username", data.username);
          location.href = "./index.html";
        });
      }
    });
  });

  //退出
  $(".quit").on("click", function () {
    localStorage.removeItem("username");
  });
});

//获取单选框的值
function getRedioValue(selector) {
  let isAdministrator;
  let identity = $(selector);
  for (let i = 0; i < identity.length; i++) {
    if (identity[i].checked) {
      isAdministrator = identity[i].value;
    }
  }
  return isAdministrator;
}
