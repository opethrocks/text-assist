const express = require("express");
const bodyParser = require("body-parser");
const Telnyx = require("telnyx");
const imageGenerator = require("../services/imageGenerator");
const speechToText = require("../services/speechToText");

const apiKey = process.env.TELNYX_API_KEY;
const publicKey = process.env.TELNYX_PUBLIC_KEY;
const telnyx = Telnyx(apiKey);

const receive = express();
receive.use(bodyParser.json());

receive.post("/", async (req, res) => {
  const timeToleranceInSeconds = 300; // Will validate signatures of webhooks up to 5 minutes after Telnyx sent the request
  const webhookTelnyxSignatureHeader = req.header("telnyx-signature-ed25519");
  const webhookTelnyxTimestampHeader = req.header("telnyx-timestamp");
  const webhookRawBody = JSON.stringify(req.body, null, 2);

  //Destructure the message object array from req.body
  let {
    data: {
      event_type: eventType,
      payload: {
        from: { phone_number: incomingNumber },
        media: attachments,
        errors: errors,
        text: messageContent,
      },
    },
  } = await req.body;

  /*Use the telnyx SDK to verify the signature found in the header.
  If errors add them to errors array and throw*/
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
    console.log(errors);
  }

  //If errors array is empty, send successful response
  //If there are errors on the request, send error code
  errors.length === 0 ? res.sendStatus(200) : res.sendStatus(500);

  //Simple conditions to decide which feature is being requested
  if (eventType === "message.received") {
    attachments.length === 0
      ? imageGenerator(messageContent, incomingNumber)
      : speechToText(attachments, incomingNumber);
  }
});

module.exports = receive;
