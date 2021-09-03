$(function () {
  //记录用户用于登录，没有加密
  let username = localStorage.getItem("username");
  //渲染抽奖界面
  renderPrize();
  //渲染矿石
  renderMinerals(username);
  let flag = { time: true }; //时间戳（节流）
  //通过代理的形式为抽奖按钮绑定事件
  $("#prize").on("click", "#btnDraw", function () {
    //中奖奖品
    if (!username) {
      layer.msg("请登录签到");
    } else {
      $.get("http://127.0.0.1:3007/api/userinfo", { username }, function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        let mineral = res.data.minerals;
        $.get("http://127.0.0.1:3007/api/drawinfo", function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message);
          }
          let cost = res.data.cost;
          //金币不足
          if (mineral < cost) {
            layer.open({
              title: false,
              content: `<div style="text-align:center">矿石数量不足，赶紧充钱吧，金主！🤩🤩🤩</div>`,
              btn: ["好的", "下次一定"],
              btnAlign: "c",
              closeBtn: 0,
              offset: "auto",
            });
          } else {
            //抽奖开始
            setTimeout(() => {
              if (flag.time) {
                flag.time = false;
                $.post(
                  "http://127.0.0.1:3007/api/drawfun",
                  { username },
                  function (res) {
                    if (res.status == 1) {
                      return layer.msg(res.message);
                    }
                    //未中奖
                    if (res.status == 2) {
                      let prize = 8;
                      animation(1, prize, username, flag);
                    }else{
                      let prize = res.prize.id;
                      animation(1, prize, username, flag);
                    }
                  }
                );
              }
            });
          }
        });
      });
    }
  });
  //签到
  $("#btnSign_in").on("click", function () {
    location.href = "./login.html";
  });
  $("#btnSigned_in").on("click", function () {
    location.href = "./login.html";
  });
});

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

//获取用户信息渲染矿石和中奖记录
function renderMinerals(username) {
  $.get("http://127.0.0.1:3007/api/userinfo", { username }, function (res) {
    if (res.status !== 0) {
      return layer.msg(res.message);
    }
    $("#btnSign_in").hide();
    $("#btnSigned_in").show();
    $("#mineral").html("");
    $("#prizeList").html("");
    $("#mineral").html(res.data.minerals);
    //将中奖信息和时间转换为数组
    let prizeAndTime = res.data.prizes;
    if (prizeAndTime) {
      let arr = prizeAndTime.split(",");
      for (let i = 0; i < arr.length; i++) {
        let prize = arr[i].split(".");
        $("#prizeList").append(
          `<li>恭喜您抽中<i>${prize[0]}</i>✨🎉🎉<span>${prize[1]}</span></li>`
        );
      }
    }
  });
}
//获取奖品信息并渲染
function renderPrize() {
  $.get("http://127.0.0.1:3007/api/prizes", function (res) {
    if (res.status !== 0) {
      return layer.msg(res.message);
    }
    let data = res.data;
    // 与id的映射数组
    let arr = [0, 1, 2, 7, 3, 4, 5, 6];
    $("#prize").html("");
    for (let i = 0; i < arr.length; i++) {
      //添加抽奖‘按钮’
      if (i === 4) {
        $("#prize").append(`<li class="ele-prize" id="btnDraw">
      <h4>抽奖</h4>
      <span class="title">200矿石/次</span>
  </li>`);
      }
      $("#prize").append(template("#tpl-prize", data[arr[i]]));
    }
  });
}

//抽奖动画
function animation(times, prize, username, flag) {
  //原始坐标[1,2,3,4,5,6,7,8]
  //动画坐标nth-child()
  let drawIndex = [1, 2, 3, 6, 9, 8, 7, 4];
  //奖品id映射坐标
  let arr = [1, 2, 3, 4, 7, 6, 5, 8];
  prize = arr.indexOf(prize) + 1;
  let path = [];
  //循环次数
  let time = 0; //记录走了几个格子
  while (times > 0) {
    //循环多少圈
    path.push(drawIndex);
    times--;
  }
  //路径矩阵
  path.push(drawIndex.slice(0, prize));
  for (let i = 0; i < path.length; i++) {
    for (let j = 0; j < path[i].length; j++) {
      time++;
      $(`#prize li:nth-child(${path[i][j]})`);
      setTimeout(() => {
        $(`#prize li:nth-child(${path[i][j]})`)
          .addClass("animation")
          .siblings()
          .removeClass("animation");
      }, 10 * time ** 2);
    }
  }
  //中奖消息弹出层
  setTimeout(() => {
    let a = document.querySelector(`ul li:nth-child(${drawIndex[prize - 1]})`);
    if (drawIndex[prize - 1] == 4) {
      layer.open({
        title: false,
        content: `<div style="text-align:center"><img src=${a.children[0].src} alt="" width="40px" height="40px"/><br/>很遗憾你抽中了${a.children[1].innerHTML}🤪🤪🤪</div>`,
        btn: ["再来一次"],
        btnAlign: "c",
        closeBtn: 0,
      });
    } else {
      layer.open({
        title: false,
        content: `<div style="text-align:center"><img src=${a.children[0].src} alt="" width="40px" height="40px"/><br/>恭喜您抽中了${a.children[1].innerHTML} ！！！🎉🎉🎉</div>`,
        btn: ["再来一次"],
        btnAlign: "c",
        closeBtn: 0,
      });
    }
    flag.time = true;
    renderPrize();
    renderMinerals(username);
  }, 10 * time ** 2 + 100);
}
