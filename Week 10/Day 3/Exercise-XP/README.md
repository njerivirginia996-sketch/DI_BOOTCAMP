# JWT Authentication API

A Node.js and Express learning project demonstrating JWT authentication with HTTP-only cookies, persistent SQLite users, email verification, protected profile updates, refresh-token rotation and revocation, and rate limiting.

## Requirements and setup

Use Node.js 20 or newer. From this directory:

```powershell
npm install
$env:JWT_SECRET = 'replace-with-a-random-secret-at-least-32-characters'
$env:JWT_REFRESH_SECRET = 'use-a-different-random-secret-at-least-32-characters'
npm start
```

The API listens on port `3000` by default; set `PORT` to change it. SQLite data is stored in `data/auth.sqlite`. Set `DATABASE_PATH` to use another location. `NODE_ENV=production` enables the `Secure` cookie flag; use HTTPS in production.

Run the automated authentication flow test with `npm test`.

## JWT overview

A JWT has three Base64URL-encoded parts: a header describing the algorithm, a payload containing claims, and a signature that lets the server detect tampering. The access token is valid for 15 minutes; the refresh token is valid for 7 days. The tokens are signed with separate secrets, and the server records each refresh token ID so it can rotate and revoke refresh sessions.

Tokens are stored in `HttpOnly`, `SameSite=Strict` cookies and are not returned in JavaScript-readable response fields. The access cookie is sent to `/api`, and the refresh cookie is scoped to `/api/auth`. For cross-site deployments, review cookie and CSRF protections before changing `SameSite`.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Validate and create an account; hashes the password with bcrypt |
| `POST` | `/api/auth/verify-email` | Verify an account using its single-use, expiring token |
| `POST` | `/api/auth/login` | Check credentials and set access and refresh cookies |
| `POST` | `/api/auth/refresh` | Rotate the refresh token and issue a new access token |
| `POST` | `/api/auth/logout` | Revoke the current refresh token and clear auth cookies |
| `GET` | `/api/auth/session` | Return the authenticated user's session |
| `GET` | `/api/profile` | Read the authenticated user's profile |
| `PATCH` | `/api/profile` | Update the authenticated user's username or display name |

Registration requires a username of 3-30 letters, digits, underscores, or hyphens and a password of at least 10 characters containing an uppercase letter, lowercase letter, and digit. Accounts must verify their email before login.

In non-production mode, registration returns the one-time verification token to make the flow testable without an email provider. A real deployment should deliver the token through a trusted email service and must not expose it in the registration response.

Login is limited to 5 attempts per IP every 15 minutes; refresh is limited to 20 attempts per IP in the same window. Refresh tokens are single-use: reusing a rotated token is rejected. Logout revokes the current refresh token in SQLite. Access tokens expire quickly; applications with more demanding immediate-access-revocation requirements should also maintain an access-token denylist or use short-lived sessions.

## Example requests

Register, then use the development-only token from the response to verify:

```powershell
$registration = Invoke-RestMethod http://localhost:3000/api/auth/register -Method Post `
  -ContentType 'application/json' `
  -Body '{"username":"reader_1","email":"reader@example.com","password":"StrongPassword1"}'

Invoke-RestMethod http://localhost:3000/api/auth/verify-email -Method Post `
  -ContentType 'application/json' `
  -Body (@{ token = $registration.verificationToken } | ConvertTo-Json)
```

Use a cookie-aware HTTP client for login, `/api/profile`, refresh, and logout; the API intentionally does not return tokens in its JSON response.
