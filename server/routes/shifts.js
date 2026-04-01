const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/shifts
router.get('/', authenticate, async (req, res) => {
  const { status, carehome, role, date, agency } = req.query;
  let sql = 'SELECT * FROM shifts WHERE 1=1';
  const params = [];

  if (status) { params.push(status); sql += ` AND status = $${params.length}`; }
  if (carehome) { params.push(carehome); sql += ` AND carehome = $${params.length}`; }
  if (role) { params.push(role); sql += ` AND role = $${params.length}`; }
  if (date) { params.push(date); sql += ` AND date = $${params.length}`; }
  if (agency) { params.push(agency); sql += ` AND agency = $${params.length}`; }

  sql += ' ORDER BY date DESC, id DESC';
  const { rows } = await db.query(sql, params);
  res.json(rows);
});

// GET /api/shifts/:id
router.get('/:id', authenticate, async (req, res) => {
  const { rows } = await db.query('SELECT * FROM shifts WHERE id = $1', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Shift not found' });
  res.json(rows[0]);
});

// POST /api/shifts
router.post('/', authenticate, async (req, res) => {
  const { carehome, role, date, time, rate, urgency, notes, status, agency, worker, bank_window_mins } = req.body;
  const { rows } = await db.query(
    `INSERT INTO shifts (carehome, role, date, time, rate, urgency, notes, status, agency, worker, bank_window_mins)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [carehome, role, date, time, rate, urgency || 'normal', notes || '', status || 'open', agency || null, worker || null, bank_window_mins || 0]
  );
  res.status(201).json(rows[0]);
});

// PUT /api/shifts/:id
router.put('/:id', authenticate, async (req, res) => {
  const { carehome, role, date, time, rate, urgency, notes, status, agency, worker, claimed_by } = req.body;
  const { rows } = await db.query(
    `UPDATE shifts SET carehome=COALESCE($1,carehome), role=COALESCE($2,role), date=COALESCE($3,date),
     time=COALESCE($4,time), rate=COALESCE($5,rate), urgency=COALESCE($6,urgency), notes=COALESCE($7,notes),
     status=COALESCE($8,status), agency=$9, worker=$10, claimed_by=$11, updated_at=NOW()
     WHERE id=$12 RETURNING *`,
    [carehome, role, date, time, rate, urgency, notes, status, agency || null, worker || null, claimed_by || null, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Shift not found' });
  res.json(rows[0]);
});

// DELETE /api/shifts/:id
router.delete('/:id', authenticate, async (req, res) => {
  const { rowCount } = await db.query('DELETE FROM shifts WHERE id = $1', [req.params.id]);
  if (rowCount === 0) return res.status(404).json({ error: 'Shift not found' });
  res.json({ message: 'Shift deleted' });
});

module.exports = router;
