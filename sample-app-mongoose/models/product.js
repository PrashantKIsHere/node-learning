const mongodb = require("mongodb");
const database = require("../util/database");
const getDb = database.getDb;

class Product {
  constructor(title, price, imageUrl, description, id, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // Update the Product
      dbOp = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
      // .updateOne({ _id: new mongodb.ObjectId(this._id)}, { $set: { title: this.title, imageUrl: this.imageUrl } })
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
      .then((result) => {
        return result;
      })
      .catch((err) => {
        console.log("Error Occurred", err);
        throw err;
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(prodID) {
    const db = getDb();
    return (
      db
        .collection("products")
        // MONGO USES SPECIAL TYPE OF OBJECT(ObjectId - BSON) NORMAL JAVASCRIPT STRING WONT WORK
        .find({ _id: new mongodb.ObjectId(prodID) })
        .next()
        .then((product) => {
          return product;
        })
        .catch((err) => {
          console.log(err);
        })
    );
  }

  static deleteById(prodID) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongodb.ObjectId(prodID) })
      .then((result) => result)
      .catch((err) => console.log("err", err));
  }
}

module.exports = Product;
