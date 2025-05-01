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
  res.json( 'Welcome To ShAn.s Api' );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
