const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ─── Client Groups ──────────────────────────────────────────────────
router.get('/groups', authenticate, async (req, res) => {
  const { rows: groups } = await db.query('SELECT * FROM client_groups ORDER BY name');
  // Attach locations to each group
  for (const g of groups) {
    const { rows: locs } = await db.query('SELECT * FROM locations WHERE group_id = $1 ORDER BY name', [g.id]);
    g.locations = locs;
  }
  res.json(groups);
});

router.get('/groups/:id', authenticate, async (req, res) => {
  const { rows } = await db.query('SELECT * FROM client_groups WHERE id = $1', [req.params.id]);
  if (rows.length === 0) return res.status(404).json({ error: 'Client group not found' });
  const group = rows[0];
  const { rows: locs } = await db.query('SELECT * FROM locations WHERE group_id = $1', [group.id]);
  group.locations = locs;
  res.json(group);
});

router.post('/groups', authenticate, async (req, res) => {
  const { id, name, type, contact, email, phone, address, contract_start, contract_end, status, notes, panel_agencies } = req.body;
  const gId = id || `cg_${Date.now()}`;
  const { rows } = await db.query(
    `INSERT INTO client_groups (id, name, type, contact, email, phone, address, contract_start, contract_end, status, notes, panel_agencies)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
    [gId, name, type, contact, email, phone, address, contract_start, contract_end, status || 'active', notes || '', panel_agencies || null]
  );
  res.status(201).json(rows[0]);
});

router.put('/groups/:id', authenticate, async (req, res) => {
  const { name, type, contact, email, phone, address, contract_start, contract_end, status, notes, panel_agencies } = req.body;
  const { rows } = await db.query(
    `UPDATE client_groups SET name=COALESCE($1,name), type=COALESCE($2,type), contact=COALESCE($3,contact),
     email=COALESCE($4,email), phone=COALESCE($5,phone), address=COALESCE($6,address),
     contract_start=COALESCE($7,contract_start), contract_end=COALESCE($8,contract_end),
     status=COALESCE($9,status), notes=COALESCE($10,notes), panel_agencies=COALESCE($11,panel_agencies),
     updated_at=NOW() WHERE id=$12 RETURNING *`,
    [name, type, contact, email, phone, address, contract_start, contract_end, status, notes, panel_agencies, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Client group not found' });
  res.json(rows[0]);
});

// ─── Locations ──────────────────────────────────────────────────────
router.get('/locations', authenticate, async (req, res) => {
  const { group_id } = req.query;
  let sql = 'SELECT * FROM locations';
  const params = [];
  if (group_id) { params.push(group_id); sql += ' WHERE group_id = $1'; }
  sql += ' ORDER BY name';
  const { rows } = await db.query(sql, params);
  res.json(rows);
});

router.post('/locations', authenticate, async (req, res) => {
  const { id, group_id, name, type, address, beds, contact, email, phone, cqc_rating, cqc_date, status, notes } = req.body;
  const lId = id || `l_${Date.now()}`;
  const { rows } = await db.query(
    `INSERT INTO locations (id, group_id, name, type, address, beds, contact, email, phone, cqc_rating, cqc_date, status, notes)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
    [lId, group_id, name, type, address, beds || 0, contact, email, phone, cqc_rating || 'Good', cqc_date, status || 'active', notes || '']
  );
  res.status(201).json(rows[0]);
});

router.put('/locations/:id', authenticate, async (req, res) => {
  const { name, type, address, beds, contact, email, phone, cqc_rating, cqc_date, status, notes } = req.body;
  const { rows } = await db.query(
    `UPDATE locations SET name=COALESCE($1,name), type=COALESCE($2,type), address=COALESCE($3,address),
     beds=COALESCE($4,beds), contact=COALESCE($5,contact), email=COALESCE($6,email), phone=COALESCE($7,phone),
     cqc_rating=COALESCE($8,cqc_rating), cqc_date=COALESCE($9,cqc_date), status=COALESCE($10,status),
     notes=COALESCE($11,notes), updated_at=NOW() WHERE id=$12 RETURNING *`,
    [name, type, address, beds, contact, email, phone, cqc_rating, cqc_date, status, notes, req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Location not found' });
  res.json(rows[0]);
});

// ─── Client Pricing ─────────────────────────────────────────────────
router.get('/pricing', authenticate, async (req, res) => {
  const { rows } = await db.query('SELECT * FROM client_pricing ORDER BY group_id');
  // Return as map keyed by group_id
  const pricing = {};
  for (const r of rows) {
    pricing[r.group_id] = { platformFee: r.platform_fee, hourlyMargin: r.hourly_margin, notes: r.notes };
  }
  res.json(pricing);
});

router.put('/pricing/:groupId', authenticate, async (req, res) => {
  const { platformFee, hourlyMargin, notes } = req.body;
  const { rows } = await db.query(
    `INSERT INTO client_pricing (group_id, platform_fee, hourly_margin, notes)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (group_id) DO UPDATE SET platform_fee=$2, hourly_margin=$3, notes=$4, updated_at=NOW()
     RETURNING *`,
    [req.params.groupId, JSON.stringify(platformFee), JSON.stringify(hourlyMargin), notes || '']
  );
  res.json(rows[0]);
});

module.exports = router;
