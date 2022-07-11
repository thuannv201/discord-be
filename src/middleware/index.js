const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")?.[1];
  if (!token) {
    res.sendStatus(401);
    console.log("object");
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_JWT_KEY, (err, data) => {
      console.log(err);
      console.log(data);
    });
  }
};
module.exports = {verifyToken};
