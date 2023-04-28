import mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserRequest = new Schema(
  {
    requestor: {type: Schema.Types.ObjectId, ref: "Users"},
    to: {type: Schema.Types.ObjectId, ref: "Users"},
  },
  {timestamps: true}
);

module.exports = mongoose.model("User_request", UserRequest, "User_request");
