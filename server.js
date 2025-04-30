const express = require('express');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 3000;
const imgbbApiKey = '91ad8d61a37681e29b2e48125c76ecdb'; // Replace with your own

app.use(express.json());

app.post('/upload', async (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl) return res.status(400).json({ error: 'Missing imageUrl in body' });

  try {
    const imgRes = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const formData = new FormData();
    formData.append('image', Buffer.from(imgRes.data), { filename: 'image.png' });

    const upload = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: formData.getHeaders(),
      params: { key: imgbbApiKey }
    });

    res.json({ imageUrl: upload.data.data.url });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to upload image to ImgBB' });
  }
});

app.get('/', (req, res) => {
  res.send('ImgBB uploader is running');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
