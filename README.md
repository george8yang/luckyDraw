# luckyDraw
九宫格抽奖界面

## 1.准备工作

### 1. 1初始化项目

1. 创建`luckyDraw`文件夹，VSCode打开
2. 在luckyDraw目录下新建`index.html`、`login.html`和`bg.html`
3. 下载[Layui](https://www.layui.com/)，并解压到luckyDraw目录下
4. 在luckyDraw目录下新建`css`、`js`、`images`文件夹
5. 将`border.png`、`cartoon.png`放入images文件夹

### 1. 2安装VSCode的Live Server插件辅助开发

1.  在插件市场，搜索 `Live Server` 并安装    
2.  在页面上鼠标右键，选择 `Open With Live Server` 即可快速使用 `http` 协议访问页面

## 2.抽奖界面 

### 2.1绘制index页面的基本结构
>`<head>`引入Layui：`<link  rel="stylesheet"  href="./layui-v2.6.8/layui-v2.6.8/layui/css/layui.css">`
 1. 编写HTML结构： 
```
 <body>
    <div class="wrapper">
        <!-- 抽奖区域 -->
        <div class="draw">
            <h2>幸运抽奖</h2>
            <!-- 抽奖区头部 -->
            <div class="header">
                <span class="total">当前矿石数：</span>
                <span class="total" id="mineral"></span>
                <span id="btnSign_in">签到</span>
                <span id="btnSigned_in">已签到</span>
            </div>
            <!-- 抽奖区奖品展示 -->
            <div class="main">
                <ul id="prize">
                </ul>
            </div>
        </div>
        <div id="split"></div>
        <!-- 中奖记录展示区域 -->
        <div class="show">
            <h2>中奖记录</h2>
            <div class="statistics">
                <ul id="prizeList">
                </ul>
            </div>
            <img src="./images/cartoon.png" alt="">
        </div>
    </div>
    <!-- 奖品布局模板 -->
    <script type="text/html" id="tpl-prize">
            <li >
                <img src={{picture}} alt="">
                <span class="title">{{prizename}}</span>
            </li>
    </script> 
    <!-- 引入jquery.js -->
    <script  src="./js/jquery.js"></script>
    <!-- 引入layui.js -->
    <script  src="./layui-v2.6.8/layui-v2.6.8/layui/layui.js"></script>
    <script  src="./js/index.js"></script>
</body>
```
2. 公共样式：
```
/* 初始化样式 */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    cursor: default;
}
/* 主体盒子 */
.draw,
.show {
    position: relative;
    width: 624px;
    height: 561px;
    padding-top: 31px;
    /* 居中 */
    margin: 100px auto;
    background-color: #3a6af0;
}
···········
········
/* 主体body部分 */
.main {
    position: absolute;
    left: 50%;
    transform: translate(-50%);
    width: 486px;
    height: 394px;
    background-color: #f3da95;
    border: 25px solid transparent;
    /* 边框图片 */
    /* border-image-source: url(./images/border.png);
    border-image-slice:21;
    border-image-width: 24px;
    border-image-repeat: repeat; */
    /* 可简写 */
    border-image: url(/images/border.png) 21/24px;
}

```
>创建公共样式`common.css`保存在css目录下

3. index私有样式：
```
/* 容器 */
.wrapper {
    display: flex;
    width: 1124px;
    height: 561px;
    margin: 0px auto;
}
/* 签到、已签到样式 */
#btnSign_in,#btnSigned_in {
    float: right;
    cursor: pointer;
    width: 96px;
    height: 40px;
    background-color: #8098d4;
    border-radius: 40px;
    text-align: center;
    color: #cbefff;
}
···········
········
}
.statistics i{
    font-style: normal;
    color: #d25f00;
}

```
>创建index私有样式`index.css`保存在css目录下

### 2.2index界面抽奖动画实现
>原理：通过定时器`settimeout`给每个`li`元素添加动画样式，同时去除其余`li`元素的动画样式
1. 九宫格顺时针循环实现
    + 首先`li`元素从左到右、从上倒下的坐标可以转换为数组`[1,2,3,4,5,6,7,8,9]`
    + 于是顺时针循环时`li`的坐标可以转为数组`[1, 2, 3, 6, 9, 8, 7, 4]`可以理解为动画路径
    + 一次循环就是遍历一次数组`[1, 2, 3, 6, 9, 8, 7, 4]`，给每个`li:nth-child(arr[i])`添加动画样式(不要忘记去除其余元素的样式)
    + 多次循环的话可以通过建立矩阵，然后遍历元素。
    > 例：如果我抽中的是8，循环两次则可以通过遍历矩阵来`[[1, 2, 3, 6, 9, 8, 7, 4],[1, 2, 3, 6, 9, 8, 7, 4],[1, 2, 3, 6, 9, 8]]`实现

2. 动画代码
```
function animation(times, prize, username, flag) {
  //原始坐标[1,2,3,4,5,6,7,8,9]
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
```

### 2.3index界面js
1. 一个简易模板函数
```
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
```
>index界面的抽奖按钮已经奖品是动态生成的，所以需要事件委托给抽奖按钮绑定`click`事件

2. 引入index.js
```
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
      $.get("http://47.108.227.15/api/userinfo", { username }, function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        let mineral = res.data.minerals;
        $.get("http://47.108.227.15/api/drawinfo", function (res) {
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
 ....................
 ..............
```


## 3.登录注册界面

### 3.1绘制login页面的基本结构
>`<head>`引入Layui：`<link  rel="stylesheet"  href="./layui-v2.6.8/layui-v2.6.8/layui/css/layui.css">`
>引入公共样式`<link  rel="stylesheet"  href="/css/common.css">`
 1. 编写HTML结构： 
>将登录和注册表单放在同一个body下注册表单先`display:none`
```
 <body>
    <div class="draw">
        <h2>幸运抽奖</h2>
        <div class="header">
            <span class="total">注册/登录可获200枚矿石！！！</span>
        </div>
        <!-- 抽奖面板 -->
        <div class="main">
            <div class="layui-card" style="margin: 50px 20px;">
                <div class="layui-card-body">
                    <!-- 登录表单 -->
                    <form class="layui-form" id="form-login" action="">
                        <div class="layui-form-item">
                        ···········
                        </div>
                    </form>
                    <!-- 注册表单 -->
                    <form class="layui-form"  id="form-reg" action=""style="display: none;">
                       ···········
                    </form>
                </div>
            </div>
        </div>
    </div>
    <script src="./layui-v2.6.8/layui-v2.6.8/layui/layui.js"></script>
    <script src="./js/jquery.js"></script>
    <script src="./js/login.js"></script>

</body>
```
### 3.2login.js：
1. 登录表单和注册表单都是通过勾选是否管理员来进行管理员的登录和注册
2. 通过点击index.html的签到按钮来到login.html登录/注册后返回index.html，所以需要记录状态。
3. 通过`localStorage.setItem("username")localStorage.removeItem("username");`保存和删除用户名来模拟登录退出
```
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
      $.post("http://47.108.227.15/api/loginAd", data, function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        layer.msg("登录成功！");
        localStorage.setItem("username", data.username);
        location.href = "./bg.html";
      });
    } else {
      $.post("http://47.108.227.15/api/login", data, function (res) {
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
  .....................
  ................
```
## 4.后台管理界面

### 4.1绘制bg页面的基本结构
>`<head>`引入Layui：`<link  rel="stylesheet"  href="./layui-v2.6.8/layui-v2.6.8/layui/css/layui.css">`
>引入公共样式`<link  rel="stylesheet"  href="/css/common.css">`
 1. 编写HTML结构： 
```
 <body>
    <div class="draw">
        <h2>幸运抽奖</h2>
        <div class="header">
            <span class="total">后台管理界面</span>
        </div>
        <div class="main">
            <div class="layui-card">
                <div class="layui-card-body">
                    <!-- 奖品修改部分 -->
                    <table class="layui-table">
                   ......................
                   ...........
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <!-- 奖品信息模板 -->
    <script type="text/html" id="prize">
        <tr>
            <td>{{id}}</td>
            <td>{{prizename}}</td>
            <td><img src={{picture}} alt=""></td>
            <td>{{number}}</td>
            <td><button type="button" class="layui-btn layui-btn-xs btn-edit" data-id={{id}}>编辑</button>
            </td>
        </tr>
                            
    </script>
    <!-- select标签选项模板 -->
    <script type="text/html" id="selectprize">
        <option value={{id}}>{{prizename}}</option>                               
    </script>
```
2. 美化样式bg.css
```
.draw {
    width: 800px;
    height: 850px;

}
/* 更改宽度和边框图片 */
.main {
    width: 650px;
    height: 650px;
    border-image-repeat: stretch;
}
/* 解决lable标签四个字换行问题 */
.layui-form-label {
    padding: 9px 9px;
    width: 83px;
}
img {
    width: 20px;
}
#editBady {
    padding-top: 20px;
    padding-right: 30px;
}
#file{
    display: none;
}
#image{
    width: 55px;
    margin-right: 50px;

}
```
> `<head>`引入`bg.css`
### 4.2bg.js
1. 首先管理界面必须是管理员才能进入，只有通过注册或者登录勾选管理员来进入bg.html
2. 每个奖品可以修改名称，图片和数量
3. 将图片转为Base64，这样图片就能保存在数据库中
```
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
```
4. 可以**设置大奖**、**投放时间**、**奖品总数**和每次**中奖概率**
5. 其中奖品总数一定要和各个奖品的数量和相等，中奖概率在0~1之间
```
$(function () {
  //获取用户信息确认用户有无权限
  let username = localStorage.getItem("username");
  if (!username) {
    location.href = "./index.html";
  } else {
    $.get("http://47.108.227.15/api/userinfo", { username }, function (res) {
      if (res.status !== 0) {
        return layer.msg(res.message);
      }
      if (res.data.isAdministrator !== 1) {
        location.href = "./index.html";
      }
    });
  }
  //获取奖品信息
  $.get("http://47.108.227.15/api/prizes", function (res) {
    ........
    ...
    //渲染奖品信息
    for (let i = 0; i < data.length; i++) {
      $("tbody").append(template("#prize", data[i]));
      //解决layui动态生成的option不显示问题
      layui.use("form", function () {
        var form = layui.form;
  ..............
  .....
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
  ...............
  //绑定弹出层表单提交
  $("body").on("submit", "#editBady", function () {
    let obj = {
      id: $("#editBady [type=hidden]").attr("data-id"),
      prizename: $("#editBady [name=prizename]").val(),
      number: $("#editBady [name=number]").val(),
  .....................
  ................
```

## 5.接口
### 5.1请求根路径
>     http://47.108.227.15
### 5.2用户
1. 用户注册
   + 接口URL： /api/reguser
   + 调用方式： POST
   + 参数格式：无
   + 参数格式：

   | 参数名称 |数据类型 |说明 |
   |--|--|--|
   |username | string | 用户名 |
   |password | string | 密码 |
   |isAdministrator | string | 是否管理员，0:不是，1:是 |


   + 响应格式

   | 数据名称 |数据类型 |说明 |
   |--|--|--|
   | status | Number | 0：注册成功，1：注册失败 |
   | message| string | 对 status 字段的详细说明 |

2. 游客登录
   + 接口URL： /api/login
   + 调用方式： POST
   + 参数格式：无
   + 参数格式：

   | 参数名称 |数据类型 |说明 |
   |--|--|--|
   |username | string | 用户名 |
   |password | string | 密码 |
   |isAdministrator | string | 是否管理员，0:不是，1:是 |


   + 响应格式

   | 数据名称 |数据类型 |说明 |
   |--|--|--|
   | status | Number | 0：登录成功，1：登录失败 |
   | message| string | 对 status 字段的详细说明 |
   
3. 管理员登录
   + 接口URL： /api/loginAd
   + 调用方式： POST
   + 参数格式：无
   + 参数格式：

   | 参数名称 |数据类型 |说明 |
   |--|--|--|
   |username | string | 用户名 |
   |password | string | 密码 |
   |isAdministrator | string | 是否管理员，0:不是，1:是 |


   + 响应格式

   | 数据名称 |数据类型 |说明 |
   |--|--|--|
   | status | Number | 0：登录成功，1：登录失败 |
   | message| string | 对 status 字段的详细说明 |
   
4. 用户信息获取
   + 接口URL： /api/userinfo
   + 调用方式： GET
   + 参数格式：无
   + 参数格式：

   | 参数名称 |数据类型 |说明 |
   |--|--|--|
   |username | string | 用户名 |
   


   + 响应格式

   | 数据名称 |数据类型 |说明 |
   |--|--|--|
   | status | Number | 0：获取用户信息成功，1：获取用户信息失败 |
   | message| string | 对 status 字段的详细说明 |
   
### 5.2奖品
1. 奖品信息获取
   + 接口URL： /api/prizes
   + 调用方式： GET
   + 参数格式：无
   
   + 响应格式

   | 数据名称 |数据类型 |说明 |
   |--|--|--|
   | status | Number | 0：获取奖品信息成功，1：获取奖品信息失败 |
   | message| string | 对 status 字段的详细说明 |
   |data| object | 奖品信息 |

2. 奖品信息编辑
   + 接口URL： /api/edit
   + 调用方式： POST
   + 参数格式：无
   + 参数格式：

   | 参数名称 |数据类型 |说明 |
   |--|--|--|
   |id | string | 奖品id |
   |useraname | string | 奖品名称 |
   |number | number | 奖品数量 |
   |picture | string | 奖品图片 |
   


   + 响应格式

   | 数据名称 |数据类型 |说明 |
   |--|--|--|
   | status | Number | 0：修改信息成功，1：修改用户信息失败 |
   | message| string | 对 status 字段的详细说明 |


### 5.4抽奖
1. 抽奖设置信息获取
   + 接口URL： /api/drawinfo
   + 调用方式： GET
   + 参数格式：无
   
   + 响应格式

   | 数据名称 |数据类型 |说明 |
   |--|--|--|
   | status | Number | 0：获取抽奖设置信息成功，1：获取抽奖失败 |
   | message| string | 对 status 字段的详细说明 |
   |data| object | 抽奖设置信息 |

2. 抽奖设置信息编辑
   + 接口URL： /api/drawset
   + 调用方式： POST
   + 参数格式：无
   + 参数格式：

   | 参数名称 |数据类型 |说明 |
   |--|--|--|
   |bigprize | number| 大奖id |
   |time | datetime | 投放时间 |
   |prizesum | number | 奖品总数 |
   |probability| number | 中奖概率 |
   


   + 响应格式

   | 数据名称 |数据类型 |说明 |
   |--|--|--|
   | status | Number | 0：更新抽奖设置成功成功，1：更新抽奖设置失败 |
   | message| string | 对 status 字段的详细说明 |

3. 抽奖
   + 接口URL： /api/drawfun
   + 调用方式： POST
   + 参数格式：无
   + 参数格式：

   | 参数名称 |数据类型 |说明 |
   |--|--|--|
   |username | string| 用户名 |


   + 响应格式

   | 数据名称 |数据类型 |说明 |
   |--|--|--|
   | status | Number | 0：中奖，1：出错，2：未中奖 |
   | message| string | 对 status 字段的详细说明 |
   | prize| object| 中奖奖品信息 |

## 6.后台

### 中奖逻辑
1. 根据中奖概率看用户是中奖还是为中奖
```
// 中奖概率
let  probability = result[0].probability;
let  random = Math.random();
// 二、判断是否中奖
if (random <= probability) {
```
2. 用户中奖在看用户中的哪个奖品
    + 奖品总数和每个奖品数量都已知，可求出每个奖品的中奖概率，组成概率数组
    + 再一次生成`random = Math.random()`
    + 通过比较概率随机数在概率数组的两两元素之间范围比较来判断中了哪个奖品
    >就好比把一条绳子分成了几段，看概率随机数落入哪一段
    + 控制大奖投放其实就是判断用户的抽奖时间是否在投发时间之后，是的话就在获取的奖品信息的时候将大奖加入奖品数组计算，不是的话就将大奖排除在外（**计算概率数组的时候，奖品总数要分有大奖和无大奖**）
```
for (var  i = probabilityArr.length - 1; i >= 0; i--) {
sum += probabilityArr[i]; // 统计概率总和
}
random *= sum; // 生成概率随机数
for (var  i = probabilityArr.length - 1; i >= 0; i--) {
factor += probabilityArr[i];
if (random <= factor) {
```


、、、、、、、、时间不够了
越菜越心虚
前端都是自学的再加上一个人做项目，代码方面可还有很多需要完善的地方，比如回调地狱，有些代码比较累赘。但最后的最后项目能跑起来！！！
从开发到部署整个过程虽然很煎熬，但是学到可很多东西

