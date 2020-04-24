const express = require("express");
const premiumController = require("./../controllers/premiumController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.get(
  "/checkout-session/:userId", // add a url param if needed...
  authController.protect,
  premiumController.getCheckoutSession
);

module.exports = router;
