const speechToText = require("../services/speechToText");
const telnyxSend = require("../services/telnyxSend");
const axios = require("axios");

//Express middleware for using the Telnyx message object to create logic for calling the appropriate features

const transcriptionConfig = async (req, res, next) => {
  //Extract all needed variables from req.body.data
  try {
    let {
      data: {
        event_type: eventType,
        payload: {
          from: { phone_number: incomingNumber },
          media: attachments,
          errors: errors,
        },
      },
    } = await req.body;

    //If there are attachments, process with downloading the file
    if (attachments.length != 0 && eventType == "message.received") {
      const [{ content_type: mediaType, url: url }] = attachments;

      //Download attachment to fileLocation using attachment URL
      const response = await axios({
        method: "get",
        url: url,
        responseType: "stream",
      });
      //If attachment is audio, call speech to text
      if (mediaType.includes("audio")) {
        let transcription = await speechToText(response.data);
        await telnyxSend(incomingNumber, transcription);
      }
    }
  } catch (err) {
    throw new Error(err);
  }
  next();
};

module.exports = transcriptionConfig;
