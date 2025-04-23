const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Hardcoded Imgur Client ID (not recommended for production)
const IMGUR_CLIENT_ID = '169afb2f9e0741b'; // Replace with your actual client ID

const imgurApi = axios.create({
  baseURL: 'https://api.imgur.com/3',
  headers: {
    'Authorization': `Client-ID ${IMGUR_CLIENT_ID}`
  }
});

// Simple route to test image lookup
app.get('/api/image/:id', async (req, res) => {
  try {
    const response = await imgurApi.get(`/image/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to get gallery images
app.get('/api/gallery', async (req, res) => {
  try {
    const response = await imgurApi.get('/gallery/hot/viral/0');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Imgur API Wrapper is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
