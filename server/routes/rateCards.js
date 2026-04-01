const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const { type, agency, care_home } = req.query;
  let sql = 'SELECT * FROM rate_cards WHERE 1=1';
  const params = [];
  if (type) { params.push(type); sql += ` AND type = $${params.length}`; }
  if (agency) { params.push(agency); sql += ` AND agency = $${params.length}`; }
  if (care_home) { params.push(care_home); sql += ` AND care_home = $${params.length}`; }
  sql += ' ORDER BY type, agency, care_home, role';
  const { rows } = await db.query(sql, params);
  res.json(rows);
});

router.post('/', authenticate, async (req, res) => {
  const { id, type, agency, care_home, role, band, weekday, saturday, sunday, bank_holiday, night_mod, notes } = req.body;
  const rcId = id || `rc_${Date.now()}`;
  const { rows } = await db.query(
    `INSERT INTO rate_cards (id, type, agency, care_home, role, band, weekday, saturday, sunday, bank_holiday, night_mod, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [rcId, type, agency || null, care_home || null, role, band || 'Standard', weekday, saturday, sunday, bank_holiday, night_mod || 1.0, notes || '']
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', authenticate, async (req, res) => {
  const { weekday, saturday, sunday, bank_holiday, night_mod, notes, band } = req.body;
  const { rows } = await db.query(
    `UPDATE rate_cards SET weekday=COALESCE($1,weekday), saturday=COALESCE($2,saturday),
     sunday=COALESCE($3,sunday), bank_holiday=COALESCE($4,bank_holiday), night_mod=COALESCE($5,night_mod),
     notes=COALESCE($6,notes), band=COALESCE($7,band), updated_at=NOW()
     WHERE id=$8 RETURNING *`,
    [weekday, saturday, sunday, bank_holiday, night_mod, notes, band, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Rate card not found' });
  res.json(rows[0]);
});

router.delete('/:id', authenticate, async (req, res) => {
  const { rowCount } = await db.query('DELETE FROM rate_cards WHERE id = $1', [req.params.id]);
  if (rowCount === 0) return res.status(404).json({ error: 'Rate card not found' });
  res.json({ message: 'Rate card deleted' });
});

module.exports = router;
