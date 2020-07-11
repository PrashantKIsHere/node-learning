const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const rootDir = require("./util/path");
const sequelize = require("./util/database");
const app = express();

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const errorController = require("./controllers/error");

//Models
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require('./models/order');
const OrderItem = require('./models/order-item');


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
  User.findByPk(1)
    .then((user) => {
      // Sequelize Object (Not a Javascript object)
      req.user = user;
      next(); // Funnel Through
    })
    .catch((err) => console.log(err));
});

// For Static Files
app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//Setting the Association/Relations in the Table
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

let userData;
// Syncing the All the Models Once
sequelize
  //   .sync({ force: true })
  .sync()
  .then((result) => User.findByPk(1))
  .then((user) => {
    if (!user) {
      return User.create({
        name: "Prashant",
        email: "prashant@gmail.com",
      });
    }
    return user;
  })
  .then((user) => { 
    userData = user; 
    return user.getCart()
  })
  .then((cart) => {
    if (!cart) {
      return userData.createCart();
    }
    return cart;
  })
  .then(() => {
    //console.log("Database Initialized ", result);
    // Start the Express Server Once Database is Initialized
    app.listen(3000);
  })
  .catch((err) => console.error(err));
