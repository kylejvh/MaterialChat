const express = require("express");
const chatroomController = require("./../controllers/chatroomController");
const authController = require("./../controllers/authController");
const chatMessageRouter = require("../routes/chatMessageRoutes");

// Handling multiple routers

const router = express.Router();

//TODO: IMPLEMENT PROTECTION OF ROUTEs, NOT CURRENTLY WORKING. HOW DO YOU READ TOKEN ON CLIENT SIDE?
//! Look at authController, some password handlers are not working...

//! Protect all routes after this
router.use(authController.protect);

router.use("/:id/messages", chatMessageRouter);

router
  .route("/")
  .get(chatroomController.getAllChatrooms)
  .post(
    chatroomController.setChatroomCreatorIds,
    chatroomController.createChatroom
  );

//* handle chatroom operations
router
  .route("/:id")
  //! This one should fetch and populate messages...
  .get(chatroomController.getChatroom)
  .patch(
    // authController.restrictTo('admin', 'lead-guide'),
    chatroomController.updateChatroom
  )
  .delete(chatroomController.deleteChatroom);

// router.post("/chatroom/:name", chatroomController.joinChatroom);

// router.patch("/updateMe", authController.protect, userController.updateMe);

//TODO: What routes need to be protected?
//TODO: To protect and restrict - EX:
//TODO: .delete(authController.protect, authController.restrict('admin'), chatroomController.deleteChatroom)

// router
//   .route("/")
//   .get(authcontroller.protect, chatroomController.getAllChatrooms)
//   .post(authcontroller.protect, chatroomController.createChatroom);

// Param middleware that grabs route param, only for the current router/resource.
// router.param('id', tourController.checkID);
// Chaining methods that use the same route.

module.exports = router;
