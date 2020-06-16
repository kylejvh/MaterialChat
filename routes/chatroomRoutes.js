const express = require("express");
const router = express.Router();
const chatroomController = require("./../controllers/chatroomController");
const authController = require("./../controllers/authController");
const chatMessageRouter = require("../routes/chatMessageRoutes");

router.use(authController.protect);

router.use("/:id/messages", chatMessageRouter);

router
  .route("/")
  .get(chatroomController.getAllChatrooms)
  .post(
    chatroomController.setChatroomCreatorIds,
    chatroomController.createChatroom
  );

router
  .route("/:id")
  .get(chatroomController.getChatroom)
  .patch(
    // authController.restrictTo('creator', '...'),
    chatroomController.updateChatroom
  )
  .delete(chatroomController.deleteChatroom);

module.exports = router;
