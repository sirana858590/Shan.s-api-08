const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Load quiz data using require
const quizBn = require('./quizBangla.json');
const quizEn = require('./quizEnglish.json');
const quizMath = require('./quizMathematics.json');

// Category map
const quizMap = {
  bangla: quizBn,
  english: quizEn,
  mathematics: quizMath
};

// Home route
app.get('/', (req, res) => {
  res.send("Welcome to Quiz API! Use /quiz?category=bangla|english|mathematics");
});

// Quiz route
app.get('/quiz', (req, res) => {
  const category = req.query.category?.toLowerCase();
  const quizList = quizMap[category];

  if (!quizList) {
    return res.status(400).json({
      error: "Invalid category. Use bangla, english, or mathematics"
    });
  }

  const random = quizList[Math.floor(Math.random() * quizList.length)];
  res.json({ question: random });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Quiz API running at http://localhost:${port}`);
});
