const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const UserModel = require("../models/userModels");
dotenv.config();
const EXPIRES_TIME = "2m";
const bcrypt = require("bcrypt");
const { sendSuccessMessage, sendFailMessage } = require("../utils");
const saltRounds = 10;

class LoginController {
  resolveLogin(req, res) {
    const data = res.locals.tokenPayload;

    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_JWT_KEY, {
      expiresIn: EXPIRES_TIME,
    });
    const refToken = jwt.sign(data, process.env.REFRESH_TOKEN_JWT_KEY, {
      expiresIn: EXPIRES_TIME,
    });
    res.send({ accessToken, status: "success", refToken });
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
          { username },
          process.env.ACCESS_TOKEN_JWT_KEY,
          { expiresIn: EXPIRES_TIME }
        );
        res.send({ accessToken: newToken, username: username });
      }
    });
  }

  register(req, res) {
    const received = req.body;
    bcrypt.genSalt(saltRounds, function (err, salt) {
      bcrypt.hash(received.password, salt).then((hash) => {
        received.password = hash;
        UserModel.create({ ...received })
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

  test(req, res) {
    UserModel.find({}).then((users) => {
      const userData = users.map((data) => {
        return { id: data._id, username: data.username, role: data.role };
      });
      res.send(userData);
    });
  }
}
module.exports = new LoginController();
