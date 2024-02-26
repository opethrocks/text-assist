const axios = require("axios");
const FormData = require("form-data");

require("dotenv").config();

const openAiApiKey = process.env.OPENAI_API_KEY;

const speechToText = async (fileStream) => {
  const form = new FormData();

  form.append("file", fileStream, "speech.mp4");
  form.append("model", "whisper-1");
  form.append("response_format", "json");
  form.append("prompt", "If audio is not English, translate to English")

  const config = {
    headers: {
      "Content-Type": `multipart/form-data; boundary=${form._boundary}`,
      Authorization: `Bearer ${openAiApiKey}`,
    },
  };

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/audio/translations",
      form,
      config,
    );
    transcription = response.data.text;
    return transcription;
  } catch (error) {
    console.log(error);
  }
};

module.exports = speechToText;
