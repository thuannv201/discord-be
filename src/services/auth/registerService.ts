import { BaseService } from "@services/common";
import { hashPassword, signUserToken } from "@utils/index";
import { Request, Response } from "express";
import AuthApis from "@api/auth";
import { IUserInfo } from "@models/users/UserInfo";
import { IUserCredentials } from "@models/users/UserCredential";

interface IRegisterResponse {
    accessToken: string;
    refreshToken: string;
    userId: string;
}

class RegisterService extends BaseService {
    async execute(req: Request, res: Response) {
        try {
            const received = req.body;
            const hash_password = await hashPassword(received.password);

            const newUser: IUserInfo = {
                date_of_birth: received.birth as Date,
                user_name: received.username as string,
                user_email: received.email as string,
            };
            const createdUserInfo = await AuthApis.createUserInfo(newUser);

            const newUserCredential: IUserCredentials = {
                hash_password: hash_password as string,
                user_id: createdUserInfo._id,
            };
            await AuthApis.createUserCredential(newUserCredential);

            const data = {
                user_name: createdUserInfo.user_name,
                user_email: createdUserInfo.user_email,
                userId: createdUserInfo._id,
            };
            const { accessToken, refreshToken } = signUserToken(data);

            this.ok<IRegisterResponse>(res, {
                accessToken,
                refreshToken,
                userId: createdUserInfo._id,
            });
        } catch (err: any) {
            this.fail(res, err);
            console.log("object");
        }
    }
}

export default new RegisterService();
