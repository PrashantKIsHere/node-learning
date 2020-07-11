const express = require("express");

const app = express();

app.use("/users", (req, res, next) => {
  res.send("<h1> Users Data will come here ... </h1>");
});

app.use("/", (req, res, next) => {
  console.log("I am first middlware !!!");
  next();
});

app.use("/", (req, res, next) => {
  console.log("I am second middleware !!!");
  res.send("<h1> Second Middleware Function </h1>");
});

app.listen(3000);
