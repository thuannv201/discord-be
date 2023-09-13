import UserCredentials, {
    IUserCredentials,
} from "@models/users/UserCredential";
import UserInfo, { IUserInfo } from "@models/users/UserInfo";
import { Types } from "mongoose";
import nodemailer from "nodemailer";
import hbs, {
    NodemailerExpressHandlebarsOptions,
} from "nodemailer-express-handlebars";

interface Mail {
    from: string; // sender address
    to: string; // list of receivers
    subject: string;
    template: string; // the name of the template file i.e email.handlebars
    context: {
        username: string; // replace {{name}} with Adebola
        link: string; // replace {{company}} with My Company
    };
}

export const CreateUserInfo = async (user_info: IUserInfo) => {
    const document = new UserInfo(user_info);
    const data = await document.save();
    return data;
};

export const CreateUserCredential = async (
    user_credentials: IUserCredentials
) => {
    const document = new UserCredentials(user_credentials);
    const data = await document.save();
    return data;
};

export const FindUserByEmail = async (user_email: string) => {
    const data = await UserInfo.findOne({ user_email });
    return data;
};

export const FindHashPasswordByUserId = async (id: Types.ObjectId) => {
    const data = await UserCredentials.findOne({ user_id: id });
    return data;
};

export const EmailSender = async (
    handlebarOptions: NodemailerExpressHandlebarsOptions,
    mailOptions: Mail
) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "hochv2001@gmail.com",
            pass: "imfpxgoxdaubwtwj",
        },
    });

    transporter.use("compile", hbs(handlebarOptions));

    const emailResponse = new Promise((resolve) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                resolve(false);
            }
            console.log("Message sent: " + info.response);
            resolve(info.response);
        });
    });

    return emailResponse;
};

export const ChangePasswordByEmail = async (
    user_email: string,
    hash_password: string
) => {
    const user_info = await FindUserByEmail(user_email);
    const rs = await UserCredentials.updateOne(
        { user_id: user_info?._id },
        { hash_password }
    );
    return rs;
};
