const receive = require("./receive/receive");
const express = require("express");

const app = express();

require("dotenv").config({path: __dirname + '/.env'});

app.use("/", receive);

app.listen(process.env.TENYX_APP_PORT, () =>
  console.log(`App running on port ${process.env.TENYX_APP_PORT}`)
);
