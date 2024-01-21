const Telnyx = require("telnyx");
const OpenAI = require("openai");
require("dotenv").config();

const apiKey = process.env.TELNYX_API_KEY;
const telnyx = Telnyx(apiKey);
const openai = new OpenAI(process.env.OPENAI_API_KEY);

let send = async (destinationNumber, messageContent) => {
  try {
    //Retrieve the messaging profile data payload using our Telnyx messaging profile ID.
    const { data: responseObj } = await telnyx.messagingProfiles.retrieve(
      process.env.TELNYX_MSG_PROFILE_ID,
    );

    /*Destructuring assignment to extract the object containing the phone number from the Telnyx API response.
    Returns an array of objects containing the phone number associated with the messaging profile.*/
    let {
      data: [{ phone_number: telnyxNumber }],
    } = await responseObj.phone_numbers();

    //If the destinationNumber does not match our telnyxNumber, call the chat function
    if (destinationNumber != telnyxNumber) {
      //OpenAI API call. Pass received messageContent to the OpenAI messages array with a user role
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: messageContent },
        ],
        model: "gpt-3.5-turbo",
      });
      //Telnyx SMS message creation. The message text will be the AI response found in the competion object.
      telnyx.messages.create(
        {
          from: telnyxNumber,
          to: destinationNumber,
          text: completion.choices[0].message.content,
        },
        function (err) {
          if (err) {
            throw new Error(err);
          }
        },
      );
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = send;
