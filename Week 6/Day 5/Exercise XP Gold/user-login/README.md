# User Login API

Users are stored in memory for this exercise, so they are cleared when the server restarts. Passwords are bcrypt-hashed, and successful login returns a one-hour JWT. Accounts are locked for 15 minutes after five failed login attempts.

Set a private JWT secret before starting the server. In PowerShell:

```powershell
$env:JWT_SECRET = 'replace-with-a-long-random-secret'
npm start
```

The server listens on port 5000 by default. Set `PORT` to use a different port.