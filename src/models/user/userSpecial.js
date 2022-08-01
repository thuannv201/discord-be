// Schema này dùng để thao tác với danh sách những người dùng đặc biệt
// ví dụ: ["bị block", "ưu tiên"]
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserDetails = new Schema(
  {
    userSpecial: {type: Schema.Types.ObjectId, ref: "Users"},
    userId: {type: Schema.Types.ObjectId},
    role: {type: String, default: ""},
  },
  {timestamp: true}
);

module.exports = mongoose.model("User_special", UserDetails, "user_special");
