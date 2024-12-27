const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");
const {
  S3,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const send = require("../sms/send");

const mediaHandler = async (url, incomingNumber, formattedMessage, msgID) => {
  //Create a file path and save to fileLocation variable
  //If no text content was sent, only an image, use the msgID parameter from Telnyx message object as the file name
  const fileLocation = path.resolve(
    __dirname,
    formattedMessage ? formattedMessage : msgID
  );

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
  //Format destination in digital ocean S3 spaces by incoming number, name file by date/time or message content if specified
  try {
    fileStream = await fs.readFile(fileLocation);

    let uploadTime = `${new Date()
      .toLocaleDateString()
      .replace(/\//g, "-")} at ${new Date().toLocaleTimeString()}`;

    const params = {
      Bucket: "assistext",
      Key: `attachments/${incomingNumber}/${
        formattedMessage ? formattedMessage : uploadTime
      }.png`,
      Body: fileStream,
      ACL: "private",
      Metadata: {
        message_id: msgID,
      },
    };

    //Create new instance of S3 client using Digital Ocean Spaces API (AWS)
    const s3Client = new S3({
      endpoint: process.env.SPACES_ENDPOINT,
      forcePathStyle: true,
      region: "us-east-1",
      credentials: {
        accessKeyId: process.env.SPACES_ACCESS_KEY,
        secretAccessKey: process.env.SPACES_SECRET_ACCESS_KEY,
      },
    });

    //Upload file to s3 bucket
    await s3Client.send(new PutObjectCommand(params));

    //Get presigned URL from the file upload request
    const command = new GetObjectCommand(params);
    const preSignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    //Remove local copy of file
    await fs.unlink(fileLocation);

    //Send SMS response of successful upload
    let successMessage = `I stashed that file for you. Here is a temporary URL for download. \n${preSignedUrl}`;
    await send(incomingNumber, successMessage);
  } catch (err) {
    console.log("Error", err);
  }
};

module.exports = mediaHandler;
