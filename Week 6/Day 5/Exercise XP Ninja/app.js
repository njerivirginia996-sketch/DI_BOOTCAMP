const crypto = require('node:crypto');
const path = require('node:path');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const sessionLifetimeMs = 60 * 60 * 1000;
const sessions = new Map();

const questionSets = {
  easy: [
    {
      prompt: 'Which tag gives an HTML document its largest standard heading?',
      options: ['<head>', '<h1>', '<title>', '<header>'],
      correctIndex: 1,
      explanation: '<h1> is the top-level heading element.',
    },
    {
      prompt: 'Which CSS property changes the color of text?',
      options: ['font-style', 'background', 'color', 'text-decoration'],
      correctIndex: 2,
      explanation: 'The color property sets an element’s text color.',
    },
    {
      prompt: 'Which keyword declares a block-scoped variable that can be reassigned?',
      options: ['const', 'let', 'static', 'final'],
      correctIndex: 1,
      explanation: 'let is block-scoped and allows reassignment.',
    },
    {
      prompt: 'Which method writes a message to the browser console?',
      options: ['console.log()', 'document.writeLog()', 'window.print()', 'console.show()'],
      correctIndex: 0,
      explanation: 'console.log() writes values to the developer console.',
    },
    {
      prompt: 'What does CSS stand for?',
      options: ['Computer Style Sheets', 'Creative Styling Syntax', 'Cascading Style Sheets', 'Colorful Sheet System'],
      correctIndex: 2,
      explanation: 'CSS means Cascading Style Sheets.',
    },
  ],
  medium: [
    {
      prompt: 'Which built-in Node.js module provides file system operations?',
      options: ['http', 'fs', 'pathing', 'files'],
      correctIndex: 1,
      explanation: 'The fs module provides APIs for working with files and directories.',
    },
    {
      prompt: 'What does express.json() middleware do?',
      options: ['Formats JSON responses', 'Parses incoming JSON request bodies', 'Stores JSON in a database', 'Validates JavaScript syntax'],
      correctIndex: 1,
      explanation: 'express.json() parses JSON request bodies and makes them available on req.body.',
    },
    {
      prompt: 'Which HTTP status code normally means a resource was not found?',
      options: ['201', '301', '404', '500'],
      correctIndex: 2,
      explanation: '404 Not Found means the server could not find the requested resource.',
    },
    {
      prompt: 'In CommonJS, which expression imports another module?',
      options: ['include("module")', 'require("module")', 'using("module")', 'load("module")'],
      correctIndex: 1,
      explanation: 'CommonJS modules are loaded with require().',
    },
    {
      prompt: 'Where does Express place a route parameter from /users/:id?',
      options: ['req.body.id', 'req.query.id', 'req.params.id', 'req.path.id'],
      correctIndex: 2,
      explanation: 'Route parameters are exposed through req.params.',
    },
  ],
  hard: [
    {
      prompt: 'Which promise callback runs first after this synchronous code? Promise.resolve().then(() => A); queueMicrotask(() => B);',
      options: ['A, then B', 'B, then A', 'They run at the same time', 'Neither runs'],
      correctIndex: 0,
      explanation: 'The promise reaction is queued first, so its microtask runs before the later queueMicrotask callback.',
    },
    {
      prompt: 'What does the second argument to app.use((err, req, res, next) => {}) identify?',
      options: ['A route parameter', 'An error-handling middleware signature', 'A response callback', 'A promise rejection'],
      correctIndex: 1,
      explanation: 'Express recognizes error middleware by its four parameters: err, req, res, and next.',
    },
    {
      prompt: 'What is the result of Promise.all() when one input promise rejects?',
      options: ['It fulfills with the other values', 'It waits forever', 'It rejects with that reason', 'It retries the failed promise'],
      correctIndex: 2,
      explanation: 'Promise.all() rejects as soon as one of its input promises rejects.',
    },
    {
      prompt: 'Which statement about a Node.js module’s top-level scope is correct?',
      options: ['It is shared globally across every file', 'It is wrapped in a module-local function scope', 'It always runs in strict browser mode', 'It cannot access process'],
      correctIndex: 1,
      explanation: 'Node.js wraps CommonJS module code, giving each module its own top-level scope.',
    },
    {
      prompt: 'When does Express 5 automatically pass a rejected promise from an async route to error middleware?',
      options: ['Never; every route must call next(err)', 'When the returned promise rejects', 'Only when response.json() throws', 'Only in production'],
      correctIndex: 1,
      explanation: 'Express 5 forwards rejected promises returned by route handlers to error middleware.',
    },
  ],
};

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

