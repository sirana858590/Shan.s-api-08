const express = require('express');
const fs = require('fs');
const path = require('path');
const PastebinAPI = require('pastebin-ts').default;

const app = express();
app.use(express.json());

const pastebin = new PastebinAPI({
  apiKey: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9'
});

app.post('/upload', async (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ error: 'Filename is required.' });

  const filePath = path.join(__dirname, 'cmds', filename.endsWith('.js') ? filename : `${filename}.js`);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found.' });

  const fileContent = fs.readFileSync(filePath, 'utf8');

  try {
    const pasteUrl = await pastebin.createPaste({
      code: fileContent,
      name: filename,
      format: 'javascript',
      publicity: 1
    });

    const rawUrl = pasteUrl.replace('pastebin.com', 'pastebin.com/raw');
    res.json({ url: rawUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Pastebin upload failed.' });
  }
});

app.get('/', (req, res) => {
  res.json('Welcome-ShSn.s-Api');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
