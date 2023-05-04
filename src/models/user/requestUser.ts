import { Schema, model, Types } from "mongoose";

export interface IUserRequest {
    requestor: Types.ObjectId;
    to: Types.ObjectId;
}

export interface IUserRequestModel extends IUserRequest, Document {}

const UserRequestSchema = new Schema<IUserRequestModel>(
    {
        requestor: { type: Schema.Types.ObjectId, ref: "Users" },
        to: { type: Schema.Types.ObjectId, ref: "Users" },
    },
    { timestamps: true }
);

const UserRequest = model<IUserRequestModel>("Users", UserRequestSchema);

export default UserRequest;
