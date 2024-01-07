const Telnyx = require("telnyx");
require("dotenv").config();

const apiKey = process.env.TELNYX_API_KEY;
const telnyx = Telnyx(apiKey);

let compose = async (destinationNumber, messageContent) => {
  try {
    //Retrieve the messaging profile data payload using our Telnyx messaging profile ID.
    const { data: responseObj } = await telnyx.messagingProfiles.retrieve(
      process.env.TELNYX_MSG_PROFILE_ID
    );

    //Destructuring assignment to extract the object containing the phone number from the API response.
    //Returns an array of objects containing the phone number associated with the messaging profile.
    let {
      data: [{ phone_number: telnyxNumber }],
    } = await responseObj.phone_numbers();

    //If the messageContent matches a certain pattern, use the Telnyx SDK to send a reply
    if (messageContent == "hello" && destinationNumber != telnyxNumber) {
      telnyx.messages.create(
        {
          from: telnyxNumber,
          to: destinationNumber,
          text: "Hi there! How are you?",
        },
        function (err, response) {
          if (err) {
            throw new Error(response);
          }
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = compose;
