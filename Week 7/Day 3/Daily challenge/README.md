# User Management API

Express registration and login with bcrypt password hashing and JSON-file storage. The project includes separate login and registration forms; both submit buttons stay disabled until all inputs contain values.

## Run

```sh
npm install
npm start
```

Open `http://localhost:3002`. Change the `PORT` environment variable to choose another port. `users.json` starts as an empty array and is created beside the server.

## Routes

- `POST /register` accepts `name`, `lastName`, `email`, `username`, and `password`.
- `POST /login` accepts `username` and `password`.
- `GET /users` lists public user profiles.
- `GET /users/:id` retrieves one public user profile.
- `PUT /users/:id` updates one or more of `name`, `lastName`, `email`, `username`, and `password`.

User routes are unauthenticated for this exercise. Passwords are bcrypt-hashed and never returned by the API. User records are stored in `users.json`; do not expose this demonstration API in production.

## Test

```sh
npm test
```
