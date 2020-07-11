const path = require("path");
const fs = require("fs");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart.json"
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the Previous Cart
    fs.readFile(p, (err, fileContent) => {
      let cart = {
        products: [],
        totalPrice: 0,
      };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the Cart => Find Existing Product
      const existingProductIndex = cart.products.findIndex((p) => p.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add New Product/Increase Quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct, qty: existingProduct.qty + 1 };
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        // New Item
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice; // + - String to Int Conversion
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          console.log("writeFile", err);
        }
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      let updatedCart;
      if (!err) {
        updatedCart = { ...JSON.parse(fileContent) };
      }
      const product = updatedCart.products.find((prod) => prod.id === id);
      // If we dont have product we have to return it
      if(!product){
        return
      }
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice =
        updatedCart.totalPrice - product.qty * productPrice;
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        if (err) {
          console.log("Error", err);
        }
      });
    });
  }

  static getCarts(cb) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb(null);
      } else {
        cb(JSON.parse(fileContent));
      }
    });
  }
};
