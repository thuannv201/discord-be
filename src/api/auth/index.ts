import esClient from "@elastic-search/client";
import UserCredentials, {
    IUserCredentials,
} from "@models/users/UserCredential";
import UserInfo, { IUserInfo } from "@models/users/UserInfo";
import { Types } from "mongoose";

class AuthApis {
    async createUserInfo(user_info: IUserInfo) {
        const document = new UserInfo(user_info);
        const data = await document.save();
        return data;
    }

    async createUserCredential(user_credentials: IUserCredentials) {
        const document = new UserCredentials(user_credentials);
        const data = await document.save();
        return data;
    }

    async findUserByEmail(user_email: string) {
        const data = await UserInfo.findOne({ user_email });
        return data;
    }

    async findUserByUserName(user_name: string) {
        const data = await UserInfo.findOne({ user_name });
        return data;
    }

    async findHashPasswordByUserId(id: Types.ObjectId) {
        const data = await UserCredentials.findOne({ user_id: id });
        return data;
    }

    async changePasswordByEmail(user_email: string, hash_password: string) {
        const user_info = await this.findUserByEmail(user_email);
        const rs = await UserCredentials.updateOne(
            { user_id: user_info?._id },
            { hash_password }
        );
        return rs;
    }
}

export default new AuthApis();
