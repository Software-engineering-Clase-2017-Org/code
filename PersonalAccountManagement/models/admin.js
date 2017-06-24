const Sequelize = require('sequelize');
var sequelize = require('../config/db')
const Admin = sequelize.define('Admin', {
  ID: {
    type: Sequelize.INTEGER,
  
  },
  Username: Sequelize.STRING(32),
  Password: Sequelize.STRING(64),
  Type: Sequelize.ENUM('admin type 1', 'admin type 2'),
  ID_NO: Sequelize.STRING(64),
  ForgotPswMailKey: Sequelize.STRING(64),
  PayPsw: Sequelize.STRING(64),
}, {
    timestamps: false,
    freezeTableName: true,
});

module.exports = Admin;