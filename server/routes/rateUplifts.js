const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const { status, agency } = req.query;
  let sql = 'SELECT * FROM rate_uplifts WHERE 1=1';
  const params = [];
  if (status) { params.push(status); sql += ` AND status = $${params.length}`; }
  if (agency) { params.push(agency); sql += ` AND agency = $${params.length}`; }
  sql += ' ORDER BY submitted_date DESC';
  const { rows } = await db.query(sql, params);
  res.json(rows);
});

router.post('/', authenticate, async (req, res) => {
  const { id, agency, role, current_rate, requested_rate, reason } = req.body;
  const ruId = id || `ru_${Date.now()}`;
  const { rows } = await db.query(
    `INSERT INTO rate_uplifts (id, agency, role, current_rate, requested_rate, reason, status, submitted_date)
     VALUES ($1,$2,$3,$4,$5,$6,'pending',NOW()) RETURNING *`,
    [ruId, agency, role, current_rate, requested_rate, reason]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', authenticate, async (req, res) => {
  const { status, responded_by, notes } = req.body;
  const { rows } = await db.query(
    `UPDATE rate_uplifts SET status=COALESCE($1,status), responded_date=NOW(),
     responded_by=COALESCE($2,responded_by), notes=COALESCE($3,notes)
     WHERE id=$4 RETURNING *`,
    [status, responded_by, notes, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Rate uplift not found' });
  res.json(rows[0]);
});

module.exports = router;
