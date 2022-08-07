const express = require("express");
const ConversationController = require("../../controller/private_message");
const router = express.Router();
router.post("/", ConversationController.createConversation);

module.exports = router;
