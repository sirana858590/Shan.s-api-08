const express = require('express');
const fs = require('fs');
const path = require('path');
const PastebinAPI = require('pastebin-js');

const app = express();
const port = process.env.PORT || 3000;

const pastebin = new PastebinAPI({
  api_dev_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9'
});

app.use(express.json({ limit: '1mb' }));

app.post('/upload', async (req, res) => {
  const { filename, code } = req.body;

  if (!filename || !code) {
    return res.status(400).send({ error: "Missing filename or code" });
  }

  try {
    const paste = await pastebin.createPaste({
      text: code,
      title: filename,
      format: 'javascript',
      privacy: 1,
    });

    if (!paste) return res.status(500).send({ error: 'Pastebin upload failed' });

    const rawPaste = paste.replace("pastebin.com", "pastebin.com/raw");
    res.send({ success: true, link: rawPaste });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'Pastebin error' });
  }
});

app.get('/', (req, res) => {
  res.send('Pastebin API is running.');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
