const path = require('node:path');
const express = require('express');
const quizRoutes = require('./routes/quizRoutes');

const app = express();

app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api/quiz', quizRoutes);

app.use('/api', (request, response) => {
  response.status(404).json({ error: 'API route not found.' });
});

app.use((error, request, response, next) => {
  if (error.type === 'entity.parse.failed') {
    return response.status(400).json({ error: 'Request body must be valid JSON.' });
  }
  if (error.type === 'entity.too.large') {
    return response.status(413).json({ error: 'Request body is too large.' });
  }
  console.error(error);
  response.status(500).json({ error: 'An unexpected server error occurred.' });
});

module.exports = app;