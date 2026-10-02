const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5000;
const postsApi = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
});

app.use(express.json());

function isValidId(id) {
  return Number.isInteger(Number(id)) && Number(id) > 0;
}

function sendUpstreamError(error, response) {
  const status = error.response?.status || (error.code === 'ECONNABORTED' ? 504 : 502);
  response.status(status).json({
    error: 'The posts service request failed.',
    details: error.response?.data,
  });
}

app.get('/api/posts', async (request, response) => {
  try {
    const result = await postsApi.get('/posts');
    response.json(result.data);
  } catch (error) {
    sendUpstreamError(error, response);
  }
});

app.get('/api/posts/:id', async (request, response) => {
  if (!isValidId(request.params.id)) {
    return response.status(400).json({ error: 'Post ID must be a positive integer.' });
  }

  try {
    const result = await postsApi.get(`/posts/${request.params.id}`);
    response.json(result.data);
  } catch (error) {
    sendUpstreamError(error, response);
  }
});

app.post('/api/posts', async (request, response) => {
  const { title, body, userId } = request.body || {};
  if (typeof title !== 'string' || !title.trim() || typeof body !== 'string' || !body.trim() || !Number.isInteger(userId) || userId < 1) {
    return response.status(400).json({ error: 'title, body, and positive integer userId are required.' });
  }

  try {
    const result = await postsApi.post('/posts', { title, body, userId });
    response.status(201).json(result.data);
  } catch (error) {
    sendUpstreamError(error, response);
  }
});

app.put('/api/posts/:id', async (request, response) => {
  if (!isValidId(request.params.id)) {
    return response.status(400).json({ error: 'Post ID must be a positive integer.' });
  }
  if (!request.body || Object.keys(request.body).length === 0) {
    return response.status(400).json({ error: 'A post object is required.' });
  }

  try {
    const result = await postsApi.put(`/posts/${request.params.id}`, request.body);
    response.json(result.data);
  } catch (error) {
    sendUpstreamError(error, response);
  }
});

app.delete('/api/posts/:id', async (request, response) => {
  if (!isValidId(request.params.id)) {
    return response.status(400).json({ error: 'Post ID must be a positive integer.' });
  }

  try {
    const result = await postsApi.delete(`/posts/${request.params.id}`);
    response.json(result.data);
  } catch (error) {
    sendUpstreamError(error, response);
  }
});

app.listen(port, () => {
  console.log(`CRUD API listening on port ${port}`);
});