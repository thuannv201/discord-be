import jwt from "jsonwebtoken";
import UserModel, { IUserModel } from "../../models/user/userModels";
import UserDetailModel from "../../models/user/userDetail";
import UserSpec from "../../models/user/userSpecial";
import bcrypt from "bcrypt";
import hbs, {
    NodemailerExpressHandlebarsOptions,
} from "nodemailer-express-handlebars";
import nodemailer from "nodemailer";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { sendSuccessMessage, sendFailMessage } from "../../utils";
import { JwtPayload } from "./types";
import {
    ACCESS_TOKEN_JWT_KEY,
    EXPIRES_TIME_REFRESH_TOKEN,
    EXPIRES_TIME_TOKEN,
    FPW_TOKEN_JWT_KEY,
    REFRESH_TOKEN_JWT_KEY,
    saltRounds,
} from "./contants";

class AuthController {
    resolveLogin(req: Request, res: Response) {
        const data = res.locals.tokenPayload;
        const accessToken = jwt.sign(data, ACCESS_TOKEN_JWT_KEY, {
            expiresIn: EXPIRES_TIME_TOKEN,
        });
        const refToken = jwt.sign(data, REFRESH_TOKEN_JWT_KEY, {
            expiresIn: EXPIRES_TIME_REFRESH_TOKEN,
        });
        res.send({ accessToken, status: "success", refToken, id: data.id });
    }
    async refresh(req: Request, res: Response, next: NextFunction) {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).send({
                errors: [{ msg: "Refresh token not found" }],
            });
        }
        try {
            const user = (await jwt.verify(
                refreshToken,
                REFRESH_TOKEN_JWT_KEY
            )) as JwtPayload;
            const { email } = user;
            const userInfo = (await UserModel.findOne({ email })) as IUserModel;
            if (!userInfo) return;
            const token = jwt.sign(
                { id: userInfo._id, email },
                ACCESS_TOKEN_JWT_KEY,
                {
                    expiresIn: EXPIRES_TIME_TOKEN,
                }
            );
            const newRefreshToken = jwt.sign(
                { id: userInfo._id, email },
                REFRESH_TOKEN_JWT_KEY,
                {
                    expiresIn: EXPIRES_TIME_REFRESH_TOKEN,
                }
            );
            // user
            return res.status(200).send({
                email: userInfo.email,
                userId: userInfo._id,
                accessToken: token,
                refToken: newRefreshToken,
            });
        } catch (error) {
            console.log("error :", error);
            return res.status(403).send({ errors: [{ msg: "Invalid token" }] });
        }
    }

    register(req: Request, res: Response) {
        const received = req.body;
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(received.password, salt).then((hash) => {
                received.password = hash;
                UserModel.create({
                    password: hash,
                    username: received?.username,
                    email: received.email,
                })
                    .then((data) => {
                        UserDetailModel.create({ ...received }).then(
                            (registData) => {
                                UserModel.updateOne(
                                    { username: data.username },
                                    { details: registData._id }
                                ).then((dataUpdated) => {
                                    const accessToken = jwt.sign(
                                        {
                                            username: data.username,
                                            email: data.email,
                                        },
                                        ACCESS_TOKEN_JWT_KEY,
                                        {
                                            expiresIn: EXPIRES_TIME_TOKEN,
                                        }
                                    );
                                    const refToken = jwt.sign(
                                        {
                                            username: data.username,
                                            email: data.email,
                                        },
                                        REFRESH_TOKEN_JWT_KEY,
                                        {
                                            expiresIn:
                                                EXPIRES_TIME_REFRESH_TOKEN,
                                        }
                                    );
                                    res.send(
                                        sendSuccessMessage(
                                            "Register successfully!",
                                            {
                                                accessToken,
                                                refToken,
                                            }
                                        )
                                    );
                                });
                            }
                        );
                        UserSpec.create({ owner: data._id }).then(
                            (userSpecData) => {
                                console.log("userSpecData :", userSpecData);
                            }
                        );
                    })
                    .catch((err) => {
                        if (err.name === "ValidationError") {
                            let errors: any = {};

                            Object.keys(err.errors).forEach((key: string) => {
                                errors[key] = err.errors[key].message;
                            });

                            return res.status(400).send({
                                status: "error",
                                errors,
                                message: "Register failed",
                            });
                        } else {
                            res.status(201).send(
                                sendFailMessage("Register Failed!", {
                                    ...err,
                                    mes: err.message,
                                })
                            );
                        }
                    });
            });
        });
    }

    forgotPW(req: Request, res: Response) {
        const { username } = req.body;
        UserModel.findOne({ username: username }).then((data) => {
            if (!data)
                return res.status(200).send(sendFailMessage("User not found"));

            //generate token for 10 minutes
            const username1 = data.username;
            const resetPwToken = jwt.sign(
                { username: username1 },
                FPW_TOKEN_JWT_KEY,
                {
                    expiresIn: "15m",
                }
            );
            // setup nodemailer + handlebars
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "hoc17112001@gmail.com",
                    pass: "xhspunxznenckraq",
                },
            });
            const handlebarOptions: NodemailerExpressHandlebarsOptions = {
                viewEngine: {
                    partialsDir: path.resolve("./views/"),
                    // defaultLayout: false,
                },
                viewPath: path.resolve("./views/"),
            };

            transporter.use("compile", hbs(handlebarOptions));
            const mailOptions = {
                from: '"Discord fake" <hoc17112001@gmail.com>', // sender address
                to: data.email, // list of receivers
                subject: "Forgot Password!",
                template: "emailForgotPw", // the name of the template file i.e email.handlebars
                context: {
                    username: data.username, // replace {{name}} with Adebola
                    link: `http://localhost:6508/auth/reset?token=${resetPwToken}`, // replace {{company}} with My Company
                },
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                } else {
                    console.log("Message sent: " + info.response);
                    res.send(
                        sendSuccessMessage(
                            "Email sent. Please check your message"
                        )
                    );
                }
            });
        });
    }

    reset(req: Request, res: Response) {
        const newPassword = req.body.newPassword;
        const username = res.locals.username;
        if (newPassword && typeof newPassword == "string") {
            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(newPassword, salt).then((hash) => {
                    UserModel.updateOne(
                        { username: username },
                        { password: hash }
                    )
                        .then((data) => {
                            res.send(sendSuccessMessage("Password changed!"));
                        })
                        .catch((err) => {
                            res.status(201).send(
                                sendFailMessage(
                                    "Unknown Error while reset password",
                                    err
                                )
                            );
                        });
                });
            });
        } else {
            res.status(201).send(sendFailMessage("Reset password failed"));
        }
    }

    test(req: Request, res: Response) {
        console.log("asdkahdjkaaklsdjasjkdahsdjkashdasjkdahjk");
        res.json("asjkdhadja");
    }
}

export default new AuthController();
