const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

const IMGUR_CLIENT_ID = '6a8362c76ca05ff'; // Replace with your real Client ID

app.use(express.json());

app.post('/ShAn/imgur', async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) return res.status(400).json({ error: 'Missing imageUrl' });

  try {
    const response = await axios.post('https://api.imgur.com/3/image', {
      image: imageUrl,
      type: 'URL'
    }, {
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`
      }
    });

    res.json({ imageUrl: response.data.data.link });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Imgur upload failed' });
  }
});

app.get('/', (req, res) => res.send('Imgur Uploader API Running'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
