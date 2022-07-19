const express = require("express");
const db = require("./config");
const cors = require("cors");
const routes = require("./routes");
const app = express();
app.use(
  // yarn add cors
  cors({
    origin: true,
    credentials: true,
    preflightContinue: false,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);
app.options("*", cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const PORT = process.env.PORT || 4508
db.connect();
routes(app);

app.listen(PORT,"0.0.0.0", () => {
  console.log("listening on localhost:4508");
});
