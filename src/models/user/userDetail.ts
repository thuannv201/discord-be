import { Schema, model } from "mongoose";

export interface IUserDetails {
    address: string;
    firstName: string;
    lastName: string;
    birth: Date;
    avatar: string;
    phone: string;
}

export interface IUserDetailsModel extends IUserDetails, Document {}

const UserDetailsSchema = new Schema<IUserDetailsModel>(
    {
        address: { type: String, default: "" },
        firstName: { type: String, default: "" },
        lastName: { type: String, default: "" },
        birth: { type: Date, default: null },
        avatar: { type: String, default: "" },
        phone: { type: String, default: "" },
    },
    { timestamps: true }
);

const UserDetails = model<IUserDetailsModel>("User_details", UserDetailsSchema);

export default UserDetails;