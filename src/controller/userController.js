const md5 = require("md5");
const UserModel = require("../models/allUserModel");
const resp = require("../utility/httpResponse");
const jwt = require("jsonwebtoken");

const getUser = async (req, res) => {
  try {
    const userData = req.userData;
    const user = await UserModel.findById(userData.id).select("-password");

    if (!user) {
      return resp.fail(res, "Somting Error!");
    }

    return resp.successOk(res, "User Get Successfully!", user);
  } catch (error) {
    return resp.unknown(res, error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = req.userData;

    const userData = await UserModel.findByIdAndUpdate(user.id, req.body, {
      new: true,
    });

    if (!userData) {
      return resp.notFound(res, "user not found!");
    }

    const signData = {
      name: userData.name,
      email: userData.email,
      mobileNumber: userData.mobileNumber,
      profileImg: userData.profileImg,
      role: userData.role,
    };

    req.body.accessToken = jwt.sign({ signData }, "supersecret");

    let data = await UserModel.findByIdAndUpdate(
      userData.id,
      { accessToken: req.body.accessToken },
      { new: true }
    ).select("-password");

    return resp.successOk(res, "User Upadated Successfully!", data);
  } catch (error) {
    return resp.unknown(res, error.message);
  }
};

const changePassword = async (req, res) => {
  try {
    const user = req.userData;
    let userData = await UserModel.findById(user.id);

    const signData = {
      name: userData.name,
      email: userData.email,
      mobileNumber: userData.mobileNumber,
      profileImg: userData.profileImg,
      role: userData.role,
    };

    if (userData.password !== md5(req.body.oldPassword)) {
      return resp.unknown(res, "Invalid Credentials!");
    }

    if (req.body.oldPassword === req.body.newPassword) {
      return resp.fail(res, "Don't Use Old Password!");
    }

    req.body.accessToken = jwt.sign({ signData }, "supersecret");
    req.body.password = md5(req.body.newPassword);

    userData = await UserModel.findByIdAndUpdate(
      user.id,
      {
        password: req.body.password,
        accessToken: req.body.accessToken,
      },
      {
        new: true,
      }
    ).select("-password");

    return resp.successOk(res, "Password Updated Successfully!", userData);
  } catch (error) {
    return resp.unknown(res, error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    let user = await UserModel.findById(req.userData.id);

    if (!user) {
      return resp.fail(res, "Somting Error!");
    }

    await UserModel.findByIdAndDelete(user.id);

    return resp.successOk(res, "User Deleted Successfully!");
  } catch (error) {
    return resp.unknown(res, error.message);
  }
};

module.exports = {
  // login,
  getUser,
  updateUser,
  deleteUser,
  changePassword,
};
