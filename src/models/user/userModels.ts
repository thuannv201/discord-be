import { Schema, model, Types, Document } from "mongoose";

export interface IUser {
    username: string;
    email: string;
    password: string;
    updatedAt: Date;
    details: Types.ObjectId;
    servers: Types.ObjectId;
}

export interface IUserModel extends IUser, Document {}

const UserSchema = new Schema<IUserModel>(
    {
        username: {
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
        email: {
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
        password: {
            type: String,
            validate: {
                validator: function (v: string) {
                    return v.length >= 6;
                },
                message: (props) =>
                    `Must be at least 6, got ${props.value.length}`,
            },
            required: [true, "Password is required"],
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        details: {
            type: Schema.Types.ObjectId,
            ref: "User_detail",
        },
        servers: [
            {
                type: Schema.Types.ObjectId,
                ref: "Servers",
            },
        ],
    },
    {
        timestamps: true,
    }
);
const User = model<IUserModel>("Users", UserSchema, "user");

export default User;
