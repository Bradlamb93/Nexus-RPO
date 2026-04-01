const express = require('express');
const db = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const { rows } = await db.query('SELECT * FROM budgets ORDER BY care_home');
  // Return as map keyed by care_home
  const budgets = {};
  for (const b of rows) {
    budgets[b.care_home] = {
      annual: parseFloat(b.annual), monthly: parseFloat(b.monthly),
      alertAt75: b.alert_at_75, alertAt90: b.alert_at_90,
      mtdSpend: parseFloat(b.mtd_spend), ytdSpend: parseFloat(b.ytd_spend),
    };
  }
  res.json(budgets);
});

router.put('/:careHome', authenticate, async (req, res) => {
  const { annual, monthly, alertAt75, alertAt90, mtdSpend, ytdSpend } = req.body;
  const { rows } = await db.query(
    `INSERT INTO budgets (care_home, annual, monthly, alert_at_75, alert_at_90, mtd_spend, ytd_spend)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     ON CONFLICT (care_home) DO UPDATE SET annual=COALESCE($2,budgets.annual), monthly=COALESCE($3,budgets.monthly),
     alert_at_75=COALESCE($4,budgets.alert_at_75), alert_at_90=COALESCE($5,budgets.alert_at_90),
     mtd_spend=COALESCE($6,budgets.mtd_spend), ytd_spend=COALESCE($7,budgets.ytd_spend), updated_at=NOW()
     RETURNING *`,
    [req.params.careHome, annual, monthly, alertAt75, alertAt90, mtdSpend, ytdSpend]
  );
  res.json(rows[0]);
});

module.exports = router;
