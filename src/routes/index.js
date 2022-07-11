const loginRouter = require("./login");
const routes = (app) => {
  app.use("/login", loginRouter);
};
module.exports = routes;
