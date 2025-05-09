const express = require("express");
const imgur = require("imgur");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Set your Imgur client ID
imgur.setClientId("1993fffad217059");

app.use(cors());

app.get("/imgur", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "Missing image URL" });
  }

  try {
    const result = await imgur.uploadUrl(url);
    return res.json({ data: result.link });
  } catch (error) {
    console.error("Upload failed:", error.message);
    return res.status(500).json({ error: "Imgur upload failed" });
  }
});

app.get('/', (req, res) => {
  res.json( 'Welcome ShSn.s Api' );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
