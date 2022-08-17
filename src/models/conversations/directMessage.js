const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DirectMessages = new Schema(
  {
    recipients: [{type: Schema.Types.ObjectId}],
  },
  {timestamp: true}
);

module.exports = mongoose.model(
  "DirectMessages",
  DirectMessages,
  "DirectMessages"
);
