const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 5000;
const jwtSecret = process.env.JWT_SECRET;
const usersByEmail = new Map();
const usersById = new Map();
const lockoutDurationMs = 15 * 60 * 1000;
const maxFailedAttempts = 5;
let nextUserId = 1;

if (!jwtSecret) {
  throw new Error('Set JWT_SECRET in the environment before starting the server.');
}

app.use(express.json());

function isValidPassword(password) {
  return typeof password === 'string'
    && password.length >= 8
    && /[a-z]/.test(password)
    && /[A-Z]/.test(password)
    && /\d/.test(password);
}

function authenticate(request, response, next) {
  const authorization = request.get('authorization') || '';
  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ error: 'A bearer token is required.' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = usersById.get(Number(payload.sub));
    if (!user) {
      return response.status(401).json({ error: 'The token is not valid for an active user.' });
    }
    request.user = user;
    next();
  } catch {
    response.status(401).json({ error: 'The token is invalid or expired.' });
  }
}

app.post('/api/register', async (request, response) => {
  const { name, email, password } = request.body || {};
  if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
    return response.status(400).json({ error: 'A name and valid email are required.' });
  }
  if (!isValidPassword(password)) {
    return response.status(400).json({ error: 'Password must be at least 8 characters and include uppercase, lowercase, and a number.' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (usersByEmail.has(normalizedEmail)) {
    return response.status(409).json({ error: 'An account with that email already exists.' });
  }

  try {
    const user = {
      id: nextUserId++,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12),
      role: 'user',
      failedAttempts: 0,
      lockedUntil: 0,
    };
    usersByEmail.set(normalizedEmail, user);
    usersById.set(user.id, user);
    response.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch {
    response.status(500).json({ error: 'Could not register the user.' });
  }
});

app.post('/api/login', async (request, response) => {
  const { email, password } = request.body || {};
  if (typeof email !== 'string' || typeof password !== 'string') {
    return response.status(400).json({ error: 'Email and password are required.' });
  }

  const user = usersByEmail.get(email.trim().toLowerCase());
  if (!user) {
    return response.status(401).json({ error: 'Invalid email or password.' });
  }
  if (user.lockedUntil > Date.now()) {
    return response.status(423).json({ error: 'Account is temporarily locked. Try again later.' });
  }
  if (user.lockedUntil) {
    user.lockedUntil = 0;
    user.failedAttempts = 0;
  }

  try {
    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      user.failedAttempts += 1;
      if (user.failedAttempts >= maxFailedAttempts) {
        user.lockedUntil = Date.now() + lockoutDurationMs;
        return response.status(423).json({ error: 'Account is temporarily locked. Try again later.' });
      }
      return response.status(401).json({ error: 'Invalid email or password.' });
    }

    user.failedAttempts = 0;
    user.lockedUntil = 0;
    const token = jwt.sign({ role: user.role }, jwtSecret, {
      subject: String(user.id),
      expiresIn: '1h',
    });
    response.json({ token });
  } catch {
    response.status(500).json({ error: 'Could not log in.' });
  }
});

app.get('/api/profile', authenticate, (request, response) => {
  const { id, name, email, role } = request.user;
  response.json({ id, name, email, role });
});

app.listen(port, () => {
  console.log(`User login API listening on port ${port}`);
});