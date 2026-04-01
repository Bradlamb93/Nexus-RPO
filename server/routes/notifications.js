const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const { role } = req.query;
  let sql = 'SELECT * FROM notifications WHERE 1=1';
  const params = [];
  if (role) { params.push(role); sql += ` AND role = $${params.length}`; }
  sql += ' ORDER BY created_at DESC';
  const { rows } = await db.query(sql, params);
  res.json(rows);
});

router.put('/:id/read', authenticate, async (req, res) => {
  const { rows } = await db.query(
    'UPDATE notifications SET read = TRUE WHERE id = $1 RETURNING *',
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Notification not found' });
  res.json(rows[0]);
});

router.post('/mark-all-read', authenticate, async (req, res) => {
  await db.query('UPDATE notifications SET read = TRUE WHERE role = $1', [req.user.role]);
  res.json({ message: 'All notifications marked as read' });
});

module.exports = router;
