import { BaseService } from "@services/common";
import { Request, Response } from "express";
import AuthApis from "@api/auth";
import { comparePassword, signUserToken } from "@utils/index";
import { ITokenDTO } from "./types";

const validatePassword = async (
    plainTextPassword: string,
    hash_password: string,
    callback: (isCorrectPassword: boolean) => void
) => {
    const isPasswordCorrect = await comparePassword(
        plainTextPassword,
        hash_password
    );
    console.log("isPasswordCorrect :", isPasswordCorrect);
    return callback(isPasswordCorrect);
};

class LoginService extends BaseService {
    async execute(req: Request, res: Response) {
        try {
            const received = req.body;
            const user_info = await AuthApis.findUserByEmail(received?.email);

            if (!user_info) {
                return this.fail(res, "Email or password are not correct");
            }

            const user_credential = await AuthApis.findHashPasswordByUserId(
                user_info._id
            );

            const sendResponse = (isCorrectPassword: boolean) => {
                if (!isCorrectPassword) {
                    return this.fail(res, "Email or password are not correct");
                }
                const data = {
                    user_name: user_info.user_name,
                    user_email: user_info.user_email,
                    userId: user_info._id,
                };
                const { accessToken, refreshToken } = signUserToken(data);
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                }).cookie("refreshToken", refreshToken, { httpOnly: true });
                this.ok<ITokenDTO>(res, {
                    userId: user_info._id,
                });
            };

            await validatePassword(
                received.password,
                user_credential?.hash_password as string,
                sendResponse
            );
        } catch (err: any) {
            console.log("err :", err);
            this.fail(res, err);
        }
    }
}

export default new LoginService();
