const receive = require("./receive/receive");
const compose = require("./send/compose");
//const send = require("./send/send");
const express = require("express");
const app = express();

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.use("/", receive);
app.use("/", compose);
