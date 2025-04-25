const express = require('express');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('image'), async (req, res) => {
  const form = new FormData();
  form.append('image', fs.readFileSync(req.file.path).toString('base64'));

  try {
    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, form, {
      headers: form.getHeaders(),
    });
    fs.unlinkSync(req.file.path); // clean up
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
