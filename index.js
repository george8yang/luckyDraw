//抽奖函数
let btnDraw = document.getElementById("btnDraw");
let btnSignIn = document.getElementById("btnSign_in");
let btnSignedIn = document.getElementById("btnSigned_in");
let flag = true;
btnDraw.addEventListener("click", function () {
  //中奖奖品
  let minerals = document.getElementById("mineral");
  let cost = parseInt(btnDraw.children[1].innerHTML);
  if (minerals.innerHTML < cost) {
    layer.open({
      title: false,
      content: `<div style="text-align:center">矿石数量不足，赶紧充钱吧，金主！🤩🤩🤩</div>`,
      btn: ["好的", "下次一定"],
      btnAlign: "c",
      closeBtn: 0,
      offset: "auto",
    });
  } else {
    //

    setTimeout(() => {
      if (flag) {
        flag = false;
        minerals.innerHTML = minerals.innerHTML - cost;
        let prize = Math.floor(8 * Math.random());
        console.log(prize);
        animation(100, 3, prize);
      }
    });
  }
});
btnSignIn.addEventListener("click", function () {
  btnSignIn.style.display = "none";
  btnSignedIn.style.display = "block";
});
//动画路径
function animation(n, times, prize) {
  //奖品坐标nth-child()
  let drawIndex = [1, 2, 3, 6, 9, 8, 7, 4];
  let path = [];
  //循环次数
  let time = 0;
  while (times > 0) {
    path.push(drawIndex);
    times--;
  }
  //路径矩阵
  path.push(drawIndex.slice(0, prize + 1));
  console.log(path);
  for (let i = 0; i < path.length; i++) {
    for (let j = 0; j < path[i].length; j++) {
      time++;
      let a = document.querySelector(`ul li:nth-child(${path[i][j]})`);
      let timer = setTimeout(() => {
        for (let j = 0; j < path[0].length; j++) {
          let a = document.querySelector(`ul li:nth-child(${path[0][j]})`);
          a.className = "";
        }
        a.className = "animation";
      }, 10 * time ** 2);
    }
  }
  setTimeout(() => {
    let a = document.querySelector(`ul li:nth-child(${drawIndex[prize]})`);
    if (drawIndex[prize] == 4) {
      layer.open({
        title: false,
        content: `<div style="text-align:center"><img src=${a.children[0].src} alt="" width="40px" height="40px"/><br/>很遗憾你抽中了${a.children[1].innerHTML}🤪🤪🤪</div>`,
        btn: ["再来一次"],
        btnAlign: "c",
        closeBtn: 0,
      });
    } else {
      console.log(a.children[0].src);
      layer.open({
        title: false,
        content: `<div style="text-align:center"><img src=${a.children[0].src} alt="" width="40px" height="40px"/><br/>恭喜您抽中了${a.children[1].innerHTML} ！！！🎉🎉🎉</div>`,
        btn: ["再来一次"],
        btnAlign: "c",
        closeBtn: 0,
      });
    }
    flag=true;
  }, 10 * time ** 2 + 100);
}
// layer.open({
//     title: false,
//     content: `<div style="text-align:center">恭喜您抽中了！！！</div>`,
//     btn:['再来一次'],
//     btnAlign: 'c',
//     closeBtn: 0,
//     offset: 'auto',
// });
