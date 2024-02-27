const OpenAI = require("openai");

const openAiApiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI(openAiApiKey);

const imageGenerator = async (generateImage, formattedMessage) => {
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
    url.push(response.data[0].url);

    return url;
  }
};

module.exports = imageGenerator;
