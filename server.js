// server.js
const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fileType = require('file-type');
const multer = require('multer');
const cors = require('cors');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json());

// Environment variables
const IMGBB_API_KEY = process.env.IMGBB_API_KEY || "91ad8d61a37681e29b2e48125c76ecdb";
const PORT = process.env.PORT || 3000;

// Upload endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Validate file type
    const fileInfo = await fileType.fromBuffer(req.file.buffer);
    if (!fileInfo?.mime.startsWith('image/')) {
      return res.status(400).json({ error: 'Invalid image format' });
    }

    // Upload to ImgBB
    const formData = new FormData();
    formData.append('image', req.file.buffer, {
      filename: `upload_${Date.now()}.${fileInfo.ext}`,
      contentType: fileInfo.mime
    });

    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: formData.getHeaders(),
      params: { key: IMGBB_API_KEY }
    });

    if (!response.data.success) {
      throw new Error('ImgBB upload failed');
    }

    res.json({
      success: true,
      url: response.data.data.url,
      deleteUrl: response.data.data.delete_url
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      error: error.message || 'Image processing failed',
      details: error.response?.data?.error || null
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
