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
