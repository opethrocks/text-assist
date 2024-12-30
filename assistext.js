const receive = require("./sms/receive");
const express = require("express");

const app = express();

require("dotenv").config({ path: __dirname + "/.env" });

app.use("/", receive);

app.listen(process.env.TELNYX_APP_PORT, () =>
  console.log(`App running on port ${process.env.TELNYX_APP_PORT}`)
);
