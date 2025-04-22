const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });
const CLIENT_ID = '169afb2f9e0741b'; // Replace with your Client ID

app.post('/ShAn/imgur', upload.single('image'), async (req, res) => {
  try {
  const filePath = req.file.path;
  const base64Image = fs.readFileSync(filePath, { encoding: 'base64' });

  const response = await fetch('https://api.imgur.com/3/image', {
     method: 'POST',
     headers: {
     Authorization: `Client-ID ${CLIENT_ID}`,
                    'Content-Type': 'application/json',
        },
     body: JSON.stringify({
     image: base64Image,
      type: 'base64'
     })
    });
    
    const data = await response.json();
    fs.unlinkSync(filePath); // Clean up file after upload

     res.json({ link: data.data.link });
     } catch (err) {
        console.error(err);
         res.status(500).send('Upload failed');
         });

        app.listen(3000, () => {
            console.log('Server running at http://localhost:3000');
        });