const mysql = require("mysql2");

// Connection Pools Helps Reduce the Time Spent Connection to the
// My SQL Server by reusing the previous connection, leaving them open insated of
// closing when you are done with them.
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "node-complete",
});

module.exports = pool.promise();
