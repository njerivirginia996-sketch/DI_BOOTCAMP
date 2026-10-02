const todoModel = require('../models/todoModel');

function parseTodoId(value) {
  if (!/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) ? id : null;
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validateTitle(title) {
  if (typeof title !== 'string' || !title.trim()) {
    return 'title is required and must be a non-empty string.';
  }
  if (title.trim().length > 200) {
    return 'title must be 200 characters or fewer.';
  }
  return null;
}

async function getAllTodos(request, response, next) {
  try {
    response.json(await todoModel.getAll());
  } catch (error) {
    next(error);
  }
}

async function getTodo(request, response, next) {
  const id = parseTodoId(request.params.id);
  if (id === null) {
    return response.status(400).json({ error: 'Todo ID must be a positive integer.' });
  }

  try {
    const todo = await todoModel.getById(id);
    if (!todo) return response.status(404).json({ error: 'Todo not found.' });
    response.json(todo);
  } catch (error) {
    next(error);
  }
}

async function createTodo(request, response, next) {
  if (!isObject(request.body)) {
    return response.status(400).json({ error: 'Request body must be a JSON object.' });
  }

  const titleError = validateTitle(request.body.title);
  if (titleError) return response.status(400).json({ error: titleError });
  const completed = request.body.completed ?? false;
  if (typeof completed !== 'boolean') {
    return response.status(400).json({ error: 'completed must be a boolean.' });
  }

  try {
    const todo = await todoModel.create({ title: request.body.title.trim(), completed });
    response.status(201).json(todo);
  } catch (error) {
    next(error);
  }
}

async function updateTodo(request, response, next) {
  const id = parseTodoId(request.params.id);
  if (id === null) {
    return response.status(400).json({ error: 'Todo ID must be a positive integer.' });
  }
  if (!isObject(request.body)) {
    return response.status(400).json({ error: 'Request body must be a JSON object.' });
  }

  const { title, completed } = request.body;
  if (title === undefined && completed === undefined) {
    return response.status(400).json({ error: 'Provide a title or completed value to update.' });
  }
  if (title !== undefined) {
    const titleError = validateTitle(title);
    if (titleError) return response.status(400).json({ error: titleError });
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    return response.status(400).json({ error: 'completed must be a boolean.' });
  }

  const changes = {};
  if (title !== undefined) changes.title = title.trim();
  if (completed !== undefined) changes.completed = completed;

  try {
    const todo = await todoModel.update(id, changes);
    if (!todo) return response.status(404).json({ error: 'Todo not found.' });
    response.json(todo);
  } catch (error) {
    next(error);
  }
}

async function deleteTodo(request, response, next) {
  const id = parseTodoId(request.params.id);
  if (id === null) {
    return response.status(400).json({ error: 'Todo ID must be a positive integer.' });
  }

  try {
    const deleted = await todoModel.delete(id);
    if (!deleted) return response.status(404).json({ error: 'Todo not found.' });
    response.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = { getAllTodos, getTodo, createTodo, updateTodo, deleteTodo };