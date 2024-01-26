import { BaseService } from "@services/common";
import { genarateErrorCode, hashPassword, signUserToken } from "@utils/index";
import { Request, Response } from "express";
import AuthApis from "@api/auth";
import { IUserInfo } from "@models/users/UserInfo";
import { IUserCredentials } from "@models/users/UserCredential";

interface IRegisterResponse {
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
            res.cookie("accessToken", accessToken, { httpOnly: true });
            res.cookie("refreshToken", refreshToken, { httpOnly: true });
            this.ok<IRegisterResponse>(res, {
                userId: createdUserInfo._id,
            });
        } catch (err: any) {
            this.fail(res, genarateErrorCode(err));
        }
    }
    async checkValidUser(req: Request, res: Response) {
        try {
            if(!req.body.username){
                return this.clientError(res)
            }
            const user = await AuthApis.findUserByUserName(req.body.username)
            this.ok<{taken:boolean}>(res, {
                taken: !!user
            })
        } catch (err: any) {
            this.fail(res, genarateErrorCode(err));
        }
    }
}

export default new RegisterService();
