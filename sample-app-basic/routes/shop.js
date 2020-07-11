const express = require("express");
const path = require("path");

const rootDir = require("../util/path");

const shopController = require("../controllers/shop");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

// Order Matter when There is Specific Routes and dynamic Routes
router.get("/products/:productId", shopController.getProduct);

router.get("/cart", shopController.getCart);

router.post("/cart", shopController.postCart);

router.post("/delete-cart-item", shopController.postCartDeleteProduct);

router.get("/orders", shopController.getOrders);

router.get("/checkout", shopController.getCheckout);

module.exports = router;
