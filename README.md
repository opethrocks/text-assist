Leverages the Telnyx API/Node SDK to create an AI Assistant that can communicate via SMS. 

Uses OpenAI Chat Completions with GPT 3.5 Turbo to reply with robust responses to received messages, all via SMS.

Now includes MMS support for requesting images via OpenAI DALL-E 2. Just ask for a photo, painting or picture and your assistant has you covered!

Also supports transcriptions and translations to English thanks to the Whisper API. Just send an audio file to assistant and quickly receive transcriptions via SMS.

If an attachment is sent to your assistant, it will be stored in your very own folder using the Digital Ocean Spaces / AWS S3 API.


Will translate spoken audio from many languages to English. An example speech given in German translated to English:

![image](https://github.com/opethrocks/text-assist/assets/2834141/e67a0d32-4209-48e8-badf-3bbaf2ddd3bf)

![image](https://github.com/opethrocks/text-assist/assets/2834141/ee3574b5-555e-4346-b5db-5510a30d22c0)

![image](https://github.com/opethrocks/text-assist/assets/2834141/09781a87-2eda-4f1f-831f-75aaeeddc205)

![image](https://github.com/opethrocks/text-assist/assets/2834141/704f0b35-672e-45a1-841a-83f9dfee7c55)
