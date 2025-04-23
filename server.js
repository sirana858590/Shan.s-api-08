const express = require('express');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = 3000;

// Replace with your Imgur Client ID
const IMGUR_CLIENT_ID = '169afb2f9e0741b'; 

// Single endpoint for both images and videos
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded');

    const fileStream = fs.createReadStream(req.file.path);
    const formData = new FormData();
    formData.append('image', fileStream);

    const response = await axios.post('https://api.imgur.com/3/image', formData, {
      headers: {
        'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`,
        ...formData.getHeaders()
      }
    });

    fs.unlinkSync(req.file.path); // Clean up
    res.json({ link: response.data.data.link });
    
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path); // Clean up on error
    res.status(500).send(error.response?.data?.data?.error || 'Upload failed');
  }
});

app.get('/', (req, res) => {
  res.send('Imgur API Wrapper is running');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
