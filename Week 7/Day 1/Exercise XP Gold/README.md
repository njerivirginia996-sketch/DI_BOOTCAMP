# Express Blog API

An in-memory blog API built with Express and `express.Router`. Each post has an ID, title, content, and server-generated ISO timestamp. Data resets when the server restarts.

```powershell
npm install
npm start
```

The server listens on port 5000 by default. Set `PORT` to use a different port.

## Routes

- `GET /posts`
- `GET /posts/:id`
- `POST /posts` with JSON `{ "title": "First post", "content": "Hello from the blog." }`
- `PUT /posts/:id` with JSON `{ "title": "Updated title", "content": "Updated content." }`
- `DELETE /posts/:id`

Use `Content-Type: application/json` for create and update requests.