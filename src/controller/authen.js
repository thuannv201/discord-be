const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const UserModel = require("../models/userModels");
const bcrypt = require("bcrypt");
const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");
const EXPIRES_TIME = "2m";
const {sendSuccessMessage, sendFailMessage} = require("../utils");
const saltRounds = 10;
dotenv.config();

// setup nodemailer + handlebars
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hoc17112001@gmail.com",
    pass: "lyzlhqpnhziwxxsz",
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
  from: '"Adebola" <hoc17112001@gmail.com>', // sender address
  to: "hoc17112001@gmail.com", // list of receivers
  subject: "Welcome!",
  template: "emailForgotPw", // the name of the template file i.e email.handlebars
  context: {
    name: "Adebola", // replace {{name}} with Adebola
    company: "My Company", // replace {{company}} with My Company
  },
};

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

  refreshToken(req, res) {
    const token = req.body.token;
    if (!token) res.sendStatus(401);
    jwt.verify(token, process.env.REFRESH_TOKEN_JWT_KEY, (err, data) => {
      if (err) {
        res.sendStatus(403);
      }
      if (data?.username) {
        const username = data.username;
        const newToken = jwt.sign(
          {username},
          process.env.ACCESS_TOKEN_JWT_KEY,
          {expiresIn: EXPIRES_TIME}
        );
        res.send({accessToken: newToken, username: username});
      }
    });
  }

  register(req, res) {
    const received = req.body;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(received.password, salt).then((hash) => {
        received.password = hash;
        UserModel.create({...received})
          .then((data) => {
            res.send(sendSuccessMessage("Register successfully!"));
          })
          .catch((err) => {
            res
              .status(201)
              .send(
                sendFailMessage("Register Failed!", {}, err.code, "username")
              );
          });
      });
    });
  }

  forgotPW(req, res) {
    const {username} = req.body;
    UserModel.findOne({username: username}).then((data) => {
      if (!data) res.status(200).send(sendFailMessage("User not found"));
      if (data) {
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: " + info.response);
        });
      }
    });
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
