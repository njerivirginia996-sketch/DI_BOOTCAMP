const express = require('express');
const router = express.Router();

const triviaQuestions = [
  {
    question: 'What is the capital of France?',
    answer: 'Paris',
  },
  {
    question: 'Which planet is known as the Red Planet?',
    answer: 'Mars',
  },
  {
    question: 'What is the largest mammal in the world?',
    answer: 'Blue whale',
  },
];

// Quiz state (one player, kept in memory)
let currentIndex = 0;
let score = 0;

// GET /quiz - show the current question
router.get('/', (req, res) => {
  if (currentIndex >= triviaQuestions.length) {
    return res.json({ message: 'Quiz finished! Go to /quiz/score to see your result.' });
  }

  res.json({
    questionNumber: currentIndex + 1,
    totalQuestions: triviaQuestions.length,
    question: triviaQuestions[currentIndex].question,
  });
});

// POST /quiz - submit an answer, then move to the next question
router.post('/', (req, res) => {
  if (currentIndex >= triviaQuestions.length) {
    return res.status(400).json({ message: 'Quiz already finished. Go to /quiz/score.' });
  }

  const answer = req.body && req.body.answer;
  if (!answer) {
    return res.status(400).json({ message: 'Please send an answer, e.g. { "answer": "Paris" }' });
  }

  const current = triviaQuestions[currentIndex];
  const isCorrect = answer.trim().toLowerCase() === current.answer.toLowerCase();

  if (isCorrect) score++;
  currentIndex++;

  const response = {
    correct: isCorrect,
    feedback: isCorrect
      ? 'Correct! Well done.'
      : `Wrong! The correct answer was "${current.answer}".`,
    score,
  };

  if (currentIndex < triviaQuestions.length) {
    response.nextQuestion = triviaQuestions[currentIndex].question;
  } else {
    response.message = 'Quiz finished! Go to /quiz/score to see your result.';
  }

  res.json(response);
});

// GET /quiz/score - final score
router.get('/score', (req, res) => {
  if (currentIndex < triviaQuestions.length) {
    return res.status(400).json({
      message: 'The quiz is not finished yet.',
      answered: currentIndex,
      totalQuestions: triviaQuestions.length,
    });
  }

  res.json({
    score,
    totalQuestions: triviaQuestions.length,
    message: `You scored ${score} out of ${triviaQuestions.length}.`,
  });
});

// POST /quiz/reset - start over (optional extra)
router.post('/reset', (req, res) => {
  currentIndex = 0;
  score = 0;
  res.json({ message: 'Quiz reset. Go to /quiz to start.' });
});

module.exports = router;