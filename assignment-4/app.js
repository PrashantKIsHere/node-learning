const express = require("express");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/users");

const app = express();

// For Parsing the Body Element
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "pug");

app.set("views", "views");

app.use(userRoutes);

app.use((req, res, next) => {
  res.status(404).render("404", {
    pageTitle: "Page Not Found",
  });
});

app.listen(3000);
