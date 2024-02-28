const OpenAI = require("openai");
const telnyxSend = require("../sms/send");
const completions = require("../services/completions");


const openAiApiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI(openAiApiKey);

const imageGenerator = async (messageContent, incomingNumber) => {
   //Triggers array of words that indicate a user is a requesting an image
   const triggers = ["image", "photo", "picture", "painting"];
   const generateImage = triggers.some((item) => messageContent.includes(item));
 
   //Remove punctuation from message content and format string for naming the file for storage
   const punctuationRegex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
  const formattedMessage = messageContent
  .replace(punctuationRegex, "")

  .slice(
    messageContent.indexOf(
      triggers.find((word) => messageContent.includes(word)),
    ),
  );
  //Also check the message type to prevent double uploads to spaces
  //If generateImage is true, call openai images generate.
  if (generateImage) {
    const url = [];
    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt: formattedMessage,
      n: 1,
      size: "512x512",
    });

    //Extract image URL from response object
    url.push(await response.data[0].url);
    //Call telnyx send to deliver the ai response via MMS
    await telnyxSend(incomingNumber, formattedMessage, url);
  } else {
    //If an image is not being requested, call the completions service
    await completions(messageContent, incomingNumber)
  }
};

module.exports = imageGenerator;
