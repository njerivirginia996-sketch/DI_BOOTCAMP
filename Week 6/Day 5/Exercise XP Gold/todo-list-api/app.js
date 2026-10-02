const express = require('express');

const app = express();
const port = process.env.PORT || 5000;
const todos = [];
let nextTodoId = 1;

app.use(express.json());

function parseTodoId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

app.post('/api/todos', (request, response) => {
  const { title, completed = false } = request.body || {};
  if (typeof title !== 'string' || !title.trim()) {
    return response.status(400).json({ error: 'A non-empty title is required.' });
  }
  if (typeof completed !== 'boolean') {
    return response.status(400).json({ error: 'completed must be a boolean.' });
  }

  const todo = { id: nextTodoId++, title: title.trim(), completed };
  todos.push(todo);
  response.status(201).json(todo);
});

app.get('/api/todos', (request, response) => {
  response.json(todos);
});

app.get('/api/todos/:id', (request, response) => {
  const id = parseTodoId(request.params.id);
  if (id === null) {
    return response.status(400).json({ error: 'Todo ID must be a positive integer.' });
  }

  const todo = todos.find((item) => item.id === id);
  if (!todo) {
    return response.status(404).json({ error: 'Todo not found.' });
  }
  response.json(todo);
});

app.put('/api/todos/:id', (request, response) => {
  const id = parseTodoId(request.params.id);
  if (id === null) {
    return response.status(400).json({ error: 'Todo ID must be a positive integer.' });
  }

  const todo = todos.find((item) => item.id === id);
  if (!todo) {
    return response.status(404).json({ error: 'Todo not found.' });
  }

  const { title, completed } = request.body || {};
  if (title === undefined && completed === undefined) {
    return response.status(400).json({ error: 'Provide a title or completed value to update.' });
  }
  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return response.status(400).json({ error: 'title must be a non-empty string.' });
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    return response.status(400).json({ error: 'completed must be a boolean.' });
  }

  if (title !== undefined) todo.title = title.trim();
  if (completed !== undefined) todo.completed = completed;
  response.json(todo);
});

app.delete('/api/todos/:id', (request, response) => {
  const id = parseTodoId(request.params.id);
  if (id === null) {
    return response.status(400).json({ error: 'Todo ID must be a positive integer.' });
  }

  const todoIndex = todos.findIndex((item) => item.id === id);
  if (todoIndex === -1) {
    return response.status(404).json({ error: 'Todo not found.' });
  }

  const [deletedTodo] = todos.splice(todoIndex, 1);
  response.json(deletedTodo);
});

app.listen(port, () => {
  console.log(`Todo API listening on port ${port}`);
});