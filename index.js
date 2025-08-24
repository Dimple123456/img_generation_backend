// const { GoogleGenAI, Modality } = require("@google/genai");
// const fs = require("fs");

// async function main() {
//   // Initialize with your API key directly in the constructor
//   const ai = new GoogleGenAI({
//     apiKey: "AIzaSyATTaBMxJHA_-D-fFmMc0hH9UCH2gZrRk0" // Make sure this key is valid
//   });

//   const contents = 
//   "garden "
//     // "A poster with the text 'Summerland' in bold font as a title, underneath this text is the slogan 'Summer never felt so good";

//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.0-flash-preview-image-generation",
//       contents: contents,
//       config: {
//         responseModalities: [Modality.TEXT, Modality.IMAGE],
//       },
//     });
    
//     for (const part of response.candidates[0].content.parts) {
//       if (part.text) {
//         console.log(part.text);
//       } else if (part.inlineData) {
//         const imageData = part.inlineData.data;
//         const buffer = Buffer.from(imageData, "base64");
//         fs.writeFileSync("gemini-native-image.png", buffer);
//         console.log("Image saved as gemini-native-image.png");
//       }
//     }
//   } catch (error) {
//     console.error("Error generating content:", error);
//   }
// }

// main();





const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const { GoogleGenAI, Modality } = require("@google/genai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-preview-image-generation",
      contents: prompt,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    let imageBase64 = null;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageBase64 = part.inlineData.data;
      }
    }

    res.json({ imageUrl: imageBase64 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Image generation failed." });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});







