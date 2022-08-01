const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserDetails = new Schema(
  {
    address: {type: String, default: ""},
    firstName: {type: String, default: ""},
    lastName: {type: String, default: ""},
    userId: {type: Schema.Types.ObjectId, ref: "Users"},
    birth: {type: Date, default: null},
    avatar: {type: String, default: ""},
    phone: {type: String, default: ""},
  },
  {timestamp: true}
);

module.exports = mongoose.model("User_detail", UserDetails, "user_details");
