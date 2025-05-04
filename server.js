const express = require('express');
const { PasteClient } = require('pastebin-ts');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Use API key from environment
const client = new PasteClient('LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9');

app.use(express.json());

app.post('/create', async (req, res) => {
  try {
    const { title, content } = req.body;
    const url = await client.createPaste({
      title,
      code: content,
      format: 'javascript',
      visibility: 1,
    });
    res.json({ url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/', async (req, res) => {
  rse.send('ok bye');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
