const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    accessToken: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
    },
    mobileNumber: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    profileImg: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("user", userSchema);
module.exports = UserModel;
