const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const rootDir = require("./util/path");
const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");

// For Parsing the Body Element
app.use(bodyParser.urlencoded({ extended: true }));

//SET THE TEMPLATING ENGINE For Views
// app.set("view engine", "pug"); -- PUG Templating Engine

app.set("view engine", "ejs"); // EJS Templating Engine

//SET THE folder to look for views
app.set("views", "views"); // In this case it is views folder

// Use to serve the Static Files
//app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(rootDir, "public")));

// For Static Files
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

app.listen(3000);
