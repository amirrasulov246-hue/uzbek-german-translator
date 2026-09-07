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

    const query = encodeURIComponent(text);

    const response = await fetch(
      `https://lingva.ml/api/v1/uz/de/${query}`
    );

    const data = await response.json();

    console.log("Lingva:", data);

    if (!response.ok || data.error) {
      return res.status(500).json({
        error: "Tarjima API xatosi"
      });
    }

    res.json({
      translation: data.translation || "Tarjima topilmadi"
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