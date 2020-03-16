const express = require("express");
const chatMessageController = require("./../controllers/chatMessageController");
const authController = require("./../controllers/authController");
const io = require("./../server").io;

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

//* handle chatroom message operations
//* POST - New messages should POST to /chatrooms/{chatroomId}/messages
//* UserId will come from logged in user.
//* GET - Same - should GET to /chatroom/{chatroomId}/messages
//* and GETchatroom should also fetch messages via populate?
//! THESE NEED TESTING
router
  .route("/")
  .get(chatMessageController.getAllMessages)
  .post(
    //TODO: Seems to work

    chatMessageController.setChatMessageOriginIds,
    chatMessageController.createMessage
  );

//! Verify if correct...
router
  .route("/:id")
  .get(chatMessageController.getMessage)
  .patch(chatMessageController.updateMessage)
  .delete(chatMessageController.deleteMessage);

module.exports = router;
