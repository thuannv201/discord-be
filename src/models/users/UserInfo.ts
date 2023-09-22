import { Schema, model, Document } from "mongoose";
import esClient from "@elastic-search/client";
import logger from "@logger/index";
export interface IUserInfo {
    user_address?: string;
    first_name?: string;
    last_name?: string;
    date_of_birth?: Date;
    user_avatar?: string;
    phone_number?: string;
    user_name: string;
    full_name?: string;
    user_email: string;
}

interface IUserInfoModel extends IUserInfo, Document {}

const UserInfoSchema = new Schema<IUserInfoModel>(
    {
        user_address: { type: String, default: "" },
        first_name: { type: String, default: "" },
        last_name: { type: String, default: "" },
        full_name: { type: String, default: "" },
        date_of_birth: { type: Date, default: null },
        user_avatar: { type: String, default: "" },
        phone_number: { type: String, default: "" },
        user_name: {
            type: String,
            unique: true,
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

UserInfoSchema.post("save", async (doc) => {
    const indexName = "user_info";
    try {
        await esClient.index({
            index: indexName,
            id: doc._id.toString(),
            document: {
                user_name: doc.user_name,
                user_email: doc.user_email,
            },
        });
        logger.info(`Sync and indexed ${indexName} to Elastic successfully!`);
    } catch (error) {
        console.error(`Error indexing ${indexName}:`, error);
    }
});

const UserInfo = model<IUserInfoModel>("user_info", UserInfoSchema);

export default UserInfo;
