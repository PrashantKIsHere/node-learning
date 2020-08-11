const mongoose = require("mongoose");

const uri =
  "mongodb+srv://mongo-db-user:nSst5jjT0GJL2UCx@clusterfree.z8i8f.mongodb.net/node-collection?retryWrites=true&w=majority";

const mongoConnect = () => {
  return mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = mongoConnect;
