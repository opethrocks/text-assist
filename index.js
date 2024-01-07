const receive = require("./receive/receive");
const compose = require("./send/compose");
const express = require("express");
const app = express();

require("dotenv").config();

app.use("/", receive);
app.use("/", compose);
