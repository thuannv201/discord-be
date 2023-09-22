import { BaseService } from "@services/common";
import { Request, Response } from "express";
import AuthApis from "@api/auth";
import { hashPassword } from "@utils/index";

class ResetPwService extends BaseService {
    async execute(req: Request, res: Response) {
        try {
            const { newPassword } = req.body;
            const user_email = res.locals.user_email;
            const hash_password = await hashPassword(newPassword);
            await AuthApis.changePasswordByEmail(
                user_email,
                hash_password as string
            );
            this.ok(res, "Password has been changed");
        } catch (err: any) {
            this.fail(res, err);
        }
    }
}

export default new ResetPwService();
