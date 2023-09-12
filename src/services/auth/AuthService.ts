import UserCredentials, {
    IUserCredentials,
} from "@models/users/UserCredential";
import UserInfo, { IUserInfo } from "@models/users/UserInfo";
import { Types } from "mongoose";

export const CreateUserInfo = async (user_info: IUserInfo) => {
    const document = new UserInfo(user_info);
    const data = await document.save();
    return data;
};

export const CreateUserCredential = async (
    user_credentials: IUserCredentials
) => {
    const document = new UserCredentials(user_credentials);
    const data = await document.save();
    return data;
};

export const FindUserByEmail = async (user_email: string) => {
    const data = await UserInfo.findOne({ user_email });
    return data;
};

export const FindHashPasswordByUserId = async (id: Types.ObjectId) => {
    const data = await UserCredentials.findOne({ user_id: id });
    return data;
};
