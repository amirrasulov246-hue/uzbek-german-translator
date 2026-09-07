const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

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

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=" +
        process.env.GEMINI_API_KEY,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Translate this Uzbek text into natural German.
Then briefly explain difficult grammar in Uzbek.

Uzbek text:
${text}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({
        error: "Gemini API xatosi"
      });
    }

    const translation =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({
      translation: translation || "Tarjima topilmadi"
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
      