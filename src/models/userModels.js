const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: {type: String, unique: true, default: "", maxlength: 50},
    password: {type: String, default: 123, maxlength: 50},
    role: {type: String},
    isActive: {type: Boolean},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Model", User, "user");
