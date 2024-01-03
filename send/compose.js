const telnyx = require("telnyx")(process.env.TELNYX_API_KEY);

//const msgSend = require("./send");

let buildMsg = async () => {
  //Retrieve the messaging profile data payload using our Telnyx messaging profile ID.
  const { data: responseObj } = await telnyx.messagingProfiles.retrieve(
    process.env.TELNYX_MSG_PROFILE_ID,
  );

  //Destructuring assignment to extract the object containing the phone number from the API response.

  let {
    data: [msgProfile],
  } = await responseObj.phone_numbers(); //API call for the phone_numbers method which returns 
  //an array of objects containing the phone number associated with the messaging profile.

  console.log(msgProfile.phone_number);
};

buildMsg();

// let createMsg = telnyx.messages.create(
//   { from: "number", to: "number", text: "message" },
//   function (err, response) {
//     console.log(err);
//   },
// );

module.exports = buildMsg;
