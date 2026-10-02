const express = require('express');
const postsRouter = require('./routes/posts');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: '20kb' }));
app.use(postsRouter);

app.use((request, response) => {
  response.status(404).json({ error: 'Route not found.' });
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

app.listen(port, () => {
  console.log(`Blog API listening on port ${port}`);
});