// Rate cards — agency rates (what Nexus RPO pays agencies) and client rates (what Nexus RPO charges care homes)
export const INIT_RATE_CARDS = [
  // ── Agency rates (what we pay each agency) ──────────────────────────────────
  {id:"ar1", type:"agency",agency:"First Choice Nursing",careHome:null,role:"RGN",         band:"Standard",weekday:32,saturday:40,sunday:48,bankHoliday:64,nightMod:1.20,notes:""},
  {id:"ar2", type:"agency",agency:"First Choice Nursing",careHome:null,role:"RMN",         band:"Standard",weekday:35,saturday:44,sunday:52,bankHoliday:70,nightMod:1.25,notes:""},
  {id:"ar3", type:"agency",agency:"First Choice Nursing",careHome:null,role:"HCA",         band:"Standard",weekday:16,saturday:20,sunday:24,bankHoliday:32,nightMod:1.15,notes:""},
  {id:"ar4", type:"agency",agency:"First Choice Nursing",careHome:null,role:"Senior Carer",band:"Standard",weekday:22,saturday:28,sunday:33,bankHoliday:44,nightMod:1.20,notes:""},
  {id:"ar5", type:"agency",agency:"ProCare Staffing",    careHome:null,role:"RGN",         band:"Standard",weekday:33,saturday:41,sunday:49,bankHoliday:66,nightMod:1.20,notes:"Negotiated premium rate"},
  {id:"ar6", type:"agency",agency:"ProCare Staffing",    careHome:null,role:"HCA",         band:"Standard",weekday:17,saturday:21,sunday:25,bankHoliday:34,nightMod:1.15,notes:""},
  {id:"ar7", type:"agency",agency:"ProCare Staffing",    careHome:null,role:"RMN",         band:"Standard",weekday:36,saturday:45,sunday:54,bankHoliday:72,nightMod:1.25,notes:""},
  {id:"ar8", type:"agency",agency:"MedStaff UK",         careHome:null,role:"RGN",         band:"Standard",weekday:31,saturday:39,sunday:47,bankHoliday:62,nightMod:1.20,notes:""},
  {id:"ar9", type:"agency",agency:"MedStaff UK",         careHome:null,role:"RMN",         band:"Standard",weekday:34,saturday:43,sunday:51,bankHoliday:68,nightMod:1.25,notes:""},
  {id:"ar10",type:"agency",agency:"MedStaff UK",         careHome:null,role:"HCA",         band:"Standard",weekday:15,saturday:19,sunday:23,bankHoliday:30,nightMod:1.15,notes:""},
  {id:"ar11",type:"agency",agency:"CareForce",           careHome:null,role:"HCA",         band:"Standard",weekday:15,saturday:19,sunday:23,bankHoliday:30,nightMod:1.15,notes:"Budget rate agreed"},
  {id:"ar12",type:"agency",agency:"CareForce",           careHome:null,role:"Senior Carer",band:"Standard",weekday:21,saturday:27,sunday:32,bankHoliday:42,nightMod:1.20,notes:""},
  // ── Client rates (what we charge each care home) ────────────────────────────
  {id:"cr1", type:"client",agency:null,careHome:"Sunrise Care",      role:"RGN",         band:"Standard",weekday:35,saturday:43,sunday:51,bankHoliday:67,nightMod:1.20,notes:""},
  {id:"cr2", type:"client",agency:null,careHome:"Sunrise Care",      role:"HCA",         band:"Standard",weekday:18,saturday:22,sunday:26,bankHoliday:34,nightMod:1.15,notes:""},
  {id:"cr3", type:"client",agency:null,careHome:"Sunrise Care",      role:"Senior Carer",band:"Standard",weekday:24,saturday:30,sunday:36,bankHoliday:46,nightMod:1.20,notes:""},
  {id:"cr4", type:"client",agency:null,careHome:"Meadowbrook Lodge", role:"RGN",         band:"Standard",weekday:36,saturday:45,sunday:54,bankHoliday:69,nightMod:1.20,notes:"High-dependency premium"},
  {id:"cr5", type:"client",agency:null,careHome:"Meadowbrook Lodge", role:"RMN",         band:"Standard",weekday:38,saturday:47,sunday:56,bankHoliday:73,nightMod:1.25,notes:"Dementia specialist uplift"},
  {id:"cr6", type:"client",agency:null,careHome:"Meadowbrook Lodge", role:"HCA",         band:"Standard",weekday:18,saturday:22,sunday:26,bankHoliday:34,nightMod:1.15,notes:""},
  {id:"cr7", type:"client",agency:null,careHome:"Oakwood Nursing",   role:"RGN",         band:"Standard",weekday:34,saturday:42,sunday:50,bankHoliday:66,nightMod:1.20,notes:""},
  {id:"cr8", type:"client",agency:null,careHome:"Oakwood Nursing",   role:"HCA",         band:"Standard",weekday:17,saturday:21,sunday:25,bankHoliday:33,nightMod:1.15,notes:""},
  {id:"cr9", type:"client",agency:null,careHome:"Riverside Manor",   role:"RGN",         band:"Standard",weekday:35,saturday:43,sunday:51,bankHoliday:67,nightMod:1.20,notes:""},
  {id:"cr10",type:"client",agency:null,careHome:"Riverside Manor",   role:"Senior Carer",band:"Standard",weekday:24,saturday:30,sunday:36,bankHoliday:46,nightMod:1.20,notes:"Additional responsibility agreed"},
];

