const express = require('express');
const quizController = require('../controllers/quizController');

const router = express.Router();

router.post('/', quizController.startQuiz);
router.post('/:sessionId/answer', quizController.submitAnswer);
router.post('/:sessionId/next', quizController.nextQuestion);

module.exports = router;