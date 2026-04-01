const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const { rows } = await db.query('SELECT * FROM credit_notes ORDER BY issued_date DESC');
  res.json(rows);
});

router.post('/', authenticate, async (req, res) => {
  const { id, invoice_ref, agency, reason, amount, status } = req.body;
  const cnId = id || `CN-${Date.now()}`;
  const { rows } = await db.query(
    `INSERT INTO credit_notes (id, invoice_ref, agency, reason, amount, issued_date, status)
     VALUES ($1,$2,$3,$4,$5,NOW(),$6) RETURNING *`,
    [cnId, invoice_ref, agency, reason, amount, status || 'pending']
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', authenticate, async (req, res) => {
  const { status } = req.body;
  const { rows } = await db.query(
    'UPDATE credit_notes SET status = $1 WHERE id = $2 RETURNING *',
    [status, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Credit note not found' });
  res.json(rows[0]);
});

module.exports = router;
