const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (for demo, use a database in production)
const tempNumbers = new Map();

// Helper function to generate random number
function generateRandomNumber(length = 8) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

// Helper function to check if number exists and is valid
function validateTempNumber(number) {
  if (!tempNumbers.has(number)) {
    return { valid: false, message: 'Number not found' };
  }

  const numberData = tempNumbers.get(number);
  if (new Date() > new Date(numberData.expiresAt)) {
    return { valid: false, message: 'Number has expired' };
  }

  return { valid: true, message: 'Number is valid', data: numberData };
}

// Routes
app.post('/generate', (req, res) => {
  const expiryMinutes = req.body.expiryMinutes || 60;
  const number = generateRandomNumber();
  const expiresAt = new Date(Date.now() + expiryMinutes * 60000);

  const numberData = {
    number,
    expiresAt,
    createdAt: new Date(),
    meta: req.body.meta || {}
  };

  tempNumbers.set(number, numberData);

  res.json({
    success: true,
    number,
    expiresAt: expiresAt.toISOString(),
    createdAt: numberData.createdAt.toISOString()
  });
});

app.get('/validate/:number', (req, res) => {
  const validation = validateTempNumber(req.params.number);
  res.json(validation);
});

app.get('/numbers', (req, res) => {
  const numbers = Array.from(tempNumbers.entries()).map(([number, data]) => ({
    number,
    expiresAt: data.expiresAt.toISOString(),
    createdAt: data.createdAt.toISOString(),
    valid: new Date() < new Date(data.expiresAt)
  }));
  res.json({ numbers });
});

app.delete('/numbers/:number', (req, res) => {
  if (tempNumbers.has(req.params.number)) {
    tempNumbers.delete(req.params.number);
    res.json({ success: true, message: 'Number deleted' });
  } else {
    res.status(404).json({ success: false, message: 'Number not found' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
