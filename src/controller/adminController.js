const md5 = require("md5");
const UserModel = require("../models/allUserModel");
const resp = require("../utility/httpResponse");
const jwt = require("jsonwebtoken");

const getUserById = async (req, res) => {
  try {
    if (req.userData.role !== "admin") return resp.unauthorized(res);

    const user = await UserModel.findById(req.params.userId).select(
      "-password -accessToken"
    );

    if (!user) {
      return resp.fail(res, "Somting Error!");
    }

    return resp.successOk(res, "User Get Successfully!", user);
  } catch (error) {
    return resp.unknown(res, error.message);
  }
};

const getAllUser = async (req, res) => {
  try {
    const userData = req.userData;

    if (userData.role != "admin") return resp.unauthorized(res);

    const user = (await UserModel.find()).filter(
      (item) => item.role !== "admin"
    );

    return resp.successOk(res, "User Get Successfully!", user);
  } catch (error) {
    return resp.unknown(res, error.message);
  }
};

const updateUser = async (req, res) => {
  try {
    if (req.userData.role !== "admin") return resp.unauthorized(res);

    const userData = await UserModel.findByIdAndUpdate(
      req.params.userId,
      req.body,
      {
        new: true,
      }
    )
      .select("-password -accessToken")
      .lean(true);

    if (!userData) {
      return resp.notFound(res, "user not found!");
    }

    return resp.successOk(res, "User Upadated Successfully!", userData);
  } catch (error) {
    return resp.unknown(res, error.message);
  }
};

const userChangePassword = async (req, res) => {
  try {
    if (req.userData.role !== "admin") return resp.unauthorized(res);

    let userData = await UserModel.findById(req.params.userId);

    if (userData.password === md5(req.body.newPassword)) {
      return resp.fail(res, "Don't Use Old Password!");
    }

    req.body.password = md5(req.body.newPassword);

    userData = await UserModel.findByIdAndUpdate(
      req.params.userId,
      {
        password: req.body.password,
      },
      {
        new: true,
      }
    )
      .select("-password -accessToken")
      .lean(true);

    return resp.successOk(res, "Password Updated Successfully!", userData);
  } catch (error) {
    return resp.unknown(res, error.message);
  }
};

const deleteUser = async (req, res) => {
  try {
    if (req.userData.role !== "admin") return resp.unauthorized(res);

    let user = await UserModel.findById(req.params.userId);

    if (!user) {
      return resp.notFound(res, "User Not Exists!");
    }

    await UserModel.findByIdAndDelete(user.id);

    return resp.successOk(res, "User Deleted Successfully!");
  } catch (error) {
    return resp.unknown(res, error.message);
  }
};

module.exports = {
  getUserById,
  getAllUser,
  updateUser,
  userChangePassword,
  deleteUser,
};
