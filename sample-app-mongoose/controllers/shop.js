const Product = require("../models/product");
const Order = require("../models/orders");

exports.getProducts = (req, res, next) => {
  //res.sendFile(path.join(__dirname, "../", "views", "shop.html"));
  // console.log("Shop Data", products);
  // Sending the HTML Response
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  Product.find()
    .then((products) => {
      // Sending the data through templating engine
      // Will use the pug templating engine since we have set that engine in app.js
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => console.log("Error", err));
};

exports.getProduct = (req, res, next) => {
  const prodID = req.params.productId;
  Product.findById(prodID)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => console.log("Error", err));

  //ANOTHER WAY OF USING IT USING WHERE CLAUSE
  // Product.fetchAll({
  //   where: {
  //     id: prodID,
  //   },
  // })
  //   .then((product) => {
  //     res.render("shop/product-detail", {
  //       product: product[0],
  //       pageTitle: product[0].title,
  //       path: "/products",
  //     });
  //   })
  //   .catch((err) => console.log("Error", err));
};

exports.getIndex = (req, res, next) => {
  //res.sendFile(path.join(__dirname, "../", "views", "shop.html"));
  // console.log("Shop Data", products);
  // Sending the HTML Response
  // res.sendFile(path.join(rootDir, "views", "shop.html"));

  Product.find()
    .then((products) => {
      // Sending the data through templating engine
      // Will use the pug templating engine since we have set that engine in app.js
      res.render("shop/index", {
        prods: products,
        pageTitle: "Home Page Shop",
        path: "/",
      });
    })
    .catch((err) => console.log("Error", err));
};

exports.getCart = (req, res, next) => {
  //res.sendFile(path.join(__dirname, "../", "views", "shop.html"));
  // console.log("Shop Data", products);
  // Sending the HTML Response
  // res.sendFile(path.join(rootDir, "views", "shop.html"));
  // Will use the pug templating engine since we have set that engine in app.js
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: products,
        totalPrice: (products && products.totalPrice) || 0,
      });
    })
    .catch((err) => console.log("error", err));

  // Fetch All the Cart and Fetch All the Products
  // Cart.getCarts((carts) => {
  //   // Fetch all the Products
  //   Product.fetchAll((products) => {
  //     // Get the Product Details and Cart Details Based on the id and
  //     const cartProducts = [];
  //     for (cart of carts.products) {
  //       const cartProductData = products.find((prod) => prod.id === cart.id);
  //       if (cartProductData) {
  //         cartProducts.push({ productData: cartProductData, qty: cart.qty });
  //       }
  //     }
  //     res.render("shop/cart", {
  //       pageTitle: "Your Cart",
  //       path: "/cart",
  //       products: cartProducts,
  //       totalPrice: carts.totalPrice,
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodID = req.body.productId;
  Product.findById(prodID)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then(() => res.redirect("/cart"))
    .catch((err) => console.log(err));
  // let fetchedCart;
  // let newQuantity = 1;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: prodID } });
  //   })
  //   .then((products) => {
  //     let product;
  //     if (products.length > 0) {
  //       product = products[0];
  //     }
  //     if (product) {
  //       const oldQuantity = product.cartItem.quantity;
  //       newQuantity = oldQuantity + 1;
  //       return product;
  //     }
  //     return Product.findByPk(prodID);
  //   })
  //   .then((product) => {
  //     return fetchedCart.addProduct(product, {
  //       through: { quantity: newQuantity },
  //     });
  //   })
  //   .then(() => res.redirect("/cart"))
  //   .catch((err) => console.log(err));

  // Product.findById(prodID, (product) => {
  //   Cart.addProduct(product.id, product.price);
  //   res.redirect("/");
  // res.render("shop/cart", {
  //   pageTitle: "Your Cart",
  //   path: "/cart",
  // });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodID = req.body.productId;
  req.user
    .deleteItemFromCart(prodID)
    .then((result) => res.redirect("/cart"))
    .catch((err) => console.log("Error", err));
  // Product.findById(prodID, (product) => {
  //   Cart.deleteProduct(prodID, product.price);
  //   res.redirect("/cart");
  // });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((item) => ({
        quantity: item.quantity,
        // product: item.productId,  /* Will  Just Store the Id °/
        product: { ...item.productId._doc },
      }));
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products,
      });
      return order.save();
    })
    .then(() => req.user.clearCart()) // Clear the Cart
    .then((result) => {
      res.redirect("/orders");
    })
    .catch((err) => console.log("Error", err));
  // let fetchedProducts = [];
  // let fetchedCart;
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts();
  //   })
  //   .then((products) => {
  //     fetchedProducts = products;
  //     return req.user.createOrder();
  //   })
  //   .then((order) => {
  //     return order.addProducts(
  //       fetchedProducts.map((product) => {
  //         product.orderItem = { quantity: product.cartItem.quantity };
  //         return product;
  //       })
  //     );
  //   })
  //   .then((_) => fetchedCart.setProducts(null)) // We are setting the Cart as Null to clear the Cart
  //   .then((result) => {
  //     res.redirect("/orders");
  //   })
  //   .catch((err) => console.log("Error", err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        pageTitle: "Your Orders",
        path: "/orders",
        orders,
      });
    })
    .catch((err) => console.log("Error", err));
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
