const receive = require("./receive/receive");
const express = require("express");
const app = express();

require("dotenv").config();

app.use("/", receive);