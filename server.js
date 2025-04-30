const express = require('express');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 3000;
const imgbbApiKey = '91ad8d61a37681e29b2e48125c76ecdb';

app.use(express.json());

app.post('/upload', async (req, res) => {
  const imageUrl = req.body.imageUrl;
  if (!imageUrl) return res.status(400).json({ error: 'Missing imageUrl' });

  try {
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const formData = new FormData();
    formData.append('image', Buffer.from(imageResponse.data), { filename: 'image.png' });

    const uploadResponse = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: formData.getHeaders(),
      params: { key: imgbbApiKey }
    });

    res.json({ imageUrl: uploadResponse.data.data.url });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to upload image.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
