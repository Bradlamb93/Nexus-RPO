const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const { rows } = await db.query('SELECT * FROM bank_staff ORDER BY name');
  res.json(rows);
});

router.get('/:id', authenticate, async (req, res) => {
  const { rows } = await db.query('SELECT * FROM bank_staff WHERE id = $1', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Bank staff not found' });
  res.json(rows[0]);
});

router.post('/', authenticate, async (req, res) => {
  const { name, role, email, phone, contracts } = req.body;
  const { rows } = await db.query(
    `INSERT INTO bank_staff (name, role, email, phone, contracts)
     VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [name, role, email, phone, contracts || []]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', authenticate, async (req, res) => {
  const { name, role, email, phone, available, dbs_status, dbs_expiry, training_status, training_expiry, compliance_score, contracts } = req.body;
  const { rows } = await db.query(
    `UPDATE bank_staff SET name=COALESCE($1,name), role=COALESCE($2,role), email=COALESCE($3,email),
     phone=COALESCE($4,phone), available=COALESCE($5,available), dbs_status=COALESCE($6,dbs_status),
     dbs_expiry=COALESCE($7,dbs_expiry), training_status=COALESCE($8,training_status),
     training_expiry=COALESCE($9,training_expiry), compliance_score=COALESCE($10,compliance_score),
     contracts=COALESCE($11,contracts), updated_at=NOW()
     WHERE id=$12 RETURNING *`,
    [name, role, email, phone, available, dbs_status, dbs_expiry, training_status, training_expiry, compliance_score, contracts, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Bank staff not found' });
  res.json(rows[0]);
});

module.exports = router;
