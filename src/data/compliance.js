import { T } from "../theme/tokens.js";

/* ─── COMPLIANCE REQUIREMENTS ────────────────────────────────────────────────── */
export const INIT_COMPLIANCE_REQS = [
  // Global — set by Nexus RPO admin, apply to all sites
  {id:"cr1",name:"DBS Enhanced Certificate",type:"document",category:"safeguarding",appliesToRoles:["RGN","HCA","RMN","Senior Carer"],mandatory:true,expiryMonths:36,scope:"global",addedBy:"Nexus Admin",careHome:null,createdAt:"2024-01-01",active:true,notes:"Must be on the Update Service or renewed within 3 years"},
  {id:"cr2",name:"Mandatory Training Certificate",type:"training",category:"training",appliesToRoles:["RGN","HCA","RMN","Senior Carer"],mandatory:true,expiryMonths:12,scope:"global",addedBy:"Nexus Admin",careHome:null,createdAt:"2024-01-01",active:true,notes:"Covers: safeguarding, fire safety, infection control, moving & handling"},
  {id:"cr3",name:"NMC/PIN Registration",type:"registration",category:"registration",appliesToRoles:["RGN","RMN"],mandatory:true,expiryMonths:12,scope:"global",addedBy:"Nexus Admin",careHome:null,createdAt:"2024-01-01",active:true,notes:"Must be active and without conditions. Checked against NMC register."},
  {id:"cr4",name:"COVID-19 Vaccination Record",type:"document",category:"health",appliesToRoles:["RGN","HCA","RMN","Senior Carer"],mandatory:false,expiryMonths:null,scope:"global",addedBy:"Nexus Admin",careHome:null,createdAt:"2024-01-01",active:true,notes:"Recommended but not mandated. Record primary course + boosters."},
  {id:"cr5",name:"Right to Work Evidence",type:"document",category:"legal",appliesToRoles:["RGN","HCA","RMN","Senior Carer"],mandatory:true,expiryMonths:null,scope:"global",addedBy:"Nexus Admin",careHome:null,createdAt:"2024-01-01",active:true,notes:"Passport, visa, or share code verification"},
  // Site-specific — added by care home managers
  {id:"cr6",name:"Dementia Care Certificate",type:"training",category:"specialist",appliesToRoles:["RGN","HCA","Senior Carer"],mandatory:true,expiryMonths:24,scope:"site",addedBy:"Karen Hughes",careHome:"Sunrise Care",createdAt:"2024-03-15",active:true,notes:"All staff working on our memory care unit must hold this certification"},
  {id:"cr7",name:"Moving & Handling Advanced",type:"training",category:"training",appliesToRoles:["RGN","HCA","RMN","Senior Carer"],mandatory:true,expiryMonths:12,scope:"site",addedBy:"Paul Osei",careHome:"Meadowbrook Lodge",createdAt:"2024-04-10",active:true,notes:"Full patient-handling assessment required due to bariatric patients"},
  {id:"cr8",name:"Hepatitis B Vaccination Record",type:"document",category:"health",appliesToRoles:["RGN","RMN"],mandatory:false,expiryMonths:null,scope:"site",addedBy:"Janet Mills",careHome:"Oakwood Nursing",createdAt:"2024-05-01",active:true,notes:"Strongly recommended for clinical staff on our nursing unit"},
  {id:"cr9",name:"Fire Marshal Training",type:"training",category:"safety",appliesToRoles:["RGN","HCA","RMN","Senior Carer"],mandatory:true,expiryMonths:12,scope:"site",addedBy:"Steve Walters",careHome:"Riverside Manor",createdAt:"2024-06-20",active:true,notes:"Required for all Riverside Manor agency and bank staff"},
  {id:"cr10",name:"Mental Health Awareness",type:"training",category:"specialist",appliesToRoles:["RGN","HCA","Senior Carer"],mandatory:false,expiryMonths:24,scope:"site",addedBy:"Karen Hughes",careHome:"Sunrise Care",createdAt:"2024-09-01",active:false,notes:"Currently optional — under review for mandatory status"},
];

