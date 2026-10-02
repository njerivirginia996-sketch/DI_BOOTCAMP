# Knex Todo API

Express CRUD API backed by a local SQLite database queried through Knex. The `tasks` table is created automatically from the checked-in migration when the server starts. The database file is stored in `data/tasks.sqlite` and is ignored by Git.

```powershell
npm install
npm start
```

The server listens on port 5000 by default. To use another port, set `PORT`. To choose a different SQLite file, set `DB_PATH`.

## Endpoints

- `GET /api/todos`
- `GET /api/todos/:id`
- `POST /api/todos` with JSON `{ "title": "Write a post", "completed": false }`
- `PUT /api/todos/:id` with either or both `title` and `completed`
- `DELETE /api/todos/:id` (returns 204 on success)