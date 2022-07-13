const express = require("express");
const db = require("./config");
const routes = require("./routes");
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
db.connect();
routes(app);

app.listen(4508,"0.0.0.0", () => {
  console.log("listening on localhost:4508");
});
