const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8080;

// Load quiz data
const quizBn = require("./data/quizBangla.json");
const quizEn = require("./data/quizEnglish.json");
const quizMath = require("./data/quizMathematics.json");

app.use(cors());

// API route
app.get("/quiz", (req, res) => {
  const category = req.query.category?.toLowerCase();

  let dataSet;
  switch (category) {
    case "bangla":
      dataSet = quizBn;
      break;
    case "english":
      dataSet = quizEn;
      break;
    case "mathematics":
      dataSet = quizMath;
      break;
    default:
      return res.status(400).json({ error: "Invalid or missing category" });
  }

  const randomQuestion = dataSet[Math.floor(Math.random() * dataSet.length)];
  return res.json({ question: randomQuestion });
});

// Root test
app.get("/", (req, res) => {
  res.send("Quiz API Server is running.");
});

app.listen(port, () => {
  console.log(`✅ Quiz API is live at http://localhost:${port}`);
});
