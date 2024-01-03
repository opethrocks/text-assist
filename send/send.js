const Telnyx = require("telnyx");

const apiKey = process.env.TELNYX_API_KEY;
const telnyx = Telnyx(apiKey);

let msgSend = telnyx.messages.create(
  {
    from: "+13373629326", // Your Telnyx number
    to: "+13374966495",
    text: "Hello, World!",
    media_urls: ["https://picsum.photos/500.jpg"],
  },
  function (err, response) {
    // asynchronously called
    console.log(response);
  },
);

module.exports = msgSend
