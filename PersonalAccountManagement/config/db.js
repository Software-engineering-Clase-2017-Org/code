const Sequelize = require('sequelize');
var sequelize = new Sequelize('mysql://root:root@localhost:3306/Trade', {
  define: {
    timestamps: false, // true by default
    freezeTableName: true,
  }
});
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
module.exports = sequelize;

