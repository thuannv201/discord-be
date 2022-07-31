const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const UserModel = require("../models/user/userModels");
const UserDetailModel = require("../models/user/userDetail");
const bcrypt = require("bcrypt");
const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");
const EXPIRES_TIME = "10m";
const {sendSuccessMessage, sendFailMessage} = require("../utils");
const saltRounds = 10;
dotenv.config();

class AuthController {
  resolveLogin(req, res) {
    const data = res.locals.tokenPayload;

    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_JWT_KEY, {
      expiresIn: EXPIRES_TIME,
    });
    const refToken = jwt.sign(data, process.env.REFRESH_TOKEN_JWT_KEY, {
      expiresIn: EXPIRES_TIME,
    });
    res.send({accessToken, status: "success", refToken});
  }
  async refresh(req, res, next) {
    const {refreshToken} = req.body;
    if (!refreshToken) {
      return res.status(401).send({
        errors: [{msg: "Refresh token not found"}],
      });
    }
    try {
      const user = await jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_JWT_KEY
      );
      const {email} = user;
      const userInfo = await User.findOne({email});
      const token = jwt.sign(
        {user_id: user._id, email},
        process.env.ACCESS_TOKEN_JWT_KEY,
        {
          expiresIn: "12h",
        }
      );
      const newRefreshToken = jwt.sign(
        {user_id: user._id, email},
        process.env.REFRESH_TOKEN_JWT_KEY,
        {
          expiresIn: "36h",
        }
      );
      userInfo.token = token;
      userInfo.refreshToken = newRefreshToken;
      // user
      return res.status(200).send({
        email: userInfo.email,
        userId: userInfo.userId,
        accessToken: userInfo.token,
        expiresIn: 43200,
        refreshExpiresIn: 129600,
        refToken: userInfo.refreshToken,
      });
    } catch (error) {
      console.log("error :", error);
      return res.status(403).send({errors: [{msg: "Invalid token"}]});
    }
  }

  register(req, res) {
    const received = req.body;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(received.password, salt).then((hash) => {
        received.password = hash;
        UserModel.create({...received, details: data._id})
          .then((data) => {
            res.send(sendSuccessMessage("Register successfully!"));
          })
          .catch((err) => {
            if (err.name === "ValidationError") {
              let errors = {};

              Object.keys(err.errors).forEach((key) => {
                errors[key] = err.errors[key].message;
              });

              return res.status(400).send({
                status: "error",
                errors,
                message: "Register failed",
              });
            }
          });
      });
    });
  }

  forgotPW(req, res) {
    const {username} = req.body;
    UserModel.findOne({username: username}).then((data) => {
      if (!data) res.status(200).send(sendFailMessage("User not found"));
      if (data) {
        //generate token for 10 minutes
        const username1 = data.username;
        const resetPwToken = jwt.sign(
          {username: username1},
          process.env.FPW_TOKEN_JWT_KEY,
          {expiresIn: "15m"}
        );
        // setup nodemailer + handlebars
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "hoc17112001@gmail.com",
            pass: "xhspunxznenckraq",
          },
        });
        const handlebarOptions = {
          viewEngine: {
            partialsDir: path.resolve("./views/"),
            defaultLayout: false,
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
              sendSuccessMessage("Email sent. Please check your message")
            );
          }
        });
      }
    });
  }

  reset(req, res) {
    const newPassword = req.body.newPassword;
    const username = res.locals.username;
    if (newPassword && typeof newPassword == "string") {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(newPassword, salt).then((hash) => {
          UserModel.updateOne({username: username}, {password: hash})
            .then((data) => {
              res.send(sendSuccessMessage("Password changed!"));
            })
            .catch((err) => {
              res
                .status(201)
                .sendFailMessage("Unknown Error while reset password", err);
            });
        });
      });
    } else {
      res.status(201).send(sendFailMessage("Reset password failed"));
    }
  }

  test(req, res) {
    UserModel.find({}).then((users) => {
      const userData = users.map((data) => {
        return {id: data._id, username: data.username, role: data.role};
      });
      res.send(userData);
    });
  }
}
module.exports = new AuthController();
