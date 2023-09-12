import { Schema, model } from "mongoose";

export interface IUserInfo {
    user_address: string;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    user_avatar: string;
    phone_number: string;
    user_name: string;
    user_email: string;
}

export interface IUserInfoModel extends IUserInfo, Document {}

const UserInfoSchema = new Schema<IUserInfoModel>(
    {
        user_address: { type: String, default: "" },
        first_name: { type: String, default: "" },
        last_name: { type: String, default: "" },
        date_of_birth: { type: Date, default: null },
        user_avatar: { type: String, default: "" },
        phone_number: { type: String, default: "" },
        user_name: {
            type: String,
            unique: true,
            default: "",
            maxlength: 50,
            validate: {
                validator: function (v: string) {
                    return v.length >= 6;
                },
                message: (props) =>
                    `Must be at least 6, got ${props.value.length}`,
            },
            required: [true, "Username is required"],
        },
        user_email: {
            type: String,
            validate: {
                validator: function (v: string) {
                    const regEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
                    return regEmail.test(v);
                },
                message: () => "Invalid email",
            },
            required: [true, "Email is required"],
            unique: true,
        },
    },
    { timestamps: true }
);

const UserInfo = model<IUserInfoModel>("user_info", UserInfoSchema);

export default UserInfo;
