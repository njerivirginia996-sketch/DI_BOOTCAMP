# Grid Capture

A two-player, turn-based strategy game on a 10 x 10 board. Players start on opposite corners, alternate one-square orthogonal moves, and win by reaching or attacking the opponent's base. Obstacles are generated for each match.

## Run

```sh
npm install
npm start
```

Open `http://localhost:3000`. Set `PORT` to use a different port. The app serves the browser UI and its JSON API from the same Express server.

## API

Register and log in with JSON bodies such as `{ "username": "North", "password": "secret1" }`. Use the returned login token as `Authorization: Bearer <token>` on game routes.

- `POST /api/register` creates a user.
- `POST /api/login` returns a bearer token.
- `GET /api/games` lists matches waiting for a second player.
- `POST /api/games` creates a match; the response contains its shareable ID.
- `POST /api/games/:id/join` joins a waiting match.
- `GET /api/games/:id` returns the current board state.
- `GET /api/games/:id/valid-moves` lists legal moves for the current player.
- `POST /api/games/:id/move` accepts `{ "direction": "up|down|left|right" }`.
- `POST /api/games/:id/attack` captures the opponent base when adjacent.
- `GET /api/games/:id/winner` checks match status and winner.

User accounts, tokens, and matches are kept in memory for this exercise and reset when the server restarts. For production use, replace them with persistent storage and managed authentication.

## Test

```sh
npm test
```
