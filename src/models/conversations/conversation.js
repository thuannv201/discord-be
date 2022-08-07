const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Conversation = new Schema(
  {
    recipients: [{type: Schema.Types.ObjectId}],
  },
  {timestamp: true}
);

module.exports = mongoose.model("Conversation", Conversation, "Conversation");
