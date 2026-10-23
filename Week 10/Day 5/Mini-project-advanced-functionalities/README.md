# Virgie — advanced collaborative storytelling

A TypeScript PERN monorepo for writing stories together. React, Redux Toolkit, and Vite power the client; the Express API uses PostgreSQL, parameterized queries, and JWT authentication. This advanced version adds dedicated comment/reaction endpoints, JWT-protected WebSocket collaboration, author-only version history, profile story lists, and public social-sharing links.

## Project layout

```text
backend/   Express API, auth, authorization, PostgreSQL schema
frontend/  React + TypeScript + Redux Toolkit client
types/     Shared TypeScript models and API response shapes
```

## Requirements and local setup

Use Node.js 20+ and PostgreSQL 14+. From this directory:

```powershell
npm install
Copy-Item backend\.env.example backend\.env
```

Edit `backend/.env` and set `DATABASE_URL`, `JWT_SECRET`, and `REFRESH_SECRET`. Use separate, randomly generated secrets of at least 32 characters. Initialize the database with:

```powershell
psql "$env:DATABASE_URL" -f backend\sql\schema.sql
```

The schema migrates an existing `users.username` column to `users.name`, migrates comment bodies to `comment_text`, and adds comment settings, reactions, and share tokens.

Copy `frontend/.env.example` to `frontend/.env` if the API is not at `http://localhost:3001/api`. Then run:

```powershell
npm run dev
```

The frontend is served at `http://localhost:5173`; the API listens on port `3001`. The backend allows the origin configured by `FRONTEND_URL`. A successful `/api/health` response confirms the API process is responding; application requests also require the PostgreSQL database.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the API and Vite client together |
| `npm run build` | Build shared types, type-check/build the API, then type-check/build the frontend |
| `npm start` | Start the compiled backend |
| `npm test` | Build the shared types and backend, then run backend tests |

## Authentication and security

- Registration validates inputs, hashes passwords with bcrypt, and starts a session. Login checks passwords with bcrypt.
- Access JWTs expire after 15 minutes and are held only in Redux memory; they are never persisted to localStorage.
- A 7-day refresh JWT is stored in an HTTP-only, same-site cookie. The client uses it after reload or an access-token 401, then retries the original request. Concurrent refresh attempts share a single refresh request.
- Refresh tokens are stored only as SHA-256 hashes in PostgreSQL and rotated on use. Reusing a revoked token revokes the active tokens in that session family. Logout revokes the current token.
- Cookies use `Secure` in production. Keep the frontend and API on HTTPS in production.
- Every protected API request uses `Authorization: Bearer <access token>`. Inputs are checked on the server and SQL values are parameterized. Errors do not expose database or stack details.

Required backend environment variables:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection URL |
| `JWT_SECRET` | Signing key for short-lived access tokens |
| `REFRESH_SECRET` | Separate signing key for refresh tokens |
| `FRONTEND_URL` | Single allowed frontend origin for credentialed CORS |
| `PORT` | Optional API port; defaults to `3001` |
| `NODE_ENV` | Set to `production` to enable secure cookies and PostgreSQL SSL |

The frontend accepts `VITE_API_URL`, defaulting to `http://localhost:3001/api`.

## API

All routes use the `/api` prefix. Protected routes need an access bearer token; the refresh endpoint uses the HTTP-only cookie.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/register` | Create account and log in |
| `POST` | `/auth/login` | Log in |
| `POST` | `/auth/refresh` | Rotate refresh token and return a fresh access token |
| `POST` | `/auth/logout` | Revoke refresh token and clear cookie |
| `GET` | `/auth/me` | Get current user |
| `PATCH` | `/auth/me` | Update the authenticated user's name or email |
| `PUT` | `/auth/me/avatar` | Upload a PNG, JPEG, or WebP avatar (up to 400 KB) |
| `GET` | `/stories?mine=true` | List stories (optionally only authored or contributed stories) |
| `POST` | `/stories` | Create a story |
| `GET` | `/stories/:id` | Read a story |
| `PATCH` | `/stories/:id` | Edit as author or contributor |
| `DELETE` | `/stories/:id` | Delete as author |
| `PATCH` | `/stories/:id/comments/settings` | Enable/disable comments (author only) |
| `POST` | `/stories/:id/share` | Create a public share URL (collaborators only) |
| `GET` | `/stories/:id/versions` | List saved versions (author only) |
| `POST` | `/stories/:id/versions/:versionId/restore` | Restore a version (author only) |
| `GET` | `/comments/:story_id` | List comments/reactions (collaborators only) |
| `POST` | `/comments` | Add a comment with `story_id` and `comment_text` |
| `PATCH` | `/comments/:id` | Edit a comment (comment author only) |
| `DELETE` | `/comments/:id` | Delete a comment (comment author or story author) |
| `PUT` / `DELETE` | `/comments/:id/reactions/:reaction` | Add/remove an idempotent reaction |
| `GET` | `/share/:token` | Read a publicly shared story |
| `POST` | `/contributors` | Add a contributor by `story_id` and `user_id` (author only) |
| `GET` | `/contributors/:story_id` | List contributors |
| `DELETE` | `/contributors/:id` | Remove a contributor (author only) |

Comments, reactions, contributors, and versions are removed automatically when their story is deleted. Only story collaborators can connect to `/api/ws/stories/:id?token=<access-token>`; the server validates the JWT and collaborator membership before accepting a connection. Saved story edits are broadcast to connected collaborators, and cursor positions are shared while editing. Story content remains persisted through the authenticated REST endpoint; polling remains as a fallback, and unsaved local drafts are preserved when remote changes arrive.

Comment reactions use optimistic UI updates with rollback on request failure. The story author can disable comments, preventing new comments, edits, and reactions while leaving existing notes visible. Comment authors can edit/delete their notes, and story authors can delete any note. Only story authors can view or restore version history; each save stores a snapshot. Profiles list authored and contributed stories. Share links use unguessable UUID tokens and open a read-only story page with X and Facebook sharing actions.

## Advanced test and collaboration notes

- `npm test` checks health and protected endpoints, invalid input handling, and token helper behavior.
- WebSocket clients must use a short-lived access JWT and an allowed `Origin`. Do not log or persist access tokens from the WebSocket query string.
- Avatar images are validated by MIME type, signature, and size and are stored as data URLs in PostgreSQL. For production deployments with many users, move image bytes to object storage and keep only the returned URL in the database.

## Deployment

Deploy PostgreSQL and the backend as separate Render services. Set the backend service root directory to this project’s monorepo root (the directory containing this README), the build command to `npm install && npm run build`, and the start command to `npm start`. Set `DATABASE_URL`, `JWT_SECRET`, `REFRESH_SECRET`, `FRONTEND_URL`, and `NODE_ENV=production`. Apply `backend/sql/schema.sql` to the PostgreSQL database before the first application request.

Deploy the frontend as a Render Static Site with the root directory set to this project’s monorepo root, build command `npm install && npm run build --workspace @story-app/types && npm run build --workspace @story-app/frontend`, and publish directory `frontend/dist`. Configure `VITE_API_URL` with the deployed API’s `/api` URL. Update `FRONTEND_URL` in the API environment to the exact static-site origin.

> For cross-site deployments where the frontend and API are on different registrable domains, configure the refresh cookie with `SameSite=None; Secure` and add an explicit CSRF defense before deployment. The default `SameSite=Lax` cookie is intended for same-site frontend/API origins.
