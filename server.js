const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Your Imgur Client ID
const IMGUR_CLIENT_ID = "1993fffad217059";

app.use(cors());

app.get("/imgur", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "Missing image URL" });
  }

  try {
    const response = await axios.post(
      "https://api.imgur.com/3/image",
      { image: url, type: "URL" },
      {
        headers: {
          Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        },
      }
    );

    return res.json({ data: response.data.data.link });
  } catch (error) {
    console.error("Imgur Upload Error:", error.response?.data || error.message);
    return res.status(500).json({
      error: "Imgur upload failed",
      reason: error.response?.data || error.message,
    });
  }
});

app.get("/", async (req, res) => {
  res.json( 'sor vc' )
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
