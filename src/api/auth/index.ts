import esClient from "@elastic-search/client";
import UserCredentials, {
    IUserCredentials,
} from "@models/users/UserCredential";
import UserInfo, { IUserInfo } from "@models/users/UserInfo";
import { Types } from "mongoose";

export const createUserInfo = async (user_info: IUserInfo) => {
    const document = new UserInfo(user_info);
    const data = await document.save();
    return data;
};

export const createUserCredential = async (
    user_credentials: IUserCredentials
) => {
    const document = new UserCredentials(user_credentials);
    const data = await document.save();
    return data;
};

export const findUserByEmail = async (user_email: string) => {
    const searchResult = await esClient.search({
        index: "user_info",
        query: {
            match_phrase_prefix: {
                //
                user_email: user_email,
            },
        },
    });
    console.log("searchResult :", searchResult.hits.hits);
    const data = await UserInfo.findOne({ user_email });

    return data;
};

export const findHashPasswordByUserId = async (id: Types.ObjectId) => {
    const data = await UserCredentials.findOne({ user_id: id });
    return data;
};

export const changePasswordByEmail = async (
    user_email: string,
    hash_password: string
) => {
    const user_info = await findUserByEmail(user_email);
    const rs = await UserCredentials.updateOne(
        { user_id: user_info?._id },
        { hash_password }
    );
    return rs;
};
