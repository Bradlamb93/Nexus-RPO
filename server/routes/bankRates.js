const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/bank-rates — return structured global + sites format
router.get('/', authenticate, async (req, res) => {
  const { rows } = await db.query('SELECT * FROM bank_rates ORDER BY scope, role');
  const result = { global: [], sites: {} };
  for (const r of rows) {
    const entry = { id: r.id, role: r.role, weekday: parseFloat(r.weekday), saturday: parseFloat(r.saturday), sunday: parseFloat(r.sunday), bankHoliday: parseFloat(r.bank_holiday), nightMod: parseFloat(r.night_mod), notes: r.notes || '' };
    if (r.scope === 'global') {
      result.global.push(entry);
    } else {
      const site = r.site || r.scope;
      if (!result.sites[site]) result.sites[site] = [];
      result.sites[site].push(entry);
    }
  }
  res.json(result);
});

router.post('/', authenticate, async (req, res) => {
  const { id, scope, site, role, weekday, saturday, sunday, bankHoliday, nightMod, notes } = req.body;
  const brId = id || `br${Date.now()}`;
  const { rows } = await db.query(
    `INSERT INTO bank_rates (id, scope, site, role, weekday, saturday, sunday, bank_holiday, night_mod, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [brId, scope || 'global', site || null, role, weekday, saturday, sunday, bankHoliday, nightMod || 1.0, notes || '']
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', authenticate, async (req, res) => {
  const { weekday, saturday, sunday, bankHoliday, nightMod, notes } = req.body;
  const { rows } = await db.query(
    `UPDATE bank_rates SET weekday=COALESCE($1,weekday), saturday=COALESCE($2,saturday),
     sunday=COALESCE($3,sunday), bank_holiday=COALESCE($4,bank_holiday), night_mod=COALESCE($5,night_mod),
     notes=COALESCE($6,notes), updated_at=NOW() WHERE id=$7 RETURNING *`,
    [weekday, saturday, sunday, bankHoliday, nightMod, notes, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Bank rate not found' });
  res.json(rows[0]);
});

router.delete('/:id', authenticate, async (req, res) => {
  const { rowCount } = await db.query('DELETE FROM bank_rates WHERE id = $1', [req.params.id]);
  if (rowCount === 0) return res.status(404).json({ error: 'Bank rate not found' });
  res.json({ message: 'Bank rate deleted' });
});

module.exports = router;
