const fs = require("fs").promises;
const axios = require("axios");
const FormData = require("form-data");

require("dotenv").config();

const openAiApiKey = process.env.OPENAI_API_KEY;

const speechToText = async (fileStream) => {
  const form = new FormData();

  form.append("file", fileStream, "speech.mp4");
  form.append("model", "whisper-1");
  form.append("response_format", "json");

  const config = {
    headers: {
      "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
      Authorization: `Bearer ${openAiApiKey}`,
    },
  };

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      form,
      config,
    );
    const transcription = response.data.text;
    console.log(transcription);
  } catch (error) {
    console.log(error);
  }
};

module.exports = speechToText;
