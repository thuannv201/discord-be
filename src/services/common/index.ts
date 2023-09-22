import nodemailer from "nodemailer";
import hbs, {
    NodemailerExpressHandlebarsOptions,
} from "nodemailer-express-handlebars";

export { BaseService } from "@services/common/baseService";
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

export const emailSender = async (
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
