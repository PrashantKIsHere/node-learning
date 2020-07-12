const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const rootDir = require("./util/path");
const database = require("./util/database");
const mongoConnect = database.mongoConnect;
const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");

//Models
const User = require("./models/user");

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

// USING THE USER OBJECT IN ALL REQUEST
// THIS SHOULD COME FIRST SO IT FUNNER THROUGH OTHER MIDDLEWARES
app.use((req, res, next) => {
  User.findById("5f0abec379c706b97f88c6ce")
    .then((user) => {
      // Sequelize Object (Not a Javascript object)
      req.user = new User(user.name, user.email, user.cart, user._id);
      next(); // Funnel Through
    })
    .catch((err) => console.log(err));
});

// For Static Files
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  // Start the Express Server Once Database is Initialized
  app.listen(3000);
});
