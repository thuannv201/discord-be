const {verifyToken} = require("../middleware");
const authRouter = require("./auth");
const conversationRouter = require("./conversation/conversation");
const routes = (app) => {
  app.use("/auth", authRouter);
  app.use("/channel", verifyToken, conversationRouter);
};
module.exports = routes;
