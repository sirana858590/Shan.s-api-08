const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const app = express();
const PORT = process.env.PORT || 3000;

// ImgBB API key - you should get one from https://api.imgbb.com/
const IMGBB_API_KEY = '314bc30ad2d32fe8f43b8cbce704f2b9';

app.get('/ShAn/imgbb', async (req, res) => {
  try {
    const imageUrl = req.query.imageUrl;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'imageUrl parameter is required' });
    }

    // Fetch the image
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    
    // Prepare form data for ImgBB
    const formData = new FormData();
    formData.append('image', response.data.toString('base64'));
    
    // Upload to ImgBB
    const uploadResponse = await axios.post(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, formData, {
      headers: formData.getHeaders()
    });

    res.json({
      success: true,
      imageUrl: uploadResponse.data.data.url
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to upload image to ImgBB' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
