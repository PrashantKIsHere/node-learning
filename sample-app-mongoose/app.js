const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const rootDir = require("./util/path");
const mongoConnect = require("./util/database");
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
  User.findById("5f2452cd3968a0494c4f2a26")
    .then((user) => {
      // Sequelize Object (Not a Javascript object)
      req.user = user
      next(); // Funnel Through
    })
    .catch((err) => console.log(err));
});

// For Static Files
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect()
  .then(() => {
    // Start the Express Server Once Database is Initialized
    console.log("Mongo DB Connected Via Mongoose");
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Prashant",
          email: "Prashant@test.com",
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(() => {
    console.log("Error While Connecting MongoDB Via Mongoose!!!");
  });
