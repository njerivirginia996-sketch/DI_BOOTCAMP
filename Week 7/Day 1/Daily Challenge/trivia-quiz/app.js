const express = require('express');
const quizRouter = require('./routes/quiz');

const app = express();
const PORT = 3000;

app.use(express.json());

// Every route in routes/quiz.js is prefixed with /quiz
app.use('/quiz', quizRouter);

// Invalid routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Trivia quiz running on http://localhost:${PORT}`);
});