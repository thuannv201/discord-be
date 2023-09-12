import { Request, Response } from "express";
import {
    sendSuccessMessage,
    sendFailMessage,
    hashPassword,
    signAccessToken,
    signRefreshToken,
    comparePassword,
} from "@utils/index";
import {
    CreateUserCredential,
    CreateUserInfo,
    FindHashPasswordByUserId,
    FindUserByEmail,
} from "@services/auth/AuthService";

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
        console.log("isPasswordCorrect :", isPasswordCorrect);

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
            const hash_password = (await hashPassword(
                received.password
            )) as string;
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
                hash_password,
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

    // reset(req: Request, res: Response) {
    //     const newPassword = req.body.newPassword;
    //     const username = res.locals.username;
    //     if (newPassword && typeof newPassword == "string") {
    //         bcrypt.genSalt(saltRounds, function (err, salt) {
    //             bcrypt.hash(newPassword, salt).then((hash) => {
    //                 UserModel.updateOne(
    //                     { username: username },
    //                     { password: hash }
    //                 )
    //                     .then((data) => {
    //                         res.send(sendSuccessMessage("Password changed!"));
    //                     })
    //                     .catch((err) => {
    //                         res.status(201).send(
    //                             sendFailMessage(
    //                                 "Unknown Error while reset password",
    //                                 err
    //                             )
    //                         );
    //                     });
    //             });
    //         });
    //     } else {
    //         res.status(201).send(sendFailMessage("Reset password failed"));
    //     }
    // }

    // async refreshToken(req: Request, res: Response) {
    //     const { refreshToken } = req.body;
    //     if (!refreshToken)
    //         return res.status(401).send({
    //             errors: [{ msg: "Refresh token not found" }],
    //         });

    //     try {
    //         const user = (await jwt.verify(
    //             refreshToken,
    //             REFRESH_TOKEN_JWT_KEY
    //         )) as JwtPayload;
    //         const { email } = user;
    //         const userInfo = (await UserCredential.findOne({
    //             email,
    //         })) as IUserCredentialModal;
    //         if (!userInfo) throw new Error("Cannot find user");
    //         const token = jwt.sign(
    //             { id: userInfo._id, email },
    //             ACCESS_TOKEN_JWT_KEY,
    //             {
    //                 expiresIn: EXPIRES_TIME_TOKEN,
    //             }
    //         );
    //         const newRefreshToken = jwt.sign(
    //             { id: userInfo._id, email },
    //             REFRESH_TOKEN_JWT_KEY,
    //             {
    //                 expiresIn: EXPIRES_TIME_REFRESH_TOKEN,
    //             }
    //         );
    //         // user
    //         return res.send({
    //             email: userInfo.email,
    //             userId: userInfo._id,
    //             accessToken: token,
    //             refToken: newRefreshToken,
    //         });
    //     } catch (error) {
    //         console.log("error :", error);
    //         return res.status(403).send({ errors: [{ msg: "Invalid token" }] });
    //     }
    // }

    // forgotPW(req: Request, res: Response) {
    //     const { username } = req.body;
    //     UserModel.findOne({ username: username }).then((data) => {
    //         if (!data)
    //             return res.status(200).send(sendFailMessage("User not found"));

    //         //generate token for 10 minutes
    //         const username1 = data.username;
    //         const resetPwToken = jwt.sign(
    //             { username: username1 },
    //             FPW_TOKEN_JWT_KEY,
    //             {
    //                 expiresIn: "15m",
    //             }
    //         );
    //         // setup nodemailer + handlebars
    //         const transporter = nodemailer.createTransport({
    //             service: "gmail",
    //             auth: {
    //                 user: "hochv2001@gmail.com",
    //                 pass: "imfpxgoxdaubwtwj",
    //             },
    //         });
    //         const handlebarOptions: NodemailerExpressHandlebarsOptions = {
    //             viewEngine: {
    //                 partialsDir: path.resolve("./src/views/"),
    //                 defaultLayout: false,
    //             },
    //             viewPath: path.resolve("./src/views/"),
    //         };

    //         transporter.use("compile", hbs(handlebarOptions));
    //         const mailOptions = {
    //             from: '"Discord fake" <hochv2001@gmail.com>', // sender address
    //             to: data.email, // list of receivers
    //             subject: "Forgot Password!",
    //             template: "emailForgotPw", // the name of the template file i.e email.handlebars
    //             context: {
    //                 username: data.username, // replace {{name}} with Adebola
    //                 link: `http://localhost:6508/auth/reset?token=${resetPwToken}`, // replace {{company}} with My Company
    //             },
    //         };
    //         transporter.sendMail(mailOptions, function (error, info) {
    //             if (error) {
    //                 return console.log(error);
    //             } else {
    //                 console.log("Message sent: " + info.response);
    //                 res.send(
    //                     sendSuccessMessage(
    //                         "Email sent. Please check your message"
    //                     )
    //                 );
    //             }
    //         });
    //     });
    // }

    // resetPW(req: Request, res: Response) {
    //     const newPassword = req.body.newPassword;
    //     const username = res.locals.username;
    //     if (newPassword && typeof newPassword == "string") {
    //         bcrypt.genSalt(saltRounds, function (err, salt) {
    //             bcrypt.hash(newPassword, salt).then((hash) => {
    //                 UserModel.updateOne(
    //                     { username: username },
    //                     { password: hash }
    //                 )
    //                     .then((data) => {
    //                         res.send(sendSuccessMessage("Password changed!"));
    //                     })
    //                     .catch((err) => {
    //                         res.status(201).send(
    //                             sendFailMessage(
    //                                 "Unknown Error while reset password",
    //                                 err
    //                             )
    //                         );
    //                     });
    //             });
    //         });
    //     } else {
    //         res.status(201).send(sendFailMessage("Reset password failed"));
    //     }
    // }
}

export default new AuthController();
