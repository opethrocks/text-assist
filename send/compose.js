const Telnyx = require("telnyx");
require("dotenv").config();

const apiKey = process.env.TELNYX_API_KEY;
const telnyx = Telnyx(apiKey);

let compose = async (toNumber, messageContent) => {
  try {
    //Retrieve the messaging profile data payload using our Telnyx messaging profile ID.
    const { data: responseObj } = await telnyx.messagingProfiles.retrieve(
      process.env.TELNYX_MSG_PROFILE_ID
    );

    //Destructuring assignment to extract the object containing the phone number from the API response.
    //Returns an array of objects containing the phone number associated with the messaging profile.
    let {
      data: [{ phone_number: fromNumber }],
    } = await responseObj.phone_numbers();

    //If the messageContent matches a certain pattern, use the Telnyx SDK to send a reply
    if (messageContent == "hello") {
      telnyx.messages.create(
        { from: fromNumber, to: toNumber, text: "Hi there! How are you?" },
        function (err, response) {
          if (err) {
            throw new Error(response);
          }
        }
      );
    } else {
      telnyx.messages.create(
        {
          from: fromNumber,
          to: toNumber,
          text: "That was not a proper greeting",
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
