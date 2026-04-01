const bcrypt = require('bcryptjs');
const db = require('../config/db');
const config = require('../config/index');

async function seed() {
  console.log('Seeding database...');

  const hash = await bcrypt.hash('password123', config.bcryptRounds);

  // ─── Users ──────────────────────────────────────────────────────────
  const users = [
    { name: 'Rachel Obi', email: 'r.obi@nexusrpo.co.uk', role: 'admin', org: 'Nexus RPO', super_admin: true, sites: null },
    { name: 'Tom Bright', email: 't.bright@nexusrpo.co.uk', role: 'admin', org: 'Nexus RPO', super_admin: false, sites: null },
    { name: 'Karen Hughes', email: 'k.hughes@sunrise.co.uk', role: 'carehome', org: 'Sunrise Care', super_admin: false, sites: ['Sunrise Care'] },
    { name: 'Paul Osei', email: 'p.osei@meadowbrook.co.uk', role: 'carehome', org: 'Meadowbrook Lodge', super_admin: false, sites: ['Meadowbrook Lodge'] },
    { name: 'Janet Mills', email: 'j.mills@oakwood.co.uk', role: 'carehome', org: 'Oakwood Nursing', super_admin: false, sites: ['Oakwood Nursing'] },
    { name: 'Steve Walters', email: 's.walters@riverside.co.uk', role: 'carehome', org: 'Riverside Manor', super_admin: false, sites: ['Riverside Manor'] },
    { name: 'Margaret Cole', email: 'm.cole@sunrisehealthcare.co.uk', role: 'clientadmin', org: 'Sunrise Healthcare Group', super_admin: true, sites: ['Sunrise Care','Sunrise Dementia Unit','Oakwood Nursing'] },
    { name: 'Laura Bennett', email: 'laura@firstchoice.co.uk', role: 'agency', org: 'First Choice Nursing', super_admin: true, sites: null },
    { name: 'Daniel Reid', email: 'd.reid@procare.co.uk', role: 'agency', org: 'ProCare Staffing', super_admin: true, sites: null },
    { name: 'Priya Shah', email: 'priya@medstaff.co.uk', role: 'agency', org: 'MedStaff UK', super_admin: true, sites: null },
    { name: 'Mike Turner', email: 'mike@careforce.co.uk', role: 'agency', org: 'CareForce', super_admin: true, sites: null },
    { name: 'Diane Foster', email: 'd.foster@internal.co.uk', role: 'bank', org: 'Bank Staff', super_admin: false, sites: null },
    { name: 'Carlos Mendes', email: 'c.mendes@internal.co.uk', role: 'bank', org: 'Bank Staff', super_admin: false, sites: null },
  ];

  for (const u of users) {
    await db.query(
      `INSERT INTO users (name, email, password_hash, role, org, super_admin, status, sites, permissions)
       VALUES ($1, $2, $3, $4, $5, $6, 'active', $7, '{}')
       ON CONFLICT (email) DO NOTHING`,
      [u.name, u.email, hash, u.role, u.org, u.super_admin, u.sites]
    );
  }
  console.log('  ✓ Users seeded');

  // ─── Agencies ───────────────────────────────────────────────────────
  const agencies = [
    { name: 'First Choice Nursing', tier: 'Tier 1', contact: 'Laura Bennett', email: 'laura@firstchoice.co.uk', phone: '07700 900123', shifts_count: 42, fill_rate: 94, avg_response: '18m', compliance_score: 98, spend: 28900, joined: '2023-01-15' },
    { name: 'ProCare Staffing', tier: 'Tier 1', contact: 'Daniel Reid', email: 'd.reid@procare.co.uk', phone: '07700 900456', shifts_count: 38, fill_rate: 89, avg_response: '25m', compliance_score: 95, spend: 24650, joined: '2023-03-10' },
    { name: 'MedStaff UK', tier: 'Tier 2', contact: 'Priya Shah', email: 'priya@medstaff.co.uk', phone: '07700 900789', shifts_count: 21, fill_rate: 76, avg_response: '45m', compliance_score: 87, spend: 13200, joined: '2024-01-08' },
    { name: 'CareForce', tier: 'Tier 3', contact: 'Mike Turner', email: 'mike@careforce.co.uk', phone: '07700 900321', shifts_count: 14, fill_rate: 71, avg_response: '52m', compliance_score: 82, spend: 8750, joined: '2024-06-01' },
  ];

  for (const a of agencies) {
    await db.query(
      `INSERT INTO agencies (name, tier, contact, email, phone, shifts_count, fill_rate, avg_response, compliance_score, spend, joined)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (name) DO NOTHING`,
      [a.name, a.tier, a.contact, a.email, a.phone, a.shifts_count, a.fill_rate, a.avg_response, a.compliance_score, a.spend, a.joined]
    );
  }
  console.log('  ✓ Agencies seeded');

  // ─── Client Groups ──────────────────────────────────────────────────
  const groups = [
    { id: 'cg1', name: 'Sunrise Healthcare Group', type: 'Residential & Nursing', contact: 'Margaret Cole', email: 'm.cole@sunrisehealthcare.co.uk', phone: '0161 400 1100', address: '12 Corporate Way, Manchester, M1 4AB', contract_start: '2024-01-01', contract_end: '2026-12-31', status: 'active', notes: 'Preferred client — 3 year framework agreement', panel_agencies: [1,2,3] },
    { id: 'cg2', name: 'Lakeside Care Ltd', type: 'Nursing', contact: 'Paul Osei', email: 'p.osei@lakesidecare.co.uk', phone: '0113 500 2200', address: 'Lakeside House, Leeds, LS1 3EF', contract_start: '2024-03-01', contract_end: '2025-12-31', status: 'active', notes: 'Contract renewal due Dec 2025', panel_agencies: [1,3,4] },
    { id: 'cg3', name: 'Riverside Care Holdings', type: 'Residential', contact: 'Steve Walters', email: 's.walters@riversidecare.co.uk', phone: '0121 600 3300', address: 'Riverside House, Birmingham, B1 1TT', contract_start: '2024-06-01', contract_end: '2027-05-31', status: 'active', notes: '', panel_agencies: null },
  ];

  for (const g of groups) {
    await db.query(
      `INSERT INTO client_groups (id, name, type, contact, email, phone, address, contract_start, contract_end, status, notes, panel_agencies)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (id) DO NOTHING`,
      [g.id, g.name, g.type, g.contact, g.email, g.phone, g.address, g.contract_start, g.contract_end, g.status, g.notes, g.panel_agencies]
    );
  }
  console.log('  ✓ Client groups seeded');

  // ─── Locations ──────────────────────────────────────────────────────
  const locations = [
    { id: 'l1', group_id: 'cg1', name: 'Sunrise Care', type: 'Residential', address: '14 Park Lane, Didsbury, Manchester, M20 2GH', beds: 42, contact: 'Karen Hughes', email: 'k.hughes@sunrise.co.uk', phone: '0161 400 1101', cqc_rating: 'Good', cqc_date: '2025-04-12', status: 'active' },
    { id: 'l2', group_id: 'cg1', name: 'Sunrise Dementia Unit', type: 'Dementia', address: '22 Oak Street, Chorlton, Manchester, M21 9WQ', beds: 28, contact: 'Donna Clarke', email: 'd.clarke@sunrise.co.uk', phone: '0161 400 1102', cqc_rating: 'Outstanding', cqc_date: '2025-01-08', status: 'active' },
    { id: 'l3', group_id: 'cg2', name: 'Meadowbrook Lodge', type: 'Nursing', address: '8 Meadow Road, Headingley, Leeds, LS6 3AB', beds: 58, contact: 'Paul Osei', email: 'p.osei@meadowbrook.co.uk', phone: '0113 500 2201', cqc_rating: 'Good', cqc_date: '2024-11-20', status: 'active' },
    { id: 'l4', group_id: 'cg2', name: 'Oakwood Nursing', type: 'Dementia', address: '55 Oakwood Drive, Chapel Allerton, Leeds, LS7 4PJ', beds: 36, contact: 'Janet Mills', email: 'j.mills@oakwood.co.uk', phone: '0113 500 2202', cqc_rating: 'Requires Improvement', cqc_date: '2024-06-15', status: 'active' },
    { id: 'l5', group_id: 'cg3', name: 'Riverside Manor', type: 'Nursing', address: '1 River View, Edgbaston, Birmingham, B15 3TE', beds: 64, contact: 'Steve Walters', email: 's.walters@riverside.co.uk', phone: '0121 600 3301', cqc_rating: 'Good', cqc_date: '2025-02-28', status: 'active' },
  ];

  for (const l of locations) {
    await db.query(
      `INSERT INTO locations (id, group_id, name, type, address, beds, contact, email, phone, cqc_rating, cqc_date, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       ON CONFLICT (id) DO NOTHING`,
      [l.id, l.group_id, l.name, l.type, l.address, l.beds, l.contact, l.email, l.phone, l.cqc_rating, l.cqc_date, l.status]
    );
  }
  console.log('  ✓ Locations seeded');

  // ─── Workers ────────────────────────────────────────────────────────
  const workers = [
    { name: 'Sarah Johnson', role: 'RGN', agency: 'ProCare', email: 'sarah.j@email.com', phone: '07711 111111', dbs_status: 'valid', dbs_expiry: '2027-03-01', training_status: 'valid', training_expiry: '2026-09-15', pin: '12A3456', pin_status: true, compliance_score: 100, rtw_type: 'british_passport', rtw_ref: 'PASS-001' },
    { name: 'Mohammed Ali', role: 'HCA', agency: 'ProCare', email: 'm.ali@email.com', phone: '07711 222222', dbs_status: 'valid', dbs_expiry: '2026-12-01', training_status: 'expiring', training_expiry: '2026-04-01', pin: null, pin_status: true, compliance_score: 85, rtw_type: 'share_code', rtw_ref: 'W98X-Y7KL', rtw_expiry: '2026-09-30', visa_type: 'skilled_worker' },
    { name: 'Emma Clarke', role: 'RMN', agency: 'First Choice', email: 'emma.c@email.com', phone: '07711 333333', dbs_status: 'valid', dbs_expiry: '2027-06-01', training_status: 'valid', training_expiry: '2027-01-01', pin: '22B9871', pin_status: true, compliance_score: 100, rtw_type: 'british_passport', rtw_ref: 'PASS-002' },
    { name: 'James Wilson', role: 'RGN', agency: 'First Choice', email: 'james.w@email.com', phone: '07711 444444', dbs_status: 'expiring', dbs_expiry: '2026-04-15', training_status: 'valid', training_expiry: '2026-11-01', pin: '33C4421', pin_status: true, compliance_score: 75, rtw_type: 'share_code', rtw_ref: 'A12B-C3DE', rtw_expiry: '2026-07-31', hours_restriction: 20, visa_type: 'student' },
    { name: 'Priya Patel', role: 'HCA', agency: 'MedStaff UK', email: 'priya.p@email.com', phone: '07711 555555', dbs_status: 'valid', dbs_expiry: '2026-10-01', training_status: 'expired', training_expiry: '2025-12-01', pin: null, pin_status: false, compliance_score: 40, rtw_type: 'brp', rtw_ref: 'ZX1234567', rtw_expiry: '2026-03-31', hours_restriction: 20, visa_type: 'student', available: false },
    { name: 'Tom Richards', role: 'RGN', agency: 'CareForce', email: 'tom.r@email.com', phone: '07711 666666', dbs_status: 'valid', dbs_expiry: '2027-02-01', training_status: 'valid', training_expiry: '2026-08-01', pin: '55E3310', pin_status: true, compliance_score: 100, rtw_type: 'euss_settled', rtw_ref: 'EUSS-TOM-001' },
    { name: 'Lisa Park', role: 'HCA', agency: 'First Choice', email: 'lisa.p@email.com', phone: '07711 777777', dbs_status: 'valid', dbs_expiry: '2027-01-01', training_status: 'valid', training_expiry: '2026-12-01', pin: null, pin_status: false, compliance_score: 80, rtw_type: 'share_code', rtw_ref: 'M55N-P8QR', rtw_expiry: '2026-12-15', hours_restriction: 20, visa_type: 'student' },
  ];

  for (const w of workers) {
    await db.query(
      `INSERT INTO workers (name, role, agency, email, phone, dbs_status, dbs_expiry, training_status, training_expiry, pin, pin_status, compliance_score, available, rtw_type, rtw_ref, rtw_expiry, visa_type, hours_restriction)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
      [w.name, w.role, w.agency, w.email, w.phone, w.dbs_status, w.dbs_expiry, w.training_status, w.training_expiry, w.pin, w.pin_status, w.compliance_score, w.available !== false, w.rtw_type, w.rtw_ref, w.rtw_expiry || null, w.visa_type || null, w.hours_restriction || null]
    );
  }
  console.log('  ✓ Workers seeded');

  // ─── Shifts ─────────────────────────────────────────────────────────
  const shifts = [
    { carehome: 'Sunrise Care', role: 'RGN', date: '2026-03-12', time: '07:00–19:00', status: 'open', rate: 35, urgency: 'urgent' },
    { carehome: 'Meadowbrook Lodge', role: 'HCA', date: '2026-03-12', time: '19:00–07:00', status: 'filled', agency: 'ProCare', worker: 'Sarah Johnson', rate: 18 },
    { carehome: 'Sunrise Care', role: 'RMN', date: '2026-03-13', time: '07:00–19:00', status: 'pending', agency: 'MedStaff UK', rate: 38 },
    { carehome: 'Oakwood Nursing', role: 'HCA', date: '2026-03-13', time: '07:00–15:00', status: 'open', rate: 17, urgency: 'urgent' },
    { carehome: 'Meadowbrook Lodge', role: 'RGN', date: '2026-03-14', time: '07:00–19:00', status: 'filled', agency: 'ProCare', worker: 'Mohammed Ali', rate: 35 },
    { carehome: 'Sunrise Care', role: 'HCA', date: '2026-03-14', time: '19:00–07:00', status: 'open', rate: 18 },
    { carehome: 'Oakwood Nursing', role: 'RGN', date: '2026-03-15', time: '07:00–19:00', status: 'pending', agency: 'First Choice', rate: 35, urgency: 'high' },
    { carehome: 'Riverside Manor', role: 'RMN', date: '2026-03-08', time: '07:00–19:00', status: 'filled', agency: 'First Choice', worker: 'Emma Clarke', rate: 38 },
  ];

  for (const s of shifts) {
    await db.query(
      `INSERT INTO shifts (carehome, role, date, time, status, agency, worker, rate, urgency)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [s.carehome, s.role, s.date, s.time, s.status, s.agency || null, s.worker || null, s.rate, s.urgency || 'normal']
    );
  }
  console.log('  ✓ Shifts seeded');

  // ─── Invoices ───────────────────────────────────────────────────────
  const invoices = [
    { id: 'INV-0012', agency: 'ProCare', period: 'Feb 2026', shifts_count: 38, amount: 24650, status: 'paid', due_date: '2026-03-01', issued_date: '2026-02-28' },
    { id: 'INV-0011', agency: 'First Choice', period: 'Feb 2026', shifts_count: 42, amount: 28900, status: 'paid', due_date: '2026-03-01', issued_date: '2026-02-28' },
    { id: 'INV-0010', agency: 'MedStaff UK', period: 'Feb 2026', shifts_count: 21, amount: 13200, status: 'overdue', due_date: '2026-03-15', issued_date: '2026-02-28' },
    { id: 'INV-0009', agency: 'CareForce', period: 'Feb 2026', shifts_count: 14, amount: 8750, status: 'pending', due_date: '2026-03-15', issued_date: '2026-02-28' },
    { id: 'INV-0013', agency: 'ProCare', period: 'Mar 2026', shifts_count: 18, amount: 12100, status: 'draft', due_date: '2026-04-01', issued_date: null },
  ];

  for (const inv of invoices) {
    await db.query(
      `INSERT INTO invoices (id, agency, period, shifts_count, amount, status, due_date, issued_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (id) DO NOTHING`,
      [inv.id, inv.agency, inv.period, inv.shifts_count, inv.amount, inv.status, inv.due_date, inv.issued_date]
    );
  }
  console.log('  ✓ Invoices seeded');

  // ─── Rate Cards ─────────────────────────────────────────────────────
  const rateCards = [
    { id: 'ar1', type: 'agency', agency: 'First Choice Nursing', role: 'RGN', weekday: 32, saturday: 40, sunday: 48, bank_holiday: 64, night_mod: 1.20 },
    { id: 'ar2', type: 'agency', agency: 'First Choice Nursing', role: 'RMN', weekday: 35, saturday: 44, sunday: 52, bank_holiday: 70, night_mod: 1.25 },
    { id: 'ar3', type: 'agency', agency: 'First Choice Nursing', role: 'HCA', weekday: 16, saturday: 20, sunday: 24, bank_holiday: 32, night_mod: 1.15 },
    { id: 'ar5', type: 'agency', agency: 'ProCare Staffing', role: 'RGN', weekday: 33, saturday: 41, sunday: 49, bank_holiday: 66, night_mod: 1.20 },
    { id: 'ar6', type: 'agency', agency: 'ProCare Staffing', role: 'HCA', weekday: 17, saturday: 21, sunday: 25, bank_holiday: 34, night_mod: 1.15 },
    { id: 'cr1', type: 'client', care_home: 'Sunrise Care', role: 'RGN', weekday: 35, saturday: 43, sunday: 51, bank_holiday: 67, night_mod: 1.20 },
    { id: 'cr2', type: 'client', care_home: 'Sunrise Care', role: 'HCA', weekday: 18, saturday: 22, sunday: 26, bank_holiday: 34, night_mod: 1.15 },
    { id: 'cr4', type: 'client', care_home: 'Meadowbrook Lodge', role: 'RGN', weekday: 36, saturday: 45, sunday: 54, bank_holiday: 69, night_mod: 1.20 },
  ];

  for (const rc of rateCards) {
    await db.query(
      `INSERT INTO rate_cards (id, type, agency, care_home, role, weekday, saturday, sunday, bank_holiday, night_mod)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (id) DO NOTHING`,
      [rc.id, rc.type, rc.agency || null, rc.care_home || null, rc.role, rc.weekday, rc.saturday, rc.sunday, rc.bank_holiday, rc.night_mod]
    );
  }
  console.log('  ✓ Rate cards seeded');

  // ─── Budgets ────────────────────────────────────────────────────────
  const budgets = [
    { care_home: 'Sunrise Care', annual: 180000, monthly: 15000, mtd_spend: 8420, ytd_spend: 48200 },
    { care_home: 'Sunrise Dementia Unit', annual: 120000, monthly: 10000, mtd_spend: 6100, ytd_spend: 31400 },
    { care_home: 'Oakwood Nursing', annual: 144000, monthly: 12000, mtd_spend: 7200, ytd_spend: 39800 },
    { care_home: 'Meadowbrook Lodge', annual: 192000, monthly: 16000, mtd_spend: 9800, ytd_spend: 55100 },
    { care_home: 'Riverside Manor', annual: 168000, monthly: 14000, mtd_spend: 4200, ytd_spend: 22600 },
  ];

  for (const b of budgets) {
    await db.query(
      `INSERT INTO budgets (care_home, annual, monthly, mtd_spend, ytd_spend)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (care_home) DO NOTHING`,
      [b.care_home, b.annual, b.monthly, b.mtd_spend, b.ytd_spend]
    );
  }
  console.log('  ✓ Budgets seeded');

  // ─── Compliance Requirements ────────────────────────────────────────
  const compReqs = [
    { id: 'cr1', name: 'DBS Enhanced Certificate', type: 'document', category: 'safeguarding', applies_to_roles: ['RGN','HCA','RMN','Senior Carer'], mandatory: true, expiry_months: 36, scope: 'global', added_by: 'Nexus Admin' },
    { id: 'cr2', name: 'Mandatory Training Certificate', type: 'training', category: 'training', applies_to_roles: ['RGN','HCA','RMN','Senior Carer'], mandatory: true, expiry_months: 12, scope: 'global', added_by: 'Nexus Admin' },
    { id: 'cr3', name: 'NMC/PIN Registration', type: 'registration', category: 'registration', applies_to_roles: ['RGN','RMN'], mandatory: true, expiry_months: 12, scope: 'global', added_by: 'Nexus Admin' },
    { id: 'cr5', name: 'Right to Work Evidence', type: 'document', category: 'legal', applies_to_roles: ['RGN','HCA','RMN','Senior Carer'], mandatory: true, scope: 'global', added_by: 'Nexus Admin' },
    { id: 'cr6', name: 'Dementia Care Certificate', type: 'training', category: 'specialist', applies_to_roles: ['RGN','HCA','Senior Carer'], mandatory: true, expiry_months: 24, scope: 'site', added_by: 'Karen Hughes', care_home: 'Sunrise Care' },
  ];

  for (const c of compReqs) {
    await db.query(
      `INSERT INTO compliance_requirements (id, name, type, category, applies_to_roles, mandatory, expiry_months, scope, added_by, care_home)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (id) DO NOTHING`,
      [c.id, c.name, c.type, c.category, c.applies_to_roles, c.mandatory, c.expiry_months || null, c.scope, c.added_by, c.care_home || null]
    );
  }
  console.log('  ✓ Compliance requirements seeded');

  // ─── Timesheets ─────────────────────────────────────────────────────
  const timesheets = [
    { id: 'TS-001', shift_id: 8, agency: 'First Choice', carehome: 'Riverside Manor', worker: 'Emma Clarke', role: 'RMN', date: '2026-03-08', time: '07:00–19:00', scheduled_hrs: 12, hours_worked: 12, break_mins: 30, rate: 38, total: 456, status: 'approved', submitted_at: '2026-03-09', approved_by: 'Steve Walters' },
    { id: 'TS-002', shift_id: null, agency: 'First Choice', carehome: 'Sunrise Care', worker: 'Emma Clarke', role: 'RMN', date: '2026-03-07', time: '07:00–19:00', scheduled_hrs: 12, hours_worked: 12, break_mins: 30, rate: 38, total: 456, status: 'pending', submitted_at: '2026-03-08' },
    { id: 'TS-003', shift_id: null, agency: 'First Choice', carehome: 'Sunrise Care', worker: 'Lisa Park', role: 'HCA', date: '2026-03-09', time: '07:00–15:00', scheduled_hrs: 8, hours_worked: 8, break_mins: 30, rate: 17, total: 136, status: 'disputed', submitted_at: '2026-03-10', dispute_reason: 'Worker left 30 minutes early — hours should be 7.5, not 8.' },
    { id: 'TS-004', shift_id: 2, agency: 'ProCare', carehome: 'Meadowbrook Lodge', worker: 'Sarah Johnson', role: 'HCA', date: '2026-03-12', time: '19:00–07:00', scheduled_hrs: 12, hours_worked: 11, break_mins: 30, rate: 18, total: 198, status: 'pending', submitted_at: '2026-03-13' },
    { id: 'TS-005', shift_id: 5, agency: 'ProCare', carehome: 'Meadowbrook Lodge', worker: 'Mohammed Ali', role: 'RGN', date: '2026-03-14', time: '07:00–19:00', scheduled_hrs: 12, hours_worked: 12, break_mins: 30, rate: 35, total: 420, status: 'approved', submitted_at: '2026-03-15', approved_by: 'Paul Osei', invoice_id: 'INV-0013' },
  ];

  for (const ts of timesheets) {
    await db.query(
      `INSERT INTO timesheets (id, shift_id, agency, carehome, worker, role, date, time, scheduled_hrs, hours_worked, break_mins, rate, total, status, submitted_at, approved_by, dispute_reason, invoice_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
       ON CONFLICT (id) DO NOTHING`,
      [ts.id, ts.shift_id, ts.agency, ts.carehome, ts.worker, ts.role, ts.date, ts.time, ts.scheduled_hrs, ts.hours_worked, ts.break_mins, ts.rate, ts.total, ts.status, ts.submitted_at, ts.approved_by || null, ts.dispute_reason || null, ts.invoice_id || null]
    );
  }
  console.log('  ✓ Timesheets seeded');

  // ─── Bank Staff ─────────────────────────────────────────────────────
  const bankStaff = [
    { name: 'Diane Foster', role: 'RGN', email: 'd.foster@internal.co.uk', phone: '07800 111001', dbs_status: 'valid', dbs_expiry: '2027-05-01', training_status: 'valid', training_expiry: '2027-02-01', pin: '44F1122', pin_status: true, compliance_score: 100, hours_this_month: 36, hours_ytd: 148, earnings_ytd: 5180, contracts: ['Sunrise Care','Meadowbrook Lodge'] },
    { name: 'Carlos Mendes', role: 'HCA', email: 'c.mendes@internal.co.uk', phone: '07800 111002', dbs_status: 'valid', dbs_expiry: '2026-11-01', training_status: 'valid', training_expiry: '2026-10-01', compliance_score: 85, hours_this_month: 24, hours_ytd: 96, earnings_ytd: 1632, contracts: ['Sunrise Care','Oakwood Nursing','Riverside Manor'] },
    { name: 'Yvette Okafor', role: 'RMN', email: 'y.okafor@internal.co.uk', phone: '07800 111003', dbs_status: 'valid', dbs_expiry: '2027-08-01', training_status: 'valid', training_expiry: '2027-04-01', pin: '77Y4489', pin_status: true, compliance_score: 100, available: false, hours_this_month: 48, hours_ytd: 192, earnings_ytd: 7104, contracts: ['Meadowbrook Lodge','Riverside Manor'] },
  ];

  for (const bs of bankStaff) {
    await db.query(
      `INSERT INTO bank_staff (name, role, email, phone, dbs_status, dbs_expiry, training_status, training_expiry, pin, pin_status, compliance_score, available, hours_this_month, hours_ytd, earnings_ytd, contracts)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)`,
      [bs.name, bs.role, bs.email, bs.phone, bs.dbs_status, bs.dbs_expiry, bs.training_status, bs.training_expiry, bs.pin || null, bs.pin_status || false, bs.compliance_score, bs.available !== false, bs.hours_this_month, bs.hours_ytd, bs.earnings_ytd, bs.contracts]
    );
  }
  console.log('  ✓ Bank staff seeded');

  console.log('\nAll seeds complete.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
