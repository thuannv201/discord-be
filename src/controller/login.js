const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
class LoginController {
  postLogin(req, res) {
    const data = req.body;
    const accessToken = jwt.sign(data, process.env.ACCESS_TOKEN_JWT_KEY, {
      expiresIn: "30s",
    });
    res.send({accessToken, status: "success"});
  }
  test(req, res) {
    res.send([{test: "oks"}]);
  }
}
module.exports = new LoginController();
