const Sequelize = require('sequelize');
var sequelize = require('../config/db')
const Buyer = sequelize.define('Buyer', {
  ID: {
    type: Sequelize.INTEGER,
    // autoIncrement: true
  },
  Username: Sequelize.STRING(32),
  Password: Sequelize.STRING(64),
  Authenticated: Sequelize.INTEGER,
  Email: Sequelize.STRING(64),
  BlackList: Sequelize.INTEGER,
  Balance: Sequelize.FLOAT,
  ID_NO: Sequelize.STRING(64),
  ForgotPswMailKey: Sequelize.STRING(64),
  State: Sequelize.ENUM('正常', '挂失ID申请', 'ID已挂失'),
  PayPsw: Sequelize.STRING(64),
}, {
    timestamps: false,
    freezeTableName: true,
});
module.exports = Buyer;