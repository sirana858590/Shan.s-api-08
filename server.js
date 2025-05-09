const express = require("express");
const axios = require("axios");
const imgur = require("imgur");

const app = express();
const PORT = process.env.PORT || 3000;

// Optional: Set your Imgur client ID
imgur.setClientId("YOUR_IMGUR_CLIENT_ID");

app.get("/imgur", async (req, res) => {
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).json({ error: "Missing image URL" });
  }

  try {
    const response = await imgur.uploadUrl(imageUrl);
    return res.json({ data: response.link });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Imgur upload failed" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
