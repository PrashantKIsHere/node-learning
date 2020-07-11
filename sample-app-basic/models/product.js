const path = require("path");
const fs = require("fs");

const Cart = require("./cart");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "products.json"
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err && !fileContent) {
      return cb([]);
    }
    cb(JSON.parse(fileContent));
  });
};

class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      if(this.id){
        // Update product
        const existingProductIndex = products.findIndex(prod => prod.id === this.id);
        const updatedProducts = [...products];
        updatedProducts[existingProductIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
          console.log("error", err);
        });
      } else {
        // New Product
        this.id = Math.random().toString(); // Generating a Unique ID
        products.push(this);
        fs.writeFile(p, JSON.stringify(products), (err) => {
          console.log("error", err);
        });
      }
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }

  static findById(id, cb) {
    getProductsFromFile((products) => {
      const product = products.find((p) => p.id === id);
      cb(product);
    });
  }

  static deleteById(id) {
    getProductsFromFile((products) => {
      const product = products.find(p => p.id === id);
      const updatedProducts = products.filter(p => p.id !== id);
      fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
        if(!err){
          Cart.deleteProduct(id, product.price)
        }
      })
    });
  }
}

module.exports = Product;
