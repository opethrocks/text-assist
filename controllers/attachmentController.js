const speechToText = require("../services/speechToText");
const mediaController = require("../controllers/mediaController");

const attachmentController = async (
  attachments,
  incomingNumber,
  formattedMessage,
  msgID
) => {
  const [{ url: url, content_type: mediaType }] = attachments;

  //If attachment is an audio file, call speech to text service
  mediaType.includes("audio")
    ? await speechToText(url, incomingNumber)
    : await mediaController(url, incomingNumber, formattedMessage, msgID);
};

module.exports = attachmentController;
