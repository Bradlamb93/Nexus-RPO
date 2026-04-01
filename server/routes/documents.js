const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const { worker, status } = req.query;
  let sql = 'SELECT * FROM documents WHERE 1=1';
  const params = [];
  if (worker) { params.push(worker); sql += ` AND worker = $${params.length}`; }
  if (status) { params.push(status); sql += ` AND status = $${params.length}`; }
  sql += ' ORDER BY expires ASC';
  const { rows } = await db.query(sql, params);
  res.json(rows);
});

router.post('/', authenticate, async (req, res) => {
  const { worker, type, uploaded, expires, status } = req.body;
  const { rows } = await db.query(
    `INSERT INTO documents (worker, type, uploaded, expires, status) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
    [worker, type, uploaded || new Date(), expires, status || 'verified']
  );
  res.status(201).json(rows[0]);
});

module.exports = router;
