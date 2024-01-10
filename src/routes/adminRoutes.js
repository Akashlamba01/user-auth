const { celebrate, Joi } = require("celebrate");
const express = require("express");
const router = express.Router();
const commenController = require("../controller/commenController");
const { verifyToken } = require("../config/middleware");
const adminController = require("../controller/adminController");

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
      role: Joi.string().default("admin"),
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

router.post(
  "/userProfile/upload/:userId",
  verifyToken,
  commenController.imgUpload
);

router.get("/getAllUser", verifyToken, adminController.getAllUser);

router.get("/getUser/:userId", verifyToken, adminController.getUserById);

router.post(
  "/userUpdate/:userId",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().lowercase().email().optional(),
      name: Joi.string().lowercase().optional(),
      // password: Joi.string()
      //   .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{6,16}$"))
      //   // .required()
      //   .min(8),
      // confirmPassword: Joi.ref("password"),
      mobileNumber: Joi.string().optional(),
    }),
  }),
  verifyToken,
  adminController.updateUser
);

router.post(
  "/userChangePassword/:userId",
  celebrate({
    body: Joi.object().keys({
      // email: Joi.string().lowercase().email().optional(),
      // name: Joi.string().lowercase().optional(),
      newPassword: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9!@#$%^&*]{6,16}$"))
        .required()
        .min(8),
      confirmPassword: Joi.ref("newPassword"),
    }),
  }),
  verifyToken,
  adminController.userChangePassword
);

router.post("/userDelete/:userId", verifyToken, adminController.deleteUser);

module.exports = router;
