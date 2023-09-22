import { BaseService } from "@services/common";
import {
    hashPassword,
    sendFailMessage,
    sendSuccessMessage,
    signAccessToken,
    signRefreshToken,
    signUserToken,
} from "@utils/index";
import { Request, Response } from "express";
import AuthApis from "@api/auth";

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
            const createdUserInfo = await AuthApis.createUserInfo({
                date_of_birth: received.birth as Date,
                user_name: received.username as string,
                user_email: received.email as string,
                first_name: "",
                last_name: "",
                phone_number: "",
                user_address: "",
                user_avatar: "",
                full_name: "",
            });
            await AuthApis.createUserCredential({
                hash_password: hash_password as string,
                user_id: createdUserInfo._id,
            });

            const data = {
                user_name: createdUserInfo.user_name,
                user_email: createdUserInfo.user_email,
            };
            const { accessToken, refreshToken } = signUserToken(data);

            this.ok<IRegisterResponse>(res, {
                accessToken,
                refreshToken,
                userId: createdUserInfo._id,
            });
        } catch (err: any) {
            this.fail(res, err);
        }
    }
}

export default new RegisterService();
