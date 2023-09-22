import { BaseService, emailSender } from "@services/common";
import { signRsPwToken } from "@utils/index";
import { Request, Response } from "express";
import AuthApis from "@api/auth";
import { NodemailerExpressHandlebarsOptions } from "nodemailer-express-handlebars";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

const FE_HOSTING_DOMAIN = process.env.FE_HOSTING_DOMAIN || "";

class ForgotPwService extends BaseService {
    async execute(req: Request, res: Response) {
        try {
            const { user_email } = req.body;
            const user_info = await AuthApis.findUserByEmail(user_email);
            if (!user_info) {
                return this.notFound(res, "User not found");
            }

            //generate token for 10 minutes
            const resetPwToken = signRsPwToken({
                user_email: user_info.user_email,
            });

            // setup nodemailer + handlebars
            const mailOptions = {
                from: '"Discord fake" <hochv2001@gmail.com>', // sender address
                to: user_info.user_email, // list of receivers
                subject: "Forgot Password!",
                template: "emailForgotPw", // the name of the template file i.e email.handlebars
                context: {
                    username: user_info.user_name,
                    link: `${FE_HOSTING_DOMAIN}/auth/reset?token=${resetPwToken}`,
                },
            };

            const handlebarOptions: NodemailerExpressHandlebarsOptions = {
                viewEngine: {
                    partialsDir: path.resolve("./src/views/"),
                    defaultLayout: false,
                },
                viewPath: path.resolve("./src/views/"),
            };

            await emailSender(handlebarOptions, mailOptions);

            return this.ok(
                res,
                "Reset password message has been sent to your email address"
            );
        } catch (err: any) {
            this.fail(res, err);
        }
    }
}

export default new ForgotPwService();
