// Schema này dùng để thao tác với danh sách những người dùng đặc biệt
// ví dụ: ["bị block", "ưu tiên"]
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSpec = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "Users" },
    specialList: [
      {
        role: { type: String, default: "" },
        id: { type: Schema.Types.ObjectId, ref: "Users" },
      },
    ],
  },
  { timestamp: true }
);

module.exports = mongoose.model("User_special", UserSpec, "user_special");
