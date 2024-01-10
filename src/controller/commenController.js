const md5 = require("md5");
const UserModel = require("../models/allUserModel");
const resp = require("../utility/httpResponse");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const signup = async (req, res) => {
  try {
    // console.log("file: ", req.body.profileImg);
    // console.log("body", req.body.role);
    if (!req.body.email && !req.body.mobileNumber) {
      return resp.fail(res, "Please Enter a Valid email or Mobile Number!");
    }

    let data = {};
    if (req.body.email || req.body.mobileNumber) {
      if (req.body.email) {
        data = await UserModel.findOne({
          email: req.body.email,
          role: req.body.role,
        });
      } else {
        data = await UserModel.findOne({
          mobileNumber: req.body.mobileNumber,
          role: req.body.role,
        });
      }

      if (data != null) {
        return resp.taken(res, "Data already save!");
      }
    }

    req.body.password = md5(req.body.password);

    const userData = await UserModel.create(req.body);

    return resp.successCreate(res, "Register Successfully!", userData);
  } catch (e) {
    console.log(e);
    return resp.unknown(res, e.message);
  }
};

const login = async (req, res) => {
  try {
    let userData = await UserModel.findOne({
      mobileNumber: req.body.input,
    });

    if (userData == null) {
      userData = await UserModel.findOne({ email: req.body.input });
    }

    if (!userData || userData.password != md5(req.body.password)) {
      return resp.unknown(res, "Invalid Credentials!");
    }

    const signData = {
      name: userData.name,
      email: userData.email,
      mobileNumber: userData.mobileNumber,
      profileImg: userData.profileImg,
      role: userData.role,
    };

    req.body.accessToken = jwt.sign({ signData }, "supersecret");

    const user = await UserModel.findByIdAndUpdate(
      userData.id,
      {
        accessToken: req.body.accessToken,
      },
      {
        new: true,
      }
    )
      .select("-password")
      .lean(true);

    return resp.successOk(res, "Loged In Successfully!", user);
  } catch (error) {
    return resp.unknown(res, error.message);
  }
};

const imgUpload = (req, res) => {
  // console.log("body", req.body);
  const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../uploads"));
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        req.body.url = file.fieldname + "-" + uniqueSuffix + ".jpg";
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
      },
    }),
  });

  upload.single("profileImg")(req, res, async function (err, some) {
    if (err) {
      return resp.fail(res, "Image upload error :" + err.message);
    } else {
      try {
        let user = req.userData;
        if (req.userData.role === "admin" && req.param.userId) {
          user = await UserModel.findById(req.param.userId);
        }

        const url = path.join(__dirname, "../uploads/" + req.body.url);

        const data = await UserModel.findByIdAndUpdate(
          user.id,
          {
            profileImg: url,
          },
          {
            new: true,
          }
        );

        return resp.successOk(res, "File Uploaded Successfully!", data);
      } catch (e) {
        console.log(e);
        return resp.unknown(res, e.message);
      }
    }
  });
};

module.exports = {
  signup,
  login,
  imgUpload,
};
