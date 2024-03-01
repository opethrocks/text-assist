const speechToText = require("../services/speechToText");

const attachmentController = async (attachments, incomingNumber) => {
  const [{ url: url, content_type: mediaType }] = attachments;

  //If attachment is an audio file, call speech to text service
  if (mediaType.includes("audio")) {
    await speechToText(url, incomingNumber);
  }
};

module.exports = attachmentController;
