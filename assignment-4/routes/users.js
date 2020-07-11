const express = require("express");

const router = express.Router();

const Users = [];

router.get("/", (req, res, next) => {
  res.render("add-user", {
    pageTitle: "Add User",
  });
});

router.post("/add-user", (req, res, next) => {
  Users.push({
    userName: req.body.userName,
  });
  res.redirect('/users');
});

router.get("/users", (req, res, next) => {
  res.render("users", {
    pageTitle: "Users Registered",
    users: Users,
  });
});

module.exports = router;
