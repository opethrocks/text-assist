const OpenAI = require("openai");
const fs = require("fs").promises;
const path = require("path");
const send = require("../sms/send");

const openAiApiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI(openAiApiKey);

const speechFile = path.resolve("./speech.mp3");

const textToSpeech = async (messageContent, incomingNumber) => {
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: messageContent,
    });
    const buffer = Buffer.from(await mp3.arrayBuffer());
    await fs.promises.writeFile(speechFile, buffer);
  } catch (err) {
    console.log(err);
  }
};

module.exports = textToSpeech;
