const Sequelize = require('sequelize');
var sequelize = require('../config/db')
const HotelOrder = sequelize.define('HotelOrder', {
  ID: {
    type: Sequelize.INTEGER,
    // autoIncrement: true
  },
  BuyerID: Sequelize.INTEGER,
  SellerID: Sequelize.INTEGER,
  StartTime: Sequelize.DATE,
  EndTime: Sequelize.DATE,
  type: Sequelize.ENUM('HotelOrder type 1', 'HotelOrder type 2'),
  HotelID: Sequelize.INTEGER,
  State: Sequelize.ENUM('HotelOrder State 1', 'HotelOrder State 2'),
  Price: Sequelize.FLOAT          // 价格
}, {
    timestamps: false,
    freezeTableName: true,
});

module.exports = HotelOrder;