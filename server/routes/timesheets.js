const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const { status, agency, carehome } = req.query;
  let sql = 'SELECT * FROM timesheets WHERE 1=1';
  const params = [];
  if (status) { params.push(status); sql += ` AND status = $${params.length}`; }
  if (agency) { params.push(agency); sql += ` AND agency = $${params.length}`; }
  if (carehome) { params.push(carehome); sql += ` AND carehome = $${params.length}`; }
  sql += ' ORDER BY date DESC';
  const { rows } = await db.query(sql, params);
  res.json(rows);
});

router.get('/:id', authenticate, async (req, res) => {
  const { rows } = await db.query('SELECT * FROM timesheets WHERE id = $1', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Timesheet not found' });
  res.json(rows[0]);
});

router.post('/', authenticate, async (req, res) => {
  const { id, shift_id, agency, carehome, worker, role, date, time, scheduled_hrs, hours_worked, break_mins, rate, total, status } = req.body;
  const tsId = id || `TS-${Date.now()}`;
  const { rows } = await db.query(
    `INSERT INTO timesheets (id, shift_id, agency, carehome, worker, role, date, time, scheduled_hrs, hours_worked, break_mins, rate, total, status, submitted_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,NOW()) RETURNING *`,
    [tsId, shift_id || null, agency, carehome, worker, role, date, time, scheduled_hrs, hours_worked, break_mins || 0, rate, total, status || 'pending']
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', authenticate, async (req, res) => {
  const { status, approved_by, dispute_reason, hours_worked, invoice_id } = req.body;
  const { rows } = await db.query(
    `UPDATE timesheets SET status=COALESCE($1,status), approved_by=COALESCE($2,approved_by),
     dispute_reason=COALESCE($3,dispute_reason), hours_worked=COALESCE($4,hours_worked),
     invoice_id=COALESCE($5,invoice_id), updated_at=NOW()
     WHERE id=$6 RETURNING *`,
    [status, approved_by, dispute_reason, hours_worked, invoice_id, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Timesheet not found' });
  res.json(rows[0]);
});

module.exports = router;
