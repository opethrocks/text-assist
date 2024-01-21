const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");
const { S3, PutObjectCommand } = require("@aws-sdk/client-s3");

const uploadFile = async (filePath) => {
  const s3Client = new S3({
    endpoint: process.env.SPACES_ENDPOINT,
    forcePathStyle: false,
    region: "us-east-1",
    credentials: {
      accessKeyId: "DO00EXUUYXNLDZRLK6ZX",
      secretAccessKey: process.env.SPACES_ACCESS_KEY,
    },
  });

  try {
    fileStream = await fs.readFile(filePath);
    const params = {
      Bucket: "assistext",
      Key: "attachments/test",
      Body: fileStream,
      ACL: "private",
      Metadata: {
        "x-amz-meta-my-key": "your-value",
      },
    };
    const data = await s3Client.send(new PutObjectCommand(params));
    console.log(
      "Successfully uploaded object: " + params.Bucket + "/" + params.Key
    );
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

const downloadFile = async (url) => {
  const fileLocation = path.resolve(
    __dirname,
    url.substring(url.lastIndexOf("/") + 1)
  );

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
  uploadFile(fileLocation);
};

module.exports = downloadFile;
