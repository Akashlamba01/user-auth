const { celebrate, Joi } = require("celebrate");
const express = require("express");
const router = express.Router();
const commenController = require("../controller/commenController");
const { verifyToken, imgUpload } = require("../config/middleware");
const {
  getUser,
  updateUser,
  deleteUser,
  changePassword,
} = require("../controller/userController");

router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().lowercase().email().optional(),
      name: Joi.string().lowercase().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{6,16}$"))
        .required()
        .min(8),
      confirmPassword: Joi.ref("password"),
      role: Joi.string().default("user"),
      mobileNumber: Joi.string().optional(),
    }),
  }),
  commenController.signup
);

router.post(
  "/login",
  celebrate({
    body: Joi.object().keys({
      input: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  commenController.login
);

router.post("/upload", verifyToken, commenController.imgUpload);

router.get("/getUser", verifyToken, getUser);

router.post(
  "/update",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().lowercase().email().optional(),
      name: Joi.string().lowercase().optional(),
      // password: Joi.string()
      //   .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{6,16}$"))
      //   .required()
      //   .min(8),
      // confirmPassword: Joi.ref("password"),
      role: Joi.string().default("user"),
      mobileNumber: Joi.string().optional(),
    }),
  }),
  verifyToken,
  updateUser
);

router.post(
  "/changePassword",
  celebrate({
    body: Joi.object().keys({
      // email: Joi.string().lowercase().email().optional(),
      // name: Joi.string().lowercase().optional(),
      oldPassword: Joi.string().required(),
      newPassword: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{6,16}$"))
        .required()
        .min(8),
      confirmPassword: Joi.ref("newPassword"),
    }),
  }),
  verifyToken,
  changePassword
);

router.post("/delete", verifyToken, deleteUser);

module.exports = router;
