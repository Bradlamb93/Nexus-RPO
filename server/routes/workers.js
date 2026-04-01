const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const { agency, role } = req.query;
  let sql = 'SELECT * FROM workers WHERE 1=1';
  const params = [];
  if (agency) { params.push(agency); sql += ` AND agency = $${params.length}`; }
  if (role) { params.push(role); sql += ` AND role = $${params.length}`; }
  sql += ' ORDER BY name';
  const { rows } = await db.query(sql, params);
  res.json(rows);
});

router.get('/:id', authenticate, async (req, res) => {
  const { rows } = await db.query('SELECT * FROM workers WHERE id = $1', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Worker not found' });
  res.json(rows[0]);
});

router.post('/', authenticate, async (req, res) => {
  const { name, role, agency, email, phone, dbs_status, dbs_expiry, training_status, training_expiry, pin, rtw_type, rtw_ref, rtw_expiry, visa_type, hours_restriction } = req.body;
  const { rows } = await db.query(
    `INSERT INTO workers (name, role, agency, email, phone, dbs_status, dbs_expiry, training_status, training_expiry, pin, rtw_type, rtw_ref, rtw_expiry, visa_type, hours_restriction)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
    [name, role, agency, email, phone, dbs_status || 'valid', dbs_expiry, training_status || 'valid', training_expiry, pin || null, rtw_type || null, rtw_ref || null, rtw_expiry || null, visa_type || null, hours_restriction || null]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', authenticate, async (req, res) => {
  const { name, role, agency, email, phone, dbs_status, dbs_expiry, training_status, training_expiry, compliance_score, available, rtw_type, rtw_ref, rtw_expiry, rtw_verified, visa_type, hours_restriction } = req.body;
  const { rows } = await db.query(
    `UPDATE workers SET name=COALESCE($1,name), role=COALESCE($2,role), agency=COALESCE($3,agency),
     email=COALESCE($4,email), phone=COALESCE($5,phone), dbs_status=COALESCE($6,dbs_status),
     dbs_expiry=COALESCE($7,dbs_expiry), training_status=COALESCE($8,training_status),
     training_expiry=COALESCE($9,training_expiry), compliance_score=COALESCE($10,compliance_score),
     available=COALESCE($11,available), rtw_type=COALESCE($12,rtw_type), rtw_ref=COALESCE($13,rtw_ref),
     rtw_expiry=$14, rtw_verified=$15, visa_type=$16, hours_restriction=$17, updated_at=NOW()
     WHERE id=$18 RETURNING *`,
    [name, role, agency, email, phone, dbs_status, dbs_expiry, training_status, training_expiry, compliance_score, available, rtw_type, rtw_ref, rtw_expiry || null, rtw_verified || null, visa_type || null, hours_restriction || null, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Worker not found' });
  res.json(rows[0]);
});

router.delete('/:id', authenticate, async (req, res) => {
  const { rowCount } = await db.query('DELETE FROM workers WHERE id = $1', [req.params.id]);
  if (rowCount === 0) return res.status(404).json({ error: 'Worker not found' });
  res.json({ message: 'Worker deleted' });
});

module.exports = router;
