# Query Quest Quiz Game

A browser quiz game backed by Express, Knex, and SQLite. Questions, answer options, and their many-to-many associations live in separate tables. Answers are checked on the server, and score/session state is kept in memory until the run completes.

```powershell
npm install
npm start
```

Open http://localhost:5000. The server runs migrations and seeds the question bank on first startup. SQLite data is stored locally in `data/quiz.sqlite`; set `DB_PATH` to change the location or `PORT` to change the server port.