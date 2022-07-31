const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserDetails = new Schema(
  {
    address: {type: String, default: ""},
    fName: {type: String, default: ""},
    lName: {type: String, default: ""},
    userId: {type: Schema.Types.ObjectId, ref: "Users"},
  },
  {timestamp: true}
);

module.exports = mongoose.model("User_detail", UserDetails, "user_details");
