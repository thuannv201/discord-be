const {verifyToken} = require("../middleware");
const authRouter = require("./auth");
const conversationRouter = require("./conversation/conversation");
const personalRouter = require("./user/personal");
const routes = (app) => {
  app.use("/auth", authRouter);
  app.use("/channel", conversationRouter);
  app.use("/personal", personalRouter);
};
module.exports = routes;
