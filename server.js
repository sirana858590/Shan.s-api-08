const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const IMGUR_CLIENT_ID = 'e1069d52a0bb363';

app.post('/ShAn/imgur', async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) {
    return res.status(400).json({ error: 'Missing imageUrl' });
  }

  try {
    const response = await axios.post('https://api.imgur.com/3/image', {
      image: imageUrl,
      type: 'URL',
    }, {
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
      },
    });

    res.json({ imageUrl: response.data.data.link });
  } catch (error) {
    console.error('Imgur Upload Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Imgur upload failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
