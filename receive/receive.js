const express = require("express");
const bodyParser = require("body-parser");
const Telnyx = require("telnyx");
const send = require("../send/send");
const mediaHandler = require("../media/media");

const receive = express();
receive.use(bodyParser.json());

const apiKey = process.env.TELNYX_API_KEY;
const publicKey = process.env.TELNYX_PUBLIC_KEY;

const telnyx = Telnyx(apiKey);

receive.post("/", async (req, res) => {
  const timeToleranceInSeconds = 300; // Will validate signatures of webhooks up to 5 minutes after Telnyx sent the request
  const webhookTelnyxSignatureHeader = req.header("telnyx-signature-ed25519");
  const webhookTelnyxTimestampHeader = req.header("telnyx-timestamp");
  const webhookRawBody = JSON.stringify(req.body, null, 2);

  //Destructure the errors array from req.body
  let {
    data: {
      payload: { errors: errors, media: attachments },
    },
  } = req.body;

  /*Use the telnyx SDK to verify the signature found in the header.
  If errors add them to errors array and throw*/
  try {
    telnyx.webhooks.signature.verifySignature(
      webhookRawBody,
      webhookTelnyxSignatureHeader,
      webhookTelnyxTimestampHeader,
      publicKey,
      timeToleranceInSeconds
    );
  } catch (e) {
    errors.push(e.message);
    throw new Error(errors);
  }

  //If errors array is empty, send successful response and destructre phoneNumber and msgBody from req.body
  if (errors.length === 0) {
    res.sendStatus(200);
    let {
      data: {
        event_type: eventType,
        id: msgID,
        payload: {
          from: { phone_number: incomingNumber },
          text: messageContent,
        },
      },
    } = req.body;

    //Triggers array of words that indicate a user is a requesting an image
    const triggers = ["image", "photo", "picture", "painting"];
    const generateImage = triggers.some((item) =>
      messageContent.includes(item)
    );
    //Remove punctuation from message content and format string for naming the file for storage
    const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    const formattedMessage = messageContent
      .replace(regex, "")
      .slice(
        messageContent.indexOf(
          triggers.find((word) => messageContent.includes(word))
        )
      );

    if (attachments.length != 0 && eventType == "message.received") {
      const url = attachments.map((attachment) => {
        return attachment.url;
      });
      await mediaHandler(url, incomingNumber, formattedMessage, msgID);
    } else if (eventType === "message.received") {
      //Call the send module and pass the sender phone number and message text so a reply can be sent.
      await send(
        incomingNumber,
        messageContent,
        formattedMessage,
        msgID,
        generateImage
      );
    }
  } else {
    //If there are errors on the request, send error code and log errors to the console.
    res.sendStatus(500);
    console.log(errors);
  }
});

module.exports = receive;
