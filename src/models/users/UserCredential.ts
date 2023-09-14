import { Schema, model, Types, Document } from "mongoose";

export interface IUserCredentials {
    hash_password: string;
    user_id: Types.ObjectId;
}

interface IUserCredentialModal extends IUserCredentials, Document {}

const UserCredentialSchema = new Schema<IUserCredentialModal>(
    {
        hash_password: String,
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "user_info",
        },
    },
    {
        timestamps: true,
    }
);

const UserCredentials = model<IUserCredentialModal>(
    "user_credentials",
    UserCredentialSchema
);

export default UserCredentials;
