const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const UserModel = require("../models/userModels");
const {sendFailMessage} = require("../utils");
dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")?.[1];
  if (!token) {
    res.sendStatus(401);
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_JWT_KEY, (err, data) => {
      if (err) res.sendStatus(403);
      if (data) next();
    });
  }
};

const verifyUser = (req, res, next) => {
  const received = req.body;
  UserModel.findOne({username: received.username})
    .then((data) => {
      if (!data) {
        res.status(404).json(sendFailMessage("User not found"));
      } else {
        if (data.password == received?.password) {
          res.locals.tokenPayload = {
            username: data.username,
            password: data.password,
            role: data.role,
            isActive: data.isActive,
            updatedAt: data.updatedAt,
          };
          next();
        } else {
          res.status(201).json(sendFailMessage("Password incorrect"));
        }
      }
    })
    .catch((e) => {
      console.log("error", e);
    });
};

module.exports = {verifyToken, verifyUser};
