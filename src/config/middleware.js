const User = require("../models/allUserModel");
const jwt = require("jsonwebtoken");
const resp = require("../utility/httpResponse");
const multer = require("multer");
const path = require("path");
const UserModel = require("../models/allUserModel");

const verifyToken = async (req, res, next) => {
  const token = req.header("accessToken");

  // console.log(authHeader);

  if (!token) {
    return resp.unauthorized(res, "Token Not Provided!");
  }

  // if (typeof authHeader === "undefined") {
  //   return res.status(400).json({
  //     message: "Token not provided!",
  //   });
  // }

  // let token = authHeader.split(" ");
  // token = token[1];
  // console.log(token);

  jwt.verify(token, "supersecret", async (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        message: err.message,
        success: false,
      });
    }

    const user = await User.findOne({ accessToken: token });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Token!",
        success: false,
      });
    }

    req.userData = user;
    // console.log(user);
    next();
  });
};

module.exports = {
  verifyToken,
  // imgUpload,
};
