const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bbybot', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schemas
const messageSchema = new mongoose.Schema({
  ask: String,
  ans: [String],
  authorId: String,
  createdAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  userId: String,
  totalTeachings: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);
const User = mongoose.model('User', userSchema);

// API Endpoints
app.get('/bby', async (req, res) => {
  const { text, uid, font } = req.query;
  
  try {
    const messages = await Message.find({ ask: { $regex: text, $options: 'i' } });
    
    if (messages.length > 0) {
      // Get random answer from all possible answers
      const allAnswers = messages.flatMap(msg => msg.ans);
      const randomAnswer = allAnswers[Math.floor(Math.random() * allAnswers.length)];
      
      // Update user last active
      await User.findOneAndUpdate(
        { userId: uid },
        { $set: { lastActive: new Date() } },
        { upsert: true }
      );
      
      res.json({
        text: randomAnswer,
        react: "💖",
        status: "Success"
      });
    } else {
      res.json({
        text: "Please teach me this sentence!🦆💨",
        status: "No results"
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/bby/teach', async (req, res) => {
  const { ask, ans, uid } = req.query;
  
  try {
    // Create or update message
    const message = await Message.findOneAndUpdate(
      { ask: { $regex: `^${ask}$`, $options: 'i' } },
      { 
        $addToSet: { ans: { $each: ans.split(',') } },
        $set: { authorId: uid },
        $setOnInsert: { ask }
      },
      { upsert: true, new: true }
    );
    
    // Update user stats
    const user = await User.findOneAndUpdate(
      { userId: uid },
      { $inc: { totalTeachings: 1 }, $set: { lastActive: new Date() } },
      { upsert: true, new: true }
    );
    
    res.json({
      message: "Teaching recorded successfully!",
      ask: message.ask,
      userStats: {
        user: {
          totalTeachings: user.totalTeachings
        }
      },
      status: "Success"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/bby/msg', async (req, res) => {
  const { ask, uid } = req.query;
  
  try {
    const messages = await Message.find({ ask: { $regex: ask, $options: 'i' } });
    
    if (messages.length === 0) {
      return res.json({ status: "No results" });
    }
    
    // Format response
    const formattedMessages = messages.flatMap(msg => 
      msg.ans.map((ans, index) => ({
        ans,
        index: index + 1,
        authorId: msg.authorId
      }))
    );
    
    // Update user last active
    await User.findOneAndUpdate(
      { userId: uid },
      { $set: { lastActive: new Date() } },
      { upsert: true }
    );
    
    res.json({
      ask,
      messages: formattedMessages,
      status: "Success"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/bby/delete', async (req, res) => {
  const { text, uid, index } = req.query;
  
  try {
    let result;
    
    if (index) {
      // Delete specific answer at index
      result = await Message.updateOne(
        { ask: { $regex: text, $options: 'i' } },
        { $unset: { [`ans.${index - 1}`]: 1 } }
      );
      
      // Remove null values from array
      await Message.updateOne(
        { ask: { $regex: text, $options: 'i' } },
        { $pull: { ans: null } }
      );
    } else {
      // Delete all answers for this question
      result = await Message.deleteMany({ ask: { $regex: text, $options: 'i' } });
    }
    
    if (result.deletedCount > 0 || result.modifiedCount > 0) {
      res.json({ status: "Success" });
    } else {
      res.json({ status: "No changes made" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/bby/edit', async (req, res) => {
  const { ask, newAsk, index, newAns, uid } = req.query;
  
  try {
    if (newAsk) {
      // Edit the question
      const result = await Message.updateMany(
        { ask: { $regex: ask, $options: 'i' } },
        { $set: { ask: newAsk } }
      );
      
      res.json({ 
        status: result.modifiedCount > 0 ? "Success" : "No changes made"
      });
    } else if (index && newAns) {
      // Edit specific answer
      const result = await Message.updateOne(
        { ask: { $regex: ask, $options: 'i' } },
        { $set: { [`ans.${index - 1}`]: newAns } }
      );
      
      res.json({ 
        status: result.modifiedCount > 0 ? "Success" : "No changes made"
      });
    } else {
      res.status(400).json({ error: "Invalid parameters" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
