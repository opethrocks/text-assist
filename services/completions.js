const OpenAI = require("openai");
const send = require("../sms/send");

const openAiApiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI(openAiApiKey);

const completions = async (messageContent, incomingNumber) => {
  //OpenAI API call. Pass received messageContent to the OpenAI messages array with a user role
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant. Please limit your response to 1000 characters or less.",
      },
      { role: "user", content: messageContent },
    ],
    model: "gpt-3.5-turbo",
  });
  const messagePayload = completion.choices[0].message.content;

  //Call telnyx send and pass ai response & incoming phone number
  await send(incomingNumber, messagePayload);
};

module.exports = completions;
