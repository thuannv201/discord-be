import express = require("express");
const ConversationController = require("../../controller/private_message");
const router = express.Router();
router.get("/messages", ConversationController.getMessages);
router.post("/", ConversationController.createConversation);

module.exports = router;
