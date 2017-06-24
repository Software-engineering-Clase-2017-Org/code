const Sequelize = require('sequelize');
var sequelize = require('../config/db')
const FlightOrder = sequelize.define('FlightOrder', {
  ID: {
    type: Sequelize.INTEGER,

  },
  BuyerID: Sequelize.INTEGER,
  SellerID: Sequelize.INTEGER,

  StartTime: Sequelize.DATE,
  EndTime: Sequelize.DATE,
  type: Sequelize.ENUM('FlightOrder type 1', 'FlightOrder type 2'),
  FlightID: Sequelize.INTEGER,
  State: Sequelize.ENUM('FlightOrder State 1', 'FlightOrder State 2'),
  Price: Sequelize.FLOAT         
}, {
    timestamps: false,
    freezeTableName: true,
});

module.exports = FlightOrder;