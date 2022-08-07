const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ConversationMessage = new Schema(
  {
    author: {type: Schema.Types.ObjectId},
    conversationId: {type: Schema.Types.ObjectId},
    content: {type: String},
    attachments: {type: String},
  },
  {timestamp: true}
);

module.exports = mongoose.model(
  "ConversationMessage",
  ConversationMessage,
  "conversation_message"
);
