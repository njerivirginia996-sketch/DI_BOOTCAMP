const express = require('express');

const router = express.Router();
const posts = [];
let nextPostId = 1;

function parsePostId(value) {
  if (!/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function isPostBody(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateText(value, field, maxLength) {
  if (typeof value !== 'string' || !value.trim()) {
    return `${field} is required and must be a non-empty string.`;
  }
  if (value.trim().length > maxLength) {
    return `${field} must be ${maxLength} characters or fewer.`;
  }
  return null;
}

function findPost(id) {
  return posts.find((post) => post.id === id);
}

router.get('/posts', (request, response) => {
  response.json(posts);
});

router.get('/posts/:id', (request, response) => {
  const id = parsePostId(request.params.id);
  if (id === null) {
    return response.status(400).json({ error: 'Post ID must be a positive integer.' });
  }

  const post = findPost(id);
  if (!post) {
    return response.status(404).json({ error: 'Post not found.' });
  }
  response.json(post);
});

router.post('/posts', (request, response) => {
  if (!isPostBody(request.body)) {
    return response.status(400).json({ error: 'Request body must be a JSON object.' });
  }

  const titleError = validateText(request.body.title, 'title', 160);
  if (titleError) return response.status(400).json({ error: titleError });
  const contentError = validateText(request.body.content, 'content', 20000);
  if (contentError) return response.status(400).json({ error: contentError });

  const post = {
    id: nextPostId++,
    title: request.body.title.trim(),
    content: request.body.content.trim(),
    timestamp: new Date().toISOString(),
  };
  posts.push(post);
  response.status(201).json(post);
});

router.put('/posts/:id', (request, response) => {
  const id = parsePostId(request.params.id);
  if (id === null) {
    return response.status(400).json({ error: 'Post ID must be a positive integer.' });
  }

  const post = findPost(id);
  if (!post) {
    return response.status(404).json({ error: 'Post not found.' });
  }
  if (!isPostBody(request.body)) {
    return response.status(400).json({ error: 'Request body must be a JSON object.' });
  }

  const titleError = validateText(request.body.title, 'title', 160);
  if (titleError) return response.status(400).json({ error: titleError });
  const contentError = validateText(request.body.content, 'content', 20000);
  if (contentError) return response.status(400).json({ error: contentError });

  post.title = request.body.title.trim();
  post.content = request.body.content.trim();
  post.timestamp = new Date().toISOString();
  response.json(post);
});

router.delete('/posts/:id', (request, response) => {
  const id = parsePostId(request.params.id);
  if (id === null) {
    return response.status(400).json({ error: 'Post ID must be a positive integer.' });
  }

  const postIndex = posts.findIndex((item) => item.id === id);
  if (postIndex === -1) {
    return response.status(404).json({ error: 'Post not found.' });
  }

  const [deletedPost] = posts.splice(postIndex, 1);
  response.json({ message: 'Post deleted.', post: deletedPost });
});

module.exports = router;