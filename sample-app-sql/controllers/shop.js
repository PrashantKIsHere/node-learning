const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  //res.sendFile(path.join(__dirname, "../", "views", "shop.html"));
  // console.log("Shop Data", products);
  // Sending the HTML Response
  // res.sendFile(path.join(rootDir, "views", "shop.html"));

  Product.fetchAll()
    .then(([products]) => {
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
    .then(([product]) => {
      res.render("shop/product-detail", {
        product: product[0],
        pageTitle: product[0].title,
        path: "/products",
      });
    })
    .catch((err) => console.log("Error", err));
};

exports.getIndex = (req, res, next) => {
  //res.sendFile(path.join(__dirname, "../", "views", "shop.html"));
  // console.log("Shop Data", products);
  // Sending the HTML Response
  // res.sendFile(path.join(rootDir, "views", "shop.html"));

  Product.fetchAll()
    .then(([products]) => {
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
  // Fetch All the Cart and Fetch All the Products
  Cart.getCarts((carts) => {
    // Fetch all the Products
    Product.fetchAll((products) => {
      // Get the Product Details and Cart Details Based on the id and
      const cartProducts = [];
      for (cart of carts.products) {
        const cartProductData = products.find((prod) => prod.id === cart.id);
        if (cartProductData) {
          cartProducts.push({ productData: cartProductData, qty: cart.qty });
        }
      }
      res.render("shop/cart", {
        pageTitle: "Your Cart",
        path: "/cart",
        products: cartProducts,
        totalPrice: carts.totalPrice,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodID = req.body.productId;
  Product.findById(prodID, (product) => {
    Cart.addProduct(product.id, product.price);
    res.redirect("/");
    // res.render("shop/cart", {
    //   pageTitle: "Your Cart",
    //   path: "/cart",
    // });
  });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodID = req.body.productId;
  Product.findById(prodID, (product) => {
    Cart.deleteProduct(prodID, product.price);
    res.redirect("/cart");
  });
};

exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    pageTitle: "Your Orders",
    path: "/orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    pageTitle: "Checkout",
    path: "/checkout",
  });
};
