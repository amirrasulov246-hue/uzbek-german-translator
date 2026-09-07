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

    const query = encodeURIComponent(text.trim());

    const response = await fetch(
      `https://translate.dr460nf1r3.org/api/v1/uz/de/${query}`
    );

    const data = await response.json();

    console.log("Lingva response:", data);

    if (!response.ok || !data.translation) {
      return res.status(500).json({
        error: "Tarjima API xatosi"
      });
    }

    res.json({
      translation: data.translation
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