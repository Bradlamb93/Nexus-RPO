-- ============================================
-- First Choice Connect — Initial Schema
-- ============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS ──────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin','clientadmin','carehome','agency','bank')),
  org VARCHAR(255),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active','inactive','suspended','invited')),
  super_admin BOOLEAN DEFAULT FALSE,
  permissions JSONB DEFAULT '{}',
  sites TEXT[], -- array of care home names this user can access
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AGENCIES ───────────────────────────────────────────────────────────────────
CREATE TABLE agencies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  tier VARCHAR(20) NOT NULL DEFAULT 'Tier 3',
  contact VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  shifts_count INT DEFAULT 0,
  fill_rate DECIMAL(5,2) DEFAULT 0,
  avg_response VARCHAR(20),
  compliance_score INT DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  spend DECIMAL(12,2) DEFAULT 0,
  joined DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CLIENT GROUPS ──────────────────────────────────────────────────────────────
CREATE TABLE client_groups (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  contact VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  website VARCHAR(255),
  contract_start DATE,
  contract_end DATE,
  status VARCHAR(50) DEFAULT 'active',
  notes TEXT,
  panel_agencies INT[], -- agency IDs
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── LOCATIONS (CARE HOMES) ────────────────────────────────────────────────────
CREATE TABLE locations (
  id VARCHAR(50) PRIMARY KEY,
  group_id VARCHAR(50) REFERENCES client_groups(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  address TEXT,
  beds INT DEFAULT 0,
  contact VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  cqc_rating VARCHAR(50),
  cqc_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── WORKERS ────────────────────────────────────────────────────────────────────
CREATE TABLE workers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  agency VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  dbs_status VARCHAR(20) DEFAULT 'valid',
  dbs_expiry DATE,
  training_status VARCHAR(20) DEFAULT 'valid',
  training_expiry DATE,
  pin VARCHAR(50),
  pin_status BOOLEAN DEFAULT FALSE,
  compliance_score INT DEFAULT 0,
  available BOOLEAN DEFAULT TRUE,
  -- Right to work
  rtw_type VARCHAR(50),
  rtw_ref VARCHAR(100),
  rtw_expiry DATE,
  rtw_verified DATE,
  rtw_verified_by VARCHAR(255),
  hours_restriction INT,
  visa_type VARCHAR(100),
  rtw_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BANK STAFF ─────────────────────────────────────────────────────────────────
CREATE TABLE bank_staff (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  dbs_status VARCHAR(20) DEFAULT 'valid',
  dbs_expiry DATE,
  training_status VARCHAR(20) DEFAULT 'valid',
  training_expiry DATE,
  pin VARCHAR(50),
  pin_status BOOLEAN DEFAULT FALSE,
  compliance_score INT DEFAULT 0,
  available BOOLEAN DEFAULT TRUE,
  hours_this_month DECIMAL(6,1) DEFAULT 0,
  hours_ytd DECIMAL(8,1) DEFAULT 0,
  earnings_ytd DECIMAL(10,2) DEFAULT 0,
  contracts TEXT[], -- care home names
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SHIFTS ─────────────────────────────────────────────────────────────────────
CREATE TABLE shifts (
  id SERIAL PRIMARY KEY,
  carehome VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open','pending','filled','bank-open','bank-claimed','cancelled')),
  agency VARCHAR(255),
  worker VARCHAR(255),
  rate DECIMAL(8,2),
  urgency VARCHAR(20) DEFAULT 'normal',
  notes TEXT,
  claimed_by VARCHAR(255),
  bank_window_mins INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TIMESHEETS ─────────────────────────────────────────────────────────────────
CREATE TABLE timesheets (
  id VARCHAR(50) PRIMARY KEY,
  shift_id INT REFERENCES shifts(id),
  agency VARCHAR(255),
  carehome VARCHAR(255),
  worker VARCHAR(255),
  role VARCHAR(50),
  date DATE,
  time VARCHAR(50),
  scheduled_hrs DECIMAL(5,1),
  hours_worked DECIMAL(5,1),
  break_mins INT DEFAULT 0,
  rate DECIMAL(8,2),
  total DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending','approved','disputed','invoiced')),
  submitted_at DATE,
  approved_by VARCHAR(255),
  dispute_reason TEXT,
  invoice_id VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INVOICES ───────────────────────────────────────────────────────────────────
CREATE TABLE invoices (
  id VARCHAR(50) PRIMARY KEY,
  agency VARCHAR(255),
  period VARCHAR(50),
  shifts_count INT DEFAULT 0,
  amount DECIMAL(12,2),
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft','pending','paid','overdue')),
  due_date DATE,
  issued_date VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RATE CARDS ─────────────────────────────────────────────────────────────────
CREATE TABLE rate_cards (
  id VARCHAR(50) PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('agency','client')),
  agency VARCHAR(255),
  care_home VARCHAR(255),
  role VARCHAR(50) NOT NULL,
  band VARCHAR(50) DEFAULT 'Standard',
  weekday DECIMAL(8,2),
  saturday DECIMAL(8,2),
  sunday DECIMAL(8,2),
  bank_holiday DECIMAL(8,2),
  night_mod DECIMAL(4,2) DEFAULT 1.00,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CLIENT PRICING ─────────────────────────────────────────────────────────────
CREATE TABLE client_pricing (
  id SERIAL PRIMARY KEY,
  group_id VARCHAR(50) UNIQUE REFERENCES client_groups(id) ON DELETE CASCADE,
  platform_fee JSONB DEFAULT '{"enabled":false,"value":2.5}',
  hourly_margin JSONB DEFAULT '{"enabled":true,"type":"fixed","usePerRole":true,"globalValue":2.50,"perRole":{}}',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── COMPLIANCE REQUIREMENTS ────────────────────────────────────────────────────
CREATE TABLE compliance_requirements (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50),
  category VARCHAR(50),
  applies_to_roles TEXT[],
  mandatory BOOLEAN DEFAULT TRUE,
  expiry_months INT,
  scope VARCHAR(20) DEFAULT 'global',
  added_by VARCHAR(255),
  care_home VARCHAR(255),
  active BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── DOCUMENTS ──────────────────────────────────────────────────────────────────
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  worker VARCHAR(255),
  type VARCHAR(100),
  uploaded DATE,
  expires DATE,
  status VARCHAR(50) DEFAULT 'verified',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BUDGETS ────────────────────────────────────────────────────────────────────
CREATE TABLE budgets (
  id SERIAL PRIMARY KEY,
  care_home VARCHAR(255) UNIQUE NOT NULL,
  annual DECIMAL(12,2),
  monthly DECIMAL(12,2),
  alert_at_75 BOOLEAN DEFAULT TRUE,
  alert_at_90 BOOLEAN DEFAULT TRUE,
  mtd_spend DECIMAL(12,2) DEFAULT 0,
  ytd_spend DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BANK RATES ─────────────────────────────────────────────────────────────────
CREATE TABLE bank_rates (
  id VARCHAR(50) PRIMARY KEY,
  scope VARCHAR(20) DEFAULT 'global', -- 'global' or site name
  site VARCHAR(255),
  role VARCHAR(50) NOT NULL,
  weekday DECIMAL(8,2),
  saturday DECIMAL(8,2),
  sunday DECIMAL(8,2),
  bank_holiday DECIMAL(8,2),
  night_mod DECIMAL(4,2) DEFAULT 1.00,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RATE UPLIFTS ───────────────────────────────────────────────────────────────
CREATE TABLE rate_uplifts (
  id VARCHAR(50) PRIMARY KEY,
  agency VARCHAR(255),
  role VARCHAR(50),
  current_rate DECIMAL(8,2),
  requested_rate DECIMAL(8,2),
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  submitted_date DATE,
  responded_date DATE,
  responded_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CREDIT NOTES ───────────────────────────────────────────────────────────────
CREATE TABLE credit_notes (
  id VARCHAR(50) PRIMARY KEY,
  invoice_ref VARCHAR(50),
  agency VARCHAR(255),
  reason TEXT,
  amount DECIMAL(10,2),
  issued_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── NOTIFICATIONS ──────────────────────────────────────────────────────────────
CREATE TABLE notifications (
  id VARCHAR(50) PRIMARY KEY,
  role VARCHAR(50) NOT NULL,
  type VARCHAR(50),
  title VARCHAR(255),
  body TEXT,
  time VARCHAR(50),
  read BOOLEAN DEFAULT FALSE,
  action VARCHAR(50),
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── RECURRING PATTERNS ─────────────────────────────────────────────────────────
CREATE TABLE recurring_patterns (
  id VARCHAR(50) PRIMARY KEY,
  carehome VARCHAR(255),
  role VARCHAR(50),
  days TEXT[],
  time VARCHAR(50),
  rate DECIMAL(8,2),
  active BOOLEAN DEFAULT TRUE,
  created_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── WORKER PREFERENCES ────────────────────────────────────────────────────────
CREATE TABLE worker_preferences (
  id SERIAL PRIMARY KEY,
  care_home VARCHAR(255),
  worker_id INT,
  worker_name VARCHAR(255),
  type VARCHAR(20) CHECK (type IN ('favourite','blocked')),
  added_by VARCHAR(255),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AGENCY CHECKLISTS ──────────────────────────────────────────────────────────
CREATE TABLE agency_checklists (
  id VARCHAR(50) PRIMARY KEY,
  agency_id INT REFERENCES agencies(id),
  agency_name VARCHAR(255),
  label VARCHAR(255),
  done BOOLEAN DEFAULT FALSE,
  done_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── REFRESH TOKENS ─────────────────────────────────────────────────────────────
CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDEXES ────────────────────────────────────────────────────────────────────
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_shifts_date ON shifts(date);
CREATE INDEX idx_shifts_status ON shifts(status);
CREATE INDEX idx_shifts_carehome ON shifts(carehome);
CREATE INDEX idx_timesheets_status ON timesheets(status);
CREATE INDEX idx_timesheets_agency ON timesheets(agency);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_workers_agency ON workers(agency);
CREATE INDEX idx_notifications_role ON notifications(role);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_locations_group ON locations(group_id);
