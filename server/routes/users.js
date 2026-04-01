const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db');
const config = require('../config');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const { role, org } = req.query;
  let sql = 'SELECT id, name, email, role, org, status, super_admin, permissions, sites, last_login, created_at FROM users WHERE 1=1';
  const params = [];
  if (role) { params.push(role); sql += ` AND role = $${params.length}`; }
  if (org) { params.push(org); sql += ` AND org = $${params.length}`; }
  sql += ' ORDER BY name';
  const { rows } = await db.query(sql, params);
  res.json(rows.map(u => ({
    id: u.id, name: u.name, email: u.email, role: u.role, org: u.org,
    status: u.status, superAdmin: u.super_admin, perms: u.permissions,
    sites: u.sites, lastLogin: u.last_login, createdAt: u.created_at,
  })));
});

router.post('/', authenticate, requireRole('admin'), async (req, res) => {
  const { name, email, password, role, org, superAdmin, perms, sites } = req.body;
  const hash = await bcrypt.hash(password || 'Welcome123!', config.bcryptRounds);
  const { rows } = await db.query(
    `INSERT INTO users (name, email, password_hash, role, org, super_admin, permissions, sites, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'active') RETURNING id, name, email, role, org, super_admin, permissions, sites, status`,
    [name, email.toLowerCase(), hash, role, org || '', superAdmin || false, JSON.stringify(perms || {}), sites || null]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', authenticate, async (req, res) => {
  const { name, email, role, org, status, superAdmin, perms, sites } = req.body;
  const { rows } = await db.query(
    `UPDATE users SET name=COALESCE($1,name), email=COALESCE($2,email), role=COALESCE($3,role),
     org=COALESCE($4,org), status=COALESCE($5,status), super_admin=COALESCE($6,super_admin),
     permissions=COALESCE($7,permissions), sites=COALESCE($8,sites), updated_at=NOW()
     WHERE id=$9 RETURNING id, name, email, role, org, super_admin, permissions, sites, status`,
    [name, email, role, org, status, superAdmin, perms ? JSON.stringify(perms) : null, sites, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
  res.json(rows[0]);
});

router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
  if (rowCount === 0) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted' });
});

module.exports = router;
