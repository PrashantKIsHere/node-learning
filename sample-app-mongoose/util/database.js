const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri =
  "mongodb+srv://mongo-db-user:nSst5jjT0GJL2UCx@clusterfree.z8i8f.mongodb.net/node-collection?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db;

const mongoConnect = (callback) => {
  client
    .connect()
    .then((dbClient) => {
      // SET THE DATABASE AND WILL USE THE DEFAULT DATABASE SPECIFIED IN URL
      _db = dbClient.db();
      // IF YOU WANT TO CHANGE THE DATABASE
      // _db = dbClient.db('test') // WILL USE THE DIFFERENT DATABASE
      console.log("Mongo DB Connected....");
      callback();
    })
    .catch((err) => {
      console.log("Error While Connecting Mongo DB", err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No Database Found !!!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
