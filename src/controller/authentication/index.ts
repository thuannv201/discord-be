import { Request, Response } from "express";
import {
    sendSuccessMessage,
    sendFailMessage,
    hashPassword,
    signAccessToken,
    signRefreshToken,
    comparePassword,
    verifyRefreshToken,
    signRsPwToken,
} from "@utils/index";
import {
    ChangePasswordByEmail,
    CreateUserCredential,
    CreateUserInfo,
    EmailSender,
    FindHashPasswordByUserId,
    FindUserByEmail,
} from "@services/auth";
import { JwtPayload } from "jsonwebtoken";
import path from "path";
import { NodemailerExpressHandlebarsOptions } from "nodemailer-express-handlebars";

class AuthController {
    async resolveLogin(req: Request, res: Response) {
        const received = req.body;
        const user_info = await FindUserByEmail(
            received?.email || received?.username
        );

        if (!user_info) {
            return res
                .status(400)
                .json(sendFailMessage("Email or password are not correct"));
        }
        const user_credential = await FindHashPasswordByUserId(user_info._id);

        const isPasswordCorrect = await comparePassword(
            received.password,
            user_credential?.hash_password || ""
        );

        if (!isPasswordCorrect)
            return res
                .status(400)
                .json(sendFailMessage("Email or password are not correct"));

        const data = {
            username: user_info.user_name,
            email: user_info.user_email,
            id: user_info._id,
            ...user_info,
        };
        const accessToken = signAccessToken(data);
        const refToken = signRefreshToken(data);
        res.send({ accessToken, status: "success", refToken, id: data.id });
    }

    async register(req: Request, res: Response) {
        try {
            const received = req.body;
            const hash_password = await hashPassword(received.password);
            const createdUserInfo = await CreateUserInfo({
                date_of_birth: received.birth,
                user_name: received.username,
                user_email: received.email,
                first_name: "",
                last_name: "",
                phone_number: "",
                user_address: "",
                user_avatar: "",
            });
            await CreateUserCredential({
                hash_password: hash_password as string,
                user_id: createdUserInfo._id,
            });
            const accessToken = signAccessToken({
                username: createdUserInfo.user_name,
                email: createdUserInfo.user_email,
            });
            const refToken = signRefreshToken({
                username: createdUserInfo.user_name,
                email: createdUserInfo.user_email,
            });
            res.send(
                sendSuccessMessage("Register successfully!", {
                    accessToken,
                    refToken,
                })
            );
        } catch (err) {
            res.status(400).send(sendFailMessage("Resgister failed!", err));
        }
    }

    async refreshToken(req: Request, res: Response) {
        const { refreshToken } = req.body;
        if (!refreshToken)
            return res.status(401).send({
                errors: [{ msg: "Refresh token not found" }],
            });

        try {
            const user = verifyRefreshToken(refreshToken) as JwtPayload;
            const { email } = user;
            const user_info = await FindUserByEmail(email);
            if (!user_info) throw new Error("Cannot find user");
            const newAccessToken = signAccessToken({
                id: user_info._id,
                email,
            });
            const newRefreshToken = signRefreshToken({
                id: user_info._id,
                email,
            });

            return res.send({
                email: user_info.user_email,
                userId: user_info._id,
                accessToken: newAccessToken,
                refToken: newRefreshToken,
            });
        } catch (error) {
            return res.status(403).send({ errors: [{ msg: "Invalid token" }] });
        }
    }

    async forgotPW(req: Request, res: Response) {
        const { user_email } = req.body;
        const user_info = await FindUserByEmail(user_email);
        if (!user_info) {
            return res.status(200).send(sendFailMessage("User not found"));
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
                username: user_info.user_name, // replace {{name}} with Adebola
                link: `http://localhost:6508/auth/reset?token=${resetPwToken}`, // replace {{company}} with My Company
            },
        };

        const handlebarOptions: NodemailerExpressHandlebarsOptions = {
            viewEngine: {
                partialsDir: path.resolve("./src/views/"),
                defaultLayout: false,
            },
            viewPath: path.resolve("./src/views/"),
        };

        const isSendSuccess = await EmailSender(handlebarOptions, mailOptions);

        if (isSendSuccess) {
            return res.send(
                sendSuccessMessage(
                    "Email has been sent successfully! Please check your email message"
                )
            );
        }

        return res.status(500).send(sendFailMessage("Send email failed"));
    }

    async resetPW(req: Request, res: Response) {
        try {
            const { newPassword } = req.body;
            const user_email = res.locals.user_email;
            const hash_password = (await hashPassword(newPassword)) as string;
            const rs = await ChangePasswordByEmail(user_email, hash_password);
            console.log("rs :", rs);
            res.send(sendSuccessMessage("Password has been changed"));
        } catch (err) {
            res.status(201).send(sendFailMessage("Reset password failed", err));
        }
    }
}

export default new AuthController();
