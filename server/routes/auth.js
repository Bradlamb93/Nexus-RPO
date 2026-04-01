const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const config = require('../config');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Generate tokens
function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, org: user.org, name: user.name, superAdmin: user.super_admin },
    config.jwtSecret,
    { expiresIn: config.jwtExpiry }
  );
  const refreshToken = jwt.sign(
    { id: user.id, type: 'refresh' },
    config.jwtSecret,
    { expiresIn: config.jwtRefreshExpiry }
  );
  return { accessToken, refreshToken };
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
  const user = rows[0];
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.status !== 'active') {
    return res.status(403).json({ error: 'Account is not active' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const tokens = generateTokens(user);

  // Store refresh token
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db.query(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
    [user.id, tokens.refreshToken, expiresAt]
  );

  // Update last login
  await db.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

  res.json({
    user: {
      id: user.id, name: user.name, email: user.email, role: user.role,
      org: user.org, superAdmin: user.super_admin, sites: user.sites,
      permissions: user.permissions,
    },
    ...tokens,
  });
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role, org } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password required' });
  }

  const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
  if (existing.rows.length > 0) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const hash = await bcrypt.hash(password, config.bcryptRounds);
  const { rows } = await db.query(
    `INSERT INTO users (name, email, password_hash, role, org, status)
     VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *`,
    [name, email.toLowerCase(), hash, role || 'carehome', org || '']
  );

  const user = rows[0];
  const tokens = generateTokens(user);

  res.status(201).json({
    user: {
      id: user.id, name: user.name, email: user.email, role: user.role,
      org: user.org, superAdmin: user.super_admin,
    },
    ...tokens,
  });
});

// POST /api/auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }

  try {
    const payload = jwt.verify(refreshToken, config.jwtSecret);
    const { rows } = await db.query(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2 AND expires_at > NOW()',
      [refreshToken, payload.id]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [payload.id]);
    const user = userResult.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Delete old token, issue new
    await db.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
    const tokens = generateTokens(user);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await db.query(
      'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, tokens.refreshToken, expiresAt]
    );

    res.json(tokens);
  } catch {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  const { rows } = await db.query(
    'SELECT id, name, email, role, org, super_admin, permissions, sites, status FROM users WHERE id = $1',
    [req.user.id]
  );
  if (rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }
  const u = rows[0];
  res.json({
    id: u.id, name: u.name, email: u.email, role: u.role,
    org: u.org, superAdmin: u.super_admin, permissions: u.permissions,
    sites: u.sites, status: u.status,
  });
});

// POST /api/auth/logout
router.post('/logout', authenticate, async (req, res) => {
  await db.query('DELETE FROM refresh_tokens WHERE user_id = $1', [req.user.id]);
  res.json({ message: 'Logged out' });
});

module.exports = router;
