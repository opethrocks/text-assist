const OpenAI = require("openai");
const telnyxSend = require("../services/telnyxSend");

const openAiApiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI(openAiApiKey);

const completions = async (messageContent, incomingNumber) => {
  //OpenAI API call. Pass received messageContent to the OpenAI messages array with a user role
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: messageContent },
    ],
    model: "gpt-3.5-turbo",
  });
  //Call telnyx send and pass ai response & incoming phone number
  await telnyxSend(incomingNumber, completion.choices[0].message.content);
};

module.exports = completions;
