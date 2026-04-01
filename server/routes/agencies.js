const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const { rows } = await db.query('SELECT * FROM agencies ORDER BY name');
  res.json(rows);
});

router.get('/:id', authenticate, async (req, res) => {
  const { rows } = await db.query('SELECT * FROM agencies WHERE id = $1', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Agency not found' });
  res.json(rows[0]);
});

router.post('/', authenticate, async (req, res) => {
  const { name, tier, contact, email, phone } = req.body;
  const { rows } = await db.query(
    `INSERT INTO agencies (name, tier, contact, email, phone) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [name, tier || 'Tier 3', contact, email, phone]
  );
  res.status(201).json(rows[0]);
});

router.put('/:id', authenticate, async (req, res) => {
  const { name, tier, contact, email, phone, status, fill_rate, compliance_score } = req.body;
  const { rows } = await db.query(
    `UPDATE agencies SET name=COALESCE($1,name), tier=COALESCE($2,tier), contact=COALESCE($3,contact),
     email=COALESCE($4,email), phone=COALESCE($5,phone), status=COALESCE($6,status),
     fill_rate=COALESCE($7,fill_rate), compliance_score=COALESCE($8,compliance_score), updated_at=NOW()
     WHERE id=$9 RETURNING *`,
    [name, tier, contact, email, phone, status, fill_rate, compliance_score, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Agency not found' });
  res.json(rows[0]);
});

router.delete('/:id', authenticate, async (req, res) => {
  const { rowCount } = await db.query('DELETE FROM agencies WHERE id = $1', [req.params.id]);
  if (rowCount === 0) return res.status(404).json({ error: 'Agency not found' });
  res.json({ message: 'Agency deleted' });
});

module.exports = router;
