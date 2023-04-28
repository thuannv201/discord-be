import mongoose = require("mongoose");
const Schema = mongoose.Schema;
import Servers = require("../servers/server"); //imporant
const User = new Schema(
  {
    username: {
      type: String,
      unique: true,
      default: "",
      maxlength: 50,
      validate: {
        validator: function (v: any) {
          return v.length >= 6;
        },
        message: (props: any) => `Must be at least 6, got ${props.value.length}`,
      },
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      validate: {
        validator: function (v: any) {
          const regEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
          return regEmail.test(v);
        },
        message: () => "Invalid email",
      },
      required: [true, "Email is required"],

      unique: true,
    },
    password: {
      type: String,
      validate: {
        validator: function (v: any) {
          return v.length >= 6;
        },
        message: (props: any) => `Must be at least 6, got ${props.value.length}`,
      },
      required: [true, "Password is required"],
    },
    details: {
      type: Schema.Types.ObjectId,
      ref: "User_detail",
    },
    servers: [
      {
        type: Schema.Types.ObjectId,
        ref: "Servers",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Users", User, "user");
