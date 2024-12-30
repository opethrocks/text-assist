const OpenAI = require("openai");
const send = require("../sms/send");

const openAiApiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI(openAiApiKey);

let conversationHistory = [];

const completions = async (messageContent, incomingNumber) => {
  conversationHistory.push({
    role: `${conversationHistory.length == 0 ? "developer" : "user"}`,
    content: messageContent,
  });

  //OpenAI API call. Pass received messageContent to the OpenAI messages array with a user role
  const completion = await openai.chat.completions.create({
    messages: [...conversationHistory],
    model: "gpt-4o-mini",
  });
  const messagePayload = completion.choices[0].message.content;

  //Call telnyx send and pass ai response & incoming phone number
  await send(incomingNumber, messagePayload);
};

module.exports = completions;
