import mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Conversation = new Schema(
  {
    recipients: [{type: Schema.Types.ObjectId}],
  },
  {timestamps: true}
);

module.exports = mongoose.model("Conversation", Conversation, "Conversation");
