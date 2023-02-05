const mongoose = require("mongoose");
const username = "hochv";
const password = "4vRMNE59peB1KXxQ";
const cluster = "vcohanee.d7xfkcx";
const dbname = "discordDB";

async function connect() {
  try {
    await mongoose.connect(
      `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/?retryWrites=true&w=majority`
    );
    console.log("connected database");
  } catch (e) {
  console.log('e :', e);
    console.log("connect failed");
  }
}
module.exports = {connect};
