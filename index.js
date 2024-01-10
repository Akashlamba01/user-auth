const express = require("express");
require("./src/config/connection");
const bodyParser = require("body-parser");
const { errors } = require("celebrate");

const PORT = 3001;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/v1", require("./src/routes"));
app.use(errors());

app.listen(PORT, () => {
  console.log("server is running");
});
