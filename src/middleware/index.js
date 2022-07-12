const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const UserModel = require("../models/userModels")
const {sendFailMessage} = require("../utils")
dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")?.[1];
  if (!token) {
    res.sendStatus(401);
    console.log("object");
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_JWT_KEY, (err, data) => {
      if(err) res.sendStatus(401)
      if(data) next()
    });
  }
};

const verifyUser = (req,res,next)=>{
  const received = req.body
  console.log('received :', received);
  UserModel.findOne({username:received.username}).then(data=>{
  if(!data) {
    res.status(404).json(sendFailMessage("User not found"))
  }
  else{
    next()
  }

  }).catch(e=>{
    console.log("error", e)
  })
}

module.exports = {verifyToken, verifyUser};
