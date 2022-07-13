const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const UserModel = require("../models/userModels");
const bcrypt = require("bcrypt");
const { sendFailMessage } = require("../utils");
dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")?.[1];
  if (!token) {
    res.sendStatus(401);
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_JWT_KEY, (err, data) => {
      if (err) res.sendStatus(401);
      if (data) next();
    });
  }
};

const verifyUser = (req, res, next) => {
  const received = req.body;
  UserModel.findOne({ username: received.username })
    .then((data) => {
      if (!data) {
        res.status(404).json(sendFailMessage("User not found"));
      } else {
        bcrypt.compare(
          received.password,
          data.password,
          function (err, result) {
            if (result) {
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
        );
      }
    })
    .catch((e) => {
      console.log("error", e);
    });
};

function validateUsername(req,res,next){
  const {username} = req.body
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  const iUsernameValid = usernameRegex.test(username)
  if(!iUsernameValid) res.status(201).send(sendFailMessage("Username is not valid !"))
  if(iUsernameValid) next()
}

module.exports = { verifyToken, verifyUser, validateUsername };
