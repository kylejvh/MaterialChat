const express = require("express");
const router = express.Router();
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");

router.post("/signup", authController.signup);
router.post("/signupGuest", authController.signupGuest);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get(
  "/queryMe",
  authController.isLoggedIn,
  userController.getMe,
  userController.getUser
);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// All routes below are protected routes and require authorization
router.use(authController.protect);

router.patch("/updateMyPassword", authController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch(
  "/updateMe",
  userController.cloudinaryPhotoUpload,
  authController.verifyPassword,
  userController.updateMe
);
router.delete("/deleteMe", userController.deleteMe);

// Admin CRUD routes - reserved for future use/roles
// router.use(authController.restrictTo("admin"));
// router
//   .route("/")
//   .get(userController.getAllUsers)
//   .post(userController.createUser);
// router
//   .route("/:id")
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
