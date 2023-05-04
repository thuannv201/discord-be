// Schema này dùng để thao tác với danh sách những người dùng đặc biệt
// ví dụ: ["bị block", "ưu tiên"]
import { Schema, model, Types } from "mongoose";

export interface IUserSpecial {
    owner: Types.ObjectId;
    specialList: {
        role: string;
        id: Types.ObjectId;
    }[];
}

export interface IUserSpecialModel extends IUserSpecial, Document {}

const UserSpecialSchema = new Schema<IUserSpecialModel>(
    {
        owner: { type: Schema.Types.ObjectId, ref: "Users" },
        specialList: [
            {
                role: { type: String, default: "" },
                id: { type: Schema.Types.ObjectId, ref: "Users" },
            },
        ],
    },
    { timestamps: true }
);
const UserSpec = model<IUserSpecialModel>("User_special", UserSpecialSchema, "user_special");

export default UserSpec;