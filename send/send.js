const Telnyx = require("telnyx");
const OpenAI = require("openai");
require("dotenv").config();

const apiKey = process.env.TELNYX_API_KEY;
const telnyx = Telnyx(apiKey);
const openai = new OpenAI(process.env.OPENAI_API_KEY);

let send = async (destinationNumber, messageContent, eventType) => {
  try {
    //Retrieve the messaging profile data payload using our Telnyx messaging profile ID.
    const { data: responseObj } = await telnyx.messagingProfiles.retrieve(
      process.env.TELNYX_MSG_PROFILE_ID
    );

    /*Destructuring assignment to extract the object containing the phone number from the Telnyx API response.
    Returns an array of objects containing the phone number associated with the messaging profile.*/
    let {
      data: [{ phone_number: telnyxNumber }],
    } = await responseObj.phone_numbers();

    //If the destinationNumber does not match our telnyxNumber, call the chat function or image generator
    //Also check the message type to prevent double uploads to spaces
    if (destinationNumber != telnyxNumber && eventType === "message.received") {
      //Triggers array of words that indicate a user is a requesting an image
      const triggers = ["image", "photo", "picture", "painting"];
      const generateImage = triggers.some((item) =>
        messageContent.includes(item)
      );
      //If generateImage is true, call openai images generate.
      if (generateImage) {
        const response = await openai.images.generate({
          model: "dall-e-2",
          prompt: messageContent,
          n: 1,
          size: "512x512",
        });
        //Extract image URL from response object
        const url = [];
        url.push(response.data[0].url);
        //Call Telnyx message creation function, pass openai image URL, format text response appropriately
        telnyx.messages.create(
          {
            from: telnyxNumber,
            to: destinationNumber,
            text: `Here is your ${messageContent.slice(
              messageContent.indexOf(
                triggers.find((word) => messageContent.includes(word))
              ),
              messageContent.length - 1
            )}`,
            media_urls: url,
          },
          function (err) {
            if (err) {
              throw new Error(err);
            }
          }
        );
      } else {
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
          }
        );
      }
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = send;
