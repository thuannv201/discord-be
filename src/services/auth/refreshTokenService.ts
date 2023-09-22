import { BaseService } from "@services/common";
import { signUserToken, verifyRefreshToken } from "@utils/index";
import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import AuthApis from "@api/auth";
import { ITokenDTO } from "./types";

class RefreshTokenService extends BaseService {
    async execute(req: Request, res: Response) {
        const { refreshToken } = req.body;
        if (!refreshToken)
            return this.unauthorized(res, "Refresh token not found");

        try {
            const user = verifyRefreshToken(refreshToken) as JwtPayload;
            const { user_email } = user;
            const user_info = await AuthApis.findUserByEmail(user_email);

            if (!user_info) throw new Error("Cannot find user");

            const tokenData = {
                user_name: user_info.user_name,
                userId: user_info._id,
                user_email,
            };

            const { accessToken, refreshToken: newRefreshToken } =
                signUserToken(tokenData);

            return this.ok<ITokenDTO>(res, {
                refreshToken: newRefreshToken,
                userId: user_info._id,
                accessToken,
            });
        } catch (error: any) {
            return this.fail(res, error.message);
        }
    }
}

export default new RefreshTokenService();
