const express = require("express");
const router = express.Router({ mergeParams: true });
const chatMessageController = require("./../controllers/chatMessageController");
const authController = require("./../controllers/authController");

router.use(authController.protect);

router.route("/").get(chatMessageController.getAllMessages);
// .post
// chatMessageController.setChatMessageOriginIds,
// chatMessageController.createMessage
// ();

router
  .route("/:id")
  .get(chatMessageController.getMessage)
  .patch(chatMessageController.updateMessage)
  .delete(chatMessageController.deleteMessage);

module.exports = router;
