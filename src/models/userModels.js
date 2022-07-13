const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema(
  {
    username: {type: String, unique: true, default: "", maxlength: 50},
    password: {type: String, default: 123, maxlength: 250},
    role: {type: String, default:"init"},
    isActive: {type: Boolean, default:true},
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Model", User, "user");
