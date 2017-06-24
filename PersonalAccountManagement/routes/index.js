var assert = require('assert');
var express = require('express');
var router = express.Router();

var util_res_type = require('../utils/resTypes');
var sha256 = require('../utils/sha256');
// models
var
  m_admin = require('../models/admin'),
  m_buyer = require('../models/buyer'),
  m_seller = require('../models/seller');

// 根据用户类型，选择合适的model
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
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'API测试页' });
});
router.get('/reset_psw_page', (req, res) => {
  var 
    k = req.query.k,
    ut= req.query.ut;

  try {
    assert(k != undefined && k.length == 64, 'key错误');
    assert(ut, '用户类型错误');
  } catch (e ) {
    return res.send(new util_res_type(e.message, false));
  }

  get_account_model_by_user_type(+ut)
    .findOne({where: {ForgotPswMailKey: k}})
    .then(
      m => {
        if(undefined == m) {
          res.send(new util_res_type('key失效', false));
        } else {
          res.render('findpsw', {
            title: '找回密码',
            ut: ut,
            k: k,
          })
        }
      }
    )
})

module.exports = router;
