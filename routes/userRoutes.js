const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

// IMGs are not uploaded to DB, just the links

const router = express.Router();

//! Look at authController, some password handlers are not working...
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

//!
//! After this block
//! These routes are not all tested
//! Mark as tested with Protect as you test.
//!

//! Protect all routes after this middleware
router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete("/deleteMe", userController.deleteMe);

//! SUPPOSED TO BE ADMIN ROUTES, PROTECTED.
//! MAY NEED TO RECONFIGURE FOR NEEDED FEATURES - EX: SEARCH USERS AND ADD AS FRIEND, NEED GETALLUSERS...
//TODO: Implement roles - user/admin, etc.
// router.use(authController.restrictTo("admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
