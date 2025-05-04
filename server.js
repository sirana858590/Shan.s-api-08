const express = require('express');
const PastebinAPI = require('pastebin-js');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());

const pastebin = new PastebinAPI({
  api_dev_key: 'kI1rx9nggVy2o-nr3P0WqiHTS__ek9VV'
});

app.post('/upload', async (req, res) => {
  const { filename } = req.body;

  if (!filename) return res.status(400).send({ error: 'Filename is required.' });

  const filePath = path.join(__dirname, 'cmds', filename.endsWith('.js') ? filename : `${filename}.js`);
  if (!fs.existsSync(filePath)) return res.status(404).send({ error: 'File not found.' });

  const fileContent = fs.readFileSync(filePath, 'utf8');

  try {
    const paste = await pastebin.createPaste({
      text: fileContent,
      title: filename,
      format: null,
      privacy: 1
    });

    const rawPaste = paste.replace("pastebin.com", "pastebin.com/raw");
    res.send({ url: rawPaste });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Failed to upload to Pastebin.' });
  }
});

app.get('/', (req, res) => {
  res.json('Welcome-ShSn.s-Api');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
