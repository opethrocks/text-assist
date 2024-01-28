const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");
const { S3, PutObjectCommand } = require("@aws-sdk/client-s3");

const mediaHandler = async (url, incomingNumber, formattedMessage, msgID) => {
  url = url.toString();
  //Create new instance of S3 client using Digital Ocean Spaces API (AWS)
  const s3Client = new S3({
    endpoint: process.env.SPACES_ENDPOINT,
    forcePathStyle: false,
    region: "us-east-1",
    credentials: {
      accessKeyId: "DO00EXUUYXNLDZRLK6ZX",
      secretAccessKey: process.env.SPACES_ACCESS_KEY,
    },
  });
  //If there is attachment on incoming message, get URL from attachment array
  //Create a file path and save to fileLocation variable
  const fileLocation = path.resolve(__dirname, formattedMessage ? formattedMessage : msgID);

  //Download attachment to fileLocation using attachment URL
  try {
    const response = await axios({
      method: "get",
      url: url,
      responseType: "stream",
    });
    await fs.writeFile(fileLocation, response.data);
  } catch (err) {
    throw new Error(err);
  }

  //Only upload attachments on the message finalized event from Telnyx response object
  //Upload will run whether there is attachment on incoming message or if media is requested from AI
  //Format destination in spaces by incoming number, name file by message ID
  try {
    fileStream = await fs.readFile(fileLocation);

    const params = {
      Bucket: "assistext",
      Key: `attachments/${incomingNumber}/${formattedMessage ? formattedMessage : msgID}.png`,
      Body: fileStream,
      ACL: "private",
      Metadata: {
        message_id: msgID,
      },
    };
    const data = await s3Client.send(new PutObjectCommand(params));
    console.log(
      "Successfully uploaded object: " + params.Bucket + "/" + params.Key
    );
    await fs.rm(fileLocation);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports = mediaHandler;
