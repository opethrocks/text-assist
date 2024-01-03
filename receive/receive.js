const express = require("express");
const bodyParser = require("body-parser");
const Telnyx = require("telnyx");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());

const apiKey = process.env.TELNYX_API_KEY;
const publicKey = process.env.TELNYX_PUBLIC_KEY;

const telnyx = Telnyx(apiKey);

app.post("/", (req, res) => {
  const timeToleranceInSeconds = 300; // Will validate signatures of webhooks up to 5 minutes after Telnyx sent the request
  const webhookTelnyxSignatureHeader = req.header("telnyx-signature-ed25519");
  const webhookTelnyxTimestampHeader = req.header("telnyx-timestamp");
  const webhookRawBody = JSON.stringify(req.body, null, 2);

  //Destructure the errors array from req.body
  let {
    data: {
      payload: { errors: errors },
    },
  } = req.body;

  try {
    telnyx.webhooks.signature.verifySignature(
      webhookRawBody,
      webhookTelnyxSignatureHeader,
      webhookTelnyxTimestampHeader,
      publicKey,
      timeToleranceInSeconds,
    );
  } catch (e) {
    errors.push(e.message);
  }

  //If errors array is empty, send successful response and destructre phoneNumber and msgBody from req.body
  if (errors.length == 0) {
    res.sendStatus(200);
    let {
      data: {
        payload: {
          from: { phone_number: phoneNumber },
        },
      },
    } = req.body;
    let {
      data: {
        payload: { text: msgBody },
      },
    } = req.body;
    //Log the sender phone number and message body to the console
    console.log(`New message from: ${phoneNumber.slice(2, 12)}`);
    console.log(`Message content: ${msgBody}`);
  } else {
    //If there are errors on the request, send error code and log errors to the console.
    res.sendStatus(500);
    console.log(errors);
    return;
  }
});

const port = 8080;
app.listen(port, () => console.log(`App running on port ${port}`));

module.exports = app;