export const DOCS = [
  {id:1,worker:"Sarah Johnson",type:"DBS Certificate",uploaded:"2025-03-01",expires:"2027-03-01",status:"verified"},
  {id:2,worker:"Sarah Johnson",type:"Mandatory Training",uploaded:"2024-09-15",expires:"2026-09-15",status:"verified"},
  {id:3,worker:"Mohammed Ali",type:"DBS Certificate",uploaded:"2024-12-01",expires:"2026-12-01",status:"verified"},
  {id:4,worker:"Mohammed Ali",type:"Mandatory Training",uploaded:"2024-04-01",expires:"2026-04-01",status:"expiring"},
  {id:5,worker:"Emma Clarke",type:"DBS Certificate",uploaded:"2025-06-01",expires:"2027-06-01",status:"verified"},
  {id:6,worker:"James Wilson",type:"DBS Certificate",uploaded:"2024-04-15",expires:"2026-04-15",status:"expiring"},
  {id:7,worker:"Priya Patel",type:"Mandatory Training",uploaded:"2023-12-01",expires:"2025-12-01",status:"expired"},
];

/* ─── ADMIN: CLIENT MANAGER ──────────────────────────────────────────────────── */
export const CQC_COLORS = {"Outstanding":{c:T.purple,bg:T.purpleBg},"Good":{c:T.green,bg:T.greenBg},"Requires Improvement":{c:T.yellow,bg:T.yellowBg},"Inadequate":{c:T.red,bg:T.redBg},"Not rated":{c:T.muted,bg:T.sunken}};

/* ─── RIGHT TO WORK ──────────────────────────────────────────────────────────── */
export const RTW_TYPES = [
  {value:"british_passport",    label:"British / Irish Passport",           restricted:false, expiry:false, desc:"List A — permanent right to work. No expiry check needed."},
  {value:"euss_settled",        label:"EU Settlement Scheme — Settled",     restricted:false, expiry:false, desc:"List A — permanent right to work. Check via online service."},
  {value:"euss_pre_settled",    label:"EU Settlement Scheme — Pre-Settled", restricted:false, expiry:true,  desc:"List B — time-limited. Requires repeat checks before expiry."},
  {value:"share_code",          label:"Share Code (eVisa / Online Check)",  restricted:null,  expiry:true,  desc:"Check visa type online. Hours restriction depends on visa category."},
  {value:"brp",                 label:"Biometric Residence Permit (BRP)",   restricted:null,  expiry:true,  desc:"Check BRP visa type. BRPs were replaced by eVisas from 2025 — may need updating."},
  {value:"skilled_worker",      label:"Skilled Worker Visa",                restricted:false, expiry:true,  desc:"List B — unrestricted hours. Repeat check required at expiry."},
  {value:"student",             label:"Student Visa",                       restricted:true,  expiry:true,  desc:"20 hours/week restriction during term time. Must verify term dates with worker."},
  {value:"graduate",            label:"Graduate Visa",                      restricted:false, expiry:true,  desc:"Post-study — unrestricted hours for visa duration."},
  {value:"ilr",                 label:"Indefinite Leave to Remain (ILR)",   restricted:false, expiry:false, desc:"List A — permanent right to work, no expiry."},
  {value:"certificate",         label:"Certificate of Application",         restricted:null,  expiry:true,  desc:"Temporary permission — check Home Office Employer Checking Service before placing."},
  {value:"pending",             label:"Pending / Not Yet Verified",         restricted:null,  expiry:null,  desc:"RTW check not yet completed. Worker cannot be placed until verified."},
];

export const RTW_LABEL = Object.fromEntries(RTW_TYPES.map(t=>[t.value, t.label]));

// Seed weekly hours worked per restricted worker (for monitoring report)
export const RESTRICTED_HOURS = [
  {workerId:4, workerName:"James Wilson",  agency:"First Choice",  role:"RGN",  visaExpiry:"2026-07-31", weekHours:[18,20,16,22,19,15], sites:["Sunrise Care","Oakwood Nursing"]},
  {workerId:5, workerName:"Priya Patel",   agency:"MedStaff UK",   role:"HCA",  visaExpiry:"2026-03-31", weekHours:[12,8,20,20,14,0],   sites:["Oakwood Nursing"]},
  {workerId:7, workerName:"Lisa Park",     agency:"First Choice",  role:"HCA",  visaExpiry:"2026-12-15", weekHours:[16,18,20,20,18,20],  sites:["Sunrise Care"]},
];

// Week labels for the monitoring table
export const RTW_WEEKS = ["w/c 27 Jan","w/c 3 Feb","w/c 10 Feb","w/c 17 Feb","w/c 24 Feb","w/c 3 Mar"];
