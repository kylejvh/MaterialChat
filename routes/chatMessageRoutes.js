const express = require("express");
const chatMessageController = require("./../controllers/chatMessageController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(chatMessageController.getAllMessages)
  .post(
    chatMessageController.setChatMessageOriginIds,
    chatMessageController.createMessage
  );

router
  .route("/:id")
  .get(chatMessageController.getMessage)
  .patch(chatMessageController.updateMessage)
  .delete(chatMessageController.deleteMessage);

module.exports = router;
