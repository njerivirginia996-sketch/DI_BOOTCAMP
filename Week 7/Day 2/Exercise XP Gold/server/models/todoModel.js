const database = require('../config/database');

function toTodo(row) {
  return row ? { id: row.id, title: row.title, completed: Boolean(row.completed) } : null;
}

async function getAll() {
  const rows = await database('tasks').select('id', 'title', 'completed').orderBy('id');
  return rows.map(toTodo);
}

async function getById(id) {
  const row = await database('tasks').select('id', 'title', 'completed').where({ id }).first();
  return toTodo(row);
}

async function create(todo) {
  const [id] = await database('tasks').insert(todo);
  return getById(id);
}

async function update(id, changes) {
  const changedRows = await database('tasks').where({ id }).update(changes);
  return changedRows ? getById(id) : null;
}

async function remove(id) {
  return database('tasks').where({ id }).delete();
}

module.exports = { getAll, getById, create, update, delete: remove };