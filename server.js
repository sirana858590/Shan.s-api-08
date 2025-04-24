const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage for demo purposes (use a database in production)
const numbers = {};

// Generate a temporary number
app.post('/api/numbers', (req, res) => {
    const id = uuidv4();
    const tempNumber = `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    numbers[id] = {
        number: tempNumber,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        messages: []
    };
    res.json({ id, number: tempNumber });
});

// Check for messages
app.get('/api/numbers/:id', (req, res) => {
    const numberData = numbers[req.params.id];
    if (!numberData) {
        return res.status(404).json({ error: 'Number not found' });
    }
    res.json(numberData);
});

// Webhook simulation (for receiving messages)
app.post('/api/webhook', (req, res) => {
    // In a real implementation, this would be called by your SMS provider
    const { to, from, body } = req.body;
    for (const id in numbers) {
        if (numbers[id].number === to) {
            numbers[id].messages.push({
                from,
                body,
                receivedAt: new Date()
            });
            break;
        }
    }
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
