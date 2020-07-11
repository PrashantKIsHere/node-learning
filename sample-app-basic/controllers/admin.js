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
  const product = new Product(null, title, imageUrl, description, price); // Null wil be treated as new Product
  product.save();
  //   products.push({
  //     title: req.body.title,
  //   });
  res.redirect("/");
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
  Product.findById(prodID, (product) => {
    if (!product) {
      return res.redirect("/");
    }
    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/Edit-product",
      editing: editMode,
      product: product,
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  const updatedProduct = new Product(
    productId,
    title,
    imageUrl,
    description,
    price
  ); // These are updated Values
  updatedProduct.save();
  res.redirect("products");
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteById(productId);
  res.redirect("products");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    // Sending the data through templating engine
    // Will use the pug templating engine since we have set that engine in app.js
    res.render("admin/products", {
      prods: products,
      pageTitle: "Admin Products",
      path: "/admin/products",
    });
  });
};
