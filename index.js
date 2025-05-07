const express = require('express');
const fs = require('fs');
const path = require('path');
const PastebinAPI = require('pastebin-js');

const app = express();
const port = process.env.PORT || 3000;

const pastebin = new PastebinAPI({
  api_dev_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9'
});

app.get('/upload/:filename', async (req, res) => {
  const fileName = req.params.filename;
  const cmdsFolder = path.join(__dirname, 'cmds');

  const filePathWithoutExt = path.join(cmdsFolder, fileName);
  const filePathWithExt = path.join(cmdsFolder, fileName + '.js');

  let filePath = null;

  if (fs.existsSync(filePathWithoutExt)) {
    filePath = filePathWithoutExt;
  } else if (fs.existsSync(filePathWithExt)) {
    filePath = filePathWithExt;
  } else {
    return res.status(404).send({ error: 'File not found!' });
  }

  fs.readFile(filePath, 'utf8', async (err, data) => {
    if (err) return res.status(500).send({ error: 'Error reading file' });

    try {
      const paste = await pastebin.createPaste({
        text: data,
        title: fileName,
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
});

app.get('/', (req, res) => {
  res.send('Pastebin API is running.');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
