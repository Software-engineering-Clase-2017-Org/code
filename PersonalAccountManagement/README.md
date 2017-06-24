使用文档
===

## 需要启动的服务

> 需要在终端中输入对应的命令。

1. mysql服务

    mysql.server start

2. API服务

    cd ~/ticket_api
    npm start

3. 浏览器访问 `http://localhost:3000/`

## 界面介绍

页面分为左右两侧，左侧是测试API的页面，右侧是操作相应API的返回值。

### API列表

1. 用户注册
   
   访问API：`POST` `/api/register`

   填入相应的信息，点击注册即可。所有字段都需要填充。后端有校验输入信息的格式，如身份证需要为18位，密码至少2位等。
   
   需要注意的是，注册信息的唯一性属于数据库设计部分，这里并没有做校验。

   注册成功，会得到响应：`{"success":true,"msg":"注册成功"}`

   注册失败，如果是身份证不符合规定，则相应格式为：`{"success":false,"msg":"身份证格式错误"}`，其余类似。

2. 用户认证（登录）

   访问API：`POST` `/api/auth`

   输入用户名、密码以及用户类型即可。
   响应格式同上。`{"success":true,"msg":"认证成功"}`

3. 获取用户信息（当前登录用户）

   访问API：`GET` `/api/user_info`

   点击获取用户信息。
   响应格式同上：`{"success":true,"user_info":{"ID":4,"Username":"my_name","Authenticated":null,"Email":"b@qq.com","BlackList":null,"Balance":100500,"ID_NO":"210110110110110110","State":"挂失ID申请"}}`

   
4. 身份证挂失

   访问API：`POST` `/api/loss_id`

   验证`身份证号`、`密码`以及用户类型即可。
   响应格式同上。

5. 忘记密码

   访问API：`POST` `/api/forgot_psw`

   输入`用户类型`、`注册邮箱`即可。
   响应格式同上。

   忘记密码流程如下：
   1. 用户发起忘记密码请求(该接口),
   2. 系统向用户邮箱发送带有重置密码的链接；
   3. 用户点击该链接，跳转到系统的重置页面（需要自己实现）；
   4. 用户从3中页面，填入必要信息，提交请求后，密码更新。

   第3步中的访问页面为: `/reset_psw_page`.

   第4步中访问的接口为:  `POST` `/api/reset_psw_from_email`. 响应格式同上.

6. 充值

   访问API：`POST` `/api/recharge`

   输入充值金额即可。
   响应格式同上。

7. 更改用户信息

   访问API：`POST` `/api/update_acc_info`

   字段均为可选，如果不填，则不修改对应字段的值。
   响应格式同上。

8. 注销登录

   访问API：`GET` `/api/logout`

   响应格式同上。