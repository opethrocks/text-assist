const Telnyx = require("telnyx");
require("dotenv").config();

const telnyxApiKey = process.env.TELNYX_API_KEY;
const openAiApiKey = process.env.OPENAI_API_KEY;

const telnyx = Telnyx(telnyxApiKey);

const telnyxSend = async (incomingNumber, messagePayload) => {
  //Retrieve the messaging profile data payload using our Telnyx messaging profile ID.
  const { data: responseObj } = await telnyx.messagingProfiles.retrieve(
    process.env.TELNYX_MSG_PROFILE_ID,
  );

  /*Destructuring assignment to extract the object containing the phone number from the Telnyx API response.
      Returns an array of objects containing the phone number associated with the messaging profile.*/
  let {
    data: [{ phone_number: telnyxNumber }],
  } = await responseObj.phone_numbers();

  //Telnyx SMS message creation. The message text will be the AI response found in the competion object.
  telnyx.messages.create(
    {
      from: telnyxNumber,
      to: incomingNumber,
      text: messagePayload,
    },
    function (err) {
      if (err) {
        throw new Error(err);
      }
    },
  );
};

module.exports = telnyxSend;