export const INIT_CLIENT_PRICING = {
  cg1: {
    platformFee:  { enabled: true, value: 2.5 },
    hourlyMargin: { enabled: true, type: "fixed", usePerRole: true, globalValue: 2.50,
                    perRole: { RGN: 3.00, RMN: 3.50, HCA: 2.00, "Senior Carer": 2.50 } },
    notes: "Preferred client — 3yr framework. Standard hourly margin + portal fee.",
  },
  cg2: {
    platformFee:  { enabled: true, value: 3.0 },
    hourlyMargin: { enabled: false, type: "fixed", usePerRole: false, globalValue: 2.00,
                    perRole: { RGN: 2.00, RMN: 2.50, HCA: 1.50, "Senior Carer": 2.00 } },
    notes: "Platform fee only — hourly margin waived as part of contract negotiation.",
  },
  cg3: {
    platformFee:  { enabled: false, value: 2.0 },
    hourlyMargin: { enabled: true, type: "percentage", usePerRole: false, globalValue: 8,
                    perRole: { RGN: 8, RMN: 9, HCA: 6, "Senior Carer": 7 } },
    notes: "Percentage margin model — no platform fee.",
  },
};

export const INIT_BANK_RATES = {
  // Global platform rates — apply to all sites unless a site overrides
  global: [
    {id:"br1", role:"RGN",          weekday:28, saturday:35, sunday:42, bankHoliday:56, nightMod:1.20, notes:"Standard bank RGN rate"},
    {id:"br2", role:"RMN",          weekday:30, saturday:38, sunday:45, bankHoliday:60, nightMod:1.25, notes:""},
    {id:"br3", role:"HCA",          weekday:13, saturday:16, sunday:19, bankHoliday:26, nightMod:1.15, notes:""},
    {id:"br4", role:"Senior Carer", weekday:18, saturday:23, sunday:27, bankHoliday:36, nightMod:1.20, notes:""},
  ],
  // Per-site overrides — keyed by care home name
  sites: {
    "Sunrise Care":          [],
    "Sunrise Dementia Unit": [
      {id:"bs1", role:"RMN", weekday:32, saturday:40, sunday:48, bankHoliday:64, nightMod:1.25, notes:"Dementia specialist uplift"},
    ],
    "Oakwood Nursing":       [],
    "Meadowbrook Lodge":     [],
    "Riverside Manor":       [],
  },
};

/* ─── RATE UPLIFT REQUESTS ────────────────────────────────────────────────────── */
export const INIT_RATE_UPLIFTS = [
  {id:"ru1",agency:"First Choice Nursing",role:"RGN",current:32,requested:34,reason:"NMC registration costs increased April 2026",status:"pending",  submittedDate:"2026-03-01",respondedDate:null,respondedBy:null,notes:""},
  {id:"ru2",agency:"ProCare Staffing",    role:"HCA",current:17,requested:18,reason:"National Living Wage uplift",              status:"approved", submittedDate:"2026-02-10",respondedDate:"2026-02-15",respondedBy:"Rachel Obi",notes:"Agreed effective March 2026"},
  {id:"ru3",agency:"MedStaff UK",         role:"RMN",current:34,requested:37,reason:"Specialist mental health premium",         status:"rejected", submittedDate:"2026-01-20",respondedDate:"2026-01-28",respondedBy:"Rachel Obi",notes:"Rate already above market — not approved"},
];

/* ─── ADMIN: RATE CARDS ──────────────────────────────────────────────────────── */
export const BANDS = ["Standard","Senior","Specialist"];

export const RATE_DAY_KEYS = ["weekday","saturday","sunday","bankHoliday"];

export const RATE_DAY_LABELS = {weekday:"Weekday",saturday:"Saturday",sunday:"Sunday",bankHoliday:"Bank Hol"};

export const blankRate = (type, overrides={}) => ({
  id: `rc_${Date.now()}`,
  type,
  agency: type==="agency" ? "" : null,
  careHome: type==="client" ? "" : null,
  role: "RGN",
  band: "Standard",
  weekday: 0,
  saturday: 0,
  sunday: 0,
  bankHoliday: 0,
  nightMod: 1.20,
  notes: "",
  ...overrides,
});
