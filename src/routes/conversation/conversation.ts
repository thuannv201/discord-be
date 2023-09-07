import express from "express";
import ConversationController from "../../controller/private_message";
const router = express.Router();
router.get("/messages", ConversationController.getMessages);
router.post("/", ConversationController.createConversation);

export default router;
