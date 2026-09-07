require("dotenv").config();

const express = require("express");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(express.json());
app.use(express.static("public"));

app.post("/api/translate", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Matn kiriting"
      });
    }

    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL,
      input: `Translate this text into natural German. 
Explain difficult grammar briefly in Uzbek.

Text:
${text}`
    });

    res.json({
      translation: response.output_text
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Tarjima qilishda xatolik yuz berdi"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});