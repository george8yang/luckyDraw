$(function () {
  //获取用户信息确认用户有无权限
  let username = localStorage.getItem("username");
  if (!username) {
    location.href = "./index.html";
  } else {
    $.get("http://127.0.0.1:3007/api/userinfo", { username }, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      if (res.data.isAdministrator !== 1) {
        location.href = "./index.html";
      }
    });
  }
  //获取奖品信息
  $.get("http://127.0.0.1:3007/api/prizes", function (res) {
    if (res.status !== 0) {
      return layer.msg(res.message);
    }
    let data = res.data;
    //渲染奖品信息
    for (let i = 0; i < data.length; i++) {
      $("tbody").append(template("#prize", data[i]));
      //解决layui动态生成的option不显示问题
      layui.use("form", function () {
        var form = layui.form;
        form.render();
      });
      if (i !== data.length - 1) {
        //渲染select选项
        $("select").append(template("#selectprize", data[i]));
      }
    }
    //编辑弹出层
    $("tbody").on("click", ".btn-edit", function (e) {
      let id = $(this).attr("data-id");
      //设置默认值
      let str = template($("#editForm"), data[id - 1]);
      layer.open({
        type: 1,
        title: `编辑奖品${id}`,
        area: ["500px", "300px"],
        content: str,
      });
    });
  });
  //绑定弹出层表单提交
  let data = {};
  //通过委托绑定上传图片事件
  $("body").on("click", "#btnChooseImage", function () {
    $("#file").click();
    console.log($("#file")[0]);
  });
  $("body").on("change", "#file", function (e) {
    let filelist = e.target.files;
    console.log(filelist);
    if (filelist.length === 0) {
      return layer.msg("请选择图片！");
    }
    //拿到选择的图片
    let file = filelist[0];
    //将图片转换为路径
    let newImgURL = URL.createObjectURL(file);
    //转为base64格式并展示
    getUrlBase64(newImgURL, "png", function (base64) {
      $("#image")[0].src = base64;
      data.picture = base64;
    });
  });
  //绑定弹出层表单提交
  $("body").on("submit", "#editBady", function () {
    let obj = {
      id: $("#editBady [type=hidden]").attr("data-id"),
      prizename: $("#editBady [name=prizename]").val(),
      number: $("#editBady [name=number]").val(),
    };
    data = { ...data, ...obj };
    $.post("http://127.0.0.1:3007/api/edit", data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg("更新奖品成功！");
    });
  });
  // 抽奖设置表单渲染
  $.get("http://127.0.0.1:3007/api/drawinfo", function (res) {
    if (res.status !== 0) {
      return layer.msg(res.message);
    }
    let data = res.data;
    console.log(data);
    console.log($("#big").val());
    $("tfoot [colspan=4]").html(data.prizesum);
    $("#prizesum").val(data.prizesum);
    $("#setTime").val(data.time);
    $("#probability").val(data.probability);
  });

  //绑定抽奖设置表单提交
  $("#drawset").on("submit", function (e) {
    e.preventDefault();
    console.log($(this).serialize());
    let data = $(this).serialize();
    $.post("http://127.0.0.1:3007/api/drawset", data, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      layer.msg("更新抽奖设置成功！");
    });
  });

  //退出
  $(".quit").on("click", function () {
    localStorage.removeItem("username");
  });
});

//将图片转换为Base64函数
function getUrlBase64(url, ext, callback) {
  var canvas = document.createElement("canvas"); //创建canvas DOM元素
  var ctx = canvas.getContext("2d");
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = url;
  img.onload = function () {
    canvas.height = 100; //指定画板的高度,自定义
    canvas.width = 100; //指定画板的宽度，自定义
    ctx.drawImage(img, 0, 0, 100, 100); //参数可自定义
    var dataURL = canvas.toDataURL("image/" + ext);
    callback.call(this, dataURL); //回掉函数获取Base64编码
    canvas = null;
  };
}

//模板函数
function template(id, data) {
  let str = $(id).html();
  const pattern = /{{\s*([a-zA-Z]+)\s*}}/;
  let pattResult = null;
  while ((pattResult = pattern.exec(str))) {
    str = str.replace(pattResult[0], data[pattResult[1]]);
  }
  return str;
}
