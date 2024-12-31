const OpenAI = require("openai");
const send = require("../sms/send");
const completions = require("../services/completions");

const openAiApiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI(openAiApiKey);

const imageGenerator = async (incomingNumber, formattedMessage) => {
  try {
    //Call openai images generate.
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
    await send(incomingNumber, `Here is your ${formattedMessage}`, url);
  } catch (err) {
    console.log(err);
  }
};

module.exports = imageGenerator;
