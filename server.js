const axios = require('axios');
const express = require('express');
const app = express();

app.use(express.json());

app.post('/ShAn/imgur', async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) return res.status(400).json({ error: "Missing image URL" });

  try {
    const imgurRes = await axios.post(
      'https://api.imgur.com/3/image',
      { image: imageUrl },
      {
        headers: {
          Authorization: 'Client-ID 0778d45eee5d31a'
        }
      }
    );

    return res.json({ imageUrl: imgurRes.data.data.link });
  } catch (error) {
    console.error('Imgur API error:', error?.response?.data || error.message);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

app.get('/', (req, res) => {
  const coloredText = `
    <div style="font-family: monospace; font-size: 24px;">
      <span style="color: #ff0000;">E</span>
      <span style="color: #00ff00;">w</span>
      <span style="color: #0000ff;">r</span>
      <span> </span>
      <span style="color: #ff00ff;">S</span>
      <span style="color: #ffff00;">h</span>
      <span style="color: #00ffff;">A</span>
      <span style="color: #ff9900;">n</span>
      <span style="color: #9900ff;">.</span>
      <span style="color: #ff0099;">s</span>
      <span> </span>
      <span style="color: #00ff99;">A</span>
      <span style="color: #ff6600;">p</span>
      <span style="color: #6600ff;">i</span>
      <span> </span>
      <span style="color: #ff0066;">I</span>
      <span style="color: #66ff00;">s</span>
      <span> </span>
      <span style="color: #0066ff;">R</span>
      <span style="color: #ff3300;">u</span>
      <span style="color: #3300ff;">n</span>
      <span style="color: #ff0033;">n</span>
      <span style="color: #33ff00;">i</span>
      <span style="color: #0033ff;">n</span>
      <span style="color: #ff0000;">g</span>
    </div>
  `;
  res.send(coloredText);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
