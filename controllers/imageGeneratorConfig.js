const imageGenerator = require("../services/imageGenerator");
const telnyxSend = require("../services/telnyxSend");
const axios = require("axios");

const imageGeneratorConfig = async (req, res, next) => {
  try {
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

    //Triggers array of words that indicate a user is a requesting an image
    const triggers = ["image", "photo", "picture", "painting"];
    const generateImage = triggers.some((item) =>
      messageContent.includes(item),
    );
    //Remove punctuation from message content and format string for naming the file for storage
    const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
    const formattedMessage = messageContent
      .replace(punctuationRegex, "")

      .slice(
        messageContent.indexOf(
          triggers.find((word) => messageContent.includes(word)),
        ),
      );
    const url = await imageGenerator(generateImage, formattedMessage);

    await telnyxSend(incomingNumber, formattedMessage, url);
  } catch (err) {
    console.log(err);
    return;
  }
  next();
};

module.exports = imageGeneratorConfig;
