const express = require('express');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });
const PORT = process.env.PORT || 3000;

// Add this to handle GET requests to /upload (for testing)
app.get('/api/upload', (req, res) => {
  res.status(405).json({ error: 'Use POST method for uploads' });
});

// Your existing POST endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const formData = new FormData();
    formData.append('image', fs.createReadStream(req.file.path));

    const imgurResponse = await axios.post('https://api.imgur.com/3/image', formData, {
      headers: {
        'Authorization': `Client-ID ${process.env.IMGUR_CLIENT_ID || '169afb2f9e0741b'}`,
        ...formData.getHeaders()
      }
    });

    fs.unlinkSync(req.file.path); // Clean up
    res.json({ link: imgurResponse.data.data.link });
    
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
