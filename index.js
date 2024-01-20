const receive = require("./receive/receive");
const express = require("express");
const app = express();

require("dotenv").config();

app.use("/", receive);

app.listen(process.env.TENYX_APP_PORT, () =>
  console.log(`App running on port ${process.env.TENYX_APP_PORT}`)
);
