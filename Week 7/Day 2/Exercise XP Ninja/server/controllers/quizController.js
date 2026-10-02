const crypto = require('node:crypto');
const quizModel = require('../models/quizModel');

const sessions = new Map();
const difficulties = new Set(['easy', 'medium', 'hard']);
const sessionLifetimeMs = 60 * 60 * 1000;

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function getSession(sessionId, response) {
  const session = sessions.get(sessionId);
  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(sessionId);
    response.status(404).json({ error: 'Quiz session not found. Start a new game.' });
    return null;
  }
  return session;
}

async function startQuiz(request, response, next) {
  const difficulty = request.body?.difficulty || 'medium';
  if (!difficulties.has(difficulty)) {
    return response.status(400).json({ error: 'Difficulty must be easy, medium, or hard.' });
  }

  try {
    for (const [id, session] of sessions) {
      if (session.expiresAt <= Date.now()) sessions.delete(id);
    }

    const questionIds = await quizModel.getQuestionIds(difficulty);
    if (questionIds.length === 0) {
      return response.status(503).json({ error: 'No questions are available for this difficulty.' });
    }

    const sessionId = crypto.randomUUID();
    const session = {
      difficulty,
      questionIds,
      currentIndex: 0,
      score: 0,
      answered: false,
      complete: false,
      expiresAt: Date.now() + sessionLifetimeMs,
    };
    sessions.set(sessionId, session);

    response.status(201).json({
      sessionId,
      difficulty,
      score: session.score,
      total: questionIds.length,
      question: await quizModel.getQuestionById(questionIds[0]),
    });
  } catch (error) {
    next(error);
  }
}

async function submitAnswer(request, response, next) {
  const session = getSession(request.params.sessionId, response);
  if (!session) return;
  if (session.complete || session.answered) {
    return response.status(409).json({ error: 'This question has already been answered.' });
  }
  if (!isObject(request.body) || !Number.isSafeInteger(request.body.optionId) || request.body.optionId < 1) {
    return response.status(400).json({ error: 'optionId must be a positive integer.' });
  }

  try {
    const questionId = session.questionIds[session.currentIndex];
    const result = await quizModel.checkAnswer(questionId, request.body.optionId);
    if (!result.valid) {
      return response.status(400).json({ error: 'Choose an option belonging to the current question.' });
    }

    session.answered = true;
    if (result.correct) session.score += 1;
    response.json({
      correct: result.correct,
      correctOptionId: result.correctOptionId,
      correctAnswer: result.correctAnswer,
      explanation: result.explanation,
      score: session.score,
      questionNumber: session.currentIndex + 1,
      total: session.questionIds.length,
      isLast: session.currentIndex === session.questionIds.length - 1,
    });
  } catch (error) {
    next(error);
  }
}

async function nextQuestion(request, response, next) {
  const session = getSession(request.params.sessionId, response);
  if (!session) return;
  if (!session.answered || session.complete) {
    return response.status(409).json({ error: 'Submit an answer before continuing.' });
  }

  if (session.currentIndex === session.questionIds.length - 1) {
    session.complete = true;
    const total = session.questionIds.length;
    return response.json({
      complete: true,
      score: session.score,
      total,
      percentage: Math.round((session.score / total) * 100),
    });
  }

  session.currentIndex += 1;
  session.answered = false;
  try {
    response.json({
      complete: false,
      score: session.score,
      questionNumber: session.currentIndex + 1,
      total: session.questionIds.length,
      question: await quizModel.getQuestionById(session.questionIds[session.currentIndex]),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { startQuiz, submitAnswer, nextQuestion };