const express = require("express");
const db = require("./config");
const userModels = require("./models/userModels");
const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
db.connect();
app.get("/test", (req, res) => {
  userModels
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.listen(4508, () => {
  console.log("listening on localhost:4508");
});
