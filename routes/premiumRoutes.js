const express = require("express");
const router = express.Router();
const premiumController = require("./../controllers/premiumController");
const authController = require("./../controllers/authController");

router.get(
  "/checkout-session/:userId", // add a url param if needed...
  authController.protect,
  premiumController.getCheckoutSession
);

module.exports = router;
