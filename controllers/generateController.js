const imageGenerator = require("../services/imageGenerator");
const completions = require("../services/completions");

const generateController = async (messageContent, incomingNumber) => {
  //Triggers array of words that indicate a user is a requesting an image
  const triggers = ["image", "photo", "picture", "painting"];
  const generateImage = triggers.some((item) => messageContent.includes(item));

  //Remove punctuation from message content and format string for naming the file for storage
  const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
  const formattedMessage = messageContent
    .replace(punctuationRegex, "")
    .slice(
      messageContent.indexOf(
        triggers.find((word) => messageContent.includes(word))
      )
    );

  //If image generation is being requested, call image generator, otherwise call completions
  if (generateImage) {
    await imageGenerator(incomingNumber, formattedMessage);
  } else {
    await completions(messageContent, incomingNumber);
  }
};

module.exports = generateController;
