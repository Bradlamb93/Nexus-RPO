const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const { scope, care_home } = req.query;
  let sql = 'SELECT * FROM compliance_requirements WHERE 1=1';
  const params = [];
  if (scope) { params.push(scope); sql += ` AND scope = $${params.length}`; }
  if (care_home) { params.push(care_home); sql += ` AND care_home = $${params.length}`; }
  sql += ' ORDER BY name';
  const { rows } = await db.query(sql, params);
  res.json(rows);
});

router.post('/', authenticate, async (req, res) => {
  const { id, name, type, category, applies_to_roles, mandatory, expiry_months, scope, added_by, care_home, notes } = req.body;
  const crId = id || `cr_${Date.now()}`;
  const { rows } = await db.query(
    `INSERT INTO compliance_requirements (id, name, type, category, applies_to_roles, mandatory, expiry_months, scope, added_by, care_home, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [crId, name, type, category, applies_to_roles, mandatory, expiry_months || null, scope || 'global', added_by, care_home || null, notes || '']
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', authenticate, async (req, res) => {
  const { name, mandatory, active, expiry_months, notes } = req.body;
  const { rows } = await db.query(
    `UPDATE compliance_requirements SET name=COALESCE($1,name), mandatory=COALESCE($2,mandatory),
     active=COALESCE($3,active), expiry_months=COALESCE($4,expiry_months), notes=COALESCE($5,notes),
     updated_at=NOW() WHERE id=$6 RETURNING *`,
    [name, mandatory, active, expiry_months, notes, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Requirement not found' });
  res.json(rows[0]);
});

router.delete('/:id', authenticate, async (req, res) => {
  const { rowCount } = await db.query('DELETE FROM compliance_requirements WHERE id = $1', [req.params.id]);
  if (rowCount === 0) return res.status(404).json({ error: 'Requirement not found' });
  res.json({ message: 'Requirement deleted' });
});

module.exports = router;
