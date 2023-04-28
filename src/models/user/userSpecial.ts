// Schema này dùng để thao tác với danh sách những người dùng đặc biệt
// ví dụ: ["bị block", "ưu tiên"]
import mongoose, {Schema} from "mongoose";

interface IUserSpecial {
  owner?: string | Schema.Types.ObjectId;
  specialList: {
    role: string;
    id: string;
  }[];
}
const UserSpec = new Schema<IUserSpecial>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "Users" },
    specialList: [
      {
        role: { type: String, default: "" },
        id: { type: Schema.Types.ObjectId, ref: "Users" },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User_special", UserSpec, "user_special");