function getSession(sessionId, response) {
  const session = sessions.get(sessionId);
  if (!session || Date.now() - session.createdAt > sessionLifetimeMs) {
    sessions.delete(sessionId);
    response.status(404).json({ error: 'Quiz session not found. Start a new quiz.' });
    return null;
  }
  return session;
}

function getPublicQuestion(session) {
  const current = session.questions[session.currentIndex];
  return {
    number: session.currentIndex + 1,
    total: session.questions.length,
    prompt: current.prompt,
    options: current.options,
    timeLimit: session.timeLimit,
  };
}

app.post('/api/quiz', (request, response) => {
  const difficulty = request.body?.difficulty || 'medium';
  if (!Object.hasOwn(questionSets, difficulty)) {
    return response.status(400).json({ error: 'Difficulty must be easy, medium, or hard.' });
  }

  for (const [sessionId, session] of sessions) {
    if (Date.now() - session.createdAt > sessionLifetimeMs) sessions.delete(sessionId);
  }

  const sessionId = crypto.randomUUID();
  const questions = questionSets[difficulty];
  const session = {
    difficulty,
    questions,
    currentIndex: 0,
    score: 0,
    answered: false,
    complete: false,
    createdAt: Date.now(),
    timeLimit: 20,
  };
  sessions.set(sessionId, session);

  response.status(201).json({
    sessionId,
    difficulty,
    score: session.score,
    question: getPublicQuestion(session),
  });
});

app.post('/api/quiz/:sessionId/answer', (request, response) => {
  const session = getSession(request.params.sessionId, response);
  if (!session) return;
  if (session.complete || session.answered) {
    return response.status(409).json({ error: 'This question has already been answered.' });
  }

  const { answerIndex, timedOut = false } = request.body || {};
  if (typeof timedOut !== 'boolean' || (!timedOut && (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= session.questions[session.currentIndex].options.length))) {
    return response.status(400).json({ error: 'Choose a valid answer option.' });
  }

  const currentQuestion = session.questions[session.currentIndex];
  const correct = !timedOut && answerIndex === currentQuestion.correctIndex;
  if (correct) session.score += 1;
  session.answered = true;

  response.json({
    correct,
    timedOut,
    correctIndex: currentQuestion.correctIndex,
    correctAnswer: currentQuestion.options[currentQuestion.correctIndex],
    explanation: currentQuestion.explanation,
    score: session.score,
    questionNumber: session.currentIndex + 1,
    totalQuestions: session.questions.length,
    isLast: session.currentIndex === session.questions.length - 1,
  });
});

app.post('/api/quiz/:sessionId/next', (request, response) => {
  const session = getSession(request.params.sessionId, response);
  if (!session) return;
  if (!session.answered || session.complete) {
    return response.status(409).json({ error: 'Answer the current question before continuing.' });
  }

  if (session.currentIndex === session.questions.length - 1) {
    session.complete = true;
    const total = session.questions.length;
    return response.json({
      complete: true,
      score: session.score,
      total,
      percentage: Math.round((session.score / total) * 100),
    });
  }

  session.currentIndex += 1;
  session.answered = false;
  response.json({
    complete: false,
    score: session.score,
    question: getPublicQuestion(session),
  });
});

app.use('/api', (request, response) => {
  response.status(404).json({ error: 'API route not found.' });
});

app.use((error, request, response, next) => {
  const status = error.status === 400 ? 400 : 500;
  response.status(status).json({ error: status === 400 ? 'Invalid JSON request.' : 'An unexpected server error occurred.' });
});

app.listen(port, () => {
  console.log(`Quiz game listening at http://localhost:${port}`);
});