const { Sequelize } = require("sequelize");

// Internally Uses MySQL2 Under the Hood
const sequelize = new Sequelize("node-complete", "root", "password", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
