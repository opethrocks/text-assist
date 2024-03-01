const Telnyx = require("telnyx");
require("dotenv").config();

const telnyxApiKey = process.env.TELNYX_API_KEY;
const telnyx = Telnyx(telnyxApiKey);

const send = async (incomingNumber, messagePayload, url) => {
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

    if (incomingNumber !== telnyxNumber) {
      //Call Telnyx message creation function if url is provided, pass openai image URL, format text response appropriately
      telnyx.messages.create(
        {
          from: telnyxNumber,
          to: incomingNumber,
          text: messagePayload,
          media_urls: url ? url : "",
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
    return;
  }
};

module.exports = send;
