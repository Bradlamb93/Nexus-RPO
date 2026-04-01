const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const { status, agency } = req.query;
  let sql = 'SELECT * FROM invoices WHERE 1=1';
  const params = [];
  if (status) { params.push(status); sql += ` AND status = $${params.length}`; }
  if (agency) { params.push(agency); sql += ` AND agency = $${params.length}`; }
  sql += ' ORDER BY due_date DESC';
  const { rows } = await db.query(sql, params);
  res.json(rows);
});

router.get('/:id', authenticate, async (req, res) => {
  const { rows } = await db.query('SELECT * FROM invoices WHERE id = $1', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
  res.json(rows[0]);
});

router.post('/', authenticate, async (req, res) => {
  const { id, agency, period, shifts_count, amount, status, due_date } = req.body;
  const invId = id || `INV-${Date.now()}`;
  const { rows } = await db.query(
    `INSERT INTO invoices (id, agency, period, shifts_count, amount, status, due_date, issued_date)
     VALUES ($1,$2,$3,$4,$5,$6,$7,NOW()::text) RETURNING *`,
    [invId, agency, period, shifts_count || 0, amount, status || 'draft', due_date]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', authenticate, async (req, res) => {
  const { status, amount, shifts_count } = req.body;
  const { rows } = await db.query(
    `UPDATE invoices SET status=COALESCE($1,status), amount=COALESCE($2,amount),
     shifts_count=COALESCE($3,shifts_count), updated_at=NOW()
     WHERE id=$4 RETURNING *`,
    [status, amount, shifts_count, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Invoice not found' });
  res.json(rows[0]);
});

module.exports = router;
