const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/authAssignment")
  .then(() => {
    console.log("connection connected!");
  })
  .catch((e) => {
    console.log("not connect: ", e);
  });
