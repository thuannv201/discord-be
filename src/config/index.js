const mongoose = require("mongoose");
const username = "user";
const password = "123";
const cluster = "cluster0.rifvp";
const dbname = "discordDB";

async function connect() {
  try {
    await mongoose.connect(
      `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`
    );
    console.log("connected database");
  } catch (e) {
    console.log("connect failed");
  }
}
module.exports = {connect};
