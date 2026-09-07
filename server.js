const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.post("/api/translate", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        error: "Matn kiriting"
      });
    }

    const url =
      "https://translate.googleapis.com/translate_a/single" +
      "?client=gtx" +
      "&sl=uz" +
      "&tl=de" +
      "&dt=t" +
      "&q=" +
      encodeURIComponent(text.trim());

    const response = await fetch(url);

    if (!response.ok) {
      console.error("Google Translate status:", response.status);
      return res.status(500).json({
        error: "Tarjima API xatosi"
      });
    }

    const data = await response.json();

    let translation = "";

    if (Array.isArray(data[0])) {
      for (const part of data[0]) {
        if (part && part[0]) {
          translation += part[0];
        }
      }
    }

    if (!translation) {
      return res.status(500).json({
        error: "Tarjima topilmadi"
      });
    }

    res.json({
      translation: translation
    });

  } catch (error) {
    console.error("ERROR:", error);

    res.status(500).json({
      error: "Tarjima qilishda xatolik yuz berdi"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});