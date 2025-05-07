const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const OPENAI_API_KEY = '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'; // <-- paste your actual key here

app.use(cors());
app.use(express.json());

app.post('/gpt', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
