var assert = require('assert');
var express = require('express');
var router = express.Router();

var seqlize = require('../config/db');
// 响应类
var util_res_type = require('../utils/resTypes');
var sha256 = require('../utils/sha256');

var sendMail = require('../utils/mailer');

var
  m_admin = require('../models/admin'),
  m_buyer = require('../models/buyer'),
  m_seller = require('../models/seller'),

  m_fligh_order = require('../models/flightOrder'),
  m_hotel_order = require('../models/hotelOrder');

const USER_TYPE = {
  0: 'admin',
  1: 'seller',
  2: 'buyer',
}

function chkpsw(model, user_pass) {
  if (model == undefined) {
    return new util_res_type('认证失败，当前用户不存在', false)
  }
  var psw_sha256 = sha256(user_pass);
  if (model.get('Password') == psw_sha256) {
    return new util_res_type('认证成功')
  } else {
    return new util_res_type('认证失败，密码错误', false)
  }
}

function get_account_model_by_user_type(user_type) {
  var model = null;

  switch (+user_type) {
    case 0:
      // admin
      model = m_admin;
      break;
    case 1:
      model = m_seller;
      break;
    case 2:
      model = m_buyer;
      break;
  }

  return model;
}

router
  .post('/auth', function (req, res, next) {
    var form_data = {
      user_type,        // 用户类型:卖家(1)，买家(2)，Admin(0)
      user_name,        // 用户名
      user_pass,        // 密码
    } = req.body;

    try {
      [
        'user_type',
        'user_name',
        'user_pass'
      ].forEach((val, idx) => {
        // 检查表单是否完整
        assert(form_data[val] != undefined, '表单未完成：' + val);
        // 检查数据格式
        assert(form_data[val] != '', '表单格式错误：' + val);
      });
      // 检查用户类型
      assert(USER_TYPE.hasOwnProperty(+user_type), '用户类型错误');
    } catch (e) {
      res.send(new util_res_type(e.message, false));
      return;
    }

    var model = get_account_model_by_user_type(user_type);
    model.findOne({ where: { Username: user_name } }).then(m => {
      var res_type = chkpsw(m, user_pass);
      req.session.user_info = m;
      req.session.user_type = user_type;
      res.send(res_type);
    });
  })

  .get('/logout', (req, res) => {
    req.session.user_info = undefined;
    req.session.user_type = undefined;
    req.session.destroy();

    res.send(
      new util_res_type('注销成功')
    )
  })

  .post('/register', (req, res, next) => {
    var form_data = {
      user_type,        // 用户类型:卖家(1)，买家(2)，Admin(0)
      user_name,        // 用户名
      user_pass,        // 密码
      id_no,            // 身份证
      email             // 电邮
    } = req.body;
    try {
      // 监测表单是否完整; 格式是否正确
      [
        'user_type',
        'user_name',
        'user_pass',
        'id_no',
        'email'
      ].forEach((val, idx) => {
        // 检查表单是否完整
        assert(form_data[val] != undefined, '表单未完成：' + val);
        // 检查数据格式
        assert(form_data[val] != '', '表单格式错误：' + val);
      });
      // 检查用户类型
      assert(USER_TYPE.hasOwnProperty(+user_type), '用户类型错误');
      assert(form_data['user_pass'].length > 1, '密码长度有误（最少1位）');

      assert(/^\d{18}|\d{17}[x|X]$/.test(form_data['id_no']), '身份证格式错误');
      assert(/^[\da-zA-Z]+@[\da-zA-Z]+\.[\da-zA-Z]+/.test(form_data['email']), '邮箱格式错误');
    } catch (e) {
      res.send(new util_res_type(e.message, false));
      return;
    }
    var model_data = {
      Username: user_name,
      Password: sha256(user_pass),
      Email: email,
      Balance: 0,
      ID_NO: id_no
    };
    var model = get_account_model_by_user_type(user_type);
    model.create(model_data).then(
      m => {
        res.send(new util_res_type('注册成功'));
        return;
      },
      reason => {
        res.send(new util_res_type('注册失败，错误信息：\n' + reason, false));
        return;
      });
  })

  .get('/user_info', (req, res) => {
    get_account_model_by_user_type(req.session.user_type)
      .findById(req.session.user_info.ID)
      .then(m => {
        // 隐去密码等字段
        var _r = m.toJSON();
        delete _r.Password;
        delete _r.ForgotPswMailKey;
        delete _r.id;
        delete _r.PayPsw;

        var _res = {success: true, user_info: _r};
        res.send(_res);
      })
  })

  .post('/forgot_psw', (req, res) => {
    var form_data = {
      user_type,      // 用户类型
      email           // 邮箱
    } = req.body;

    var model = get_account_model_by_user_type(user_type);
    model.findOne({ where: { Email: email } }).then(m => {
      // 不存在当前email的用户
      if (undefined != m) {
        var forgot_key = sha256(email + new Date());
        m.update({ ForgotPswMailKey: forgot_key}).then(
          result => {
            sendMail(email, '请点击链接进行密码重置',
              `请点击<a href="http://localhost:3000/reset_psw_page?k=${forgot_key}&ut=${user_type}">链接</a>进行密码重置.`, (err, info) => {
                console.log(err);
                if (info.rejected.length > 0) {
                  console.log(info);
                }
              });
          },
          reason => {
            res.send(
              new util_res_type(`未能发送邮件：\n${reason}`)
            );
            return;
          }
        )
      }
      res.send(new util_res_type('我们已向您的邮箱发送了密码重置邮件(如果邮箱存在),请留意.'));
    })
  })

  
  .post('/reset_psw_from_email', (req, res) => {
    var
      email_key = req.body.k,    // key, 验证链接有效性
      user_pass = req.body.p,    // 新密码
      user_type = req.body.ut;   // user type
    // 数据验证
    try {
      assert(user_pass && user_pass.length > 1, '密码格式错误');
      assert(email_key && email_key != '', '链接失效，请重试');
      assert(USER_TYPE.hasOwnProperty(+user_type), '用户类型错误');
    } catch (e) {
      res.send(
        new util_res_type(e.message, false)
      );
      return;
    }

    var model = get_account_model_by_user_type(user_type);
    model.findOne({ where: { ForgotPswMailKey: email_key } }).then(m => {
      if (undefined == m) {
        res.send(
          new util_res_type('链接失效，请重试', false)
        );
        return;
      }
      m.update({ 'Password': sha256(user_pass), ForgotPswMailKey: null }).then(
        result => {
          res.send(
            new util_res_type('密码重置成功')
          );
        },
        reason => {
          res.send(
            new util_res_type('密码重置失败，原因：\n' + reason, false)
          );
        }
      );
    });
  })


  .post('/update_acc_info', (req, res) => {
    var { user_info, user_type } = req.session;
    // 允许修改以下字段
    var form_data = {
      user_name,        // 用户名
      user_pass,        // 密码
      id_no,            // 身份证
      balance,          // 金额
      email,            // 电邮
      pay_psw           // 支付密码
    } = req.body;

    // 模型数据
    var model_data = {
      Username: user_name || user_info.Username,
      Email: email || user_info.Email,
      Balance: balance || user_info.Balance,
      ID_NO: id_no || user_info.ID_NO
    };

    // 如果存在密码字段，则验证格式，更新密码字段
    if (user_pass && user_pass.length > 1) {
      model_data.Password = sha256(user_pass);
    }
    // 如果存在支付密码字段，则验证格式，更新支付密码字段
    if (pay_psw && pay_psw.length > 1) {
      model_data.PayPsw = sha256(pay_psw);
    }

    var model = get_account_model_by_user_type(user_type);
    model.update(model_data, { where: { ID: user_info.ID } }).then(
      result => {
        res.send(
          new util_res_type('修改成功')
        );
      },
      reason => {
        res.send(
          new util_res_type(`修改失败：\n${reason.message}`, false)
        )
      }
    );
  })

  /**
   * 查询资金
   * 
   * 查询方式：
   *    年（y）；月（m）
   */
  .get('/api/billing', (req, res) => {
    var
      type = req.query.by,     // 查询方式
      year = req.query.y;      // 年份
    // month = req.query.m;     // 月份
    switch (type) {
      case 'y':
        // 取所有数据，按年份聚合
        var
          // p_f = m_fligh_order.findAll({ where: { StartTime: { $between: [new Date(`${year}-01-01`), new Date(`${year + 1}-01-01`)] } } }),
          // p_h = m_hotel_order.findAll({ where: { StartTime: { $between: [new Date(`${year}-01-01`), new Date(`${year + 1}-01-01`)] } } });
          p_f = m_fligh_order.all(),
          p_h = m_hotel_order.all();
        Promise.all([p_f, p_h]).then(
          result => {
            var orders = result[0].join(result[1]);
            var _result = {};
            orders.forEach((val, idx) => {
              let _year = t.toString().slice(0, 4), t = val.StartTime;
              _result[_year] += val.Price;
            });
            res.send(_result);
          },
          reason => {
            res.send(
              new util_res_type('查询失败：\n' + reason)
            )
          }
        );
        break;
      case 'm':
        // 取指定年份的数据
        var
          p_f = m_fligh_order.findAll({ where: { StartTime: { $between: [new Date(`${year}-01-01`), new Date(`${year + 1}-01-01`)] } } }),
          p_h = m_hotel_order.findAll({ where: { StartTime: { $between: [new Date(`${year}-01-01`), new Date(`${year + 1}-01-01`)] } } });

        Promise.all([p_f, p_h]).then(
          result => {
            var orders = result[0].join(result[1]);
            var _result = {};
            orders.forEach((val, idx) => {
              let _month = t.toString().slice(4, 2), t = val.StartTime;
              _result[_month] += val.Price;
            });
            res.send(_result);
          },
          reason => {
            res.send(
              new util_res_type('查询失败：\n' + reason)
            )
          }
        );
        break;
      default:
        break;
    }
  })

  /**
   * 挂失身份证: 将用户状态修改为 挂失ID申请
   * 
   * 备注:
   *    需要验证密码和身份证号码
   */
  .post('/loss_id', (req, res) => {
    var { user_info, user_type } = req.session;
    // 允许修改以下字段
    var form_data = {
      user_pass,        // 密码
      id_no,            // 身份证
    } = req.body;

    // 数据验证
    try {
      assert(user_pass && user_pass.length > 1, '密码格式错误');
      assert(id_no, '身份证号码有误');
    } catch (e) {
      res.send(
        new util_res_type(e.message, false)
      );
      return;
    }

    var
      _u_psw = user_info.Password,
      _u_id_no = user_info.ID_NO;
    if (_u_psw === sha256(user_pass) && _u_id_no === id_no) {
      get_account_model_by_user_type(+user_type)
        .findById(user_info.ID)
        .then(m => {
          m.update({ State: '挂失ID申请' }).then(
            result => {
              req.session.user_info.State = '挂失ID申请';
              res.send(new util_res_type('挂失成功'));
            },
            reason => {
              res.send(new util_res_type('挂失失败：\n' + reason), false)
            }
          )
        })
    } else {
      res.send(new util_res_type('挂失失败，账户信息错误', false))
    }
  })

  /**
   * 充值
   * 
   * 备注
   *    提供充值金额
   */
  .post('/recharge', (req, res) => {
    var { user_info, user_type } = req.session;
    var form_data = {
      amount      // 充值金额
    } = req.body;

    try {
      assert(/^\d+$/.test(amount), '金额格式错误');
      amount = +amount;
      assert(amount > 0, '金额需要>0');
    } catch (e) {
      res.send(new util_res_type(e.message, false))
      return;
    }

    get_account_model_by_user_type(user_type)
      .findById(user_info.ID)
      .then(m => {
        m.Balance += amount;
        return m.save();
      })
      .then(
      result => {
        res.send(new util_res_type('充值成功'))
      },
      reason => {
        res.send(new util_res_type('充值失败：\n' + reason), false)
      }
      );
  })

  /**
   * 修改支付密码
   * 
   */
  .post('/change_pay_psw', (req, res) => {
    var { user_info, user_type } = req.session;
    var form_data = {
      pay_psw      // 充值金额
    } = req.body;

    try {
      assert(pay_psw.length > 1, '支付密码长度至少2位');
    } catch (e) {
      res.send(new util_res_type(e.message, false))
      return;
    }

    get_account_model_by_user_type(user_type)
      .findById(user_info.ID)
      .then(m => {
        m.PayPsw = sha256(pay_psw);
        return m.save();
      })
      .then(
      result => {
        res.send(new util_res_type('支付密码修改成功'))
      },
      reason => {
        res.send(new util_res_type('支付密码修改失败：\n' + reason), false)
      }
      );
  })
  ;

module.exports = router;
