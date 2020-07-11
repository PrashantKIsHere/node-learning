const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  //res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
  //res.sendFile(path.join(rootDir, "views", "add-product.html"));
  res.render("admin/edit-product", {
    pageTitle: "Add Your Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  // const product = new Product(null, title, imageUrl, description, price); // Null wil be treated as new Product
  // createProduct is special mixin added from Association defined User.hasMany(Products) in App.js
  req.user
    .createProduct({ title, imageUrl, price, description })
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log(err));

  // Product.create({ title, imageUrl, price, description })
  //   .then(() => res.redirect("/admin/products"))
  //   .catch((err) => console.log(err));

  //   products.push({
  //     title: req.body.title,
  //   });
};

exports.getEditProduct = (req, res, next) => {
  //res.sendFile(path.join(__dirname, '../', 'views', 'add-product.html'));
  //res.sendFile(path.join(rootDir, "views", "add-product.html"));

  //Get the Query Param Data
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  // Get the Dynamic Param from Route
  const prodID = req.params.productId;
  // Product.findByPk(prodID)
  req.user.getProducts({ where: { id: prodID }}) // Through Association
    .then((products) => {
      const [ product ] = products;
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/Edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  // const updatedProduct = new Product(
  //   productId,
  //   title,
  //   imageUrl,
  //   description,
  //   price
  // ); // These are updated Values
  // updatedProduct.save();
  Product.findByPk(productId)
    .then((product) => {
      product.title = title;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = price;
      return product.save(); // this will return the promise and will be handled in next thennable object
    })
    .then((result) => {
      console.log("PORDUCT UPDATED SUCCESFULLY!!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  // Product.destroy({
  //   where: {
  //     id: productId,
  //   },
  // })
  //   .then(() => res.redirect("/admin/products"))
  //   .catch((err) => console.log("error", err));
  Product.findByPk(productId)
    .then((product) => product.destroy()) // this will return promise
    .then(() => res.redirect("/admin/products"))
    .catch((err) => console.log("error", err));
};

exports.getProducts = (req, res, next) => {
  //Product.findAll()
  req.user.getProducts()
    .then((products) => {
      // Sending the data through templating engine
      // Will use the pug templating engine since we have set that engine in app.js
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => console.log("error", err));
};
