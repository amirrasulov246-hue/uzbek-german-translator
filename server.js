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

    const url =
      "https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(text) +
      "&langpair=uz|de";

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({
        error: "Tarjima API xatosi"
      });
    }

    const translation = data.responseData?.translatedText;

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