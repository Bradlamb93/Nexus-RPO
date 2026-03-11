import { useState, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

/* ─── FONTS & RESET ─────────────────────────────────────────────────────────── */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');
*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Syne',sans-serif}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#f1f5f9}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}
input,select,textarea,button{font-family:'Syne',sans-serif}`;

/* ─── LOGO ───────────────────────────────────────────────────────────────────── */
const FCCLogo = ({size=32,textColor="#ffffff",showText=false,textSize=17}) => (
  <div style={{display:"flex",alignItems:"center",gap:9}}>
    {/* Nexus RPO orbital logo mark — two interlocking elliptical rings */}
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer blue ring — tilted ellipse */}
      <ellipse cx="50" cy="50" rx="38" ry="16"
        stroke="#6BB8DC" strokeWidth="5.5" fill="none"
        transform="rotate(-35 50 50)"/>
      {/* Inner grey ring — tilted opposite */}
      <ellipse cx="50" cy="50" rx="38" ry="16"
        stroke="#9CA3AF" strokeWidth="4.5" fill="none"
        transform="rotate(35 50 50)"/>
      {/* Small centre dot */}
      <circle cx="50" cy="50" r="4" fill="#6BB8DC"/>
    </svg>
    {showText && (
      <span style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:textSize,color:textColor,letterSpacing:"0.02em",lineHeight:1}}>
        Nexus <span style={{fontWeight:400,opacity:0.85}}>RPO</span>
      </span>
    )}
  </div>
);

/* ─── DESIGN TOKENS ──────────────────────────────────────────────────────────── */
const T = {
  navy:'#08132A', navyMid:'#0f2040', navyBorder:'rgba(255,255,255,0.08)',
  amber:'#F59E0B', amberDark:'#D97706', amberBg:'#FEF3C7', amberText:'#92400E',
  white:'#FFFFFF', bg:'#F7F9FC', border:'#E4E9F0',
  text:'#0D1829', muted:'#6B7A99',
  green:'#059669', greenBg:'#D1FAE5',
  red:'#DC2626', redBg:'#FEE2E2',
  blue:'#2563EB', blueBg:'#DBEAFE',
  yellow:'#D97706', yellowBg:'#FEF3C7',
  purple:'#7C3AED', purpleBg:'#EDE9FE',
  teal:'#0891B2', tealBg:'#CFFAFE',
};

/* ─── MOCK DATA ──────────────────────────────────────────────────────────────── */
const SHIFTS = [
  {id:1,carehome:"Sunrise Care",role:"RGN",date:"2026-03-12",time:"07:00–19:00",status:"open",agency:null,worker:null,rate:35,urgency:"urgent",notes:"Experienced RGN required"},
  {id:2,carehome:"Meadowbrook Lodge",role:"HCA",date:"2026-03-12",time:"19:00–07:00",status:"filled",agency:"ProCare",worker:"Sarah Johnson",rate:18,urgency:"normal",notes:""},
  {id:3,carehome:"Sunrise Care",role:"RMN",date:"2026-03-13",time:"07:00–19:00",status:"pending",agency:"MedStaff UK",worker:null,rate:38,urgency:"normal",notes:"Mental health ward"},
  {id:4,carehome:"Oakwood Nursing",role:"HCA",date:"2026-03-13",time:"07:00–15:00",status:"open",agency:null,worker:null,rate:17,urgency:"urgent",notes:""},
  {id:5,carehome:"Meadowbrook Lodge",role:"RGN",date:"2026-03-14",time:"07:00–19:00",status:"filled",agency:"ProCare",worker:"Mohammed Ali",rate:35,urgency:"normal",notes:""},
  {id:6,carehome:"Sunrise Care",role:"HCA",date:"2026-03-14",time:"19:00–07:00",status:"open",agency:null,worker:null,rate:18,urgency:"normal",notes:""},
  {id:7,carehome:"Oakwood Nursing",role:"RGN",date:"2026-03-15",time:"07:00–19:00",status:"pending",agency:"First Choice",worker:null,rate:35,urgency:"high",notes:""},
  {id:8,carehome:"Riverside Manor",role:"RMN",date:"2026-03-08",time:"07:00–19:00",status:"filled",agency:"First Choice",worker:"Emma Clarke",rate:38,urgency:"normal",notes:""},
  {id:9,carehome:"Riverside Manor",role:"HCA",date:"2026-03-16",time:"07:00–15:00",status:"open",agency:null,worker:null,rate:17,urgency:"normal",notes:""},
  {id:10,carehome:"Meadowbrook Lodge",role:"RGN",date:"2026-03-16",time:"19:00–07:00",status:"open",agency:null,worker:null,rate:36,urgency:"urgent",notes:"Double rate applies"},
  {id:11,carehome:"Oakwood Nursing",role:"HCA",date:"2026-03-17",time:"07:00–19:00",status:"filled",agency:"ProCare",worker:"Tom Richards",rate:17,urgency:"normal",notes:""},
  {id:12,carehome:"Sunrise Care",role:"RGN",date:"2026-03-17",time:"19:00–07:00",status:"pending",agency:"First Choice",worker:null,rate:37,urgency:"high",notes:""},
  {id:13,carehome:"Sunrise Care",role:"HCA",date:"2026-03-09",time:"07:00–15:00",status:"filled",agency:"First Choice",worker:"Lisa Park",rate:17,urgency:"normal",notes:""},
  {id:14,carehome:"Oakwood Nursing",role:"RGN",date:"2026-03-10",time:"07:00–19:00",status:"filled",agency:"First Choice",worker:"James Wilson",rate:35,urgency:"normal",notes:""},
  {id:15,carehome:"Riverside Manor",role:"HCA",date:"2026-03-11",time:"19:00–07:00",status:"filled",agency:"First Choice",worker:"Lisa Park",rate:17,urgency:"normal",notes:""},
  {id:16,carehome:"Sunrise Care",role:"RMN",date:"2026-03-07",time:"07:00–19:00",status:"filled",agency:"First Choice",worker:"Emma Clarke",rate:38,urgency:"normal",notes:""},
];

const AGENCIES = [
  {id:1,name:"First Choice Nursing",tier:"Tier 1",contact:"Laura Bennett",email:"laura@firstchoice.co.uk",phone:"07700 900123",shifts:42,fillRate:94,avgResponse:"18m",compliance:98,status:"active",spend:28900,joined:"2023-01-15"},
  {id:2,name:"ProCare Staffing",tier:"Tier 1",contact:"Daniel Reid",email:"d.reid@procare.co.uk",phone:"07700 900456",shifts:38,fillRate:89,avgResponse:"25m",compliance:95,status:"active",spend:24650,joined:"2023-03-10"},
  {id:3,name:"MedStaff UK",tier:"Tier 2",contact:"Priya Shah",email:"priya@medstaff.co.uk",phone:"07700 900789",shifts:21,fillRate:76,avgResponse:"45m",compliance:87,status:"active",spend:13200,joined:"2024-01-08"},
  {id:4,name:"CareForce",tier:"Tier 3",contact:"Mike Turner",email:"mike@careforce.co.uk",phone:"07700 900321",shifts:14,fillRate:71,avgResponse:"52m",compliance:82,status:"active",spend:8750,joined:"2024-06-01"},
];

const WORKERS = [
  {id:1,name:"Sarah Johnson",role:"RGN",agency:"ProCare",dbs:"valid",dbsExpiry:"2027-03-01",training:"valid",trainingExpiry:"2026-09-15",pin:"12A3456",pinStatus:true,compliance:100,phone:"07711 111111",email:"sarah.j@email.com",available:true,
   rtwType:"british_passport",rtwRef:"PASS-001",rtwExpiry:null,rtwVerified:"2024-01-10",rtwVerifiedBy:"Rachel Obi",hoursRestriction:null,visaType:null,rtwNotes:""},
  {id:2,name:"Mohammed Ali",role:"HCA",agency:"ProCare",dbs:"valid",dbsExpiry:"2026-12-01",training:"expiring",trainingExpiry:"2026-04-01",pin:null,pinStatus:true,compliance:85,phone:"07711 222222",email:"m.ali@email.com",available:true,
   rtwType:"share_code",rtwRef:"W98X-Y7KL",rtwExpiry:"2026-09-30",rtwVerified:"2024-02-14",rtwVerifiedBy:"Rachel Obi",hoursRestriction:null,visaType:"skilled_worker",rtwNotes:"Skilled Worker visa — no hours restriction"},
  {id:3,name:"Emma Clarke",role:"RMN",agency:"First Choice",dbs:"valid",dbsExpiry:"2027-06-01",training:"valid",trainingExpiry:"2027-01-01",pin:"22B9871",pinStatus:true,compliance:100,phone:"07711 333333",email:"emma.c@email.com",available:false,
   rtwType:"british_passport",rtwRef:"PASS-002",rtwExpiry:null,rtwVerified:"2023-06-01",rtwVerifiedBy:"Tom Bright",hoursRestriction:null,visaType:null,rtwNotes:""},
  {id:4,name:"James Wilson",role:"RGN",agency:"First Choice",dbs:"expiring",dbsExpiry:"2026-04-15",training:"valid",trainingExpiry:"2026-11-01",pin:"33C4421",pinStatus:true,compliance:75,phone:"07711 444444",email:"james.w@email.com",available:true,
   rtwType:"share_code",rtwRef:"A12B-C3DE",rtwExpiry:"2026-07-31",rtwVerified:"2024-07-15",rtwVerifiedBy:"Rachel Obi",hoursRestriction:20,visaType:"student",rtwNotes:"Student visa — 20hr/week restriction during term time. Term dates must be checked with worker."},
  {id:5,name:"Priya Patel",role:"HCA",agency:"MedStaff UK",dbs:"valid",dbsExpiry:"2026-10-01",training:"expired",trainingExpiry:"2025-12-01",pin:null,pinStatus:false,compliance:40,phone:"07711 555555",email:"priya.p@email.com",available:false,
   rtwType:"brp",rtwRef:"ZX1234567",rtwExpiry:"2026-03-31",rtwVerified:"2023-09-01",rtwVerifiedBy:"Tom Bright",hoursRestriction:20,visaType:"student",rtwNotes:"BRP expiring end of March — renewal must be confirmed before placement. Student visa 20hr restriction applies."},
  {id:6,name:"Tom Richards",role:"RGN",agency:"CareForce",dbs:"valid",dbsExpiry:"2027-02-01",training:"valid",trainingExpiry:"2026-08-01",pin:"55E3310",pinStatus:true,compliance:100,phone:"07711 666666",email:"tom.r@email.com",available:true,
   rtwType:"euss_settled",rtwRef:"EUSS-TOM-001",rtwExpiry:null,rtwVerified:"2023-11-20",rtwVerifiedBy:"Rachel Obi",hoursRestriction:null,visaType:null,rtwNotes:"EU Settled Status — permanent right to work, no expiry"},
  {id:7,name:"Lisa Park",role:"HCA",agency:"First Choice",dbs:"valid",dbsExpiry:"2027-01-01",training:"valid",trainingExpiry:"2026-12-01",pin:null,pinStatus:false,compliance:80,phone:"07711 777777",email:"lisa.p@email.com",available:true,
   rtwType:"share_code",rtwRef:"M55N-P8QR",rtwExpiry:"2026-12-15",rtwVerified:"2025-01-05",rtwVerifiedBy:"Rachel Obi",hoursRestriction:20,visaType:"student",rtwNotes:"Student visa — 20hr restriction. Currently in term time until June 2026."},
];

// Rate cards — agency rates (what Nexus RPO pays agencies) and client rates (what Nexus RPO charges care homes)
const INIT_RATE_CARDS = [
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

// Neutral vendor margin — what Nexus RPO charges care homes on top of agency rates
const INIT_MARGIN_CONFIG = {
  type: "fixed",        // "fixed" (£/hr) | "percentage" (%)
  usePerRole: true,     // true = per-role margins, false = one global margin
  globalValue: 2.50,
  perRole: {
    "RGN":          3.00,
    "RMN":          3.50,
    "HCA":          2.00,
    "Senior Carer": 2.50,
  },
  notes: "Applied to all hours billed through the platform. Agencies see their base rate; care homes see the client rate inclusive of the Nexus RPO margin.",
};

const calcClientRate = (agencyRate, role, cfg) => {
  if (!cfg) return agencyRate;
  if (cfg.type === "percentage") {
    const pct = cfg.usePerRole ? (cfg.perRole[role] ?? cfg.globalValue) : cfg.globalValue;
    return +(agencyRate * (1 + pct / 100)).toFixed(2);
  }
  const margin = cfg.usePerRole ? (cfg.perRole[role] ?? cfg.globalValue) : cfg.globalValue;
  return +(agencyRate + margin).toFixed(2);
};

const getMargin = (agencyRate, role, cfg) => {
  if (!cfg) return 0;
  return +(calcClientRate(agencyRate, role, cfg) - agencyRate).toFixed(2);
};

const INVOICES = [
  {id:"INV-0012",agency:"ProCare",period:"Feb 2026",shifts:38,amount:24650,status:"paid",due:"2026-03-01",issued:"2026-02-28"},
  {id:"INV-0011",agency:"First Choice",period:"Feb 2026",shifts:42,amount:28900,status:"paid",due:"2026-03-01",issued:"2026-02-28"},
  {id:"INV-0010",agency:"MedStaff UK",period:"Feb 2026",shifts:21,amount:13200,status:"overdue",due:"2026-03-15",issued:"2026-02-28"},
  {id:"INV-0009",agency:"CareForce",period:"Feb 2026",shifts:14,amount:8750,status:"pending",due:"2026-03-15",issued:"2026-02-28"},
  {id:"INV-0013",agency:"ProCare",period:"Mar 2026",shifts:18,amount:12100,status:"draft",due:"2026-04-01",issued:"—"},
];

const BANK_STAFF = [
  {id:1,name:"Diane Foster",role:"RGN",email:"d.foster@internal.co.uk",phone:"07800 111001",dbs:"valid",dbsExpiry:"2027-05-01",training:"valid",trainingExpiry:"2027-02-01",pin:"44F1122",pinStatus:true,compliance:100,available:true,hoursThisMonth:36,hoursYTD:148,earningsYTD:5180,contracts:["Sunrise Care","Meadowbrook Lodge"]},
  {id:2,name:"Carlos Mendes",role:"HCA",email:"c.mendes@internal.co.uk",phone:"07800 111002",dbs:"valid",dbsExpiry:"2026-11-01",training:"valid",trainingExpiry:"2026-10-01",pin:null,pinStatus:false,compliance:85,available:true,hoursThisMonth:24,hoursYTD:96,earningsYTD:1632,contracts:["Sunrise Care","Oakwood Nursing","Riverside Manor"]},
  {id:3,name:"Yvette Okafor",role:"RMN",email:"y.okafor@internal.co.uk",phone:"07800 111003",dbs:"valid",dbsExpiry:"2027-08-01",training:"valid",trainingExpiry:"2027-04-01",pin:"77Y4489",pinStatus:true,compliance:100,available:false,hoursThisMonth:48,hoursYTD:192,earningsYTD:7104,contracts:["Meadowbrook Lodge","Riverside Manor"]},
  {id:4,name:"Ryan Ashworth",role:"HCA",email:"r.ashworth@internal.co.uk",phone:"07800 111004",dbs:"expiring",dbsExpiry:"2026-04-20",training:"valid",trainingExpiry:"2026-09-01",pin:null,pinStatus:false,compliance:70,available:true,hoursThisMonth:16,hoursYTD:64,earningsYTD:1088,contracts:["Sunrise Care"]},
  {id:5,name:"Miriam Osei",role:"RGN",email:"m.osei@internal.co.uk",phone:"07800 111005",dbs:"valid",dbsExpiry:"2027-03-01",training:"expiring",trainingExpiry:"2026-04-05",pin:"88M5531",pinStatus:true,compliance:80,available:true,hoursThisMonth:40,hoursYTD:160,earningsYTD:5600,contracts:["Oakwood Nursing","Meadowbrook Lodge","Sunrise Care"]},
  {id:6,name:"Jake Thornton",role:"Senior Carer",email:"j.thornton@internal.co.uk",phone:"07800 111006",dbs:"valid",dbsExpiry:"2027-01-01",training:"valid",trainingExpiry:"2026-12-01",pin:null,pinStatus:false,compliance:90,available:true,hoursThisMonth:32,hoursYTD:128,earningsYTD:2816,contracts:["Riverside Manor","Oakwood Nursing"]},
];
const BANK_SHIFTS = [
  {id:101,carehome:"Sunrise Care",role:"RGN",date:"2026-03-12",time:"07:00–19:00",status:"bank-open",claimedBy:null,rate:32,urgency:"urgent",bankWindowMins:120},
  {id:102,carehome:"Oakwood Nursing",role:"HCA",date:"2026-03-13",time:"07:00–15:00",status:"bank-claimed",claimedBy:"Carlos Mendes",rate:16,urgency:"normal",bankWindowMins:0},
  {id:103,carehome:"Meadowbrook Lodge",role:"RGN",date:"2026-03-14",time:"07:00–19:00",status:"bank-open",claimedBy:null,rate:32,urgency:"high",bankWindowMins:45},
  {id:104,carehome:"Riverside Manor",role:"RMN",date:"2026-03-15",time:"19:00–07:00",status:"bank-claimed",claimedBy:"Yvette Okafor",rate:35,urgency:"normal",bankWindowMins:0},
  {id:105,carehome:"Sunrise Care",role:"HCA",date:"2026-03-16",time:"07:00–19:00",status:"bank-open",claimedBy:null,rate:16,urgency:"normal",bankWindowMins:180},
  {id:106,carehome:"Oakwood Nursing",role:"RGN",date:"2026-03-17",time:"19:00–07:00",status:"bank-open",claimedBy:null,rate:32,urgency:"normal",bankWindowMins:60},
];
const BANK_EARNINGS=[{month:"Oct",hrs:32,pay:1120},{month:"Nov",hrs:40,pay:1400},{month:"Dec",hrs:28,pay:980},{month:"Jan",hrs:44,pay:1540},{month:"Feb",hrs:48,pay:1680},{month:"Mar",hrs:16,pay:560}];

const INIT_TIMESHEETS = [
  {id:"TS-001",shiftId:8, agency:"First Choice",carehome:"Riverside Manor",worker:"Emma Clarke",role:"RMN",date:"2026-03-08",time:"07:00–19:00",scheduledHrs:12,hoursWorked:12,breakMins:30,rate:38,total:456,status:"approved",submittedAt:"2026-03-09",approvedBy:"Steve Walters",disputeReason:"",invoiceId:null},
  {id:"TS-002",shiftId:16,agency:"First Choice",carehome:"Sunrise Care",worker:"Emma Clarke",role:"RMN",date:"2026-03-07",time:"07:00–19:00",scheduledHrs:12,hoursWorked:12,breakMins:30,rate:38,total:456,status:"pending",submittedAt:"2026-03-08",approvedBy:null,disputeReason:"",invoiceId:null},
  {id:"TS-003",shiftId:13,agency:"First Choice",carehome:"Sunrise Care",worker:"Lisa Park",role:"HCA",date:"2026-03-09",time:"07:00–15:00",scheduledHrs:8,hoursWorked:8,breakMins:30,rate:17,total:136,status:"disputed",submittedAt:"2026-03-10",approvedBy:null,disputeReason:"Worker left 30 minutes early — hours should be 7.5, not 8.",invoiceId:null},
  {id:"TS-004",shiftId:2, agency:"ProCare",carehome:"Meadowbrook Lodge",worker:"Sarah Johnson",role:"HCA",date:"2026-03-12",time:"19:00–07:00",scheduledHrs:12,hoursWorked:11,breakMins:30,rate:18,total:198,status:"pending",submittedAt:"2026-03-13",approvedBy:null,disputeReason:"",invoiceId:null},
  {id:"TS-005",shiftId:5, agency:"ProCare",carehome:"Meadowbrook Lodge",worker:"Mohammed Ali",role:"RGN",date:"2026-03-14",time:"07:00–19:00",scheduledHrs:12,hoursWorked:12,breakMins:30,rate:35,total:420,status:"approved",submittedAt:"2026-03-15",approvedBy:"Paul Osei",disputeReason:"",invoiceId:"INV-0013"},
];

/* ─── PERMISSIONS ─────────────────────────────────────────────────────────────── */
// Each permission key maps to a nav section or action capability
const PERM_DEFS = {
  admin: [
    {k:"dashboard",   l:"Dashboard",      desc:"View admin dashboard & KPIs"},
    {k:"shifts",      l:"Shift Board",     desc:"View and manage shift board"},
    {k:"schedule",    l:"Scheduler",       desc:"Create and edit shifts"},
    {k:"agencies",    l:"Agencies",        desc:"View and manage agencies"},
    {k:"clients",     l:"Clients",         desc:"Onboard and manage client groups and locations"},
    {k:"bankstaff",   l:"Bank Staff",      desc:"Manage internal bank staff"},
    {k:"workers",     l:"Worker Directory",desc:"View all workers"},
    {k:"compliance",  l:"Compliance",      desc:"View compliance tracker"},
    {k:"documents",   l:"Documents",       desc:"Access document vault"},
    {k:"ratecards",   l:"Rate Cards",      desc:"View and edit rate cards"},
    {k:"bankrates",   l:"Bank Rates",      desc:"Set pay rates for bank staff by role and shift type"},
    {k:"invoices",    l:"Invoices",        desc:"Generate and manage invoices"},
    {k:"timesheets",  l:"Timesheets",      desc:"Review timesheet pipeline"},
    {k:"budgets",     l:"Budgets",         desc:"Set and monitor agency spend budgets per care home"},
    {k:"analytics",   l:"Analytics",       desc:"View reports and analytics"},
    {k:"reports",     l:"Custom Reports",  desc:"Build, save and export custom data reports"},
    {k:"siteallocation",l:"Site Allocation",desc:"Assign care home staff to specific sites"},
    {k:"margins",     l:"Margins & Pricing", desc:"Set platform margin charged to care homes"},
    {k:"users",       l:"Users & Perms",   desc:"Manage platform users (super-admin only)"},
  ],
  clientadmin: [
    {k:"dashboard",   l:"Group Overview",      desc:"View group-level dashboard and KPIs"},
    {k:"analytics",   l:"Analytics",           desc:"View cross-location analytics and spend reporting"},
    {k:"locations",   l:"Locations",           desc:"View and manage group locations"},
    {k:"shifts",      l:"All Shifts",          desc:"View shifts across all group locations"},
    {k:"timesheets",  l:"Timesheets",          desc:"Review and approve timesheets for all locations"},
    {k:"invoices",    l:"Invoices",            desc:"View all invoices and billing across the group"},
    {k:"budgets",     l:"Budgets",             desc:"Set and monitor agency spend budgets for each site"},
    {k:"bankrates",   l:"Bank Rates",           desc:"Set pay rates for bank staff by role and shift type"},
    {k:"compliance",  l:"Compliance",          desc:"View compliance status across locations"},
    {k:"rtw",         l:"RTW Monitoring",      desc:"Monitor right to work status and 20hr restricted workers"},
    {k:"reports",     l:"Custom Reports",      desc:"Build, save and export custom data reports"},
    {k:"workers",     l:"Worker Profiles",     desc:"View workers placed across the group"},
    {k:"users",       l:"Users & Permissions", desc:"Manage portal users and site-level access"},
  ],
  carehome: [
    {k:"dashboard",   l:"Overview",            desc:"View home dashboard and site summary"},
    {k:"request",     l:"Request Shift",       desc:"Submit new shift requests"},
    {k:"myshifts",    l:"My Shifts",           desc:"View shift history"},
    {k:"calendar",    l:"Calendar",            desc:"View shift calendar"},
    {k:"compliance",  l:"Compliance",          desc:"Manage site compliance requirements"},
    {k:"rtw",         l:"RTW Monitoring",      desc:"Monitor right to work and 20hr restricted workers at your site"},
    {k:"timesheets",  l:"Timesheets",          desc:"Approve agency timesheets"},
    {k:"invoices",    l:"Invoices",            desc:"View invoices and billing"},
    {k:"workers",     l:"Worker Profiles",     desc:"View placed worker profiles"},
  ],
  agency: [
    {k:"dashboard",   l:"Dashboard",       desc:"View agency dashboard"},
    {k:"available",   l:"Available Shifts",desc:"View and claim open shifts"},
    {k:"workers",     l:"My Workers",      desc:"View worker roster"},
    {k:"timesheets",  l:"Timesheets",      desc:"Submit and manage timesheets"},
    {k:"onboard",     l:"Register Worker", desc:"Onboard new workers"},
    {k:"rtw",         l:"Right to Work",   desc:"Manage and record RTW checks for workers"},
    {k:"documents",   l:"Documents",       desc:"Manage compliance documents"},
    {k:"invoices",    l:"Invoices",        desc:"View payment history"},
    {k:"users",       l:"Users & Permissions", desc:"Manage agency portal users and access"},
  ],
  bank: [
    {k:"dashboard",   l:"Dashboard",       desc:"View personal dashboard"},
    {k:"available",   l:"Available Shifts",desc:"Claim shifts in priority window"},
    {k:"myshifts",    l:"My Shifts",       desc:"View confirmed shifts"},
    {k:"availability",l:"Set Availability",desc:"Update availability calendar"},
    {k:"earnings",    l:"Earnings",        desc:"View payslips and earnings"},
    {k:"profile",     l:"My Profile",      desc:"View and edit profile"},
  ],
};

// Default full access for each role
const defaultPerms = (role) => Object.fromEntries(PERM_DEFS[role]?.map(p=>[p.k,true])||[]);

const INIT_USERS = [
  // Admin users
  {id:"u1",name:"Rachel Obi",email:"r.obi@nexusrpo.co.uk",role:"admin",org:"Nexus RPO",status:"active",lastLogin:"2026-03-10",superAdmin:true,perms:defaultPerms("admin"),createdAt:"2024-01-01"},
  {id:"u2",name:"Tom Bright",email:"t.bright@nexusrpo.co.uk",role:"admin",org:"Nexus RPO",status:"active",lastLogin:"2026-03-09",superAdmin:false,perms:{...defaultPerms("admin"),ratecards:false,users:false},createdAt:"2024-06-15"},
  // Care home users
  {id:"u3",name:"Karen Hughes",email:"k.hughes@sunrise.co.uk",role:"carehome",org:"Sunrise Care",status:"active",lastLogin:"2026-03-10",superAdmin:false,perms:defaultPerms("carehome"),createdAt:"2024-02-10",sites:["Sunrise Care"]},
  {id:"u4",name:"Paul Osei",email:"p.osei@meadowbrook.co.uk",role:"carehome",org:"Meadowbrook Lodge",status:"active",lastLogin:"2026-03-08",superAdmin:false,perms:{...defaultPerms("carehome"),invoices:false},createdAt:"2024-02-10",sites:["Meadowbrook Lodge"]},
  {id:"u5",name:"Janet Mills",email:"j.mills@oakwood.co.uk",role:"carehome",org:"Oakwood Nursing",status:"active",lastLogin:"2026-03-07",superAdmin:false,perms:defaultPerms("carehome"),createdAt:"2024-03-20",sites:["Oakwood Nursing"]},
  {id:"u6",name:"Steve Walters",email:"s.walters@riverside.co.uk",role:"carehome",org:"Riverside Manor",status:"inactive",lastLogin:"2026-02-20",superAdmin:false,perms:defaultPerms("carehome"),createdAt:"2024-03-20",sites:["Riverside Manor"]},
  // Group director — Client Admin role (group-level access across all Sunrise sites)
  {id:"u22",name:"Margaret Cole",email:"m.cole@sunrisehealthcare.co.uk",role:"clientadmin",org:"Sunrise Healthcare Group",status:"active",lastLogin:"2026-03-10",superAdmin:true,perms:defaultPerms("clientadmin"),createdAt:"2023-06-01",sites:["Sunrise Care","Sunrise Dementia Unit","Oakwood Nursing"]},
  // Multi-site manager — client admin without user management
  {id:"u13",name:"Donna Clarke",email:"d.clarke@caremgmt.co.uk",role:"clientadmin",org:"Sunrise Healthcare Group",status:"active",lastLogin:"2026-03-09",superAdmin:false,perms:{...defaultPerms("clientadmin"),users:false},createdAt:"2025-01-10",sites:["Sunrise Care","Oakwood Nursing"]},
  // Agency users — First Choice Nursing
  {id:"u7", name:"Laura Bennett",  email:"laura@firstchoice.co.uk",        role:"agency",org:"First Choice Nursing",status:"active",   lastLogin:"2026-03-10",superAdmin:true, perms:defaultPerms("agency"),createdAt:"2023-01-15"},
  {id:"u14",name:"James Okafor",   email:"j.okafor@firstchoice.co.uk",     role:"agency",org:"First Choice Nursing",status:"active",   lastLogin:"2026-03-09",superAdmin:false,perms:{...defaultPerms("agency"),invoices:false,users:false},createdAt:"2024-02-01"},
  {id:"u15",name:"Sophie Reeves",  email:"s.reeves@firstchoice.co.uk",     role:"agency",org:"First Choice Nursing",status:"active",   lastLogin:"2026-03-08",superAdmin:false,perms:{...defaultPerms("agency"),invoices:false,users:false,onboard:false},createdAt:"2024-05-10"},
  {id:"u16",name:"Marcus Webb",    email:"m.webb@firstchoice.co.uk",       role:"agency",org:"First Choice Nursing",status:"suspended",lastLogin:"2026-02-01",superAdmin:false,perms:defaultPerms("agency"),createdAt:"2024-08-15"},
  {id:"u17",name:"Amy Thornton",   email:"a.thornton@firstchoice.co.uk",   role:"agency",org:"First Choice Nursing",status:"invited",  lastLogin:"Never",     superAdmin:false,perms:defaultPerms("agency"),createdAt:"2026-03-09"},
  // Agency users — ProCare Staffing
  {id:"u8", name:"Daniel Reid",    email:"d.reid@procare.co.uk",           role:"agency",org:"ProCare Staffing",   status:"active",   lastLogin:"2026-03-09",superAdmin:true, perms:defaultPerms("agency"),createdAt:"2023-03-10"},
  {id:"u18",name:"Fatima Nasser",  email:"f.nasser@procare.co.uk",         role:"agency",org:"ProCare Staffing",   status:"active",   lastLogin:"2026-03-08",superAdmin:false,perms:{...defaultPerms("agency"),invoices:false,users:false},createdAt:"2024-01-20"},
  {id:"u19",name:"Greg Palmer",    email:"g.palmer@procare.co.uk",         role:"agency",org:"ProCare Staffing",   status:"active",   lastLogin:"2026-03-07",superAdmin:false,perms:{...defaultPerms("agency"),onboard:false,users:false},createdAt:"2024-07-01"},
  // Agency users — MedStaff UK
  {id:"u9", name:"Priya Shah",     email:"priya@medstaff.co.uk",           role:"agency",org:"MedStaff UK",        status:"active",   lastLogin:"2026-03-06",superAdmin:true, perms:defaultPerms("agency"),createdAt:"2024-01-08"},
  {id:"u20",name:"Owen Clarke",    email:"o.clarke@medstaff.co.uk",        role:"agency",org:"MedStaff UK",        status:"active",   lastLogin:"2026-03-05",superAdmin:false,perms:{...defaultPerms("agency"),invoices:false,users:false},createdAt:"2024-06-15"},
  // Agency users — CareForce
  {id:"u21",name:"Mike Turner",    email:"mike@careforce.co.uk",           role:"agency",org:"CareForce",          status:"active",   lastLogin:"2026-03-04",superAdmin:true, perms:defaultPerms("agency"),createdAt:"2024-06-01"},
  {id:"u22",name:"Bev Simmons",    email:"b.simmons@careforce.co.uk",      role:"agency",org:"CareForce",          status:"active",   lastLogin:"2026-03-03",superAdmin:false,perms:{...defaultPerms("agency"),invoices:false,users:false},createdAt:"2025-01-10"},
  // Bank staff users
  {id:"u10",name:"Diane Foster",email:"d.foster@internal.co.uk",role:"bank",org:"Bank Staff",status:"active",lastLogin:"2026-03-10",superAdmin:false,perms:defaultPerms("bank"),createdAt:"2024-05-01"},
  {id:"u11",name:"Carlos Mendes",email:"c.mendes@internal.co.uk",role:"bank",org:"Bank Staff",status:"active",lastLogin:"2026-03-09",superAdmin:false,perms:{...defaultPerms("bank"),earnings:false},createdAt:"2024-05-01"},
  {id:"u12",name:"Yvette Okafor",email:"y.okafor@internal.co.uk",role:"bank",org:"Bank Staff",status:"suspended",lastLogin:"2026-02-14",superAdmin:false,perms:defaultPerms("bank"),createdAt:"2024-06-10"},
];

/* ─── COMPLIANCE REQUIREMENTS ────────────────────────────────────────────────── */
const INIT_COMPLIANCE_REQS = [
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

const CARE_HOMES = [
  {id:1,name:"Sunrise Care",contact:"Karen Hughes",email:"k.hughes@sunrise.co.uk",beds:42,type:"Residential"},
  {id:2,name:"Meadowbrook Lodge",contact:"Paul Osei",email:"p.osei@meadowbrook.co.uk",beds:58,type:"Nursing"},
  {id:3,name:"Oakwood Nursing",contact:"Janet Mills",email:"j.mills@oakwood.co.uk",beds:36,type:"Dementia"},
  {id:4,name:"Riverside Manor",contact:"Steve Walters",email:"s.walters@riverside.co.uk",beds:64,type:"Nursing"},
];

const INIT_CLIENT_GROUPS = [
  {
    id:"cg1",
    name:"Sunrise Healthcare Group",
    type:"Residential & Nursing",
    contact:"Margaret Cole",
    email:"m.cole@sunrisehealthcare.co.uk",
    phone:"0161 400 1100",
    address:"12 Corporate Way, Manchester, M1 4AB",
    website:"sunrisehealthcare.co.uk",
    contractStart:"2024-01-01",
    contractEnd:"2026-12-31",
    status:"active",
    notes:"Preferred client — 3 year framework agreement",
    locations:[
      {id:"l1",name:"Sunrise Care",type:"Residential",address:"14 Park Lane, Didsbury, Manchester, M20 2GH",beds:42,contact:"Karen Hughes",email:"k.hughes@sunrise.co.uk",phone:"0161 400 1101",cqcRating:"Good",cqcDate:"2025-04-12",status:"active",notes:""},
      {id:"l2",name:"Sunrise Dementia Unit",type:"Dementia",address:"22 Oak Street, Chorlton, Manchester, M21 9WQ",beds:28,contact:"Donna Clarke",email:"d.clarke@sunrise.co.uk",phone:"0161 400 1102",cqcRating:"Outstanding",cqcDate:"2025-01-08",status:"active",notes:"Specialist dementia unit — mandatory dementia care training required"},
    ]
  },
  {
    id:"cg2",
    name:"Lakeside Care Ltd",
    type:"Nursing",
    contact:"Paul Osei",
    email:"p.osei@lakesidecare.co.uk",
    phone:"0113 500 2200",
    address:"Lakeside House, Leeds, LS1 3EF",
    website:"lakesidecare.co.uk",
    contractStart:"2024-03-01",
    contractEnd:"2025-12-31",
    status:"active",
    notes:"Contract renewal due Dec 2025",
    locations:[
      {id:"l3",name:"Meadowbrook Lodge",type:"Nursing",address:"8 Meadow Road, Headingley, Leeds, LS6 3AB",beds:58,contact:"Paul Osei",email:"p.osei@meadowbrook.co.uk",phone:"0113 500 2201",cqcRating:"Good",cqcDate:"2024-11-20",status:"active",notes:"High-dependency nursing unit — RGN minimum required"},
      {id:"l4",name:"Oakwood Nursing",type:"Dementia",address:"55 Oakwood Drive, Chapel Allerton, Leeds, LS7 4PJ",beds:36,contact:"Janet Mills",email:"j.mills@oakwood.co.uk",phone:"0113 500 2202",cqcRating:"Requires Improvement",cqcDate:"2024-06-15",status:"active",notes:"CQC improvement plan in progress"},
    ]
  },
  {
    id:"cg3",
    name:"Riverside Care Holdings",
    type:"Residential",
    contact:"Steve Walters",
    email:"s.walters@riversidecare.co.uk",
    phone:"0121 600 3300",
    address:"Riverside House, Birmingham, B1 1TT",
    website:"riversidecare.co.uk",
    contractStart:"2024-06-01",
    contractEnd:"2027-05-31",
    status:"active",
    notes:"",
    locations:[
      {id:"l5",name:"Riverside Manor",type:"Nursing",address:"1 River View, Edgbaston, Birmingham, B15 3TE",beds:64,contact:"Steve Walters",email:"s.walters@riverside.co.uk",phone:"0121 600 3301",cqcRating:"Good",cqcDate:"2025-02-28",status:"inactive",notes:"Currently inactive — Steve Walters on leave"},
    ]
  },
];


const ANALYTICS_FILL = [
  {month:"Oct",rate:78},{month:"Nov",rate:82},{month:"Dec",rate:75},{month:"Jan",rate:84},{month:"Feb",rate:89},{month:"Mar",rate:91},
];
const ANALYTICS_SPEND = [
  {month:"Oct",spend:62000},{month:"Nov",spend:71000},{month:"Dec",spend:54000},{month:"Jan",spend:78000},{month:"Feb",spend:83000},{month:"Mar",spend:75500},
];
const ANALYTICS_SHIFTS = [
  {month:"Oct",open:24,filled:78},{month:"Nov",open:18,filled:92},{month:"Dec",open:30,filled:68},{month:"Jan",open:15,filled:85},{month:"Feb",open:12,filled:98},{month:"Mar",open:6,filled:41},
];
const AGENCY_PIE = [{name:"First Choice",value:42},{name:"ProCare",value:38},{name:"MedStaff UK",value:21},{name:"CareForce",value:14}];
const PIE_COLORS = [T.amber, T.blue, T.teal, T.purple];

const DOCS = [
  {id:1,worker:"Sarah Johnson",type:"DBS Certificate",uploaded:"2025-03-01",expires:"2027-03-01",status:"verified"},
  {id:2,worker:"Sarah Johnson",type:"Mandatory Training",uploaded:"2024-09-15",expires:"2026-09-15",status:"verified"},
  {id:3,worker:"Mohammed Ali",type:"DBS Certificate",uploaded:"2024-12-01",expires:"2026-12-01",status:"verified"},
  {id:4,worker:"Mohammed Ali",type:"Mandatory Training",uploaded:"2024-04-01",expires:"2026-04-01",status:"expiring"},
  {id:5,worker:"Emma Clarke",type:"DBS Certificate",uploaded:"2025-06-01",expires:"2027-06-01",status:"verified"},
  {id:6,worker:"James Wilson",type:"DBS Certificate",uploaded:"2024-04-15",expires:"2026-04-15",status:"expiring"},
  {id:7,worker:"Priya Patel",type:"Mandatory Training",uploaded:"2023-12-01",expires:"2025-12-01",status:"expired"},
];

/* ─── ATOMS ──────────────────────────────────────────────────────────────────── */
const Badge = ({label,color=T.blue,bg=T.blueBg,dot}) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700,letterSpacing:"0.05em",color,background:bg,textTransform:"uppercase",whiteSpace:"nowrap"}}>
    {dot && <span style={{width:6,height:6,borderRadius:"50%",background:color,display:"inline-block"}}/>}{label}
  </span>
);

const statusConfig = {
  open:{label:"Open",color:T.blue,bg:T.blueBg},
  pending:{label:"Pending",color:T.yellow,bg:T.yellowBg},
  filled:{label:"Filled",color:T.green,bg:T.greenBg},
  paid:{label:"Paid",color:T.green,bg:T.greenBg},
  draft:{label:"Draft",color:T.muted,bg:"#f1f5f9"},
  overdue:{label:"Overdue",color:T.red,bg:T.redBg},
  active:{label:"Active",color:T.green,bg:T.greenBg},
  verified:{label:"Verified",color:T.green,bg:T.greenBg},
  expiring:{label:"Expiring",color:T.yellow,bg:T.yellowBg},
  expired:{label:"Expired",color:T.red,bg:T.redBg},
  valid:{label:"Valid",color:T.green,bg:T.greenBg},
};
const SBadge = ({s}) => { const c = statusConfig[s]||statusConfig.open; return <Badge label={c.label} color={c.color} bg={c.bg} dot />; };

const Btn = ({children,onClick,variant="primary",small,disabled,full}) => {
  const vs = {
    primary:{background:T.amber,color:T.navy,border:"none"},
    secondary:{background:"transparent",color:T.text,border:`1.5px solid ${T.border}`},
    danger:{background:T.redBg,color:T.red,border:`1.5px solid #fca5a5`},
    ghost:{background:"transparent",color:T.muted,border:"none"},
    dark:{background:T.navy,color:T.white,border:"none"},
  };
  const s = vs[variant];
  return (
    <button onClick={onClick} disabled={disabled} style={{...s,padding:small?"5px 12px":"9px 18px",borderRadius:8,fontSize:small?11:13,fontWeight:600,cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.5:1,transition:"all 0.15s",width:full?"100%":undefined,fontFamily:"Syne,sans-serif"}}>
      {children}
    </button>
  );
};

const Stat = ({label,value,sub,accent,icon,trend,trendUp}) => (
  <div style={{background:T.white,borderRadius:12,padding:"20px 22px",border:`1px solid ${T.border}`,position:"relative",overflow:"hidden"}}>
    {accent && <div style={{position:"absolute",top:0,left:0,width:3,height:"100%",background:T.amber}}/>}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <div>
        <div style={{fontSize:12,color:T.muted,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</div>
        <div style={{fontSize:28,fontWeight:800,color:T.text,lineHeight:1,letterSpacing:"-0.02em"}}>{value}</div>
        {sub && <div style={{fontSize:11,color:T.muted,marginTop:5}}>{sub}</div>}
        {trend && <div style={{fontSize:11,marginTop:5,fontWeight:600,color:trendUp?T.green:T.red}}>{trendUp?"↑":"↓"} {trend}</div>}
      </div>
      {icon && <div style={{fontSize:22,opacity:0.3}}>{icon}</div>}
    </div>
  </div>
);

const Grid = ({cols=4,gap=16,children,style={}}) => (
  <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},1fr)`,gap,marginBottom:20,...style}}>{children}</div>
);

const Card = ({children,style={}}) => (
  <div style={{background:T.white,borderRadius:12,border:`1px solid ${T.border}`,...style}}>{children}</div>
);

const CardHead = ({title,sub,action,icon}) => (
  <div style={{padding:"16px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      {icon && <span style={{fontSize:16}}>{icon}</span>}
      <div>
        <div style={{fontWeight:700,fontSize:14,color:T.text}}>{title}</div>
        {sub && <div style={{fontSize:11,color:T.muted,marginTop:1}}>{sub}</div>}
      </div>
    </div>
    {action}
  </div>
);

const Th = ({children}) => <th style={{padding:"10px 14px",fontSize:11,fontWeight:700,color:T.muted,textAlign:"left",textTransform:"uppercase",letterSpacing:"0.07em",background:"#f8fafc",borderBottom:`1px solid ${T.border}`}}>{children}</th>;
const Td = ({children,bold}) => <td style={{padding:"11px 14px",fontSize:13,color:bold?T.text:T.text,fontWeight:bold?600:400,verticalAlign:"middle",borderBottom:`1px solid ${T.border}`}}>{children}</td>;

const Table = ({headers,rows,empty}) => (
  <div style={{overflowX:"auto"}}>
    <table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead><tr>{headers.map((h,i)=><Th key={i}>{h}</Th>)}</tr></thead>
      <tbody>{rows.length ? rows : (empty && <tr><td colSpan={headers.length} style={{padding:32,textAlign:"center",color:T.muted,fontSize:13}}>{empty}</td></tr>)}</tbody>
    </table>
  </div>
);

const Page = ({title,sub,action,children,icon}) => (
  <div style={{flex:1,padding:"32px 36px",background:T.bg,minHeight:"100vh",fontFamily:"Syne,sans-serif",maxWidth:"100%",overflow:"hidden"}}>
    <style>{FONTS}</style>
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:28}}>
      <div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {icon && <span style={{fontSize:22}}>{icon}</span>}
          <h1 style={{fontSize:22,fontWeight:800,color:T.text,fontFamily:"Instrument Serif,serif",letterSpacing:"-0.02em"}}>{title}</h1>
        </div>
        {sub && <p style={{fontSize:13,color:T.muted,marginTop:3}}>{sub}</p>}
      </div>
      {action}
    </div>
    {children}
  </div>
);

const Input = ({label,value,onChange,type="text",placeholder,required,small}) => (
  <div style={{marginBottom:small?0:16}}>
    {label && <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>{label}{required&&<span style={{color:T.red}}> *</span>}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,color:T.text,background:T.white,outline:"none"}} />
  </div>
);

const Select = ({label,value,onChange,options,required}) => (
  <div style={{marginBottom:16}}>
    {label && <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>{label}{required&&<span style={{color:T.red}}> *</span>}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,color:T.text,background:T.white}}>
      {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
    </select>
  </div>
);

const Alert = ({type="info",children}) => {
  const cfg = {info:{bg:T.blueBg,border:T.blue,color:T.blue},warn:{bg:T.yellowBg,border:T.yellow,color:T.yellow},warning:{bg:T.yellowBg,border:T.yellow,color:T.yellow},error:{bg:T.redBg,border:T.red,color:T.red},success:{bg:T.greenBg,border:T.green,color:T.green}};
  const c = cfg[type] || cfg.info;
  return <div style={{background:c.bg,borderLeft:`3px solid ${c.border}`,borderRadius:6,padding:"10px 14px",fontSize:12,color:T.text,marginBottom:12,lineHeight:1.6}}>{children}</div>;
};

const Modal = ({title,onClose,children,width=520}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(8,19,42,0.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div style={{background:T.white,borderRadius:16,width:"100%",maxWidth:width,maxHeight:"90vh",overflow:"auto",boxShadow:"0 25px 60px rgba(0,0,0,0.3)"}}>
      <div style={{padding:"20px 24px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <span style={{fontWeight:700,fontSize:16,color:T.text}}>{title}</span>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:T.muted,lineHeight:1}}>×</button>
      </div>
      <div style={{padding:"24px"}}>{children}</div>
    </div>
  </div>
);

const ProgressBar = ({value,max=100,color=T.green}) => (
  <div style={{height:6,background:T.border,borderRadius:3,overflow:"hidden"}}>
    <div style={{height:"100%",width:`${Math.min(100,(value/max)*100)}%`,background:color,borderRadius:3,transition:"width 0.3s"}}/>
  </div>
);

const Pill = ({label,active,onClick}) => (
  <button onClick={onClick} style={{padding:"5px 14px",borderRadius:20,border:`1.5px solid ${active?T.amber:T.border}`,background:active?T.amberBg:T.white,color:active?T.amberText:T.muted,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"Syne,sans-serif",transition:"all 0.15s"}}>
    {label}
  </button>
);

/* ─── EXPORT UTILITIES ───────────────────────────────────────────────────────── */
const exportCSV = (filename, headers, rows) => {
  const escape = v => {
    const s = v == null ? "" : String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g,'""')}"` : s;
  };
  const csv = [headers, ...rows].map(r => r.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=filename; a.click();
  URL.revokeObjectURL(url);
};

const exportHTML = (title, subtitle, tableHTML) => {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,sans-serif;font-size:12px;color:#1e293b;padding:32px 40px}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:16px;border-bottom:2px solid #f59e0b}
    .logo{font-size:20px;font-weight:900;color:#08132a;letter-spacing:-0.5px}
    .logo span{color:#f59e0b}
    .meta{text-align:right;font-size:11px;color:#64748b}
    h1{font-size:18px;font-weight:800;margin-bottom:4px}
    .subtitle{font-size:12px;color:#64748b;margin-bottom:24px}
    table{width:100%;border-collapse:collapse;font-size:11px}
    th{background:#08132a;color:#fff;padding:8px 10px;text-align:left;font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:0.05em}
    td{padding:7px 10px;border-bottom:1px solid #e2e8f0}
    tr:nth-child(even) td{background:#f8fafc}
    tr:last-child td{border-bottom:none}
    .footer{margin-top:24px;font-size:10px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px;display:flex;justify-content:space-between}
    @media print{body{padding:16px 20px}}
  </style></head><body>
  <div class="header">
    <div class="logo">First Choice<span>Connect</span></div>
    <div class="meta"><div>Generated: ${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</div><div>Nexus RPO Ltd</div></div>
  </div>
  <h1>${title}</h1><p class="subtitle">${subtitle||""}</p>
  ${tableHTML}
  <div class="footer"><span>Nexus RPO — Confidential</span><span>Page 1</span></div>
  </body></html>`;
  const blob = new Blob([html], {type:"text/html;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=`${title.replace(/\s+/g,"-")}.html`; a.click();
  URL.revokeObjectURL(url);
};

const buildTable = (headers, rows) =>
  `<table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c??""}</td>`).join("")}</tr>`).join("")}</tbody></table>`;

// ExportButton — drop-in component for any page
const ExportMenu = ({exports}) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(()=>{
    const handle = e => { if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handle);
    return ()=>document.removeEventListener("mousedown", handle);
  },[]);
  return (
    <div ref={ref} style={{position:"relative",display:"inline-block"}}>
      <button onClick={()=>setOpen(o=>!o)}
        style={{display:"flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:8,border:`1.5px solid ${T.border}`,background:T.white,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"Syne,sans-serif",color:T.text}}>
        ⬇ Export {open?"▲":"▼"}
      </button>
      {open&&(
        <div style={{position:"absolute",right:0,top:"calc(100% + 6px)",background:T.white,border:`1.5px solid ${T.border}`,borderRadius:10,boxShadow:"0 8px 24px rgba(0,0,0,0.1)",zIndex:100,minWidth:200,overflow:"hidden"}}>
          {exports.map((ex,i)=>(
            <button key={i} onClick={()=>{ex.fn();setOpen(false);}}
              style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 14px",background:"none",border:"none",cursor:"pointer",fontFamily:"Syne,sans-serif",fontSize:12,color:T.text,textAlign:"left",borderBottom:i<exports.length-1?`1px solid ${T.border}`:"none"}}>
              <span style={{fontSize:15}}>{ex.icon}</span>
              <div>
                <div style={{fontWeight:700}}>{ex.label}</div>
                {ex.desc&&<div style={{fontSize:10,color:T.muted,marginTop:1}}>{ex.desc}</div>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const urgencyColor = u => u==="urgent"?T.red:u==="high"?T.yellow:"#94a3b8";
const TIER_CFG = {
  "Tier 1": {c:"#b45309", bg:"#fef3c7", border:"#fcd34d", label:"Tier 1 — Priority"},
  "Tier 2": {c:T.blue,    bg:T.blueBg,  border:"#93c5fd", label:"Tier 2 — Secondary"},
  "Tier 3": {c:T.muted,   bg:"#f1f5f9", border:T.border,  label:"Tier 3 — Supplementary"},
};
const tierColor  = t => TIER_CFG[t]?.c  || T.muted;
const tierBg     = t => TIER_CFG[t]?.bg  || "#f1f5f9";
const UrgDot = ({u}) => <span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:urgencyColor(u),marginRight:5}}/>;

/* ─── AUTH SCREEN ────────────────────────────────────────────────────────────── */
const AuthScreen = ({onAuth}) => {
  const [mode,setMode] = useState("login");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [name,setName] = useState("");
  const [role,setRole] = useState("admin");
  const [org,setOrg] = useState("");
  const [error,setError] = useState("");

  const handle = () => {
    if(!email||!password){setError("Please fill in all required fields.");return;}
    if(mode==="register"&&!name){setError("Please enter your name.");return;}
    setError("");
    onAuth({email,name:name||"Admin User",role,org:org||"Nexus RPO"});
  };

  return (
    <div style={{minHeight:"100vh",display:"grid",gridTemplateColumns:"1fr 1fr",fontFamily:"Syne,sans-serif"}}>
      <style>{FONTS}</style>
      <div style={{background:`linear-gradient(145deg,${T.navy} 0%,#1a3060 100%)`,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"48px"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <FCCLogo size={36} showText={true} textColor={T.white} textSize={20}/>
        </div>
        <div>
          <h2 style={{fontFamily:"Instrument Serif,serif",fontSize:40,color:T.white,lineHeight:1.15,marginBottom:20,letterSpacing:"-0.02em"}}>Healthcare workforce,<br/><em style={{color:T.amber}}>connected.</em></h2>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:14,lineHeight:1.8,maxWidth:360}}>One platform connecting care homes, agencies, and workers — with full compliance tracking, automated invoicing, and real-time shift management.</p>
          <div style={{marginTop:40,display:"flex",flexDirection:"column",gap:12}}>
            {["Neutral vendor shift distribution","Live compliance & credential tracking","Automated invoicing & rate cards","Multi-role access portals"].map((f,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,fontSize:13,color:"rgba(255,255,255,0.65)"}}>
                <span style={{color:T.amber,fontWeight:700}}>✓</span>{f}
              </div>
            ))}
          </div>
        </div>
        <p style={{color:"rgba(255,255,255,0.2)",fontSize:11}}>© 2026 Nexus RPO Ltd. All rights reserved.</p>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"32px 48px",background:"#fafbfd",overflowY:"auto"}}>
        <div style={{width:"100%",maxWidth:400}}>
          <h2 style={{fontSize:24,fontWeight:800,color:T.text,marginBottom:4}}>{mode==="login"?"Welcome back":"Create account"}</h2>
          <p style={{fontSize:13,color:T.muted,marginBottom:20}}>{mode==="login"?"Sign in to your Nexus RPO portal":"Set up your Nexus RPO account"}</p>
          {error && <Alert type="error">{error}</Alert>}
          {/* Demo quick-access — shown prominently at top in login mode */}
          {mode==="login" && (
            <div style={{background:T.amberBg,border:`1.5px solid ${T.amber}55`,borderRadius:10,padding:"12px 14px",marginBottom:20}}>
              <div style={{fontSize:11,fontWeight:700,color:T.amberText,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>🚀 Demo — tap a role to jump straight in</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {[
                  {r:"admin",       l:"Nexus Admin",      name:"Rachel Obi"},
                  {r:"clientadmin", l:"Client Admin",   name:"Margaret Cole"},
                  {r:"carehome",    l:"Site Manager",   name:"Karen Hughes"},
                  {r:"agency",      l:"Agency",         name:"Laura Bennett"},
                  {r:"bank",        l:"Bank Staff",     name:"Diane Foster"},
                ].map(x=>(
                  <button key={x.r}
                    onClick={()=>onAuth({email:"demo@example.com",name:x.name,role:x.r,org:x.r==="admin"?"Nexus RPO":x.r==="clientadmin"?"Sunrise Healthcare Group":x.r==="carehome"?"Sunrise Care":x.r==="agency"?"First Choice Nursing":"Bank Staff"})}
                    style={{padding:"7px 14px",borderRadius:7,background:x.r==="bank"?T.teal:x.r==="carehome"?T.blue:x.r==="clientadmin"?"#7c3aed":T.amber,border:"none",fontSize:12,fontWeight:700,cursor:"pointer",color:x.r==="bank"||x.r==="carehome"||x.r==="clientadmin"?T.white:T.navy,fontFamily:"Syne,sans-serif",flex:"1 1 auto",textAlign:"center"}}>
                    {x.l}
                  </button>
                ))}
              </div>
            </div>
          )}
          {mode==="register" && <Input label="Full Name" value={name} onChange={setName} placeholder="Your name" required />}
          <Input label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@organisation.co.uk" required />
          <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
          {mode==="register" && <>
            <Select label="Your Role" value={role} onChange={setRole} options={[{value:"admin",label:"Neutral Vendor Admin"},{value:"carehome",label:"Care Home Manager"},{value:"agency",label:"Agency Coordinator"}]} />
            <Input label="Organisation" value={org} onChange={setOrg} placeholder="Your organisation name" />
          </>}
          <div style={{marginTop:8,marginBottom:16}}>
            <Btn onClick={handle} full>
              {mode==="login"?"Sign In →":"Create Account →"}
            </Btn>
          </div>
          <p style={{fontSize:12,color:T.muted,textAlign:"center"}}>
            {mode==="login"?"Don't have an account?":"Already have an account?"}{" "}
            <button onClick={()=>setMode(m=>m==="login"?"register":"login")} style={{background:"none",border:"none",color:T.amber,fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:"Syne,sans-serif"}}>
              {mode==="login"?"Sign up":"Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

/* ─── EXTENDED SHIFT DATA (unfill reasons, response times, recurring patterns) ─ */
const UNFILL_REASONS = ["No workers available","Rate too low","Short notice","Location too far","Worker declined","No response from agency","Already filled externally"];

const SHIFT_RESPONSE_TIMES = [
  {shiftId:1, agency:"First Choice Nursing", broadcastTime:"06:30", submittedTime:"06:48", minsMins:18},
  {shiftId:3, agency:"MedStaff UK",          broadcastTime:"08:00", submittedTime:"08:47", minsMins:47},
  {shiftId:7, agency:"First Choice Nursing", broadcastTime:"09:00", submittedTime:"09:24", minsMins:24},
  {shiftId:12,agency:"First Choice Nursing", broadcastTime:"14:00", submittedTime:"14:19", minsMins:19},
];

const INIT_RECURRING_PATTERNS = [
  {id:"rp1",carehome:"Sunrise Care",role:"RGN",days:["Mon","Wed","Fri"],time:"07:00–19:00",rate:35,active:true,createdBy:"Karen Hughes",notes:"Regular day cover"},
  {id:"rp2",carehome:"Sunrise Care",role:"HCA",days:["Sat","Sun"],time:"07:00–19:00",rate:18,active:true,createdBy:"Karen Hughes",notes:"Weekend HCA cover"},
  {id:"rp3",carehome:"Meadowbrook Lodge",role:"RGN",days:["Tue","Thu"],time:"19:00–07:00",rate:36,active:false,createdBy:"Paul Osei",notes:"Night cover — paused"},
];

/* ─── BUDGET DATA ─────────────────────────────────────────────────────────────── */
/* ─── BANK STAFF RATES ───────────────────────────────────────────────────────── */
const CA_PURPLE    = "#7c3aed";
const CA_PURPLE_BG = "#f5f3ff";
const INIT_BANK_RATES = {
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

const ROLES = ["RGN","RMN","HCA","Senior Carer","Deputy Manager"];
const SHIFT_DAYS = [
  {k:"weekday",     l:"Weekday",    sub:"Mon–Fri"},
  {k:"saturday",    l:"Saturday",   sub:""},
  {k:"sunday",      l:"Sunday",     sub:""},
  {k:"bankHoliday", l:"Bank Hol",   sub:""},
];

const BankRateCards = ({user, bankRates, setBankRates}) => {
  const isClientAdmin = user?.role === "clientadmin";
  const rates  = bankRates || INIT_BANK_RATES;
  const [tab,   setTab]   = useState("global");        // "global" | site name
  const [editRow, setEditRow] = useState(null);        // row being edited
  const [editForm, setEditForm] = useState({});
  const [newForm, setNewForm] = useState({role:"RGN", weekday:"", saturday:"", sunday:"", bankHoliday:"", nightMod:"1.20", notes:""});
  const [showAdd, setShowAdd] = useState(false);

  const sites = Object.keys(rates.sites||{});
  const isGlobal = tab === "global";
  const currentRows = isGlobal ? (rates.global||[]) : (rates.sites?.[tab]||[]);
  const globalRow   = role => (rates.global||[]).find(r=>r.role===role);

  const save = (updated) => {
    if(setBankRates) setBankRates(updated);
  };

  const openEdit = (row) => { setEditRow(row.id); setEditForm({...row}); };

  const saveEdit = () => {
    const updated = {...rates};
    if(isGlobal){
      updated.global = rates.global.map(r=>r.id===editRow?{...editForm,weekday:+editForm.weekday,saturday:+editForm.saturday,sunday:+editForm.sunday,bankHoliday:+editForm.bankHoliday,nightMod:+editForm.nightMod}:r);
    } else {
      updated.sites = {...rates.sites, [tab]: (rates.sites[tab]||[]).map(r=>r.id===editRow?{...editForm,weekday:+editForm.weekday,saturday:+editForm.saturday,sunday:+editForm.sunday,bankHoliday:+editForm.bankHoliday,nightMod:+editForm.nightMod}:r)};
    }
    save(updated); setEditRow(null);
  };

  const addRow = () => {
    const id = `br${Date.now()}`;
    const row = {...newForm, id, weekday:+newForm.weekday, saturday:+newForm.saturday, sunday:+newForm.sunday, bankHoliday:+newForm.bankHoliday, nightMod:+newForm.nightMod};
    const updated = {...rates};
    if(isGlobal){
      updated.global = [...(rates.global||[]), row];
    } else {
      updated.sites = {...rates.sites, [tab]: [...(rates.sites[tab]||[]), row]};
    }
    save(updated);
    setNewForm({role:"RGN", weekday:"", saturday:"", sunday:"", bankHoliday:"", nightMod:"1.20", notes:""});
    setShowAdd(false);
  };

  const deleteRow = (id) => {
    const updated = {...rates};
    if(isGlobal){
      updated.global = rates.global.filter(r=>r.id!==id);
    } else {
      updated.sites = {...rates.sites, [tab]: (rates.sites[tab]||[]).filter(r=>r.id!==id)};
    }
    save(updated);
  };

  const accent = isClientAdmin ? CA_PURPLE : T.teal;

  const RateInput = ({label, field}) => (
    <div>
      <label style={{display:"block",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>{label}</label>
      <div style={{position:"relative"}}>
        <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",fontSize:12,color:T.muted,fontWeight:700}}>£</span>
        <input type="number" value={editForm[field]||""} onChange={e=>setEditForm(f=>({...f,[field]:e.target.value}))}
          style={{width:"100%",padding:"8px 8px 8px 22px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:"Syne,sans-serif",outline:"none",boxSizing:"border-box"}}/>
      </div>
    </div>
  );
  const NewRateInput = ({label, field}) => (
    <div>
      <label style={{display:"block",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>{label}</label>
      <div style={{position:"relative"}}>
        <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",fontSize:12,color:T.muted,fontWeight:700}}>£</span>
        <input type="number" value={newForm[field]||""} onChange={e=>setNewForm(f=>({...f,[field]:e.target.value}))}
          style={{width:"100%",padding:"8px 8px 8px 22px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:"Syne,sans-serif",outline:"none",boxSizing:"border-box"}}/>
      </div>
    </div>
  );

  return (
    <Page title="Bank Staff Rates" sub="Set pay rates for internal bank staff by role and shift type" icon="🏦">

      {/* Tabs — Global + per site */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:4}}>
        {["global",...sites].map(t=>{
          const isActive = tab===t;
          return (
            <button key={t} onClick={()=>{setTab(t);setShowAdd(false);setEditRow(null);}}
              style={{padding:"7px 16px",borderRadius:20,border:`1.5px solid ${isActive?accent:T.border}`,
                background:isActive?`${accent}18`:T.white,fontWeight:700,fontSize:12,cursor:"pointer",
                color:isActive?accent:T.muted,fontFamily:"Syne,sans-serif"}}>
              {t==="global" ? "🌐 Platform Default" : `🏥 ${t}`}
            </button>
          );
        })}
      </div>

      {/* Context banner */}
      <Alert type={isGlobal?"info":"warning"}>
        {isGlobal
          ? "These are the default bank rates applied across all sites. Individual sites can have their own override rates below."
          : `These rates override the platform defaults for ${tab} only. Any role not listed here falls back to the platform default rate.`}
      </Alert>

      {/* Rate table */}
      <Card>
        <CardHead
          title={isGlobal ? "Platform Default Bank Rates" : `${tab} — Override Rates`}
          sub="All rates are pay rates (£/hr) — what bank staff are paid"
          action={<Btn small onClick={()=>setShowAdd(s=>!s)}>{showAdd?"Cancel":"+ Add Rate"}</Btn>}
        />

        {/* Add new row form */}
        {showAdd && (
          <div style={{padding:"16px 20px",background:"#f8fafc",borderBottom:`1px solid ${T.border}`}}>
            <div style={{fontSize:12,fontWeight:700,color:T.text,marginBottom:12}}>New rate row</div>
            <div style={{display:"grid",gridTemplateColumns:"140px 1fr 1fr 1fr 1fr 100px 1fr",gap:10,alignItems:"end"}}>
              <div>
                <label style={{display:"block",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Role</label>
                <select value={newForm.role} onChange={e=>setNewForm(f=>({...f,role:e.target.value}))}
                  style={{width:"100%",padding:"8px 10px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:"Syne,sans-serif",outline:"none"}}>
                  {ROLES.map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              {SHIFT_DAYS.map(d=><NewRateInput key={d.k} label={d.l} field={d.k}/>)}
              <div>
                <label style={{display:"block",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Night Mod</label>
                <input type="number" step="0.01" value={newForm.nightMod} onChange={e=>setNewForm(f=>({...f,nightMod:e.target.value}))}
                  style={{width:"100%",padding:"8px 10px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:"Syne,sans-serif",outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>Notes</label>
                <input type="text" value={newForm.notes} onChange={e=>setNewForm(f=>({...f,notes:e.target.value}))} placeholder="Optional"
                  style={{width:"100%",padding:"8px 10px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:"Syne,sans-serif",outline:"none",boxSizing:"border-box"}}/>
              </div>
            </div>
            <div style={{marginTop:12,display:"flex",gap:8}}>
              <Btn onClick={addRow} disabled={!newForm.weekday||!newForm.saturday||!newForm.sunday||!newForm.bankHoliday}
                style={{background:accent}}>Save Rate</Btn>
              <Btn variant="secondary" onClick={()=>setShowAdd(false)}>Cancel</Btn>
            </div>
          </div>
        )}

        {/* Non-global: show which global rates are inherited */}
        {!isGlobal && (
          <div style={{padding:"10px 20px",background:"#f0fdf4",borderBottom:`1px solid ${T.border}`}}>
            <div style={{fontSize:11,fontWeight:700,color:T.green,marginBottom:6}}>✓ Inheriting from platform defaults</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {ROLES.map(role=>{
                const overridden = currentRows.some(r=>r.role===role);
                const gr = globalRow(role);
                return (
                  <span key={role} style={{fontSize:11,padding:"3px 10px",borderRadius:20,
                    background:overridden?"#fef3c7":"#dcfce7",
                    color:overridden?"#b45309":T.green,fontWeight:700}}>
                    {role}: {overridden?"overridden":`£${gr?.weekday||"—"}{"/hr"}`}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <Table
          headers={["Role","Weekday (£/hr)","Saturday (£/hr)","Sunday (£/hr)","Bank Hol (£/hr)","Night Mod","Notes","Actions"]}
          rows={currentRows.length===0
            ? [<tr key="empty"><td colSpan={8} style={{padding:"28px",textAlign:"center",color:T.muted,fontSize:13}}>
                {isGlobal ? "No rates set yet. Use + Add Rate to get started." : `No overrides for ${tab}. All roles use platform default rates.`}
              </td></tr>]
            : currentRows.map(r=>(
              <tr key={r.id} style={{borderBottom:`1px solid ${T.border}`}}>
                {editRow===r.id ? (
                  <>
                    <Td><Badge label={r.role} color={accent} bg={`${accent}18`}/></Td>
                    <Td><RateInput label="" field="weekday"/></Td>
                    <Td><RateInput label="" field="saturday"/></Td>
                    <Td><RateInput label="" field="sunday"/></Td>
                    <Td><RateInput label="" field="bankHoliday"/></Td>
                    <Td>
                      <input type="number" step="0.01" value={editForm.nightMod||""} onChange={e=>setEditForm(f=>({...f,nightMod:e.target.value}))}
                        style={{width:70,padding:"6px 8px",border:`1.5px solid ${T.border}`,borderRadius:7,fontSize:12,fontFamily:"Syne,sans-serif",outline:"none"}}/>
                    </Td>
                    <Td>
                      <input type="text" value={editForm.notes||""} onChange={e=>setEditForm(f=>({...f,notes:e.target.value}))}
                        style={{width:"100%",padding:"6px 8px",border:`1.5px solid ${T.border}`,borderRadius:7,fontSize:12,fontFamily:"Syne,sans-serif",outline:"none"}}/>
                    </Td>
                    <Td>
                      <div style={{display:"flex",gap:5}}>
                        <Btn small onClick={saveEdit} style={{background:accent}}>Save</Btn>
                        <Btn small variant="secondary" onClick={()=>setEditRow(null)}>Cancel</Btn>
                      </div>
                    </Td>
                  </>
                ) : (
                  <>
                    <Td><Badge label={r.role} color={accent} bg={`${accent}18`}/></Td>
                    <Td bold>£{r.weekday}</Td>
                    <Td>£{r.saturday}</Td>
                    <Td>£{r.sunday}</Td>
                    <Td>£{r.bankHoliday}</Td>
                    <Td>
                      <span style={{fontSize:12,fontWeight:700,color:T.muted}}>×{r.nightMod}</span>
                      <div style={{fontSize:10,color:T.muted}}>Night: £{Math.round(r.weekday*r.nightMod)}{"/hr"}</div>
                    </Td>
                    <Td style={{fontSize:12,color:T.muted}}>{r.notes||"—"}</Td>
                    <Td>
                      <div style={{display:"flex",gap:5}}>
                        <Btn small variant="secondary" onClick={()=>openEdit(r)}>Edit</Btn>
                        <Btn small variant="danger" onClick={()=>deleteRow(r.id)}>×</Btn>
                      </div>
                    </Td>
                  </>
                )}
              </tr>
            ))
          }
        />
      </Card>

      {/* Summary comparison card */}
      {isGlobal && currentRows.length > 0 && (
        <Card>
          <CardHead title="Rate Summary — All Roles" sub="Weekday day shift vs night shift comparison"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14,padding:"4px 4px 8px"}}>
            {currentRows.map(r=>(
              <div key={r.id} style={{padding:"14px 16px",borderRadius:10,border:`1.5px solid ${T.border}`,background:"#f8fafc"}}>
                <div style={{fontWeight:800,fontSize:14,color:T.text,marginBottom:10}}>{r.role}</div>
                {SHIFT_DAYS.map(d=>(
                  <div key={d.k} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
                    <span style={{color:T.muted}}>{d.l}</span>
                    <span style={{fontWeight:700,color:T.text}}>£{r[d.k]}{"/hr"}</span>
                  </div>
                ))}
                <div style={{borderTop:`1px solid ${T.border}`,marginTop:8,paddingTop:8,display:"flex",justifyContent:"space-between",fontSize:12}}>
                  <span style={{color:T.muted}}>Night (wkday)</span>
                  <span style={{fontWeight:700,color:accent}}>£{Math.round(r.weekday*r.nightMod)}{"/hr"}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </Page>
  );
};

const INIT_BUDGETS = {
  "Sunrise Care":          {annual:180000, monthly:15000, alertAt75:true,  alertAt90:true,  mtdSpend:8420,  ytdSpend:48200},
  "Sunrise Dementia Unit": {annual:120000, monthly:10000, alertAt75:true,  alertAt90:true,  mtdSpend:6100,  ytdSpend:31400},
  "Oakwood Nursing":       {annual:144000, monthly:12000, alertAt75:false, alertAt90:true,  mtdSpend:7200,  ytdSpend:39800},
  "Meadowbrook Lodge":     {annual:192000, monthly:16000, alertAt75:true,  alertAt90:false, mtdSpend:9800,  ytdSpend:55100},
  "Riverside Manor":       {annual:168000, monthly:14000, alertAt75:true,  alertAt90:true,  mtdSpend:4200,  ytdSpend:22600},
};

/* ─── RATE UPLIFT REQUESTS ────────────────────────────────────────────────────── */
const INIT_RATE_UPLIFTS = [
  {id:"ru1",agency:"First Choice Nursing",role:"RGN",current:32,requested:34,reason:"NMC registration costs increased April 2026",status:"pending",  submittedDate:"2026-03-01",respondedDate:null,respondedBy:null,notes:""},
  {id:"ru2",agency:"ProCare Staffing",    role:"HCA",current:17,requested:18,reason:"National Living Wage uplift",              status:"approved", submittedDate:"2026-02-10",respondedDate:"2026-02-15",respondedBy:"Rachel Obi",notes:"Agreed effective March 2026"},
  {id:"ru3",agency:"MedStaff UK",         role:"RMN",current:34,requested:37,reason:"Specialist mental health premium",         status:"rejected", submittedDate:"2026-01-20",respondedDate:"2026-01-28",respondedBy:"Rachel Obi",notes:"Rate already above market — not approved"},
];

/* ─── CREDIT NOTES ────────────────────────────────────────────────────────────── */
const INIT_CREDIT_NOTES = [
  {id:"CN-001",invoiceRef:"INV-0010",agency:"MedStaff UK",reason:"Disputed hours — 3hr reduction agreed",amount:180,issuedDate:"2026-02-20",status:"applied"},
  {id:"CN-002",invoiceRef:"INV-0012",agency:"ProCare",    reason:"Worker no-show — 1 shift reversed",   amount:420,issuedDate:"2026-03-01",status:"pending"},
];

/* ─── MESSAGES ────────────────────────────────────────────────────────────────── */
const INIT_MESSAGES = [
  {id:"m1", threadId:"t1", shiftId:1,  from:"Karen Hughes",   fromRole:"carehome",  to:"Laura Bennett",  toRole:"agency",      text:"Hi Laura — can you confirm the RGN for tomorrow morning? We need confirmation by 8pm tonight.",                                   timestamp:"2026-03-11T17:32:00",read:false},
  {id:"m2", threadId:"t1", shiftId:1,  from:"Laura Bennett",  fromRole:"agency",    to:"Karen Hughes",   toRole:"carehome",    text:"Hi Karen — yes, putting Emma Clarke forward now. She's fully compliant and has worked with you before.",                          timestamp:"2026-03-11T17:45:00",read:false},
  {id:"m3", threadId:"t2", shiftId:7,  from:"Rachel Obi",     fromRole:"admin",     to:"Priya Shah",     toRole:"agency",      text:"Priya — Oakwood shift on the 15th is still open. Any RGNs available? This is now high priority.",                              timestamp:"2026-03-11T10:00:00",read:false},
  {id:"m4", threadId:"t2", shiftId:7,  from:"Priya Shah",     fromRole:"agency",    to:"Rachel Obi",     toRole:"admin",       text:"We have one RGN available but she needs a rate of £36. Let me know if that's acceptable.",                                       timestamp:"2026-03-11T10:22:00",read:true},
  {id:"m5", threadId:"t3", workerId:4, from:"James Wilson",   fromRole:"worker",    to:"Laura Bennett",  toRole:"agency",      text:"Hi Laura, just wanted to confirm I'm OK for the Oakwood shift on Monday. Should I bring my own scrubs?",                        timestamp:"2026-03-10T14:10:00",read:true},
  {id:"m6", threadId:"t3", workerId:4, from:"Laura Bennett",  fromRole:"agency",    to:"James Wilson",   toRole:"worker",      text:"Hi James — yes, please bring your own. The site code for the car park is 4821.",                                                  timestamp:"2026-03-10T14:35:00",read:true},
];

const INIT_THREADS = [
  {id:"t1", subject:"Shift #1 — Sunrise Care RGN 12 Mar", shiftId:1,  participants:["Karen Hughes","Laura Bennett"], lastMessage:"2026-03-11T17:45:00", unread:1, type:"shift"},
  {id:"t2", subject:"Shift #7 — Oakwood RGN 15 Mar",      shiftId:7,  participants:["Rachel Obi","Priya Shah"],      lastMessage:"2026-03-11T10:22:00", unread:0, type:"shift"},
  {id:"t3", subject:"Worker — James Wilson",               workerId:4, participants:["James Wilson","Laura Bennett"], lastMessage:"2026-03-10T14:35:00", unread:0, type:"worker"},
];

/* ─── NOTIFICATIONS ───────────────────────────────────────────────────────────── */
const INIT_NOTIFICATIONS = {
  admin:[
    {id:"n1", type:"urgent_shift",    title:"Urgent Shift Unfilled",         body:"Sunrise Care RGN 12 Mar — 2h 15m remaining before escalation to Tier 2.", time:"17m ago",  read:false, action:"shifts"},
    {id:"n2", type:"rate_uplift",     title:"Rate Uplift Request",           body:"First Choice Nursing requesting £2/hr increase for RGN. Awaiting your approval.", time:"2h ago",   read:false, action:"ratecards"},
    {id:"n3", type:"invoice_overdue", title:"Invoice Overdue",               body:"INV-0010 (MedStaff UK) is 10 days overdue. £13,200 outstanding.",          time:"1d ago",   read:true,  action:"invoices"},
    {id:"n4", type:"compliance",      title:"Worker Compliance Lapsed",      body:"Priya Patel — mandatory training expired Dec 2025. Cannot be placed.",     time:"3d ago",   read:true,  action:"compliance"},
    {id:"n5", type:"contract",        title:"Contract Renewal Due",          body:"Lakeside Care Ltd contract expires Dec 2025. Renewal workflow triggered.",  time:"5d ago",   read:true,  action:"clients"},
    {id:"n6", type:"message",         title:"New Message",                   body:"Priya Shah (MedStaff UK): We have one RGN available but she needs £36/hr…",time:"1h ago",   read:false, action:"messages"},
  ],
  clientadmin:[
    {id:"n7", type:"budget_alert",    title:"Budget Alert — Meadowbrook Lodge", body:"Meadowbrook Lodge has reached 78% of monthly budget with 3 weeks remaining.", time:"4h ago",  read:false, action:"analytics"},
    {id:"n8", type:"urgent_shift",    title:"Urgent Shift Unfilled",            body:"Sunrise Care RGN 12 Mar still open — no agency has responded.",             time:"17m ago", read:false, action:"shifts"},
    {id:"n9", type:"compliance",      title:"RTW Expiring Soon",                body:"Priya Patel (MedStaff UK) BRP expires 31 Mar. Speak to agency.",            time:"1d ago",  read:true,  action:"rtw"},
    {id:"n10",type:"message",         title:"New Message",                      body:"Karen Hughes: Can you confirm the weekend RGN cover has been arranged?",    time:"3h ago",  read:false, action:"messages"},
  ],
  carehome:[
    {id:"n11",type:"urgent_shift",    title:"Your Shift Needs Filling",      body:"RGN 12 Mar — submitted to Tier 1 agencies. Awaiting response.",              time:"17m ago", read:false, action:"myshifts"},
    {id:"n12",type:"timesheet",       title:"Timesheet Awaiting Approval",   body:"2 timesheets from First Choice Nursing need your sign-off.",                  time:"6h ago",  read:false, action:"timesheets"},
    {id:"n13",type:"budget_alert",    title:"Budget Alert — 90% Reached",    body:"You have spent 90% of this month's agency budget. £1,580 remaining.",        time:"1d ago",  read:true,  action:"dashboard"},
    {id:"n14",type:"message",         title:"New Message",                   body:"Laura Bennett: Yes, putting Emma Clarke forward now. She's fully compliant…", time:"13m ago", read:false, action:"messages"},
  ],
  agency:[
    {id:"n15",type:"urgent_shift",    title:"Urgent Shift — Act Now",        body:"Sunrise Care RGN 12 Mar — 2h 15m left in your Tier 1 window.",               time:"17m ago", read:false, action:"available"},
    {id:"n16",type:"compliance",      title:"Worker Document Expiring",      body:"James Wilson DBS expires 15 Apr. Upload renewal to avoid suspension.",        time:"2h ago",  read:false, action:"rtw"},
    {id:"n17",type:"rate_uplift",     title:"Rate Request Approved",         body:"Your HCA rate uplift request (£1/hr) was approved by Nexus RPO. Effective Mar 2026.",time:"5d ago", read:true,  action:"ratecards"},
    {id:"n18",type:"message",         title:"New Message",                   body:"Karen Hughes: Hi Laura — can you confirm the RGN for tomorrow morning?",      time:"13m ago", read:false, action:"messages"},
  ],
  bank:[
    {id:"n19",type:"urgent_shift",    title:"New Shift in Your Window",      body:"Sunrise Care RGN — 12 Mar, 07:00–19:00. Claim within 2 hours.",              time:"5m ago",  read:false, action:"available"},
    {id:"n20",type:"timesheet",       title:"Timesheet Approved",            body:"Your timesheet for Oakwood Nursing 8 Mar has been approved. Payment processing.",time:"1d ago",read:true,  action:"earnings"},
  ],
};

/* ─── AGENCY ONBOARDING CHECKLISTS ────────────────────────────────────────────── */
const INIT_AGENCY_CHECKLISTS = [
  {agencyId:1,agencyName:"First Choice Nursing",items:[
    {id:"ac1",label:"Signed Framework Agreement",  done:true,  doneDate:"2023-01-10"},
    {id:"ac2",label:"Bank details verified",        done:true,  doneDate:"2023-01-12"},
    {id:"ac3",label:"Public liability insurance",   done:true,  doneDate:"2023-01-14"},
    {id:"ac4",label:"Rate card agreed & signed",    done:true,  doneDate:"2023-01-15"},
    {id:"ac5",label:"Portal training completed",    done:true,  doneDate:"2023-01-18"},
    {id:"ac6",label:"First shift placed",           done:true,  doneDate:"2023-02-01"},
  ]},
  {agencyId:3,agencyName:"MedStaff UK",items:[
    {id:"ac7", label:"Signed Framework Agreement",  done:true,  doneDate:"2024-01-05"},
    {id:"ac8", label:"Bank details verified",        done:true,  doneDate:"2024-01-07"},
    {id:"ac9", label:"Public liability insurance",   done:false, doneDate:null},
    {id:"ac10",label:"Rate card agreed & signed",    done:true,  doneDate:"2024-01-08"},
    {id:"ac11",label:"Portal training completed",    done:false, doneDate:null},
    {id:"ac12",label:"First shift placed",           done:false, doneDate:null},
  ]},
];

/* ─── WORKER FAVOURITES / BLACKLIST ────────────────────────────────────────────── */
const INIT_WORKER_PREFS = [
  {careHome:"Sunrise Care",   workerId:3, workerName:"Emma Clarke",  type:"favourite", addedBy:"Karen Hughes",  note:"Excellent with residents, always punctual"},
  {careHome:"Sunrise Care",   workerId:4, workerName:"James Wilson",  type:"favourite", addedBy:"Karen Hughes",  note:"Familiar with our routines"},
  {careHome:"Oakwood Nursing",workerId:5, workerName:"Priya Patel",   type:"blocked",   addedBy:"Janet Mills",   note:"Previous incident — speak to manager before placing"},
  {careHome:"Meadowbrook Lodge",workerId:7,workerName:"Lisa Park",    type:"favourite", addedBy:"Paul Osei",     note:"Great with dementia patients"},
];

/* ─── DEMAND FORECAST DATA ────────────────────────────────────────────────────── */
const FORECAST_DATA = [
  {week:"w/c 10 Mar",actual:18,forecast:18},
  {week:"w/c 17 Mar",actual:null,forecast:21},
  {week:"w/c 24 Mar",actual:null,forecast:19},
  {week:"w/c 31 Mar",actual:null,forecast:24},
  {week:"w/c 7 Apr", actual:null,forecast:22},
  {week:"w/c 14 Apr",actual:null,forecast:20},
];


const NAV = {
  admin:[
    {k:"dashboard",     i:"◈", l:"Dashboard"},
    {k:"shifts",        i:"📋",l:"Shift Board"},
    {k:"schedule",      i:"📅",l:"Scheduler"},
    {k:"agencies",      i:"🤝",l:"Agencies"},
    {k:"clients",       i:"🏥",l:"Clients"},
    {k:"bankstaff",     i:"🏦",l:"Bank Staff"},
    {k:"workers",       i:"👥",l:"Workers"},
    {k:"compliance",    i:"🛡", l:"Compliance"},
    {k:"expirycal",     i:"📆",l:"Expiry Calendar"},
    {k:"cqcreport",     i:"🏅",l:"CQC Readiness"},
    {k:"documents",     i:"📁",l:"Documents"},
    {k:"ratecards",     i:"💷",l:"Rate Cards"},
    {k:"bankrates",     i:"🏦",l:"Bank Rates"},
    {k:"rateuplifts",   i:"📈",l:"Rate Uplifts"},
    {k:"invoices",      i:"📄",l:"Invoices"},
    {k:"creditnotes",   i:"🧾",l:"Credit Notes"},
    {k:"timesheets",    i:"🕐",l:"Timesheets"},
    {k:"budgets",       i:"💰",l:"Budgets"},
    {k:"analytics",     i:"📊",l:"Analytics"},
    {k:"forecast",      i:"🔮",l:"Demand Forecast"},
    {k:"reports",       i:"🗂", l:"Custom Reports"},
    {k:"messages",      i:"💬",l:"Messages"},
    {k:"siteallocation",i:"📍",l:"Site Allocation"},
    {k:"margins",       i:"📐",l:"Margins & Pricing"},
    {k:"users",         i:"🔐",l:"Users & Permissions"},
  ],
  clientadmin:[
    {k:"dashboard",  i:"◈", l:"Group Overview"},
    {k:"analytics",  i:"📊",l:"Analytics"},
    {k:"forecast",   i:"🔮",l:"Demand Forecast"},
    {k:"locations",  i:"🏥",l:"Locations"},
    {k:"shifts",     i:"📋",l:"All Shifts"},
    {k:"timesheets", i:"🕐",l:"Timesheets"},
    {k:"invoices",   i:"📄",l:"Invoices"},
    {k:"budgets",    i:"💰",l:"Budgets"},
    {k:"bankrates",  i:"🏦",l:"Bank Rates"},
    {k:"compliance", i:"🛡", l:"Compliance"},
    {k:"expirycal",  i:"📆",l:"Expiry Calendar"},
    {k:"rtw",        i:"🪪",l:"RTW Monitoring"},
    {k:"cqcreport",  i:"🏅",l:"CQC Readiness"},
    {k:"reports",    i:"🗂", l:"Custom Reports"},
    {k:"messages",   i:"💬",l:"Messages"},
    {k:"workers",    i:"👥",l:"Worker Profiles"},
    {k:"users",      i:"🔐",l:"Users & Permissions"},
  ],
  carehome:[
    {k:"dashboard",  i:"◈", l:"Overview"},
    {k:"request",    i:"➕",l:"Request Shift"},
    {k:"myshifts",   i:"📋",l:"My Shifts"},
    {k:"calendar",   i:"📅",l:"Calendar"},
    {k:"compliance", i:"🛡", l:"Compliance"},
    {k:"expirycal",  i:"📆",l:"Expiry Calendar"},
    {k:"rtw",        i:"🪪",l:"RTW Monitoring"},
    {k:"cqcreport",  i:"🏅",l:"CQC Readiness"},
    {k:"invoices",   i:"📄",l:"Invoices"},
    {k:"timesheets", i:"🕐",l:"Timesheets"},
    {k:"workers",    i:"👥",l:"Worker Profiles"},
    {k:"messages",   i:"💬",l:"Messages"},
  ],
  agency:[
    {k:"dashboard",  i:"◈", l:"Dashboard"},
    {k:"available",  i:"📋",l:"Available Shifts"},
    {k:"workers",    i:"👥",l:"My Workers"},
    {k:"timesheets", i:"🕐",l:"Timesheets"},
    {k:"onboard",    i:"➕",l:"Register Worker"},
    {k:"rtw",        i:"🪪",l:"Right to Work"},
    {k:"rateuplifts",i:"📈",l:"Rate Requests"},
    {k:"documents",  i:"📁",l:"Documents"},
    {k:"invoices",   i:"📄",l:"Invoices"},
    {k:"messages",   i:"💬",l:"Messages"},
    {k:"users",      i:"🔐",l:"Users & Permissions"},
  ],
  bank:[
    {k:"dashboard",    i:"◈", l:"My Dashboard"},
    {k:"available",    i:"📋",l:"Available Shifts"},
    {k:"myshifts",     i:"✅",l:"My Shifts"},
    {k:"availability", i:"📅",l:"Set Availability"},
    {k:"earnings",     i:"💷",l:"Earnings"},
    {k:"messages",     i:"💬",l:"Messages"},
    {k:"profile",      i:"👤",l:"My Profile"},
  ],
};

const Sidebar = ({role,active,setActive,user,onLogout,tsBadge,perms}) => {
  const roleLabel = {admin:"Neutral Vendor",clientadmin:"Client Admin",carehome:"Care Home",agency:"Agency",bank:"Bank Staff"};
  const accent = role==="bank"?T.teal:role==="clientadmin"?"#7c3aed":T.amber;
  const visibleNav = (NAV[role]||[]).filter(item=>!perms||perms[item.k]!==false);
  return (
    <div style={{width:224,minHeight:"100vh",background:T.navy,display:"flex",flexDirection:"column",position:"sticky",top:0,flexShrink:0}}>
      <div style={{padding:"22px 18px 18px",borderBottom:`1px solid ${T.navyBorder}`}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <FCCLogo size={30} showText={true} textColor={T.white} textSize={15}/>
        </div>
        <div style={{background:"rgba(255,255,255,0.07)",borderRadius:8,padding:"9px 11px"}}>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:"0.08em",fontWeight:600}}>{roleLabel[role]}</div>
          <div style={{fontSize:12,color:T.white,fontWeight:700,marginTop:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.org}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.4)",marginTop:1}}>{user.name}</div>
        </div>
      </div>
      <nav style={{flex:1,padding:"14px 10px",overflow:"auto"}}>
        {visibleNav.map(item=>{
          const on = active===item.k;
          return (
            <button key={item.k} onClick={()=>setActive(item.k)}
              style={{display:"flex",alignItems:"center",gap:9,width:"100%",padding:"8px 10px",borderRadius:7,background:on?`${accent}22`:"transparent",border:"none",cursor:"pointer",color:on?accent:"rgba(255,255,255,0.5)",fontFamily:"Syne,sans-serif",fontSize:12,fontWeight:on?700:400,marginBottom:1,textAlign:"left",transition:"all 0.12s"}}
              onMouseEnter={e=>{if(!on)e.currentTarget.style.color="rgba(255,255,255,0.85)"}}
              onMouseLeave={e=>{if(!on)e.currentTarget.style.color="rgba(255,255,255,0.5)"}}>
              <span style={{fontSize:14,opacity:on?1:0.7}}>{item.i}</span>{item.l}
              {item.k==="timesheets"&&tsBadge>0&&<span style={{marginLeft:"auto",background:role==="agency"?T.red:T.green,color:T.white,borderRadius:"50%",width:17,height:17,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:800,flexShrink:0}}>{tsBadge}</span>}
            </button>
          );
        })}
      </nav>
      <div style={{padding:"10px 10px 16px",borderTop:`1px solid ${T.navyBorder}`}}>
        <div style={{fontSize:10,color:"rgba(255,255,255,0.2)",textAlign:"center",marginBottom:8}}>v1.0.0 — Demo Mode</div>
        <button onClick={onLogout} style={{display:"flex",alignItems:"center",gap:8,width:"100%",padding:"8px 10px",borderRadius:7,background:"transparent",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.3)",fontFamily:"Syne,sans-serif",fontSize:11,fontWeight:500}}>
          ← Sign Out
        </button>
      </div>
    </div>
  );
};

/* ─── ADMIN: DASHBOARD ───────────────────────────────────────────────────────── */
const AdminDashboard = ({user, navigate}) => {
  const open = SHIFTS.filter(s=>s.status==="open").length;
  const filled = SHIFTS.filter(s=>s.status==="filled").length;
  const urgent = SHIFTS.filter(s=>s.urgency==="urgent"&&s.status==="open").length;
  const compAlerts = WORKERS.filter(w=>w.compliance<80).length;
  return (
    <Page title={`Good morning, ${user.name.split(" ")[0]}`} sub="Tuesday 10 March 2026 — Here's your overview" icon="◈">
      <Grid cols={4}>
        <Stat label="Open Shifts" value={open} sub={`${urgent} urgent`} accent icon="📋" trend="2 from yesterday" trendUp={false}/>
        <Stat label="Shifts Filled (MTD)" value="82" sub="Fill rate: 91%" icon="✅" trend="4% vs last month" trendUp={true}/>
        <Stat label="Compliance Alerts" value={compAlerts} sub="Immediate action" icon="⚠️"/>
        <Stat label="MTD Spend" value="£75.5k" sub="Budget: £90k (84%)" icon="💷" trend="vs £83k last month" trendUp={true}/>
      </Grid>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18,marginBottom:18}}>
        <Card>
          <CardHead title="Fill Rate Trend" sub="Last 6 months" icon="📈"/>
          <div style={{padding:"16px 8px"}}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={ANALYTICS_FILL}>
                <defs><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.amber} stopOpacity={0.2}/><stop offset="95%" stopColor={T.amber} stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="month" tick={{fontSize:11,fill:T.muted}} axisLine={false} tickLine={false}/>
                <YAxis domain={[60,100]} tick={{fontSize:11,fill:T.muted}} axisLine={false} tickLine={false} unit="%"/>
                <Tooltip formatter={v=>`${v}%`} contentStyle={{borderRadius:8,border:`1px solid ${T.border}`,fontSize:12}}/>
                <Area type="monotone" dataKey="rate" stroke={T.amber} strokeWidth={2.5} fill="url(#fg)" dot={{r:4,fill:T.amber}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHead title="Shifts by Agency" sub="This month" icon="🥧"/>
          <div style={{padding:"16px",display:"flex",flexDirection:"column",alignItems:"center"}}>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={AGENCY_PIE} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {AGENCY_PIE.map((_,i)=><Cell key={i} fill={PIE_COLORS[i]}/>)}
                </Pie>
                <Tooltip formatter={(v,n)=>[`${v} shifts`,n]} contentStyle={{borderRadius:8,border:`1px solid ${T.border}`,fontSize:12}}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{display:"flex",flexWrap:"wrap",gap:"6px 12px",justifyContent:"center"}}>
              {AGENCY_PIE.map((a,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:T.muted}}>
                  <span style={{width:8,height:8,borderRadius:2,background:PIE_COLORS[i],display:"inline-block"}}/>
                  {a.name}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:18}}>
        <Card>
          <CardHead title="Live Shift Activity" action={<Badge label="Real-time" color={T.green} bg={T.greenBg} dot/>}/>
          <Table
            headers={["Care Home","Role","Date","Status","Agency","Urgency"]}
            rows={SHIFTS.slice(0,7).map(s=>(
              <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`}}>
                <Td bold>{s.carehome}</Td>
                <Td><Badge label={s.role} color={T.purple} bg={T.purpleBg}/></Td>
                <Td>{s.date}</Td>
                <Td><SBadge s={s.status}/></Td>
                <Td>{s.agency||<span style={{color:"#94a3b8",fontStyle:"italic",fontSize:12}}>Unassigned</span>}</Td>
                <Td><span style={{display:"flex",alignItems:"center",fontSize:12,color:urgencyColor(s.urgency)}}><UrgDot u={s.urgency}/>{s.urgency}</span></Td>
              </tr>
            ))}
          />
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <CardHead title="Urgent Actions" icon="🚨"/>
            <div style={{padding:12}}>
              {SHIFTS.filter(s=>s.urgency==="urgent"&&s.status==="open").map(s=>(
                <div key={s.id} style={{background:T.redBg,borderRadius:8,padding:"9px 11px",marginBottom:8,borderLeft:`3px solid ${T.red}`}}>
                  <div style={{fontSize:12,fontWeight:700,color:T.red}}>{s.carehome}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:2}}>{s.role} · {s.date} · {s.time}</div>
                  <div style={{marginTop:6}}><Btn small onClick={()=>navigate("shifts")}>Assign Now</Btn></div>
                </div>
              ))}
              {WORKERS.filter(w=>w.compliance<60).map(w=>(
                <div key={w.id} style={{background:T.yellowBg,borderRadius:8,padding:"9px 11px",marginBottom:8,borderLeft:`3px solid ${T.yellow}`}}>
                  <div style={{fontSize:12,fontWeight:700,color:T.yellow}}>{w.name}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:2}}>Compliance: {w.compliance}% — {w.agency}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHead title="Agency Performance" icon="📊"/>
            <div style={{padding:14}}>
              {AGENCIES.map(a=>(
                <div key={a.id} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                    <span style={{fontWeight:600,color:T.text}}>{a.name}</span>
                    <span style={{fontWeight:700,color:a.fillRate>=90?T.green:T.yellow}}>{a.fillRate}%</span>
                  </div>
                  <ProgressBar value={a.fillRate} color={a.fillRate>=90?T.green:T.yellow}/>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};

/* ─── ADMIN: SHIFT BOARD ─────────────────────────────────────────────────────── */
const ShiftBoard = ({navigate}) => {
  const [filter,setFilter] = useState("all");
  const [search,setSearch] = useState("");
  const [modal,setModal] = useState(null);
  const [shifts,setShifts] = useState(SHIFTS);
  const filtered = useMemo(()=>shifts.filter(s=>{
    const matchStatus = filter==="all"||s.status===filter;
    const matchSearch = !search||s.carehome.toLowerCase().includes(search.toLowerCase())||s.role.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  }),[shifts,filter,search]);

  const assign = (shift) => setModal(shift);
  const doAssign = (shiftId,agency) => {
    setShifts(prev=>prev.map(s=>s.id===shiftId?{...s,status:"pending",agency}:s));
    setModal(null);
  };

  return (
    <Page title="Shift Board" sub="Manage and distribute all shifts across agencies" icon="📋" action={<Btn onClick={()=>navigate&&navigate("schedule")}>+ Create Shift</Btn>}>
      {modal && (
        <Modal title={`Assign Shift — ${modal.carehome} (${modal.role})`} onClose={()=>setModal(null)}>
          <p style={{fontSize:13,color:T.muted,marginBottom:16}}>Select an agency to receive this shift request. They will be notified immediately.</p>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
            {AGENCIES.map(a=>(
              <button key={a.id} onClick={()=>doAssign(modal.id,a.name)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderRadius:9,border:`1.5px solid ${TIER_CFG[a.tier]?.border||T.border}`,background:T.white,cursor:"pointer",fontFamily:"Syne,sans-serif"}}>
                <div style={{textAlign:"left"}}>
                  <div style={{fontWeight:700,fontSize:13,color:T.text}}>{a.name}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:2}}>Fill rate: {a.fillRate}% · Avg response: {a.avgResponse}</div>
                </div>
                <Badge label={a.tier} color={tierColor(a.tier)} bg={tierBg(a.tier)}/>
              </button>
            ))}
          </div>
          <Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn>
        </Modal>
      )}
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:18,flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:1,minWidth:200}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:13}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search care home or role…" style={{width:"100%",padding:"9px 12px 9px 32px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,background:T.white,color:T.text,outline:"none",fontFamily:"Syne,sans-serif"}}/>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {["all","open","pending","filled"].map(f=>(
            <Pill key={f} label={`${f==="all"?"All":f.charAt(0).toUpperCase()+f.slice(1)} (${f==="all"?shifts.length:shifts.filter(s=>s.status===f).length})`} active={filter===f} onClick={()=>setFilter(f)}/>
          ))}
        </div>
      </div>
      <Card>
        <Table
          headers={["","Care Home","Role","Date","Time","Rate","Status","Agency","Worker","Actions"]}
          empty="No shifts found"
          rows={filtered.map(s=>(
            <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`}}>
              <Td><UrgDot u={s.urgency}/></Td>
              <Td bold>{s.carehome}</Td>
              <Td><Badge label={s.role} color={T.purple} bg={T.purpleBg}/></Td>
              <Td>{s.date}</Td>
              <Td>{s.time}</Td>
              <Td bold>£{s.rate}{"/hr"}</Td>
              <Td><SBadge s={s.status}/></Td>
              <Td>{s.agency||<span style={{color:"#94a3b8",fontSize:12,fontStyle:"italic"}}>Unassigned</span>}</Td>
              <Td>{s.worker||<span style={{color:"#94a3b8",fontSize:12}}>—</span>}</Td>
              <Td>
                <div style={{display:"flex",gap:5}}>
                  {s.status==="open" && <Btn small onClick={()=>assign(s)}>Assign</Btn>}
                  <Btn small variant="secondary" onClick={()=>setModal(s)}>Details</Btn>
                </div>
              </Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};

/* ─── ADMIN: SCHEDULER ───────────────────────────────────────────────────────── */
const Scheduler = ({navigate}) => {
  const [form,setForm] = useState({carehome:"Sunrise Care",role:"RGN",date:"",timeStart:"07:00",timeEnd:"19:00",urgency:"normal",rate:"35",notes:"",recurring:false,recDays:"1"});
  const [done,setDone] = useState(false);
  const set = (k,v)=>setForm(f=>({...f,[k]:v}));
  if(done) return (
    <Page title="Shift Created" icon="✅">
      <div style={{maxWidth:480,background:T.white,borderRadius:16,border:`1px solid ${T.border}`,padding:40,textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:16}}>✅</div>
        <h2 style={{fontFamily:"Instrument Serif,serif",fontSize:22,marginBottom:8}}>Shift Published</h2>
        <p style={{color:T.muted,fontSize:13,lineHeight:1.7,marginBottom:24}}>Your shift for <strong>{form.role}</strong> at <strong>{form.carehome}</strong> on <strong>{form.date}</strong> has been published. Tier 1 agencies have been notified immediately.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <Btn onClick={()=>setDone(false)}>Create Another</Btn>
          <Btn variant="secondary" onClick={()=>navigate&&navigate("shifts")}>View Shift Board</Btn>
        </div>
      </div>
    </Page>
  );
  return (
    <Page title="Create Shift" sub="Publish a new shift — Tier 1 agencies notified first" icon="📅">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,maxWidth:900}}>
        <Card style={{padding:24}}>
          <h3 style={{fontWeight:700,fontSize:14,marginBottom:18,color:T.text}}>Shift Details</h3>
          <Select label="Care Home" value={form.carehome} onChange={v=>set("carehome",v)} options={CARE_HOMES.map(c=>c.name)} required/>
          <Select label="Role Required" value={form.role} onChange={v=>{set("role",v);}} options={["RGN","RMN","HCA","Senior Carer","Deputy Manager"]} required/>
          <Input label="Date" type="date" value={form.date} onChange={v=>set("date",v)} required/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Start Time" type="time" value={form.timeStart} onChange={v=>set("timeStart",v)}/>
            <Input label="End Time" type="time" value={form.timeEnd} onChange={v=>set("timeEnd",v)}/>
          </div>
          <Input label="Rate (£/hr)" type="number" value={form.rate} onChange={v=>set("rate",v)}/>
        </Card>
        <Card style={{padding:24}}>
          <h3 style={{fontWeight:700,fontSize:14,marginBottom:18,color:T.text}}>Options</h3>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Urgency</label>
            <div style={{display:"flex",gap:8}}>
              {["normal","high","urgent"].map(u=>(
                <button key={u} onClick={()=>set("urgency",u)} style={{flex:1,padding:"8px",borderRadius:8,border:`1.5px solid ${form.urgency===u?urgencyColor(u):T.border}`,background:form.urgency===u?"rgba(0,0,0,0.03)":T.white,color:form.urgency===u?urgencyColor(u):T.muted,fontWeight:600,fontSize:12,cursor:"pointer",textTransform:"capitalize",fontFamily:"Syne,sans-serif"}}>
                  {u}
                </button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Notes</label>
            <textarea value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Any specific requirements..." style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:"Syne,sans-serif",minHeight:70,resize:"vertical",color:T.text}}/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:T.text,fontWeight:500}}>
              <input type="checkbox" checked={form.recurring} onChange={e=>set("recurring",e.target.checked)} style={{width:16,height:16}}/>
              Recurring shift
            </label>
            {form.recurring && (
              <div style={{marginTop:10,paddingLeft:24}}>
                <Select label="Repeat every" value={form.recDays} onChange={v=>set("recDays",v)} options={[{value:"1",label:"Week"},{value:"2",label:"2 Weeks"},{value:"4",label:"Month"}]}/>
              </div>
            )}
          </div>
          <div style={{background:T.amberBg,borderRadius:8,padding:"12px 14px",marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:T.amberText,marginBottom:4}}>Estimated Cost</div>
            <div style={{fontSize:20,fontWeight:800,color:T.amberText}}>
              £{(() => {
                const hrs = form.timeStart && form.timeEnd ? Math.max(0, (parseInt(form.timeEnd) - parseInt(form.timeStart))) : 12;
                return (parseFloat(form.rate)||0) * Math.abs(hrs||12);
              })()}
              <span style={{fontSize:12,fontWeight:400,marginLeft:4}}>for this shift</span>
            </div>
          </div>
          <Btn full onClick={()=>form.date?setDone(true):alert("Please select a date")}>Publish Shift →</Btn>
        </Card>
      </div>
    </Page>
  );
};

/* ─── ADMIN: AGENCIES ────────────────────────────────────────────────────────── */
const AgencyManagement = ({navigate}) => {
  const [modal,setModal] = useState(false);
  const [profileModal,setProfileModal] = useState(null);
  const [step,setStep] = useState(1);
  const [form,setForm] = useState({name:"",tier:"Tier 1",contact:"",email:"",phone:""});
  const set = (k,v)=>setForm(f=>({...f,[k]:v}));

  return (
    <Page title="Agency Management" sub="Monitor and manage all staffing agencies on the platform" icon="🤝" action={<Btn onClick={()=>{setModal(true);setStep(1);}}>+ Onboard Agency</Btn>}>
      {profileModal && (
        <Modal title={`Agency Profile — ${profileModal.name}`} onClose={()=>setProfileModal(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            {[["Tier",<Badge label={profileModal.tier} color={tierColor(profileModal.tier)} bg={tierBg(profileModal.tier)}/>],["Contact",profileModal.contact],["Email",profileModal.email],["Shifts Total",profileModal.shifts],["Fill Rate",<span style={{fontWeight:700,color:profileModal.fillRate>=90?T.green:T.yellow}}>{profileModal.fillRate}%</span>],["Avg Response",profileModal.avgResponse],["MTD Spend",`£${profileModal.spend.toLocaleString()}`],["Compliance",`${profileModal.compliance}%`]].map(([k,v])=>(
              <div key={k} style={{background:"#f8fafc",borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:11,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{k}</div>
                <div style={{fontSize:13,fontWeight:600}}>{v}</div>
              </div>
            ))}
          </div>
          <ProgressBar value={profileModal.compliance} color={profileModal.compliance>=95?T.green:T.yellow}/>
          <div style={{display:"flex",gap:8,marginTop:16}}>
            <Btn onClick={()=>{setProfileModal(null);navigate&&navigate("workers");}}>View Workers</Btn>
            <Btn variant="secondary" onClick={()=>setProfileModal(null)}>Close</Btn>
          </div>
        </Modal>
      )}
      {modal && (
        <Modal title="Onboard New Agency" onClose={()=>setModal(false)}>
          <div style={{display:"flex",gap:8,marginBottom:20}}>
            {[1,2,3].map(s=>(
              <div key={s} style={{flex:1,height:4,borderRadius:2,background:step>=s?T.amber:T.border}}/>
            ))}
          </div>
          <div style={{fontSize:11,color:T.muted,marginBottom:16,textTransform:"uppercase",letterSpacing:"0.07em",fontWeight:700}}>
            Step {step} of 3 — {["Agency Details","Contacts & Access","Review & Confirm"][step-1]}
          </div>
          {step===1 && <>
            <Input label="Agency Name" value={form.name} onChange={v=>set("name",v)} placeholder="e.g. Medway Staffing Ltd" required/>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Agency Tier</label>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  {v:"Tier 1",title:"Tier 1 — Priority",desc:"First broadcast of all new shifts. Notified immediately when a shift is published."},
                  {v:"Tier 2",title:"Tier 2 — Secondary",desc:"Notified if no Tier 1 agency fills within 30 minutes."},
                  {v:"Tier 3",title:"Tier 3 — Supplementary",desc:"Notified if no Tier 1 or Tier 2 agency fills within 60 minutes. Useful for cover overflow."},
                ].map(opt=>(
                  <label key={opt.v} onClick={()=>set("tier",opt.v)} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px",borderRadius:8,border:`1.5px solid ${form.tier===opt.v?tierColor(opt.v):T.border}`,background:form.tier===opt.v?tierBg(opt.v):"#fafafa",cursor:"pointer"}}>
                    <input type="radio" checked={form.tier===opt.v} onChange={()=>set("tier",opt.v)} style={{marginTop:2,accentColor:tierColor(opt.v)}}/>
                    <div>
                      <div style={{fontSize:13,fontWeight:700,color:form.tier===opt.v?tierColor(opt.v):T.text}}>{opt.title}</div>
                      <div style={{fontSize:11,color:T.muted,marginTop:2}}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </>}
          {step===2 && <>
            <Input label="Primary Contact" value={form.contact} onChange={v=>set("contact",v)} placeholder="Full name" required/>
            <Input label="Email Address" type="email" value={form.email} onChange={v=>set("email",v)} placeholder="contact@agency.co.uk" required/>
            <Input label="Phone Number" value={form.phone} onChange={v=>set("phone",v)} placeholder="07700 000000"/>
            <Alert type="info">An invite email will be sent to this address to set up their agency portal login.</Alert>
          </>}
          {step===3 && <>
            <Alert type="success">Ready to onboard <strong>{form.name||"this agency"}</strong> as a <strong>{form.tier}</strong> partner.</Alert>
            <div style={{background:"#f8fafc",borderRadius:8,padding:14,marginBottom:16}}>
              {[["Agency",form.name||"—"],["Tier",form.tier],["Contact",form.contact||"—"],["Email",form.email||"—"],["Phone",form.phone||"—"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}>
                  <span style={{color:T.muted}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
          </>}
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            {step>1 && <Btn variant="secondary" onClick={()=>setStep(s=>s-1)}>Back</Btn>}
            {step<3 ? <Btn onClick={()=>setStep(s=>s+1)}>Continue →</Btn> : <Btn onClick={()=>setModal(false)}>Confirm & Send Invite</Btn>}
          </div>
        </Modal>
      )}
      <Grid cols={4}>
        <Stat label="Total Agencies" value={AGENCIES.length} accent/>
        <Stat label="Shifts This Month" value="115" trend="17 vs last month" trendUp={true}/>
        <Stat label="Avg Fill Rate" value="83%" trend="4% MoM" trendUp={true}/>
        <Stat label="Total Spend" value="£75.5k" sub="Budget: £90k"/>
      </Grid>
      <Card>
        <Table
          headers={["Agency","Tier","Contact","Shifts","Fill Rate","Avg Response","Compliance","Spend","Actions"]}
          rows={AGENCIES.map(a=>(
            <tr key={a.id} style={{borderBottom:`1px solid ${T.border}`}}>
              <Td bold>{a.name}</Td>
              <Td><Badge label={a.tier} color={tierColor(a.tier)} bg={tierBg(a.tier)}/></Td>
              <Td><div style={{fontSize:12}}><div style={{fontWeight:600}}>{a.contact}</div><div style={{color:T.muted}}>{a.email}</div></div></Td>
              <Td>{a.shifts}</Td>
              <Td><span style={{fontWeight:700,color:a.fillRate>=90?T.green:T.yellow}}>{a.fillRate}%</span></Td>
              <Td>{a.avgResponse}</Td>
              <Td>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <ProgressBar value={a.compliance} color={a.compliance>=95?T.green:T.yellow}/>
                  <span style={{fontSize:11,color:T.muted}}>{a.compliance}%</span>
                </div>
              </Td>
              <Td bold>£{a.spend.toLocaleString()}</Td>
              <Td>
                <div style={{display:"flex",gap:5}}>
                  <Btn small variant="secondary" onClick={()=>setProfileModal(a)}>Profile</Btn>
                  <Btn small variant="secondary" onClick={()=>navigate&&navigate("workers")}>Workers</Btn>
                </div>
              </Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};

/* ─── ADMIN: WORKERS ─────────────────────────────────────────────────────────── */
const WorkerDirectory = ({navigate}) => {
  const [search,setSearch] = useState("");
  const [roleF,setRoleF] = useState("All");
  const [selected,setSelected] = useState(null);
  const filtered = WORKERS.filter(w=>{
    const ms = !search||w.name.toLowerCase().includes(search.toLowerCase())||w.agency.toLowerCase().includes(search.toLowerCase());
    const mr = roleF==="All"||w.role===roleF;
    return ms&&mr;
  });
  return (
    <Page title="Worker Directory" sub="All registered workers across all agencies" icon="👥">
      {selected && (
        <Modal title="Worker Profile" onClose={()=>setSelected(null)} width={460}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:`linear-gradient(135deg,${T.amber},${T.navy})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:T.white,fontWeight:700,margin:"0 auto 10px"}}>{selected.name.split(" ").map(n=>n[0]).join("")}</div>
            <div style={{fontSize:17,fontWeight:700,color:T.text}}>{selected.name}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:2}}>{selected.role} · {selected.agency}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
            {[["Email",selected.email],["Phone",selected.phone],["DBS Expiry",selected.dbsExpiry],["Training Expiry",selected.trainingExpiry],["NMC/PIN",selected.pin||"Not provided"],["Available",selected.available?"Yes":"Currently placed"]].map(([k,v])=>(
              <div key={k} style={{background:"#f8fafc",borderRadius:7,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{k}</div>
                <div style={{fontSize:12,fontWeight:600,color:T.text}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:6}}>Compliance Score</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{flex:1}}><ProgressBar value={selected.compliance} color={selected.compliance>=95?T.green:selected.compliance>=75?T.yellow:T.red}/></div>
              <span style={{fontWeight:800,fontSize:16,color:selected.compliance>=95?T.green:selected.compliance>=75?T.yellow:T.red}}>{selected.compliance}%</span>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn small variant="secondary" onClick={()=>navigate&&navigate("documents")}>View Documents</Btn>
            {selected.compliance<80 && <Btn small variant="danger" onClick={()=>alert(`Alert sent to ${selected.agency} regarding ${selected.name}'s compliance (${selected.compliance}%). They have been notified to update outstanding documents.`)}>Alert Agency</Btn>}
          </div>
        </Modal>
      )}
      <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
        <div style={{position:"relative",flex:1,maxWidth:280}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:13}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search workers…" style={{width:"100%",padding:"9px 12px 9px 32px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,background:T.white,color:T.text,outline:"none",fontFamily:"Syne,sans-serif"}}/>
        </div>
        <div style={{display:"flex",gap:6}}>
          {["All","RGN","RMN","HCA","Senior Carer"].map(r=>(
            <Pill key={r} label={r} active={roleF===r} onClick={()=>setRoleF(r)}/>
          ))}
        </div>
      </div>
      <Card>
        <Table
          headers={["Worker","Role","Agency","DBS","Training","PIN","Score","Available","Action"]}
          empty="No workers found"
          rows={filtered.map(w=>(
            <tr key={w.id} style={{borderBottom:`1px solid ${T.border}`,background:w.compliance<60?"#fff9f9":"transparent"}}>
              <Td><div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${T.amber}66,${T.navy}66)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.navy,flexShrink:0}}>{w.name.split(" ").map(n=>n[0]).join("")}</div>
                <span style={{fontWeight:600,fontSize:13}}>{w.name}</span>
              </div></Td>
              <Td><Badge label={w.role} color={T.purple} bg={T.purpleBg}/></Td>
              <Td><span style={{fontSize:12,color:T.muted}}>{w.agency}</span></Td>
              <Td><SBadge s={w.dbs}/></Td>
              <Td><SBadge s={w.training}/></Td>
              <Td>{w.pinStatus?<Badge label="✓ Verified" color={T.green} bg={T.greenBg}/>:<Badge label="✗ Missing" color={T.red} bg={T.redBg}/>}</Td>
              <Td>
                <div style={{display:"flex",alignItems:"center",gap:8,minWidth:80}}>
                  <div style={{flex:1}}><ProgressBar value={w.compliance} color={w.compliance>=95?T.green:w.compliance>=75?T.yellow:T.red}/></div>
                  <span style={{fontSize:11,fontWeight:700,color:w.compliance>=95?T.green:w.compliance>=75?T.yellow:T.red}}>{w.compliance}%</span>
                </div>
              </Td>
              <Td>{w.available?<Badge label="Available" color={T.green} bg={T.greenBg}/>:<Badge label="On Shift" color={T.muted} bg="#f1f5f9"/>}</Td>
              <Td><Btn small variant="secondary" onClick={()=>setSelected(w)}>View</Btn></Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};

/* ─── SHARED: REQUIREMENT FORM MODAL ─────────────────────────────────────────── */
const RequirementFormModal = ({onSave,onClose,careHome,addedBy,initial}) => {
  const blank = {name:"",type:"training",category:"training",appliesToRoles:[],mandatory:true,expiryMonths:"12",notes:""};
  const [form,setForm] = useState(initial||blank);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const allRoles = ["RGN","RMN","HCA","Senior Carer"];
  const toggleRole = (r) => set("appliesToRoles", form.appliesToRoles.includes(r)?form.appliesToRoles.filter(x=>x!==r):[...form.appliesToRoles,r]);
  const valid = form.name && form.appliesToRoles.length>0;
  return (
    <Modal title={initial?"Edit Requirement":"Add Compliance Requirement"} onClose={onClose}>
      <Input label="Requirement Name *" value={form.name} onChange={v=>set("name",v)} placeholder="e.g. Dementia Care Certificate"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <div>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Type *</label>
          <select value={form.type} onChange={e=>set("type",e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Syne,sans-serif",outline:"none",background:"#fafbfd"}}>
            <option value="document">Document</option>
            <option value="training">Training Certificate</option>
            <option value="registration">Professional Registration</option>
            <option value="vaccination">Vaccination Record</option>
          </select>
        </div>
        <div>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Category</label>
          <select value={form.category} onChange={e=>set("category",e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Syne,sans-serif",outline:"none",background:"#fafbfd"}}>
            <option value="safeguarding">Safeguarding</option>
            <option value="training">General Training</option>
            <option value="specialist">Specialist</option>
            <option value="health">Health</option>
            <option value="safety">Safety</option>
            <option value="legal">Legal</option>
            <option value="registration">Registration</option>
          </select>
        </div>
      </div>
      <div style={{marginBottom:12}}>
        <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Applies To Roles *</label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {allRoles.map(r=>{
            const on = form.appliesToRoles.includes(r);
            return <button key={r} onClick={()=>toggleRole(r)} style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${on?T.navy:T.border}`,background:on?T.navy:"#f8fafc",color:on?T.white:T.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"Syne,sans-serif",transition:"all 0.12s"}}>{r}</button>;
          })}
          <button onClick={()=>set("appliesToRoles",allRoles)} style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${T.border}`,background:"transparent",color:T.muted,fontSize:11,cursor:"pointer",fontFamily:"Syne,sans-serif"}}>All Roles</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <div>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Mandatory?</label>
          <div style={{display:"flex",gap:8}}>
            {[true,false].map(v=>(
              <button key={String(v)} onClick={()=>set("mandatory",v)} style={{flex:1,padding:"8px",borderRadius:8,border:`1.5px solid ${form.mandatory===v?T.navy:T.border}`,background:form.mandatory===v?T.navy:"#f8fafc",color:form.mandatory===v?T.white:T.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"Syne,sans-serif"}}>
                {v?"Mandatory":"Optional"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Expiry (months)</label>
          <input type="number" min="1" max="120" value={form.expiryMonths} onChange={e=>set("expiryMonths",e.target.value)} placeholder="Leave blank if no expiry"
            style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Syne,sans-serif",outline:"none",background:"#fafbfd"}}/>
        </div>
      </div>
      <div style={{marginBottom:16}}>
        <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Notes / Guidance</label>
        <textarea value={form.notes} onChange={e=>set("notes",e.target.value)} rows={2} placeholder="Any guidance for agencies or workers on fulfilling this requirement…"
          style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Syne,sans-serif",resize:"vertical",outline:"none"}}/>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={()=>valid&&onSave({...form,expiryMonths:form.expiryMonths?parseInt(form.expiryMonths):null,careHome:careHome||null,addedBy,scope:careHome?"site":"global",active:true})} style={{opacity:valid?1:0.5}}>
          {initial?"Save Changes":"Add Requirement"}
        </Btn>
      </div>
    </Modal>
  );
};

/* ─── ADMIN: COMPLIANCE ──────────────────────────────────────────────────────── */
const ComplianceTracker = ({complianceReqs,setComplianceReqs,navigate}) => {
  const [tab,setTab]    = useState("workers");
  const [showForm,setShowForm] = useState(false);
  const [editing,setEditing]   = useState(null);
  const [filterScope,setFilterScope] = useState("all");

  const critical = WORKERS.filter(w=>w.compliance<60);
  const warning  = WORKERS.filter(w=>w.compliance>=60&&w.compliance<80);
  const good     = WORKERS.filter(w=>w.compliance>=80);

  const catColors = {safeguarding:{c:T.red,bg:T.redBg},training:{c:T.blue,bg:T.blueBg},specialist:{c:T.purple,bg:T.purpleBg},health:{c:T.green,bg:T.greenBg},safety:{c:T.yellow,bg:T.yellowBg},legal:{c:T.navy,bg:"#e8ecf4"},registration:{c:T.teal,bg:T.tealBg}};

  const addReq = (form) => {
    const newReq = {...form, id:`cr${complianceReqs.length+1}`, createdAt:new Date().toISOString().split("T")[0]};
    setComplianceReqs(p=>[...p,newReq]);
    setShowForm(false);
  };
  const saveEdit = (form) => {
    setComplianceReqs(p=>p.map(r=>r.id===editing.id?{...r,...form}:r));
    setEditing(null);
  };
  const toggleActive = (id) => setComplianceReqs(p=>p.map(r=>r.id===id?{...r,active:!r.active}:r));
  const deleteReq    = (id) => setComplianceReqs(p=>p.filter(r=>r.id!==id));

  const globalReqs = complianceReqs.filter(r=>r.scope==="global");
  const siteReqs   = complianceReqs.filter(r=>r.scope==="site");
  const displayed  = filterScope==="all"?complianceReqs:filterScope==="global"?globalReqs:siteReqs;

  return (
    <Page title="Compliance" sub="Track worker credentials and manage platform-wide compliance requirements" icon="🛡"
      action={tab==="requirements"?<Btn onClick={()=>setShowForm(true)}>+ Add Requirement</Btn>:null}>

      {/* Modals */}
      {showForm&&<RequirementFormModal onSave={addReq} onClose={()=>setShowForm(false)} addedBy="Nexus Admin" careHome={null}/>}
      {editing&&<RequirementFormModal initial={editing} onSave={saveEdit} onClose={()=>setEditing(null)} addedBy="Nexus Admin" careHome={editing.careHome}/>}

      {/* Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:18}}>
        {[["workers","Worker Status"],["requirements","Requirements Builder"]].map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)} style={{padding:"9px 18px",borderRadius:8,border:"none",background:tab===v?T.navy:"#eef1f6",color:tab===v?T.white:T.muted,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"Syne,sans-serif",transition:"all 0.12s"}}>
            {l}
          </button>
        ))}
      </div>

      {/* ── Worker Status ── */}
      {tab==="workers"&&(
        <>
          <Grid cols={4}>
            <Stat label="Fully Compliant" value={good.length} sub={`${Math.round(good.length/WORKERS.length*100)}% of workers`} accent/>
            <Stat label="Needs Attention" value={warning.length} sub="Expiring items"/>
            <Stat label="Non-Compliant"   value={critical.length} sub="Immediate action"/>
            <Stat label="Avg Score" value={`${Math.round(WORKERS.reduce((a,w)=>a+w.compliance,0)/WORKERS.length)}%`} sub="Target: 95%"/>
          </Grid>
          {critical.length>0&&<Alert type="error" style={{marginBottom:14}}>⚠️ <strong>{critical.length} worker{critical.length>1?"s are":" is"} non-compliant</strong> and cannot be placed on shifts until resolved.</Alert>}
          <Card>
            <Table
              headers={["Worker","Role","Agency","DBS","Training","NMC/PIN","Score","Action"]}
              rows={WORKERS.sort((a,b)=>a.compliance-b.compliance).map(w=>(
                <tr key={w.id} style={{borderBottom:`1px solid ${T.border}`,background:w.compliance<60?T.redBg:w.compliance<80?"#fffbeb":"transparent"}}>
                  <Td bold>{w.name}</Td>
                  <Td><Badge label={w.role} color={T.purple} bg={T.purpleBg}/></Td>
                  <Td><span style={{fontSize:12,color:T.muted}}>{w.agency}</span></Td>
                  <Td><SBadge s={w.dbs}/></Td>
                  <Td><SBadge s={w.training}/></Td>
                  <Td>{w.pin?<Badge label="✓ Verified" color={T.green} bg={T.greenBg}/>:<Badge label="✗ Missing" color={T.red} bg={T.redBg}/>}</Td>
                  <Td>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:60}}><ProgressBar value={w.compliance} color={w.compliance>=95?T.green:w.compliance>=75?T.yellow:T.red}/></div>
                      <span style={{fontWeight:700,fontSize:12,color:w.compliance>=95?T.green:w.compliance>=75?T.yellow:T.red}}>{w.compliance}%</span>
                    </div>
                  </Td>
                  <Td>
                    <div style={{display:"flex",gap:5}}>
                      {w.compliance<80&&<Btn small variant="danger" onClick={()=>alert(`Alert sent to ${w.agency} regarding ${w.name}'s compliance (${w.compliance}%). Agency has been notified.`)}>Alert Agency</Btn>}
                      <Btn small variant="secondary" onClick={()=>{navigate&&navigate("documents");}}>View Docs</Btn>
                    </div>
                  </Td>
                </tr>
              ))}
            />
          </Card>
        </>
      )}

      {/* ── Requirements Builder ── */}
      {tab==="requirements"&&(
        <>
          <Grid cols={3}>
            <Stat label="Global Requirements" value={globalReqs.length} accent sub="Apply to all sites"/>
            <Stat label="Site-Specific" value={siteReqs.length} sub={`Across ${[...new Set(siteReqs.map(r=>r.careHome))].length} sites`}/>
            <Stat label="Active" value={complianceReqs.filter(r=>r.active).length} sub={`${complianceReqs.filter(r=>!r.active).length} inactive`}/>
          </Grid>

          {/* Info banner */}
          <div style={{background:"#f0f7ff",border:`1px solid ${T.blue}44`,borderRadius:12,padding:"12px 16px",marginBottom:16,fontSize:12,color:T.muted}}>
            <strong style={{color:T.blue}}>📋 How requirements work:</strong> Global requirements apply to all workers on all sites. Care homes can also add site-specific requirements — workers must meet both global and their assigned site's requirements before being placed.
          </div>

          {/* Scope filter */}
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {[["all","All Requirements"],["global","Global Only"],["site","Site-Specific"]].map(([v,l])=>(
              <Pill key={v} label={l} active={filterScope===v} onClick={()=>setFilterScope(v)}/>
            ))}
          </div>

          {/* Site breakdown cards */}
          {filterScope!=="global"&&siteReqs.length>0&&(
            <div style={{marginBottom:18}}>
              <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Site-Specific Requirements by Location</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
                {CARE_HOMES.map(ch=>{
                  const chReqs = siteReqs.filter(r=>r.careHome===ch.name);
                  return (
                    <div key={ch.id} style={{background:T.white,border:`1.5px solid ${T.border}`,borderRadius:10,padding:"12px 14px"}}>
                      <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>{ch.name}</div>
                      <div style={{fontSize:11,color:T.muted,marginBottom:8}}>{chReqs.length} requirement{chReqs.length!==1?"s":""}</div>
                      {chReqs.length===0?<div style={{fontSize:11,color:T.muted,fontStyle:"italic"}}>No site-specific requirements</div>:(
                        chReqs.map(r=>(
                          <div key={r.id} style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
                            <span style={{fontSize:9,color:r.active?T.green:T.muted}}>●</span>
                            <span style={{fontSize:11,color:r.active?T.text:T.muted,textDecoration:r.active?"none":"line-through"}}>{r.name}</span>
                            {r.mandatory&&<span style={{fontSize:8,background:T.redBg,color:T.red,borderRadius:3,padding:"1px 4px",fontWeight:700}}>REQ</span>}
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Requirements table */}
          <Card>
            <Table
              headers={["Requirement","Type","Category","Applies To","Scope","Expiry","Mandatory","Added By","Status","Actions"]}
              rows={displayed.map(r=>{
                const cc = catColors[r.category]||{c:T.muted,bg:"#f1f5f9"};
                return (
                  <tr key={r.id} style={{borderBottom:`1px solid ${T.border}`,background:r.active?"transparent":"#f8fafc",opacity:r.active?1:0.65}}>
                    <Td>
                      <div>
                        <div style={{fontWeight:700,fontSize:13}}>{r.name}</div>
                        {r.notes&&<div style={{fontSize:10,color:T.muted,marginTop:1,maxWidth:200}}>{r.notes}</div>}
                      </div>
                    </Td>
                    <Td><span style={{fontSize:11,fontWeight:600,color:T.text,textTransform:"capitalize"}}>{r.type}</span></Td>
                    <Td><Badge label={r.category} color={cc.c} bg={cc.bg}/></Td>
                    <Td>
                      <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                        {r.appliesToRoles.map(role=><span key={role} style={{fontSize:9,background:T.purpleBg,color:T.purple,borderRadius:4,padding:"2px 5px",fontWeight:700}}>{role}</span>)}
                      </div>
                    </Td>
                    <Td>
                      {r.scope==="global"
                        ?<Badge label="🌐 Global" color={T.navy} bg="#e8ecf4"/>
                        :<Badge label={`📍 ${r.careHome}`} color={T.teal} bg={T.tealBg}/>}
                    </Td>
                    <Td><span style={{fontSize:12,color:T.muted}}>{r.expiryMonths?`${r.expiryMonths} months`:"No expiry"}</span></Td>
                    <Td>{r.mandatory?<Badge label="Required" color={T.red} bg={T.redBg}/>:<Badge label="Optional" color={T.muted} bg="#f1f5f9"/>}</Td>
                    <Td><span style={{fontSize:11,color:T.muted}}>{r.addedBy}</span></Td>
                    <Td>
                      <button onClick={()=>toggleActive(r.id)} style={{padding:"4px 10px",borderRadius:20,border:`1.5px solid ${r.active?T.green:T.border}`,background:r.active?T.greenBg:"#f1f5f9",color:r.active?T.green:T.muted,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"Syne,sans-serif"}}>
                        {r.active?"Active":"Inactive"}
                      </button>
                    </Td>
                    <Td>
                      <div style={{display:"flex",gap:5}}>
                        <Btn small variant="secondary" onClick={()=>setEditing(r)}>Edit</Btn>
                        <Btn small variant="danger" onClick={()=>deleteReq(r.id)}>×</Btn>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            />
          </Card>
        </>
      )}
    </Page>
  );
};

/* ─── CARE HOME: COMPLIANCE ──────────────────────────────────────────────────── */
const CareHomeCompliance = ({complianceReqs,setComplianceReqs,user}) => {
  const [tab,setTab]           = useState("requirements");
  const [showForm,setShowForm] = useState(false);
  const [editing,setEditing]   = useState(null);
  const mySite = user?.org || "Sunrise Care";

  const globalReqs = complianceReqs.filter(r=>r.scope==="global"&&r.active);
  const myReqs     = complianceReqs.filter(r=>r.scope==="site"&&r.careHome===mySite);
  const allActive  = [...globalReqs,...myReqs.filter(r=>r.active)];

  // Worker compliance for this site
  const myWorkers   = WORKERS.filter(w=>SHIFTS.some(s=>s.carehome===mySite&&s.worker===w.name));
  const compliant   = myWorkers.filter(w=>w.compliance>=80);
  const needsAction = myWorkers.filter(w=>w.compliance<80);

  const catColors = {safeguarding:{c:T.red,bg:T.redBg},training:{c:T.blue,bg:T.blueBg},specialist:{c:T.purple,bg:T.purpleBg},health:{c:T.green,bg:T.greenBg},safety:{c:T.yellow,bg:T.yellowBg},legal:{c:T.navy,bg:"#e8ecf4"},registration:{c:T.teal,bg:T.tealBg}};
  const typeIcon = {document:"📄",training:"📚",registration:"🏅",vaccination:"💉"};

  const addReq  = (form) => { setComplianceReqs(p=>[...p,{...form,id:`cr${p.length+1}`,scope:"site",careHome:mySite,createdAt:new Date().toISOString().split("T")[0]}]); setShowForm(false); };
  const saveEdit = (form) => { setComplianceReqs(p=>p.map(r=>r.id===editing.id?{...r,...form}:r)); setEditing(null); };
  const toggleActive = (id) => setComplianceReqs(p=>p.map(r=>r.id===id?{...r,active:!r.active}:r));
  const deleteReq    = (id) => setComplianceReqs(p=>p.filter(r=>r.id!==id));

  const tabs = [
    {k:"requirements", l:"Requirements", count:allActive.length},
    {k:"workers",      l:"Worker Status", count:myWorkers.length},
    {k:"mine",         l:"My Requirements", count:myReqs.filter(r=>r.active).length},
  ];

  const ReqCard = ({r, showEdit=false, borderColor=T.border}) => {
    const cc = catColors[r.category]||{c:T.muted,bg:"#f1f5f9"};
    return (
      <div style={{background:T.white,border:`1.5px solid ${borderColor}`,borderRadius:10,padding:"14px 16px",marginBottom:8,display:"flex",alignItems:"flex-start",gap:12}}>
        <div style={{width:38,height:38,borderRadius:9,background:cc.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
          {typeIcon[r.type]||"📋"}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4,flexWrap:"wrap"}}>
            <span style={{fontWeight:700,fontSize:13}}>{r.name}</span>
            {r.mandatory
              ? <Badge label="Required" color={T.red} bg={T.redBg}/>
              : <Badge label="Optional" color={T.muted} bg="#f1f5f9"/>}
            <Badge label={r.category} color={cc.c} bg={cc.bg}/>
            {r.expiryMonths&&<span style={{fontSize:10,color:T.muted,background:"#f8fafc",padding:"2px 7px",borderRadius:6,border:`1px solid ${T.border}`}}>Renews every {r.expiryMonths}m</span>}
          </div>
          {r.notes&&<div style={{fontSize:12,color:T.muted,marginBottom:5,lineHeight:1.5}}>{r.notes}</div>}
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {(r.appliesToRoles||[]).map(role=><span key={role} style={{fontSize:9,background:T.purpleBg,color:T.purple,borderRadius:4,padding:"2px 6px",fontWeight:700}}>{role}</span>)}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0}}>
          <span style={{fontSize:10,color:T.muted,fontWeight:600}}>{r.scope==="global"?"Platform":"Your site"}</span>
          {showEdit&&<Btn small variant="secondary" onClick={()=>setEditing(r)}>Edit</Btn>}
        </div>
      </div>
    );
  };

  return (
    <Page title="Compliance" sub={`${mySite} — compliance requirements and worker status`} icon="🛡"
      action={tab==="mine"?<Btn onClick={()=>setShowForm(true)}>+ Add Requirement</Btn>:null}>

      {showForm&&<RequirementFormModal onSave={addReq} onClose={()=>setShowForm(false)} addedBy={user?.name||"Care Home Manager"} careHome={mySite}/>}
      {editing&&<RequirementFormModal initial={editing} onSave={saveEdit} onClose={()=>setEditing(null)} addedBy={user?.name||"Care Home Manager"} careHome={mySite}/>}

      <Grid cols={4}>
        <Stat label="Platform Requirements" value={globalReqs.length} sub="Nexus RPO — all sites" accent/>
        <Stat label="Your Site Requirements" value={myReqs.filter(r=>r.active).length} sub="Added by your team"/>
        <Stat label="Compliant Workers" value={compliant.length} sub="Placed at your site"/>
        <Stat label="Needs Attention" value={needsAction.length} sub="Below 80% compliance"/>
      </Grid>

      {needsAction.length>0&&(
        <Alert type="warn">⚠️ {needsAction.length} worker{needsAction.length>1?"s":""} placed at {mySite} {needsAction.length>1?"are":"is"} below 80% compliance — contact the relevant agency to resolve.</Alert>
      )}

      {/* Tabs */}
      <div style={{display:"flex",gap:0,background:"#f1f5f9",borderRadius:10,padding:4,width:"fit-content",marginBottom:4}}>
        {tabs.map(t=>{
          const active=tab===t.k;
          return (
            <button key={t.k} onClick={()=>setTab(t.k)}
              style={{padding:"7px 18px",borderRadius:8,border:"none",fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",
                background:active?T.white:"transparent",color:active?T.navy:T.muted,
                boxShadow:active?"0 1px 4px rgba(0,0,0,0.1)":"none",display:"flex",alignItems:"center",gap:7}}>
              {t.l}
              <span style={{fontSize:11,padding:"1px 6px",borderRadius:10,background:active?"#e8ecf4":"transparent",color:active?T.navy:T.muted,fontWeight:700}}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Requirements tab ── */}
      {tab==="requirements"&&(
        <>
          <div style={{background:"#f0f7ff",border:`1px solid ${T.blue}33`,borderRadius:10,padding:"11px 15px",marginBottom:14,fontSize:12,color:T.muted,lineHeight:1.6}}>
            <strong style={{color:T.blue}}>ℹ️ How this works:</strong> All workers placed at {mySite} must meet both the platform-wide requirements below and any additional requirements your site has added.
          </div>
          {globalReqs.length>0&&(
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>🌐 Platform-Wide ({globalReqs.length})</div>
              {globalReqs.map(r=><ReqCard key={r.id} r={r}/>)}
            </div>
          )}
          {myReqs.filter(r=>r.active).length>0&&(
            <div>
              <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>📍 {mySite} Specific ({myReqs.filter(r=>r.active).length})</div>
              {myReqs.filter(r=>r.active).map(r=><ReqCard key={r.id} r={r} showEdit borderColor={`${T.teal}66`}/>)}
            </div>
          )}
          {allActive.length===0&&(
            <Card style={{padding:40,textAlign:"center"}}><div style={{fontSize:32,marginBottom:8}}>🛡</div><div style={{color:T.muted}}>No active requirements found.</div></Card>
          )}
        </>
      )}

      {/* ── Worker Status tab ── */}
      {tab==="workers"&&(
        <>
          {myWorkers.length===0?(
            <Card style={{padding:40,textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:10}}>👥</div>
              <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>No workers placed yet</div>
              <p style={{color:T.muted,fontSize:13}}>Workers will appear here once they have been placed at {mySite}.</p>
            </Card>
          ):(
            <Card>
              <Table
                headers={["Worker","Role","Agency","DBS","Training","NMC/PIN","Compliance","RTW"]}
                rows={myWorkers.sort((a,b)=>a.compliance-b.compliance).map(w=>(
                  <tr key={w.id} style={{borderBottom:`1px solid ${T.border}`,background:w.compliance<60?T.redBg:w.compliance<80?"#fffbeb":"transparent"}}>
                    <Td bold>{w.name}</Td>
                    <Td><Badge label={w.role} color={T.purple} bg={T.purpleBg}/></Td>
                    <Td style={{fontSize:12,color:T.muted}}>{w.agency}</Td>
                    <Td><SBadge s={w.dbs}/></Td>
                    <Td><SBadge s={w.training}/></Td>
                    <Td>{w.pin?<Badge label="✓ Verified" color={T.green} bg={T.greenBg}/>:<Badge label="N/A" color={T.muted} bg="#f1f5f9"/>}</Td>
                    <Td>
                      <div style={{display:"flex",alignItems:"center",gap:8,minWidth:90}}>
                        <div style={{flex:1}}><ProgressBar value={w.compliance} color={w.compliance>=80?T.green:w.compliance>=60?T.amber:T.red}/></div>
                        <span style={{fontSize:11,fontWeight:700,color:w.compliance>=80?T.green:w.compliance>=60?T.amber:T.red,minWidth:32}}>{w.compliance}%</span>
                      </div>
                    </Td>
                    <Td>
                      {w.rtwExpiry
                        ? <span style={{fontSize:11,fontWeight:600,color:w.rtwExpiry<"2026-06-10"?T.red:T.green}}>{w.rtwExpiry}</span>
                        : <Badge label="Permanent" color={T.green} bg={T.greenBg}/>}
                    </Td>
                  </tr>
                ))}
              />
            </Card>
          )}
        </>
      )}

      {/* ── My Requirements tab ── */}
      {tab==="mine"&&(
        <>
          <div style={{background:T.tealBg,border:`1px solid ${T.teal}44`,borderRadius:10,padding:"11px 15px",marginBottom:14,fontSize:12,color:T.teal,fontWeight:600,lineHeight:1.6}}>
            📍 Site-specific requirements you manage. Workers placed at {mySite} must meet these in addition to all platform requirements.
          </div>
          {myReqs.length===0?(
            <Card style={{padding:40,textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:10}}>📋</div>
              <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>No site-specific requirements yet</div>
              <p style={{color:T.muted,fontSize:13,marginBottom:16}}>Add requirements specific to your home — specialist training, site health checks, or additional certifications.</p>
              <Btn onClick={()=>setShowForm(true)}>+ Add Your First Requirement</Btn>
            </Card>
          ):(
            <Card>
              <Table
                headers={["Requirement","Category","Applies To","Renews","Status","Actions"]}
                rows={myReqs.map(r=>{
                  const cc=catColors[r.category]||{c:T.muted,bg:"#f1f5f9"};
                  return (
                    <tr key={r.id} style={{borderBottom:`1px solid ${T.border}`,opacity:r.active?1:0.55}}>
                      <Td>
                        <div style={{fontWeight:700,fontSize:13}}>{r.name}</div>
                        {r.notes&&<div style={{fontSize:10,color:T.muted,marginTop:1}}>{r.notes}</div>}
                        <div style={{marginTop:3}}>{r.mandatory?<Badge label="Required" color={T.red} bg={T.redBg}/>:<Badge label="Optional" color={T.muted} bg="#f1f5f9"/>}</div>
                      </Td>
                      <Td><Badge label={r.category} color={cc.c} bg={cc.bg}/></Td>
                      <Td><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{(r.appliesToRoles||[]).map(role=><span key={role} style={{fontSize:9,background:T.purpleBg,color:T.purple,borderRadius:4,padding:"2px 5px",fontWeight:700}}>{role}</span>)}</div></Td>
                      <Td><span style={{fontSize:12,color:T.muted}}>{r.expiryMonths?`${r.expiryMonths} months`:"None"}</span></Td>
                      <Td>
                        <button onClick={()=>toggleActive(r.id)} style={{padding:"4px 10px",borderRadius:20,border:`1.5px solid ${r.active?T.green:T.border}`,background:r.active?T.greenBg:"#f1f5f9",color:r.active?T.green:T.muted,fontSize:10,fontWeight:700,cursor:"pointer",fontFamily:"Syne,sans-serif"}}>
                          {r.active?"Active":"Inactive"}
                        </button>
                      </Td>
                      <Td>
                        <div style={{display:"flex",gap:5}}>
                          <Btn small variant="secondary" onClick={()=>setEditing(r)}>Edit</Btn>
                          <Btn small variant="danger" onClick={()=>deleteReq(r.id)}>×</Btn>
                        </div>
                      </Td>
                    </tr>
                  );
                })}
              />
            </Card>
          )}
        </>
      )}
    </Page>
  );
};

/* ─── ADMIN: DOCUMENTS ───────────────────────────────────────────────────────── */
const DocumentVault = () => {
  const [filter,setFilter] = useState("all");
  const [uploadModal,setUploadModal] = useState(false);
  const [viewModal,setViewModal] = useState(null);
  const [requestedNew,setRequestedNew] = useState([]);
  const filtered = filter==="all"?DOCS:DOCS.filter(d=>d.status===filter);

  const handleDownload = (d) => {
    exportCSV(`${d.worker.replace(/ /g,"_")}_${d.type.replace(/ /g,"_")}.csv`,
      ["Worker","Document Type","Uploaded","Expires","Status"],
      [[d.worker,d.type,d.uploaded,d.expires,d.status]]);
  };

  return (
    <Page title="Document Vault" sub="Centralised storage for all worker credentials" icon="📁" action={<Btn onClick={()=>setUploadModal(true)}>Upload Document</Btn>}>
      {uploadModal && (
        <Modal title="Upload Document" onClose={()=>setUploadModal(false)}>
          <Select label="Worker" value="" onChange={()=>{}} options={WORKERS.map(w=>w.name)}/>
          <Select label="Document Type" value="" onChange={()=>{}} options={["DBS Certificate","Mandatory Training","Right to Work","NMC PIN","Passport","Visa/BRP"]}/>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Upload File</label>
            <div style={{border:`2px dashed ${T.border}`,borderRadius:8,padding:"28px",textAlign:"center",cursor:"pointer",background:"#f8fafc"}}>
              <div style={{fontSize:28,marginBottom:8}}>📎</div>
              <div style={{fontSize:13,color:T.muted}}>Drag & drop or click to browse</div>
              <div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>PDF, JPG, PNG — max 10MB</div>
            </div>
          </div>
          <Input label="Expiry Date" type="date" value="" onChange={()=>{}}/>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={()=>{setUploadModal(false);alert("Document uploaded successfully.");}}>Upload</Btn>
            <Btn variant="secondary" onClick={()=>setUploadModal(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
      {viewModal && (
        <Modal title={`${viewModal.type} — ${viewModal.worker}`} onClose={()=>setViewModal(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[["Worker",viewModal.worker],["Document Type",viewModal.type],["Uploaded",viewModal.uploaded],["Expires",viewModal.expires]].map(([k,v])=>(
              <div key={k} style={{background:"#f8fafc",borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:11,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{k}</div>
                <div style={{fontSize:13,fontWeight:600}}>{v}</div>
              </div>
            ))}
          </div>
          <SBadge s={viewModal.status}/>
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <Btn onClick={()=>{handleDownload(viewModal);setViewModal(null);}}>Download</Btn>
            <Btn variant="secondary" onClick={()=>setViewModal(null)}>Close</Btn>
          </div>
        </Modal>
      )}
      <Grid cols={3}>
        <Stat label="Total Documents" value={DOCS.length} accent/>
        <Stat label="Verified" value={DOCS.filter(d=>d.status==="verified").length}/>
        <Stat label="Expiring / Expired" value={DOCS.filter(d=>d.status!=="verified").length} sub="Action required"/>
      </Grid>
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {["all","verified","expiring","expired"].map(f=>(
          <Pill key={f} label={f==="all"?"All":f.charAt(0).toUpperCase()+f.slice(1)} active={filter===f} onClick={()=>setFilter(f)}/>
        ))}
      </div>
      <Card>
        <Table
          headers={["Worker","Document Type","Upload Date","Expiry Date","Status","Actions"]}
          rows={filtered.map((d,i)=>(
            <tr key={i} style={{borderBottom:`1px solid ${T.border}`,background:d.status==="expired"?T.redBg:d.status==="expiring"?"#fffbeb":"transparent"}}>
              <Td bold>{d.worker}</Td>
              <Td>{d.type}</Td>
              <Td>{d.uploaded}</Td>
              <Td>{d.expires}</Td>
              <Td><SBadge s={d.status}/></Td>
              <Td>
                <div style={{display:"flex",gap:5}}>
                  <Btn small variant="secondary" onClick={()=>setViewModal(d)}>View</Btn>
                  <Btn small variant="secondary" onClick={()=>handleDownload(d)}>Download</Btn>
                  {d.status==="expired" && !requestedNew.includes(i) && <Btn small variant="danger" onClick={()=>setRequestedNew(r=>[...r,i])}>Request New</Btn>}
                  {requestedNew.includes(i) && <Badge label="Requested" color={T.amber} bg={T.amberBg}/>}
                </div>
              </Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};

/* ─── ADMIN: RATE CARDS ──────────────────────────────────────────────────────── */
const BANDS = ["Standard","Senior","Specialist"];
const RATE_DAY_KEYS = ["weekday","saturday","sunday","bankHoliday"];
const RATE_DAY_LABELS = {weekday:"Weekday",saturday:"Saturday",sunday:"Sunday",bankHoliday:"Bank Hol"};

const blankRate = (type, overrides={}) => ({
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

const RateEditModal = ({rate, onSave, onClose, onDelete, isNew}) => {
  const [r, setR] = useState({...rate});
  const f = (k,v) => setR(p=>({...p,[k]:v}));
  const agencyNames  = AGENCIES.map(a=>a.name);
  const careHomeNames = ["Sunrise Care","Meadowbrook Lodge","Oakwood Nursing","Riverside Manor"];
  return (
    <Modal title={isNew ? `Add ${r.type==="agency"?"Agency":"Client"} Rate Card` : `Edit Rate — ${r.role} (${r.band})`} onClose={onClose}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:4}}>
        {r.type==="agency"
          ? <div style={{gridColumn:"1/-1"}}><Select label="Agency *" value={r.agency||""} onChange={v=>f("agency",v)} options={agencyNames}/></div>
          : <div style={{gridColumn:"1/-1"}}><Select label="Care Home (Client) *" value={r.careHome||""} onChange={v=>f("careHome",v)} options={careHomeNames}/></div>
        }
        <Select label="Role" value={r.role} onChange={v=>f("role",v)} options={ROLES}/>
        <Select label="Band" value={r.band} onChange={v=>f("band",v)} options={BANDS}/>
      </div>
      <div style={{background:"#f8fafc",borderRadius:8,padding:"12px 14px",margin:"10px 0 14px"}}>
        <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>
          {r.type==="agency"?"Pay Rate (£/hr — what Nexus RPO pays agency)":"Charge Rate (£/hr — what Nexus RPO bills client)"}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {RATE_DAY_KEYS.map(k=>(
            <Input key={k} label={RATE_DAY_LABELS[k]} type="number" value={r[k]} onChange={v=>f(k,parseFloat(v)||0)}/>
          ))}
        </div>
        <div style={{marginTop:10,display:"flex",alignItems:"center",gap:10}}>
          <Input label="Night Modifier ×" type="number" value={r.nightMod} onChange={v=>f("nightMod",parseFloat(v)||1)}/>
          <div style={{fontSize:11,color:T.muted,paddingTop:20}}>Applied to all overnight rates</div>
        </div>
      </div>
      <Input label="Notes" value={r.notes} onChange={v=>f("notes",v)} placeholder="e.g. Negotiated premium, specialist uplift…"/>
      <div style={{display:"flex",gap:10,justifyContent:"space-between",marginTop:16}}>
        <div>
          {!isNew && <Btn variant="danger" small onClick={()=>{onDelete(r.id);onClose();}}>Delete</Btn>}
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={()=>{onSave(r);onClose();}}>Save Rate Card</Btn>
        </div>
      </div>
    </Modal>
  );
};

const RateCards = ({rateCards, setRateCards}) => {
  const rates    = rateCards;
  const setRates = setRateCards;
  const [tab, setTab]       = useState("agency");       // "agency" | "client"
  const [selAgency,  setSelAgency]  = useState("First Choice Nursing");
  const [selClient,  setSelClient]  = useState("Sunrise Care");
  const [editing,    setEditing]    = useState(null);
  const [isNew,      setIsNew]      = useState(false);

  const agencyNames    = AGENCIES.map(a=>a.name);
  const careHomeNames  = ["Sunrise Care","Meadowbrook Lodge","Oakwood Nursing","Riverside Manor"];

  const saveRate = (r) => {
    if (isNew) setRates(p=>[...p, r]);
    else setRates(p=>p.map(x=>x.id===r.id?r:x));
  };
  const deleteRate = (id) => setRates(p=>p.filter(x=>x.id!==id));

  // ── Agency tab ──────────────────────────────────────────────────────────────
  const agencyRates = rates.filter(r=>r.type==="agency" && r.agency===selAgency);

  // ── Client tab ──────────────────────────────────────────────────────────────
  const clientRates = rates.filter(r=>r.type==="client" && r.careHome===selClient);

  // ── Coverage matrix: which agencies have rates set for selected client ──────
  const coverageMatrix = agencyNames.map(ag => ({
    agency: ag,
    roles: ROLES.map(role => ({
      role,
      agRate: rates.find(r=>r.type==="agency"&&r.agency===ag&&r.role===role),
      clRate: rates.find(r=>r.type==="client"&&r.careHome===selClient&&r.role===role),
    }))
  }));

  const TabBtn = ({id,label}) => (
    <button onClick={()=>setTab(id)} style={{
      padding:"8px 20px",borderRadius:8,border:`1.5px solid ${tab===id?T.navy:T.border}`,
      background:tab===id?T.navy:"transparent",color:tab===id?T.white:T.muted,
      fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"Syne,sans-serif",transition:"all 0.15s"
    }}>{label}</button>
  );

  const RateRow = ({r}) => (
    <tr style={{borderBottom:`1px solid ${T.border}`,background:r.notes?"#fffdf0":"transparent"}}>
      <Td><Badge label={r.role} color={T.purple} bg={T.purpleBg}/></Td>
      <Td><span style={{fontSize:11,color:T.muted}}>{r.band}</span></Td>
      <Td bold>£{r.weekday}</Td>
      <Td>£{r.saturday}</Td>
      <Td>£{r.sunday}</Td>
      <Td>£{r.bankHoliday}</Td>
      <Td><span style={{fontSize:12,color:T.muted}}>×{r.nightMod}</span></Td>
      <Td>
        {r.notes
          ? <span title={r.notes} style={{fontSize:11,color:T.yellow,cursor:"help"}}>⚠ Note</span>
          : <span style={{fontSize:11,color:T.muted}}>—</span>}
      </Td>
      <Td>
        <Btn small variant="secondary" onClick={()=>{setEditing({...r});setIsNew(false);}}>Edit</Btn>
      </Td>
    </tr>
  );

  const tableHeaders = ["Role","Band","Weekday","Saturday","Sunday","Bank Hol","Night ×","Notes",""];

  return (
    <Page title="Rate Cards" sub="Set pay rates per agency and charge rates per client" icon="💷">

      {editing && (
        <RateEditModal rate={editing} isNew={isNew} onSave={saveRate} onDelete={deleteRate} onClose={()=>setEditing(null)}/>
      )}

      {/* Summary stats */}
      <Grid cols={4}>
        <Stat label="Agency Rate Cards" value={rates.filter(r=>r.type==="agency").length} sub={`Across ${agencyNames.length} agencies`} accent/>
        <Stat label="Client Rate Cards" value={rates.filter(r=>r.type==="client").length} sub={`Across ${careHomeNames.length} care homes`}/>
        <Stat label="Agencies Configured" value={agencyNames.filter(ag=>rates.some(r=>r.type==="agency"&&r.agency===ag)).length} sub={`of ${agencyNames.length} agencies`}/>
        <Stat label="Clients Configured" value={careHomeNames.filter(ch=>rates.some(r=>r.type==="client"&&r.careHome===ch)).length} sub={`of ${careHomeNames.length} clients`}/>
      </Grid>

      <Alert type="info">Rate changes apply to all new shifts. Existing confirmed shifts are unaffected. Agency rates = what Nexus RPO pays. Client rates = what care homes are billed. The difference forms Nexus RPO's margin.</Alert>

      {/* Tab switcher */}
      <div style={{display:"flex",gap:8,marginBottom:18}}>
        <TabBtn id="agency" label="🏢 Agency Rates"/>
        <TabBtn id="client" label="🏥 Client Rates"/>
        <TabBtn id="matrix" label="📊 Coverage Matrix"/>
      </div>

      {/* ── AGENCY RATES TAB ─────────────────────────────────────────────────── */}
      {tab==="agency" && (
        <>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:6}}>
              {agencyNames.map(ag=>(
                <button key={ag} onClick={()=>setSelAgency(ag)} style={{
                  padding:"6px 14px",borderRadius:20,border:`1.5px solid ${selAgency===ag?T.navy:T.border}`,
                  background:selAgency===ag?T.navy:"transparent",color:selAgency===ag?T.white:T.muted,
                  fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:"Syne,sans-serif",transition:"all 0.15s",whiteSpace:"nowrap"
                }}>{ag}</button>
              ))}
            </div>
            <div style={{marginLeft:"auto"}}>
              <Btn small onClick={()=>{setEditing(blankRate("agency",{agency:selAgency}));setIsNew(true);}}>+ Add Rate</Btn>
            </div>
          </div>

          {agencyRates.length === 0
            ? <Card style={{padding:32,textAlign:"center"}}>
                <div style={{fontSize:32,marginBottom:8}}>📋</div>
                <div style={{fontWeight:700,marginBottom:6}}>No rates set for {selAgency}</div>
                <div style={{color:T.muted,fontSize:13,marginBottom:16}}>Add rate cards to define what Nexus RPO pays this agency per role.</div>
                <Btn onClick={()=>{setEditing(blankRate("agency",{agency:selAgency}));setIsNew(true);}}>+ Add First Rate Card</Btn>
              </Card>
            : <Card>
                <div style={{padding:"12px 18px",background:"#f0fdf4",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:12,fontWeight:700,color:T.green}}>Pay rates for {selAgency}</span>
                  <span style={{fontSize:11,color:T.muted}}>— what Nexus RPO pays this agency per hour billed</span>
                </div>
                <Table headers={tableHeaders} rows={agencyRates.map(r=><RateRow key={r.id} r={r}/>)}/>
              </Card>
          }

          {/* Tier / notes summary */}
          {agencyRates.length > 0 && (
            <Card style={{marginTop:14,padding:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <h3 style={{fontWeight:700,fontSize:13}}>12-Hour Shift Cost Estimate ({selAgency})</h3>
                <Badge label={AGENCIES.find(a=>a.name===selAgency)?.tier||"Tier 2"} color={tierColor(AGENCIES.find(a=>a.name===selAgency)?.tier||"Tier 2")} bg={tierBg(AGENCIES.find(a=>a.name===selAgency)?.tier||"Tier 2")}/>
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {agencyRates.map(r=>(
                  <div key={r.id} style={{background:"#f8fafc",borderRadius:8,padding:"10px 14px",minWidth:120}}>
                    <div style={{fontSize:11,color:T.muted,marginBottom:2}}>{r.role} · 12hr weekday</div>
                    <div style={{fontSize:20,fontWeight:800,color:T.navy}}>£{r.weekday*12}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* ── CLIENT RATES TAB ─────────────────────────────────────────────────── */}
      {tab==="client" && (
        <>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {careHomeNames.map(ch=>(
                <button key={ch} onClick={()=>setSelClient(ch)} style={{
                  padding:"6px 14px",borderRadius:20,border:`1.5px solid ${selClient===ch?T.navy:T.border}`,
                  background:selClient===ch?T.navy:"transparent",color:selClient===ch?T.white:T.muted,
                  fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:"Syne,sans-serif",transition:"all 0.15s",whiteSpace:"nowrap"
                }}>{ch}</button>
              ))}
            </div>
            <div style={{marginLeft:"auto"}}>
              <Btn small onClick={()=>{setEditing(blankRate("client",{careHome:selClient}));setIsNew(true);}}>+ Add Rate</Btn>
            </div>
          </div>

          {clientRates.length === 0
            ? <Card style={{padding:32,textAlign:"center"}}>
                <div style={{fontSize:32,marginBottom:8}}>🏥</div>
                <div style={{fontWeight:700,marginBottom:6}}>No rates set for {selClient}</div>
                <div style={{color:T.muted,fontSize:13,marginBottom:16}}>Add rate cards to define what this care home is billed per role.</div>
                <Btn onClick={()=>{setEditing(blankRate("client",{careHome:selClient}));setIsNew(true);}}>+ Add First Rate Card</Btn>
              </Card>
            : <Card>
                <div style={{padding:"12px 18px",background:"#eff6ff",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:12,fontWeight:700,color:T.blue}}>Charge rates for {selClient}</span>
                  <span style={{fontSize:11,color:T.muted}}>— what Nexus RPO bills this care home per hour</span>
                </div>
                <Table headers={tableHeaders} rows={clientRates.map(r=><RateRow key={r.id} r={r}/>)}/>
              </Card>
          }

          {clientRates.length > 0 && (
            <Card style={{marginTop:14,padding:18}}>
              <h3 style={{fontWeight:700,fontSize:13,marginBottom:12}}>12-Hour Shift Revenue Estimate ({selClient})</h3>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {clientRates.map(r=>(
                  <div key={r.id} style={{background:"#f8fafc",borderRadius:8,padding:"10px 14px",minWidth:120}}>
                    <div style={{fontSize:11,color:T.muted,marginBottom:2}}>{r.role} · 12hr weekday</div>
                    <div style={{fontSize:20,fontWeight:800,color:T.blue}}>£{r.weekday*12}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* ── COVERAGE MATRIX TAB ──────────────────────────────────────────────── */}
      {tab==="matrix" && (
        <>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14,flexWrap:"wrap"}}>
            <span style={{fontSize:12,color:T.muted,fontWeight:600}}>Client:</span>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {careHomeNames.map(ch=>(
                <button key={ch} onClick={()=>setSelClient(ch)} style={{
                  padding:"6px 14px",borderRadius:20,border:`1.5px solid ${selClient===ch?T.navy:T.border}`,
                  background:selClient===ch?T.navy:"transparent",color:selClient===ch?T.white:T.muted,
                  fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:"Syne,sans-serif",transition:"all 0.15s",whiteSpace:"nowrap"
                }}>{ch}</button>
              ))}
            </div>
          </div>

          <Card>
            <div style={{padding:"12px 18px",background:"#f8fafc",borderBottom:`1px solid ${T.border}`}}>
              <span style={{fontWeight:700,fontSize:12}}>Rate Coverage — {selClient}</span>
              <span style={{fontSize:11,color:T.muted,marginLeft:8}}>Green = agency rate set · Blue = client rate set · Red = gap</span>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
                <thead>
                  <tr style={{background:"#f8fafc"}}>
                    <th style={{padding:"9px 14px",fontSize:11,fontWeight:700,color:T.muted,textAlign:"left",borderBottom:`1px solid ${T.border}`,textTransform:"uppercase",letterSpacing:"0.06em"}}>Agency</th>
                    {ROLES.slice(0,4).map(role=>(
                      <th key={role} style={{padding:"9px 12px",fontSize:11,fontWeight:700,color:T.muted,textAlign:"center",borderBottom:`1px solid ${T.border}`,textTransform:"uppercase",letterSpacing:"0.06em"}}>{role}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {agencyNames.map(ag=>{
                    return (
                      <tr key={ag} style={{borderBottom:`1px solid ${T.border}`}}>
                        <td style={{padding:"11px 14px",fontWeight:600,fontSize:13}}>{ag}</td>
                        {ROLES.slice(0,4).map(role=>{
                          const agRate = rates.find(r=>r.type==="agency"&&r.agency===ag&&r.role===role);
                          const clRate = rates.find(r=>r.type==="client"&&r.careHome===selClient&&r.role===role);
                          const bothSet = agRate && clRate;
                          const noneSet = !agRate && !clRate;
                          const margin  = bothSet ? clRate.weekday - agRate.weekday : null;
                          return (
                            <td key={role} style={{padding:"11px 12px",textAlign:"center"}}>
                              {noneSet
                                ? <span style={{fontSize:11,color:T.red,fontWeight:700,background:T.redBg,padding:"3px 8px",borderRadius:6}}>No rates</span>
                                : <div style={{display:"flex",flexDirection:"column",gap:3,alignItems:"center"}}>
                                    {agRate && <span style={{fontSize:11,color:T.green,fontWeight:700,background:T.greenBg,padding:"2px 7px",borderRadius:5}}>£{agRate.weekday} pay</span>}
                                    {clRate && <span style={{fontSize:11,color:T.blue, fontWeight:700,background:"#eff6ff",padding:"2px 7px",borderRadius:5}}>£{clRate.weekday} bill</span>}
                                    {bothSet && <span style={{fontSize:10,color:margin>=0?T.green:T.red,fontWeight:800}}>
                                      {margin>=0?`+£${margin} margin`:`-£${Math.abs(margin)} loss`}
                                    </span>}
                                    {!agRate && <span style={{fontSize:10,color:T.yellow,fontWeight:700}}>⚠ no pay rate</span>}
                                    {!clRate && <span style={{fontSize:10,color:T.yellow,fontWeight:700}}>⚠ no charge rate</span>}
                                  </div>
                              }
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </Page>
  );
};

/* ─── ADMIN: INVOICES ────────────────────────────────────────────────────────── */
const InvoiceManager = ({invoices=INVOICES, setInvoices, timesheets=[]}) => {
  const [viewInv, setViewInv] = useState(null);

  const allInvoices = invoices;
  const drafts   = allInvoices.filter(i=>i.status==="draft");
  const live     = allInvoices.filter(i=>i.status!=="draft");
  const paid     = live.filter(i=>i.status==="paid").reduce((a,i)=>a+i.amount,0);
  const pending  = live.filter(i=>i.status==="pending").reduce((a,i)=>a+i.amount,0);
  const overdue  = live.filter(i=>i.status==="overdue").reduce((a,i)=>a+i.amount,0);
  const draftVal = drafts.reduce((a,i)=>a+i.amount,0);

  const finalise = (inv) => {
    const invId = `INV-${String(Math.floor(Math.random()*9000)+1000)}`;
    const today = new Date().toISOString().split("T")[0];
    const due   = new Date(Date.now()+30*24*60*60*1000).toISOString().split("T")[0];
    // Stamp timesheets as invoiced
    if(setInvoices) {
      setInvoices(prev => prev.map(i => i.id===inv.id
        ? {...i, id:invId, status:"pending", issued:today, due, isDraft:false}
        : i
      ));
    }
    setViewInv({...inv, id:invId, issued:today, due});
  };

  const getTimesheets = (inv) => timesheets.filter(t =>
    t.agency===inv.agency && (t.status==="approved"||t.invoiceId===inv.id)
  );

  const statusColors = {draft:{c:T.purple,bg:T.purpleBg},pending:{c:T.yellow,bg:T.yellowBg},paid:{c:T.green,bg:T.greenBg},overdue:{c:T.red,bg:T.redBg}};

  const invExports = [
    {icon:"📋",label:"All Invoices — CSV",desc:"Full invoice ledger",fn:()=>exportCSV("fcc-invoices.csv",
      ["Invoice ID","Agency","Period","Shifts","Amount (£)","Issued","Due","Status"],
      live.map(i=>[i.id,i.agency,i.period,i.shifts,i.amount,i.issued,i.due,i.status]))},
    {icon:"💷",label:"Paid Invoices — CSV",desc:"Settled invoices only",fn:()=>exportCSV("fcc-invoices-paid.csv",
      ["Invoice ID","Agency","Period","Amount (£)","Paid Date"],
      live.filter(i=>i.status==="paid").map(i=>[i.id,i.agency,i.period,i.amount,i.due]))},
    {icon:"⚠️",label:"Overdue Invoices — CSV",desc:"Outstanding overdue",fn:()=>exportCSV("fcc-invoices-overdue.csv",
      ["Invoice ID","Agency","Period","Amount (£)","Due Date"],
      live.filter(i=>i.status==="overdue").map(i=>[i.id,i.agency,i.period,i.amount,i.due]))},
    {icon:"🖨️",label:"Invoice Ledger — PDF",desc:"Printable HTML report",fn:()=>exportHTML("Invoice Ledger","Nexus RPO — All Invoices",
      buildTable(["Invoice ID","Agency","Period","Shifts","Amount","Due","Status"],
        live.map(i=>[i.id,i.agency,i.period,i.shifts,`£${i.amount.toLocaleString()}`,i.due,i.status.toUpperCase()])))},
  ];

  return (
    <Page title="Invoice Manager" sub="All agency invoices — draft and issued" icon="📄" action={<ExportMenu exports={invExports}/>}>

      {/* Invoice detail modal */}
      {viewInv && (
        <Modal title={`Invoice ${viewInv.id}`} onClose={()=>setViewInv(null)}>
          <div style={{background:"#f8fafc",borderRadius:10,padding:"14px 16px",marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div>
                <div style={{fontWeight:800,fontSize:16,color:T.navy,marginBottom:2}}>{viewInv.id}</div>
                <div style={{fontSize:12,color:T.muted}}>{viewInv.agency} · {viewInv.period}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:24,fontWeight:800,color:T.green}}>£{viewInv.amount?.toLocaleString()}</div>
                <div style={{fontSize:11,color:T.muted}}>Due {viewInv.due||"TBC"}</div>
              </div>
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Timesheets included</div>
            {getTimesheets(viewInv).map(ts=>(
              <div key={ts.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",borderRadius:7,background:"#f0fff4",border:`1px solid ${T.green}33`,marginBottom:5}}>
                <div>
                  <span style={{fontWeight:700,fontSize:12}}>{ts.worker}</span>
                  <span style={{fontSize:11,color:T.muted,marginLeft:8}}>{ts.role} · {ts.date} · {ts.hoursWorked}h</span>
                </div>
                <span style={{fontWeight:800,fontSize:13,color:T.green}}>£{ts.total}</span>
              </div>
            ))}
            {getTimesheets(viewInv).length===0 && <p style={{fontSize:12,color:T.muted}}>No timesheet detail available.</p>}
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="secondary" onClick={()=>setViewInv(null)}>Close</Btn>
            <Btn onClick={()=>exportHTML(`Invoice ${viewInv.id}`,`${viewInv.agency} · ${viewInv.period}`,buildTable(["Worker","Role","Date","Hours","Total"],getTimesheets(viewInv).map(ts=>[ts.worker,ts.role,ts.date,`${ts.hoursWorked}h`,`£${ts.total}`])))}>Download PDF</Btn>
          </div>
        </Modal>
      )}

      {/* Stats */}
      <Grid cols={4}>
        <Stat label="Draft (Awaiting Send)" value={drafts.length} sub={`£${draftVal.toLocaleString()} to send`} accent={drafts.length>0}/>
        <Stat label="Pending Payment" value={`£${pending.toLocaleString()}`} sub={`${live.filter(i=>i.status==="pending").length} invoices`}/>
        <Stat label="Paid" value={`£${paid.toLocaleString()}`} sub={`${live.filter(i=>i.status==="paid").length} invoices`}/>
        <Stat label="Overdue" value={`£${overdue.toLocaleString()}`} sub={overdue>0?"Immediate action":"All clear"} accent={overdue>0}/>
      </Grid>

      {overdue>0 && <Alert type="error">⚠️ {live.filter(i=>i.status==="overdue").length} invoice{live.filter(i=>i.status==="overdue").length>1?"s are":" is"} overdue.</Alert>}

      {/* Draft invoices — auto-grouped from approved timesheets */}
      {drafts.length>0 && (
        <Card style={{marginBottom:18,border:`2px solid ${T.purple}44`}}>
          <CardHead title="Draft Invoices" icon="🧾" sub="Auto-grouped from approved timesheets — review and send to agencies"/>
          <div style={{padding:"0 14px 14px"}}>
            {drafts.map(inv=>{
              const ts = getTimesheets(inv);
              return (
                <div key={inv.id} style={{padding:"16px 18px",background:"#faf5ff",borderRadius:10,border:`1.5px solid ${T.purple}44`,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:12}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:15,color:T.navy,marginBottom:3}}>{inv.agency}</div>
                      <div style={{fontSize:12,color:T.muted}}>{inv.shifts} timesheet{inv.shifts!==1?"s":""} · {inv.period} · All care-home approved</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:22,fontWeight:800,color:T.green}}>£{inv.amount.toLocaleString()}</div>
                        <div style={{fontSize:11,color:T.muted}}>Total value</div>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <Btn small variant="secondary" onClick={()=>setViewInv(inv)}>View Details</Btn>
                        <Btn small onClick={()=>finalise(inv)}>Finalise & Send →</Btn>
                      </div>
                    </div>
                  </div>
                  {/* Timesheet breakdown */}
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {ts.slice(0,5).map(t=>(
                      <span key={t.id} style={{fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:20,background:T.white,border:`1px solid ${T.border}`,color:T.text}}>
                        {t.worker} · {t.role} · {t.date} · £{t.total}
                      </span>
                    ))}
                    {ts.length>5 && <span style={{fontSize:10,color:T.muted,padding:"3px 9px"}}>+{ts.length-5} more</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Sent invoices */}
      <Card>
        <CardHead title="Sent Invoices" sub="All issued invoices" icon="📋"/>
        <Table
          headers={["Invoice","Agency","Period","Timesheets","Amount","Issued","Due","Status","Actions"]}
          empty="No sent invoices yet"
          rows={live.map(inv=>(
            <tr key={inv.id} style={{borderBottom:`1px solid ${T.border}`,background:inv.status==="overdue"?T.redBg:"transparent"}}>
              <Td><span style={{fontFamily:"monospace",fontSize:12,fontWeight:700,color:T.navy}}>{inv.id}</span></Td>
              <Td bold>{inv.agency}</Td>
              <Td>{inv.period}</Td>
              <Td>{inv.shifts}</Td>
              <Td bold>£{inv.amount.toLocaleString()}</Td>
              <Td>{inv.issued}</Td>
              <Td>{inv.due}</Td>
              <Td><SBadge s={inv.status}/></Td>
              <Td>
                <div style={{display:"flex",gap:5}}>
                  <Btn small variant="secondary" onClick={()=>setViewInv(inv)}>View</Btn>
                  <Btn small variant="secondary" onClick={()=>exportHTML(`Invoice ${inv.id}`,`${inv.agency} · ${inv.period}`,buildTable(["Invoice","Agency","Period","Timesheets","Amount","Due","Status"],[[inv.id,inv.agency,inv.period,inv.shifts,`£${inv.amount.toLocaleString()}`,inv.due,inv.status.toUpperCase()]]))}>PDF</Btn>
                  {inv.status==="overdue" && <Btn small variant="danger" onClick={()=>alert(`Chase email sent to ${inv.agency} for invoice ${inv.id} (£${inv.amount.toLocaleString()} overdue since ${inv.due}).`)}>Chase</Btn>}
                </div>
              </Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};

/* ─── ADMIN: BUDGETS ──────────────────────────────────────────────────────────── */
const AdminBudgets = ({budgets,setBudgets}) => {
  const [editSite,setEditSite] = useState(null);
  const [editForm,setEditForm] = useState({});
  const sites = Object.keys(INIT_BUDGETS);
  const openEdit = (site) => {
    const b = budgets?.[site]||INIT_BUDGETS[site];
    setEditForm({monthly:b.monthly,annual:b.annual,alertAt75:b.alertAt75,alertAt90:b.alertAt90});
    setEditSite(site);
  };
  const saveEdit = () => {
    if(setBudgets) setBudgets(prev=>({...prev,[editSite]:{...prev[editSite],...editForm,monthly:Number(editForm.monthly),annual:Number(editForm.annual)}}));
    setEditSite(null);
  };
  const totalMonthly = sites.reduce((a,s)=>a+((budgets?.[s]||INIT_BUDGETS[s]).monthly),0);
  const totalAnnual  = sites.reduce((a,s)=>a+((budgets?.[s]||INIT_BUDGETS[s]).annual),0);
  const totalMtd     = sites.reduce((a,s)=>a+((budgets?.[s]||INIT_BUDGETS[s]).mtdSpend),0);
  return (
    <Page title="Budget Management" sub="Set and monitor agency spend budgets for each care home" icon="💰"
      action={<div style={{fontSize:13,fontWeight:700,color:T.amber}}>Total monthly: £{totalMonthly.toLocaleString()}</div>}>
      {editSite&&(
        <Modal title={`Set Budget — ${editSite}`} onClose={()=>setEditSite(null)}>
          <Alert type="info">Budget figures control the tracker bars shown to site managers. Spend is populated automatically from approved timesheets.</Alert>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            <Input label="Monthly Budget (£)" type="number" value={editForm.monthly} onChange={v=>setEditForm(f=>({...f,monthly:v}))}/>
            <Input label="Annual Budget (£)"  type="number" value={editForm.annual}  onChange={v=>setEditForm(f=>({...f,annual:v}))}/>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Alert Thresholds</label>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[{k:"alertAt75",label:"Alert site manager at 75% of monthly budget",color:"#b45309",bg:"#fef3c7"},{k:"alertAt90",label:"Alert site manager at 90% of monthly budget",color:T.red,bg:T.redBg}].map(opt=>(
                <label key={opt.k} onClick={()=>setEditForm(f=>({...f,[opt.k]:!f[opt.k]}))} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,border:`1.5px solid ${editForm[opt.k]?opt.color:T.border}`,background:editForm[opt.k]?opt.bg:T.white,cursor:"pointer"}}>
                  <input type="checkbox" checked={editForm[opt.k]} readOnly style={{accentColor:opt.color,width:14,height:14}}/>
                  <span style={{fontSize:13,fontWeight:600,color:editForm[opt.k]?opt.color:T.text}}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={saveEdit} disabled={!editForm.monthly||!editForm.annual}>Save Budget</Btn>
            <Btn variant="secondary" onClick={()=>setEditSite(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
      <Grid cols={3}>
        <Stat label="Total Monthly Budgets" value={`£${totalMonthly.toLocaleString()}`} accent/>
        <Stat label="Total Annual Budgets"  value={`£${totalAnnual.toLocaleString()}`}/>
        <Stat label="Group MTD Spend"       value={`£${totalMtd.toLocaleString()}`} sub={`${Math.round(totalMtd/totalMonthly*100)}% of combined monthly`}/>
      </Grid>
      <Card>
        <Table headers={["Care Home","Monthly Budget","Annual Budget","MTD Spend","MTD Used","Remaining","Alerts","Actions"]}
          rows={sites.map(site=>{
            const b=budgets?.[site]||INIT_BUDGETS[site];
            const pct=Math.round((b.mtdSpend/b.monthly)*100);
            const col=pct>=90?T.red:pct>=75?"#b45309":T.green;
            return (
              <tr key={site} style={{borderBottom:`1px solid ${T.border}`,background:pct>=90?T.redBg:pct>=75?"#fffbeb":"transparent"}}>
                <Td bold>{site}</Td>
                <Td bold>£{b.monthly.toLocaleString()}</Td>
                <Td>£{b.annual.toLocaleString()}</Td>
                <Td><span style={{fontWeight:700,color:col}}>£{b.mtdSpend.toLocaleString()}</span></Td>
                <Td>
                  <div style={{display:"flex",alignItems:"center",gap:8,minWidth:100}}>
                    <div style={{flex:1}}><ProgressBar value={pct} color={col}/></div>
                    <span style={{fontSize:11,fontWeight:700,color:col,minWidth:30}}>{pct}%</span>
                  </div>
                </Td>
                <Td><span style={{fontWeight:700,color:b.monthly-b.mtdSpend<2000?T.red:T.text}}>£{(b.monthly-b.mtdSpend).toLocaleString()}</span></Td>
                <Td>
                  <div style={{display:"flex",gap:4}}>
                    {b.alertAt75&&<span style={{fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:4,background:"#fef3c7",color:"#b45309"}}>75%</span>}
                    {b.alertAt90&&<span style={{fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:4,background:T.redBg,color:T.red}}>90%</span>}
                    {!b.alertAt75&&!b.alertAt90&&<span style={{fontSize:11,color:T.muted}}>None</span>}
                  </div>
                </Td>
                <Td><Btn small onClick={()=>openEdit(site)}>Edit Budget</Btn></Td>
              </tr>
            );
          })}
        />
      </Card>
    </Page>
  );
};

/* ─── ADMIN: ANALYTICS ───────────────────────────────────────────────────────── */
const Analytics = ({budgets}) => {
  const exports = [
    {icon:"📊",label:"Spend Report — CSV",desc:"Monthly spend by agency",fn:()=>exportCSV("fcc-spend-report.csv",
      ["Month","Spend (£)"],
      ANALYTICS_SPEND.map(r=>[r.month,r.spend]))},
    {icon:"📋",label:"Shift Summary — CSV",desc:"Open vs filled by month",fn:()=>exportCSV("fcc-shift-summary.csv",
      ["Month","Filled","Open"],
      ANALYTICS_SHIFTS.map(r=>[r.month,r.filled,r.open]))},
    {icon:"🏦",label:"Agency Performance — CSV",desc:"Fill rate, response, compliance",fn:()=>exportCSV("fcc-agency-performance.csv",
      ["Agency","Tier","Shifts","Fill Rate (%)","Avg Response","Compliance (%)","Spend (£)"],
      AGENCIES.map(a=>[a.name,a.tier,a.shifts,a.fillRate,a.avgResponse,a.compliance,a.spend]))},
    {icon:"💰",label:"Budget Summary — CSV",desc:"Spend vs budget per site",fn:()=>exportCSV("budget-summary.csv",
      ["Care Home","Monthly Budget","MTD Spend","MTD %","Remaining","YTD Spend"],
      Object.entries(budgets||INIT_BUDGETS).map(([s,b])=>[s,b.monthly,b.mtdSpend,`${Math.round((b.mtdSpend/b.monthly)*100)}%`,b.monthly-b.mtdSpend,b.ytdSpend]))},
    {icon:"🖨️",label:"Full Analytics Report — PDF",desc:"Printable HTML report",fn:()=>exportHTML("Nexus RPO Analytics Report","January–March 2026",
      buildTable(["Month","Spend (£)","Fill Rate (%)","Filled Shifts","Open Shifts"],
        ANALYTICS_SPEND.map((r,i)=>[r.month,`£${r.spend.toLocaleString()}`,ANALYTICS_FILL[i]?.rate||"—",ANALYTICS_SHIFTS[i]?.filled||"—",ANALYTICS_SHIFTS[i]?.open||"—"])))},
  ];

  const totalBudgetAll  = Object.values(budgets||INIT_BUDGETS).reduce((a,b)=>a+b.monthly,0);
  const totalSpendAll   = Object.values(budgets||INIT_BUDGETS).reduce((a,b)=>a+b.mtdSpend,0);
  const budgetPctAll    = Math.round(totalSpendAll/totalBudgetAll*100);
  const budgetSiteData  = Object.entries(budgets||INIT_BUDGETS).map(([site,b])=>({
    site:site.replace(" Care","").replace(" Nursing","").replace(" Dementia Unit","—Dem").replace(" Lodge","").replace(" Manor",""),
    spend:b.mtdSpend, budget:b.monthly, pct:Math.round((b.mtdSpend/b.monthly)*100),
  }));

  return (
  <Page title="Analytics & Reporting" sub="Performance insights across your neutral vendor operation" icon="📊" action={<ExportMenu exports={exports}/>}>
    <Grid cols={4}>
      <Stat label="YTD Spend" value="£423k" accent trend="£18k vs budget" trendUp={true}/>
      <Stat label="Avg Fill Rate" value="86%" trend="6% vs last year" trendUp={true}/>
      <Stat label="Total Shifts" value="568" sub="Jan–Mar 2026"/>
      <Stat label="Group MTD Budget Used" value={`${budgetPctAll}%`} trend={`£${totalSpendAll.toLocaleString()} of £${totalBudgetAll.toLocaleString()}`} trendUp={budgetPctAll>85}/>
    </Grid>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
      <Card>
        <CardHead title="Monthly Spend (£)" icon="💷"/>
        <div style={{padding:"12px 4px"}}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ANALYTICS_SPEND} barSize={28}>
              <XAxis dataKey="month" tick={{fontSize:11,fill:T.muted}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:T.muted}} axisLine={false} tickLine={false} tickFormatter={v=>`£${v/1000}k`}/>
              <Tooltip formatter={v=>[`£${v.toLocaleString()}`,"Spend"]} contentStyle={{borderRadius:8,border:`1px solid ${T.border}`,fontSize:12}}/>
              <Bar dataKey="spend" fill={T.amber} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <CardHead title="Shifts: Open vs Filled" icon="📋"/>
        <div style={{padding:"12px 4px"}}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ANALYTICS_SHIFTS} barSize={14}>
              <XAxis dataKey="month" tick={{fontSize:11,fill:T.muted}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:T.muted}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={{borderRadius:8,border:`1px solid ${T.border}`,fontSize:12}}/>
              <Bar dataKey="filled" fill={T.green} radius={[3,3,0,0]} name="Filled"/>
              <Bar dataKey="open" fill={T.redBg} radius={[3,3,0,0]} name="Open"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18,marginBottom:18}}>
      <Card>
        <CardHead title="Fill Rate Trend" icon="📈"/>
        <div style={{padding:"12px 4px"}}>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={ANALYTICS_FILL}>
              <XAxis dataKey="month" tick={{fontSize:11,fill:T.muted}} axisLine={false} tickLine={false}/>
              <YAxis domain={[60,100]} tick={{fontSize:11,fill:T.muted}} axisLine={false} tickLine={false} unit="%"/>
              <Tooltip formatter={v=>`${v}%`} contentStyle={{borderRadius:8,border:`1px solid ${T.border}`,fontSize:12}}/>
              <Line type="monotone" dataKey="rate" stroke={T.green} strokeWidth={2.5} dot={{r:5,fill:T.green}} activeDot={{r:7}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <CardHead title="Agency League Table" icon="🏆"/>
        <div style={{padding:16}}>
          {AGENCIES.sort((a,b)=>b.fillRate-a.fillRate).map((a,i)=>(
            <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <span style={{width:20,height:20,borderRadius:"50%",background:i===0?T.amber:i===1?"#94a3b8":i===2?"#cd7f32":T.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:i<3?T.white:T.muted,flexShrink:0}}>{i+1}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,marginBottom:3}}>{a.name}</div>
                <ProgressBar value={a.fillRate} color={i===0?T.amber:i===1?"#64748b":i===2?"#cd7f32":T.border}/>
              </div>
              <span style={{fontSize:13,fontWeight:700,color:T.text}}>{a.fillRate}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* Budget breakdown section */}
    <Card>
      <CardHead title="Spend vs Budget by Site — March 2026" icon="💰" sub="Live figures from budget tracker"/>
      <div style={{padding:"0 8px 8px"}}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={budgetSiteData} margin={{top:8,right:8,bottom:0,left:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
            <XAxis dataKey="site" tick={{fontSize:11,fill:T.muted}}/>
            <YAxis tickFormatter={v=>`£${(v/1000).toFixed(0)}k`} tick={{fontSize:11,fill:T.muted}} width={44}/>
            <Tooltip formatter={(v,n)=>[`£${v.toLocaleString()}`,n==="spend"?"MTD Spend":"Monthly Budget"]}/>
            <Bar dataKey="budget" fill="#e2e8f0" radius={[4,4,0,0]} name="budget"/>
            <Bar dataKey="spend" fill={T.amber} radius={[4,4,0,0]} name="spend"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{padding:"0 16px 14px"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {budgetSiteData.map(d=>{
            const col=d.pct>=90?T.red:d.pct>=75?"#b45309":T.green;
            return (
              <div key={d.site} style={{flex:"1 1 160px",padding:"10px 12px",background:"#f8fafc",borderRadius:8,border:`1px solid ${T.border}`}}>
                <div style={{fontSize:11,fontWeight:700,color:T.text,marginBottom:4}}>{d.site}</div>
                <ProgressBar value={d.pct} color={col}/>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.muted,marginTop:3}}>
                  <span style={{fontWeight:700,color:col}}>{d.pct}%</span>
                  <span>£{d.spend.toLocaleString()} / £{d.budget.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  </Page>
  );
};

/* ─── CARE HOME VIEWS ────────────────────────────────────────────────────────── */
const CH_SPEND_DATA = [
  {month:"Oct",spend:11200,budget:15000},{month:"Nov",spend:13800,budget:15000},
  {month:"Dec",spend:9400,budget:15000},{month:"Jan",spend:14200,budget:15000},
  {month:"Feb",spend:12900,budget:15000},{month:"Mar",spend:8420,budget:15000},
];
const CH_FILL_DATA = [
  {month:"Oct",rate:81},{month:"Nov",rate:76},{month:"Dec",rate:88},
  {month:"Jan",rate:72},{month:"Feb",rate:91},{month:"Mar",rate:83},
];
const CH_ROLE_DATA = [
  {role:"RGN",shifts:18,spend:6120},{role:"RMN",shifts:9,spend:3420},
  {role:"HCA",shifts:24,spend:1920},{role:"Senior Carer",shifts:7,spend:980},
];
const CH_AGENCY_DATA = [
  {name:"First Choice",shifts:31,pct:53},{name:"ProCare",shifts:16,pct:28},
  {name:"MedStaff",shifts:8,pct:14},{name:"Bank Staff",shifts:3,pct:5},
];

const CareHomeDashboard = ({user, navigate, budgets, setBudgets}) => {
  const mine = SHIFTS.filter(s=>s.carehome==="Sunrise Care");
  const filled = mine.filter(s=>s.status==="filled").length;
  const open = mine.filter(s=>["open","pending"].includes(s.status)).length;
  const urgent = mine.filter(s=>s.urgency==="urgent"&&s.status!=="filled");
  const fillRate = mine.length ? Math.round(filled/mine.length*100) : 0;
  const mtdSpend = 8420; const budget = 15000;
  const budgetPct = Math.round(mtdSpend/budget*100);

  return (
    <Page title={`Hello, ${user.name.split(" ")[0]}`} sub="Sunrise Care — Staffing Analytics Overview" icon="◈">

      {/* KPI Row */}
      <Grid cols={4}>
        <Stat label="Fill Rate (Mar)" value={`${fillRate}%`} trend="+7% vs Feb" trendUp={true} accent/>
        <Stat label="Shifts This Month" value={mine.length} sub={`${filled} filled · ${open} open`}/>
        <Stat label="MTD Spend" value={`£${mtdSpend.toLocaleString()}`} trend={`${budgetPct}% of budget`} trendUp={budgetPct>80}/>
        <Stat label="Outstanding Invoices" value="£2,340" sub="2 invoices pending"/>
      </Grid>

      {/* Urgent alerts */}
      {urgent.length>0&&(
        <div style={{background:"#fef3c7",border:"1.5px solid #f59e0b",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
          <span style={{fontSize:18}}>⚠️</span>
          <div>
            <div style={{fontWeight:700,fontSize:13,color:"#92400e"}}>Action needed: {urgent.length} urgent unfilled {urgent.length===1?"shift":"shifts"}</div>
            <div style={{fontSize:12,color:"#b45309",marginTop:2}}>{urgent.map(s=>`${s.role} · ${s.date}`).join(" · ")}</div>
          </div>
        </div>
      )}

      {/* Charts row */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18}}>
        <Card>
          <CardHead title="Monthly Spend vs Budget" sub="Last 6 months"/>
          <div style={{padding:"0 8px 8px"}}>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={CH_SPEND_DATA} margin={{top:8,right:8,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
                <XAxis dataKey="month" tick={{fontSize:11,fill:T.muted}}/>
                <YAxis tickFormatter={v=>`£${(v/1000).toFixed(0)}k`} tick={{fontSize:11,fill:T.muted}} width={40}/>
                <Tooltip formatter={(v,n)=>[`£${v.toLocaleString()}`,n==="spend"?"Spend":"Budget"]}/>
                <Bar dataKey="spend" fill={T.amber} radius={[4,4,0,0]} name="spend"/>
                <Line type="monotone" dataKey="budget" stroke={T.red} strokeDasharray="5 3" strokeWidth={2} dot={false} name="budget"/>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHead title="Fill Rate Trend"/>
          <div style={{padding:"0 8px 8px"}}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={CH_FILL_DATA} margin={{top:8,right:8,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
                <XAxis dataKey="month" tick={{fontSize:11,fill:T.muted}}/>
                <YAxis domain={[60,100]} tickFormatter={v=>`${v}%`} tick={{fontSize:11,fill:T.muted}} width={36}/>
                <Tooltip formatter={v=>[`${v}%`,"Fill Rate"]}/>
                <Line type="monotone" dataKey="rate" stroke={T.teal} strokeWidth={2.5} dot={{r:4,fill:T.teal}} activeDot={{r:6}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Role breakdown + Agency split + Budget */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:18}}>

        {/* Role breakdown */}
        <Card>
          <CardHead title="By Role (Mar)"/>
          <div style={{padding:"8px 16px 12px"}}>
            {CH_ROLE_DATA.map(r=>(
              <div key={r.role} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,fontWeight:700,color:T.text}}>{r.role}</span>
                  <span style={{fontSize:12,color:T.muted}}>{r.shifts} shifts · <strong style={{color:T.text}}>£{r.spend.toLocaleString()}</strong></span>
                </div>
                <ProgressBar value={r.shifts} max={24} color={r.role==="RGN"?T.amber:r.role==="RMN"?T.purple:r.role==="HCA"?T.teal:T.blue}/>
              </div>
            ))}
          </div>
        </Card>

        {/* Agency split */}
        <Card>
          <CardHead title="Agency Split (Mar)"/>
          <div style={{padding:"8px 16px 12px"}}>
            {CH_AGENCY_DATA.map((a,i)=>{
              const colors=[T.amber,T.teal,T.purple,T.blue];
              return (
                <div key={a.name} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:12,fontWeight:700,color:T.text}}>{a.name}</span>
                    <span style={{fontSize:12,color:T.muted}}>{a.shifts} shifts · {a.pct}%</span>
                  </div>
                  <ProgressBar value={a.pct} max={100} color={colors[i%colors.length]}/>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Budget tracker */}
        <BudgetTracker careHome="Sunrise Care" budgets={budgets} setBudgets={setBudgets}/>
      </div>

      {/* Upcoming shifts table */}
      <Card>
        <CardHead title="Upcoming Shifts" sub="Next 7 days" action={<Btn small onClick={()=>navigate&&navigate("request")}>Request New</Btn>}/>
        <Table
          headers={["Role","Date","Time","Urgency","Status","Agency","Worker"]}
          rows={mine.sort((a,b)=>a.date.localeCompare(b.date)).map(s=>(
            <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`,background:s.urgency==="urgent"&&s.status!=="filled"?"#fffbeb":"transparent"}}>
              <Td><Badge label={s.role} color={T.purple} bg={T.purpleBg}/></Td>
              <Td>{s.date}</Td>
              <Td style={{color:T.muted,fontSize:12}}>{s.time}</Td>
              <Td><span style={{fontSize:12,color:urgencyColor(s.urgency),fontWeight:600}}><UrgDot u={s.urgency}/>{s.urgency}</span></Td>
              <Td><SBadge s={s.status}/></Td>
              <Td style={{fontSize:12}}>{s.agency||<span style={{color:T.muted}}>Unassigned</span>}</Td>
              <Td style={{fontSize:12}}>{s.worker||<span style={{color:"#94a3b8"}}>Awaiting</span>}</Td>
            </tr>
          ))}
        />
      </Card>

      {/* Notices */}
      <Card>
        <CardHead title="Notices & Updates" icon="📢"/>
        <div style={{padding:"4px 16px 16px",display:"flex",flexDirection:"column",gap:8}}>
          <Alert type="warn">2 unfilled night shifts this week — contact your coordinator.</Alert>
          <Alert type="success">Emma Clarke confirmed for 15 Mar — fully verified and compliant.</Alert>
          <Alert type="info">New HCA compliance requirements take effect April 2026. Review your worker documents.</Alert>
          <Alert type="info">Invoice INV-0021 due in 5 days — £1,560 outstanding.</Alert>
        </div>
      </Card>
    </Page>
  );
};

const INIT_SHIFT_PATTERNS = [
  {id:"sp1", k:"07:00-19:00", l:"Early Day",   s:"07:00", e:"19:00", hrs:12},
  {id:"sp2", k:"19:00-07:00", l:"Night",        s:"19:00", e:"07:00", hrs:12},
  {id:"sp3", k:"08:00-20:00", l:"Late Day",     s:"08:00", e:"20:00", hrs:12},
  {id:"sp4", k:"07:00-13:00", l:"Half Day AM",  s:"07:00", e:"13:00", hrs:6},
  {id:"sp5", k:"13:00-19:00", l:"Half Day PM",  s:"13:00", e:"19:00", hrs:6},
];

const BROADCAST_OPTIONS = [
  {
    key:"bank_first",
    label:"Bank Staff first",
    icon:"🏦",
    desc:"Offer to your internal bank staff for 2 hours. If unclaimed, escalates automatically to Tier 1 agencies.",
    color:T.teal,
    bg:T.tealBg,
    border:"#5eead4",
    tag:"Lowest cost",
    tagColor:T.teal,
  },
  {
    key:"agencies",
    label:"Agencies only",
    icon:"🤝",
    desc:"Broadcast directly to Tier 1 agencies immediately. Bank staff will not be notified.",
    color:T.amber,
    bg:T.amberBg,
    border:"#fcd34d",
    tag:"Standard",
    tagColor:"#b45309",
  },
  {
    key:"both",
    label:"Bank Staff + Agencies simultaneously",
    icon:"⚡",
    desc:"Notify both bank staff and Tier 1 agencies at the same time. Best for urgent shifts.",
    color:T.red,
    bg:T.redBg,
    border:"#fca5a5",
    tag:"Urgent cover",
    tagColor:T.red,
  },
];

/* ─── CARE HOME: REQUEST SHIFT ───────────────────────────────────────────────── */
const RequestShift = ({user, navigate, rateCards, bankRates, shiftPatterns, setShiftPatterns}) => {
  const [mode, setMode] = useState("single");

  /* ── helpers ── */
  const getAgencyRate = (role) => {
    const rc = (rateCards||INIT_RATE_CARDS).find(r=>r.type==="client"&&r.role===role);
    return rc ? rc.weekday : 30;
  };
  const getBankRate = (role) => {
    const br = (bankRates?.global||INIT_BANK_RATES.global).find(r=>r.role===role);
    return br ? br.weekday : 20;
  };
  const getEffectiveRate = (role, broadcast) => {
    if(broadcast==="bank_first") return getBankRate(role);
    return getAgencyRate(role);
  };
  const calcHrs = (s,e) => {
    if(!s||!e) return 12;
    const [sh,sm]=s.split(":").map(Number);
    const [eh,em]=e.split(":").map(Number);
    let d=(eh*60+em)-(sh*60+sm);
    if(d<=0) d+=1440;
    return Math.round(d/60*10)/10;
  };

  /* ── SINGLE STATE ── */
  const [form,setForm]=useState({role:"RGN",date:"",timeStart:"07:00",timeEnd:"19:00",urgency:"normal",notes:"",broadcastTo:"bank_first"});
  const [submitted,setSubmitted]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const selectedBroadcast = BROADCAST_OPTIONS.find(o=>o.key===form.broadcastTo);
  const singleHrs = calcHrs(form.timeStart, form.timeEnd);
  const singleRate = getEffectiveRate(form.role, form.broadcastTo);
  const singleCost = Math.round(singleRate * singleHrs);

  /* ── BULK STATE ── */
  const [bRole,      setBRole]      = useState("RGN");
  const [bPattern,   setBPattern]   = useState("sp1");
  const [bCustomS,   setBCustomS]   = useState("07:00");
  const [bCustomE,   setBCustomE]   = useState("19:00");
  const [bUrgency,   setBUrgency]   = useState("normal");
  const [bBroadcast, setBBroadcast] = useState("bank_first");
  const [bNotes,     setBNotes]     = useState("");
  const [bRows,      setBRows]      = useState([{id:1,date:""},{id:2,date:""},{id:3,date:""}]);
  const [bSubmitted, setBSubmitted] = useState(false);

  /* ── PATTERN EDITOR STATE ── */
  const [showPatternEditor, setShowPatternEditor] = useState(false);
  const [patForm, setPatForm] = useState({l:"",s:"07:00",e:"19:00"});
  const [editPatId, setEditPatId] = useState(null);

  const patterns = shiftPatterns || INIT_SHIFT_PATTERNS;
  const patCfg = patterns.find(p=>p.id===bPattern) || patterns[0];
  const isCustomPat = bPattern==="custom";
  const bStart = isCustomPat ? bCustomS : patCfg?.s||"07:00";
  const bEnd   = isCustomPat ? bCustomE : patCfg?.e||"19:00";
  const bHrs   = isCustomPat ? calcHrs(bCustomS,bCustomE) : (patCfg?.hrs||12);
  const bRate  = getEffectiveRate(bRole, bBroadcast);
  const validBRows = bRows.filter(r=>r.date);
  const bTotalCost = Math.round(validBRows.length * bRate * bHrs);

  const addBRow = () => setBRows(r=>[...r,{id:Date.now(),date:""}]);
  const removeBRow = id => setBRows(r=>r.filter(x=>x.id!==id));
  const setBRowDate = (id,v) => setBRows(r=>r.map(x=>x.id===id?{...x,date:v}:x));

  /* pattern editor actions */
  const openAddPat = () => { setEditPatId(null); setPatForm({l:"",s:"07:00",e:"19:00"}); setShowPatternEditor(true); };
  const openEditPat = (p) => { setEditPatId(p.id); setPatForm({l:p.l,s:p.s,e:p.e}); setShowPatternEditor(true); };
  const savePat = () => {
    const hrs = calcHrs(patForm.s, patForm.e);
    if(editPatId) {
      setShiftPatterns(ps=>ps.map(p=>p.id===editPatId?{...p,...patForm,hrs,k:`${patForm.s}-${patForm.e}`}:p));
    } else {
      const id = `sp${Date.now()}`;
      setShiftPatterns(ps=>[...ps,{id,k:`${patForm.s}-${patForm.e}`,l:patForm.l,s:patForm.s,e:patForm.e,hrs}]);
    }
    setShowPatternEditor(false);
  };
  const deletePat = (id) => {
    setShiftPatterns(ps=>ps.filter(p=>p.id!==id));
    if(bPattern===id) setBPattern(patterns.find(p=>p.id!==id)?.id||"custom");
  };

  const rateLabel = bBroadcast==="bank_first" ? "Bank rate" : "Agency rate";
  const singleRateLabel = form.broadcastTo==="bank_first" ? "Bank rate" : "Agency rate";

  /* ── SUCCESS SCREENS ── */
  if(submitted) return (
    <Page title="Request Submitted" icon="✅">
      <div style={{maxWidth:460,background:T.white,borderRadius:16,border:`1px solid ${T.border}`,padding:40,textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:12}}>✅</div>
        <h2 style={{fontFamily:"Instrument Serif,serif",fontSize:22,marginBottom:8}}>Shift Published</h2>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:20,background:selectedBroadcast.bg,border:`1px solid ${selectedBroadcast.border}`,marginBottom:14}}>
          <span>{selectedBroadcast.icon}</span>
          <span style={{fontSize:12,fontWeight:700,color:selectedBroadcast.color}}>{selectedBroadcast.label}</span>
        </div>
        <p style={{color:T.muted,fontSize:13,lineHeight:1.7,marginBottom:24}}>Your {form.role} shift for {form.date} has been published. Est. cost: <strong>£{singleCost}</strong>.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <Btn onClick={()=>setSubmitted(false)}>Request Another</Btn>
          <Btn variant="secondary" onClick={()=>navigate&&navigate("myshifts")}>View My Shifts</Btn>
        </div>
      </div>
    </Page>
  );

  if(bSubmitted) return (
    <Page title="Bulk Request Submitted" icon="✅">
      <div style={{maxWidth:500,background:T.white,borderRadius:16,border:`1px solid ${T.border}`,padding:40,textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:12}}>✅</div>
        <h2 style={{fontFamily:"Instrument Serif,serif",fontSize:22,marginBottom:8}}>{validBRows.length} Shifts Published</h2>
        <div style={{background:T.amberBg,borderRadius:10,padding:"14px 20px",marginBottom:20}}>
          {validBRows.map(r=>(
            <div key={r.id} style={{fontSize:12,color:T.amberText,display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span>{bRole}</span><span>{r.date} · {bStart}{"–"}{bEnd}</span>
            </div>
          ))}
          <div style={{borderTop:"1px solid #fcd34d",marginTop:10,paddingTop:10,fontWeight:800,fontSize:14,color:T.amberText}}>Total est. £{bTotalCost.toLocaleString()}</div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <Btn onClick={()=>{setBSubmitted(false);setBRows([{id:1,date:""},{id:2,date:""},{id:3,date:""}]);}}>Add More</Btn>
          <Btn variant="secondary" onClick={()=>navigate&&navigate("myshifts")}>View My Shifts</Btn>
        </div>
      </div>
    </Page>
  );

  return (
    <Page title="Request Shifts" sub="Single or bulk shift requests" icon="➕">

      {/* Pattern editor modal */}
      {showPatternEditor && (
        <Modal title={editPatId?"Edit Shift Pattern":"Add Shift Pattern"} onClose={()=>setShowPatternEditor(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Input label="Pattern Name" value={patForm.l} onChange={v=>setPatForm(f=>({...f,l:v}))} placeholder="e.g. Long Day, Twilight…"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Input label="Start Time" type="time" value={patForm.s} onChange={v=>setPatForm(f=>({...f,s:v}))}/>
              <Input label="End Time"   type="time" value={patForm.e} onChange={v=>setPatForm(f=>({...f,e:v}))}/>
            </div>
            <div style={{padding:"10px 14px",borderRadius:8,background:"#f8fafc",border:`1px solid ${T.border}`,fontSize:12,color:T.muted}}>
              Duration: <strong style={{color:T.text}}>{calcHrs(patForm.s,patForm.e)} hours</strong>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={savePat} disabled={!patForm.l||!patForm.s||!patForm.e}>Save Pattern</Btn>
              <Btn variant="secondary" onClick={()=>setShowPatternEditor(false)}>Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Mode toggle */}
      <div style={{display:"flex",gap:0,background:"#f1f5f9",borderRadius:10,padding:4,width:"fit-content",marginBottom:20}}>
        {[{k:"single",l:"Single Shift"},{k:"bulk",l:"Bulk Upload"}].map(m=>(
          <button key={m.k} onClick={()=>setMode(m.k)}
            style={{padding:"8px 22px",borderRadius:8,border:"none",fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",
              background:mode===m.k?T.white:"transparent",color:mode===m.k?T.navy:T.muted,
              boxShadow:mode===m.k?"0 1px 4px rgba(0,0,0,0.1)":"none"}}>
            {m.l}
          </button>
        ))}
      </div>

      {/* ══ SINGLE MODE ══ */}
      {mode==="single" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,maxWidth:860,alignItems:"start"}}>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <Card style={{padding:24}}>
              <h3 style={{fontWeight:700,fontSize:14,marginBottom:18}}>Shift Details</h3>
              <Select label="Role Required" value={form.role} onChange={v=>set("role",v)} options={["RGN","RMN","HCA","Senior Carer","Deputy Manager"]} required/>
              <Input label="Date" type="date" value={form.date} onChange={v=>set("date",v)} required/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <Input label="Start Time" type="time" value={form.timeStart} onChange={v=>set("timeStart",v)}/>
                <Input label="End Time"   type="time" value={form.timeEnd}   onChange={v=>set("timeEnd",v)}/>
              </div>
              <div style={{marginBottom:4}}>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Urgency</label>
                <div style={{display:"flex",gap:8}}>
                  {["normal","high","urgent"].map(u=>(
                    <button key={u} onClick={()=>set("urgency",u)} style={{flex:1,padding:"8px",borderRadius:8,border:`1.5px solid ${form.urgency===u?urgencyColor(u):T.border}`,background:form.urgency===u?"rgba(0,0,0,0.03)":T.white,color:form.urgency===u?urgencyColor(u):T.muted,fontWeight:600,fontSize:12,cursor:"pointer",textTransform:"capitalize",fontFamily:"Syne,sans-serif"}}>
                      <UrgDot u={u}/>{u}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
            <Card style={{padding:24}}>
              <h3 style={{fontWeight:700,fontSize:14,marginBottom:14}}>Notes</h3>
              <textarea value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Specific requirements, access codes…" style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:"Syne,sans-serif",minHeight:90,resize:"vertical",color:T.text,boxSizing:"border-box"}}/>
            </Card>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <Card style={{padding:24}}>
              <h3 style={{fontWeight:700,fontSize:14,marginBottom:4}}>Publish To</h3>
              <p style={{fontSize:12,color:T.muted,marginBottom:16,lineHeight:1.5}}>Choose who receives this shift first.</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {BROADCAST_OPTIONS.map(opt=>{
                  const sel=form.broadcastTo===opt.key;
                  return(
                    <button key={opt.key} onClick={()=>set("broadcastTo",opt.key)}
                      style={{display:"flex",gap:14,alignItems:"flex-start",padding:"14px 16px",borderRadius:12,border:`2px solid ${sel?opt.color:T.border}`,background:sel?opt.bg:T.white,cursor:"pointer",textAlign:"left",fontFamily:"Syne,sans-serif",width:"100%"}}>
                      <div style={{width:36,height:36,borderRadius:10,background:sel?opt.color:T.border+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{opt.icon}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:13,color:sel?opt.color:T.text,marginBottom:3}}>{opt.label}</div>
                        <div style={{fontSize:11,color:T.muted,lineHeight:1.5}}>{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
            <Card style={{padding:24}}>
              <div style={{background:T.amberBg,borderRadius:8,padding:"14px 16px",marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:700,color:T.amberText,marginBottom:4}}>Estimated Cost</div>
                <div style={{fontSize:26,fontWeight:800,color:T.amberText}}>£{singleCost}</div>
                <div style={{fontSize:11,color:T.amberText,marginTop:4,display:"flex",gap:12}}>
                  <span>{singleRateLabel}: £{singleRate}{"/hr"}</span>
                  <span>·</span>
                  <span>{singleHrs}h shift</span>
                </div>
              </div>
              {form.broadcastTo==="bank_first"&&(
                <div style={{padding:"10px 12px",borderRadius:8,background:T.tealBg,border:`1px solid #5eead4`,marginBottom:14,fontSize:11,color:T.teal,lineHeight:1.5}}>
                  🏦 <strong>Bank rate shown.</strong> If unclaimed after 2hrs, agency rate of £{getAgencyRate(form.role)}{"/hr"} applies.
                </div>
              )}
              <Btn full onClick={()=>form.date?setSubmitted(true):alert("Please select a date")}>
                {selectedBroadcast?.icon} Publish Shift →
              </Btn>
            </Card>
          </div>
        </div>
      )}

      {/* ══ BULK MODE ══ */}
      {mode==="bulk" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20,maxWidth:1000,alignItems:"start"}}>

          {/* Left — template + rows */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>

            {/* Template */}
            <Card style={{padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <h3 style={{fontWeight:700,fontSize:14,margin:0}}>Shift Template</h3>
                <span style={{fontSize:12,color:T.muted}}>Applies to all shifts below</span>
              </div>

              {/* Role */}
              <div style={{marginBottom:14}}>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Role</label>
                <select value={bRole} onChange={e=>setBRole(e.target.value)}
                  style={{width:"100%",padding:"9px 10px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:"Syne,sans-serif",outline:"none"}}>
                  {["RGN","RMN","HCA","Senior Carer","Deputy Manager"].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>

              {/* Shift Pattern — with manage link */}
              <div style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <label style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Shift Pattern</label>
                  <button onClick={openAddPat}
                    style={{fontSize:11,fontWeight:700,color:T.blue,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:"Syne,sans-serif"}}>
                    + Add pattern
                  </button>
                </div>

                {/* Pattern pills */}
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                  {patterns.map(p=>{
                    const sel = bPattern===p.id;
                    return (
                      <div key={p.id} style={{display:"flex",alignItems:"center",gap:0,borderRadius:20,border:`1.5px solid ${sel?T.navy:T.border}`,background:sel?T.navy:"#f8fafc",overflow:"hidden"}}>
                        <button onClick={()=>setBPattern(p.id)}
                          style={{padding:"5px 12px",background:"transparent",border:"none",cursor:"pointer",fontSize:12,fontWeight:700,color:sel?T.white:T.text,fontFamily:"Syne,sans-serif"}}>
                          {p.l}
                          <span style={{fontSize:10,fontWeight:400,marginLeft:5,color:sel?"rgba(255,255,255,0.7)":T.muted}}>{p.s}{"–"}{p.e}</span>
                        </button>
                        <button onClick={()=>openEditPat(p)}
                          style={{padding:"5px 7px",background:"transparent",border:"none",borderLeft:`1px solid ${sel?"rgba(255,255,255,0.2)":T.border}`,cursor:"pointer",fontSize:11,color:sel?"rgba(255,255,255,0.7)":T.muted,fontFamily:"Syne,sans-serif"}}>
                          ✎
                        </button>
                        <button onClick={()=>deletePat(p.id)}
                          style={{padding:"5px 7px",background:"transparent",border:"none",borderLeft:`1px solid ${sel?"rgba(255,255,255,0.2)":T.border}`,cursor:"pointer",fontSize:12,color:sel?"rgba(255,255,255,0.7)":T.muted,fontFamily:"Syne,sans-serif"}}>
                          ×
                        </button>
                      </div>
                    );
                  })}
                  {/* Custom option */}
                  <button onClick={()=>setBPattern("custom")}
                    style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${bPattern==="custom"?T.navy:T.border}`,background:bPattern==="custom"?T.navy:"#f8fafc",cursor:"pointer",fontSize:12,fontWeight:700,color:bPattern==="custom"?T.white:T.muted,fontFamily:"Syne,sans-serif"}}>
                    Custom ✎
                  </button>
                </div>

                {/* Custom time inputs */}
                {bPattern==="custom" && (
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:10}}>
                    <Input label="Start Time" type="time" value={bCustomS} onChange={setBCustomS}/>
                    <Input label="End Time"   type="time" value={bCustomE} onChange={setBCustomE}/>
                  </div>
                )}

                {/* Duration indicator */}
                <div style={{fontSize:11,color:T.muted,marginTop:6}}>
                  Duration: <strong style={{color:T.text}}>{bHrs} hours</strong> &nbsp;·&nbsp; {bStart} – {bEnd}
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Urgency</label>
                <div style={{display:"flex",gap:8}}>
                  {["normal","high","urgent"].map(u=>(
                    <button key={u} onClick={()=>setBUrgency(u)} style={{flex:1,padding:"7px",borderRadius:8,border:`1.5px solid ${bUrgency===u?urgencyColor(u):T.border}`,background:bUrgency===u?"rgba(0,0,0,0.03)":T.white,color:bUrgency===u?urgencyColor(u):T.muted,fontWeight:600,fontSize:12,cursor:"pointer",textTransform:"capitalize",fontFamily:"Syne,sans-serif"}}>
                      <UrgDot u={u}/>{u}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Date rows */}
            <Card>
              <CardHead title="Shift Dates" sub={`${validBRows.length} of ${bRows.length} dates filled`}
                action={<Btn small onClick={addBRow}>+ Add Row</Btn>}/>
              <div style={{padding:"8px 16px 16px"}}>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {bRows.map((row)=>(
                    <div key={row.id} style={{display:"grid",gridTemplateColumns:"1fr 36px",gap:10,alignItems:"center"}}>
                      <div style={{position:"relative"}}>
                        <input type="date" value={row.date} onChange={e=>setBRowDate(row.id,e.target.value)}
                          style={{width:"100%",padding:"9px 12px",border:`1.5px solid ${row.date?T.green:T.border}`,borderRadius:8,fontSize:13,fontFamily:"Syne,sans-serif",outline:"none",boxSizing:"border-box",
                            background:row.date?"#f0fdf4":T.white,color:T.text}}/>
                        {row.date && <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:14,color:T.green}}>✓</span>}
                      </div>
                      <button onClick={()=>removeBRow(row.id)} disabled={bRows.length===1}
                        style={{width:34,height:34,borderRadius:7,border:`1.5px solid ${T.border}`,background:"#f8fafc",cursor:bRows.length===1?"not-allowed":"pointer",fontSize:16,color:T.muted,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                    </div>
                  ))}
                </div>
                <button onClick={addBRow}
                  style={{marginTop:12,width:"100%",padding:"9px",borderRadius:8,border:`1.5px dashed ${T.border}`,background:"transparent",cursor:"pointer",fontSize:13,color:T.muted,fontFamily:"Syne,sans-serif",fontWeight:600}}>
                  + Add another date
                </button>
              </div>
            </Card>

            {/* Notes */}
            <Card style={{padding:20}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Notes (applies to all)</label>
              <textarea value={bNotes} onChange={e=>setBNotes(e.target.value)} placeholder="Specific requirements, floor, access codes…"
                style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:"Syne,sans-serif",minHeight:72,resize:"vertical",color:T.text,boxSizing:"border-box"}}/>
            </Card>
          </div>

          {/* Right — summary + broadcast + submit */}
          <div style={{display:"flex",flexDirection:"column",gap:16,position:"sticky",top:16}}>

            {/* Broadcast */}
            <Card style={{padding:20}}>
              <div style={{fontSize:12,fontWeight:700,color:T.muted,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.07em"}}>Publish To</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {BROADCAST_OPTIONS.map(opt=>{
                  const sel=bBroadcast===opt.key;
                  return(
                    <button key={opt.key} onClick={()=>setBBroadcast(opt.key)}
                      style={{display:"flex",gap:10,alignItems:"center",padding:"10px 12px",borderRadius:10,border:`2px solid ${sel?opt.color:T.border}`,background:sel?opt.bg:T.white,cursor:"pointer",textAlign:"left",fontFamily:"Syne,sans-serif",width:"100%"}}>
                      <span style={{fontSize:18}}>{opt.icon}</span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:12,color:sel?opt.color:T.text}}>{opt.label}</div>
                        <div style={{fontSize:10,color:T.muted}}>{opt.tag}</div>
                      </div>
                      <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${sel?opt.color:T.border}`,background:sel?opt.color:"transparent",flexShrink:0}}/>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Live cost summary */}
            <Card style={{padding:20}}>
              <div style={{fontSize:12,fontWeight:700,color:T.muted,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.07em"}}>Cost Summary</div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:13}}>
                <span style={{color:T.muted}}>Shifts</span>
                <span style={{fontWeight:700}}>{validBRows.length}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:13}}>
                <span style={{color:T.muted}}>Hours each</span>
                <span style={{fontWeight:700}}>{bHrs}h</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:13}}>
                <span style={{color:T.muted}}>{rateLabel}</span>
                <span style={{fontWeight:700}}>£{bRate}{"/hr"}</span>
              </div>
              {bBroadcast==="bank_first" && (
                <div style={{fontSize:11,color:T.teal,background:T.tealBg,padding:"6px 10px",borderRadius:7,marginBottom:6,lineHeight:1.5}}>
                  🏦 If escalated to agency: £{getAgencyRate(bRole)}{"/hr"} applies
                </div>
              )}
              <div style={{borderTop:`1px solid ${T.border}`,marginTop:10,paddingTop:12}}>
                <div style={{background:T.amberBg,borderRadius:8,padding:"12px 14px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:T.amberText,marginBottom:4}}>Est. Total</div>
                  <div style={{fontSize:26,fontWeight:800,color:T.amberText}}>£{bTotalCost.toLocaleString()}</div>
                  <div style={{fontSize:10,color:T.amberText,marginTop:3}}>{validBRows.length} &times; {bHrs}h &times; £{bRate}{"/hr"}</div>
                </div>
              </div>
            </Card>

            <Btn full disabled={validBRows.length===0}
              onClick={()=>validBRows.length>0?setBSubmitted(true):null}
              style={{opacity:validBRows.length===0?0.5:1,fontSize:14,padding:"13px"}}>
              Publish {validBRows.length>0?validBRows.length:""} Shift{validBRows.length!==1?"s":""} {"→"}
            </Btn>
            {validBRows.length===0 && <div style={{fontSize:11,color:T.muted,textAlign:"center",marginTop:-8}}>Add at least one date to continue</div>}
          </div>
        </div>
      )}
    </Page>
  );
};

/* ─── CARE HOME: MY SHIFTS (with Tier Push) ──────────────────────────────────── */
const CareHomeMyShifts = ({user}) => {
  const today = "2026-03-10";
  const allShifts = SHIFTS.filter(s=>s.carehome==="Sunrise Care");
  const [tab,       setTab]       = useState("unfilled");
  const [tierModal, setTierModal] = useState(null);
  const [newTier,   setNewTier]   = useState("Tier 2");
  const [pushed,    setPushed]    = useState({});

  const canPush = s => s.status==="open"||s.status==="pending";

  const tabDefs = [
    {k:"unfilled", l:"Unfilled", count: allShifts.filter(s=>(s.status==="open"||s.status==="pending")&&s.date>=today).length, color:T.red},
    {k:"filled",   l:"Filled",   count: allShifts.filter(s=>s.status==="filled").length, color:T.green},
    {k:"expired",  l:"Expired",  count: allShifts.filter(s=>s.date<today&&s.status!=="filled").length, color:T.muted},
  ];

  const visibleShifts = allShifts.filter(s=>{
    if(tab==="unfilled") return (s.status==="open"||s.status==="pending") && s.date>=today;
    if(tab==="filled")   return s.status==="filled";
    if(tab==="expired")  return s.date<today && s.status!=="filled";
    return true;
  }).sort((a,b)=>a.date.localeCompare(b.date));

  const doPush = () => {
    const note = newTier==="Tier 1" ? "Pushed to Tier 1 — Priority agencies notified immediately."
      : newTier==="Tier 2" ? "Pushed to Tier 2 — Secondary agencies notified. Tier 1 window bypassed."
      : "Pushed to Tier 3 — All agency tiers now notified.";
    setPushed(p=>({...p,[tierModal.id]:{tier:newTier,note}}));
    setTierModal(null);
  };

  const TIERS = [
    {v:"Tier 1",desc:"Priority agencies — notified immediately.",delay:"Immediate"},
    {v:"Tier 2",desc:"Secondary agencies — bypasses the Tier 1 window and notifies Tier 2 now.",delay:"Now (bypass Tier 1 wait)"},
    {v:"Tier 3",desc:"All agencies — opens the shift to every tier simultaneously.",delay:"Now (all tiers)"},
  ];

  return (
    <Page title="My Shifts" sub="Sunrise Care" icon="📋">
      {tierModal && (
        <Modal title="Push Shift to Different Tier" onClose={()=>setTierModal(null)}>
          <div style={{padding:"12px 16px",background:"#f8fafc",borderRadius:10,marginBottom:16,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:11,color:T.muted,fontWeight:600,marginBottom:4}}>SHIFT</div>
            <div style={{fontWeight:800,fontSize:15}}>{tierModal.role} — {tierModal.date}</div>
            <div style={{fontSize:12,color:T.muted}}>{tierModal.time} · {tierModal.carehome}</div>
            <div style={{marginTop:8,display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:12,color:T.muted}}>Currently broadcasting to:</span>
              <Badge label={pushed[tierModal.id]?.tier||"Tier 1"} color={tierColor(pushed[tierModal.id]?.tier||"Tier 1")} bg={tierBg(pushed[tierModal.id]?.tier||"Tier 1")}/>
            </div>
          </div>
          <Alert type="warning">Pushing to a different tier will notify those agencies immediately. This cannot be undone.</Alert>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Push to which tier?</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {TIERS.map(opt=>{
                const isActive=newTier===opt.v; const col=tierColor(opt.v); const bg=tierBg(opt.v);
                return (
                  <label key={opt.v} onClick={()=>setNewTier(opt.v)}
                    style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",borderRadius:9,border:`1.5px solid ${isActive?col:T.border}`,background:isActive?bg:"#fafafa",cursor:"pointer"}}>
                    <input type="radio" checked={isActive} onChange={()=>setNewTier(opt.v)} style={{marginTop:3,accentColor:col}}/>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                        <span style={{fontWeight:800,fontSize:13,color:isActive?col:T.text}}>{opt.v}</span>
                        <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:20,background:isActive?col+"22":"#f1f5f9",color:isActive?col:T.muted}}>{opt.delay}</span>
                      </div>
                      <div style={{fontSize:12,color:T.muted,lineHeight:1.5}}>{opt.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={doPush}>Push to {newTier}</Btn>
            <Btn variant="secondary" onClick={()=>setTierModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Stats */}
      <Grid cols={4}>
        <Stat label="Total Shifts" value={allShifts.length}/>
        <Stat label="Filled" value={allShifts.filter(s=>s.status==="filled").length} accent/>
        <Stat label="Unfilled" value={allShifts.filter(s=>canPush(s)&&s.date>=today).length} sub="Needs cover"/>
        <Stat label="Tier Pushes" value={Object.keys(pushed).length} sub="This session"/>
      </Grid>

      {/* Tabs */}
      <div style={{display:"flex",gap:0,background:"#f1f5f9",borderRadius:10,padding:4,width:"fit-content",marginBottom:4}}>
        {tabDefs.map(t=>{
          const active = tab===t.k;
          return (
            <button key={t.k} onClick={()=>setTab(t.k)}
              style={{padding:"7px 18px",borderRadius:8,border:"none",fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",
                background:active?T.white:"transparent",color:active?T.navy:T.muted,
                boxShadow:active?"0 1px 4px rgba(0,0,0,0.1)":"none",display:"flex",alignItems:"center",gap:7}}>
              {t.l}
              <span style={{fontSize:11,fontWeight:700,padding:"2px 7px",borderRadius:20,
                background:active?t.color+"18":"transparent",color:active?t.color:T.muted}}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      <Card>
        <CardHead
          title={tabDefs.find(t=>t.k===tab)?.l + " Shifts"}
          sub={tab==="unfilled"?"Open shifts can be pushed to a different agency tier":tab==="filled"?"Shifts with confirmed workers":"Shifts that passed without being filled"}
        />
        {visibleShifts.length===0
          ? <div style={{padding:40,textAlign:"center",color:T.muted,fontSize:13}}>No {tab} shifts found.</div>
          : <Table
              headers={tab==="expired"
                ? ["Role","Date","Time","Urgency","Status","Notes"]
                : ["Role","Date","Time","Urgency","Status","Agency","Worker","Tier Broadcast","Actions"]}
              rows={visibleShifts.map(s=>{
                const pushInfo=pushed[s.id];
                return (
                  <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`,background:s.urgency==="urgent"&&tab==="unfilled"?"#fffbeb":"transparent"}}>
                    <Td><Badge label={s.role} color={T.purple} bg={T.purpleBg}/></Td>
                    <Td bold>{s.date}</Td>
                    <Td style={{color:T.muted,fontSize:12}}>{s.time}</Td>
                    <Td><span style={{fontSize:12,color:urgencyColor(s.urgency),fontWeight:600}}><UrgDot u={s.urgency}/>{s.urgency}</span></Td>
                    <Td><SBadge s={s.status}/></Td>
                    {tab==="expired"
                      ? <Td style={{fontSize:12,color:T.muted}}>{s.notes||"—"}</Td>
                      : <>
                          <Td>{s.agency||<span style={{color:T.muted,fontSize:12}}>Awaiting</span>}</Td>
                          <Td>{s.worker||<span style={{color:"#94a3b8",fontSize:12}}>TBC</span>}</Td>
                          <Td>
                            {pushInfo
                              ? <div><Badge label={pushInfo.tier} color={tierColor(pushInfo.tier)} bg={tierBg(pushInfo.tier)}/><div style={{fontSize:10,color:T.muted,marginTop:3}}>Pushed ✓</div></div>
                              : <Badge label="Tier 1" color={tierColor("Tier 1")} bg={tierBg("Tier 1")}/>}
                          </Td>
                          <Td>
                            {canPush(s)
                              ? <Btn small onClick={()=>{setTierModal(s);setNewTier("Tier 2");}}>Push Tier ↑</Btn>
                              : <span style={{fontSize:11,color:T.muted}}>—</span>}
                          </Td>
                        </>
                    }
                  </tr>
                );
              })}
            />
        }
      </Card>
    </Page>
  );
};

const CareHomeCalendar = () => {
  const [viewDate, setViewDate] = useState({year:2026, month:2}); // 0-indexed month
  const mine = SHIFTS.filter(s=>s.carehome==="Sunrise Care");
  const [selectedDay, setSelectedDay] = useState(null);

  const today = {year:2026, month:2, day:10}; // March 10 2026
  const dayNames = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const {year, month} = viewDate;
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  // Convert Sun-based to Mon-based offset
  const startOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();

  const prevMonth = () => setViewDate(v => v.month===0?{year:v.year-1,month:11}:{year:v.year,month:v.month-1});
  const nextMonth = () => setViewDate(v => v.month===11?{year:v.year+1,month:0}:{year:v.year,month:v.month+1});

  // Build grid: 6 rows × 7 cols
  const cells = [];
  for(let i=0; i<startOffset; i++) cells.push({day:daysInPrev-startOffset+1+i, cur:false});
  for(let d=1; d<=daysInMonth; d++) cells.push({day:d, cur:true});
  while(cells.length<42) cells.push({day:cells.length-startOffset-daysInMonth+1, cur:false});

  const padDay = d => String(d).padStart(2,"0");
  const shiftsOn = (d) => {
    if(!viewDate) return [];
    const dateStr = `${year}-${padDay(month+1)}-${padDay(d)}`;
    return mine.filter(s=>s.date===dateStr);
  };

  const isToday = (d) => d===today.day && month===today.month && year===today.year;

  const selectedShifts = selectedDay ? shiftsOn(selectedDay) : [];

  // Month totals
  const monthShifts = mine.filter(s=>s.date.startsWith(`${year}-${padDay(month+1)}`));
  const filled  = monthShifts.filter(s=>s.status==="filled").length;
  const pending = monthShifts.filter(s=>s.status==="pending").length;
  const open    = monthShifts.filter(s=>s.status==="open").length;

  return (
    <Page title="Shift Calendar" sub={`${monthNames[month]} ${year}`} icon="📅">
      {/* Controls */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Btn small variant="secondary" onClick={prevMonth}>← Prev</Btn>
          <span style={{fontWeight:800,fontSize:16,color:T.navy,minWidth:160,textAlign:"center"}}>{monthNames[month]} {year}</span>
          <Btn small variant="secondary" onClick={nextMonth}>Next →</Btn>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Badge label={`${filled} Filled`} color={T.green} bg={T.greenBg} dot/>
          <Badge label={`${pending} Pending`} color={T.yellow} bg={T.yellowBg} dot/>
          <Badge label={`${open} Open`} color={T.blue} bg={T.blueBg} dot/>
          <Badge label={`${monthShifts.length} Total`} color={T.muted} bg="#f1f5f9"/>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr",gap:14}}>
        <Card style={{overflow:"hidden"}}>
          {/* Day headers */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:`2px solid ${T.border}`}}>
            {dayNames.map((d,i)=>(
              <div key={i} style={{padding:"10px 6px",textAlign:"center",fontSize:11,fontWeight:700,color:i>=5?T.purple:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",background:"#f8fafc",borderRight:i<6?`1px solid ${T.border}`:"none"}}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
            {cells.map((cell,i)=>{
              const col = i%7;
              const isLast = i>=35;
              const shifts = cell.cur ? shiftsOn(cell.day) : [];
              const isSelected = cell.cur && selectedDay===cell.day;
              const isTod = cell.cur && isToday(cell.day);
              return (
                <div
                  key={i}
                  onClick={()=>cell.cur&&setSelectedDay(selectedDay===cell.day?null:cell.day)}
                  style={{
                    minHeight:96,
                    padding:"6px 8px",
                    borderRight:col<6?`1px solid ${T.border}`:"none",
                    borderBottom:!isLast?`1px solid ${T.border}`:"none",
                    background:isSelected?"#eff6ff":isTod?"#fffbeb":!cell.cur?"#f9fafb":T.white,
                    cursor:cell.cur?"pointer":"default",
                    transition:"background 0.1s",
                  }}>
                  <div style={{
                    fontSize:12,fontWeight:isTod?800:cell.cur?500:400,
                    color:isTod?T.amber:cell.cur?T.text:"#cbd5e1",
                    marginBottom:5,display:"flex",alignItems:"center",gap:4,
                  }}>
                    {isTod
                      ? <span style={{width:22,height:22,borderRadius:"50%",background:T.amber,color:T.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800}}>{cell.day}</span>
                      : cell.day}
                  </div>
                  {shifts.slice(0,3).map(s=>(
                    <div key={s.id} style={{
                      background:s.status==="filled"?T.greenBg:s.status==="pending"?T.yellowBg:T.blueBg,
                      borderLeft:`3px solid ${s.status==="filled"?T.green:s.status==="pending"?T.yellow:T.blue}`,
                      borderRadius:"0 4px 4px 0",padding:"2px 5px",marginBottom:3,
                      fontSize:9,fontWeight:700,
                      color:s.status==="filled"?T.green:s.status==="pending"?T.yellow:T.blue,
                      whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
                    }}>
                      {s.time.split("–")[0]} {s.role}
                    </div>
                  ))}
                  {shifts.length>3&&(
                    <div style={{fontSize:9,color:T.muted,fontWeight:600}}>+{shifts.length-3} more</div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Day detail panel */}
        {selectedDay && (
          <Card style={{padding:18}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{fontWeight:800,fontSize:15}}>{monthNames[month]} {selectedDay}, {year}</h3>
              <Btn small variant="secondary" onClick={()=>setSelectedDay(null)}>✕ Close</Btn>
            </div>
            {selectedShifts.length===0
              ? <p style={{color:T.muted,fontSize:13}}>No shifts on this day.</p>
              : <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {selectedShifts.map(s=>(
                    <div key={s.id} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",borderRadius:10,border:`1.5px solid ${s.status==="filled"?T.green+"44":s.status==="pending"?T.yellow+"44":T.blue+"44"}`,background:s.status==="filled"?T.greenBg:s.status==="pending"?T.yellowBg:T.blueBg}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                          <Badge label={s.role} color={T.purple} bg={T.purpleBg}/>
                          <SBadge s={s.status}/>
                        </div>
                        <div style={{fontSize:13,fontWeight:600,color:T.text}}>{s.time}</div>
                        <div style={{fontSize:12,color:T.muted,marginTop:2}}>{s.agency||"Unassigned"}{s.worker?` · ${s.worker}`:""}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontWeight:800,fontSize:15,color:T.navy}}>£{s.rate}{"/hr"}</div>
                        <div style={{fontSize:11,color:T.muted}}>Est. £{s.rate*12}{"/shift"}</div>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </Card>
        )}
      </div>
    </Page>
  );
};

const CareHomeInvoices = () => {
  const [viewInv, setViewInv] = useState(null);
  const myInvoices = INVOICES.filter(i=>["First Choice","ProCare"].includes(i.agency));
  return (
  <Page title="Invoices" sub="Your billing history from Nexus RPO" icon="📄">
    {viewInv && (
      <Modal title={`Invoice ${viewInv.id}`} onClose={()=>setViewInv(null)}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          {[["Agency",viewInv.agency],["Period",viewInv.period],["Shifts",viewInv.shifts],["Amount",`£${viewInv.amount?.toLocaleString()}`],["Issued",viewInv.issued||"—"],["Due",viewInv.due]].map(([k,v])=>(
            <div key={k} style={{background:"#f8fafc",borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:11,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{k}</div>
              <div style={{fontSize:13,fontWeight:600}}>{v}</div>
            </div>
          ))}
        </div>
        <SBadge s={viewInv.status}/>
        <div style={{display:"flex",gap:8,marginTop:14}}>
          <Btn onClick={()=>exportHTML(`Invoice ${viewInv.id}`,`${viewInv.agency} · ${viewInv.period}`,buildTable(["Invoice","Agency","Period","Shifts","Amount","Due","Status"],[[viewInv.id,viewInv.agency,viewInv.period,viewInv.shifts,`£${viewInv.amount?.toLocaleString()}`,viewInv.due,viewInv.status.toUpperCase()]]))}>Download PDF</Btn>
          <Btn variant="secondary" onClick={()=>setViewInv(null)}>Close</Btn>
        </div>
      </Modal>
    )}
    <Alert type="info">Invoices are generated automatically at the end of each billing period. Contact your coordinator for queries.</Alert>
    <Card>
      <Table
        headers={["Invoice","Period","Shifts Used","Amount","Due Date","Status","Action"]}
        rows={myInvoices.map(inv=>(
          <tr key={inv.id} style={{borderBottom:`1px solid ${T.border}`}}>
            <Td><span style={{fontFamily:"monospace",fontSize:12,fontWeight:700}}>{inv.id}</span></Td>
            <Td>{inv.period}</Td>
            <Td>{inv.shifts}</Td>
            <Td bold>£{inv.amount.toLocaleString()}</Td>
            <Td>{inv.due}</Td>
            <Td><SBadge s={inv.status}/></Td>
            <Td>
              <div style={{display:"flex",gap:5}}>
                <Btn small variant="secondary" onClick={()=>setViewInv(inv)}>View</Btn>
                <Btn small variant="secondary" onClick={()=>exportHTML(`Invoice ${inv.id}`,`${inv.agency} · ${inv.period}`,buildTable(["Invoice","Period","Amount","Due","Status"],[[inv.id,inv.period,`£${inv.amount.toLocaleString()}`,inv.due,inv.status.toUpperCase()]]))}>Download PDF</Btn>
              </div>
            </Td>
          </tr>
        ))}
      />
    </Card>
  </Page>
  );
};

const CareHomeWorkers = () => (
  <Page title="Worker Profiles" sub="Verified workers who have been placed with you" icon="👥">
    <Card>
      <Table
        headers={["Worker","Role","Agency","DBS","NMC/PIN","Last Placed","Compliance"]}
        rows={WORKERS.filter(w=>w.compliance>=80).map(w=>(
          <tr key={w.id} style={{borderBottom:`1px solid ${T.border}`}}>
            <Td bold>{w.name}</Td>
            <Td><Badge label={w.role} color={T.purple} bg={T.purpleBg}/></Td>
            <Td><span style={{fontSize:12,color:T.muted}}>{w.agency}</span></Td>
            <Td><SBadge s={w.dbs}/></Td>
            <Td>{w.pin?<Badge label="✓ Verified" color={T.green} bg={T.greenBg}/>:<Badge label="N/A" color={T.muted} bg="#f1f5f9"/>}</Td>
            <Td>{SHIFTS.find(s=>s.worker===w.name)?.date||"—"}</Td>
            <Td>
              <div style={{display:"flex",alignItems:"center",gap:8,minWidth:80}}>
                <ProgressBar value={w.compliance} color={T.green}/>
                <span style={{fontSize:11,fontWeight:700,color:T.green}}>{w.compliance}%</span>
              </div>
            </Td>
          </tr>
        ))}
      />
    </Card>
  </Page>
);

/* ─── AGENCY VIEWS ───────────────────────────────────────────────────────────── */
const AgencyDashboard = ({user, navigate}) => {
  const myShifts = SHIFTS.filter(s=>s.agency==="First Choice");
  const [claimed, setClaimed] = useState([]);
  const [claimModal, setClaimModal] = useState(null);
  return (
    <Page title={`Hello, ${user.name.split(" ")[0]}`} sub="First Choice Nursing — Your dashboard" icon="◈">
      {claimModal && (
        <Modal title={`Claim Shift — ${claimModal.carehome}`} onClose={()=>setClaimModal(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[["Role",claimModal.role],["Date",claimModal.date],["Time",claimModal.time],["Rate",`£${claimModal.rate}{"/hr"}`],["Urgency",claimModal.urgency],["Care Home",claimModal.carehome]].map(([k,v])=>(
              <div key={k} style={{background:"#f8fafc",borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:11,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{k}</div>
                <div style={{fontSize:13,fontWeight:600,textTransform:"capitalize"}}>{v}</div>
              </div>
            ))}
          </div>
          <Select label="Assign Worker" value="" onChange={()=>{}} options={WORKERS.filter(w=>w.agency==="First Choice"&&w.role===claimModal.role&&w.compliance>=80).map(w=>w.name)}/>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <Btn onClick={()=>{setClaimed(c=>[...c,claimModal.id]);setClaimModal(null);}}>Confirm Claim →</Btn>
            <Btn variant="secondary" onClick={()=>setClaimModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
      <Grid cols={4}>
        <Stat label="Available Shifts" value={SHIFTS.filter(s=>s.status==="open").length} sub="Broadcast now" accent/>
        <Stat label="Filled (MTD)" value={myShifts.filter(s=>s.status==="filled").length} trend="94% fill rate" trendUp={true}/>
        <Stat label="Workers on Platform" value={WORKERS.filter(w=>w.agency==="First Choice").length} sub="All active"/>
        <Stat label="Compliance Score" value="98%" trend="↑ 2% this month" trendUp={true}/>
      </Grid>
      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:18}}>
        <Card>
          <CardHead title="New Shift Broadcasts" action={<Badge label={`${SHIFTS.filter(s=>s.status==="open").length} new`} color={T.blue} bg={T.blueBg} dot/>}/>
          <Table
            headers={["Care Home","Role","Date","Time","Rate","Urgency","Action"]}
            rows={SHIFTS.filter(s=>s.status==="open").map(s=>(
              <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`}}>
                <Td bold>{s.carehome}</Td>
                <Td><Badge label={s.role} color={T.purple} bg={T.purpleBg}/></Td>
                <Td>{s.date}</Td>
                <Td>{s.time}</Td>
                <Td bold>£{s.rate}{"/hr"}</Td>
                <Td><span style={{fontSize:12,color:urgencyColor(s.urgency)}}><UrgDot u={s.urgency}/>{s.urgency}</span></Td>
                <Td>{claimed.includes(s.id)?<Badge label="✓ Claimed" color={T.green} bg={T.greenBg}/>:<Btn small onClick={()=>setClaimModal(s)}>Claim</Btn>}</Td>
              </tr>
            ))}
          />
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <CardHead title="My Performance" icon="⭐"/>
            <div style={{padding:14}}>
              {[["Fill Rate","94%",T.green],["Avg Response","18 min",T.blue],["Tier Status","Tier 1",tierColor("Tier 1")],["Compliance","98%",T.green]].map(([k,v,c])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}>
                  <span style={{color:T.muted}}>{k}</span>
                  <span style={{fontWeight:700,color:c}}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHead title="Compliance Alerts" icon="⚠️"/>
            <div style={{padding:12}}>
              {WORKERS.filter(w=>w.agency==="First Choice"&&w.compliance<90).map(w=>(
                <div key={w.id} style={{background:T.yellowBg,borderRadius:7,padding:"8px 10px",marginBottom:7,fontSize:12,borderLeft:`3px solid ${T.yellow}`}}>
                  <div style={{fontWeight:700,color:T.yellow}}>{w.name}</div>
                  <div style={{color:T.muted,marginTop:2}}>{w.dbs==="expiring"?"DBS expiring soon":w.training!=="valid"?"Training needs renewal":"Review needed"}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};

const AvailableShifts = () => {
  const [claimed,  setClaimed]  = useState([]);
  const [modal,    setModal]    = useState(null);
  const [filterGroup,  setFilterGroup]  = useState("all");
  const [filterHome,   setFilterHome]   = useState("all");
  const [filterRole,   setFilterRole]   = useState("all");
  const [filterDate,   setFilterDate]   = useState("");
  const [filterUrgency,setFilterUrgency]= useState("all");

  const available = SHIFTS.filter(s => s.status === "open");

  // Build group → locations map from INIT_CLIENT_GROUPS
  const groups = INIT_CLIENT_GROUPS;
  const groupForHome = (homeName) => groups.find(g => g.locations.some(l => l.name === homeName));

  // Derive unique homes scoped to selected group
  const homesInGroup = filterGroup === "all"
    ? [...new Set(available.map(s => s.carehome))]
    : (groups.find(g => g.id === filterGroup)?.locations.map(l => l.name) || [])
        .filter(name => available.some(s => s.carehome === name));

  // Apply all filters
  const filtered = available.filter(s => {
    if (filterGroup !== "all") {
      const grp = groupForHome(s.carehome);
      if (!grp || grp.id !== filterGroup) return false;
    }
    if (filterHome    !== "all" && s.carehome !== filterHome)  return false;
    if (filterRole    !== "all" && s.role     !== filterRole)  return false;
    if (filterUrgency !== "all" && s.urgency  !== filterUrgency) return false;
    if (filterDate    && s.date !== filterDate) return false;
    return true;
  });

  const urgent = filtered.filter(s => s.urgency === "urgent").length;
  const roles  = [...new Set(available.map(s => s.role))];

  const resetFilters = () => { setFilterGroup("all"); setFilterHome("all"); setFilterRole("all"); setFilterDate(""); setFilterUrgency("all"); };
  const hasFilters = filterGroup !== "all" || filterHome !== "all" || filterRole !== "all" || filterDate || filterUrgency !== "all";

  const selStyle = (active) => ({
    padding:"8px 12px", border:`1.5px solid ${active?T.amber:T.border}`,
    borderRadius:8, fontSize:12, fontFamily:"Syne,sans-serif",
    color:T.text, background:active?T.amberBg:T.white, cursor:"pointer",
    fontWeight:active?700:400, outline:"none", minWidth:0,
  });

  return (
    <Page title="Available Shifts" sub="Shifts broadcast to First Choice Nursing by Nexus RPO" icon="📋">
      {modal && (
        <Modal title={`Submit Worker — ${modal.carehome} (${modal.role})`} onClose={()=>setModal(null)}>
          <p style={{fontSize:13,color:T.muted,marginBottom:14}}>Select a compliant worker to submit for this shift.</p>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
            {WORKERS.filter(w=>w.agency==="First Choice"&&w.compliance>=80&&(w.role===modal.role||w.role==="RGN")).map(w=>(
              <button key={w.id} onClick={()=>{setClaimed(c=>[...c,modal.id]);setModal(null);}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",borderRadius:9,border:`1.5px solid ${T.border}`,background:T.white,cursor:"pointer",fontFamily:"Syne,sans-serif",textAlign:"left"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:13,color:T.text}}>{w.name}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:2}}>{w.role} · Compliance: {w.compliance}% · {w.available?"Available":"Currently placed"}</div>
                </div>
                <Badge label={`${w.compliance}%`} color={w.compliance>=95?T.green:T.yellow} bg={w.compliance>=95?T.greenBg:T.yellowBg}/>
              </button>
            ))}
          </div>
          <Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn>
        </Modal>
      )}

      {urgent > 0 && (
        <Alert type="error">🚨 {urgent} urgent shift{urgent>1?"s need":"needs"} immediate filling. Respond within 30 minutes to maintain Tier 1 status.</Alert>
      )}

      {/* ── Filter bar ──────────────────────────────────────────────────────── */}
      <Card style={{padding:"14px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto auto auto",gap:10,alignItems:"end"}}>

          {/* Group owner */}
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Group Owner</label>
            <select value={filterGroup} onChange={e=>{setFilterGroup(e.target.value);setFilterHome("all");}} style={selStyle(filterGroup!=="all")}>
              <option value="all">All Groups</option>
              {groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>

          {/* Care home — scoped to group */}
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Care Home</label>
            <select value={filterHome} onChange={e=>setFilterHome(e.target.value)} style={selStyle(filterHome!=="all")} disabled={homesInGroup.length===0}>
              <option value="all">{filterGroup==="all"?"All Homes":"All in Group"}</option>
              {homesInGroup.map(h=><option key={h} value={h}>{h}</option>)}
            </select>
          </div>

          {/* Role */}
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Role</label>
            <select value={filterRole} onChange={e=>setFilterRole(e.target.value)} style={selStyle(filterRole!=="all")}>
              <option value="all">All Roles</option>
              {roles.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Date */}
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Date</label>
            <input type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)} style={{...selStyle(!!filterDate),padding:"7px 10px"}}/>
          </div>

          {/* Urgency */}
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Urgency</label>
            <select value={filterUrgency} onChange={e=>setFilterUrgency(e.target.value)} style={selStyle(filterUrgency!=="all")}>
              <option value="all">Any</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          {/* Reset */}
          <div style={{paddingBottom:1}}>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:"transparent",marginBottom:5}}>_</label>
            <button onClick={resetFilters} disabled={!hasFilters}
              style={{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${hasFilters?T.red:T.border}`,background:hasFilters?T.redBg:"transparent",color:hasFilters?T.red:T.muted,fontSize:12,fontWeight:700,cursor:hasFilters?"pointer":"default",fontFamily:"Syne,sans-serif"}}>
              {hasFilters?"✕ Clear":"Filters"}
            </button>
          </div>
        </div>

        {/* Active filter pills */}
        {hasFilters && (
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`}}>
            {filterGroup!=="all"&&<span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:T.amberBg,color:T.amberText}}>Group: {groups.find(g=>g.id===filterGroup)?.name}</span>}
            {filterHome!=="all"&&<span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:T.amberBg,color:T.amberText}}>Home: {filterHome}</span>}
            {filterRole!=="all"&&<span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:T.purpleBg,color:T.purple}}>Role: {filterRole}</span>}
            {filterDate&&<span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:"#dbeafe",color:T.blue}}>Date: {filterDate}</span>}
            {filterUrgency!=="all"&&<span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:T.redBg,color:T.red,textTransform:"capitalize"}}>Urgency: {filterUrgency}</span>}
            <span style={{fontSize:11,color:T.muted,padding:"3px 6px"}}>{filtered.length} shift{filtered.length!==1?"s":""} shown</span>
          </div>
        )}
      </Card>

      {/* ── Results table ────────────────────────────────────────────────────── */}
      <Card>
        <Table
          headers={["","Group","Care Home","Role","Date","Time","Rate/hr","Est. Pay","Urgency","Action"]}
          empty="No shifts match the current filters"
          rows={filtered.map(s => {
            const isClaimed = claimed.includes(s.id);
            const grp = groupForHome(s.carehome);
            const hrs = 12;
            return (
              <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`,background:s.urgency==="urgent"?"#fff9f9":"transparent"}}>
                <Td><UrgDot u={s.urgency}/></Td>
                <Td><span style={{fontSize:11,color:T.muted,fontWeight:600}}>{grp?.name||"—"}</span></Td>
                <Td bold>{s.carehome}</Td>
                <Td><Badge label={s.role} color={T.purple} bg={T.purpleBg}/></Td>
                <Td>{s.date}</Td>
                <Td>{s.time}</Td>
                <Td bold>£{s.rate}</Td>
                <Td><span style={{fontWeight:700,color:T.green}}>£{s.rate*hrs}</span></Td>
                <Td><span style={{fontSize:12,color:urgencyColor(s.urgency),display:"flex",alignItems:"center",gap:4}}><UrgDot u={s.urgency}/>{s.urgency}</span></Td>
                <Td>
                  {isClaimed
                    ? <Badge label="Submitted ✓" color={T.green} bg={T.greenBg} dot/>
                    : <Btn small onClick={()=>setModal(s)}>Submit Worker</Btn>}
                </Td>
              </tr>
            );
          })}
        />
      </Card>
    </Page>
  );
};

const AgencyWorkers = ({navigate}) => {
  const mine = WORKERS.filter(w=>w.agency==="First Choice");
  const [editModal,setEditModal] = useState(null);
  const [editForm,setEditForm] = useState({});
  const openEdit = (w) => { setEditForm({...w}); setEditModal(w); };
  return (
    <Page title="My Workers" sub="Compliance status for all First Choice Nursing staff" icon="👥">
      {editModal && (
        <Modal title={`Edit Worker — ${editModal.name}`} onClose={()=>setEditModal(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Full Name" value={editForm.name} onChange={v=>setEditForm(f=>({...f,name:v}))}/>
            <Input label="Email" value={editForm.email} onChange={v=>setEditForm(f=>({...f,email:v}))}/>
            <Input label="Phone" value={editForm.phone} onChange={v=>setEditForm(f=>({...f,phone:v}))}/>
            <Select label="Role" value={editForm.role} onChange={v=>setEditForm(f=>({...f,role:v}))} options={["RGN","RMN","HCA","Senior Carer","Deputy Manager"]}/>
            <Input label="DBS Expiry" type="date" value={editForm.dbsExpiry} onChange={v=>setEditForm(f=>({...f,dbsExpiry:v}))}/>
            <Input label="Training Expiry" type="date" value={editForm.trainingExpiry} onChange={v=>setEditForm(f=>({...f,trainingExpiry:v}))}/>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16}}>
            <Btn onClick={()=>setEditModal(null)}>Save Changes</Btn>
            <Btn variant="secondary" onClick={()=>setEditModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
      <Grid cols={3}>
        <Stat label="Total Workers" value={mine.length} accent/>
        <Stat label="Fully Compliant" value={mine.filter(w=>w.compliance>=95).length}/>
        <Stat label="Needs Attention" value={mine.filter(w=>w.compliance<80).length}/>
      </Grid>
      <Card>
        <Table
          headers={["Name","Role","DBS","Exp.","Training","Exp.","PIN","Score","Available","Actions"]}
          rows={mine.map(w=>(
            <tr key={w.id} style={{borderBottom:`1px solid ${T.border}`}}>
              <Td bold>{w.name}</Td>
              <Td><Badge label={w.role} color={T.purple} bg={T.purpleBg}/></Td>
              <Td><SBadge s={w.dbs}/></Td>
              <Td><span style={{fontSize:11,color:w.dbs==="expiring"?T.red:T.muted}}>{w.dbsExpiry}</span></Td>
              <Td><SBadge s={w.training}/></Td>
              <Td><span style={{fontSize:11,color:w.training!=="valid"?T.red:T.muted}}>{w.trainingExpiry}</span></Td>
              <Td>{w.pin?<Badge label="✓" color={T.green} bg={T.greenBg}/>:<Badge label="✗" color={T.red} bg={T.redBg}/>}</Td>
              <Td>
                <div style={{display:"flex",alignItems:"center",gap:6,minWidth:70}}>
                  <ProgressBar value={w.compliance} color={w.compliance>=95?T.green:w.compliance>=75?T.yellow:T.red}/>
                  <span style={{fontSize:11,fontWeight:700,color:w.compliance>=95?T.green:w.compliance>=75?T.yellow:T.red}}>{w.compliance}%</span>
                </div>
              </Td>
              <Td>{w.available?<Badge label="Available" color={T.green} bg={T.greenBg}/>:<Badge label="On Shift" color={T.muted} bg="#f1f5f9"/>}</Td>
              <Td>
                <div style={{display:"flex",gap:4}}>
                  <Btn small variant="secondary" onClick={()=>navigate&&navigate("documents")}>Docs</Btn>
                  <Btn small variant="secondary" onClick={()=>openEdit(w)}>Edit</Btn>
                </div>
              </Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};

const WorkerOnboarding = ({navigate}) => {
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({firstName:"",lastName:"",email:"",phone:"",role:"RGN",pin:"",dob:"",address:"",dbsDate:"",trainingDate:"",notes:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const steps = ["Personal Details","Credentials","Documents","Review"];
  if(step>4) return (
    <Page title="Worker Registered" icon="✅">
      <div style={{maxWidth:440,background:T.white,borderRadius:16,border:`1px solid ${T.border}`,padding:40,textAlign:"center"}}>
        <div style={{fontSize:52,marginBottom:12}}>🎉</div>
        <h2 style={{fontFamily:"Instrument Serif,serif",fontSize:22,marginBottom:8}}>Worker Registered!</h2>
        <p style={{color:T.muted,fontSize:13,lineHeight:1.7,marginBottom:24}}><strong>{form.firstName} {form.lastName}</strong> has been added to your worker register. Once documents are verified by Nexus RPO, they'll be available for shift placement.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <Btn onClick={()=>{setStep(1);setForm({firstName:"",lastName:"",email:"",phone:"",role:"RGN",pin:"",dob:"",address:"",dbsDate:"",trainingDate:"",notes:""});}}>Register Another</Btn>
          <Btn variant="secondary" onClick={()=>navigate&&navigate("workers")}>View Workers</Btn>
        </div>
      </div>
    </Page>
  );
  return (
    <Page title="Register New Worker" sub="Add a worker to your First Choice Nursing register" icon="➕">
      <div style={{maxWidth:620}}>
        <div style={{display:"flex",gap:0,marginBottom:24,background:T.white,borderRadius:10,border:`1px solid ${T.border}`,overflow:"hidden"}}>
          {steps.map((s,i)=>(
            <div key={i} style={{flex:1,padding:"10px",textAlign:"center",background:step===i+1?T.navy:step>i+1?T.amberBg:"transparent",color:step===i+1?T.white:step>i+1?T.amberText:T.muted,fontSize:11,fontWeight:700,borderRight:i<3?`1px solid ${T.border}`:"none",transition:"all 0.2s"}}>
              {step>i+1?"✓ ":""}{s}
            </div>
          ))}
        </div>
        <Card style={{padding:28}}>
          {step===1 && <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Input label="First Name" value={form.firstName} onChange={v=>set("firstName",v)} required/>
              <Input label="Last Name" value={form.lastName} onChange={v=>set("lastName",v)} required/>
            </div>
            <Input label="Email" type="email" value={form.email} onChange={v=>set("email",v)} required/>
            <Input label="Phone" value={form.phone} onChange={v=>set("phone",v)} required/>
            <Input label="Date of Birth" type="date" value={form.dob} onChange={v=>set("dob",v)}/>
            <Input label="Address" value={form.address} onChange={v=>set("address",v)} placeholder="Full address"/>
          </>}
          {step===2 && <>
            <Select label="Role" value={form.role} onChange={v=>set("role",v)} options={["RGN","RMN","HCA","Senior Carer"]} required/>
            <Input label="NMC/PIN Number (if applicable)" value={form.pin} onChange={v=>set("pin",v)} placeholder="e.g. 12A3456"/>
            <Input label="DBS Issue Date" type="date" value={form.dbsDate} onChange={v=>set("dbsDate",v)}/>
            <Input label="Last Mandatory Training Date" type="date" value={form.trainingDate} onChange={v=>set("trainingDate",v)}/>
            <div style={{borderTop:`1px solid ${T.border}`,paddingTop:16,marginTop:4}}>
              <div style={{fontSize:12,fontWeight:700,color:T.text,marginBottom:12}}>Right to Work</div>
              <div style={{marginBottom:12}}>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>RTW Document Type *</label>
                <select value={form.rtwType||"pending"} onChange={e=>set("rtwType",e.target.value)}
                  style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:"Syne,sans-serif",color:T.text,background:T.white}}>
                  {RTW_TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {(()=>{
                  const selType = RTW_TYPES.find(t=>t.value===(form.rtwType||"pending"));
                  if(!selType||selType.value==="pending") return null;
                  return <div style={{marginTop:6,padding:"8px 12px",background:selType.restricted?"#ede9fe":selType.restricted===false?T.greenBg:"#f8fafc",borderRadius:6,fontSize:12,color:selType.restricted?"#6d28d9":selType.restricted===false?T.green:T.muted}}>
                    {selType.restricted&&"⚠️ "}{selType.restricted===false&&"✅ "}{selType.desc}
                    {selType.restricted&&<strong> 20hr/week restriction will be applied.</strong>}
                  </div>;
                })()}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <Input label="Reference / Document Number" value={form.rtwRef||""} onChange={v=>set("rtwRef",v)} placeholder="e.g. share code, BRP no."/>
                <Input label="RTW Expiry Date" type="date" value={form.rtwExpiry||""} onChange={v=>set("rtwExpiry",v)}/>
              </div>
            </div>
            <Alert type="info">All credential dates will need to be verified by the neutral vendor before this worker can be placed on shifts.</Alert>
          </>}
          {step===3 && <>
            <p style={{fontSize:13,color:T.muted,marginBottom:16,lineHeight:1.6}}>Upload required compliance documents. The neutral vendor will verify these before activating the worker.</p>
            {[{label:"DBS Certificate",req:true},{label:"Proof of ID (Passport/Driving Licence)",req:true},{label:"NMC Certificate (if applicable)",req:false},{label:"Mandatory Training Certificate",req:true},{label:"Right to Work documentation",req:true}].map((doc,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",border:`1.5px dashed ${T.border}`,borderRadius:8,marginBottom:8,cursor:"pointer",background:"#fafbfd"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:T.text}}>{doc.label}{doc.req&&<span style={{color:T.red}}> *</span>}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:2}}>Click to upload PDF, JPG or PNG (max 5MB)</div>
                </div>
                <Btn small variant="secondary" onClick={()=>alert(`Upload started for "${doc.label}". Select a PDF, JPG or PNG file.`)}>Upload</Btn>
              </div>
            ))}
          </>}
          {step===4 && <>
            <Alert type="success">Ready to register <strong>{form.firstName||"this"} {form.lastName||"worker"}</strong> as a <strong>{form.role}</strong>.</Alert>
            <div style={{background:"#f8fafc",borderRadius:8,padding:14,marginBottom:16}}>
              {[["Full Name",`${form.firstName} ${form.lastName}`||"—"],["Email",form.email||"—"],["Phone",form.phone||"—"],["Role",form.role],["NMC/PIN",form.pin||"N/A"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}>
                  <span style={{color:T.muted}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
            <Alert type="info">After registration, Nexus RPO will review uploaded documents (typically within 1 working day) before activating this worker.</Alert>
          </>}
          <div style={{display:"flex",gap:10,justifyContent:"space-between",marginTop:16}}>
            <div>{step>1 && <Btn variant="secondary" onClick={()=>setStep(s=>s-1)}>← Back</Btn>}</div>
            <Btn onClick={()=>setStep(s=>s+1)}>{step<4?"Continue →":"Submit Registration →"}</Btn>
          </div>
        </Card>
      </div>
    </Page>
  );
};

const AgencyDocuments = () => {
  const [uploadModal,setUploadModal] = useState(false);
  const [viewModal,setViewModal] = useState(null);
  const myDocs = DOCS.filter(d=>WORKERS.find(w=>w.name===d.worker&&w.agency==="First Choice"));
  return (
  <Page title="Compliance Documents" sub="Manage documents for First Choice Nursing workers" icon="📁" action={<Btn onClick={()=>setUploadModal(true)}>Upload Document</Btn>}>
    {uploadModal && (
      <Modal title="Upload Document" onClose={()=>setUploadModal(false)}>
        <Select label="Worker" value="" onChange={()=>{}} options={WORKERS.filter(w=>w.agency==="First Choice").map(w=>w.name)}/>
        <Select label="Document Type" value="" onChange={()=>{}} options={["DBS Certificate","Mandatory Training","Right to Work","NMC PIN","Passport"]}/>
        <div style={{border:`2px dashed ${T.border}`,borderRadius:8,padding:"28px",textAlign:"center",cursor:"pointer",background:"#f8fafc",marginBottom:12}}>
          <div style={{fontSize:28,marginBottom:8}}>📎</div>
          <div style={{fontSize:13,color:T.muted}}>Drag & drop or click to browse</div>
          <div style={{fontSize:11,color:"#94a3b8",marginTop:4}}>PDF, JPG, PNG — max 10MB</div>
        </div>
        <Input label="Expiry Date" type="date" value="" onChange={()=>{}}/>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>{setUploadModal(false);alert("Document uploaded and sent to Nexus RPO for verification.");}}>Upload</Btn>
          <Btn variant="secondary" onClick={()=>setUploadModal(false)}>Cancel</Btn>
        </div>
      </Modal>
    )}
    {viewModal && (
      <Modal title={`${viewModal.type} — ${viewModal.worker}`} onClose={()=>setViewModal(null)}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {[["Worker",viewModal.worker],["Type",viewModal.type],["Uploaded",viewModal.uploaded],["Expires",viewModal.expires]].map(([k,v])=>(
            <div key={k} style={{background:"#f8fafc",borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:11,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{k}</div>
              <div style={{fontSize:13,fontWeight:600}}>{v}</div>
            </div>
          ))}
        </div>
        <SBadge s={viewModal.status}/>
        <div style={{display:"flex",gap:8,marginTop:14}}>
          <Btn onClick={()=>{exportCSV(`${viewModal.worker}_${viewModal.type}.csv`,["Worker","Type","Uploaded","Expires","Status"],[[viewModal.worker,viewModal.type,viewModal.uploaded,viewModal.expires,viewModal.status]]);setViewModal(null);}}>Download</Btn>
          <Btn variant="secondary" onClick={()=>setViewModal(null)}>Close</Btn>
        </div>
      </Modal>
    )}
    <Alert type="warn">2 documents are expiring within 30 days. Upload replacements to maintain compliance scores.</Alert>
    <Card>
      <Table
        headers={["Worker","Document Type","Upload Date","Expiry Date","Status","Actions"]}
        rows={myDocs.map((d,i)=>(
          <tr key={i} style={{borderBottom:`1px solid ${T.border}`,background:d.status==="expired"?T.redBg:d.status==="expiring"?"#fffbeb":"transparent"}}>
            <Td bold>{d.worker}</Td>
            <Td>{d.type}</Td>
            <Td>{d.uploaded}</Td>
            <Td>{d.expires}</Td>
            <Td><SBadge s={d.status}/></Td>
            <Td>
              <div style={{display:"flex",gap:5}}>
                <Btn small variant="secondary" onClick={()=>setViewModal(d)}>View</Btn>
                <Btn small variant="secondary" onClick={()=>setUploadModal(true)}>Replace</Btn>
              </div>
            </Td>
          </tr>
        ))}
      />
    </Card>
  </Page>
  );
};

const AgencyInvoices = () => {
  const [viewInv,setViewInv] = useState(null);
  const myInvoices = INVOICES.filter(i=>i.agency==="First Choice");
  return (
  <Page title="My Invoices" sub="Payment history from Nexus RPO" icon="📄">
    {viewInv && (
      <Modal title={`Invoice ${viewInv.id}`} onClose={()=>setViewInv(null)}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {[["Period",viewInv.period],["Shifts",viewInv.shifts],["Amount",`£${viewInv.amount?.toLocaleString()}`],["Due",viewInv.due]].map(([k,v])=>(
            <div key={k} style={{background:"#f8fafc",borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:11,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{k}</div>
              <div style={{fontSize:13,fontWeight:600}}>{v}</div>
            </div>
          ))}
        </div>
        <SBadge s={viewInv.status}/>
        <div style={{display:"flex",gap:8,marginTop:14}}>
          <Btn onClick={()=>exportHTML(`Invoice ${viewInv.id}`,`First Choice Nursing · ${viewInv.period}`,buildTable(["Invoice","Period","Shifts","Amount","Due","Status"],[[viewInv.id,viewInv.period,viewInv.shifts,`£${viewInv.amount?.toLocaleString()}`,viewInv.due,viewInv.status.toUpperCase()]]))}>Download PDF</Btn>
          <Btn variant="secondary" onClick={()=>setViewInv(null)}>Close</Btn>
        </div>
      </Modal>
    )}
    <Grid cols={3}>
      <Stat label="Total Earned" value="£53,550" accent/>
      <Stat label="Paid" value="£28,900" sub="Feb 2026"/>
      <Stat label="Pending" value="£12,100" sub="Mar 2026 — due Apr 1"/>
    </Grid>
    <Card>
      <Table
        headers={["Invoice","Period","Shifts","Amount","Due Date","Status","Action"]}
        rows={myInvoices.map(inv=>(
          <tr key={inv.id} style={{borderBottom:`1px solid ${T.border}`}}>
            <Td><span style={{fontFamily:"monospace",fontSize:12,fontWeight:700}}>{inv.id}</span></Td>
            <Td>{inv.period}</Td>
            <Td>{inv.shifts}</Td>
            <Td bold>£{inv.amount.toLocaleString()}</Td>
            <Td>{inv.due}</Td>
            <Td><SBadge s={inv.status}/></Td>
            <Td>
              <div style={{display:"flex",gap:5}}>
                <Btn small variant="secondary" onClick={()=>setViewInv(inv)}>View</Btn>
                <Btn small variant="secondary" onClick={()=>exportHTML(`Invoice ${inv.id}`,`First Choice Nursing · ${inv.period}`,buildTable(["Invoice","Period","Shifts","Amount","Due","Status"],[[inv.id,inv.period,inv.shifts,`£${inv.amount.toLocaleString()}`,inv.due,inv.status.toUpperCase()]]))}>Download</Btn>
              </div>
            </Td>
          </tr>
        ))}
      />
    </Card>
  </Page>
  );
};

/* ─── ADMIN: BANK STAFF MANAGEMENT ──────────────────────────────────────────── */
const BankStaffManagement = () => {
  const [modal,setModal]=useState(false);
  const [selected,setSelected]=useState(null);
  const [windowMins,setWindowMins]=useState(120);
  return (
    <Page title="Bank Staff" sub="Internal workforce with first-refusal on shifts before agencies" icon="🏦" action={<Btn onClick={()=>setModal(true)}>+ Add Bank Worker</Btn>}>
      {modal&&(
        <Modal title="Add Bank Staff Member" onClose={()=>setModal(false)}>
          <Input label="Full Name" value="" onChange={()=>{}} placeholder="e.g. Diane Foster" required/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Select label="Role" value="RGN" onChange={()=>{}} options={["RGN","RMN","HCA","Senior Carer"]}/>
            <Input label="Phone" value="" onChange={()=>{}} placeholder="07800 000000"/>
          </div>
          <Input label="Email" type="email" value="" onChange={()=>{}} placeholder="name@internal.co.uk"/>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Eligible Care Homes</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{CARE_HOMES.map(c=><button key={c.id} style={{padding:"5px 12px",borderRadius:6,border:`1.5px solid ${T.border}`,background:"#f8fafc",fontSize:12,cursor:"pointer",fontFamily:"Syne,sans-serif",color:T.muted}}>{c.name}</button>)}</div>
          </div>
          <Alert type="info">An invite email will be sent so they can access their bank staff portal.</Alert>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><Btn variant="secondary" onClick={()=>setModal(false)}>Cancel</Btn><Btn onClick={()=>setModal(false)}>Add & Send Invite</Btn></div>
        </Modal>
      )}
      {selected&&(
        <Modal title="Bank Staff Profile" onClose={()=>setSelected(null)}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{width:60,height:60,borderRadius:"50%",background:`linear-gradient(135deg,${T.teal},${T.navy})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:T.white,fontWeight:700,margin:"0 auto 10px"}}>{selected.name.split(" ").map(n=>n[0]).join("")}</div>
            <div style={{fontSize:16,fontWeight:700}}>{selected.name}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:2}}>{selected.role} · Bank Staff</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
            {[["Email",selected.email],["Phone",selected.phone],["DBS Expiry",selected.dbsExpiry],["Training Expiry",selected.trainingExpiry],["Hours (MTD)",`${selected.hoursThisMonth}hrs`],["Earnings YTD",`£${selected.earningsYTD.toLocaleString()}`]].map(([k,v])=>(
              <div key={k} style={{background:"#f8fafc",borderRadius:7,padding:"10px 12px"}}><div style={{fontSize:10,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{k}</div><div style={{fontSize:12,fontWeight:600,color:T.text}}>{v}</div></div>
            ))}
          </div>
          <div style={{marginBottom:12}}><div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Eligible Homes</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{selected.contracts.map(c=><Badge key={c} label={c} color={T.teal} bg={T.tealBg}/>)}</div></div>
          <div style={{marginBottom:16}}><div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>Compliance</div><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{flex:1}}><ProgressBar value={selected.compliance} color={selected.compliance>=95?T.green:selected.compliance>=75?T.yellow:T.red}/></div><span style={{fontWeight:800,color:selected.compliance>=95?T.green:selected.compliance>=75?T.yellow:T.red}}>{selected.compliance}%</span></div></div>
          <Btn full variant="secondary" onClick={()=>setSelected(null)}>Close</Btn>
        </Modal>
      )}
      <div style={{background:`linear-gradient(135deg,${T.teal}18,${T.tealBg})`,borderRadius:12,padding:"16px 20px",marginBottom:20,border:`1px solid ${T.teal}44`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontWeight:700,fontSize:14,color:T.teal,marginBottom:4}}>🏦 Bank Priority Window</div>
          <div style={{fontSize:13,color:T.text}}>Bank staff have <strong>{windowMins} minutes</strong> to claim a shift before it's broadcast to agencies. Lower the window to increase agency response; raise it to maximise bank fill rate.</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:12,color:T.muted,fontWeight:600}}>Window:</span>
          {[30,60,120,240].map(m=>(
            <button key={m} onClick={()=>setWindowMins(m)} style={{padding:"6px 12px",borderRadius:7,border:`1.5px solid ${windowMins===m?T.teal:T.border}`,background:windowMins===m?T.tealBg:T.white,color:windowMins===m?T.teal:T.muted,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"Syne,sans-serif"}}>{m}m</button>
          ))}
        </div>
      </div>
      <Grid cols={4}>
        <Stat label="Bank Staff" value={BANK_STAFF.length} accent/>
        <Stat label="Fully Compliant" value={BANK_STAFF.filter(w=>w.compliance>=95).length}/>
        <Stat label="Bank-Filled (MTD)" value={BANK_SHIFTS.filter(s=>s.status==="bank-claimed").length} trend="saves agency fees" trendUp={true}/>
        <Stat label="Cost Saving vs Agency" value="£1,240" sub="This month at internal rates"/>
      </Grid>
      <Card style={{marginBottom:20}}>
        <Table
          headers={["Staff Member","Role","DBS","Training","Compliance","Hours (MTD)","Earnings YTD","Eligible Homes","Actions"]}
          rows={BANK_STAFF.map(w=>(
            <tr key={w.id} style={{borderBottom:`1px solid ${T.border}`,background:w.compliance<75?"#fffbeb":"transparent"}}>
              <Td><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${T.teal}88,${T.navy}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.white,flexShrink:0}}>{w.name.split(" ").map(n=>n[0]).join("")}</div><span style={{fontWeight:600,fontSize:13}}>{w.name}</span></div></Td>
              <Td><Badge label={w.role} color={T.teal} bg={T.tealBg}/></Td>
              <Td><SBadge s={w.dbs}/></Td>
              <Td><SBadge s={w.training}/></Td>
              <Td><div style={{display:"flex",alignItems:"center",gap:6,minWidth:80}}><div style={{flex:1}}><ProgressBar value={w.compliance} color={w.compliance>=95?T.green:w.compliance>=75?T.yellow:T.red}/></div><span style={{fontSize:11,fontWeight:700,color:w.compliance>=95?T.green:w.compliance>=75?T.yellow:T.red}}>{w.compliance}%</span></div></Td>
              <Td>{w.hoursThisMonth}hrs</Td>
              <Td bold>£{w.earningsYTD.toLocaleString()}</Td>
              <Td><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{w.contracts.slice(0,2).map(c=><Badge key={c} label={c.split(" ")[0]} color={T.teal} bg={T.tealBg}/>)}{w.contracts.length>2&&<Badge label={`+${w.contracts.length-2}`} color={T.muted} bg="#f1f5f9"/>}</div></Td>
              <Td><div style={{display:"flex",gap:5}}><Btn small onClick={()=>setSelected(w)}>Profile</Btn><Btn small variant="secondary" onClick={()=>setSelected(w)}>Edit</Btn></div></Td>
            </tr>
          ))}
        />
      </Card>
      <Card>
        <CardHead title="Bank Shift Activity" sub="Shifts in priority window + claimed" icon="📋"/>
        <Table
          headers={["Care Home","Role","Date","Time","Rate","Status","Claimed By","Action"]}
          rows={BANK_SHIFTS.map(s=>(
            <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`}}>
              <Td bold>{s.carehome}</Td>
              <Td><Badge label={s.role} color={T.teal} bg={T.tealBg}/></Td>
              <Td>{s.date}</Td>
              <Td>{s.time}</Td>
              <Td bold>£{s.rate}{"/hr"}</Td>
              <Td>{s.status==="bank-claimed"?<Badge label="Claimed" color={T.green} bg={T.greenBg} dot/>:<span style={{display:"flex",alignItems:"center",gap:5}}><Badge label="Bank Window" color={T.teal} bg={T.tealBg} dot/>{s.bankWindowMins>0&&<span style={{fontSize:10,color:T.teal,fontWeight:700}}>{s.bankWindowMins}m left</span>}</span>}</Td>
              <Td>{s.claimedBy||<span style={{color:"#94a3b8",fontSize:12,fontStyle:"italic"}}>Awaiting claim</span>}</Td>
              <Td><Btn small variant="secondary" onClick={()=>alert(`Shift: ${s.carehome} · ${s.role}\nDate: ${s.date} · ${s.time}\nRate: £${s.rate}{"/hr"}\nStatus: ${s.status}\nClaimed by: ${s.claimedBy||"Unclaimed"}`)}>View</Btn></Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};

/* ─── BANK: DASHBOARD ────────────────────────────────────────────────────────── */
const BankDashboard = ({user}) => {
  const me = BANK_STAFF.find(w=>w.name===user.name)||BANK_STAFF[0];
  const open = BANK_SHIFTS.filter(s=>s.status==="bank-open");
  return (
    <Page title={`Hello, ${(user.name||"").split(" ")[0]}`} sub="Your bank staff dashboard — shift picks, earnings & compliance" icon="◈">
      <div style={{background:`linear-gradient(135deg,${T.teal}18,${T.tealBg})`,borderRadius:12,padding:"16px 20px",marginBottom:20,border:`1px solid ${T.teal}44`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:14,fontWeight:700,color:T.teal,marginBottom:4}}>🏦 You have first pick on new shifts</div>
          <div style={{fontSize:13,color:T.text,lineHeight:1.6}}>As bank staff, you see shifts <strong>before agencies</strong>. Each shift has a countdown — claim it before the window closes or it goes to agencies.</div>
        </div>
        {open.length>0?<Badge label={`${open.length} shifts open now`} color={T.teal} bg={T.tealBg} dot/>:<Badge label="All caught up" color={T.green} bg={T.greenBg} dot/>}
      </div>
      <Grid cols={4}>
        <Stat label="Available to Claim" value={open.length} sub="In your window" accent/>
        <Stat label="My Shifts (MTD)" value={me.hoursThisMonth>0?Math.ceil(me.hoursThisMonth/12):0} sub="Confirmed"/>
        <Stat label="Hours This Month" value={`${me.hoursThisMonth}hrs`} trend="↑ vs last month" trendUp={true}/>
        <Stat label="Earnings (MTD)" value={`£${(me.hoursThisMonth*(me.role==="RGN"?32:me.role==="RMN"?35:16)).toLocaleString()}`}/>
      </Grid>
      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:18}}>
        <Card>
          <CardHead title="Shifts Open to You Now" action={<Badge label="Priority window" color={T.teal} bg={T.tealBg} dot/>}/>
          {open.length===0?(<div style={{padding:32,textAlign:"center",color:T.muted,fontSize:13}}>No shifts in your window right now. Check back soon.</div>):(
            <Table headers={["Care Home","Role","Date","Time","Rate","Window","Action"]}
              rows={open.map(s=>(
                <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`}}>
                  <Td bold>{s.carehome}</Td>
                  <Td><Badge label={s.role} color={T.teal} bg={T.tealBg}/></Td>
                  <Td>{s.date}</Td><Td>{s.time}</Td>
                  <Td bold>£{s.rate}{"/hr"}</Td>
                  <Td><div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:11,fontWeight:700,color:s.bankWindowMins<60?T.red:T.teal,minWidth:36}}>{s.bankWindowMins}m</span><div style={{width:40,height:4,background:T.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,(s.bankWindowMins/240)*100)}%`,background:s.bankWindowMins<60?T.red:T.teal}}/></div></div></Td>
                  <Td><Btn small onClick={()=>claim(s.id)}>Claim</Btn></Td>
                </tr>
              ))}
            />
          )}
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <CardHead title="My Compliance" icon="🛡"/>
            <div style={{padding:16}}>
              <div style={{textAlign:"center",marginBottom:12}}>
                <div style={{fontSize:30,fontWeight:800,color:me.compliance>=95?T.green:me.compliance>=75?T.yellow:T.red}}>{me.compliance}%</div>
                <ProgressBar value={me.compliance} color={me.compliance>=95?T.green:me.compliance>=75?T.yellow:T.red}/>
              </div>
              {[["DBS",me.dbs],["Training",me.training],["PIN",me.pinStatus?"valid":"missing"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}`,fontSize:12}}>
                  <span style={{color:T.muted}}>{k}</span><SBadge s={v}/>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHead title="Eligible Care Homes" icon="🏥"/>
            <div style={{padding:12}}>
              {me.contracts.map(c=>(
                <div key={c} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${T.border}`,fontSize:12}}>
                  <span style={{color:T.teal}}>✓</span><span style={{fontWeight:500}}>{c}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};

/* ─── BANK: AVAILABLE SHIFTS ─────────────────────────────────────────────────── */
const BankAvailableShifts = ({user}) => {
  const [shifts,   setShifts]    = useState(BANK_SHIFTS);
  const [filterGroup,  setFilterGroup]  = useState("all");
  const [filterHome,   setFilterHome]   = useState("all");
  const [filterRole,   setFilterRole]   = useState("all");
  const me = BANK_STAFF.find(w=>w.name===user.name)||BANK_STAFF[0];

  const groups = INIT_CLIENT_GROUPS;
  const groupForHome = (homeName) => groups.find(g=>g.locations.some(l=>l.name===homeName));

  const homesInGroup = filterGroup==="all"
    ? [...new Set(shifts.filter(s=>s.status==="bank-open").map(s=>s.carehome))]
    : (groups.find(g=>g.id===filterGroup)?.locations.map(l=>l.name)||[])
        .filter(name=>shifts.some(s=>s.carehome===name&&s.status==="bank-open"));

  const available = shifts.filter(s => {
    if (s.status !== "bank-open") return false;
    if (filterGroup !== "all") { const grp=groupForHome(s.carehome); if(!grp||grp.id!==filterGroup) return false; }
    if (filterHome !== "all" && s.carehome !== filterHome) return false;
    if (filterRole !== "all" && s.role !== filterRole)     return false;
    return true;
  });
  const claimed = shifts.filter(s=>s.status==="bank-claimed"&&s.claimedBy===user.name);
  const claim = (id) => setShifts(prev=>prev.map(s=>s.id===id?{...s,status:"bank-claimed",claimedBy:user.name}:s));

  const hasFilters = filterGroup!=="all"||filterHome!=="all"||filterRole!=="all";
  const roles = [...new Set(shifts.filter(s=>s.status==="bank-open").map(s=>s.role))];

  const selStyle = (active) => ({
    padding:"8px 12px", border:`1.5px solid ${active?T.teal:T.border}`,
    borderRadius:8, fontSize:12, fontFamily:"Syne,sans-serif",
    color:T.text, background:active?T.tealBg:T.white, cursor:"pointer",
    fontWeight:active?700:400, outline:"none", minWidth:0,
  });

  return (
    <Page title="Available Shifts" sub="Your priority window — claim before it goes to agencies" icon="📋">
      <div style={{background:`linear-gradient(135deg,${T.teal}18,${T.tealBg})`,borderRadius:12,padding:"13px 18px",marginBottom:16,border:`1px solid ${T.teal}44`,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <span style={{fontSize:18}}>⏱</span>
        <span style={{fontSize:13,color:T.text}}><strong style={{color:T.teal}}>First refusal is yours.</strong> These shifts expire from your window soon — once the timer hits zero they're sent to all agencies automatically.</span>
      </div>

      {/* ── Filter bar ──────────────────────────────────────────────────────── */}
      <Card style={{padding:"14px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:10,alignItems:"end"}}>
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Group Owner</label>
            <select value={filterGroup} onChange={e=>{setFilterGroup(e.target.value);setFilterHome("all");}} style={selStyle(filterGroup!=="all")}>
              <option value="all">All Groups</option>
              {groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Care Home</label>
            <select value={filterHome} onChange={e=>setFilterHome(e.target.value)} style={selStyle(filterHome!=="all")} disabled={homesInGroup.length===0}>
              <option value="all">{filterGroup==="all"?"All Homes":"All in Group"}</option>
              {homesInGroup.map(h=><option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Role</label>
            <select value={filterRole} onChange={e=>setFilterRole(e.target.value)} style={selStyle(filterRole!=="all")}>
              <option value="all">All Roles</option>
              {roles.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={{paddingBottom:1}}>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:"transparent",marginBottom:5}}>_</label>
            <button onClick={()=>{setFilterGroup("all");setFilterHome("all");setFilterRole("all");}} disabled={!hasFilters}
              style={{padding:"8px 12px",borderRadius:8,border:`1.5px solid ${hasFilters?T.red:T.border}`,background:hasFilters?T.redBg:"transparent",color:hasFilters?T.red:T.muted,fontSize:12,fontWeight:700,cursor:hasFilters?"pointer":"default",fontFamily:"Syne,sans-serif"}}>
              {hasFilters?"✕ Clear":"Filters"}
            </button>
          </div>
        </div>
        {hasFilters&&(
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`}}>
            {filterGroup!=="all"&&<span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:T.tealBg,color:T.teal}}>Group: {groups.find(g=>g.id===filterGroup)?.name}</span>}
            {filterHome!=="all"&&<span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:T.tealBg,color:T.teal}}>Home: {filterHome}</span>}
            {filterRole!=="all"&&<span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,background:T.tealBg,color:T.teal}}>Role: {filterRole}</span>}
            <span style={{fontSize:11,color:T.muted,padding:"3px 6px"}}>{available.length} shift{available.length!==1?"s":""} shown</span>
          </div>
        )}
      </Card>

      {available.length===0?(
        <Card style={{padding:40,textAlign:"center"}}><div style={{fontSize:32,marginBottom:12}}>🎉</div><div style={{fontWeight:700,fontSize:15,marginBottom:6}}>{hasFilters?"No shifts match those filters":"No shifts in window right now"}</div><p style={{color:T.muted,fontSize:13}}>{hasFilters?"Try adjusting or clearing your filters.":"You'll be notified when new shifts are published. Check back soon."}</p></Card>
      ):(
        <Card>
          <Table headers={["","Group","Care Home","Role","Date","Time","Rate","Est. Pay","Window","Action"]}
            rows={available.map(s=>{
              const hrs=s.time.includes("–")?12:8;
              const urgent=s.bankWindowMins<60;
              const grp=groupForHome(s.carehome);
              return(
                <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`,background:urgent?"#f0fdfc":"transparent"}}>
                  <Td><UrgDot u={s.urgency}/></Td>
                  <Td><span style={{fontSize:11,color:T.muted,fontWeight:600}}>{grp?.name||"—"}</span></Td>
                  <Td bold>{s.carehome}</Td>
                  <Td><Badge label={s.role} color={T.teal} bg={T.tealBg}/></Td>
                  <Td>{s.date}</Td><Td>{s.time}</Td>
                  <Td bold>£{s.rate}{"/hr"}</Td>
                  <Td><span style={{fontWeight:700,color:T.green}}>£{s.rate*hrs}</span></Td>
                  <Td><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontWeight:700,fontSize:12,color:urgent?T.red:T.teal,minWidth:36}}>{s.bankWindowMins}m</span><div style={{width:52,height:5,background:T.border,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,(s.bankWindowMins/240)*100)}%`,background:urgent?T.red:T.teal,borderRadius:3}}/></div></div></Td>
                  <Td><Btn small onClick={()=>claim(s.id)}>Claim ✓</Btn></Td>
                </tr>
              );
            })}
          />
        </Card>
      )}
      {claimed.length>0&&(
        <div style={{marginTop:20}}>
          <Card>
            <CardHead title="Shifts I've Claimed" icon="✅"/>
            <Table headers={["Care Home","Role","Date","Time","Rate","Pay","Status"]}
              rows={claimed.map(s=>(
                <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`}}>
                  <Td bold>{s.carehome}</Td><Td><Badge label={s.role} color={T.teal} bg={T.tealBg}/></Td>
                  <Td>{s.date}</Td><Td>{s.time}</Td><Td bold>£{s.rate}{"/hr"}</Td>
                  <Td><span style={{fontWeight:700,color:T.green}}>£{s.rate*12}</span></Td>
                  <Td><Badge label="Confirmed" color={T.green} bg={T.greenBg} dot/></Td>
                </tr>
              ))}
            />
          </Card>
        </div>
      )}
    </Page>
  );
};

/* ─── BANK: MY SHIFTS ────────────────────────────────────────────────────────── */
const BankMyShifts = ({user}) => {
  const me=BANK_STAFF.find(w=>w.name===user.name)||BANK_STAFF[0];
  const rate=me.role==="RGN"?32:me.role==="RMN"?35:16;
  const [shifts,setShifts]=useState([
    {id:201,carehome:"Sunrise Care",role:me.role,date:"2026-03-18",time:"07:00–19:00",status:"confirmed",rate},
    {id:202,carehome:"Oakwood Nursing",role:me.role,date:"2026-03-20",time:"19:00–07:00",status:"confirmed",rate},
    {id:203,carehome:"Sunrise Care",role:me.role,date:"2026-03-11",time:"07:00–19:00",status:"completed",rate},
    {id:204,carehome:"Meadowbrook Lodge",role:me.role,date:"2026-03-08",time:"19:00–07:00",status:"completed",rate},
  ]);
  const [detailModal,setDetailModal]=useState(null);
  const cancelShift=(id)=>setShifts(ss=>ss.map(s=>s.id===id?{...s,status:"cancelled"}:s));
  return (
    <Page title="My Shifts" sub="Confirmed and completed shifts" icon="✅">
      {detailModal&&(
        <Modal title={`Shift Details — ${detailModal.carehome}`} onClose={()=>setDetailModal(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[["Care Home",detailModal.carehome],["Role",detailModal.role],["Date",detailModal.date],["Time",detailModal.time],["Rate",`£${detailModal.rate}{"/hr"}`],["Pay",`£${detailModal.rate*12}`]].map(([k,v])=>(
              <div key={k} style={{background:"#f8fafc",borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:11,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:3}}>{k}</div>
                <div style={{fontSize:13,fontWeight:600}}>{v}</div>
              </div>
            ))}
          </div>
          {detailModal.status==="confirmed"&&<Alert type="warn">If you need to cancel, please do so at least 4 hours before the shift starts.</Alert>}
          <div style={{display:"flex",gap:8,marginTop:8}}>
            {detailModal.status==="confirmed"&&<Btn variant="danger" onClick={()=>{cancelShift(detailModal.id);setDetailModal(null);}}>Cancel Shift</Btn>}
            <Btn variant="secondary" onClick={()=>setDetailModal(null)}>Close</Btn>
          </div>
        </Modal>
      )}
      <Grid cols={3}>
        <Stat label="Upcoming" value={shifts.filter(s=>s.status==="confirmed").length} accent/>
        <Stat label="Completed (MTD)" value={shifts.filter(s=>s.status==="completed").length}/>
        <Stat label="Hours Worked" value={`${me.hoursThisMonth}hrs`} trend="↑ vs last month" trendUp={true}/>
      </Grid>
      <Card>
        <Table headers={["Care Home","Role","Date","Time","Rate","Pay","Status","Action"]}
          rows={shifts.filter(s=>s.status!=="cancelled").map(s=>(
            <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`,background:s.status==="completed"?"#f8fafc":"transparent"}}>
              <Td bold>{s.carehome}</Td>
              <Td><Badge label={s.role} color={T.teal} bg={T.tealBg}/></Td>
              <Td>{s.date}</Td><Td>{s.time}</Td>
              <Td>£{s.rate}{"/hr"}</Td><Td bold>£{s.rate*12}</Td>
              <Td>{s.status==="completed"?<Badge label="Completed" color={T.green} bg={T.greenBg} dot/>:<Badge label="Confirmed" color={T.blue} bg={T.blueBg} dot/>}</Td>
              <Td><div style={{display:"flex",gap:5}}>
                <Btn small variant="secondary" onClick={()=>setDetailModal(s)}>Details</Btn>
                {s.status==="confirmed"&&<Btn small variant="danger" onClick={()=>cancelShift(s.id)}>Cancel</Btn>}
              </div></Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};

/* ─── BANK: AVAILABILITY ─────────────────────────────────────────────────────── */
const BankAvailability = () => {
  const days=["Mon 11","Tue 12","Wed 13","Thu 14","Fri 15","Sat 16","Sun 17","Mon 18","Tue 19","Wed 20","Thu 21","Fri 22","Sat 23","Sun 24"];
  const [avail,setAvail]=useState({"Mon 11":"day","Tue 12":"both","Wed 13":"unavailable","Thu 14":"day","Fri 15":"both","Sat 16":"unavailable","Sun 17":"unavailable","Mon 18":"day","Tue 19":"day","Wed 20":"night","Thu 21":"both","Fri 22":"day","Sat 23":"unavailable","Sun 24":"unavailable"});
  const toggle=(d)=>setAvail(a=>({...a,[d]:a[d]==="unavailable"?"day":a[d]==="day"?"night":a[d]==="night"?"both":"unavailable"}));
  const cm={day:{bg:T.tealBg,color:T.teal,label:"Day"},night:{bg:T.purpleBg,color:T.purple,label:"Night"},both:{bg:T.greenBg,color:T.green,label:"Day & Night"},unavailable:{bg:"#f1f5f9",color:"#94a3b8",label:"Unavailable"}};
  return (
    <Page title="Set My Availability" sub="Shifts will only be offered to you on days you mark as available" icon="📅">
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:12,color:T.muted,fontWeight:600}}>Click a day to cycle:</span>
        {Object.entries(cm).map(([k,v])=><span key={k} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:6,background:v.bg,fontSize:11,fontWeight:700,color:v.color}}>{v.label}</span>)}
      </div>
      <Card>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i)=><div key={i} style={{padding:"8px",textAlign:"center",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",borderBottom:`1px solid ${T.border}`,background:"#f8fafc",borderRight:i<6?`1px solid ${T.border}`:"none"}}>{d}</div>)}
          {days.map((d,i)=>{const c=cm[avail[d]||"unavailable"];return(<div key={i} onClick={()=>toggle(d)} style={{minHeight:80,padding:10,borderRight:i%7<6?`1px solid ${T.border}`:"none",borderBottom:i<7?`1px solid ${T.border}`:"none",cursor:"pointer",background:c.bg,transition:"background 0.15s",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}><span style={{fontSize:12,fontWeight:700,color:T.text}}>{d.split(" ")[1]}</span><span style={{fontSize:10,fontWeight:700,color:c.color,textTransform:"uppercase",letterSpacing:"0.05em"}}>{c.label}</span></div>);})}
        </div>
      </Card>
      <div style={{marginTop:16,display:"flex",gap:10}}>
        <Btn onClick={()=>alert("Availability saved. You'll now only receive shift notifications on your marked days.")}>Save Availability</Btn>
        <Btn variant="secondary" onClick={()=>setAvail(Object.fromEntries(days.map(d=>[d,"unavailable"])))}>Clear All</Btn>
      </div>
    </Page>
  );
};

/* ─── BANK: EARNINGS ─────────────────────────────────────────────────────────── */
const BankEarnings = ({user}) => {
  const me=BANK_STAFF.find(w=>w.name===user.name)||BANK_STAFF[0];
  const rate=me.role==="RGN"?32:me.role==="RMN"?35:16;
  const payslips=[
    {id:"PS-0024",period:"Mar 2026",shifts:Math.ceil(me.hoursThisMonth/12),hours:me.hoursThisMonth,gross:me.hoursThisMonth*rate,status:"pending"},
    {id:"PS-0023",period:"Feb 2026",shifts:4,hours:48,gross:48*rate,status:"paid"},
    {id:"PS-0022",period:"Jan 2026",shifts:3,hours:36,gross:36*rate,status:"paid"},
    {id:"PS-0021",period:"Dec 2025",shifts:2,hours:24,gross:24*rate,status:"paid"},
  ];
  return (
    <Page title="My Earnings" sub="Payslips, hours and YTD summary" icon="💷">
      <Grid cols={3}>
        <Stat label="Earnings YTD" value={`£${me.earningsYTD.toLocaleString()}`} accent/>
        <Stat label="Hours YTD" value={`${me.hoursYTD}hrs`} trend="↑ 12hrs vs last year" trendUp={true}/>
        <Stat label="This Month" value={`£${(me.hoursThisMonth*rate).toLocaleString()}`} sub="Pending payroll"/>
      </Grid>
      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:18,marginBottom:18}}>
        <Card>
          <CardHead title="Monthly Earnings" icon="📈"/>
          <div style={{padding:"12px 4px"}}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={BANK_EARNINGS} barSize={28}>
                <XAxis dataKey="month" tick={{fontSize:11,fill:T.muted}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:T.muted}} axisLine={false} tickLine={false} tickFormatter={v=>`£${v}`}/>
                <Tooltip formatter={v=>[`£${v}`,"Earnings"]} contentStyle={{borderRadius:8,border:`1px solid ${T.border}`,fontSize:12}}/>
                <Bar dataKey="pay" fill={T.teal} radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHead title="Hours per Month" icon="⏱"/>
          <div style={{padding:"12px 4px"}}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={BANK_EARNINGS}>
                <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.teal} stopOpacity={0.3}/><stop offset="95%" stopColor={T.teal} stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="month" tick={{fontSize:11,fill:T.muted}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:T.muted}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={{borderRadius:8,border:`1px solid ${T.border}`,fontSize:12}}/>
                <Area type="monotone" dataKey="hrs" stroke={T.teal} strokeWidth={2} fill="url(#tg)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card>
        <CardHead title="Payslip History"/>
        <Table headers={["Payslip","Period","Shifts","Hours","Rate/hr","Gross","Status","Download"]}
          rows={payslips.map(p=>(
            <tr key={p.id} style={{borderBottom:`1px solid ${T.border}`}}>
              <Td><span style={{fontFamily:"monospace",fontSize:12,fontWeight:700}}>{p.id}</span></Td>
              <Td>{p.period}</Td><Td>{p.shifts}</Td><Td>{p.hours}hrs</Td>
              <Td>£{rate}{"/hr"}</Td><Td bold>£{p.gross.toLocaleString()}</Td>
              <Td><SBadge s={p.status}/></Td>
              <Td>{p.status==="paid"?<Btn small variant="secondary" onClick={()=>exportCSV(`${p.id}-${p.period.replace(/ /g,"-")}.csv`,["Payslip","Period","Shifts","Hours","Rate/hr","Gross","Status"],[[p.id,p.period,p.shifts,p.hours,`£${rate}{"/hr"}`,`£${p.gross}`,p.status]])}>PDF</Btn>:<span style={{fontSize:12,color:T.muted}}>Processing</span>}</Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};

/* ─── BANK: PROFILE ──────────────────────────────────────────────────────────── */
const BankProfile = ({user}) => {
  const me=BANK_STAFF.find(w=>w.name===user.name)||BANK_STAFF[0];
  return (
    <Page title="My Profile" sub="Compliance documents and personal details" icon="👤">
      <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:18,maxWidth:860}}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card style={{padding:22,textAlign:"center"}}>
            <div style={{width:68,height:68,borderRadius:"50%",background:`linear-gradient(135deg,${T.teal},${T.navy})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:T.white,fontWeight:700,margin:"0 auto 10px"}}>{me.name.split(" ").map(n=>n[0]).join("")}</div>
            <div style={{fontSize:15,fontWeight:700}}>{me.name}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:3}}>{me.role} · Bank Staff</div>
            <div style={{marginTop:10}}><Badge label="Active" color={T.green} bg={T.greenBg} dot/></div>
            <div style={{marginTop:14,fontSize:26,fontWeight:800,color:me.compliance>=95?T.green:me.compliance>=75?T.yellow:T.red}}>{me.compliance}%</div>
            <div style={{fontSize:11,color:T.muted,marginBottom:8}}>Compliance score</div>
            <ProgressBar value={me.compliance} color={me.compliance>=95?T.green:T.yellow}/>
          </Card>
          <Card>
            <CardHead title="Eligible Care Homes" icon="🏥"/>
            <div style={{padding:12}}>
              {me.contracts.map(c=><div key={c} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${T.border}`,fontSize:12}}><span style={{color:T.teal}}>✓</span><span style={{fontWeight:500}}>{c}</span></div>)}
            </div>
          </Card>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card style={{padding:20}}>
            <h3 style={{fontWeight:700,fontSize:14,marginBottom:14}}>Personal Details</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Input label="Full Name" value={me.name} onChange={()=>{}}/>
              <Input label="Role" value={me.role} onChange={()=>{}}/>
              <Input label="Email" value={me.email} onChange={()=>{}}/>
              <Input label="Phone" value={me.phone} onChange={()=>{}}/>
            </div>
            <Btn variant="secondary" onClick={()=>alert("Details updated successfully.")}>Update Details</Btn>
          </Card>
          <Card>
            <CardHead title="Compliance Documents" icon="📁"/>
            <div style={{padding:14}}>
              {[
                {type:"DBS Certificate",expiry:me.dbsExpiry,status:me.dbs},
                {type:"Mandatory Training",expiry:me.trainingExpiry,status:me.training},
                {type:"NMC / PIN",expiry:"—",status:me.pinStatus?"valid":"expired"},
              ].map((doc,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",border:`1.5px solid ${doc.status==="valid"?T.border:doc.status==="expiring"?T.yellow:T.red}`,borderRadius:8,marginBottom:8,background:doc.status==="expired"?T.redBg:doc.status==="expiring"?"#fffbeb":T.white}}>
                  <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{doc.type}</div><div style={{fontSize:11,color:T.muted,marginTop:2}}>Expires: {doc.expiry}</div></div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}><SBadge s={doc.status}/><Btn small variant="secondary" onClick={()=>alert(`Upload started for ${doc.type}. Select a file from your device.`)}>Upload</Btn></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};

/* ─── TIMESHEET: SHARED HELPERS ──────────────────────────────────────────────── */
const tsStatusColor = s => s==="approved"?{c:T.green,bg:T.greenBg}:s==="pending"?{c:T.blue,bg:T.blueBg}:s==="disputed"?{c:T.red,bg:T.redBg}:s==="invoiced"?{c:T.amber,bg:T.amberBg}:{c:T.muted,bg:"#f1f5f9"};

const TsBadge = ({s}) => { const {c,bg}=tsStatusColor(s); return <Badge label={s.charAt(0).toUpperCase()+s.slice(1)} color={c} bg={bg} dot/>; };

/* ─── AGENCY: TIMESHEETS ─────────────────────────────────────────────────────── */
const AgencyTimesheets = ({timesheets,setTimesheets}) => {
  // All filled shifts for First Choice with no timesheet yet
  const myFilledShifts = SHIFTS.filter(s=>s.agency==="First Choice"&&s.status==="filled");
  const submittedShiftIds = new Set(timesheets.filter(t=>t.agency==="First Choice").map(t=>t.shiftId));
  const unsubmitted = myFilledShifts.filter(s=>!submittedShiftIds.has(s.id));

  // Per-row hour inputs (keyed by shift id)
  const [rowData,setRowData] = useState(() => {
    const init={};
    myFilledShifts.forEach(s=>{
      const sched = s.time.includes("–") ? (() => {
        const [st,en]=s.time.split("–");
        const [sh,sm]=st.split(":").map(Number);
        const [eh,em]=en.split(":").map(Number);
        let diff=(eh*60+em)-(sh*60+sm);
        if(diff<0)diff+=1440;
        return +(diff/60).toFixed(2);
      })() : 12;
      init[s.id]={hoursWorked:String(sched),breakMins:"30",notes:""};
    });
    return init;
  });

  const setRow=(id,k,v)=>setRowData(p=>({...p,[id]:{...p[id],[k]:v}}));

  const [filterStatus,setFilterStatus]=useState("unsubmitted");
  const [tsView,setTsView]=useState("list");   // "list" | "week"
  const [weekStart,setWeekStart]=useState("2026-03-09");
  const [submittedIds,setSubmittedIds]=useState(new Set());
  const [bulkSelect,setBulkSelect]=useState(new Set());

  const mySubmitted = timesheets.filter(t=>t.agency==="First Choice");

  const calcTotal=(shiftId)=>{
    const s=SHIFTS.find(x=>x.id===shiftId);
    const row=rowData[shiftId];
    if(!s||!row)return 0;
    return +((parseFloat(row.hoursWorked)||0)*s.rate).toFixed(2);
  };

  const submitOne=(shiftId)=>{
    const s=SHIFTS.find(x=>x.id===shiftId);
    const row=rowData[shiftId];
    if(!s||!row||!row.hoursWorked)return;
    const ts={
      id:`TS-${String(timesheets.length+1).padStart(3,"0")}`,
      shiftId:s.id,
      agency:"First Choice",
      carehome:s.carehome,
      worker:s.worker,
      role:s.role,
      date:s.date,
      time:s.time,
      scheduledHrs:(() => {
        const [st,en]=s.time.split("–");
        const [sh,sm]=st.split(":").map(Number);
        const [eh,em]=en.split(":").map(Number);
        let d=(eh*60+em)-(sh*60+sm);if(d<0)d+=1440;return +(d/60).toFixed(2);
      })(),
      hoursWorked:parseFloat(row.hoursWorked),
      breakMins:parseInt(row.breakMins)||0,
      rate:s.rate,
      total:calcTotal(shiftId),
      status:"pending",
      submittedAt:new Date().toISOString().split("T")[0],
      approvedBy:null,disputeReason:"",invoiceId:null,
      notes:row.notes||"",
    };
    setTimesheets(p=>[...p,ts]);
    setSubmittedIds(p=>new Set([...p,shiftId]));
  };

  const submitBulk=()=>{
    const toSubmit=[...bulkSelect].filter(id=>!submittedShiftIds.has(id));
    toSubmit.forEach(id=>submitOne(id));
    setBulkSelect(new Set());
  };

  const toggleBulk=(id)=>setBulkSelect(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});
  const toggleAll=()=>setBulkSelect(p=>p.size===unsubmitted.length?new Set():new Set(unsubmitted.map(s=>s.id)));

  const disputed=mySubmitted.filter(t=>t.status==="disputed");

  return (
    <Page title="Timesheets" sub="Review completed shifts and confirm hours — care homes are notified to approve before invoicing" icon="🕐">

      {disputed.length>0&&(
        <Alert type="error" style={{marginBottom:14}}>
          ⚠️ {disputed.length} timesheet{disputed.length>1?"s have":" has"} been disputed by the care home. Review below and resubmit.
        </Alert>
      )}

      {/* Tabs + view toggle */}
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:8}}>
          {[["unsubmitted",`Awaiting Submission (${unsubmitted.length})`],["submitted","Submitted"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFilterStatus(v)} style={{padding:"8px 16px",borderRadius:8,border:"none",background:filterStatus===v?T.navy:"#eef1f6",color:filterStatus===v?T.white:T.muted,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"Syne,sans-serif"}}>
              {l}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:4,background:"#eef1f6",padding:3,borderRadius:8}}>
          {[["list","☰ List"],["week","📅 Week"]].map(([v,l])=>(
            <button key={v} onClick={()=>setTsView(v)} style={{padding:"6px 14px",borderRadius:6,border:"none",background:tsView===v?T.white:"transparent",color:tsView===v?T.navy:T.muted,fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:"Syne,sans-serif",boxShadow:tsView===v?"0 1px 3px rgba(0,0,0,0.1)":"none",transition:"all 0.15s"}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* ── WEEK VIEW ──────────────────────────────────────────────────────── */}
      {tsView==="week"&&(()=>{
        const weekDays=Array.from({length:7},(_,i)=>{const d=new Date(weekStart);d.setDate(d.getDate()+i);return d.toISOString().split("T")[0];});
        const dayLabels=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
        const prevWeek=()=>{const d=new Date(weekStart);d.setDate(d.getDate()-7);setWeekStart(d.toISOString().split("T")[0]);};
        const nextWeek=()=>{const d=new Date(weekStart);d.setDate(d.getDate()+7);setWeekStart(d.toISOString().split("T")[0]);};
        const allWeekShifts=myFilledShifts.filter(s=>weekDays.includes(s.date));
        const workerNames=[...new Set(allWeekShifts.map(s=>s.worker))];
        const weekLabel=`${new Date(weekDays[0]).toLocaleDateString("en-GB",{day:"numeric",month:"short"})} – ${new Date(weekDays[6]).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}`;
        return (
          <>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <Btn small variant="secondary" onClick={prevWeek}>← Prev</Btn>
              <span style={{fontWeight:700,fontSize:14,color:T.navy,minWidth:200,textAlign:"center"}}>{weekLabel}</span>
              <Btn small variant="secondary" onClick={nextWeek}>Next →</Btn>
            </div>
            {workerNames.length===0
              ? <Card style={{padding:32,textAlign:"center"}}><div style={{fontSize:28,marginBottom:8}}>📅</div><div style={{fontWeight:700}}>No shifts this week</div><p style={{color:T.muted,fontSize:13,marginTop:4}}>Navigate to a different week.</p></Card>
              : <Card style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
                    <thead>
                      <tr style={{background:"#f8fafc",borderBottom:`2px solid ${T.border}`}}>
                        <th style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",minWidth:130,borderRight:`1px solid ${T.border}`}}>Worker</th>
                        {weekDays.map((date,i)=>{
                          const isToday=date==="2026-03-10";
                          return <th key={date} style={{padding:"8px 6px",textAlign:"center",fontSize:10,fontWeight:700,color:isToday?T.amber:i>=5?T.purple:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",borderRight:i<6?`1px solid ${T.border}`:"none",background:isToday?"#fffbeb":"transparent",minWidth:86}}>
                            <div>{dayLabels[i]}</div>
                            <div style={{fontSize:14,fontWeight:800,color:isToday?T.amber:T.text,marginTop:2}}>{new Date(date).getDate()}</div>
                          </th>;
                        })}
                        <th style={{padding:"10px 8px",textAlign:"center",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",borderLeft:`2px solid ${T.border}`,minWidth:80}}>Total Hrs</th>
                        <th style={{padding:"10px 8px",textAlign:"center",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",minWidth:80}}>Total Pay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workerNames.map(worker=>{
                        const ws=allWeekShifts.filter(s=>s.worker===worker);
                        const totalHrs=weekDays.reduce((acc,date)=>{const s=ws.find(s=>s.date===date);if(!s)return acc;const ts=timesheets.find(t=>t.shiftId===s.id);return acc+(ts?ts.hoursWorked:parseFloat(rowData[s.id]?.hoursWorked||0));},0);
                        const totalPay=weekDays.reduce((acc,date)=>{const s=ws.find(s=>s.date===date);if(!s)return acc;const ts=timesheets.find(t=>t.shiftId===s.id);const hrs=ts?ts.hoursWorked:parseFloat(rowData[s.id]?.hoursWorked||0);return acc+(hrs*s.rate);},0);
                        return (
                          <tr key={worker} style={{borderBottom:`1px solid ${T.border}`}}>
                            <td style={{padding:"12px 14px",borderRight:`1px solid ${T.border}`,background:"#fafbfd"}}>
                              <div style={{fontWeight:700,fontSize:13}}>{worker}</div>
                              {ws[0]?.role&&<Badge label={ws[0].role} color={T.purple} bg={T.purpleBg}/>}
                            </td>
                            {weekDays.map((date,i)=>{
                              const s=ws.find(s=>s.date===date);
                              const ts=s?timesheets.find(t=>t.shiftId===s.id):null;
                              const submitted=s?(submittedShiftIds.has(s.id)||submittedIds.has(s.id)):false;
                              const row=s?rowData[s.id]:null;
                              const isToday=date==="2026-03-10";
                              if(!s) return <td key={date} style={{padding:"10px 6px",textAlign:"center",borderRight:i<6?`1px solid ${T.border}`:"none",background:isToday?"#fffbeb22":"transparent"}}><span style={{fontSize:12,color:"#e2e8f0"}}>—</span></td>;
                              const hrs=ts?ts.hoursWorked:parseFloat(row?.hoursWorked||0);
                              return (
                                <td key={date} style={{padding:"6px 5px",textAlign:"center",borderRight:i<6?`1px solid ${T.border}`:"none",background:isToday?"#fffbeb44":ts?.status==="disputed"?T.redBg:submitted?"#f0fff4":"transparent",verticalAlign:"middle"}}>
                                  <div style={{fontSize:9,color:T.muted,marginBottom:2}}>{s.time.split("–")[0]}</div>
                                  {submitted||ts
                                    ? <div><span style={{fontWeight:800,fontSize:15,color:ts?.status==="disputed"?T.red:T.green}}>{hrs}h</span><div style={{marginTop:2}}>{ts?<TsBadge s={ts.status}/>:<Badge label="✓" color={T.green} bg={T.greenBg}/>}</div></div>
                                    : <div>
                                        <input type="number" step="0.25" min="0" max="24" value={row?.hoursWorked||""} onChange={e=>setRow(s.id,"hoursWorked",e.target.value)}
                                          style={{width:54,padding:"5px 6px",borderRadius:6,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Syne,sans-serif",fontWeight:700,outline:"none",textAlign:"center"}}/>
                                        <div style={{marginTop:4}}>
                                          <button onClick={()=>submitOne(s.id)} style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:5,background:T.navy,color:T.white,border:"none",cursor:"pointer",fontFamily:"Syne,sans-serif"}}>Submit</button>
                                        </div>
                                      </div>
                                  }
                                </td>
                              );
                            })}
                            <td style={{padding:"12px 8px",textAlign:"center",borderLeft:`2px solid ${T.border}`,background:"#f8fafc"}}><span style={{fontWeight:800,fontSize:16,color:T.navy}}>{totalHrs.toFixed(1)}h</span></td>
                            <td style={{padding:"12px 8px",textAlign:"center",background:"#f8fafc"}}><span style={{fontWeight:800,fontSize:14,color:T.green}}>£{totalPay.toFixed(0)}</span></td>
                          </tr>
                        );
                      })}
                      {/* Totals footer */}
                      <tr style={{background:"#f0f4f8",borderTop:`2px solid ${T.border}`}}>
                        <td style={{padding:"10px 14px",fontWeight:800,fontSize:11,color:T.muted,textTransform:"uppercase",borderRight:`1px solid ${T.border}`}}>Daily Totals</td>
                        {weekDays.map((date,i)=>{
                          const hrs=allWeekShifts.filter(s=>s.date===date).reduce((acc,s)=>{const ts=timesheets.find(t=>t.shiftId===s.id);return acc+(ts?ts.hoursWorked:parseFloat(rowData[s.id]?.hoursWorked||0));},0);
                          return <td key={date} style={{padding:"10px 6px",textAlign:"center",borderRight:i<6?`1px solid ${T.border}`:"none"}}>
                            {hrs>0?<span style={{fontWeight:700,fontSize:13,color:T.navy}}>{hrs.toFixed(1)}h</span>:<span style={{fontSize:12,color:"#e2e8f0"}}>—</span>}
                          </td>;
                        })}
                        <td style={{padding:"10px 8px",textAlign:"center",borderLeft:`2px solid ${T.border}`,background:"#e8edf4"}}><span style={{fontWeight:800,fontSize:15,color:T.navy}}>{allWeekShifts.reduce((acc,s)=>{const ts=timesheets.find(t=>t.shiftId===s.id);return acc+(ts?ts.hoursWorked:parseFloat(rowData[s.id]?.hoursWorked||0));},0).toFixed(1)}h</span></td>
                        <td style={{padding:"10px 8px",textAlign:"center",background:"#e8edf4"}}><span style={{fontWeight:800,fontSize:14,color:T.green}}>£{allWeekShifts.reduce((acc,s)=>{const ts=timesheets.find(t=>t.shiftId===s.id);const hrs=ts?ts.hoursWorked:parseFloat(rowData[s.id]?.hoursWorked||0);return acc+(hrs*s.rate);},0).toFixed(0)}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
            }
          </>
        );
      })()}

      {tsView==="list"&&<>
      {filterStatus==="unsubmitted"&&(
        <>
          {unsubmitted.length===0?(
            <Card style={{padding:40,textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:10}}>✅</div>
              <div style={{fontWeight:700,fontSize:15,marginBottom:6}}>All shifts submitted</div>
              <p style={{color:T.muted,fontSize:13}}>No completed shifts are awaiting timesheet submission. Switch to "Submitted" to track approvals.</p>
            </Card>
          ):(
            <>
              {/* Info banner */}
              <div style={{background:"#f0f7ff",border:`1px solid ${T.blue}44`,borderRadius:12,padding:"14px 18px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontWeight:700,fontSize:13,color:T.blue,marginBottom:3}}>📋 {unsubmitted.length} completed shift{unsubmitted.length>1?"s":""} ready to submit</div>
                  <div style={{fontSize:12,color:T.muted}}>Worker and shift details are pre-filled from the booking. Just confirm the hours worked and break taken, then submit for care home approval.</div>
                </div>
                {bulkSelect.size>0&&(
                  <Btn onClick={submitBulk}>Submit {bulkSelect.size} selected →</Btn>
                )}
              </div>

              {/* Table */}
              <Card>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead>
                      <tr style={{background:"#f8fafc",borderBottom:`2px solid ${T.border}`}}>
                        <th style={{padding:"10px 12px",textAlign:"left"}}>
                          <input type="checkbox" checked={bulkSelect.size===unsubmitted.length&&unsubmitted.length>0} onChange={toggleAll} style={{cursor:"pointer"}}/>
                        </th>
                        {["Worker","Role","Care Home","Date","Shift Time","Sched. Hrs","Hrs Worked","Break (min)","Rate","Total","Notes","Action"].map(h=>(
                          <th key={h} style={{padding:"10px 8px",textAlign:"left",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {unsubmitted.map(s=>{
                        const row=rowData[s.id]||{hoursWorked:"12",breakMins:"30",notes:""};
                        const total=calcTotal(s.id);
                        const justSubmitted=submittedIds.has(s.id);
                        const selected=bulkSelect.has(s.id);
                        const schedHrs=(()=>{const [st,en]=s.time.split("–");const[sh,sm]=st.split(":").map(Number);const[eh,em]=en.split(":").map(Number);let d=(eh*60+em)-(sh*60+sm);if(d<0)d+=1440;return+(d/60).toFixed(1);})();
                        const hrsDiff=parseFloat(row.hoursWorked)-schedHrs;
                        return(
                          <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`,background:justSubmitted?"#f0fff4":selected?"#f0f7ff":"transparent",transition:"background 0.15s"}}>
                            <td style={{padding:"10px 12px"}}>
                              {justSubmitted
                                ?<span style={{color:T.green,fontSize:16}}>✓</span>
                                :<input type="checkbox" checked={selected} onChange={()=>toggleBulk(s.id)} style={{cursor:"pointer"}}/>}
                            </td>
                            <td style={{padding:"10px 8px",fontWeight:700,fontSize:13,whiteSpace:"nowrap"}}>{s.worker}</td>
                            <td style={{padding:"10px 8px"}}><Badge label={s.role} color={T.purple} bg={T.purpleBg}/></td>
                            <td style={{padding:"10px 8px",fontSize:13,color:T.muted,whiteSpace:"nowrap"}}>{s.carehome}</td>
                            <td style={{padding:"10px 8px",fontSize:12,whiteSpace:"nowrap"}}>{s.date}</td>
                            <td style={{padding:"10px 8px",fontSize:12,color:T.muted,whiteSpace:"nowrap"}}>{s.time}</td>
                            <td style={{padding:"10px 8px",fontSize:12,color:T.muted,textAlign:"center"}}>{schedHrs}h</td>
                            <td style={{padding:"6px 4px",minWidth:72}}>
                              {justSubmitted
                                ?<span style={{fontWeight:700,color:T.green}}>{row.hoursWorked}h</span>
                                :<div style={{position:"relative"}}>
                                  <input
                                    type="number" step="0.25" min="0" max="24"
                                    value={row.hoursWorked}
                                    onChange={e=>setRow(s.id,"hoursWorked",e.target.value)}
                                    style={{width:68,padding:"6px 8px",borderRadius:7,border:`1.5px solid ${hrsDiff<-0.5||hrsDiff>0?T.yellow:T.border}`,fontSize:13,fontFamily:"Syne,sans-serif",fontWeight:700,outline:"none",textAlign:"center",background:hrsDiff<-0.5||hrsDiff>0?"#fffbeb":T.white}}
                                  />
                                  {(hrsDiff<-0.5||hrsDiff>0.01)&&(
                                    <div style={{position:"absolute",top:-18,left:"50%",transform:"translateX(-50%)",background:T.yellow,color:T.white,fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:4,whiteSpace:"nowrap"}}>
                                      {hrsDiff>0?"+":""}{hrsDiff.toFixed(1)}h vs booked
                                    </div>
                                  )}
                                </div>}
                            </td>
                            <td style={{padding:"6px 4px",minWidth:64}}>
                              {justSubmitted
                                ?<span style={{fontSize:12,color:T.muted}}>{row.breakMins}m</span>
                                :<input
                                  type="number" step="5" min="0" max="60"
                                  value={row.breakMins}
                                  onChange={e=>setRow(s.id,"breakMins",e.target.value)}
                                  style={{width:58,padding:"6px 8px",borderRadius:7,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Syne,sans-serif",outline:"none",textAlign:"center"}}
                                />}
                            </td>
                            <td style={{padding:"10px 8px",fontSize:12,fontWeight:600}}>£{s.rate}{"/hr"}</td>
                            <td style={{padding:"10px 8px"}}>
                              <span style={{fontWeight:800,color:T.green,fontSize:14}}>£{total.toLocaleString()}</span>
                            </td>
                            <td style={{padding:"6px 4px",minWidth:120}}>
                              {justSubmitted
                                ?<span style={{fontSize:12,color:T.muted,fontStyle:"italic"}}>{row.notes||"—"}</span>
                                :<input
                                  value={row.notes}
                                  onChange={e=>setRow(s.id,"notes",e.target.value)}
                                  placeholder="Optional note…"
                                  style={{width:120,padding:"6px 8px",borderRadius:7,border:`1.5px solid ${T.border}`,fontSize:12,fontFamily:"Syne,sans-serif",outline:"none"}}
                                />}
                            </td>
                            <td style={{padding:"6px 8px"}}>
                              {justSubmitted
                                ?<Badge label="Submitted ✓" color={T.green} bg={T.greenBg}/>
                                :<Btn small onClick={()=>submitOne(s.id)}>Submit →</Btn>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {unsubmitted.filter(s=>!submittedIds.has(s.id)).length>1&&(
                  <div style={{padding:"12px 16px",borderTop:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontSize:12,color:T.muted}}>
                      Total if all submitted: <strong style={{color:T.green}}>£{unsubmitted.filter(s=>!submittedIds.has(s.id)).reduce((a,s)=>a+calcTotal(s.id),0).toLocaleString()}</strong>
                    </span>
                    <Btn onClick={()=>unsubmitted.filter(s=>!submittedIds.has(s.id)).forEach(s=>submitOne(s.id))}>Submit All →</Btn>
                  </div>
                )}
              </Card>
            </>
          )}
        </>
      )}

      {filterStatus==="submitted"&&(
        <>
          <Grid cols={4}>
            <Stat label="Pending Approval" value={mySubmitted.filter(t=>t.status==="pending").length} accent/>
            <Stat label="Approved" value={mySubmitted.filter(t=>t.status==="approved").length}/>
            <Stat label="Disputed" value={disputed.length} sub={disputed.length>0?"Action needed":""}/>
            <Stat label="Invoiced" value={mySubmitted.filter(t=>t.status==="invoiced").length}/>
          </Grid>
          <Card>
            <Table
              headers={["ID","Worker","Care Home","Date","Hrs Booked","Hrs Submitted","Rate","Total","Status","Submitted","Action"]}
              rows={mySubmitted.map(ts=>(
                <tr key={ts.id} style={{borderBottom:`1px solid ${T.border}`,background:ts.status==="disputed"?T.redBg:ts.status==="approved"?"#f0fff4":"transparent"}}>
                  <Td><span style={{fontFamily:"monospace",fontSize:11,fontWeight:700,color:T.navy}}>{ts.id}</span></Td>
                  <Td bold>{ts.worker}</Td>
                  <Td>{ts.carehome}</Td>
                  <Td>{ts.date}</Td>
                  <Td style={{color:T.muted}}>{ts.scheduledHrs}h</Td>
                  <Td bold>{ts.hoursWorked}h</Td>
                  <Td>£{ts.rate}{"/hr"}</Td>
                  <Td><span style={{fontWeight:800,color:T.green}}>£{ts.total.toLocaleString()}</span></Td>
                  <Td><TsBadge s={ts.status}/></Td>
                  <Td style={{fontSize:11,color:T.muted}}>{ts.submittedAt}</Td>
                  <Td>
                    {ts.status==="disputed"?(
                      <div style={{display:"flex",gap:5}}>
                        <Btn small onClick={()=>setTimesheets(prev=>prev.map(t=>t.id===ts.id?{...t,status:"pending",disputeReason:null}:t))}>Resubmit</Btn>
                        <Btn small variant="secondary" onClick={()=>alert(`Dispute reason: "${ts.disputeReason}"`)}>Reason</Btn>
                      </div>
                    ):<Btn small variant="secondary" onClick={()=>alert(`Timesheet ${ts.id}\nWorker: ${ts.worker}\nDate: ${ts.date}\nHours: ${ts.hoursWorked}h @ £${ts.rate}{"/hr"} = £${ts.total}\nStatus: ${ts.status}`)}>View</Btn>}
                  </Td>
                </tr>
              ))}
            />
          </Card>
          {disputed.length>0&&(
            <Card style={{marginTop:16,border:`1.5px solid ${T.red}55`}}>
              <CardHead title="Disputes Raised" icon="⚠️" sub="Care home queries — correct and resubmit"/>
              {disputed.map(ts=>(
                <div key={ts.id} style={{margin:"10px 14px",padding:"14px 16px",background:T.redBg,borderRadius:8,border:`1.5px solid ${T.red}33`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,flexWrap:"wrap",gap:6}}>
                    <span style={{fontWeight:700,fontSize:13}}>{ts.worker} — {ts.carehome} ({ts.date})</span>
                    <span style={{fontFamily:"monospace",fontSize:11,color:T.muted}}>{ts.id}</span>
                  </div>
                  <div style={{fontSize:12,color:T.red,fontWeight:600,marginBottom:10}}>🚩 "{ts.disputeReason}"</div>
                  <div style={{display:"flex",gap:8}}>
                    <Btn small onClick={()=>setTimesheets(prev=>prev.map(t=>t.id===ts.id?{...t,status:"pending",disputeReason:null}:t))}>Correct & Resubmit</Btn>
                    <Btn small variant="secondary" onClick={()=>alert(`Message sent to ${ts.carehome} regarding timesheet ${ts.id}. They will respond within 1 working day.`)}>Contact Care Home</Btn>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </>
      )}
      </>}{/* end tsView==="list" */}
    </Page>
  );
};

/* ─── CARE HOME: TIMESHEETS ──────────────────────────────────────────────────── */
const CareHomeTimesheets = ({timesheets,setTimesheets,user,invoices,setInvoices}) => {
  const approverName = user?.name || "Karen Hughes";
  const mySite = user?.org || "Sunrise Care";

  const autoGroupInvoice = (ts, updatedTimesheets) => {
    if(!setInvoices) return;
    // Build draft invoice key: agency + current month
    const month = new Date().toLocaleString("en-GB",{month:"long",year:"numeric"});
    const draftId = `DRAFT-${ts.agency.replace(/\s+/g,"-")}-${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}`;
    // All approved timesheets for this agency (including the one just approved)
    const agencyApproved = updatedTimesheets.filter(t => t.agency===ts.agency && (t.status==="approved"||t.id===ts.id) && !t.invoiceId);
    const total = agencyApproved.reduce((a,t)=>a+t.total,0);
    setInvoices(prev => {
      const exists = prev.find(i=>i.id===draftId);
      if(exists) {
        return prev.map(i=>i.id===draftId ? {...i, shifts:agencyApproved.length, amount:total} : i);
      }
      return [...prev, {
        id:draftId,
        agency:ts.agency,
        period:month,
        shifts:agencyApproved.length,
        amount:total,
        status:"draft",
        due:"—",
        issued:"—",
        isDraft:true,
      }];
    });
  };

  const approve = (id) => {
    const ts = timesheets.find(t=>t.id===id);
    if(!ts) return;
    const updated = timesheets.map(t=>t.id===id?{...t,status:"approved",approvedBy:approverName}:t);
    setTimesheets(updated);
    autoGroupInvoice({...ts,status:"approved"}, updated);
  };

  const [disputeModal,setDisputeModal]=useState(null);
  const [disputeText,setDisputeText]=useState("");

  const mySheets = timesheets.filter(t=>t.carehome===mySite);
  const pending = mySheets.filter(t=>t.status==="pending");
  const disputeSubmit = () => {
    if(!disputeText.trim())return;
    setTimesheets(p=>p.map(t=>t.id===disputeModal.id?{...t,status:"disputed",disputeReason:disputeText}:t));
    setDisputeModal(null); setDisputeText("");
  };

  return (
    <Page title="Timesheets" sub="Review and approve agency-submitted hours before invoices are generated" icon="🕐">
      {disputeModal&&(
        <Modal title="Raise a Dispute" onClose={()=>setDisputeModal(null)}>
          <div style={{background:"#f8fafc",borderRadius:8,padding:"12px 14px",marginBottom:14,fontSize:13}}>
            <div style={{fontWeight:700,marginBottom:4}}>{disputeModal.worker} — {disputeModal.role}</div>
            <div style={{color:T.muted}}>{disputeModal.date} · {disputeModal.time} · {disputeModal.hoursWorked}hrs · £{disputeModal.total}</div>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Reason for Dispute *</label>
            <textarea value={disputeText} onChange={e=>setDisputeText(e.target.value)} rows={3} placeholder="e.g. Worker arrived 45 minutes late, hours should be 11.25 not 12…" style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${T.red}`,fontSize:13,fontFamily:"Syne,sans-serif",resize:"vertical",outline:"none"}}/>
          </div>
          <Alert type="warn">The agency will be notified and asked to correct and resubmit the timesheet.</Alert>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="secondary" onClick={()=>setDisputeModal(null)}>Cancel</Btn>
            <Btn onClick={disputeSubmit} style={{background:T.red}}>Raise Dispute</Btn>
          </div>
        </Modal>
      )}

      {pending.length>0&&(
        <div style={{background:`linear-gradient(135deg,${T.blue}18,${T.blueBg})`,borderRadius:12,padding:"14px 18px",marginBottom:18,border:`1px solid ${T.blue}44`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontWeight:700,fontSize:14,color:T.blue,marginBottom:4}}>✋ {pending.length} timesheet{pending.length>1?"s":""}  awaiting your approval</div>
            <div style={{fontSize:13,color:T.text}}>Review hours submitted by agencies. Approving will trigger invoice generation. Disputes are sent back to the agency.</div>
          </div>
          <Badge label={`£${pending.reduce((a,t)=>a+t.total,0).toLocaleString()} to approve`} color={T.blue} bg={T.blueBg}/>
        </div>
      )}

      <Grid cols={4}>
        <Stat label="Awaiting Approval" value={pending.length} sub="Your action needed" accent/>
        <Stat label="Approved (MTD)" value={mySheets.filter(t=>t.status==="approved"||t.status==="invoiced").length}/>
        <Stat label="Disputed" value={mySheets.filter(t=>t.status==="disputed").length}/>
        <Stat label="Total Approved Value" value={`£${mySheets.filter(t=>["approved","invoiced"].includes(t.status)).reduce((a,t)=>a+t.total,0).toLocaleString()}`}/>
      </Grid>

      {pending.length>0&&(
        <Card style={{marginBottom:18,border:`2px solid ${T.blue}55`}}>
          <CardHead title="Pending Your Approval" icon="⏳" sub="Review each entry carefully before approving"/>
          {pending.map(ts=>(
            <div key={ts.id} style={{margin:"0 14px 12px",padding:"16px 18px",background:"#f8fbff",borderRadius:10,border:`1.5px solid ${T.blue}33`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontWeight:700,fontSize:14,color:T.text,marginBottom:3}}>{ts.worker} <span style={{color:T.muted,fontWeight:400}}>·</span> <Badge label={ts.role} color={T.purple} bg={T.purpleBg}/></div>
                  <div style={{fontSize:12,color:T.muted}}>{ts.agency} · {ts.date} · {ts.time}</div>
                </div>
                <span style={{fontFamily:"monospace",fontSize:11,color:T.muted,background:"#eef2f7",padding:"3px 8px",borderRadius:5}}>{ts.id}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
                {[["Hours Worked",`${ts.hoursWorked}hrs`],["Break",`${ts.breakMins} mins`],["Rate",`£${ts.rate}{"/hr"}`],["Total Payable",`£${ts.total.toLocaleString()}`]].map(([k,v],i)=>(
                  <div key={i} style={{background:T.white,borderRadius:7,padding:"10px 12px",border:`1px solid ${T.border}`,textAlign:"center"}}>
                    <div style={{fontSize:10,color:T.muted,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>{k}</div>
                    <div style={{fontSize:i===3?16:14,fontWeight:800,color:i===3?T.green:T.text}}>{v}</div>
                  </div>
                ))}
              </div>
              {ts.disputeReason&&<Alert type="warn" style={{marginBottom:10}}>{ts.disputeReason}</Alert>}
              <div style={{display:"flex",gap:10}}>
                <Btn onClick={()=>approve(ts.id)}>✓ Approve Hours</Btn>
                <Btn variant="secondary" onClick={()=>setDisputeModal(ts)} style={{borderColor:T.red,color:T.red}}>✕ Dispute</Btn>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Card>
        <CardHead title="All Timesheets" sub="Full history for your care home"/>
        <Table
          headers={["ID","Worker","Agency","Date","Hours","Total","Status","Approved By","Action"]}
          rows={mySheets.map(ts=>(
            <tr key={ts.id} style={{borderBottom:`1px solid ${T.border}`,background:ts.status==="disputed"?T.redBg:ts.status==="approved"?"#f0fff4":"transparent"}}>
              <Td><span style={{fontFamily:"monospace",fontSize:11,fontWeight:700}}>{ts.id}</span></Td>
              <Td bold>{ts.worker}</Td>
              <Td><span style={{fontSize:12,color:T.muted}}>{ts.agency}</span></Td>
              <Td>{ts.date}</Td>
              <Td bold>{ts.hoursWorked}hrs</Td>
              <Td><span style={{fontWeight:800,color:T.green}}>£{ts.total.toLocaleString()}</span></Td>
              <Td><TsBadge s={ts.status}/></Td>
              <Td><span style={{fontSize:12,color:T.muted}}>{ts.approvedBy||"—"}</span></Td>
              <Td>
                {ts.status==="pending"?(
                  <div style={{display:"flex",gap:5}}>
                    <Btn small onClick={()=>approve(ts.id)}>Approve</Btn>
                    <Btn small variant="secondary" onClick={()=>setDisputeModal(ts)}>Dispute</Btn>
                  </div>
                ):<Btn small variant="secondary" onClick={()=>alert(`Timesheet ${ts.id}\n${ts.worker} — ${ts.carehome}\n${ts.date} · ${ts.hoursWorked}h @ £${ts.rate}{"/hr"} = £${ts.total}\nStatus: ${ts.status}${ts.approvedBy?'\nApproved by: '+ts.approvedBy:''}`)}>View</Btn>}
              </Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};

/* ─── ADMIN: TIMESHEETS ──────────────────────────────────────────────────────── */
const AdminTimesheets = ({timesheets,setTimesheets,invoices,setInvoices}) => {
  const [filterAgency,setFilterAgency]   = useState("All");
  const [filterStatus,setFilterStatus]   = useState("all");
  const [expandedInv,setExpandedInv]     = useState(null);
  const [confirmedInv,setConfirmedInv]   = useState(null);

  const approved  = timesheets.filter(t=>t.status==="approved");
  const pending   = timesheets.filter(t=>t.status==="pending");
  const disputed  = timesheets.filter(t=>t.status==="disputed");
  const invoiced  = timesheets.filter(t=>t.status==="invoiced");

  const agencies = ["All",...[...new Set(timesheets.map(t=>t.agency))]];
  const filtered = timesheets
    .filter(t=>filterAgency==="All"||t.agency===filterAgency)
    .filter(t=>filterStatus==="all"||t.status===filterStatus);

  // Group ALL approved timesheets by agency into draft invoice batches
  const draftGroups = [...new Set(approved.map(t=>t.agency))].map(agency => {
    const sheets = approved.filter(t=>t.agency===agency);
    const total  = sheets.reduce((a,t)=>a+t.total,0);
    // Find existing draft invoice for this agency or generate an id
    const existing = invoices?.find(i=>i.agency===agency&&i.status==="draft"&&i.isDraft);
    return { agency, sheets, total, draftId: existing?.id || `DRAFT-${agency.replace(/\s+/g,"-")}` };
  });

  const finaliseInvoice = (group) => {
    const invId   = `INV-${String(Math.floor(Math.random()*900)+100).padStart(4,"0")}`;
    const today   = new Date().toISOString().split("T")[0];
    const dueDate = new Date(); dueDate.setDate(dueDate.getDate()+30);
    const due     = dueDate.toISOString().split("T")[0];
    const period  = new Date().toLocaleString("en-GB",{month:"long",year:"numeric"});

    // Stamp all approved timesheets for this agency as invoiced
    setTimesheets(p=>p.map(t=>
      t.agency===group.agency&&t.status==="approved"
        ? {...t, status:"invoiced", invoiceId:invId}
        : t
    ));

    // Replace draft with finalised invoice
    if(setInvoices) {
      setInvoices(p=>[
        ...p.filter(i=>!(i.agency===group.agency&&i.status==="draft"&&i.isDraft)),
        { id:invId, agency:group.agency, period, shifts:group.sheets.length,
          amount:group.total, status:"pending", due, issued:today, isDraft:false }
      ]);
    }
    setConfirmedInv({id:invId, agency:group.agency, count:group.sheets.length, total:group.total, due});
    setExpandedInv(null);
  };

  const tsExports = [
    {icon:"📋",label:"All Timesheets — CSV",fn:()=>exportCSV("fcc-timesheets.csv",
      ["ID","Agency","Location","Worker","Role","Date","Hours","Rate (£)","Total (£)","Status"],
      timesheets.map(t=>[t.id,t.agency,t.carehome,t.worker,t.role,t.date,t.hoursWorked,t.rate,t.total,t.status]))},
    {icon:"✅",label:"Approved Timesheets — CSV",fn:()=>exportCSV("fcc-timesheets-approved.csv",
      ["ID","Agency","Location","Worker","Role","Date","Hours","Total (£)","Approved By"],
      timesheets.filter(t=>t.status==="approved").map(t=>[t.id,t.agency,t.carehome,t.worker,t.role,t.date,t.hoursWorked,t.total,t.approvedBy]))},
    {icon:"⚠️",label:"Disputed Timesheets — CSV",fn:()=>exportCSV("fcc-timesheets-disputed.csv",
      ["ID","Agency","Location","Worker","Role","Date","Hours","Total (£)","Dispute Reason"],
      timesheets.filter(t=>t.status==="disputed").map(t=>[t.id,t.agency,t.carehome,t.worker,t.role,t.date,t.hoursWorked,t.total,t.disputeReason]))},
    {icon:"🖨️",label:"Full Timesheet Report — PDF",fn:()=>exportHTML("Timesheet Report","All timesheets — Nexus RPO",
      buildTable(["ID","Agency","Location","Worker","Role","Date","Hours","Total","Status"],
        timesheets.map(t=>[t.id,t.agency,t.carehome,t.worker,t.role,t.date,t.hoursWorked,`£${t.total}`,t.status.toUpperCase()])))},
  ];

  return (
    <Page title="Timesheets" sub="Approval pipeline — approved timesheets are auto-grouped into invoices by agency" icon="🕐" action={<ExportMenu exports={tsExports}/>}>

      {/* Confirmation modal */}
      {confirmedInv && (
        <Modal title="✅ Invoice Finalised" onClose={()=>setConfirmedInv(null)}>
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:40,marginBottom:12}}>🧾</div>
            <div style={{fontSize:22,fontWeight:800,color:T.navy,marginBottom:4}}>{confirmedInv.id}</div>
            <div style={{fontSize:14,color:T.muted,marginBottom:20}}>{confirmedInv.agency} · {confirmedInv.count} timesheets</div>
            <div style={{fontSize:36,fontWeight:800,color:T.green,marginBottom:6}}>£{confirmedInv.total.toLocaleString()}</div>
            <div style={{fontSize:12,color:T.muted,marginBottom:24}}>Payment due {confirmedInv.due} · Invoice sent to {confirmedInv.agency}</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <Btn onClick={()=>exportHTML(confirmedInv.id,`${confirmedInv.agency} · Invoice`,buildTable(["Invoice ID","Agency","Timesheets","Total","Due"],[[confirmedInv.id,confirmedInv.agency,confirmedInv.count,`£${confirmedInv.total.toLocaleString()}`,confirmedInv.due]]))}>Download PDF</Btn>
              <Btn variant="secondary" onClick={()=>setConfirmedInv(null)}>Close</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Stats */}
      <Grid cols={4}>
        <Stat label="Pending Approval" value={pending.length} sub="Awaiting care home" accent/>
        <Stat label="Grouped & Ready" value={approved.length} sub={`${draftGroups.length} draft invoice${draftGroups.length!==1?"s":""}`}/>
        <Stat label="Disputed" value={disputed.length} sub={disputed.length>0?"Needs resolution":"All clear"}/>
        <Stat label="Invoiceable Value" value={`£${approved.reduce((a,t)=>a+t.total,0).toLocaleString()}`} sub="Ready to finalise"/>
      </Grid>

      {/* Draft invoice groups — auto-built from approvals */}
      {draftGroups.length>0 && (
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <h3 style={{fontWeight:800,fontSize:14,color:T.text}}>🧾 Draft Invoices</h3>
            <span style={{fontSize:11,color:T.muted,background:"#f0f4f8",padding:"2px 8px",borderRadius:20,fontWeight:600}}>
              Auto-grouped when care homes approve timesheets
            </span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {draftGroups.map(group=>{
              const isExpanded = expandedInv===group.agency;
              return (
                <Card key={group.agency} style={{overflow:"hidden",border:`1.5px solid ${T.green}55`}}>
                  {/* Group header */}
                  <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",background:"#f0fff4"}}>
                    <div style={{flex:1,minWidth:200}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                        <span style={{fontWeight:800,fontSize:15,color:T.navy}}>{group.agency}</span>
                        <Badge label="Draft" color={T.green} bg={T.greenBg} dot/>
                        <span style={{fontSize:11,color:T.muted,background:"#e8f5e9",padding:"2px 8px",borderRadius:20,fontWeight:600}}>
                          {group.sheets.length} approved timesheet{group.sheets.length!==1?"s":""}
                        </span>
                      </div>
                      <div style={{fontSize:12,color:T.muted}}>
                        {[...new Set(group.sheets.map(t=>t.carehome))].join(" · ")}
                        {" · "}{group.sheets.reduce((a,t)=>a+t.hoursWorked,0).toFixed(1)} total hours
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:24,fontWeight:800,color:T.green}}>£{group.total.toLocaleString()}</div>
                        <div style={{fontSize:11,color:T.muted}}>Total value</div>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <Btn small variant="secondary" onClick={()=>setExpandedInv(isExpanded?null:group.agency)}>
                          {isExpanded?"Hide":"View"} breakdown
                        </Btn>
                        <Btn small onClick={()=>finaliseInvoice(group)}>Finalise Invoice →</Btn>
                      </div>
                    </div>
                  </div>

                  {/* Expanded breakdown */}
                  {isExpanded && (
                    <div style={{borderTop:`1px solid ${T.border}`}}>
                      <table style={{width:"100%",borderCollapse:"collapse"}}>
                        <thead>
                          <tr style={{background:"#f8fafc"}}>
                            {["Timesheet","Worker","Role","Care Home","Date","Hours","Rate","Total","Approved By"].map(h=>(
                              <th key={h} style={{padding:"8px 12px",fontSize:10,fontWeight:700,color:T.muted,textAlign:"left",textTransform:"uppercase",letterSpacing:"0.06em",borderBottom:`1px solid ${T.border}`}}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {group.sheets.map(ts=>(
                            <tr key={ts.id} style={{borderBottom:`1px solid ${T.border}`}}>
                              <Td><span style={{fontFamily:"monospace",fontSize:11,fontWeight:700,color:T.navy}}>{ts.id}</span></Td>
                              <Td bold>{ts.worker}</Td>
                              <Td><Badge label={ts.role} color={T.purple} bg={T.purpleBg}/></Td>
                              <Td>{ts.carehome}</Td>
                              <Td>{ts.date}</Td>
                              <Td>{ts.hoursWorked}h</Td>
                              <Td>£{ts.rate}{"/hr"}</Td>
                              <Td><span style={{fontWeight:800,color:T.green}}>£{ts.total.toLocaleString()}</span></Td>
                              <Td><span style={{fontSize:11,color:T.green}}>✓ {ts.approvedBy}</span></Td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr style={{background:"#f0fff4",borderTop:`2px solid ${T.green}44`}}>
                            <td colSpan={7} style={{padding:"12px 14px",fontWeight:800,fontSize:13,color:T.text}}>Total</td>
                            <td style={{padding:"12px 14px",fontWeight:800,fontSize:16,color:T.green}}>£{group.total.toLocaleString()}</td>
                            <td/>
                          </tr>
                        </tfoot>
                      </table>
                      <div style={{padding:"12px 16px",display:"flex",justifyContent:"flex-end",background:"#f8fafc",borderTop:`1px solid ${T.border}`}}>
                        <Btn onClick={()=>finaliseInvoice(group)}>Finalise & Send Invoice →</Btn>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {draftGroups.length===0 && approved.length===0 && (
        <Card style={{padding:28,marginBottom:18,background:"#f0fff4",border:`1px solid ${T.green}44`}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:28}}>✅</span>
            <div>
              <div style={{fontWeight:700,fontSize:14,color:T.green}}>All caught up</div>
              <div style={{fontSize:12,color:T.muted}}>No approved timesheets waiting — invoices will appear here automatically as care homes approve hours.</div>
            </div>
          </div>
        </Card>
      )}

      {/* All timesheets table with filters */}
      <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:12,color:T.muted,fontWeight:600,marginRight:4}}>Agency:</span>
        {agencies.map(a=><Pill key={a} label={a} active={filterAgency===a} onClick={()=>setFilterAgency(a)}/>)}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:12,color:T.muted,fontWeight:600,marginRight:4}}>Status:</span>
        {["all","pending","approved","disputed","invoiced"].map(s=><Pill key={s} label={s==="all"?"All":s.charAt(0).toUpperCase()+s.slice(1)} active={filterStatus===s} onClick={()=>setFilterStatus(s)}/>)}
      </div>

      <Card>
        <Table
          headers={["ID","Agency","Worker","Care Home","Date","Hours","Rate","Total","Status","Approved By","Invoice"]}
          rows={filtered.map(ts=>(
            <tr key={ts.id} style={{borderBottom:`1px solid ${T.border}`,background:ts.status==="approved"?"#f0fff4":ts.status==="disputed"?T.redBg:ts.status==="invoiced"?"#fffbeb":"transparent"}}>
              <Td><span style={{fontFamily:"monospace",fontSize:11,fontWeight:700}}>{ts.id}</span></Td>
              <Td><span style={{fontSize:12,fontWeight:600}}>{ts.agency}</span></Td>
              <Td bold>{ts.worker}</Td>
              <Td>{ts.carehome}</Td>
              <Td>{ts.date}</Td>
              <Td>{ts.hoursWorked}h</Td>
              <Td>£{ts.rate}{"/hr"}</Td>
              <Td><span style={{fontWeight:800,color:T.green}}>£{ts.total.toLocaleString()}</span></Td>
              <Td><TsBadge s={ts.status}/></Td>
              <Td><span style={{fontSize:11,color:ts.approvedBy?T.green:T.muted}}>{ts.approvedBy||"Pending"}</span></Td>
              <Td>
                {ts.invoiceId
                  ? <span style={{fontFamily:"monospace",fontSize:11,color:T.amber,fontWeight:700}}>{ts.invoiceId}</span>
                  : ts.status==="approved"
                    ? <span style={{fontSize:10,color:T.green,fontWeight:700,background:T.greenBg,padding:"2px 7px",borderRadius:20}}>In draft</span>
                    : <span style={{fontSize:11,color:T.muted}}>—</span>}
              </Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};

/* ─── ADMIN: USERS & PERMISSIONS ─────────────────────────────────────────────── */
const UsersAndPermissions = ({users,setUsers}) => {
  const [roleFilter,setRoleFilter] = useState("all");
  const [editing,setEditing]       = useState(null);  // user being edited
  const [inviteModal,setInviteModal] = useState(false);
  const [invite,setInvite]         = useState({name:"",email:"",role:"carehome",org:""});
  const [search,setSearch]         = useState("");

  const roleColors = {admin:{c:T.amber,bg:T.amberBg},carehome:{c:T.blue,bg:T.blueBg},agency:{c:T.purple,bg:T.purpleBg},bank:{c:T.teal,bg:T.tealBg}};
  const roleLabels = {admin:"Admin",carehome:"Care Home",agency:"Agency",bank:"Bank Staff"};
  const statusColor= {active:{c:T.green,bg:T.greenBg},inactive:{c:T.muted,bg:"#f1f5f9"},suspended:{c:T.red,bg:T.redBg}};

  const filtered = users
    .filter(u=>roleFilter==="all"||u.role===roleFilter)
    .filter(u=>!search||u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase())||u.org.toLowerCase().includes(search.toLowerCase()));

  const togglePerm = (uid,perm) => setUsers(prev=>prev.map(u=>u.id===uid?{...u,perms:{...u.perms,[perm]:!u.perms[perm]}}:u));
  const toggleStatus = (uid,status) => setUsers(prev=>prev.map(u=>u.id===uid?{...u,status}:u));

  const sendInvite = () => {
    if(!invite.name||!invite.email||!invite.org) return;
    const nu = {
      id:`u${users.length+1}`,
      ...invite,
      status:"invited",
      lastLogin:"Never",
      superAdmin:false,
      perms:defaultPerms(invite.role),
      createdAt:new Date().toISOString().split("T")[0],
    };
    setUsers(p=>[...p,nu]);
    setInvite({name:"",email:"",role:"carehome",org:""});
    setInviteModal(false);
  };

  // Toggle chip
  const PermChip = ({on,label,onClick,disabled}) => (
    <button onClick={disabled?undefined:onClick} style={{padding:"4px 10px",borderRadius:20,border:`1.5px solid ${on?T.green:T.border}`,background:on?T.greenBg:"#f8fafc",color:on?T.green:T.muted,fontSize:11,fontWeight:700,cursor:disabled?"not-allowed":"pointer",fontFamily:"Syne,sans-serif",opacity:disabled?0.5:1,transition:"all 0.15s"}}>
      {on?"✓ ":""}{label}
    </button>
  );

  return (
    <Page title="Users & Permissions" sub="Manage who has access to Nexus RPO and what they can see and do" icon="🔐"
      action={<Btn onClick={()=>setInviteModal(true)}>+ Invite User</Btn>}>

      {/* Invite modal */}
      {inviteModal&&(
        <Modal title="Invite New User" onClose={()=>setInviteModal(false)}>
          <div style={{background:T.amberBg,borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:12,color:T.amberText,fontWeight:600}}>
            📧 An invitation email will be sent. The user sets their own password on first login.
          </div>
          <Input label="Full Name *" value={invite.name} onChange={v=>setInvite(p=>({...p,name:v}))} placeholder="e.g. Janet Mills"/>
          <Input label="Email Address *" type="email" value={invite.email} onChange={v=>setInvite(p=>({...p,email:v}))} placeholder="name@organisation.co.uk"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Role *</label>
              <select value={invite.role} onChange={e=>setInvite(p=>({...p,role:e.target.value}))} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Syne,sans-serif",outline:"none",background:"#fafbfd"}}>
                <option value="admin">Admin</option>
                <option value="carehome">Care Home Manager</option>
                <option value="agency">Agency Coordinator</option>
                <option value="bank">Bank Staff</option>
              </select>
            </div>
            <Input label="Organisation *" value={invite.org} onChange={v=>setInvite(p=>({...p,org:v}))} placeholder="Organisation name"/>
          </div>
          <Alert type="info">Default permissions will be applied for the selected role. You can customise them after the user is created.</Alert>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="secondary" onClick={()=>setInviteModal(false)}>Cancel</Btn>
            <Btn onClick={sendInvite}>Send Invitation →</Btn>
          </div>
        </Modal>
      )}

      {/* Permission editor modal */}
      {editing&&(
        <Modal title="Edit Permissions" onClose={()=>setEditing(null)}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#f8fafc",borderRadius:8,marginBottom:16}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${roleColors[editing.role]?.c||T.navy},${T.navy})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:T.white,fontWeight:700,flexShrink:0}}>
              {editing.name.split(" ").map(n=>n[0]).join("")}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:14}}>{editing.name}</div>
              <div style={{fontSize:12,color:T.muted}}>{editing.email} · {editing.org}</div>
            </div>
            <Badge label={roleLabels[editing.role]} color={roleColors[editing.role]?.c} bg={roleColors[editing.role]?.bg} style={{marginLeft:"auto"}}/>
          </div>

          {editing.superAdmin&&(
            <Alert type="info" style={{marginBottom:12}}>This is a super-admin — all permissions are permanently granted and cannot be restricted.</Alert>
          )}

          <div style={{marginBottom:8}}>
            <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Section Access</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {(PERM_DEFS[editing.role]||[]).map(p=>{
                const granted = editing.superAdmin||editing.perms[p.k]!==false;
                return (
                  <div key={p.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:granted?"#f0fff4":"#fafafa",borderRadius:8,border:`1.5px solid ${granted?T.green+"44":T.border}`,transition:"all 0.15s"}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:T.text}}>{p.l}</div>
                      <div style={{fontSize:11,color:T.muted,marginTop:1}}>{p.desc}</div>
                    </div>
                    {/* Toggle switch */}
                    <button
                      onClick={editing.superAdmin?undefined:()=>{
                        togglePerm(editing.id,p.k);
                        setEditing(prev=>({...prev,perms:{...prev.perms,[p.k]:!prev.perms[p.k]}}));
                      }}
                      style={{width:42,height:24,borderRadius:12,background:granted?T.green:T.border,border:"none",cursor:editing.superAdmin?"not-allowed":"pointer",position:"relative",transition:"background 0.2s",flexShrink:0,opacity:editing.superAdmin?0.6:1}}>
                      <div style={{position:"absolute",top:3,left:granted?20:3,width:18,height:18,borderRadius:"50%",background:T.white,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{display:"flex",gap:10,justifyContent:"space-between",marginTop:16,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:8}}>
              {!editing.superAdmin&&<>
                <Btn small variant="secondary" onClick={()=>{
                  const all=Object.fromEntries((PERM_DEFS[editing.role]||[]).map(p=>[p.k,true]));
                  setUsers(prev=>prev.map(u=>u.id===editing.id?{...u,perms:all}:u));
                  setEditing(prev=>({...prev,perms:all}));
                }}>Grant All</Btn>
                <Btn small variant="secondary" onClick={()=>{
                  const none=Object.fromEntries((PERM_DEFS[editing.role]||[]).map(p=>[p.k,p.k==="dashboard"]));
                  setUsers(prev=>prev.map(u=>u.id===editing.id?{...u,perms:none}:u));
                  setEditing(prev=>({...prev,perms:none}));
                }}>Revoke All</Btn>
              </>}
            </div>
            <Btn onClick={()=>setEditing(null)}>Save Changes</Btn>
          </div>
        </Modal>
      )}

      {/* Summary stats */}
      <Grid cols={4}>
        <Stat label="Total Users" value={users.length} accent/>
        <Stat label="Active" value={users.filter(u=>u.status==="active").length}/>
        <Stat label="Suspended" value={users.filter(u=>u.status==="suspended").length} sub={users.filter(u=>u.status==="suspended").length>0?"Review access":"All clear"}/>
        <Stat label="Pending Invite" value={users.filter(u=>u.status==="invited").length}/>
      </Grid>

      {/* Filters */}
      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:14}}>
        <div style={{flex:1,minWidth:200,position:"relative"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, org…"
            style={{width:"100%",padding:"8px 12px 8px 34px",borderRadius:8,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Syne,sans-serif",outline:"none",background:"#fafbfd"}}/>
          <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:14,color:T.muted}}>🔍</span>
        </div>
        {[["all","All"],["admin","Admin"],["carehome","Care Homes"],["agency","Agencies"],["bank","Bank Staff"]].map(([v,l])=>(
          <Pill key={v} label={`${l}${v!=="all"?" ("+users.filter(u=>u.role===v).length+")":""}`} active={roleFilter===v} onClick={()=>setRoleFilter(v)}/>
        ))}
      </div>

      {/* Users table */}
      <Card>
        <Table
          headers={["User","Role","Organisation","Status","Last Login","Access","Actions"]}
          rows={filtered.map(u=>{
            const rc=roleColors[u.role];
            const sc=statusColor[u.status]||statusColor.inactive;
            const grantedCount=(PERM_DEFS[u.role]||[]).filter(p=>u.superAdmin||u.perms[p.k]!==false).length;
            const totalCount=(PERM_DEFS[u.role]||[]).length;
            return (
              <tr key={u.id} style={{borderBottom:`1px solid ${T.border}`,background:u.status==="suspended"?T.redBg:u.status==="invited"?"#fffbeb":"transparent"}}>
                <Td>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${rc?.c||T.navy}88,${T.navy}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.white,flexShrink:0}}>
                      {u.name.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <div>
                      <div style={{fontWeight:700,fontSize:13}}>{u.name}{u.superAdmin&&<span style={{marginLeft:5,fontSize:9,background:T.amber,color:T.white,borderRadius:4,padding:"1px 5px",fontWeight:700}}>SUPER</span>}</div>
                      <div style={{fontSize:11,color:T.muted}}>{u.email}</div>
                    </div>
                  </div>
                </Td>
                <Td><Badge label={roleLabels[u.role]} color={rc?.c} bg={rc?.bg}/></Td>
                <Td><span style={{fontSize:13}}>{u.org}</span></Td>
                <Td>
                  <select value={u.status} onChange={e=>toggleStatus(u.id,e.target.value)}
                    style={{padding:"4px 8px",borderRadius:6,border:`1.5px solid ${sc.c}44`,background:sc.bg,color:sc.c,fontSize:11,fontWeight:700,fontFamily:"Syne,sans-serif",cursor:"pointer",outline:"none"}}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    {u.status==="invited"&&<option value="invited">Invited</option>}
                  </select>
                </Td>
                <Td><span style={{fontSize:12,color:T.muted}}>{u.lastLogin}</span></Td>
                <Td>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:60,height:5,background:T.border,borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${(grantedCount/totalCount)*100}%`,background:grantedCount===totalCount?T.green:T.yellow,borderRadius:3}}/>
                    </div>
                    <span style={{fontSize:11,color:T.muted,whiteSpace:"nowrap"}}>{grantedCount}/{totalCount}</span>
                  </div>
                </Td>
                <Td>
                  <div style={{display:"flex",gap:5}}>
                    <Btn small onClick={()=>setEditing({...u})}>Permissions</Btn>
                    <Btn small variant="secondary" onClick={()=>alert("Password reset email sent to this user.")}>Reset PW</Btn>
                  </div>
                </Td>
              </tr>
            );
          })}
        />
      </Card>

      {/* Role permission overview matrix */}
      <div style={{marginTop:20}}>
        <Card>
          <CardHead title="Default Permission Templates" sub="These are the baseline permissions applied when new users are invited. Customise per-user above." icon="📋"/>
          <div style={{overflowX:"auto",padding:"0 14px 14px"}}>
            {["admin","carehome","agency","bank"].map(role=>{
              const rc=roleColors[role];
              return(
                <div key={role} style={{marginTop:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <Badge label={roleLabels[role]} color={rc?.c} bg={rc?.bg}/>
                    <span style={{fontSize:12,color:T.muted}}>{(PERM_DEFS[role]||[]).length} sections</span>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {(PERM_DEFS[role]||[]).map(p=>(
                      <span key={p.k} style={{padding:"4px 10px",borderRadius:20,background:T.greenBg,border:`1.5px solid ${T.green}44`,fontSize:11,fontWeight:600,color:T.green}} title={p.desc}>
                        ✓ {p.l}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </Page>
  );
};

/* ─── ADMIN: SITE ALLOCATION ─────────────────────────────────────────────────── */
const SiteAllocation = ({users,setUsers,navigate}) => {
  const careHomeUsers = users.filter(u=>u.role==="carehome");
  const [editingUser,setEditingUser] = useState(null);
  const [draftSites,setDraftSites]   = useState([]);
  const [viewMode,setViewMode]       = useState("users"); // "users" | "sites"

  const allSiteNames = CARE_HOMES.map(c=>c.name);

  const openEdit = (u) => { setEditingUser(u); setDraftSites([...(u.sites||[])]); };
  const saveEdit = () => {
    setUsers(prev=>prev.map(u=>u.id===editingUser.id?{...u,sites:draftSites,org:draftSites[0]||u.org}:u));
    setEditingUser(null);
  };
  const toggleSite = (site) => setDraftSites(p=>p.includes(site)?p.filter(s=>s!==site):[...p,site]);

  // Site view — for each care home, who has access
  const siteAccessMap = CARE_HOMES.map(ch=>({
    ...ch,
    managers:careHomeUsers.filter(u=>(u.sites||[]).includes(ch.name)),
  }));

  return (
    <Page title="Site Allocation" sub="Control which care home staff can access which locations" icon="📍"
      action={
        <div style={{display:"flex",gap:8}}>
          {[["users","By User"],["sites","By Site"]].map(([v,l])=>(
            <button key={v} onClick={()=>setViewMode(v)} style={{padding:"8px 16px",borderRadius:8,border:"none",background:viewMode===v?T.navy:"#eef1f6",color:viewMode===v?T.white:T.muted,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"Syne,sans-serif"}}>
              {l}
            </button>
          ))}
        </div>
      }>

      {/* Edit sites modal */}
      {editingUser&&(
        <Modal title={`Edit Site Access — ${editingUser.name}`} onClose={()=>setEditingUser(null)}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#f8fafc",borderRadius:8,marginBottom:16}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${T.blue}88,${T.navy}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:T.white,fontWeight:700,flexShrink:0}}>
              {editingUser.name.split(" ").map(n=>n[0]).join("")}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:14}}>{editingUser.name}</div>
              <div style={{fontSize:12,color:T.muted}}>{editingUser.email}</div>
            </div>
          </div>

          <div style={{marginBottom:8}}>
            <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:12}}>Site Access</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {CARE_HOMES.map(ch=>{
                const granted = draftSites.includes(ch.name);
                const currentUserCount = careHomeUsers.filter(u=>u.id!==editingUser.id&&(u.sites||[]).includes(ch.name)).length;
                return (
                  <div key={ch.id} onClick={()=>toggleSite(ch.name)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:10,border:`2px solid ${granted?T.navy:T.border}`,background:granted?"#f0f4ff":"#fafafa",cursor:"pointer",transition:"all 0.15s"}}>
                    <div style={{width:42,height:42,borderRadius:10,background:granted?T.navy:"#e8ecf4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,transition:"background 0.15s"}}>
                      🏥
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:700,fontSize:13,color:T.text}}>{ch.name}</div>
                      <div style={{fontSize:11,color:T.muted,marginTop:2}}>{ch.type} · {ch.beds} beds · {ch.contact}</div>
                      <div style={{fontSize:10,color:T.muted,marginTop:2}}>
                        {currentUserCount>0?`${currentUserCount} other manager${currentUserCount>1?"s":""} also have access`:"No other managers assigned"}
                      </div>
                    </div>
                    <div style={{width:24,height:24,borderRadius:6,background:granted?T.navy:T.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
                      {granted&&<span style={{color:T.white,fontSize:14,fontWeight:700}}>✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {draftSites.length===0&&(
            <Alert type="error" style={{marginTop:12}}>⚠️ This user will have no site access and won't be able to see any data. Assign at least one site.</Alert>
          )}

          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}>
            <Btn variant="secondary" onClick={()=>setEditingUser(null)}>Cancel</Btn>
            <Btn onClick={saveEdit} style={{opacity:draftSites.length>0?1:0.5}}>Save Access ({draftSites.length} site{draftSites.length!==1?"s":""})</Btn>
          </div>
        </Modal>
      )}

      {/* Stats */}
      <Grid cols={4}>
        <Stat label="Care Home Users" value={careHomeUsers.length} accent/>
        <Stat label="Active Sites" value={CARE_HOMES.length}/>
        <Stat label="Multi-Site Users" value={careHomeUsers.filter(u=>(u.sites||[]).length>1).length} sub="Access 2+ locations"/>
        <Stat label="Unallocated" value={careHomeUsers.filter(u=>!(u.sites||[]).length).length} sub={careHomeUsers.filter(u=>!(u.sites||[]).length).length>0?"Action needed":"All allocated"}/>
      </Grid>

      {/* Info banner */}
      <div style={{background:"#f0f7ff",border:`1px solid ${T.blue}44`,borderRadius:12,padding:"12px 16px",marginBottom:16,fontSize:12,color:T.muted}}>
        <strong style={{color:T.blue}}>📍 How site allocation works:</strong> Care home managers only see shifts, timesheets, invoices and workers for their allocated sites. A relief or regional manager can be given access to multiple sites. Changing allocation takes effect immediately.
      </div>

      {viewMode==="users"&&(
        <Card>
          <Table
            headers={["Manager","Email","Allocated Sites","Site Types","Last Login","Status","Actions"]}
            rows={careHomeUsers.map(u=>{
              const sites = u.sites||[];
              const siteData = CARE_HOMES.filter(c=>sites.includes(c.name));
              return (
                <tr key={u.id} style={{borderBottom:`1px solid ${T.border}`,background:sites.length===0?T.redBg:u.status==="inactive"?"#f8fafc":"transparent"}}>
                  <Td>
                    <div style={{display:"flex",alignItems:"center",gap:9}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${T.blue}88,${T.navy}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.white,flexShrink:0}}>
                        {u.name.split(" ").map(n=>n[0]).join("")}
                      </div>
                      <div>
                        <div style={{fontWeight:700,fontSize:13}}>{u.name}</div>
                        <div style={{fontSize:10,color:T.muted}}>{u.org}</div>
                      </div>
                    </div>
                  </Td>
                  <Td><span style={{fontSize:12,color:T.muted}}>{u.email}</span></Td>
                  <Td>
                    {sites.length===0
                      ?<Badge label="⚠ No Sites" color={T.red} bg={T.redBg}/>
                      :<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                        {sites.map(s=>(
                          <span key={s} style={{padding:"3px 8px",borderRadius:6,background:T.navy+"11",border:`1px solid ${T.navy}22`,fontSize:10,fontWeight:700,color:T.navy}}>{s}</span>
                        ))}
                      </div>}
                  </Td>
                  <Td>
                    <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                      {siteData.map(sd=><span key={sd.id} style={{fontSize:10,background:T.tealBg,color:T.teal,borderRadius:4,padding:"2px 5px",fontWeight:600}}>{sd.type}</span>)}
                    </div>
                  </Td>
                  <Td><span style={{fontSize:12,color:T.muted}}>{u.lastLogin}</span></Td>
                  <Td>
                    <Badge
                      label={u.status.charAt(0).toUpperCase()+u.status.slice(1)}
                      color={u.status==="active"?T.green:u.status==="suspended"?T.red:T.muted}
                      bg={u.status==="active"?T.greenBg:u.status==="suspended"?T.redBg:"#f1f5f9"}
                    />
                  </Td>
                  <Td>
                    <Btn small onClick={()=>openEdit(u)}>Edit Sites</Btn>
                  </Td>
                </tr>
              );
            })}
          />
        </Card>
      )}

      {viewMode==="sites"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
          {siteAccessMap.map(ch=>(
            <Card key={ch.id} style={{padding:0,overflow:"hidden"}}>
              <div style={{background:T.navy,padding:"16px 18px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{fontSize:24}}>🏥</div>
                <div>
                  <div style={{fontFamily:"Instrument Serif,serif",fontSize:16,color:T.white}}>{ch.name}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>{ch.type} · {ch.beds} beds</div>
                </div>
                <div style={{marginLeft:"auto",background:"rgba(255,255,255,0.12)",padding:"4px 10px",borderRadius:20}}>
                  <span style={{fontSize:11,fontWeight:700,color:T.white}}>{ch.managers.length} manager{ch.managers.length!==1?"s":""}</span>
                </div>
              </div>
              <div style={{padding:"14px 18px"}}>
                {ch.managers.length===0?(
                  <div style={{padding:"12px",background:T.redBg,borderRadius:8,fontSize:12,color:T.red,fontWeight:600,textAlign:"center"}}>
                    ⚠️ No managers allocated to this site
                  </div>
                ):(
                  ch.managers.map(m=>(
                    <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${T.blue}88,${T.navy}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:T.white,flexShrink:0}}>
                        {m.name.split(" ").map(n=>n[0]).join("")}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:700,fontSize:12}}>{m.name}</div>
                        <div style={{fontSize:10,color:T.muted}}>{m.email}</div>
                      </div>
                      <div style={{display:"flex",gap:4,alignItems:"center"}}>
                        {(m.sites||[]).length>1&&(
                          <span style={{fontSize:9,background:T.amberBg,color:T.amberText,borderRadius:4,padding:"2px 5px",fontWeight:700}}>{(m.sites||[]).length} sites</span>
                        )}
                        <Badge
                          label={m.status}
                          color={m.status==="active"?T.green:T.muted}
                          bg={m.status==="active"?T.greenBg:"#f1f5f9"}
                        />
                      </div>
                    </div>
                  ))
                )}
                <div style={{marginTop:10}}>
                  <Btn small variant="secondary" onClick={()=>openEdit(ch.managers[0]||careHomeUsers[0])}>
                    Manage Access
                  </Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
};

/* ─── AGENCY: USERS & PERMISSIONS ────────────────────────────────────────────── */
const AgencyUsersAndPermissions = ({users, setUsers, user}) => {
  const myOrg = user?.org || "First Choice Nursing";
  const myUsers = users.filter(u => u.role === "agency" && u.org === myOrg);
  const thisUser = users.find(u => u.email === user?.email);
  const isSuperAdmin = thisUser?.superAdmin;

  const [editing, setEditing]       = useState(null);
  const [inviteModal, setInviteModal] = useState(false);
  const [invite, setInvite]         = useState({name:"", email:"", role:"agency"});
  const [search, setSearch]         = useState("");

  const statusColor = {active:{c:T.green,bg:T.greenBg}, inactive:{c:T.muted,bg:"#f1f5f9"}, suspended:{c:T.red,bg:T.redBg}, invited:{c:T.yellow,bg:T.yellowBg}};
  const permDefs = PERM_DEFS["agency"] || [];

  const filtered = myUsers.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const togglePerm = (uid, perm) => setUsers(prev => prev.map(u =>
    u.id === uid ? {...u, perms:{...u.perms, [perm]:!u.perms[perm]}} : u
  ));
  const toggleStatus = (uid, status) => setUsers(prev => prev.map(u =>
    u.id === uid ? {...u, status} : u
  ));

  const sendInvite = () => {
    if (!invite.name || !invite.email) return;
    const nu = {
      id:`u${users.length+1}`,
      name: invite.name,
      email: invite.email,
      role: "agency",
      org: myOrg,
      status: "invited",
      lastLogin: "Never",
      superAdmin: false,
      perms: defaultPerms("agency"),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers(p => [...p, nu]);
    setInvite({name:"", email:""});
    setInviteModal(false);
  };

  return (
    <Page title="Users & Permissions" sub={`Manage who can access the ${myOrg} portal and what they can do`} icon="🔐"
      action={isSuperAdmin ? <Btn onClick={()=>setInviteModal(true)}>+ Invite User</Btn> : null}>

      {!isSuperAdmin && (
        <Alert type="info">You have view-only access to this section. Contact your account administrator to make changes.</Alert>
      )}

      {/* Invite modal */}
      {inviteModal && (
        <Modal title="Invite Team Member" onClose={()=>setInviteModal(false)}>
          <div style={{background:T.greenBg,borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:12,color:T.green,fontWeight:600,border:`1px solid ${T.green}44`}}>
            📧 An invitation email will be sent. They'll set their own password on first login.
          </div>
          <Input label="Full Name *" value={invite.name} onChange={v=>setInvite(p=>({...p,name:v}))} placeholder="e.g. Sam Hughes"/>
          <Input label="Work Email *" type="email" value={invite.email} onChange={v=>setInvite(p=>({...p,email:v}))} placeholder={`name@${myOrg.toLowerCase().replace(/\s/g,"")}.co.uk`}/>
          <Alert type="info">Default permissions will be applied. You can customise them after the user is created.</Alert>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="secondary" onClick={()=>setInviteModal(false)}>Cancel</Btn>
            <Btn onClick={sendInvite}>Send Invitation →</Btn>
          </div>
        </Modal>
      )}

      {/* Permission editor modal */}
      {editing && (
        <Modal title="Edit Permissions" onClose={()=>setEditing(null)}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#f8fafc",borderRadius:8,marginBottom:16}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${T.purple}88,${T.navy}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:T.white,fontWeight:700,flexShrink:0}}>
              {editing.name.split(" ").map(n=>n[0]).join("")}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:14}}>{editing.name}</div>
              <div style={{fontSize:12,color:T.muted}}>{editing.email} · {myOrg}</div>
            </div>
            {editing.superAdmin && <Badge label="Admin" color={T.purple} bg={T.purpleBg} style={{marginLeft:"auto"}}/>}
          </div>

          {editing.superAdmin ? (
            <Alert type="info">This user is a portal admin — all permissions are permanently granted.</Alert>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
              {permDefs.map(p => {
                const granted = editing.perms[p.k] !== false;
                // Prevent revoking dashboard
                const locked = p.k === "dashboard";
                return (
                  <div key={p.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:granted?"#f0fff4":"#fafafa",borderRadius:8,border:`1.5px solid ${granted?T.green+"44":T.border}`,transition:"all 0.15s"}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:T.text}}>{p.l}</div>
                      <div style={{fontSize:11,color:T.muted,marginTop:1}}>{p.desc}</div>
                    </div>
                    <button
                      onClick={locked ? undefined : () => {
                        togglePerm(editing.id, p.k);
                        setEditing(prev => ({...prev, perms:{...prev.perms,[p.k]:!prev.perms[p.k]}}));
                      }}
                      title={locked?"Dashboard access cannot be revoked":""}
                      style={{width:42,height:24,borderRadius:12,background:granted?T.green:T.border,border:"none",cursor:locked?"not-allowed":"pointer",position:"relative",transition:"background 0.2s",flexShrink:0,opacity:locked?0.5:1}}>
                      <div style={{position:"absolute",top:3,left:granted?20:3,width:18,height:18,borderRadius:"50%",background:T.white,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{display:"flex",gap:10,justifyContent:"space-between",marginTop:4,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:8}}>
              {!editing.superAdmin && <>
                <Btn small variant="secondary" onClick={()=>{
                  const all = Object.fromEntries(permDefs.map(p=>[p.k,true]));
                  setUsers(prev=>prev.map(u=>u.id===editing.id?{...u,perms:all}:u));
                  setEditing(prev=>({...prev,perms:all}));
                }}>Grant All</Btn>
                <Btn small variant="secondary" onClick={()=>{
                  const none = Object.fromEntries(permDefs.map(p=>[p.k,p.k==="dashboard"]));
                  setUsers(prev=>prev.map(u=>u.id===editing.id?{...u,perms:none}:u));
                  setEditing(prev=>({...prev,perms:none}));
                }}>Revoke All</Btn>
              </>}
            </div>
            <Btn onClick={()=>setEditing(null)}>Done</Btn>
          </div>
        </Modal>
      )}

      {/* Stats */}
      <Grid cols={4}>
        <Stat label="Team Members" value={myUsers.length} accent/>
        <Stat label="Active" value={myUsers.filter(u=>u.status==="active").length}/>
        <Stat label="Suspended" value={myUsers.filter(u=>u.status==="suspended").length} sub={myUsers.filter(u=>u.status==="suspended").length>0?"Review access":"All clear"}/>
        <Stat label="Pending Invite" value={myUsers.filter(u=>u.status==="invited").length}/>
      </Grid>

      {/* Info */}
      <div style={{background:"#f0fdf4",border:`1px solid ${T.green}44`,borderRadius:12,padding:"12px 16px",marginBottom:16,fontSize:12,color:T.muted}}>
        <strong style={{color:T.green}}>🔐 How permissions work:</strong> Each team member only sees the sections you grant them. The Dashboard is always visible. Revoking a section removes it from their sidebar immediately.
      </div>

      {/* Search */}
      <div style={{position:"relative",marginBottom:14,maxWidth:320}}>
        <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:13}}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search team members…"
          style={{width:"100%",padding:"8px 12px 8px 34px",borderRadius:8,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Syne,sans-serif",outline:"none",background:"#fafbfd"}}/>
      </div>

      <Card>
        <Table
          headers={["Team Member","Email","Status","Last Login","Access","Actions"]}
          empty="No team members found"
          rows={filtered.map(u => {
            const sc = statusColor[u.status] || statusColor.inactive;
            const grantedCount = permDefs.filter(p => u.superAdmin || u.perms[p.k] !== false).length;
            const totalCount = permDefs.length;
            const isMe = u.email === user?.email;
            return (
              <tr key={u.id} style={{borderBottom:`1px solid ${T.border}`,background:u.status==="suspended"?T.redBg:u.status==="invited"?"#fffbeb":"transparent"}}>
                <Td>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${T.purple}88,${T.navy}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:T.white,flexShrink:0}}>
                      {u.name.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <div>
                      <div style={{fontWeight:700,fontSize:13}}>
                        {u.name}
                        {u.superAdmin && <span style={{marginLeft:5,fontSize:9,background:T.purple,color:T.white,borderRadius:4,padding:"1px 5px",fontWeight:700}}>ADMIN</span>}
                        {isMe && <span style={{marginLeft:5,fontSize:9,background:T.navy,color:T.white,borderRadius:4,padding:"1px 5px",fontWeight:700}}>YOU</span>}
                      </div>
                      <div style={{fontSize:11,color:T.muted}}>{u.email}</div>
                    </div>
                  </div>
                </Td>
                <Td><span style={{fontSize:12,color:T.muted}}>{u.email}</span></Td>
                <Td>
                  {isSuperAdmin && !isMe && !u.superAdmin ? (
                    <select value={u.status} onChange={e=>toggleStatus(u.id,e.target.value)}
                      style={{padding:"4px 8px",borderRadius:6,border:`1.5px solid ${sc.c}44`,background:sc.bg,color:sc.c,fontSize:11,fontWeight:700,fontFamily:"Syne,sans-serif",cursor:"pointer",outline:"none"}}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                      {u.status==="invited"&&<option value="invited">Invited</option>}
                    </select>
                  ) : (
                    <Badge label={u.status.charAt(0).toUpperCase()+u.status.slice(1)} color={sc.c} bg={sc.bg} dot/>
                  )}
                </Td>
                <Td><span style={{fontSize:12,color:T.muted}}>{u.lastLogin}</span></Td>
                <Td>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:60,height:5,background:T.border,borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${(grantedCount/totalCount)*100}%`,background:grantedCount===totalCount?T.green:T.yellow,borderRadius:3}}/>
                    </div>
                    <span style={{fontSize:11,color:T.muted,whiteSpace:"nowrap"}}>{grantedCount}/{totalCount}</span>
                  </div>
                </Td>
                <Td>
                  <div style={{display:"flex",gap:5}}>
                    {(isSuperAdmin && !isMe) ? (
                      <>
                        <Btn small onClick={()=>setEditing({...u})}>Permissions</Btn>
                        <Btn small variant="secondary" onClick={()=>alert("Password reset email sent to this user.")}>Reset PW</Btn>
                      </>
                    ) : (
                      <Btn small variant="secondary" onClick={()=>setEditing({...u})}>View</Btn>
                    )}
                  </div>
                </Td>
              </tr>
            );
          })}
        />
      </Card>

      {/* Default permissions reference */}
      <div style={{marginTop:20}}>
        <Card>
          <CardHead title="Default Permission Template" sub="Permissions applied to all new invites. Contact Nexus RPO to request additional section access." icon="📋"/>
          <div style={{padding:"14px 18px"}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {permDefs.map(p=>(
                <span key={p.k} style={{padding:"4px 10px",borderRadius:20,background:T.greenBg,border:`1.5px solid ${T.green}44`,fontSize:11,fontWeight:600,color:T.green}} title={p.desc}>
                  ✓ {p.l}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </Page>
  );
};

/* ─── ADMIN: MARGINS & PRICING ───────────────────────────────────────────────── */
const MarginManager = ({marginCfg, setMarginCfg}) => {
  const [cfg, setCfg] = useState({...marginCfg, perRole:{...marginCfg.perRole}});
  const [saved, setSaved] = useState(false);
  const roles = ["RGN","RMN","HCA","Senior Carer"];

  const save = () => { setMarginCfg({...cfg}); setSaved(true); setTimeout(()=>setSaved(false),2500); };
  const setField = (k,v) => setCfg(p=>({...p,[k]:v}));
  const setRoleMargin = (role,v) => setCfg(p=>({...p,perRole:{...p.perRole,[role]:parseFloat(v)||0}}));

  // Sample calc: show what care homes get billed vs agency receives
  const sampleRates = INIT_RATE_CARDS.filter(r=>r.type==="agency"&&r.agency==="First Choice Nursing");
  const totalMTDHours = 412; // illustrative
  const totalMTDMargin = sampleRates.reduce((acc,r)=>{
    const hrsForRole = {RGN:120,RMN:80,HCA:160,"Senior Carer":52}[r.role]||0;
    return acc + getMargin(r.weekday, r.role, cfg) * hrsForRole;
  },0);

  return (
    <Page title="Margins & Pricing" sub="Set the platform fee charged to care homes on top of agency rates" icon="💰">

      {saved && <Alert type="success">✓ Margin configuration saved. Changes apply to all new timesheets and invoices.</Alert>}

      {/* Revenue summary */}
      <Grid cols={3}>
        <Stat label="Estimated MTD Revenue" value={`£${totalMTDMargin.toFixed(0)}`} sub="From platform margin (illustrative)" accent/>
        <Stat label="Margin Type" value={cfg.type==="fixed"?"Fixed £/hr":"Percentage %"} sub={cfg.usePerRole?"Per role":"Global rate"}/>
        <Stat label="Avg Margin/hr" value={cfg.type==="fixed"
          ? `£${cfg.usePerRole ? (Object.values(cfg.perRole).reduce((a,v)=>a+v,0)/Object.values(cfg.perRole).length).toFixed(2) : cfg.globalValue.toFixed(2)}`
          : `${cfg.usePerRole ? (Object.values(cfg.perRole).reduce((a,v)=>a+v,0)/Object.values(cfg.perRole).length).toFixed(1) : cfg.globalValue}%`}
          sub="Across standard roles"/>
      </Grid>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>

        {/* Config panel */}
        <Card style={{padding:24}}>
          <h3 style={{fontWeight:700,fontSize:14,marginBottom:18,color:T.text}}>Margin Configuration</h3>

          {/* Type toggle */}
          <div style={{marginBottom:18}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Charge Type</label>
            <div style={{display:"flex",gap:8}}>
              {[["fixed","Fixed £ per hour"],["percentage","Percentage (%)"]].map(([v,l])=>(
                <button key={v} onClick={()=>setField("type",v)} style={{flex:1,padding:"10px",borderRadius:8,border:`1.5px solid ${cfg.type===v?T.navy:T.border}`,background:cfg.type===v?T.navy:"#f8fafc",color:cfg.type===v?T.white:T.muted,fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"Syne,sans-serif",transition:"all 0.15s"}}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Per-role toggle */}
          <div style={{marginBottom:18}}>
            <label style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer",fontSize:13,fontWeight:600,color:T.text}}>
              <button onClick={()=>setField("usePerRole",!cfg.usePerRole)}
                style={{width:42,height:24,borderRadius:12,background:cfg.usePerRole?T.green:T.border,border:"none",cursor:"pointer",position:"relative",transition:"background 0.2s",flexShrink:0}}>
                <div style={{position:"absolute",top:3,left:cfg.usePerRole?20:3,width:18,height:18,borderRadius:"50%",background:T.white,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
              </button>
              Use different margins per role
            </label>
          </div>

          {/* Global value (shown when not per-role) */}
          {!cfg.usePerRole && (
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>
                Global Margin ({cfg.type==="fixed"?"£/hr":"%"})
              </label>
              <input type="number" step="0.25" min="0" max="50" value={cfg.globalValue}
                onChange={e=>setField("globalValue",parseFloat(e.target.value)||0)}
                style={{width:"100%",padding:"10px 12px",borderRadius:8,border:`1.5px solid ${T.border}`,fontSize:16,fontWeight:700,fontFamily:"Syne,sans-serif",outline:"none"}}/>
            </div>
          )}

          {/* Per-role values */}
          {cfg.usePerRole && (
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>
                Per-Role Margins ({cfg.type==="fixed"?"£/hr":"%"})
              </label>
              {roles.map(role=>(
                <div key={role} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                  <Badge label={role} color={T.purple} bg={T.purpleBg}/>
                  <div style={{flex:1}}>
                    <input type="number" step="0.25" min="0" max="50"
                      value={cfg.perRole[role]??cfg.globalValue}
                      onChange={e=>setRoleMargin(role,e.target.value)}
                      style={{width:"100%",padding:"8px 12px",borderRadius:8,border:`1.5px solid ${T.border}`,fontSize:14,fontWeight:700,fontFamily:"Syne,sans-serif",outline:"none",textAlign:"center"}}/>
                  </div>
                  <span style={{fontSize:12,color:T.muted,minWidth:30}}>{cfg.type==="fixed"?"£/hr":"%"}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Internal Notes</label>
            <textarea value={cfg.notes} onChange={e=>setField("notes",e.target.value)} rows={2}
              style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1.5px solid ${T.border}`,fontSize:12,fontFamily:"Syne,sans-serif",resize:"vertical",outline:"none",color:T.muted}}/>
          </div>

          <Btn full onClick={save}>Save Margin Configuration →</Btn>
        </Card>

        {/* Live rate preview */}
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <CardHead title="Live Rate Preview" sub="How each role's rate breaks down" icon="🔍"/>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse"}}>
                <thead>
                  <tr style={{background:"#f8fafc"}}>
                    {["Role","Agency Rate","Nexus Margin","Client Rate","Margin %"].map(h=>(
                      <th key={h} style={{padding:"9px 12px",fontSize:10,fontWeight:700,color:T.muted,textAlign:"left",textTransform:"uppercase",letterSpacing:"0.07em",borderBottom:`1px solid ${T.border}`}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sampleRates.map(r=>{
                    const clientRate = calcClientRate(r.weekday, r.role, cfg);
                    const margin = getMargin(r.weekday, r.role, cfg);
                    const marginPct = ((margin/r.weekday)*100).toFixed(1);
                    return (
                      <tr key={r.id} style={{borderBottom:`1px solid ${T.border}`}}>
                        <td style={{padding:"11px 12px"}}><Badge label={r.role} color={T.purple} bg={T.purpleBg}/></td>
                        <td style={{padding:"11px 12px",fontSize:13,fontWeight:600,color:T.muted}}>£{r.weekday}{"/hr"}</td>
                        <td style={{padding:"11px 12px"}}>
                          <span style={{fontWeight:700,fontSize:13,color:T.green}}>+£{margin.toFixed(2)}</span>
                        </td>
                        <td style={{padding:"11px 12px"}}>
                          <span style={{fontWeight:800,fontSize:14,color:T.navy}}>£{clientRate}{"/hr"}</span>
                        </td>
                        <td style={{padding:"11px 12px"}}>
                          <span style={{fontSize:12,color:T.muted}}>{marginPct}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card style={{padding:20}}>
            <h3 style={{fontWeight:700,fontSize:13,marginBottom:14,color:T.text}}>Estimated Margin on a 12hr Shift</h3>
            {sampleRates.map(r=>{
              const margin = getMargin(r.weekday, r.role, cfg);
              const shiftMargin = +(margin*12).toFixed(2);
              return (
                <div key={r.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{fontSize:13,color:T.text,fontWeight:500}}>{r.role} (12hr weekday)</div>
                  <span style={{fontWeight:800,fontSize:14,color:T.green}}>£{shiftMargin}</span>
                </div>
              );
            })}
            <div style={{marginTop:12,padding:"10px 14px",background:T.amberBg,borderRadius:8}}>
              <div style={{fontSize:11,color:T.amberText,fontWeight:700,marginBottom:2}}>ILLUSTRATION</div>
              <div style={{fontSize:12,color:T.amberText}}>If 100 shifts/month are filled (12hrs avg), at these margins Nexus RPO earns approx. <strong>£{(sampleRates.reduce((a,r)=>a+getMargin(r.weekday,r.role,cfg)*12,0)/sampleRates.length*100).toFixed(0)}</strong>/month in platform margin.</div>
            </div>
          </Card>

          <Alert type="info">
            <strong>How it works:</strong> Agencies always see and receive their base rate. Care homes are billed the client rate (base + Nexus margin). The margin is Nexus RPO's platform revenue per hour billed. Changes apply immediately to all new timesheet calculations and invoice generation.
          </Alert>
        </div>
      </div>
    </Page>
  );
};

/* ─── ADMIN: CLIENT MANAGER ──────────────────────────────────────────────────── */
const CQC_COLORS = {"Outstanding":{c:"#7c3aed",bg:"#f5f3ff"},"Good":{c:T.green,bg:T.greenBg},"Requires Improvement":{c:T.yellow,bg:T.yellowBg},"Inadequate":{c:T.red,bg:T.redBg},"Not rated":{c:T.muted,bg:"#f1f5f9"}};
const HOME_TYPES = ["Residential","Nursing","Dementia","Learning Disabilities","Mental Health","Mixed"];
const CONTRACT_STATUSES = ["active","pending","expired","terminated"];

const blankGroup = () => ({id:`cg_${Date.now()}`,name:"",type:"Residential & Nursing",contact:"",email:"",phone:"",address:"",website:"",contractStart:"",contractEnd:"",status:"active",notes:"",locations:[]});
const blankLocation = (groupId) => ({id:`l_${Date.now()}`,name:"",type:"Residential",address:"",beds:"",contact:"",email:"",phone:"",cqcRating:"Good",cqcDate:"",status:"active",notes:""});

const LocationModal = ({loc, onSave, onClose, isNew}) => {
  const [l, setL] = useState({...loc});
  const f = (k,v) => setL(p=>({...p,[k]:v}));
  return (
    <Modal title={isNew?"Add Location":"Edit Location"} onClose={onClose}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{gridColumn:"1/-1"}}><Input label="Location Name *" value={l.name} onChange={v=>f("name",v)} placeholder="e.g. Sunrise Care — Didsbury"/></div>
        <Select label="Type" value={l.type} onChange={v=>f("type",v)} options={HOME_TYPES}/>
        <Input label="Beds" type="number" value={l.beds} onChange={v=>f("beds",v)} placeholder="42"/>
        <div style={{gridColumn:"1/-1"}}><Input label="Address *" value={l.address} onChange={v=>f("address",v)} placeholder="Full address including postcode"/></div>
        <Input label="Site Contact" value={l.contact} onChange={v=>f("contact",v)} placeholder="Name"/>
        <Input label="Contact Email" type="email" value={l.email} onChange={v=>f("email",v)} placeholder="manager@home.co.uk"/>
        <Input label="Contact Phone" value={l.phone} onChange={v=>f("phone",v)} placeholder="0161 000 0000"/>
        <Input label="CQC Inspection Date" type="date" value={l.cqcDate} onChange={v=>f("cqcDate",v)}/>
        <Select label="CQC Rating" value={l.cqcRating} onChange={v=>f("cqcRating",v)} options={["Outstanding","Good","Requires Improvement","Inadequate","Not rated"]}/>
        <Select label="Status" value={l.status} onChange={v=>f("status",v)} options={["active","inactive","suspended"]}/>
        <div style={{gridColumn:"1/-1"}}><Input label="Notes" value={l.notes} onChange={v=>f("notes",v)} placeholder="e.g. specialist requirements, access notes…"/></div>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={()=>{if(!l.name||!l.address)return;onSave(l);onClose();}}>Save Location</Btn>
      </div>
    </Modal>
  );
};

const GroupModal = ({group, onSave, onClose, isNew}) => {
  const [g, setG] = useState({...group, locations:[...group.locations]});
  const f = (k,v) => setG(p=>({...p,[k]:v}));
  return (
    <Modal title={isNew?"Onboard New Client Group":"Edit Client Group"} onClose={onClose}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{gridColumn:"1/-1"}}><Input label="Group / Company Name *" value={g.name} onChange={v=>f("name",v)} placeholder="e.g. Sunrise Healthcare Group"/></div>
        <Select label="Primary Care Type" value={g.type} onChange={v=>f("type",v)} options={["Residential","Nursing","Dementia","Residential & Nursing","Mixed"]}/>
        <Select label="Contract Status" value={g.status} onChange={v=>f("status",v)} options={CONTRACT_STATUSES}/>
        <Input label="Group Contact *" value={g.contact} onChange={v=>f("contact",v)} placeholder="Primary contact name"/>
        <Input label="Contact Email *" type="email" value={g.email} onChange={v=>f("email",v)} placeholder="contact@group.co.uk"/>
        <Input label="Phone" value={g.phone} onChange={v=>f("phone",v)} placeholder="0161 000 0000"/>
        <Input label="Website" value={g.website} onChange={v=>f("website",v)} placeholder="groupname.co.uk"/>
        <Input label="Contract Start" type="date" value={g.contractStart} onChange={v=>f("contractStart",v)}/>
        <Input label="Contract End" type="date" value={g.contractEnd} onChange={v=>f("contractEnd",v)}/>
        <div style={{gridColumn:"1/-1"}}><Input label="Registered Address" value={g.address} onChange={v=>f("address",v)} placeholder="Head office address"/></div>
        <div style={{gridColumn:"1/-1"}}><Input label="Notes" value={g.notes} onChange={v=>f("notes",v)} placeholder="Contract notes, special terms…"/></div>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={()=>{if(!g.name||!g.contact||!g.email)return;onSave(g);onClose();}}>
          {isNew?"Save & Add Locations →":"Save Changes"}
        </Btn>
      </div>
    </Modal>
  );
};

const ClientManager = () => {
  const [groups, setGroups]           = useState(INIT_CLIENT_GROUPS);
  const [expanded, setExpanded]       = useState("cg1");
  const [editGroup, setEditGroup]     = useState(null);
  const [isNewGroup, setIsNewGroup]   = useState(false);
  const [editLoc, setEditLoc]         = useState(null);
  const [editLocGroup, setEditLocGroup] = useState(null);
  const [isNewLoc, setIsNewLoc]       = useState(false);
  const [search, setSearch]           = useState("");

  const saveGroup = (g) => {
    if (isNewGroup) setGroups(p=>[...p, g]);
    else setGroups(p=>p.map(x=>x.id===g.id?g:x));
  };
  const deleteGroup = (id) => setGroups(p=>p.filter(x=>x.id!==id));
  const saveLoc = (groupId, loc) => {
    setGroups(p=>p.map(g=>{
      if(g.id!==groupId) return g;
      const existing = g.locations.find(l=>l.id===loc.id);
      return {...g, locations: existing ? g.locations.map(l=>l.id===loc.id?loc:l) : [...g.locations, loc]};
    }));
  };
  const deleteLoc = (groupId, locId) => setGroups(p=>p.map(g=>g.id!==groupId?g:{...g,locations:g.locations.filter(l=>l.id!==locId)}));

  const filtered = groups.filter(g=>!search||g.name.toLowerCase().includes(search.toLowerCase())||g.locations.some(l=>l.name.toLowerCase().includes(search.toLowerCase())));

  const totalLocations = groups.reduce((a,g)=>a+g.locations.length,0);
  const totalBeds = groups.reduce((a,g)=>a+g.locations.reduce((b,l)=>b+(parseInt(l.beds)||0),0),0);
  const activeGroups = groups.filter(g=>g.status==="active").length;
  const cqcWarnings = groups.reduce((a,g)=>a+g.locations.filter(l=>l.cqcRating==="Requires Improvement"||l.cqcRating==="Inadequate").length,0);

  const statusColor = {active:{c:T.green,bg:T.greenBg},pending:{c:T.yellow,bg:T.yellowBg},expired:{c:T.red,bg:T.redBg},terminated:{c:T.muted,bg:"#f1f5f9"},inactive:{c:T.muted,bg:"#f1f5f9"},suspended:{c:T.red,bg:T.redBg}};

  return (
    <Page title="Clients" sub="Manage client groups and their care home locations" icon="🏥"
      action={<Btn onClick={()=>{setEditGroup(blankGroup());setIsNewGroup(true);}}>+ Onboard Client</Btn>}>

      {editGroup && <GroupModal group={editGroup} isNew={isNewGroup} onSave={saveGroup} onClose={()=>setEditGroup(null)}/>}
      {editLoc && <LocationModal loc={editLoc} isNew={isNewLoc} onSave={(l)=>saveLoc(editLocGroup,l)} onClose={()=>setEditLoc(null)}/>}

      <Grid cols={4}>
        <Stat label="Client Groups" value={groups.length} sub={`${activeGroups} active`} accent/>
        <Stat label="Locations" value={totalLocations} sub="Across all groups"/>
        <Stat label="Total Beds" value={totalBeds} sub="Under management"/>
        <Stat label="CQC Warnings" value={cqcWarnings} sub={cqcWarnings>0?"Action needed":"All clear"} accent={cqcWarnings>0}/>
      </Grid>

      {cqcWarnings>0 && (
        <Alert type="warn">⚠️ {cqcWarnings} location{cqcWarnings>1?"s are":" is"} rated "Requires Improvement" or below. Review and ensure compliance plans are in place.</Alert>
      )}

      {/* Search */}
      <div style={{position:"relative",marginBottom:16,maxWidth:340}}>
        <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:13}}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search groups or locations…"
          style={{width:"100%",padding:"8px 12px 8px 34px",borderRadius:8,border:`1.5px solid ${T.border}`,fontSize:13,fontFamily:"Syne,sans-serif",outline:"none",background:"#fafbfd"}}/>
      </div>

      {/* Group list */}
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {filtered.map(group=>{
          const isOpen = expanded===group.id;
          const sc = statusColor[group.status]||statusColor.active;
          const contractExpiring = group.contractEnd && new Date(group.contractEnd)<new Date("2026-06-01");
          return (
            <Card key={group.id} style={{overflow:"hidden",border:contractExpiring?`1.5px solid ${T.yellow}66`:"1.5px solid transparent"}}>
              {/* Group header — clickable to expand */}
              <div
                onClick={()=>setExpanded(isOpen?null:group.id)}
                style={{padding:"18px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:16,background:isOpen?"#f8fafc":T.white,borderBottom:isOpen?`1px solid ${T.border}`:"none",transition:"background 0.15s",flexWrap:"wrap"}}>
                {/* Icon */}
                <div style={{width:44,height:44,borderRadius:12,background:`linear-gradient(135deg,${T.navy}22,${T.navy}44)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>🏢</div>
                {/* Info */}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                    <span style={{fontWeight:800,fontSize:15,color:T.navy}}>{group.name}</span>
                    <Badge label={group.status.charAt(0).toUpperCase()+group.status.slice(1)} color={sc.c} bg={sc.bg} dot/>
                    {contractExpiring && <Badge label="Contract expiring soon" color={T.yellow} bg={T.yellowBg}/>}
                  </div>
                  <div style={{fontSize:12,color:T.muted}}>
                    {group.type} · {group.contact} · {group.email}
                  </div>
                </div>
                {/* Meta pills */}
                <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0,flexWrap:"wrap"}}>
                  <span style={{background:"#f0f4f8",borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700,color:T.navy}}>
                    📍 {group.locations.length} location{group.locations.length!==1?"s":""}
                  </span>
                  <span style={{background:"#f0f4f8",borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:700,color:T.navy}}>
                    🛏 {group.locations.reduce((a,l)=>a+(parseInt(l.beds)||0),0)} beds
                  </span>
                  <div style={{display:"flex",gap:6}} onClick={e=>e.stopPropagation()}>
                    <Btn small variant="secondary" onClick={()=>{setEditGroup({...group});setIsNewGroup(false);}}>Edit</Btn>
                    <Btn small onClick={()=>{setEditLoc(blankLocation(group.id));setEditLocGroup(group.id);setIsNewLoc(true);}}>+ Location</Btn>
                  </div>
                  <span style={{fontSize:18,color:T.muted,marginLeft:4}}>{isOpen?"▲":"▼"}</span>
                </div>
              </div>

              {/* Expanded: group details + locations */}
              {isOpen && (
                <div style={{padding:"16px 20px"}}>
                  {/* Group detail strip */}
                  <div style={{display:"flex",gap:24,marginBottom:18,padding:"12px 16px",background:"#f8fafc",borderRadius:10,flexWrap:"wrap"}}>
                    {[
                      ["📞 Phone", group.phone||"—"],
                      ["🌐 Website", group.website||"—"],
                      ["📍 Address", group.address||"—"],
                      ["📅 Contract", group.contractStart ? `${group.contractStart} {"→"} ${group.contractEnd||"Open"}` : "—"],
                    ].map(([k,v])=>(
                      <div key={k} style={{minWidth:160}}>
                        <div style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>{k}</div>
                        <div style={{fontSize:12,color:T.text,fontWeight:600}}>{v}</div>
                      </div>
                    ))}
                    {group.notes && (
                      <div style={{flex:"1 1 100%"}}>
                        <div style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:2}}>📝 Notes</div>
                        <div style={{fontSize:12,color:T.muted,fontStyle:"italic"}}>{group.notes}</div>
                      </div>
                    )}
                  </div>

                  {/* Locations */}
                  <div style={{marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <h4 style={{fontWeight:800,fontSize:13,color:T.text}}>📍 Locations ({group.locations.length})</h4>
                    <Btn small onClick={()=>{setEditLoc(blankLocation(group.id));setEditLocGroup(group.id);setIsNewLoc(true);}}>+ Add Location</Btn>
                  </div>

                  {group.locations.length===0
                    ? <div style={{padding:"24px",textAlign:"center",background:"#fafbfd",borderRadius:10,border:`1.5px dashed ${T.border}`}}>
                        <div style={{fontSize:24,marginBottom:6}}>🏥</div>
                        <div style={{fontWeight:700,fontSize:13,marginBottom:4}}>No locations yet</div>
                        <p style={{color:T.muted,fontSize:12,marginBottom:12}}>Add care home locations that belong to this group.</p>
                        <Btn small onClick={()=>{setEditLoc(blankLocation(group.id));setEditLocGroup(group.id);setIsNewLoc(true);}}>+ Add First Location</Btn>
                      </div>
                    : <div style={{display:"flex",flexDirection:"column",gap:10}}>
                        {group.locations.map(loc=>{
                          const cqc = CQC_COLORS[loc.cqcRating]||CQC_COLORS["Not rated"];
                          const lsc = statusColor[loc.status]||statusColor.active;
                          return (
                            <div key={loc.id} style={{display:"flex",gap:14,alignItems:"flex-start",padding:"14px 16px",borderRadius:10,border:`1.5px solid ${T.border}`,background:loc.status!=="active"?"#fafafa":T.white,flexWrap:"wrap"}}>
                              {/* Location icon */}
                              <div style={{width:36,height:36,borderRadius:9,background:`linear-gradient(135deg,${T.blue}22,${T.blue}44)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>🏥</div>
                              {/* Main info */}
                              <div style={{flex:1,minWidth:180}}>
                                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
                                  <span style={{fontWeight:700,fontSize:14}}>{loc.name}</span>
                                  <Badge label={loc.type} color={T.blue} bg={T.blueBg}/>
                                  <Badge label={loc.status.charAt(0).toUpperCase()+loc.status.slice(1)} color={lsc.c} bg={lsc.bg} dot/>
                                </div>
                                <div style={{fontSize:11,color:T.muted,marginBottom:4}}>📍 {loc.address}</div>
                                <div style={{fontSize:11,color:T.muted}}>
                                  👤 {loc.contact||"—"} · ✉️ {loc.email||"—"} · 📞 {loc.phone||"—"}
                                </div>
                                {loc.notes && <div style={{fontSize:11,color:T.muted,fontStyle:"italic",marginTop:4}}>📝 {loc.notes}</div>}
                              </div>
                              {/* Right meta */}
                              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0}}>
                                <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",justifyContent:"flex-end"}}>
                                  <span style={{background:"#f0f4f8",borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,color:T.navy}}>🛏 {loc.beds||"?"} beds</span>
                                  <span style={{background:cqc.bg,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:700,color:cqc.c}}>CQC: {loc.cqcRating}</span>
                                </div>
                                {loc.cqcDate && <div style={{fontSize:10,color:T.muted}}>Last inspected {loc.cqcDate}</div>}
                                <div style={{display:"flex",gap:6,marginTop:4}}>
                                  <Btn small variant="secondary" onClick={()=>{setEditLoc({...loc});setEditLocGroup(group.id);setIsNewLoc(false);}}>Edit</Btn>
                                  <Btn small variant="danger" onClick={()=>deleteLoc(group.id,loc.id)}>Remove</Btn>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                  }
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filtered.length===0 && (
        <Card style={{padding:40,textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:12}}>🏥</div>
          <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>No clients found</div>
          <p style={{color:T.muted,fontSize:13,marginBottom:18}}>Onboard your first client group to get started.</p>
          <Btn onClick={()=>{setEditGroup(blankGroup());setIsNewGroup(true);}}>+ Onboard First Client</Btn>
        </Card>
      )}
    </Page>
  );
};

/* ─── CLIENT ADMIN: BUDGETS ──────────────────────────────────────────────────── */
const ClientAdminBudgets = ({user, users, budgets, setBudgets}) => {
  const thisUser    = users?.find(u=>u.email===user?.email) || users?.find(u=>u.role==="clientadmin");
  const mySites     = thisUser?.sites || ["Sunrise Care","Sunrise Dementia Unit","Oakwood Nursing"];
  const [editSite, setEditSite] = useState(null);
  const [editForm, setEditForm] = useState({});

  const openEdit = (site) => {
    const b = budgets?.[site] || INIT_BUDGETS[site] || {monthly:15000,annual:180000,alertAt75:true,alertAt90:true,mtdSpend:0,ytdSpend:0};
    setEditForm({monthly:b.monthly, annual:b.annual, alertAt75:b.alertAt75, alertAt90:b.alertAt90});
    setEditSite(site);
  };
  const saveEdit = () => {
    if(setBudgets) setBudgets(prev=>({...prev,[editSite]:{...(prev[editSite]||INIT_BUDGETS[editSite]||{}),...editForm,monthly:Number(editForm.monthly),annual:Number(editForm.annual)}}));
    setEditSite(null);
  };

  const groupMonthly = mySites.reduce((a,s)=>a+((budgets?.[s]||INIT_BUDGETS[s])?.monthly||0),0);
  const groupAnnual  = mySites.reduce((a,s)=>a+((budgets?.[s]||INIT_BUDGETS[s])?.annual||0),0);
  const groupMtd     = mySites.reduce((a,s)=>a+((budgets?.[s]||INIT_BUDGETS[s])?.mtdSpend||0),0);
  const groupYtd     = mySites.reduce((a,s)=>a+((budgets?.[s]||INIT_BUDGETS[s])?.ytdSpend||0),0);
  const groupMtdPct  = Math.round(groupMtd/groupMonthly*100);

  const budgetExports = [
    {icon:"📊",label:"Budget Summary — CSV",fn:()=>exportCSV("budget-summary.csv",
      ["Care Home","Monthly Budget","Annual Budget","MTD Spend","MTD %","Remaining","YTD Spend","YTD %","75% Alert","90% Alert"],
      mySites.map(s=>{const b=budgets?.[s]||INIT_BUDGETS[s]||{};const mp=Math.round((b.mtdSpend||0)/b.monthly*100);return[s,b.monthly,b.annual,b.mtdSpend,`${mp}%`,b.monthly-b.mtdSpend,b.ytdSpend,`${Math.round((b.ytdSpend||0)/b.annual*100)}%`,b.alertAt75?"Yes":"No",b.alertAt90?"Yes":"No"];}))},
    {icon:"🖨️",label:"Budget Report — PDF",fn:()=>exportHTML("Group Budget Report",`${thisUser?.org||"Group"} · March 2026`,
      buildTable(["Care Home","Monthly Budget","MTD Spend","MTD %","Remaining","YTD Spend"],
        mySites.map(s=>{const b=budgets?.[s]||INIT_BUDGETS[s]||{};return[s,`£${b.monthly?.toLocaleString()}`,`£${b.mtdSpend?.toLocaleString()}`,`${Math.round((b.mtdSpend||0)/b.monthly*100)}%`,`£${(b.monthly-b.mtdSpend)?.toLocaleString()}`,`£${b.ytdSpend?.toLocaleString()}`];})))},
  ];

  return (
    <Page title="Budget Management" sub={`Monitoring ${mySites.length} locations · ${thisUser?.org||"Group"}`} icon="💰" action={<ExportMenu exports={budgetExports}/>}>
      {editSite&&(
        <Modal title={`Set Budget — ${editSite}`} onClose={()=>setEditSite(null)}>
          <Alert type="info">Budgets set here are visible to the site manager and control their tracker bars and alert thresholds.</Alert>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            <Input label="Monthly Budget (£)" type="number" value={editForm.monthly} onChange={v=>setEditForm(f=>({...f,monthly:v}))}/>
            <Input label="Annual Budget (£)"  type="number" value={editForm.annual}  onChange={v=>setEditForm(f=>({...f,annual:v}))}/>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Alert Thresholds — notify site manager when:</label>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[{k:"alertAt75",label:"75% of monthly budget is reached",color:"#b45309",bg:"#fef3c7"},{k:"alertAt90",label:"90% of monthly budget is reached",color:T.red,bg:T.redBg}].map(opt=>(
                <label key={opt.k} onClick={()=>setEditForm(f=>({...f,[opt.k]:!f[opt.k]}))} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,border:`1.5px solid ${editForm[opt.k]?opt.color:T.border}`,background:editForm[opt.k]?opt.bg:T.white,cursor:"pointer"}}>
                  <input type="checkbox" checked={!!editForm[opt.k]} readOnly style={{accentColor:opt.color,width:14,height:14}}/>
                  <span style={{fontSize:13,fontWeight:600,color:editForm[opt.k]?opt.color:T.text}}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={saveEdit} style={{background:CA_PURPLE}} disabled={!editForm.monthly||!editForm.annual}>Save Budget</Btn>
            <Btn variant="secondary" onClick={()=>setEditSite(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Group totals */}
      <Grid cols={4}>
        <Stat label="Group Monthly Budgets" value={`£${groupMonthly.toLocaleString()}`} accent sub={`across ${mySites.length} sites`}/>
        <Stat label="Group Annual Budgets"  value={`£${groupAnnual.toLocaleString()}`}/>
        <Stat label="Group MTD Spend"       value={`£${groupMtd.toLocaleString()}`}    trend={`${groupMtdPct}% of total monthly`} trendUp={groupMtdPct>85}/>
        <Stat label="Group YTD Spend"       value={`£${groupYtd.toLocaleString()}`}    sub={`${Math.round(groupYtd/groupAnnual*100)}% of annual`}/>
      </Grid>

      {/* Per-site budget cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
        {mySites.map(site=>{
          const b    = budgets?.[site] || INIT_BUDGETS[site] || {monthly:15000,annual:180000,mtdSpend:0,ytdSpend:0,alertAt75:true,alertAt90:true};
          const mp   = Math.round((b.mtdSpend||0)/b.monthly*100);
          const yp   = Math.round((b.ytdSpend||0)/b.annual*100);
          const col  = mp>=90?T.red:mp>=75?"#b45309":CA_PURPLE;
          const rem  = b.monthly-b.mtdSpend;
          const sc   = SITE_COLORS[site]||CA_PURPLE;
          return (
            <Card key={site} style={{borderTop:`3px solid ${sc}`}}>
              <div style={{padding:"14px 16px 4px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <div style={{fontWeight:800,fontSize:14,color:T.text}}>{site}</div>
                    <div style={{fontSize:11,color:T.muted}}>March 2026</div>
                  </div>
                  <Btn small variant="secondary" onClick={()=>openEdit(site)}>Edit</Btn>
                </div>
                {mp>=90&&<div style={{marginBottom:8,padding:"6px 10px",borderRadius:7,background:T.redBg,border:`1px solid ${T.red}44`,fontSize:11,fontWeight:700,color:T.red}}>⚠️ 90% budget reached</div>}
                {mp>=75&&mp<90&&<div style={{marginBottom:8,padding:"6px 10px",borderRadius:7,background:"#fef3c7",border:"1px solid #fcd34d",fontSize:11,fontWeight:700,color:"#b45309"}}>📊 75% budget used</div>}
                <div style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                    <span style={{color:T.muted}}>MTD Spend</span>
                    <span style={{fontWeight:700,color:col}}>£{b.mtdSpend?.toLocaleString()} <span style={{color:T.muted,fontWeight:400}}>/ £{b.monthly?.toLocaleString()}</span></span>
                  </div>
                  <ProgressBar value={mp} color={col}/>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.muted,marginTop:4}}>
                    <span>{mp}% used</span><span>£{rem?.toLocaleString()} remaining</span>
                  </div>
                </div>
                <div style={{padding:"10px 14px",borderRadius:8,background:"#f8fafc",marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:11,fontWeight:700,color:T.muted}}>Year to Date</span>
                    <span style={{fontSize:12,fontWeight:700,color:yp>=85?T.red:T.blue}}>£{b.ytdSpend?.toLocaleString()}</span>
                  </div>
                  <ProgressBar value={yp} color={yp>=85?T.red:T.blue}/>
                  <div style={{fontSize:11,color:T.muted,marginTop:3}}>{yp}% of £{b.annual?.toLocaleString()} annual budget</div>
                </div>
                <div style={{display:"flex",gap:6,fontSize:10,paddingTop:8,borderTop:`1px solid ${T.border}`}}>
                  {b.alertAt75&&<span style={{padding:"2px 7px",borderRadius:4,background:"#fef3c7",color:"#b45309",fontWeight:700}}>75% alert on</span>}
                  {b.alertAt90&&<span style={{padding:"2px 7px",borderRadius:4,background:T.redBg,color:T.red,fontWeight:700}}>90% alert on</span>}
                  {!b.alertAt75&&!b.alertAt90&&<span style={{color:T.muted}}>No alerts set</span>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Full table */}
      <Card>
        <CardHead title="All Sites — Budget Summary"/>
        <Table headers={["Care Home","Monthly Budget","Annual Budget","MTD Spend","MTD Used","Remaining","YTD Spend","YTD Used","Alerts","Actions"]}
          rows={mySites.map(site=>{
            const b=budgets?.[site]||INIT_BUDGETS[site]||{};
            const mp=Math.round((b.mtdSpend||0)/b.monthly*100);
            const yp=Math.round((b.ytdSpend||0)/b.annual*100);
            const col=mp>=90?T.red:mp>=75?"#b45309":T.green;
            return (
              <tr key={site} style={{borderBottom:`1px solid ${T.border}`,background:mp>=90?T.redBg:mp>=75?"#fffbeb":"transparent"}}>
                <Td bold>{site}</Td>
                <Td bold>£{b.monthly?.toLocaleString()}</Td>
                <Td>£{b.annual?.toLocaleString()}</Td>
                <Td><span style={{fontWeight:700,color:col}}>£{b.mtdSpend?.toLocaleString()}</span></Td>
                <Td>
                  <div style={{display:"flex",alignItems:"center",gap:8,minWidth:100}}>
                    <div style={{flex:1}}><ProgressBar value={mp} color={col}/></div>
                    <span style={{fontSize:11,fontWeight:700,color:col,minWidth:30}}>{mp}%</span>
                  </div>
                </Td>
                <Td><span style={{fontWeight:700,color:(b.monthly-b.mtdSpend)<2000?T.red:T.text}}>£{(b.monthly-b.mtdSpend)?.toLocaleString()}</span></Td>
                <Td>£{b.ytdSpend?.toLocaleString()}</Td>
                <Td><span style={{fontWeight:700,color:yp>=85?T.red:T.muted}}>{yp}%</span></Td>
                <Td>
                  <div style={{display:"flex",gap:4}}>
                    {b.alertAt75&&<span style={{fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:4,background:"#fef3c7",color:"#b45309"}}>75%</span>}
                    {b.alertAt90&&<span style={{fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:4,background:T.redBg,color:T.red}}>90%</span>}
                    {!b.alertAt75&&!b.alertAt90&&<span style={{fontSize:11,color:T.muted}}>None</span>}
                  </div>
                </Td>
                <Td><Btn small onClick={()=>openEdit(site)}>Edit Budget</Btn></Td>
              </tr>
            );
          })}
        />
      </Card>
    </Page>
  );
};


const ClientAdminDashboard = ({user, users}) => {
  const thisUser = (users||[]).find(u=>u.email===user?.email) || {sites:["Sunrise Care","Sunrise Dementia Unit","Oakwood Nursing"]};
  const mySites = thisUser?.sites || [];
  const displaySites = mySites.filter(s=>SITE_DATA[s]);

  const totalShifts = displaySites.reduce((a,s)=>a+(SITE_DATA[s]?.shifts||0),0);
  const totalFilled = displaySites.reduce((a,s)=>a+(SITE_DATA[s]?.filled||0),0);
  const totalSpend  = displaySites.reduce((a,s)=>a+(SITE_DATA[s]?.spend||0),0);
  const totalBudget = displaySites.reduce((a,s)=>a+(SITE_DATA[s]?.budget||0),0);
  const fillRate    = totalShifts ? Math.round(totalFilled/totalShifts*100) : 0;
  const budgetPct   = Math.round(totalSpend/totalBudget*100);

  const urgentOpen = SHIFTS.filter(s=>mySites.includes(s.carehome)&&s.urgency==="urgent"&&s.status!=="filled");

  return (
    <Page title={`Hello, ${user?.name?.split(" ")[0]||"there"}`} sub={`${thisUser?.org||"Group"} — Group Overview`} icon="◈">

      {/* Group identity bar */}
      <div style={{background:`linear-gradient(135deg,${CA_PURPLE},#4f46e5)`,borderRadius:14,padding:"20px 24px",color:"#fff",marginBottom:4}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{fontSize:18,fontWeight:800,marginBottom:2}}>{thisUser?.org||"Sunrise Healthcare Group"}</div>
            <div style={{fontSize:13,opacity:0.75}}>{displaySites.length} locations · Client Admin Portal</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {displaySites.map(s=>(
              <div key={s} style={{padding:"4px 12px",borderRadius:20,background:"rgba(255,255,255,0.15)",fontSize:11,fontWeight:700,display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:SITE_COLORS[s]||"#fff"}}/>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI row */}
      <Grid cols={4}>
        <Stat label="Group Fill Rate" value={`${fillRate}%`} trend={fillRate>=85?"On target":"Below target"} trendUp={fillRate>=85} accent/>
        <Stat label="Total Shifts (Mar)" value={totalShifts} sub={`${totalFilled} filled · ${totalShifts-totalFilled} open`}/>
        <Stat label="Group MTD Spend" value={`£${totalSpend.toLocaleString()}`} trend={`${budgetPct}% of £${(totalBudget/1000).toFixed(0)}k budget`} trendUp={budgetPct>85}/>
        <Stat label="Outstanding Invoices" value="£6,780" sub="4 invoices pending"/>
      </Grid>

      {urgentOpen.length>0&&(
        <div style={{background:"#fef3c7",border:"1.5px solid #f59e0b",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}>⚠️</span>
          <div>
            <div style={{fontWeight:700,fontSize:13,color:"#92400e"}}>Action needed: {urgentOpen.length} urgent unfilled {urgentOpen.length===1?"shift":"shifts"} across group</div>
            <div style={{fontSize:12,color:"#b45309",marginTop:2}}>{urgentOpen.map(s=>`${s.carehome} · ${s.role} · ${s.date}`).join("  |  ")}</div>
          </div>
        </div>
      )}

      {/* Spend trend + fill by site */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18}}>
        <Card>
          <CardHead title="Group Spend & Fill Rate" sub="Last 6 months"/>
          <div style={{padding:"0 8px 8px"}}>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={GROUP_TREND} margin={{top:8,right:8,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
                <XAxis dataKey="month" tick={{fontSize:11,fill:T.muted}}/>
                <YAxis yAxisId="left" tickFormatter={v=>`£${(v/1000).toFixed(0)}k`} tick={{fontSize:11,fill:T.muted}} width={42}/>
                <YAxis yAxisId="right" orientation="right" tickFormatter={v=>`${v}%`} tick={{fontSize:11,fill:T.muted}} width={36} domain={[60,100]}/>
                <Tooltip formatter={(v,n)=>n==="spend"?[`£${v.toLocaleString()}`,"Group Spend"]:[`${v}%`,"Fill Rate"]}/>
                <Bar yAxisId="left" dataKey="spend" fill={CA_PURPLE} radius={[4,4,0,0]} name="spend"/>
                <Line yAxisId="right" type="monotone" dataKey="fill" stroke={T.amber} strokeWidth={2.5} dot={{r:4,fill:T.amber}} name="fill"/>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHead title="Fill Rate by Site"/>
          <div style={{padding:"8px 16px 12px"}}>
            {displaySites.map(s=>{
              const d=SITE_DATA[s]; if(!d) return null;
              const fr=Math.round(d.filled/d.shifts*100);
              return (
                <div key={s} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:12,fontWeight:700,color:T.text}}>{s}</span>
                    <span style={{fontSize:12,fontWeight:700,color:fr>=85?T.green:fr>=70?T.amber:T.red}}>{fr}%</span>
                  </div>
                  <ProgressBar value={fr} max={100} color={SITE_COLORS[s]||CA_PURPLE}/>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Per-site cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {displaySites.map(s=>{
          const d=SITE_DATA[s]; if(!d) return null;
          const fr=Math.round(d.filled/d.shifts*100);
          const bp=Math.round(d.spend/d.budget*100);
          const accent=SITE_COLORS[s]||CA_PURPLE;
          const siteUrgent=SHIFTS.filter(sh=>sh.carehome===s&&sh.urgency==="urgent"&&sh.status!=="filled").length;
          return (
            <Card key={s} style={{borderTop:`3px solid ${accent}`}}>
              <div style={{padding:"14px 16px 12px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <div style={{fontWeight:800,fontSize:14,color:T.text}}>{s}</div>
                    <div style={{fontSize:11,color:T.muted,marginTop:1}}>March 2026</div>
                  </div>
                  {siteUrgent>0&&<span style={{fontSize:10,fontWeight:700,color:"#b45309",background:"#fef3c7",padding:"2px 8px",borderRadius:10}}>{siteUrgent} urgent</span>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                  {[{l:"Fill",v:`${fr}%`,c:fr>=85?T.green:fr>=70?T.amber:T.red},{l:"Shifts",v:d.shifts,c:T.text},{l:"Spend",v:`£${(d.spend/1000).toFixed(1)}k`,c:T.text}].map(stat=>(
                    <div key={stat.l} style={{textAlign:"center",padding:"8px 4px",background:"#f8fafc",borderRadius:8}}>
                      <div style={{fontSize:16,fontWeight:800,color:stat.c}}>{stat.v}</div>
                      <div style={{fontSize:10,color:T.muted,fontWeight:600}}>{stat.l}</div>
                    </div>
                  ))}
                </div>
                <ProgressBar value={d.spend} max={d.budget} color={bp>90?T.red:bp>75?T.amber:accent}/>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.muted,marginTop:4}}>
                  <span>£{d.spend.toLocaleString()} spent</span><span>£{d.budget.toLocaleString()} budget</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent activity across all sites */}
      <Card>
        <CardHead title="Recent Activity — All Locations" sub="Shifts, timesheets and alerts"/>
        <Table headers={["Location","Role","Date","Status","Agency","Worker"]}
          rows={SHIFTS.filter(s=>mySites.includes(s.carehome)).slice(0,8).map(s=>(
            <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`,background:s.urgency==="urgent"&&s.status!=="filled"?"#fffbeb":"transparent"}}>
              <Td><span style={{fontSize:11,fontWeight:700,color:SITE_COLORS[s.carehome]||CA_PURPLE}}>{s.carehome}</span></Td>
              <Td><Badge label={s.role} color={T.purple} bg={T.purpleBg}/></Td>
              <Td style={{fontSize:12}}>{s.date}</Td>
              <Td><SBadge s={s.status}/></Td>
              <Td style={{fontSize:12}}>{s.agency||<span style={{color:T.muted}}>—</span>}</Td>
              <Td style={{fontSize:12}}>{s.worker||<span style={{color:"#94a3b8"}}>Awaiting</span>}</Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};

const ClientAdminLocations = ({user, users}) => {
  const thisUser = (users||[]).find(u=>u.email===user?.email) || {sites:["Sunrise Care","Sunrise Dementia Unit","Oakwood Nursing"]};
  const mySites = (thisUser?.sites||[]).filter(s=>SITE_DATA[s]);

  return (
    <Page title="Locations" sub="Your contracted sites under this group" icon="🏥">
      <Grid cols={3}>
        <Stat label="Total Locations" value={mySites.length} accent/>
        <Stat label="Total Beds" value={mySites.reduce((a,s)=>{const g=INIT_CLIENT_GROUPS.flatMap(g=>g.locations).find(l=>l.name===s);return a+(g?.beds||0);},0)} sub="Across all sites"/>
        <Stat label="Active Locations" value={mySites.length} trend="All operational"/>
      </Grid>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
        {mySites.map(siteName=>{
          const d=SITE_DATA[siteName];
          const locData=INIT_CLIENT_GROUPS.flatMap(g=>g.locations).find(l=>l.name===siteName);
          const accent=SITE_COLORS[siteName]||CA_PURPLE;
          const fr=d?Math.round(d.filled/d.shifts*100):0;
          const CQC_C={Outstanding:"#7c3aed",Good:"#16a34a","Requires Improvement":"#d97706",Inadequate:"#dc2626"};
          return (
            <Card key={siteName} style={{borderLeft:`4px solid ${accent}`}}>
              <div style={{padding:"16px 18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div>
                    <div style={{fontWeight:800,fontSize:15,color:T.text}}>{siteName}</div>
                    {locData&&<div style={{fontSize:11,color:T.muted,marginTop:2}}>{locData.type} · {locData.beds} beds</div>}
                  </div>
                  {locData?.cqcRating&&<span style={{fontSize:10,fontWeight:700,padding:"3px 8px",borderRadius:10,background:`${CQC_C[locData.cqcRating]}18`,color:CQC_C[locData.cqcRating]}}>{locData.cqcRating}</span>}
                </div>
                {d&&<>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                    <div style={{padding:"10px",background:"#f8fafc",borderRadius:8,textAlign:"center"}}>
                      <div style={{fontSize:20,fontWeight:800,color:accent}}>{fr}%</div>
                      <div style={{fontSize:10,color:T.muted,fontWeight:600}}>FILL RATE</div>
                    </div>
                    <div style={{padding:"10px",background:"#f8fafc",borderRadius:8,textAlign:"center"}}>
                      <div style={{fontSize:20,fontWeight:800,color:T.text}}>£{(d.spend/1000).toFixed(1)}k</div>
                      <div style={{fontSize:10,color:T.muted,fontWeight:600}}>MTD SPEND</div>
                    </div>
                  </div>
                  <ProgressBar value={d.spend} max={d.budget} color={accent}/>
                  <div style={{fontSize:10,color:T.muted,marginTop:4,display:"flex",justifyContent:"space-between"}}>
                    <span>Budget: £{d.budget.toLocaleString()}</span>
                    <span>{Math.round(d.spend/d.budget*100)}% used</span>
                  </div>
                </>}
                {locData?.contact&&<div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`,fontSize:11,color:T.muted}}>Manager: <strong style={{color:T.text}}>{locData.contact}</strong></div>}
              </div>
            </Card>
          );
        })}
      </div>
    </Page>
  );
};


const SITE_COLORS = {
  "Sunrise Care": "#F59E0B",
  "Sunrise Dementia Unit": "#8B5CF6",
  "Oakwood Nursing": "#0EA5E9",
  "Meadowbrook Lodge": "#10B981",
  "Riverside Manor": "#EF4444",
};

const SITE_DATA = {
  "Sunrise Care":          {shifts:16,filled:13,spend:8420, budget:15000,hcas:8, rgns:5,rmns:3},
  "Sunrise Dementia Unit": {shifts:9, filled:8, spend:6100, budget:10000,hcas:4, rgns:3,rmns:2},
  "Oakwood Nursing":       {shifts:14,filled:11,spend:7200, budget:12000,hcas:6, rgns:5,rmns:3},
  "Meadowbrook Lodge":     {shifts:12,filled:9, spend:5800, budget:11000,hcas:5, rgns:4,rmns:3},
  "Riverside Manor":       {shifts:10,filled:8, spend:4900, budget:9000, hcas:4, rgns:4,rmns:2},
};

const GROUP_TREND = [
  {month:"Oct",spend:42000,fill:79},{month:"Nov",spend:51000,fill:77},
  {month:"Dec",spend:38000,fill:85},{month:"Jan",spend:55000,fill:74},
  {month:"Feb",spend:49000,fill:88},{month:"Mar",spend:32420,fill:83},
];

const CareHomeGroupAnalytics = ({user,users,budgets}) => {
  const thisUser = users?.find(u=>u.email===user?.email) || users?.find(u=>u.role==="carehome"&&u.superAdmin);
  const mySites = thisUser?.sites || ["Sunrise Care"];
  const [activeSite, setActiveSite] = useState("all");

  const displaySites = mySites.filter(s=>SITE_DATA[s]);
  const filteredSites = activeSite==="all" ? displaySites : displaySites.filter(s=>s===activeSite);

  // Merge live budget data into SITE_DATA
  const getSiteData = (s) => {
    const sd = SITE_DATA[s]||{};
    const bd = budgets?.[s]||INIT_BUDGETS[s]||{};
    return {...sd, budget: bd.monthly||sd.budget, spend: bd.mtdSpend||sd.spend};
  };

  const totalShifts  = filteredSites.reduce((a,s)=>a+(getSiteData(s)?.shifts||0),0);
  const totalFilled  = filteredSites.reduce((a,s)=>a+(getSiteData(s)?.filled||0),0);
  const totalSpend   = filteredSites.reduce((a,s)=>a+(getSiteData(s)?.spend||0),0);
  const totalBudget  = filteredSites.reduce((a,s)=>a+(getSiteData(s)?.budget||0),0);
  const fillRate     = totalShifts ? Math.round(totalFilled/totalShifts*100) : 0;
  const budgetPct    = totalBudget ? Math.round(totalSpend/totalBudget*100) : 0;

  // Build per-site bar chart data
  const siteBarData = displaySites.map(s=>({
    site: s.replace(" Care","").replace(" Nursing","").replace(" Dementia Unit","—Dementia"),
    spend: getSiteData(s)?.spend||0,
    budget: getSiteData(s)?.budget||0,
    fill: getSiteData(s) ? Math.round((getSiteData(s).filled/getSiteData(s).shifts)*100) : 0,
  }));

  const gaExports = [
    {icon:"📊",label:"Group Spend — CSV",desc:"6-month trend",fn:()=>exportCSV("group-analytics-spend.csv",
      ["Month","Total Spend (£)","Fill Rate (%)"],
      GROUP_TREND.map(r=>[r.month,r.spend,r.fill]))},
    {icon:"🏥",label:"By Location — CSV",desc:"MTD breakdown per site",fn:()=>exportCSV("group-analytics-by-location.csv",
      ["Location","Shifts","Filled","Fill Rate (%)","MTD Spend (£)","Budget (£)","Budget Used (%)"],
      displaySites.map(s=>{const d=getSiteData(s);return[s,d?.shifts,d?.filled,d?Math.round(d.filled/d.shifts*100):"—",d?.spend,d?.budget,d?Math.round(d.spend/d.budget*100):"—"];}))},
    {icon:"💰",label:"Budget Summary — CSV",fn:()=>exportCSV("group-budget-summary.csv",
      ["Location","Monthly Budget","MTD Spend","MTD %","Remaining","YTD Spend"],
      displaySites.map(s=>{const b=budgets?.[s]||INIT_BUDGETS[s]||{};const mp=Math.round((b.mtdSpend||0)/b.monthly*100);return[s,b.monthly,b.mtdSpend,`${mp}%`,b.monthly-b.mtdSpend,b.ytdSpend];}))},
    {icon:"🖨️",label:"Group Report — PDF",fn:()=>exportHTML("Group Analytics Report",`March 2026`,
      buildTable(["Location","Fill Rate","Shifts","MTD Spend","Budget","Budget Used"],
        displaySites.map(s=>{const d=getSiteData(s);return[s,d?`${Math.round(d.filled/d.shifts*100)}%`:"—",d?.shifts||0,d?`£${d.spend.toLocaleString()}`:"—",d?`£${d.budget.toLocaleString()}`:"—",d?`${Math.round(d.spend/d.budget*100)}%`:"—"];})))},
  ];

  return (
    <Page title="Group Analytics" sub={`Showing ${activeSite==="all"?`all ${displaySites.length} locations`:`${activeSite}`}`} icon="📊" action={<ExportMenu exports={gaExports}/>}>

      {/* Site filter tabs */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:4}}>
        <button onClick={()=>setActiveSite("all")} style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${activeSite==="all"?T.amber:T.border}`,background:activeSite==="all"?T.amberBg:T.white,fontWeight:700,fontSize:12,cursor:"pointer",color:activeSite==="all"?T.amberText:T.muted,fontFamily:"Syne,sans-serif"}}>
          All Locations ({displaySites.length})
        </button>
        {displaySites.map(s=>(
          <button key={s} onClick={()=>setActiveSite(s)} style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${activeSite===s?SITE_COLORS[s]||T.blue:T.border}`,background:activeSite===s?`${SITE_COLORS[s]}18`||T.blueBg:T.white,fontWeight:700,fontSize:12,cursor:"pointer",color:activeSite===s?SITE_COLORS[s]||T.blue:T.muted,fontFamily:"Syne,sans-serif"}}>
            {s}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <Grid cols={4}>
        <Stat label="Fill Rate (Mar)" value={`${fillRate}%`} trend={fillRate>=85?"On target":"Below target"} trendUp={fillRate>=85} accent/>
        <Stat label="Total Shifts" value={totalShifts} sub={`${totalFilled} filled · ${totalShifts-totalFilled} open`}/>
        <Stat label="MTD Spend" value={`£${totalSpend.toLocaleString()}`} trend={`${budgetPct}% of budget`} trendUp={budgetPct>85}/>
        <Stat label="Budget Remaining" value={`£${(totalBudget-totalSpend).toLocaleString()}`} sub={`of £${totalBudget.toLocaleString()} total`}/>
      </Grid>

      {/* Group trend + site comparison */}
      {activeSite==="all"&&(
        <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:18}}>
          <Card>
            <CardHead title="Group Spend Trend" sub="Last 6 months — all locations"/>
            <div style={{padding:"0 8px 8px"}}>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={GROUP_TREND} margin={{top:8,right:8,bottom:0,left:0}}>
                  <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
                  <XAxis dataKey="month" tick={{fontSize:11,fill:T.muted}}/>
                  <YAxis yAxisId="left" tickFormatter={v=>`£${(v/1000).toFixed(0)}k`} tick={{fontSize:11,fill:T.muted}} width={42}/>
                  <YAxis yAxisId="right" orientation="right" tickFormatter={v=>`${v}%`} tick={{fontSize:11,fill:T.muted}} width={36} domain={[60,100]}/>
                  <Tooltip formatter={(v,n)=>n==="spend"?[`£${v.toLocaleString()}`,"Spend"]:[`${v}%`,"Fill Rate"]}/>
                  <Bar yAxisId="left" dataKey="spend" fill={T.amber} radius={[4,4,0,0]} name="spend"/>
                  <Line yAxisId="right" type="monotone" dataKey="fill" stroke={T.teal} strokeWidth={2.5} dot={{r:4,fill:T.teal}} name="fill"/>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <CardHead title="Fill Rate by Location"/>
            <div style={{padding:"8px 16px 12px"}}>
              {displaySites.map(s=>{
                const d=getSiteData(s); if(!d) return null;
                const fr=Math.round(d.filled/d.shifts*100);
                return (
                  <div key={s} style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:12,fontWeight:700,color:T.text}}>{s}</span>
                      <span style={{fontSize:12,fontWeight:700,color:fr>=85?T.green:fr>=70?T.amber:T.red}}>{fr}%</span>
                    </div>
                    <ProgressBar value={fr} max={100} color={SITE_COLORS[s]||T.blue}/>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Per-site spend comparison (group view only) */}
      {activeSite==="all"&&(
        <Card>
          <CardHead title="Spend vs Budget by Location" sub="March 2026"/>
          <div style={{padding:"0 8px 8px"}}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={siteBarData} margin={{top:8,right:8,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
                <XAxis dataKey="site" tick={{fontSize:11,fill:T.muted}}/>
                <YAxis tickFormatter={v=>`£${(v/1000).toFixed(0)}k`} tick={{fontSize:11,fill:T.muted}} width={42}/>
                <Tooltip formatter={(v,n)=>[`£${v.toLocaleString()}`,n==="spend"?"MTD Spend":"Budget"]}/>
                <Bar dataKey="budget" fill="#e2e8f0" radius={[4,4,0,0]} name="budget"/>
                <Bar dataKey="spend" fill={T.amber} radius={[4,4,0,0]} name="spend"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Individual site detail cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
        {filteredSites.map(s=>{
          const d=getSiteData(s); if(!d) return null;
          const fr=Math.round(d.filled/d.shifts*100);
          const bp=Math.round(d.spend/d.budget*100);
          const accent=SITE_COLORS[s]||T.blue;
          return (
            <Card key={s} style={{borderTop:`3px solid ${accent}`}}>
              <div style={{padding:"14px 16px 4px"}}>
                <div style={{fontWeight:800,fontSize:14,color:T.text,marginBottom:2}}>{s}</div>
                <div style={{fontSize:11,color:T.muted,marginBottom:14}}>March 2026</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                  <div style={{textAlign:"center",padding:"10px 8px",background:"#f8fafc",borderRadius:8}}>
                    <div style={{fontSize:22,fontWeight:800,color:accent}}>{fr}%</div>
                    <div style={{fontSize:10,color:T.muted,fontWeight:600,marginTop:2}}>FILL RATE</div>
                  </div>
                  <div style={{textAlign:"center",padding:"10px 8px",background:"#f8fafc",borderRadius:8}}>
                    <div style={{fontSize:22,fontWeight:800,color:T.text}}>{d.shifts}</div>
                    <div style={{fontSize:10,color:T.muted,fontWeight:600,marginTop:2}}>SHIFTS</div>
                  </div>
                </div>
                <div style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                    <span style={{color:T.muted}}>MTD Spend</span>
                    <span style={{fontWeight:700}}>£{d.spend.toLocaleString()} <span style={{color:T.muted,fontWeight:400}}>/ £{d.budget.toLocaleString()}</span></span>
                  </div>
                  <ProgressBar value={d.spend} max={d.budget} color={bp>90?T.red:bp>75?T.amber:accent}/>
                </div>
                <div style={{display:"flex",gap:8,fontSize:11,color:T.muted,paddingTop:8,borderTop:`1px solid ${T.border}`}}>
                  <span>HCAs: <strong style={{color:T.text}}>{d.hcas}</strong></span>
                  <span>RGNs: <strong style={{color:T.text}}>{d.rgns}</strong></span>
                  <span>RMNs: <strong style={{color:T.text}}>{d.rmns}</strong></span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Page>
  );
};

/* ─── CARE HOME USERS & PERMISSIONS ─────────────────────────────────────────── */
const ALL_CAREHOME_SITES = ["Sunrise Care","Sunrise Dementia Unit","Oakwood Nursing","Meadowbrook Lodge","Riverside Manor"];

const CareHomeUsersAndPermissions = ({users, setUsers, user}) => {
  const thisUser = users?.find(u=>u.email===user?.email) || users?.find(u=>u.role==="carehome"&&u.superAdmin);
  const myOrg    = thisUser?.org || "Sunrise Healthcare Group";
  const mySites  = thisUser?.sites || [];
  const isSuperAdmin = thisUser?.superAdmin;

  // Show users who share at least one site with this user (or same org)
  const myUsers = (users||[]).filter(u=>
    (u.role==="clientadmin"||u.role==="carehome") &&
    (u.org===myOrg || u.sites?.some(s=>mySites.includes(s)))
  );

  const [editing,     setEditing]     = useState(null);
  const [inviteModal, setInviteModal] = useState(false);
  const [invite,      setInvite]      = useState({name:"",email:"",sites:[mySites[0]||""]});
  const [search,      setSearch]      = useState("");
  const permDefs = PERM_DEFS["carehome"]||[];
  const statusColor = {active:{c:T.green,bg:T.greenBg},inactive:{c:T.muted,bg:"#f1f5f9"},suspended:{c:T.red,bg:T.redBg},invited:{c:T.yellow,bg:T.yellowBg}};

  const filtered = myUsers.filter(u=>!search||u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase()));

  const togglePerm = (uid,perm) => setUsers(prev=>prev.map(u=>u.id===uid?{...u,perms:{...u.perms,[perm]:!u.perms[perm]}}:u));
  const toggleStatus = (uid,status) => setUsers(prev=>prev.map(u=>u.id===uid?{...u,status}:u));
  const toggleSite = (uid,site) => setUsers(prev=>prev.map(u=>{
    if(u.id!==uid) return u;
    const has=u.sites?.includes(site);
    const newSites=has?(u.sites||[]).filter(s=>s!==site):[...(u.sites||[]),site];
    return {...u,sites:newSites};
  }));

  const sendInvite = () => {
    if(!invite.name||!invite.email) return;
    const nu={id:`u${(users||[]).length+100}`,name:invite.name,email:invite.email,role:"clientadmin",org:myOrg,status:"invited",lastLogin:"Never",superAdmin:false,perms:{...defaultPerms("clientadmin"),users:false},createdAt:new Date().toISOString().split("T")[0],sites:invite.sites.filter(Boolean)};
    setUsers(p=>[...p,nu]);
    setInvite({name:"",email:"",sites:[mySites[0]||""]});
    setInviteModal(false);
  };

  return (
    <Page title="Users & Permissions" sub={`Manage who can access your portal and which locations they can see`} icon="🔐"
      action={isSuperAdmin?<Btn onClick={()=>setInviteModal(true)}>+ Invite User</Btn>:null}>

      {!isSuperAdmin&&<Alert type="info">You have view-only access. Contact your group administrator to make changes.</Alert>}

      {/* Invite modal */}
      {inviteModal&&(
        <Modal title="Invite Portal User" onClose={()=>setInviteModal(false)}>
          <div style={{background:T.greenBg,borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:12,color:T.green,fontWeight:600,border:`1px solid ${T.green}44`}}>
            📧 They'll receive an invitation email and set their own password on first login.
          </div>
          <Input label="Full Name *" value={invite.name} onChange={v=>setInvite(p=>({...p,name:v}))} placeholder="e.g. Sam Hughes"/>
          <Input label="Work Email *" type="email" value={invite.email} onChange={v=>setInvite(p=>({...p,email:v}))} placeholder="name@company.co.uk"/>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Site Access</label>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {mySites.map(s=>(
                <label key={s} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13}}>
                  <input type="checkbox" checked={invite.sites.includes(s)} onChange={()=>{
                    const has=invite.sites.includes(s);
                    setInvite(p=>({...p,sites:has?p.sites.filter(x=>x!==s):[...p.sites,s]}));
                  }} style={{accentColor:T.amber,width:15,height:15}}/>
                  <span style={{color:T.text}}>{s}</span>
                  <div style={{width:10,height:10,borderRadius:"50%",background:SITE_COLORS[s]||T.blue,flexShrink:0}}/>
                </label>
              ))}
            </div>
          </div>
          <Alert type="info">Default permissions applied — you can customise after inviting.</Alert>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="secondary" onClick={()=>setInviteModal(false)}>Cancel</Btn>
            <Btn onClick={sendInvite}>Send Invitation →</Btn>
          </div>
        </Modal>
      )}

      {/* Permission editor */}
      {editing&&(
        <Modal title="Edit User" onClose={()=>setEditing(null)}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#f8fafc",borderRadius:8,marginBottom:16}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${T.blue}88,${T.navy}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:T.white,fontWeight:700,flexShrink:0}}>
              {editing.name.split(" ").map(n=>n[0]).join("")}
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700,fontSize:14}}>{editing.name}</div>
              <div style={{fontSize:12,color:T.muted}}>{editing.email}</div>
            </div>
            {editing.superAdmin&&<Badge label="Group Admin" color={T.blue} bg={T.blueBg}/>}
          </div>

          {/* Site access */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Site Access</div>
            {editing.superAdmin
              ? <Alert type="info">Group admin has access to all sites in your group.</Alert>
              : <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {mySites.map(s=>{
                    const hasSite=editing.sites?.includes(s);
                    return (
                      <label key={s} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,border:`1.5px solid ${hasSite?SITE_COLORS[s]||T.blue:T.border}`,background:hasSite?`${SITE_COLORS[s]||T.blue}10`:"#fafafa",cursor:isSuperAdmin?"pointer":"default"}}>
                        <input type="checkbox" checked={!!hasSite} disabled={!isSuperAdmin} onChange={()=>{
                          toggleSite(editing.id,s);
                          setEditing(prev=>({...prev,sites:hasSite?(prev.sites||[]).filter(x=>x!==s):[...(prev.sites||[]),s]}));
                        }} style={{accentColor:SITE_COLORS[s]||T.blue,width:15,height:15}}/>
                        <div style={{width:10,height:10,borderRadius:"50%",background:SITE_COLORS[s]||T.blue,flexShrink:0}}/>
                        <span style={{fontSize:13,fontWeight:hasSite?700:400,color:hasSite?T.text:T.muted}}>{s}</span>
                      </label>
                    );
                  })}
                </div>
            }
          </div>

          {/* Permission toggles */}
          <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Portal Permissions</div>
          {editing.superAdmin
            ? <Alert type="info">Group admin — all permissions permanently granted.</Alert>
            : <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:16}}>
                {permDefs.map(p=>{
                  const granted=editing.perms[p.k]!==false;
                  const locked=p.k==="dashboard";
                  return (
                    <div key={p.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:granted?"#f0fff4":"#fafafa",borderRadius:8,border:`1.5px solid ${granted?T.green+"44":T.border}`}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:T.text}}>{p.l}</div>
                        <div style={{fontSize:11,color:T.muted,marginTop:1}}>{p.desc}</div>
                      </div>
                      <button onClick={locked?undefined:()=>{togglePerm(editing.id,p.k);setEditing(prev=>({...prev,perms:{...prev.perms,[p.k]:!prev.perms[p.k]}}));}}
                        disabled={!isSuperAdmin||locked}
                        style={{width:42,height:24,borderRadius:12,background:granted?T.green:T.border,border:"none",cursor:(isSuperAdmin&&!locked)?"pointer":"not-allowed",position:"relative",transition:"background 0.2s",flexShrink:0,opacity:(locked||!isSuperAdmin)?0.5:1}}>
                        <div style={{position:"absolute",top:3,left:granted?20:3,width:18,height:18,borderRadius:"50%",background:T.white,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                      </button>
                    </div>
                  );
                })}
              </div>
          }

          {isSuperAdmin&&!editing.superAdmin&&(
            <div style={{display:"flex",gap:8,justifyContent:"space-between",flexWrap:"wrap",paddingTop:4,borderTop:`1px solid ${T.border}`}}>
              <div style={{display:"flex",gap:8}}>
                <Btn small variant="secondary" onClick={()=>{const all=Object.fromEntries(permDefs.map(p=>[p.k,true]));setUsers(prev=>prev.map(u=>u.id===editing.id?{...u,perms:all}:u));setEditing(prev=>({...prev,perms:all}));}}>Grant All</Btn>
                <Btn small variant="secondary" onClick={()=>{const none=Object.fromEntries(permDefs.map(p=>[p.k,p.k==="dashboard"]));setUsers(prev=>prev.map(u=>u.id===editing.id?{...u,perms:none}:u));setEditing(prev=>({...prev,perms:none}));}}>Revoke All</Btn>
              </div>
              <div style={{display:"flex",gap:8}}>
                {editing.status!=="suspended"?<Btn small variant="danger" onClick={()=>{toggleStatus(editing.id,"suspended");setEditing(null);}}>Suspend</Btn>:<Btn small onClick={()=>{toggleStatus(editing.id,"active");setEditing(null);}}>Reactivate</Btn>}
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Search */}
      <Card>
        <div style={{padding:"14px 16px 10px"}}>
          <Input placeholder="Search users by name or email…" value={search} onChange={setSearch}/>
        </div>
        <Table
          headers={["User","Sites","Permissions","Status","Last Login","Actions"]}
          rows={filtered.map(u=>{
            const sc=statusColor[u.status]||statusColor.active;
            const grantedCount=(u.perms?Object.values(u.perms).filter(Boolean).length:0);
            return (
              <tr key={u.id} style={{borderBottom:`1px solid ${T.border}`}}>
                <Td>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${T.blue}66,${T.navy}66)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:T.white,fontWeight:700,flexShrink:0}}>
                      {u.name.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <div>
                      <div style={{fontWeight:700,fontSize:13}}>{u.name}{u.superAdmin&&<Badge label="Admin" color={T.blue} bg={T.blueBg} style={{marginLeft:6,fontSize:10}}/>}</div>
                      <div style={{fontSize:11,color:T.muted}}>{u.email}</div>
                    </div>
                  </div>
                </Td>
                <Td>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {u.superAdmin
                      ? <Badge label="All Sites" color={T.blue} bg={T.blueBg}/>
                      : (u.sites||[]).map(s=><span key={s} style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:10,background:`${SITE_COLORS[s]||T.blue}18`,color:SITE_COLORS[s]||T.blue,border:`1px solid ${SITE_COLORS[s]||T.blue}44`}}>{s.split(" ")[0]}</span>)
                    }
                  </div>
                </Td>
                <Td>
                  {u.superAdmin
                    ? <span style={{fontSize:12,color:T.muted}}>All granted</span>
                    : <span style={{fontSize:12,color:T.muted}}>{grantedCount} of {permDefs.length} granted</span>
                  }
                </Td>
                <Td><Badge label={u.status} color={sc.c} bg={sc.bg}/></Td>
                <Td style={{fontSize:12,color:T.muted}}>{u.lastLogin}</Td>
                <Td>
                  {(isSuperAdmin||u.id===thisUser?.id)&&<Btn small onClick={()=>setEditing({...u})}>Edit</Btn>}
                </Td>
              </tr>
            );
          })}
        />
      </Card>
    </Page>
  );
};

/* ─── RIGHT TO WORK ──────────────────────────────────────────────────────────── */
const RTW_TYPES = [
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

const RTW_LABEL = Object.fromEntries(RTW_TYPES.map(t=>[t.value, t.label]));

// Seed weekly hours worked per restricted worker (for monitoring report)
const RESTRICTED_HOURS = [
  {workerId:4, workerName:"James Wilson",  agency:"First Choice",  role:"RGN",  visaExpiry:"2026-07-31", weekHours:[18,20,16,22,19,15], sites:["Sunrise Care","Oakwood Nursing"]},
  {workerId:5, workerName:"Priya Patel",   agency:"MedStaff UK",   role:"HCA",  visaExpiry:"2026-03-31", weekHours:[12,8,20,20,14,0],   sites:["Oakwood Nursing"]},
  {workerId:7, workerName:"Lisa Park",     agency:"First Choice",  role:"HCA",  visaExpiry:"2026-12-15", weekHours:[16,18,20,20,18,20],  sites:["Sunrise Care"]},
];
// Week labels for the monitoring table
const RTW_WEEKS = ["w/c 27 Jan","w/c 3 Feb","w/c 10 Feb","w/c 17 Feb","w/c 24 Feb","w/c 3 Mar"];

const AgencyRightToWork = () => {
  const myWorkers = WORKERS.filter(w=>w.agency==="First Choice");
  const [selected, setSelected] = useState(null);
  const [rtwForms, setRtwForms] = useState(
    Object.fromEntries(myWorkers.map(w=>[w.id,{rtwType:w.rtwType||"pending",rtwRef:w.rtwRef||"",rtwExpiry:w.rtwExpiry||"",rtwNotes:w.rtwNotes||"",visaType:w.visaType||""}]))
  );
  const [saved, setSaved] = useState({});
  const set = (wid,k,v) => setRtwForms(p=>({...p,[wid]:{...p[wid],[k]:v}}));
  const saveWorker = (wid) => { setSaved(p=>({...p,[wid]:true})); setTimeout(()=>setSaved(p=>({...p,[wid]:false})),2500); };

  const today = "2026-03-10";
  const expiring = myWorkers.filter(w=>w.rtwExpiry&&w.rtwExpiry<="2026-06-10"&&w.rtwExpiry>=today);
  const expired  = myWorkers.filter(w=>w.rtwExpiry&&w.rtwExpiry<today);
  const restricted = myWorkers.filter(w=>w.hoursRestriction===20);

  const rtwStatus = (w) => {
    if(!w.rtwType||w.rtwType==="pending") return {l:"Pending",c:T.muted,bg:"#f1f5f9"};
    if(w.rtwExpiry&&w.rtwExpiry<today) return {l:"Expired",c:T.red,bg:T.redBg};
    if(w.rtwExpiry&&w.rtwExpiry<="2026-06-10") return {l:"Expiring Soon",c:T.yellow,bg:T.yellowBg};
    return {l:"Verified",c:T.green,bg:T.greenBg};
  };

  const rtwAgencyExports = [
    {icon:"🪪",label:"All RTW Records — CSV",fn:()=>exportCSV("agency-rtw-all.csv",
      ["Worker","Role","RTW Type","Reference","Expiry","Hours Restriction","Verified By","Notes"],
      myWorkers.map(w=>[w.name,w.role,RTW_LABEL[w.rtwType]||w.rtwType||"—",w.rtwRef||"—",w.rtwExpiry||"Permanent",w.hoursRestriction?"20hr/week":"Unrestricted",w.rtwVerifiedBy||"—",w.rtwNotes||""]))},
    {icon:"⚠️",label:"Expiring / Expired — CSV",fn:()=>exportCSV("agency-rtw-expiring.csv",
      ["Worker","Role","RTW Type","Expiry","Days Until Expiry"],
      myWorkers.filter(w=>w.rtwExpiry).map(w=>{
        const days=Math.round((new Date(w.rtwExpiry)-new Date(today))/(1000*60*60*24));
        return[w.name,w.role,RTW_LABEL[w.rtwType]||w.rtwType,w.rtwExpiry,days<0?"EXPIRED":days];
      }))},
    {icon:"🖨️",label:"RTW Register — PDF",fn:()=>exportHTML("Agency Right to Work Register","First Choice Nursing — "+new Date().toLocaleDateString("en-GB"),
      buildTable(["Worker","Role","RTW Type","Reference","Expiry","Hours Limit","Status"],
        myWorkers.map(w=>{
          const st=rtwStatus(w);
          return[w.name,w.role,RTW_LABEL[w.rtwType]||"—",w.rtwRef||"—",w.rtwExpiry||"Permanent",w.hoursRestriction?"20hr/week":"Unrestricted",st.l.toUpperCase()];
        })))},
  ];

  return (
    <Page title="Right to Work" sub="Manage RTW checks for First Choice Nursing workers" icon="🪪"
      action={<div style={{display:"flex",gap:8,alignItems:"center"}}>
        {expired.length>0&&<span style={{padding:"6px 12px",borderRadius:8,background:T.redBg,color:T.red,fontSize:12,fontWeight:700}}>{expired.length} Expired</span>}
        {expiring.length>0&&<span style={{padding:"6px 12px",borderRadius:8,background:T.yellowBg,color:"#92400e",fontSize:12,fontWeight:700}}>{expiring.length} Expiring Soon</span>}
        {restricted.length>0&&<span style={{padding:"6px 12px",borderRadius:8,background:"#ede9fe",color:"#6d28d9",fontSize:12,fontWeight:700}}>{restricted.length} &times; 20hr Restricted</span>}
        <ExportMenu exports={rtwAgencyExports}/>
      </div>}>

      {expired.length>0&&<Alert type="error">⛔ {expired.length} worker{expired.length>1?"s have":" has"} an expired RTW document — {expired.map(w=>w.name).join(", ")}. They must not be placed on shifts until renewed.</Alert>}
      {expiring.length>0&&<Alert type="warn">⚠️ {expiring.length} RTW document{expiring.length>1?"s are":" is"} expiring within 90 days. Schedule repeat checks now.</Alert>}

      <Card>
        <Table headers={["Worker","Role","RTW Type","Reference","Expiry","Hours","Status","Actions"]}
          rows={myWorkers.map(w=>{
            const st = rtwStatus(w);
            const type = RTW_TYPES.find(t=>t.value===w.rtwType);
            return (
              <tr key={w.id} style={{borderBottom:`1px solid ${T.border}`,background:w.rtwExpiry&&w.rtwExpiry<today?T.redBg:"transparent"}}>
                <Td bold>{w.name}</Td>
                <Td><Badge label={w.role} color={T.purple} bg={T.purpleBg}/></Td>
                <Td style={{fontSize:12}}>{w.rtwType?RTW_LABEL[w.rtwType]||w.rtwType:<span style={{color:T.muted}}>Not set</span>}</Td>
                <Td style={{fontSize:12,fontFamily:"monospace"}}>{w.rtwRef||<span style={{color:T.muted}}>—</span>}</Td>
                <Td style={{fontSize:12}}>{w.rtwExpiry?<span style={{color:w.rtwExpiry<today?T.red:w.rtwExpiry<="2026-06-10"?"#b45309":T.text,fontWeight:w.rtwExpiry<="2026-06-10"?700:400}}>{w.rtwExpiry}</span>:<span style={{color:T.muted}}>Permanent</span>}</Td>
                <Td>{w.hoursRestriction?<span style={{fontSize:11,fontWeight:700,color:"#6d28d9",background:"#ede9fe",padding:"2px 8px",borderRadius:10}}>{w.hoursRestriction}hr/wk</span>:<span style={{fontSize:11,color:T.muted}}>Unrestricted</span>}</Td>
                <Td><Badge label={st.l} color={st.c} bg={st.bg}/></Td>
                <Td><Btn small onClick={()=>setSelected(selected===w.id?null:w.id)}>Edit</Btn></Td>
              </tr>
            );
          })}
        />
      </Card>

      {/* Inline edit panel */}
      {selected&&(()=>{
        const w = myWorkers.find(x=>x.id===selected);
        if(!w) return null;
        const f = rtwForms[w.id]||{};
        const selType = RTW_TYPES.find(t=>t.value===f.rtwType);
        return (
          <Card style={{border:`2px solid ${T.amber}`}}>
            <CardHead title={`Edit RTW — ${w.name}`} sub={w.role} action={<Btn small variant="secondary" onClick={()=>setSelected(null)}>✕ Close</Btn>}/>
            <div style={{padding:"4px 16px 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={{gridColumn:"1/-1"}}>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>RTW Type *</label>
                <select value={f.rtwType} onChange={e=>set(w.id,"rtwType",e.target.value)}
                  style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:"Syne,sans-serif",color:T.text,background:T.white}}>
                  {RTW_TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {selType&&<div style={{marginTop:6,padding:"8px 12px",background:selType.restricted?"#ede9fe":selType.restricted===false?T.greenBg:"#f8fafc",borderRadius:6,fontSize:12,color:selType.restricted?"#6d28d9":selType.restricted===false?T.green:T.muted}}>
                  {selType.restricted&&"⚠️ "}{selType.restricted===false&&"✅ "}{selType.desc}
                  {selType.restricted&&<strong> This worker must not exceed 20 hours/week during term time.</strong>}
                </div>}
              </div>
              <Input label="Reference / Document Number" value={f.rtwRef} onChange={v=>set(w.id,"rtwRef",v)} placeholder="e.g. Share code, BRP number, passport no."/>
              <Input label="Expiry Date" type="date" value={f.rtwExpiry} onChange={v=>set(w.id,"rtwExpiry",v)}/>
              <div style={{gridColumn:"1/-1"}}>
                <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Notes</label>
                <textarea value={f.rtwNotes} onChange={e=>set(w.id,"rtwNotes",e.target.value)} rows={3}
                  placeholder="e.g. Term dates, visa conditions, follow-up actions..."
                  style={{width:"100%",padding:"10px 12px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:"Syne,sans-serif",resize:"vertical",color:T.text,boxSizing:"border-box"}}/>
              </div>
              <div style={{gridColumn:"1/-1",display:"flex",gap:10,justifyContent:"flex-end"}}>
                <Btn variant="secondary" onClick={()=>setSelected(null)}>Cancel</Btn>
                <Btn onClick={()=>saveWorker(w.id)}>{saved[w.id]?"✅ Saved!":"Save RTW Record"}</Btn>
              </div>
            </div>
          </Card>
        );
      })()}

      {/* RTW type reference guide */}
      <Card>
        <CardHead title="RTW Type Reference Guide" sub="UK right to work document categories"/>
        <div style={{padding:"8px 16px 16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {RTW_TYPES.filter(t=>t.value!=="pending").map(t=>(
            <div key={t.value} style={{padding:"10px 14px",borderRadius:8,background:t.restricted?"#faf5ff":t.restricted===false?"#f0fff4":"#f8fafc",border:`1px solid ${t.restricted?"#ddd6fe":t.restricted===false?"#bbf7d0":T.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <span style={{fontSize:12,fontWeight:700,color:T.text}}>{t.label}</span>
                {t.restricted&&<span style={{fontSize:10,fontWeight:700,color:"#6d28d9",background:"#ede9fe",padding:"1px 6px",borderRadius:8}}>20hr limit</span>}
                {t.restricted===false&&<span style={{fontSize:10,fontWeight:700,color:T.green,background:T.greenBg,padding:"1px 6px",borderRadius:8}}>Unrestricted</span>}
                {t.expiry&&t.restricted===null&&<span style={{fontSize:10,fontWeight:700,color:T.amber,background:T.amberBg,padding:"1px 6px",borderRadius:8}}>Check visa type</span>}
              </div>
              <div style={{fontSize:11,color:T.muted,lineHeight:1.5}}>{t.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </Page>
  );
};

/* ─── RTW MONITORING REPORT ──────────────────────────────────────────────────── */
const RtwMonitoringReport = ({user}) => {
  const isClientAdmin = user?.role==="clientadmin";
  const mySites = isClientAdmin
    ? ["Sunrise Care","Sunrise Dementia Unit","Oakwood Nursing"]
    : ["Sunrise Care"];

  const [filterSite,   setFilterSite]   = useState("all");
  const [filterAgency, setFilterAgency] = useState("all");
  const [tab, setTab] = useState("hours");
  const LIMIT = 20;

  const displayWorkers = RESTRICTED_HOURS.filter(w=>{
    const siteMatch   = filterSite==="all"   || w.sites.includes(filterSite);
    const agencyMatch = filterAgency==="all" || w.agency===filterAgency;
    return siteMatch && agencyMatch;
  });

  const agencies           = [...new Set(RESTRICTED_HOURS.map(w=>w.agency))];
  const today              = "2026-03-10";
  const currentWeekHours   = (w) => w.weekHours[w.weekHours.length-1]||0;
  const totalHours         = (w) => w.weekHours.reduce((a,b)=>a+b,0);
  const breaches           = RESTRICTED_HOURS.filter(w=>w.weekHours.some(h=>h>LIMIT));
  const expiringWorkers    = RESTRICTED_HOURS.filter(w=>{
    const wx = WORKERS.find(x=>x.id===w.workerId);
    return wx?.rtwExpiry && wx.rtwExpiry<="2026-06-10";
  });

  const rtwExports = [
    {icon:"🪪",label:"Restricted Workers — CSV",desc:"All 20hr limited workers",fn:()=>exportCSV("rtw-restricted-workers.csv",
      ["Worker","Agency","Role","Visa Expiry","Sites","w/c 27 Jan","w/c 3 Feb","w/c 10 Feb","w/c 17 Feb","w/c 24 Feb","w/c 3 Mar","Total Hrs"],
      RESTRICTED_HOURS.map(w=>[w.workerName,w.agency,w.role,WORKERS.find(x=>x.id===w.workerId)?.rtwExpiry||"—",w.sites.join("; "),...w.weekHours,w.weekHours.reduce((a,b)=>a+b,0)]))},
    {icon:"⛔",label:"Hours Breaches — CSV",desc:"Weeks where 20hr limit exceeded",fn:()=>{
      const rows=[];
      RESTRICTED_HOURS.forEach(w=>w.weekHours.forEach((h,i)=>{if(h>20)rows.push([w.workerName,w.agency,w.role,RTW_WEEKS[i],h,h-20]);}));
      exportCSV("rtw-breaches.csv",["Worker","Agency","Role","Week","Hours Worked","Hours Over Limit"],rows);
    }},
    {icon:"⚠️",label:"Expiring RTW Docs — CSV",desc:"Expires within 90 days",fn:()=>exportCSV("rtw-expiring.csv",
      ["Worker","Agency","Role","RTW Type","Expiry Date","Hours Restriction"],
      WORKERS.filter(w=>w.rtwExpiry&&w.rtwExpiry<="2026-06-10").map(w=>[w.name,w.agency,w.role,RTW_LABEL[w.rtwType]||w.rtwType,w.rtwExpiry,w.hoursRestriction?"20hr/week":"None"]))},
    {icon:"🖨️",label:"Full RTW Report — PDF",fn:()=>exportHTML("Right to Work Monitoring Report","20-hour restricted workers — "+new Date().toLocaleDateString("en-GB"),
      buildTable(["Worker","Agency","Role","Visa Expiry","This Week (hrs)","Status"],
        RESTRICTED_HOURS.map(w=>{
          const cur=w.weekHours[w.weekHours.length-1];
          return[w.workerName,w.agency,w.role,WORKERS.find(x=>x.id===w.workerId)?.rtwExpiry||"—",`${cur}/20`,cur>20?"BREACH":cur===20?"AT LIMIT":"OK"];
        })))},
  ];

  return (
    <Page title="RTW Monitoring" sub="20-hour restricted workers — hours tracking and visa status" icon="🪪" action={<ExportMenu exports={rtwExports}/>}>

      {breaches.length>0&&(
        <Alert type="error">⛔ {breaches.length} worker{breaches.length>1?"s have":" has"} exceeded 20 hours in at least one week. Review immediately and contact the relevant agency.</Alert>
      )}
      {expiringWorkers.length>0&&(
        <Alert type="warn">⚠️ {expiringWorkers.length} restricted worker{expiringWorkers.length>1?"s have":" has"} a visa or RTW document expiring within 90 days.</Alert>
      )}

      <Grid cols={4}>
        <Stat label="Restricted Workers" value={RESTRICTED_HOURS.length} accent/>
        <Stat label="Active This Week" value={RESTRICTED_HOURS.filter(w=>currentWeekHours(w)>0).length} sub="w/c 3 Mar"/>
        <Stat label="Hours Breaches" value={breaches.length} sub="Any week over 20hrs" trend={breaches.length>0?"Action required":""} trendUp={false}/>
        <Stat label="Visas Expiring" value={expiringWorkers.length} sub="Within 90 days"/>
      </Grid>

      {/* Filters */}
      {isClientAdmin&&(
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <button onClick={()=>setFilterSite("all")} style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${filterSite==="all"?CA_PURPLE:T.border}`,background:filterSite==="all"?"#f5f3ff":T.white,fontWeight:700,fontSize:12,cursor:"pointer",color:filterSite==="all"?CA_PURPLE:T.muted,fontFamily:"Syne,sans-serif"}}>All Sites</button>
            {mySites.map(s=>(
              <button key={s} onClick={()=>setFilterSite(s)} style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${filterSite===s?SITE_COLORS[s]||CA_PURPLE:T.border}`,background:filterSite===s?`${SITE_COLORS[s]||CA_PURPLE}15`:T.white,fontWeight:700,fontSize:12,cursor:"pointer",color:filterSite===s?SITE_COLORS[s]||CA_PURPLE:T.muted,fontFamily:"Syne,sans-serif"}}>{s}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>setFilterAgency("all")} style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${filterAgency==="all"?T.amber:T.border}`,background:filterAgency==="all"?T.amberBg:T.white,fontWeight:600,fontSize:11,cursor:"pointer",color:filterAgency==="all"?T.amberText:T.muted,fontFamily:"Syne,sans-serif"}}>All Agencies</button>
            {agencies.map(a=>(
              <button key={a} onClick={()=>setFilterAgency(a)} style={{padding:"5px 12px",borderRadius:20,border:`1.5px solid ${filterAgency===a?T.amber:T.border}`,background:filterAgency===a?T.amberBg:T.white,fontWeight:600,fontSize:11,cursor:"pointer",color:filterAgency===a?T.amberText:T.muted,fontFamily:"Syne,sans-serif"}}>{a}</button>
            ))}
          </div>
        </div>
      )}

      {/* View toggle */}
      <div style={{display:"flex",gap:0,background:"#f1f5f9",borderRadius:10,padding:4,width:"fit-content"}}>
        {[{k:"hours",l:"Weekly Hours Table"},{k:"cards",l:"Worker Cards"}].map(t=>{
          const active=tab===t.k;
          return (
            <button key={t.k} onClick={()=>setTab(t.k)}
              style={{padding:"7px 18px",borderRadius:8,border:"none",fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",
                background:active?T.white:"transparent",color:active?T.navy:T.muted,
                boxShadow:active?"0 1px 4px rgba(0,0,0,0.1)":"none"}}>
              {t.l}
            </button>
          );
        })}
      </div>

      {/* Weekly hours table */}
      {tab==="hours"&&(
        <Card>
          <CardHead title="Weekly Hours — Last 6 Weeks" sub="20hr limit applies during term time"/>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{background:"#f8fafc",borderBottom:`2px solid ${T.border}`}}>
                  <th style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>Worker</th>
                  <th style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>Agency</th>
                  <th style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>Visa Expiry</th>
                  {RTW_WEEKS.map((wk,i)=>(
                    <th key={wk} style={{padding:"10px 10px",textAlign:"center",fontSize:10,fontWeight:700,color:i===RTW_WEEKS.length-1?T.navy:T.muted,textTransform:"uppercase",letterSpacing:"0.04em",background:i===RTW_WEEKS.length-1?"#f0f4ff":"transparent",whiteSpace:"nowrap"}}>{wk}</th>
                  ))}
                  <th style={{padding:"10px 14px",textAlign:"center",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.06em"}}>Total</th>
                </tr>
              </thead>
              <tbody>
                {displayWorkers.map(w=>{
                  const wx=WORKERS.find(x=>x.id===w.workerId);
                  const isExpiringSoon=wx?.rtwExpiry&&wx.rtwExpiry<="2026-06-10";
                  return (
                    <tr key={w.workerId} style={{borderBottom:`1px solid ${T.border}`}}>
                      <td style={{padding:"12px 14px"}}>
                        <div style={{fontWeight:700,fontSize:13}}>{w.workerName}</div>
                        <div style={{display:"flex",gap:6,marginTop:3}}>
                          <Badge label={w.role} color={T.purple} bg={T.purpleBg}/>
                          <span style={{fontSize:10,fontWeight:700,color:"#6d28d9",background:"#ede9fe",padding:"2px 7px",borderRadius:8}}>20hr limit</span>
                        </div>
                      </td>
                      <td style={{padding:"12px 14px",fontSize:12,color:T.muted}}>{w.agency}</td>
                      <td style={{padding:"12px 14px"}}>
                        {wx?.rtwExpiry
                          ? <span style={{fontSize:12,fontWeight:isExpiringSoon?700:400,color:isExpiringSoon?T.red:T.text}}>{wx.rtwExpiry}{isExpiringSoon&&" ⚠️"}</span>
                          : <span style={{fontSize:12,color:T.muted}}>—</span>}
                      </td>
                      {w.weekHours.map((h,i)=>{
                        const over=h>LIMIT; const atLimit=h===LIMIT;
                        const bg=over?"#fee2e2":atLimit?"#fef3c7":i===w.weekHours.length-1?"#eef2ff":"transparent";
                        const col=over?T.red:atLimit?"#b45309":i===w.weekHours.length-1?T.navy:T.text;
                        return (
                          <td key={i} style={{padding:"12px 10px",textAlign:"center",background:bg}}>
                            <span style={{fontSize:13,fontWeight:over||atLimit?800:500,color:col}}>{h}</span>
                            {over&&<div style={{fontSize:9,color:T.red,fontWeight:700}}>OVER</div>}
                            {atLimit&&<div style={{fontSize:9,color:"#b45309",fontWeight:700}}>AT LIMIT</div>}
                          </td>
                        );
                      })}
                      <td style={{padding:"12px 14px",textAlign:"center"}}>
                        <span style={{fontSize:13,fontWeight:700}}>{totalHours(w)}</span>
                        <div style={{fontSize:10,color:T.muted}}>hrs</div>
                      </td>
                    </tr>
                  );
                })}
                {displayWorkers.length===0&&(
                  <tr><td colSpan={10} style={{padding:"28px",textAlign:"center",color:T.muted,fontSize:13}}>No restricted workers match the current filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Worker cards view */}
      {tab==="cards"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
          {displayWorkers.map(w=>{
            const wx=WORKERS.find(x=>x.id===w.workerId);
            const curHrs=currentWeekHours(w);
            const remaining=Math.max(0,LIMIT-curHrs);
            const over=curHrs>LIMIT;
            const atLimit=curHrs===LIMIT;
            const isExpiring=wx?.rtwExpiry&&wx.rtwExpiry<="2026-06-10";
            const barColor=over?T.red:curHrs>=18?T.amber:CA_PURPLE;
            return (
              <Card key={w.workerId} style={{borderTop:`3px solid ${over?T.red:atLimit?"#f59e0b":CA_PURPLE}`,padding:0}}>
                <div style={{padding:"14px 16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:14}}>{w.workerName}</div>
                      <div style={{fontSize:11,color:T.muted,marginTop:2}}>{w.agency} · {w.role}</div>
                    </div>
                    <div>
                      {over&&<span style={{fontSize:11,fontWeight:700,color:T.red,background:T.redBg,padding:"3px 8px",borderRadius:8}}>BREACH</span>}
                      {!over&&atLimit&&<span style={{fontSize:11,fontWeight:700,color:"#b45309",background:"#fef3c7",padding:"3px 8px",borderRadius:8}}>AT LIMIT</span>}
                      {!over&&!atLimit&&<span style={{fontSize:11,fontWeight:700,color:T.green,background:T.greenBg,padding:"3px 8px",borderRadius:8}}>OK</span>}
                    </div>
                  </div>

                  <div style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12}}>
                      <span style={{color:T.muted}}>This week (w/c 3 Mar)</span>
                      <span style={{fontWeight:700,color:over?T.red:T.text}}>{curHrs} / {LIMIT} hrs</span>
                    </div>
                    <ProgressBar value={Math.min(curHrs,LIMIT+2)} max={LIMIT} color={barColor}/>
                  </div>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:11,color:T.muted,marginBottom:8}}>
                    <div>Remaining: <strong style={{color:over?T.red:T.green}}>{over?`${curHrs-LIMIT}h over`:`${remaining}h left`}</strong></div>
                    <div>Visa expiry: <strong style={{color:isExpiring?T.red:T.text}}>{wx?.rtwExpiry||"—"}</strong></div>
                  </div>

                  {wx?.rtwNotes&&<div style={{padding:"7px 10px",background:"#f8fafc",borderRadius:6,fontSize:11,color:T.muted,borderLeft:`3px solid ${CA_PURPLE}`,marginBottom:8}}>{wx.rtwNotes}</div>}

                  <div style={{paddingTop:8,borderTop:`1px solid ${T.border}`,display:"flex",flexWrap:"wrap",gap:4}}>
                    {w.sites.map(s=><span key={s} style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:8,background:`${SITE_COLORS[s]||CA_PURPLE}18`,color:SITE_COLORS[s]||CA_PURPLE}}>{s}</span>)}
                  </div>
                </div>
              </Card>
            );
          })}
          {displayWorkers.length===0&&(
            <div style={{gridColumn:"1/-1",padding:40,textAlign:"center",color:T.muted,fontSize:13}}>No restricted workers match the current filters.</div>
          )}
        </div>
      )}

      {/* Compliance reminder */}
      <Card style={{background:"#faf5ff",border:`1.5px solid #ddd6fe`}}>
        <div style={{padding:"16px 18px"}}>
          <div style={{fontWeight:800,fontSize:14,color:"#6d28d9",marginBottom:8}}>📋 Your Responsibilities as a Host Employer</div>
          <div style={{fontSize:13,color:"#4c1d95",lineHeight:1.8}}>
            <div>• Student visa holders are restricted to <strong>20 hours per week during term time</strong>. Outside term time, they may work full time.</div>
            <div>• You must report suspected breaches to the sponsoring agency immediately.</div>
            <div>• Under the Immigration, Asylum and Nationality Act 2006, knowingly employing a person without the right to work is a criminal offence.</div>
            <div>• Ensure RTW checks are repeated before any time-limited permission expires.</div>
            <div>• If a worker presents a Share Code, verify via the <strong>Home Office online checking service</strong> before placement.</div>
          </div>
        </div>
      </Card>
    </Page>
  );
};

/* ─── CUSTOM REPORTS ─────────────────────────────────────────────────────────── */
const REPORT_SOURCES = {
  shifts: {
    label:"Shifts", icon:"📋",
    fields:[
      {k:"carehome",   l:"Location"},
      {k:"role",       l:"Role"},
      {k:"date",       l:"Date"},
      {k:"time",       l:"Time"},
      {k:"status",     l:"Status"},
      {k:"agency",     l:"Agency"},
      {k:"worker",     l:"Worker"},
      {k:"rate",       l:"Rate (£/hr)"},
      {k:"urgency",    l:"Urgency"},
    ],
    getData:()=>SHIFTS,
    filters:["dateFrom","dateTo","status","agency","carehome","role"],
  },
  workers: {
    label:"Workers", icon:"👥",
    fields:[
      {k:"name",           l:"Name"},
      {k:"role",           l:"Role"},
      {k:"agency",         l:"Agency"},
      {k:"dbs",            l:"DBS Status"},
      {k:"dbsExpiry",      l:"DBS Expiry"},
      {k:"training",       l:"Training Status"},
      {k:"trainingExpiry", l:"Training Expiry"},
      {k:"compliance",     l:"Compliance (%)"},
      {k:"rtwType",        l:"RTW Type"},
      {k:"rtwExpiry",      l:"RTW Expiry"},
      {k:"hoursRestriction",l:"Hours Restriction"},
      {k:"available",      l:"Available"},
    ],
    getData:()=>WORKERS,
    filters:["agency","role","dbs","rtwType"],
  },
  invoices: {
    label:"Invoices", icon:"📄",
    fields:[
      {k:"id",      l:"Invoice ID"},
      {k:"agency",  l:"Agency"},
      {k:"period",  l:"Period"},
      {k:"shifts",  l:"Shifts"},
      {k:"amount",  l:"Amount (£)"},
      {k:"issued",  l:"Issued"},
      {k:"due",     l:"Due Date"},
      {k:"status",  l:"Status"},
    ],
    getData:()=>INVOICES,
    filters:["status","agency"],
  },
  agencies: {
    label:"Agencies", icon:"🤝",
    fields:[
      {k:"name",        l:"Agency Name"},
      {k:"tier",        l:"Tier"},
      {k:"contact",     l:"Contact"},
      {k:"email",       l:"Email"},
      {k:"shifts",      l:"Shifts"},
      {k:"fillRate",    l:"Fill Rate (%)"},
      {k:"avgResponse", l:"Avg Response"},
      {k:"compliance",  l:"Compliance (%)"},
      {k:"spend",       l:"Spend (£)"},
      {k:"status",      l:"Status"},
      {k:"joined",      l:"Joined Date"},
    ],
    getData:()=>AGENCIES,
    filters:["tier","status"],
  },
  timesheets: {
    label:"Timesheets", icon:"🕐",
    fields:[
      {k:"id",          l:"ID"},
      {k:"agency",      l:"Agency"},
      {k:"carehome",    l:"Location"},
      {k:"worker",      l:"Worker"},
      {k:"role",        l:"Role"},
      {k:"date",        l:"Date"},
      {k:"hoursWorked", l:"Hours Worked"},
      {k:"rate",        l:"Rate (£/hr)"},
      {k:"total",       l:"Total (£)"},
      {k:"status",      l:"Status"},
    ],
    getData:(ts)=>ts||INIT_TIMESHEETS,
    filters:["dateFrom","dateTo","status","agency","carehome","role"],
  },
  compliance_reqs: {
    label:"Compliance Requirements", icon:"🛡",
    fields:[
      {k:"name",           l:"Requirement Name"},
      {k:"type",           l:"Type"},
      {k:"category",       l:"Category"},
      {k:"scope",          l:"Scope"},
      {k:"careHome",       l:"Care Home"},
      {k:"mandatory",      l:"Mandatory"},
      {k:"expiryMonths",   l:"Renewal (months)"},
      {k:"appliesToRoles", l:"Applies To Roles"},
      {k:"addedBy",        l:"Added By"},
      {k:"createdAt",      l:"Created Date"},
      {k:"active",         l:"Active"},
      {k:"notes",          l:"Notes"},
    ],
    getData:(_, compReqs)=>( (compReqs||INIT_COMPLIANCE_REQS).map(r=>({
      ...r,
      mandatory:   r.mandatory   ? "Yes" : "No",
      active:      r.active      ? "Active" : "Inactive",
      careHome:    r.careHome    || "All Sites (Global)",
      expiryMonths:r.expiryMonths? `${r.expiryMonths} months` : "No expiry",
      appliesToRoles: Array.isArray(r.appliesToRoles) ? r.appliesToRoles.join(", ") : r.appliesToRoles,
    })) ),
    filters:["compScope","compType","compCategory","compMandatory","compActive"],
  },
  worker_compliance: {
    label:"Worker Compliance Status", icon:"✅",
    fields:[
      {k:"workerName",      l:"Worker"},
      {k:"role",            l:"Role"},
      {k:"agency",          l:"Agency"},
      {k:"overallScore",    l:"Compliance Score (%)"},
      {k:"overallStatus",   l:"Overall Status"},
      {k:"dbsStatus",       l:"DBS Status"},
      {k:"dbsExpiry",       l:"DBS Expiry"},
      {k:"trainingStatus",  l:"Mandatory Training"},
      {k:"trainingExpiry",  l:"Training Expiry"},
      {k:"pinStatus",       l:"NMC/PIN Status"},
      {k:"pin",             l:"NMC/PIN Number"},
      {k:"rtwType",         l:"RTW Type"},
      {k:"rtwExpiry",       l:"RTW Expiry"},
      {k:"rtwStatus",       l:"RTW Status"},
      {k:"hoursRestriction",l:"Hours Restriction"},
      {k:"available",       l:"Available for Shifts"},
    ],
    getData:()=>WORKERS.map(w=>{
      const today = "2026-03-10";
      const rtwSt = !w.rtwType||w.rtwType==="pending" ? "Pending"
        : w.rtwExpiry && w.rtwExpiry < today          ? "Expired"
        : w.rtwExpiry && w.rtwExpiry <= "2026-06-10"  ? "Expiring Soon"
        : "Verified";
      const issues = [
        w.dbs==="expired"||w.training==="expired",
        !w.pinStatus && (w.role==="RGN"||w.role==="RMN"),
        rtwSt==="Expired"||rtwSt==="Pending",
      ].filter(Boolean).length;
      const warnings = [
        w.dbs==="expiring"||w.training==="expiring",
        rtwSt==="Expiring Soon",
        w.hoursRestriction!=null,
      ].filter(Boolean).length;
      const overall = issues>0?"Fail":warnings>0?"Warning":"Pass";
      return {
        workerName:      w.name,
        role:            w.role,
        agency:          w.agency,
        overallScore:    w.compliance,
        overallStatus:   overall,
        dbsStatus:       w.dbs.charAt(0).toUpperCase()+w.dbs.slice(1),
        dbsExpiry:       w.dbsExpiry||"—",
        trainingStatus:  w.training.charAt(0).toUpperCase()+w.training.slice(1),
        trainingExpiry:  w.trainingExpiry||"—",
        pinStatus:       w.pinStatus?"Active":"Missing/Inactive",
        pin:             w.pin||"N/A",
        rtwType:         w.rtwType ? (RTW_LABEL[w.rtwType]||w.rtwType) : "Not set",
        rtwExpiry:       w.rtwExpiry||"Permanent",
        rtwStatus:       rtwSt,
        hoursRestriction:w.hoursRestriction ? `${w.hoursRestriction}hr/week` : "Unrestricted",
        available:       w.available ? "Yes" : "No",
      };
    }),
    filters:["agency","role","compOverallStatus","dbs"],
  },
  budgets: {
    label:"Budgets", icon:"💰",
    fields:[
      {k:"site",           l:"Care Home"},
      {k:"monthly_budget", l:"Monthly Budget (£)"},
      {k:"annual_budget",  l:"Annual Budget (£)"},
      {k:"mtd_spend",      l:"MTD Spend (£)"},
      {k:"mtd_pct",        l:"MTD % Used"},
      {k:"remaining",      l:"Remaining (£)"},
      {k:"ytd_spend",      l:"YTD Spend (£)"},
      {k:"ytd_pct",        l:"YTD % Used"},
      {k:"alert_75",       l:"75% Alert On"},
      {k:"alert_90",       l:"90% Alert On"},
    ],
    getData:(_ts,_cr,budgets)=>buildBudgetReportData(budgets),
    filters:[],
  },
};

// Budget report data helper — used in REPORT_SOURCES
const buildBudgetReportData = (budgets) => Object.entries(budgets||INIT_BUDGETS).map(([site,b])=>({
  site,
  monthly_budget: b.monthly,
  annual_budget:  b.annual,
  mtd_spend:      b.mtdSpend,
  mtd_pct:        `${Math.round((b.mtdSpend/b.monthly)*100)}%`,
  remaining:      b.monthly-b.mtdSpend,
  ytd_spend:      b.ytdSpend,
  ytd_pct:        `${Math.round((b.ytdSpend/b.annual)*100)}%`,
  alert_75:       b.alertAt75?"Yes":"No",
  alert_90:       b.alertAt90?"Yes":"No",
}));

const SAVED_REPORT_TEMPLATES = [
  {id:"r1", name:"Monthly Spend by Agency",       source:"invoices",          fields:["agency","period","shifts","amount","status"],                                          filters:{status:""},              created:"2026-02-01", createdBy:"Rachel Obi"},
  {id:"r2", name:"Open Shifts This Week",          source:"shifts",            fields:["carehome","role","date","time","urgency","agency"],                                    filters:{status:"open"},          created:"2026-02-14", createdBy:"Rachel Obi"},
  {id:"r3", name:"Worker Compliance Audit",        source:"workers",           fields:["name","role","agency","dbs","dbsExpiry","training","compliance"],                      filters:{},                       created:"2026-03-01", createdBy:"Tom Bright"},
  {id:"r4", name:"Tier 1 Agency Performance",      source:"agencies",          fields:["name","tier","shifts","fillRate","avgResponse","compliance","spend"],                  filters:{tier:"Tier 1"},          created:"2026-03-05", createdBy:"Rachel Obi"},
  {id:"r5", name:"Full Worker Compliance Status",  source:"worker_compliance", fields:["workerName","role","agency","overallScore","overallStatus","dbsStatus","dbsExpiry","trainingStatus","trainingExpiry","rtwStatus","rtwExpiry","hoursRestriction"], filters:{},  created:"2026-03-06", createdBy:"Rachel Obi"},
  {id:"r6", name:"Failed / At-Risk Workers",       source:"worker_compliance", fields:["workerName","role","agency","overallScore","overallStatus","dbsStatus","trainingStatus","rtwStatus","pinStatus"], filters:{compOverallStatus:"Fail"}, created:"2026-03-07", createdBy:"Tom Bright"},
  {id:"r7", name:"Global Compliance Requirements", source:"compliance_reqs",   fields:["name","type","category","mandatory","expiryMonths","appliesToRoles","addedBy","active"], filters:{compScope:"global"},  created:"2026-03-08", createdBy:"Rachel Obi"},
  {id:"r8", name:"Budget Status — All Sites",       source:"budgets",           fields:["site","monthly_budget","mtd_spend","mtd_pct","remaining","ytd_spend","ytd_pct"],          filters:{},                   created:"2026-03-10", createdBy:"Rachel Obi"},
  {id:"r9", name:"Budget Alerts Summary",           source:"budgets",           fields:["site","monthly_budget","mtd_spend","mtd_pct","remaining","alert_75","alert_90"],           filters:{},                   created:"2026-03-10", createdBy:"Rachel Obi"},
];

const CustomReports = ({user, timesheets: tsProp, complianceReqs, budgets}) => {
  const isClientAdmin = user?.role==="clientadmin";
  const [view,        setView]        = useState("home");       // home | builder | preview | saved
  const [source,      setSource]      = useState("shifts");
  const [selFields,   setSelFields]   = useState([]);
  const [filters,     setFilters]     = useState({});
  const [reportName,  setReportName]  = useState("");
  const [saved,       setSaved]       = useState(SAVED_REPORT_TEMPLATES);
  const [activeReport,setActiveReport]= useState(null);
  const [justSaved,   setJustSaved]   = useState(false);

  const src = REPORT_SOURCES[source];

  // ── Filter options ────────────────────────────────────────────────────────
  const filterOpts = {
    status:            ["","open","pending","filled","approved","disputed","paid","overdue","draft"],
    agency:            ["",...[...new Set(AGENCIES.map(a=>a.name))]],
    carehome:          ["",...[...new Set(SHIFTS.map(s=>s.carehome))]],
    role:              ["",...["RGN","RMN","HCA","Senior Carer","Deputy Manager"]],
    tier:              ["",...["Tier 1","Tier 2","Tier 3"]],
    dbs:               ["",...["valid","expiring","expired"]],
    rtwType:           ["",...RTW_TYPES.map(t=>t.value)],
    dateFrom:          null,
    dateTo:            null,
    // Compliance-specific
    compScope:         ["","global","site"],
    compType:          ["","document","training","registration"],
    compCategory:      ["","safeguarding","training","registration","health","legal","specialist","safety"],
    compMandatory:     ["","Yes","No"],
    compActive:        ["","Active","Inactive"],
    compOverallStatus: ["","Pass","Warning","Fail"],
  };

  // ── Apply filters to data ─────────────────────────────────────────────────
  const getRows = (overrideSrc, overrideFields, overrideFilters) => {
    const s   = overrideSrc     || source;
    const fds = overrideFields  || selFields;
    const flt = overrideFilters || filters;
    const rawData = REPORT_SOURCES[s].getData(tsProp, complianceReqs, budgets);
    const filtered = rawData.filter(row => {
      if(flt.status            && row.status            && row.status            !== flt.status)            return false;
      if(flt.agency            && row.agency            && row.agency            !== flt.agency)            return false;
      if(flt.carehome          && row.carehome          && row.carehome          !== flt.carehome)          return false;
      if(flt.role              && row.role              && row.role              !== flt.role)              return false;
      if(flt.tier              && row.tier              && row.tier              !== flt.tier)              return false;
      if(flt.dbs               && row.dbs               && row.dbs               !== flt.dbs)               return false;
      if(flt.rtwType           && row.rtwType           && row.rtwType           !== flt.rtwType)           return false;
      if(flt.dateFrom          && row.date              && row.date < flt.dateFrom)                         return false;
      if(flt.dateTo            && row.date              && row.date > flt.dateTo)                           return false;
      // Compliance-specific filters
      if(flt.compScope         && row.scope             && row.scope             !== flt.compScope)         return false;
      if(flt.compType          && row.type              && row.type              !== flt.compType)          return false;
      if(flt.compCategory      && row.category          && row.category          !== flt.compCategory)      return false;
      if(flt.compMandatory     && row.mandatory         && row.mandatory         !== flt.compMandatory)     return false;
      if(flt.compActive        && row.active            && row.active            !== flt.compActive)        return false;
      if(flt.compOverallStatus && row.overallStatus     && row.overallStatus     !== flt.compOverallStatus) return false;
      return true;
    });
    return { headers: fds.map(k=>REPORT_SOURCES[s].fields.find(f=>f.k===k)?.l||k), rows: filtered.map(row=>fds.map(k=>{ const v=row[k]; if(v===true) return "Yes"; if(v===false) return "No"; if(v===null||v===undefined) return "—"; return String(v); })) };
  };

  const toggleField = k => setSelFields(p => p.includes(k) ? p.filter(x=>x!==k) : [...p,k]);
  const selectAll   = () => setSelFields(src.fields.map(f=>f.k));
  const clearAll    = () => setSelFields([]);

  const loadTemplate = (tpl) => {
    setSource(tpl.source);
    setSelFields(tpl.fields);
    setFilters(tpl.filters||{});
    setReportName(tpl.name);
    setActiveReport(tpl);
    setView("preview");
  };

  const saveReport = () => {
    if(!reportName.trim()) return;
    const newR = {id:`r${Date.now()}`,name:reportName,source,fields:selFields,filters,created:new Date().toISOString().split("T")[0],createdBy:user?.name||"You"};
    setSaved(p=>[newR,...p]);
    setJustSaved(true);
    setTimeout(()=>setJustSaved(false),2500);
  };

  const deleteReport = id => setSaved(p=>p.filter(r=>r.id!==id));

  // ── SOURCE ICONS / colours ─────────────────────────────────────────────────
  const srcColor = {shifts:T.blue,workers:T.purple,invoices:T.green,agencies:T.amber,timesheets:"#0891b2",compliance_reqs:"#0f766e",worker_compliance:"#16a34a",budgets:"#d97706"};

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <Page title="Custom Reports" sub="Build, save and export tailored data reports" icon="🗂"
      action={
        <div style={{display:"flex",gap:8}}>
          {view!=="home"&&<Btn variant="secondary" onClick={()=>setView("home")}>← Back</Btn>}
          <Btn onClick={()=>{setSource("shifts");setSelFields([]);setFilters({});setReportName("");setActiveReport(null);setView("builder");}}>+ New Report</Btn>
        </div>
      }>

      {/* ── HOME: saved reports + quick-start ──────────────────────────────── */}
      {view==="home"&&(
        <>
          {/* Quick start tiles */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12,marginBottom:4}}>
            {Object.entries(REPORT_SOURCES).map(([k,s])=>(
              <button key={k} onClick={()=>{setSource(k);setSelFields(s.fields.map(f=>f.k));setFilters({});setReportName(s.label+" Report");setView("builder");}}
                style={{display:"flex",flexDirection:"column",alignItems:"flex-start",padding:"16px 18px",background:T.white,border:`1.5px solid ${T.border}`,borderTop:`3px solid ${srcColor[k]}`,borderRadius:10,cursor:"pointer",textAlign:"left",fontFamily:"Syne,sans-serif",transition:"box-shadow 0.15s"}}>
                <span style={{fontSize:24,marginBottom:8}}>{s.icon}</span>
                <span style={{fontWeight:800,fontSize:13,color:T.text}}>{s.label}</span>
                <span style={{fontSize:11,color:T.muted,marginTop:3}}>{s.fields.length} fields available</span>
              </button>
            ))}
          </div>

          {/* Saved reports */}
          <Card>
            <CardHead title="Saved Reports" sub={`${saved.length} report${saved.length!==1?"s":""} saved`}/>
            {saved.length===0&&(
              <div style={{padding:"32px",textAlign:"center",color:T.muted,fontSize:13}}>No saved reports yet. Build one with + New Report.</div>
            )}
            <Table headers={["Report Name","Data Source","Fields","Filters","Created","By","Actions"]}
              rows={saved.map(r=>{
                const s=REPORT_SOURCES[r.source];
                const activeFilters=Object.entries(r.filters||{}).filter(([,v])=>v).length;
                return(
                  <tr key={r.id} style={{borderBottom:`1px solid ${T.border}`}}>
                    <Td><div style={{fontWeight:700,fontSize:13}}>{r.name}</div></Td>
                    <Td><span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600,color:srcColor[r.source]}}><span>{s?.icon}</span>{s?.label}</span></Td>
                    <Td><span style={{fontSize:12,color:T.muted}}>{r.fields.length} columns</span></Td>
                    <Td><span style={{fontSize:12,color:activeFilters?T.amber:T.muted}}>{activeFilters?`${activeFilters} active`:"None"}</span></Td>
                    <Td style={{fontSize:12,color:T.muted}}>{r.created}</Td>
                    <Td style={{fontSize:12}}>{r.createdBy}</Td>
                    <Td>
                      <div style={{display:"flex",gap:5}}>
                        <Btn small onClick={()=>loadTemplate(r)}>Run</Btn>
                        <Btn small variant="secondary" onClick={()=>{setSource(r.source);setSelFields(r.fields);setFilters(r.filters||{});setReportName(r.name);setActiveReport(r);setView("builder");}}>Edit</Btn>
                        <Btn small variant="secondary" onClick={()=>deleteReport(r.id)}>🗑</Btn>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            />
          </Card>
        </>
      )}

      {/* ── BUILDER ────────────────────────────────────────────────────────── */}
      {view==="builder"&&(
        <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:18,alignItems:"start"}}>

          {/* Left panel */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>

            {/* Report name */}
            <Card style={{padding:"16px 18px"}}>
              <Input label="Report Name" value={reportName} onChange={v=>setReportName(v)} placeholder="e.g. Weekly Agency Spend"/>
            </Card>

            {/* Data source */}
            <Card style={{padding:"16px 18px"}}>
              <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Data Source</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {Object.entries(REPORT_SOURCES).map(([k,s])=>(
                  <button key={k} onClick={()=>{setSource(k);setSelFields(s.fields.map(f=>f.k));setFilters({});}}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,border:`1.5px solid ${source===k?srcColor[k]:T.border}`,background:source===k?`${srcColor[k]}12`:T.white,cursor:"pointer",fontFamily:"Syne,sans-serif",textAlign:"left"}}>
                    <span style={{fontSize:16}}>{s.icon}</span>
                    <span style={{fontWeight:700,fontSize:12,color:source===k?srcColor[k]:T.text}}>{s.label}</span>
                    {source===k&&<span style={{marginLeft:"auto",fontSize:10,color:srcColor[k],fontWeight:700}}>✓</span>}
                  </button>
                ))}
              </div>
            </Card>

            {/* Field selector */}
            <Card style={{padding:"16px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em"}}>Columns ({selFields.length}/{src.fields.length})</span>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={selectAll}  style={{fontSize:10,fontWeight:700,color:T.amber,background:"none",border:"none",cursor:"pointer",padding:"2px 4px"}}>All</button>
                  <button onClick={clearAll}   style={{fontSize:10,fontWeight:700,color:T.muted,background:"none",border:"none",cursor:"pointer",padding:"2px 4px"}}>None</button>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {src.fields.map(f=>(
                  <label key={f.k} onClick={()=>toggleField(f.k)}
                    style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:6,background:selFields.includes(f.k)?`${srcColor[source]}10`:"transparent",cursor:"pointer",border:`1px solid ${selFields.includes(f.k)?srcColor[source]:T.border}`}}>
                    <div style={{width:14,height:14,borderRadius:3,border:`2px solid ${selFields.includes(f.k)?srcColor[source]:T.border}`,background:selFields.includes(f.k)?srcColor[source]:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {selFields.includes(f.k)&&<span style={{color:"white",fontSize:9,lineHeight:1}}>✓</span>}
                    </div>
                    <span style={{fontSize:12,color:selFields.includes(f.k)?srcColor[source]:T.text}}>{f.l}</span>
                  </label>
                ))}
              </div>
            </Card>

            {/* Filters */}
            <Card style={{padding:"16px 18px"}}>
              <div style={{fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Filters</div>
              {src.filters.map(fk=>(
                <div key={fk} style={{marginBottom:10}}>
                  <label style={{display:"block",fontSize:11,fontWeight:600,color:T.muted,marginBottom:4}}>
                    {fk==="dateFrom"?"Date From"
                    :fk==="dateTo"?"Date To"
                    :fk==="dbs"?"DBS Status"
                    :fk==="rtwType"?"RTW Type"
                    :fk==="compScope"?"Scope (Global / Site)"
                    :fk==="compType"?"Document Type"
                    :fk==="compCategory"?"Category"
                    :fk==="compMandatory"?"Mandatory"
                    :fk==="compActive"?"Active Status"
                    :fk==="compOverallStatus"?"Overall Compliance Status"
                    :fk.charAt(0).toUpperCase()+fk.slice(1)}
                  </label>
                  {(fk==="dateFrom"||fk==="dateTo")
                    ? <input type="date" value={filters[fk]||""} onChange={e=>setFilters(p=>({...p,[fk]:e.target.value}))}
                        style={{width:"100%",padding:"7px 10px",border:`1.5px solid ${T.border}`,borderRadius:7,fontSize:12,fontFamily:"Syne,sans-serif",color:T.text}}/>
                    : <select value={filters[fk]||""} onChange={e=>setFilters(p=>({...p,[fk]:e.target.value}))}
                        style={{width:"100%",padding:"7px 10px",border:`1.5px solid ${T.border}`,borderRadius:7,fontSize:12,fontFamily:"Syne,sans-serif",color:T.text,background:T.white}}>
                        {(filterOpts[fk]||[""]).map(o=>(
                          <option key={o} value={o}>{fk==="rtwType"&&o?RTW_LABEL[o]||o:o||`All ${fk.charAt(0).toUpperCase()+fk.slice(1)}s`}</option>
                        ))}
                      </select>
                  }
                </div>
              ))}
              {Object.values(filters).some(v=>v)&&(
                <button onClick={()=>setFilters({})} style={{fontSize:11,fontWeight:700,color:T.red,background:"none",border:"none",cursor:"pointer",padding:"2px 0"}}>✕ Clear all filters</button>
              )}
            </Card>
          </div>

          {/* Right: preview */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {selFields.length===0
              ? <Card style={{padding:"48px",textAlign:"center",color:T.muted}}>
                  <div style={{fontSize:32,marginBottom:8}}>{src.icon}</div>
                  <div style={{fontWeight:700,marginBottom:4}}>No columns selected</div>
                  <div style={{fontSize:12}}>Tick at least one field on the left to preview results.</div>
                </Card>
              : (()=>{
                  const {headers,rows} = getRows();
                  const activeFilters = Object.entries(filters).filter(([,v])=>v).length;
                  return (
                    <>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <span style={{fontWeight:800,fontSize:14,color:T.text}}>{rows.length} row{rows.length!==1?"s":""} </span>
                          <span style={{fontSize:13,color:T.muted}}>· {selFields.length} columns{activeFilters?` · ${activeFilters} filter${activeFilters>1?"s":""}`:""}</span>
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <ExportMenu exports={[
                            {icon:"📋",label:"Export CSV",fn:()=>exportCSV(`${(reportName||"report").replace(/\s+/g,"-")}.csv`,headers,rows)},
                            {icon:"🖨️",label:"Export PDF",fn:()=>exportHTML(reportName||"Custom Report","Nexus RPO — Custom Report",buildTable(headers,rows))},
                          ]}/>
                          <Btn onClick={()=>setView("preview")}>Preview Full →</Btn>
                          <Btn variant="secondary" onClick={saveReport}>{justSaved?"✅ Saved!":"💾 Save Report"}</Btn>
                        </div>
                      </div>
                      <Card>
                        <div style={{overflowX:"auto",maxHeight:460,overflowY:"auto"}}>
                          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                            <thead style={{position:"sticky",top:0,zIndex:2}}>
                              <tr style={{background:T.navy}}>
                                {headers.map(h=>(
                                  <th key={h} style={{padding:"9px 12px",textAlign:"left",color:"white",fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {rows.slice(0,50).map((row,i)=>(
                                <tr key={i} style={{borderBottom:`1px solid ${T.border}`,background:i%2===0?"transparent":"#f8fafc"}}>
                                  {row.map((cell,j)=>(
                                    <td key={j} style={{padding:"8px 12px",color:T.text,whiteSpace:"nowrap"}}>
                                      {(cell==="Fail"||cell==="Expired"||cell==="expired"||cell==="overdue")
                                        ? <span style={{fontWeight:700,color:T.red,background:T.redBg,padding:"2px 8px",borderRadius:6,fontSize:11}}>{cell}</span>
                                        :(cell==="Warning"||cell==="Expiring Soon"||cell==="expiring")
                                        ? <span style={{fontWeight:700,color:"#b45309",background:"#fef3c7",padding:"2px 8px",borderRadius:6,fontSize:11}}>{cell}</span>
                                        :(cell==="Pass"||cell==="Verified"||cell==="valid"||cell==="approved"||cell==="paid"||cell==="Active")
                                        ? <span style={{fontWeight:700,color:T.green,background:T.greenBg,padding:"2px 8px",borderRadius:6,fontSize:11}}>{cell}</span>
                                        : cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                              {rows.length===0&&(
                                <tr><td colSpan={headers.length} style={{padding:"32px",textAlign:"center",color:T.muted}}>No data matches the current filters.</td></tr>
                              )}
                            </tbody>
                          </table>
                          {rows.length>50&&<div style={{padding:"10px 14px",fontSize:11,color:T.muted,borderTop:`1px solid ${T.border}`,background:"#f8fafc"}}>Showing 50 of {rows.length} rows. Export to see all data.</div>}
                        </div>
                      </Card>
                    </>
                  );
                })()
            }
          </div>
        </div>
      )}

      {/* ── FULL PREVIEW ───────────────────────────────────────────────────── */}
      {view==="preview"&&(()=>{
        const {headers,rows} = getRows();
        const activeFilters = Object.entries(filters).filter(([,v])=>v).length;
        return (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <span style={{fontWeight:800,fontSize:16,color:T.text}}>{reportName||"Custom Report"}</span>
                <div style={{fontSize:12,color:T.muted,marginTop:2}}>{REPORT_SOURCES[source]?.icon} {REPORT_SOURCES[source]?.label} · {rows.length} rows · {selFields.length} columns{activeFilters?` · ${activeFilters} filter${activeFilters>1?"s":""}`:""}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <ExportMenu exports={[
                  {icon:"📋",label:"Export CSV",fn:()=>exportCSV(`${(reportName||"report").replace(/\s+/g,"-")}.csv`,headers,rows)},
                  {icon:"🖨️",label:"Export PDF",fn:()=>exportHTML(reportName||"Custom Report","Nexus RPO — Custom Report",buildTable(headers,rows))},
                ]}/>
                <Btn variant="secondary" onClick={()=>setView("builder")}>← Edit Report</Btn>
                <Btn variant="secondary" onClick={saveReport}>{justSaved?"✅ Saved!":"💾 Save"}</Btn>
              </div>
            </div>

            {/* Active filters summary */}
            {activeFilters>0&&(
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {Object.entries(filters).filter(([,v])=>v).map(([k,v])=>(
                  <span key={k} style={{fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:20,background:T.amberBg,color:T.amberText,display:"flex",alignItems:"center",gap:5}}>
                    {k==="compScope"?"Scope"
                    :k==="compType"?"Type"
                    :k==="compCategory"?"Category"
                    :k==="compMandatory"?"Mandatory"
                    :k==="compActive"?"Status"
                    :k==="compOverallStatus"?"Overall"
                    :k.charAt(0).toUpperCase()+k.slice(1)}: {k==="rtwType"?RTW_LABEL[v]||v:v}
                    <button onClick={()=>setFilters(p=>({...p,[k]:""}))} style={{background:"none",border:"none",cursor:"pointer",color:T.amberText,fontSize:12,padding:0,lineHeight:1}}>✕</button>
                  </span>
                ))}
              </div>
            )}

            <Card>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead>
                    <tr style={{background:T.navy}}>
                      <th style={{padding:"9px 12px",color:"rgba(255,255,255,0.5)",fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap",width:40}}>#</th>
                      {headers.map(h=>(
                        <th key={h} style={{padding:"9px 12px",textAlign:"left",color:"white",fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row,i)=>(
                      <tr key={i} style={{borderBottom:`1px solid ${T.border}`,background:i%2===0?"transparent":"#f8fafc"}}>
                        <td style={{padding:"8px 12px",color:T.muted,fontSize:11}}>{i+1}</td>
                        {row.map((cell,j)=>(
                          <td key={j} style={{padding:"8px 12px",color:T.text}}>
                            {(cell==="Fail"||cell==="Expired"||cell==="expired"||cell==="overdue")
                              ? <span style={{fontWeight:700,color:T.red,background:T.redBg,padding:"2px 8px",borderRadius:6,fontSize:11}}>{cell}</span>
                              :(cell==="Warning"||cell==="Expiring Soon"||cell==="expiring")
                              ? <span style={{fontWeight:700,color:"#b45309",background:"#fef3c7",padding:"2px 8px",borderRadius:6,fontSize:11}}>{cell}</span>
                              :(cell==="Pass"||cell==="Verified"||cell==="valid"||cell==="approved"||cell==="paid"||cell==="Active")
                              ? <span style={{fontWeight:700,color:T.green,background:T.greenBg,padding:"2px 8px",borderRadius:6,fontSize:11}}>{cell}</span>
                              : cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {rows.length===0&&(
                      <tr><td colSpan={headers.length+1} style={{padding:"40px",textAlign:"center",color:T.muted,fontSize:13}}>No data matches the current filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        );
      })()}
    </Page>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════════
   NEW FEATURE COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════════ */

/* ─── NOTIFICATION CENTRE ────────────────────────────────────────────────────── */
const NotificationPanel = ({role,onClose,onNavigate}) => {
  const [notes,setNotes] = useState(INIT_NOTIFICATIONS[role]||[]);
  const unread = notes.filter(n=>!n.read).length;
  const markAll = () => setNotes(n=>n.map(x=>({...x,read:true})));
  const typeIcon = {urgent_shift:"🚨",rate_uplift:"📈",invoice_overdue:"📄",compliance:"🛡",contract:"📋",message:"💬",budget_alert:"💰",timesheet:"🕐"};
  const typeColor = {urgent_shift:T.red,rate_uplift:T.amber,invoice_overdue:"#f97316",compliance:T.purple,contract:T.blue,message:T.teal,budget_alert:"#b45309",timesheet:T.green};
  return (
    <div style={{position:"fixed",top:0,right:0,bottom:0,width:380,background:T.white,boxShadow:"-4px 0 32px rgba(0,0,0,0.15)",zIndex:1000,display:"flex",flexDirection:"column",fontFamily:"Syne,sans-serif"}}>
      <div style={{padding:"18px 20px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontWeight:800,fontSize:16,color:T.text}}>Notifications</div>
          <div style={{fontSize:11,color:T.muted,marginTop:2}}>{unread} unread</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {unread>0&&<button onClick={markAll} style={{fontSize:11,fontWeight:700,color:T.amber,background:"none",border:"none",cursor:"pointer",fontFamily:"Syne,sans-serif"}}>Mark all read</button>}
          <button onClick={onClose} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:T.muted,lineHeight:1}}>✕</button>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        {notes.length===0?<div style={{padding:40,textAlign:"center",color:T.muted,fontSize:13}}>You're all caught up!</div>:notes.map(n=>(
          <div key={n.id} onClick={()=>{setNotes(ns=>ns.map(x=>x.id===n.id?{...x,read:true}:x));if(n.action&&onNavigate)onNavigate(n.action);onClose();}}
            style={{padding:"14px 20px",borderBottom:`1px solid ${T.border}`,cursor:"pointer",background:n.read?"transparent":"#fffbeb",display:"flex",gap:12,alignItems:"flex-start",transition:"background 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"} onMouseLeave={e=>e.currentTarget.style.background=n.read?"transparent":"#fffbeb"}>
            <div style={{width:34,height:34,borderRadius:10,background:typeColor[n.type]+"22",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{typeIcon[n.type]||"🔔"}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                <span style={{fontWeight:700,fontSize:12,color:T.text}}>{n.title}</span>
                {!n.read&&<span style={{width:7,height:7,borderRadius:"50%",background:T.amber,flexShrink:0,display:"inline-block"}}/>}
              </div>
              <div style={{fontSize:11,color:T.muted,lineHeight:1.5,marginBottom:3}}>{n.body}</div>
              <div style={{fontSize:10,color:"#94a3b8",fontWeight:600}}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── EXPIRY CALENDAR ─────────────────────────────────────────────────────────── */
const ExpiryCalendar = ({user,complianceReqs}) => {
  const today = "2026-03-10";
  const in90  = "2026-06-10";
  const expiryItems = [
    ...WORKERS.filter(w=>w.dbsExpiry).map(w=>({label:`${w.name} — DBS`,date:w.dbsExpiry,type:"DBS",agency:w.agency,role:w.role,status:w.dbsExpiry<today?"expired":w.dbsExpiry<=in90?"expiring":"ok"})),
    ...WORKERS.filter(w=>w.trainingExpiry).map(w=>({label:`${w.name} — Mandatory Training`,date:w.trainingExpiry,type:"Training",agency:w.agency,role:w.role,status:w.trainingExpiry<today?"expired":w.trainingExpiry<=in90?"expiring":"ok"})),
    ...WORKERS.filter(w=>w.rtwExpiry).map(w=>({label:`${w.name} — RTW (${RTW_LABEL[w.rtwType]||w.rtwType})`,date:w.rtwExpiry,type:"RTW",agency:w.agency,role:w.role,status:w.rtwExpiry<today?"expired":w.rtwExpiry<=in90?"expiring":"ok"})),
    ...WORKERS.filter(w=>w.pin&&w.role==="RGN"||w.role==="RMN").map(w=>({label:`${w.name} — NMC/PIN`,date:w.dbsExpiry,type:"NMC/PIN",agency:w.agency,role:w.role,status:"ok"})),
  ].filter(e=>e.date&&e.date<=in90).sort((a,b)=>a.date.localeCompare(b.date));

  const [typeF,setTypeF]=useState("all");
  const [monthF,setMonthF]=useState("all");
  const months=["2026-03","2026-04","2026-05","2026-06"];
  const filtered=expiryItems.filter(e=>(typeF==="all"||e.type===typeF)&&(monthF==="all"||e.date.startsWith(monthF)));
  const expired=filtered.filter(e=>e.status==="expired");
  const expiring=filtered.filter(e=>e.status==="expiring");
  const statusColor={expired:T.red,expiring:"#b45309",ok:T.green};
  const statusBg={expired:T.redBg,expiring:"#fef3c7",ok:T.greenBg};
  return (
    <Page title="Expiry Calendar" sub="All upcoming document & credential expirations across all workers" icon="📆">
      <Grid cols={3}>
        <Stat label="Expired Now"    value={expiryItems.filter(e=>e.status==="expired").length}   sub="Immediate action needed" accent/>
        <Stat label="Expiring ≤90d"  value={expiryItems.filter(e=>e.status==="expiring").length}  sub="Within next 3 months"/>
        <Stat label="Workers Affected" value={[...new Set(expiryItems.map(e=>e.label.split("—")[0].trim()))].length} sub="unique workers"/>
      </Grid>
      {expired.length>0&&<Alert type="error">🚨 {expired.length} document{expired.length>1?"s have":" has"} already expired. Workers cannot be placed until renewed.</Alert>}
      <Card style={{padding:"14px 16px"}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Type</label>
            <select value={typeF} onChange={e=>setTypeF(e.target.value)} style={{padding:"7px 10px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:12,fontFamily:"Syne,sans-serif",background:T.white,color:T.text,outline:"none"}}>
              <option value="all">All Types</option>
              {["DBS","Training","RTW","NMC/PIN"].map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:5}}>Month</label>
            <select value={monthF} onChange={e=>setMonthF(e.target.value)} style={{padding:"7px 10px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:12,fontFamily:"Syne,sans-serif",background:T.white,color:T.text,outline:"none"}}>
              <option value="all">All Months</option>
              {months.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div style={{marginLeft:"auto",fontSize:12,color:T.muted,alignSelf:"flex-end",paddingBottom:2}}>{filtered.length} items</div>
        </div>
      </Card>
      {months.filter(m=>monthF==="all"||m===monthF).map(m=>{
        const monthItems=filtered.filter(e=>e.date.startsWith(m));
        if(!monthItems.length)return null;
        const label={[months[0]]:"March 2026",[months[1]]:"April 2026",[months[2]]:"May 2026",[months[3]]:"June 2026"}[m];
        return (
          <div key={m}>
            <div style={{fontSize:13,fontWeight:800,color:T.text,marginBottom:8,paddingLeft:4}}>{label}</div>
            <Card style={{padding:0,overflow:"hidden"}}>
              {monthItems.map((e,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 18px",borderBottom:i<monthItems.length-1?`1px solid ${T.border}`:"none",background:e.status==="expired"?"#fff5f5":e.status==="expiring"?"#fffbeb":"transparent"}}>
                  <div style={{width:52,textAlign:"center",flexShrink:0}}>
                    <div style={{fontSize:18,fontWeight:800,color:statusColor[e.status]}}>{e.date.split("-")[2]}</div>
                    <div style={{fontSize:9,fontWeight:700,color:T.muted,textTransform:"uppercase"}}>{["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(e.date.split("-")[1])]}</div>
                  </div>
                  <div style={{width:3,height:36,borderRadius:2,background:statusColor[e.status],flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13,color:T.text}}>{e.label}</div>
                    <div style={{fontSize:11,color:T.muted,marginTop:1}}>{e.agency} · {e.role}</div>
                  </div>
                  <Badge label={e.type} color={T.purple} bg={T.purpleBg}/>
                  <span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,color:statusColor[e.status],background:statusBg[e.status],textTransform:"capitalize"}}>{e.status==="expiring"?"Expiring Soon":e.status}</span>
                </div>
              ))}
            </Card>
          </div>
        );
      })}
    </Page>
  );
};

/* ─── CQC READINESS REPORT ────────────────────────────────────────────────────── */
const CQCReadinessReport = ({user,complianceReqs}) => {
  const totalWorkers=WORKERS.length;
  const dbsOk=WORKERS.filter(w=>w.dbs==="valid").length;
  const trainOk=WORKERS.filter(w=>w.training==="valid").length;
  const rtwOk=WORKERS.filter(w=>w.rtwVerified).length;
  const pinOk=WORKERS.filter(w=>w.pin||(w.role!=="RGN"&&w.role!=="RMN")).length;
  const overallScore=Math.round(((dbsOk+trainOk+rtwOk+pinOk)/(totalWorkers*4))*100);
  const sections=[
    {label:"DBS Certificates",    pass:dbsOk,   total:totalWorkers, icon:"🔍", notes:"Enhanced DBS required for all staff"},
    {label:"Mandatory Training",  pass:trainOk, total:totalWorkers, icon:"📚", notes:"Safeguarding, fire, IPC, moving & handling"},
    {label:"Right to Work",       pass:rtwOk,   total:totalWorkers, icon:"🪪", notes:"All workers verified pre-placement"},
    {label:"NMC/PIN (Nurses)",    pass:pinOk,   total:WORKERS.filter(w=>w.role==="RGN"||w.role==="RMN").length, icon:"⚕️",notes:"Active PIN verified against NMC register"},
  ];
  const agencyCompliance=AGENCIES.map(a=>({name:a.name,tier:a.tier,compliance:a.compliance,shifts:a.shifts,fillRate:a.fillRate})).sort((a,b)=>b.compliance-a.compliance);
  const accent=user?.role==="clientadmin"?"#7c3aed":T.amber;
  return (
    <Page title="CQC Readiness Report" sub="One-click compliance summary for inspection readiness" icon="🏅">
      <div style={{background:`linear-gradient(135deg,${T.navy},#1e3a5f)`,borderRadius:16,padding:"24px 28px",marginBottom:20,display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:48,fontWeight:800,color:T.white,lineHeight:1}}>{overallScore}%</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:4}}>Overall Readiness</div>
        </div>
        <div style={{width:1,height:60,background:"rgba(255,255,255,0.15)"}}/>
        <div style={{flex:1}}>
          <div style={{fontFamily:"Instrument Serif,serif",fontSize:18,color:T.white,marginBottom:6}}>CQC Inspection Readiness</div>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.6,margin:0}}>This report consolidates worker credentials, compliance rates, and agency performance into a single inspection-ready summary. Generated {new Date().toLocaleDateString("en-GB")}.</p>
        </div>
        <Btn onClick={()=>exportHTML("CQC Readiness Report","Nexus RPO","<h2>Generated: "+new Date().toLocaleDateString("en-GB")+"</h2><p>Overall score: "+overallScore+"%</p>")}>Export PDF</Btn>
      </div>
      <Grid cols={4}>
        {sections.map(s=>{
          const pct=Math.round((s.pass/Math.max(s.total,1))*100);
          const col=pct>=95?T.green:pct>=80?"#b45309":T.red;
          return(
            <Card key={s.label}>
              <div style={{fontSize:24,marginBottom:8}}>{s.icon}</div>
              <div style={{fontWeight:800,fontSize:13,color:T.text,marginBottom:2}}>{s.label}</div>
              <div style={{fontSize:11,color:T.muted,marginBottom:10}}>{s.notes}</div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <ProgressBar value={pct} color={col}/>
                <span style={{fontWeight:800,fontSize:14,color:col}}>{pct}%</span>
              </div>
              <div style={{fontSize:11,color:T.muted}}>{s.pass}/{s.total} workers compliant</div>
            </Card>
          );
        })}
      </Grid>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <CardHead title="Agency Compliance League" icon="🏆"/>
          <Table headers={["Agency","Tier","Compliance","Fill Rate","Shifts"]} rows={agencyCompliance.map((a,i)=>(
            <tr key={a.name} style={{borderBottom:`1px solid ${T.border}`}}>
              <Td><span style={{fontWeight:700,marginRight:6,color:T.muted}}>#{i+1}</span>{a.name}</Td>
              <Td><Badge label={a.tier} color={TIER_CFG[a.tier]?.c||T.muted} bg={TIER_CFG[a.tier]?.bg||"#f1f5f9"}/></Td>
              <Td><span style={{fontWeight:700,color:a.compliance>=95?T.green:a.compliance>=80?"#b45309":T.red}}>{a.compliance}%</span></Td>
              <Td>{a.fillRate}%</Td>
              <Td>{a.shifts}</Td>
            </tr>
          ))}/>
        </Card>
        <Card>
          <CardHead title="Compliance Requirements Register" icon="🛡"/>
          <Table headers={["Requirement","Scope","Mandatory","Expiry"]} rows={(complianceReqs||INIT_COMPLIANCE_REQS).filter(r=>r.active).map(r=>(
            <tr key={r.id} style={{borderBottom:`1px solid ${T.border}`}}>
              <Td bold>{r.name}</Td>
              <Td><Badge label={r.scope==="global"?"Global":"Site"} color={r.scope==="global"?T.blue:T.purple} bg={r.scope==="global"?T.blueBg:T.purpleBg}/></Td>
              <Td>{r.mandatory?<Badge label="Mandatory" color={T.red} bg={T.redBg}/>:<Badge label="Recommended" color={T.muted} bg="#f1f5f9"/>}</Td>
              <Td style={{fontSize:11,color:T.muted}}>{r.expiryMonths?`${r.expiryMonths}m`:"Permanent"}</Td>
            </tr>
          ))}/>
        </Card>
      </div>
    </Page>
  );
};

/* ─── DEMAND FORECAST ─────────────────────────────────────────────────────────── */
const DemandForecast = ({user}) => {
  const accent=user?.role==="clientadmin"?"#7c3aed":T.amber;
  const sites=Object.keys(SITE_COLORS);
  const siteForecasts=sites.map(s=>({site:s,weeks:FORECAST_DATA.map(w=>({...w,value:Math.round((w.forecast||0)*(0.15+Math.random()*0.25))}))}));
  return (
    <Page title="Demand Forecast" sub="Predicted shift demand based on historical patterns — next 6 weeks" icon="🔮">
      <Alert type="info">📊 Forecasts use 12-week rolling averages weighted by day-of-week, seasonality, and historic fill patterns. Actual demand may vary.</Alert>
      <Grid cols={4}>
        <Stat label="Forecast This Week"  value={21}  sub="shifts predicted" accent/>
        <Stat label="Peak Week"           value="w/c 31 Mar" sub="24 shifts — Easter period"/>
        <Stat label="Avg Fill Rate"       value="87%" sub="last 12 weeks"/>
        <Stat label="Capacity Risk"       value="High" sub="Easter week — book early"/>
      </Grid>
      <Card>
        <CardHead title="Total Shift Demand — 6 Week Forecast" icon="📈"/>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={FORECAST_DATA} margin={{top:10,right:20,left:0,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border}/>
            <XAxis dataKey="week" tick={{fontSize:11,fill:T.muted}} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:T.muted}} tickLine={false} axisLine={false}/>
            <Tooltip contentStyle={{borderRadius:10,border:`1px solid ${T.border}`,fontFamily:"Syne,sans-serif",fontSize:12}}/>
            <Bar dataKey="actual" fill={T.navy} name="Actual" radius={[4,4,0,0]} maxBarSize={32}/>
            <Line dataKey="forecast" stroke={accent} strokeWidth={2.5} dot={{r:4,fill:accent}} name="Forecast" strokeDasharray="6 3"/>
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <CardHead title="Forecast by Site" icon="🏥"/>
        <Table headers={["Site","w/c 10 Mar","w/c 17 Mar","w/c 24 Mar","w/c 31 Mar","w/c 7 Apr","w/c 14 Apr","Trend"]} rows={siteForecasts.map(sf=>(
          <tr key={sf.site} style={{borderBottom:`1px solid ${T.border}`}}>
            <Td><span style={{fontWeight:700,fontSize:12,color:SITE_COLORS[sf.site]||T.text}}>{sf.site}</span></Td>
            {sf.weeks.map((w,i)=><Td key={i}><span style={{fontWeight:600,color:w.value>5?T.red:w.value>3?"#b45309":T.text}}>{w.value}</span></Td>)}
            <Td><span style={{color:T.green,fontWeight:700}}>↑ +12%</span></Td>
          </tr>
        ))}/>
      </Card>
      <Card style={{padding:"18px 20px"}}>
        <CardHead title="Unfill Root Cause Analysis" icon="🔍"/>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:8}}>
          {[["No workers available",38],["Short notice",24],["Rate too low",18],["Location too far",11],["Worker declined",9]].map(([reason,pct])=>(
            <div key={reason} style={{flex:1,minWidth:140,padding:"12px 14px",border:`1px solid ${T.border}`,borderRadius:10,background:"#f8fafc"}}>
              <div style={{fontSize:11,color:T.muted,marginBottom:4}}>{reason}</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <ProgressBar value={pct} color={pct>30?T.red:pct>20?"#b45309":T.muted}/>
                <span style={{fontWeight:700,fontSize:13,color:T.text}}>{pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Page>
  );
};

/* ─── BUDGET TRACKER ──────────────────────────────────────────────────────────── */
const BudgetTracker = ({careHome,budgets,setBudgets}) => {
  const site=careHome||"Sunrise Care";
  const b=budgets?.[site]||{annual:180000,monthly:15000,mtdSpend:8420,ytdSpend:48200,alertAt75:true,alertAt90:true};
  const [editModal,setEditModal]=useState(false);
  const [editForm,setEditForm]=useState({monthly:b.monthly,annual:b.annual,alertAt75:b.alertAt75,alertAt90:b.alertAt90});
  const openEdit=()=>{ setEditForm({monthly:b.monthly,annual:b.annual,alertAt75:b.alertAt75,alertAt90:b.alertAt90}); setEditModal(true); };
  const saveEdit=()=>{
    if(setBudgets) setBudgets(prev=>({...prev,[site]:{...b,monthly:Number(editForm.monthly),annual:Number(editForm.annual),alertAt75:editForm.alertAt75,alertAt90:editForm.alertAt90}}));
    setEditModal(false);
  };
  const mtdPct=Math.round((b.mtdSpend/b.monthly)*100);
  const ytdPct=Math.round((b.ytdSpend/b.annual)*100);
  const mtdCol=mtdPct>=90?T.red:mtdPct>=75?"#b45309":T.green;
  const remaining=b.monthly-b.mtdSpend;
  const daysInMonth=31; const dayOfMonth=10;
  const projectedMonthly=Math.round(b.mtdSpend*(daysInMonth/dayOfMonth));
  const overUnder=projectedMonthly-b.monthly;
  return (
    <Card style={{border:`1px solid ${mtdPct>=90?T.red:mtdPct>=75?"#fcd34d":T.border}`}}>
      {editModal&&(
        <Modal title={`Set Budget — ${site}`} onClose={()=>setEditModal(false)}>
          <Alert type="info">These budgets control the tracker bar and alert thresholds. Spend figures are populated automatically from approved timesheets.</Alert>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            <Input label="Monthly Budget (£)" type="number" value={editForm.monthly} onChange={v=>setEditForm(f=>({...f,monthly:v}))}/>
            <Input label="Annual Budget (£)"  type="number" value={editForm.annual}  onChange={v=>setEditForm(f=>({...f,annual:v}))}/>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10}}>Budget Alerts</label>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[{k:"alertAt75",label:"Alert me when 75% of monthly budget is used",color:"#b45309",bg:"#fef3c7"},{k:"alertAt90",label:"Alert me when 90% of monthly budget is used",color:T.red,bg:T.redBg}].map(opt=>(
                <label key={opt.k} onClick={()=>setEditForm(f=>({...f,[opt.k]:!f[opt.k]}))} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,border:`1.5px solid ${editForm[opt.k]?opt.color:T.border}`,background:editForm[opt.k]?opt.bg:T.white,cursor:"pointer"}}>
                  <input type="checkbox" checked={editForm[opt.k]} readOnly style={{accentColor:opt.color,width:14,height:14}}/>
                  <span style={{fontSize:13,fontWeight:600,color:editForm[opt.k]?opt.color:T.text}}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={saveEdit} disabled={!editForm.monthly||!editForm.annual}>Save Budget</Btn>
            <Btn variant="secondary" onClick={()=>setEditModal(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
      <CardHead title="Budget Tracker" icon="💰" action={<Btn small variant="secondary" onClick={openEdit}>Set Budget</Btn>}/>
      {mtdPct>=90&&<Alert type="error">⚠️ 90% of monthly budget reached. £{remaining.toLocaleString()} remaining this month.</Alert>}
      {mtdPct>=75&&mtdPct<90&&<Alert type="warning">📊 75% of monthly budget used. Monitor spending carefully.</Alert>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{padding:"14px",background:"#f8fafc",borderRadius:10}}>
          <div style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Month to Date</div>
          <ProgressBar value={mtdPct} color={mtdCol}/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
            <span style={{fontSize:13,fontWeight:800,color:mtdCol}}>£{b.mtdSpend.toLocaleString()}</span>
            <span style={{fontSize:11,color:T.muted}}>of £{b.monthly.toLocaleString()}</span>
          </div>
        </div>
        <div style={{padding:"14px",background:"#f8fafc",borderRadius:10}}>
          <div style={{fontSize:10,fontWeight:700,color:T.muted,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>Year to Date</div>
          <ProgressBar value={ytdPct} color={ytdPct>=85?T.red:T.blue}/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
            <span style={{fontSize:13,fontWeight:800,color:T.blue}}>£{b.ytdSpend.toLocaleString()}</span>
            <span style={{fontSize:11,color:T.muted}}>of £{b.annual.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        <div style={{flex:1,padding:"10px 14px",borderRadius:8,background:overUnder>0?T.redBg:T.greenBg,border:`1px solid ${overUnder>0?T.red+"44":T.green+"44"}`}}>
          <div style={{fontSize:10,color:T.muted,fontWeight:600}}>End-of-month projection</div>
          <div style={{fontSize:14,fontWeight:800,color:overUnder>0?T.red:T.green}}>£{projectedMonthly.toLocaleString()}</div>
          <div style={{fontSize:11,color:overUnder>0?T.red:T.green}}>{overUnder>0?`£${overUnder.toLocaleString()} over budget`:`£${Math.abs(overUnder).toLocaleString()} under budget`}</div>
        </div>
        <div style={{flex:1,padding:"10px 14px",borderRadius:8,background:"#f8fafc",border:`1px solid ${T.border}`}}>
          <div style={{fontSize:10,color:T.muted,fontWeight:600}}>Remaining this month</div>
          <div style={{fontSize:14,fontWeight:800,color:T.text}}>£{remaining.toLocaleString()}</div>
          <div style={{fontSize:11,color:T.muted}}>≈ {Math.round(remaining/35)} RGN day shifts</div>
        </div>
      </div>
    </Card>
  );
};

/* ─── RATE UPLIFT MANAGER ─────────────────────────────────────────────────────── */
const RateUpliftManager = ({user,rateUplifts,setRateUplifts}) => {
  const [uplifts,setLocal]=useState(rateUplifts||INIT_RATE_UPLIFTS);
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({role:"RGN",current:"",requested:"",reason:""});
  const isAdmin=user?.role==="admin";
  const isAgency=user?.role==="agency";
  const respond=(id,decision)=>setLocal(u=>u.map(x=>x.id===id?{...x,status:decision,respondedDate:"2026-03-10",respondedBy:user.name}:x));
  const submit=()=>{
    const nu={id:`ru${uplifts.length+1}`,agency:"First Choice Nursing",role:form.role,current:parseFloat(form.current),requested:parseFloat(form.requested),reason:form.reason,status:"pending",submittedDate:"2026-03-10",respondedDate:null,respondedBy:null,notes:""};
    setLocal(u=>[nu,...u]);setShowForm(false);setForm({role:"RGN",current:"",requested:"",reason:""});
  };
  const statusColor={pending:"#b45309",approved:T.green,rejected:T.red};
  const statusBg={pending:"#fef3c7",approved:T.greenBg,rejected:T.redBg};
  return (
    <Page title={isAdmin?"Rate Uplift Requests":"Rate Uplift Requests"} sub={isAdmin?"Review and approve agency rate change requests":"Submit a rate change request to Nexus RPO"} icon="📈">
      {isAgency&&(
        <div style={{marginBottom:16}}>
          {showForm?(
            <Card style={{padding:20}}>
              <CardHead title="New Rate Request" icon="➕"/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
                <div><label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,marginBottom:4}}>Role</label>
                  <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} style={{width:"100%",padding:"8px 10px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:12,fontFamily:"Syne,sans-serif",outline:"none"}}>
                    {["RGN","RMN","HCA","Senior Carer"].map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
                <Input label="Current Rate (£/hr)" type="number" value={form.current} onChange={v=>setForm(f=>({...f,current:v}))}/>
                <Input label="Requested Rate (£/hr)" type="number" value={form.requested} onChange={v=>setForm(f=>({...f,requested:v}))}/>
              </div>
              <Input label="Business Justification" value={form.reason} onChange={v=>setForm(f=>({...f,reason:v}))}/>
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <Btn onClick={submit} disabled={!form.current||!form.requested||!form.reason}>Submit Request</Btn>
                <Btn variant="secondary" onClick={()=>setShowForm(false)}>Cancel</Btn>
              </div>
            </Card>
          ):<Btn onClick={()=>setShowForm(true)}>+ New Rate Request</Btn>}
        </div>
      )}
      <Grid cols={3}>
        <Stat label="Pending"  value={uplifts.filter(u=>u.status==="pending").length}  accent/>
        <Stat label="Approved" value={uplifts.filter(u=>u.status==="approved").length}/>
        <Stat label="Rejected" value={uplifts.filter(u=>u.status==="rejected").length}/>
      </Grid>
      <Card>
        <Table headers={isAdmin?["Agency","Role","Current","Requested","Uplift","Reason","Submitted","Status","Actions"]:["Role","Current","Requested","Reason","Submitted","Status"]}
          rows={uplifts.map(u=>(
            <tr key={u.id} style={{borderBottom:`1px solid ${T.border}`,background:u.status==="pending"?"#fffbeb":"transparent"}}>
              {isAdmin&&<Td bold>{u.agency}</Td>}
              <Td><Badge label={u.role} color={T.purple} bg={T.purpleBg}/></Td>
              <Td>£{u.current}{"/hr"}</Td>
              <Td bold>£{u.requested}{"/hr"}</Td>
              <Td><span style={{fontWeight:700,color:T.green}}>+£{(u.requested-u.current).toFixed(2)}</span></Td>
              <Td style={{maxWidth:200,whiteSpace:"normal",fontSize:11,color:T.muted}}>{u.reason}</Td>
              <Td style={{fontSize:11,color:T.muted}}>{u.submittedDate}</Td>
              <Td><span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,color:statusColor[u.status],background:statusBg[u.status],textTransform:"capitalize"}}>{u.status}</span></Td>
              {isAdmin&&<Td>{u.status==="pending"&&<div style={{display:"flex",gap:4}}><Btn small onClick={()=>respond(u.id,"approved")}>✓ Approve</Btn><Btn small variant="danger" onClick={()=>respond(u.id,"rejected")}>✕ Reject</Btn></div>}</Td>}
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};

/* ─── CREDIT NOTE MANAGER ─────────────────────────────────────────────────────── */
const CreditNoteManager = ({user}) => {
  const [notes,setNotes]=useState(INIT_CREDIT_NOTES);
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({invoiceRef:"",agency:"",reason:"",amount:""});
  const create=()=>{
    setNotes(n=>[{id:`CN-00${n.length+1}`,...form,amount:parseFloat(form.amount),issuedDate:"2026-03-10",status:"pending"},...n]);
    setShowForm(false);setForm({invoiceRef:"",agency:"",reason:"",amount:""});
  };
  return (
    <Page title="Credit Notes" sub="Manage credit notes against disputed or adjusted invoices" icon="🧾">
      <div style={{marginBottom:16,display:"flex",gap:10}}>
        <Btn onClick={()=>setShowForm(s=>!s)}>+ New Credit Note</Btn>
      </div>
      {showForm&&(
        <Card style={{padding:20,marginBottom:16}}>
          <CardHead title="Issue Credit Note" icon="🧾"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Invoice Reference" value={form.invoiceRef} onChange={v=>setForm(f=>({...f,invoiceRef:v}))} placeholder="INV-0010"/>
            <div><label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,marginBottom:4}}>Agency</label>
              <select value={form.agency} onChange={e=>setForm(f=>({...f,agency:e.target.value}))} style={{width:"100%",padding:"8px 10px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:12,fontFamily:"Syne,sans-serif",outline:"none"}}>
                <option value="">Select agency</option>
                {AGENCIES.map(a=><option key={a.name} value={a.name}>{a.name}</option>)}
              </select>
            </div>
            <Input label="Amount (£)" type="number" value={form.amount} onChange={v=>setForm(f=>({...f,amount:v}))}/>
            <Input label="Reason" value={form.reason} onChange={v=>setForm(f=>({...f,reason:v}))}/>
          </div>
          <div style={{display:"flex",gap:8,marginTop:12}}><Btn onClick={create} disabled={!form.invoiceRef||!form.agency||!form.amount}>Issue Credit Note</Btn><Btn variant="secondary" onClick={()=>setShowForm(false)}>Cancel</Btn></div>
        </Card>
      )}
      <Grid cols={3}>
        <Stat label="Total Credit Notes" value={notes.length} accent/>
        <Stat label="Total Value"        value={`£${notes.reduce((s,n)=>s+n.amount,0).toLocaleString()}`}/>
        <Stat label="Pending Application" value={notes.filter(n=>n.status==="pending").length}/>
      </Grid>
      <Card>
        <Table headers={["Credit Note ID","Invoice Ref","Agency","Reason","Amount","Issued","Status","Action"]} rows={notes.map(n=>(
          <tr key={n.id} style={{borderBottom:`1px solid ${T.border}`}}>
            <Td bold style={{fontFamily:"monospace",fontSize:12}}>{n.id}</Td>
            <Td style={{fontSize:11,color:T.muted}}>{n.invoiceRef}</Td>
            <Td>{n.agency}</Td>
            <Td style={{fontSize:11,color:T.muted,maxWidth:200,whiteSpace:"normal"}}>{n.reason}</Td>
            <Td><span style={{fontWeight:700,color:T.red}}>-£{n.amount.toLocaleString()}</span></Td>
            <Td style={{fontSize:11,color:T.muted}}>{n.issuedDate}</Td>
            <Td><span style={{fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,color:n.status==="applied"?T.green:"#b45309",background:n.status==="applied"?T.greenBg:"#fef3c7",textTransform:"capitalize"}}>{n.status==="applied"?"Applied":"Pending"}</span></Td>
            <Td>{n.status==="pending"&&<Btn small onClick={()=>setNotes(ns=>ns.map(x=>x.id===n.id?{...x,status:"applied"}:x))}>Mark Applied</Btn>}</Td>
          </tr>
        ))}/>
      </Card>
    </Page>
  );
};

/* ─── MESSAGING CENTRE ────────────────────────────────────────────────────────── */
const MessagingCentre = ({user}) => {
  const [threads,setThreads]=useState(INIT_THREADS);
  const [messages,setMessages]=useState(INIT_MESSAGES);
  const [activeThread,setActiveThread]=useState(null);
  const [newMsg,setNewMsg]=useState("");
  const accent=user?.role==="bank"?T.teal:user?.role==="clientadmin"?"#7c3aed":T.amber;
  const threadMessages=activeThread?messages.filter(m=>m.threadId===activeThread.id):[];
  const send=()=>{
    if(!newMsg.trim()||!activeThread)return;
    const m={id:`m${messages.length+1}`,threadId:activeThread.id,shiftId:activeThread.shiftId,from:user.name,fromRole:user.role,to:"",toRole:"",text:newMsg,timestamp:new Date().toISOString(),read:false};
    setMessages(ms=>[...ms,m]);
    setThreads(ts=>ts.map(t=>t.id===activeThread.id?{...t,lastMessage:m.timestamp,unread:0}:t));
    setNewMsg("");
  };
  const totalUnread=threads.reduce((s,t)=>s+t.unread,0);
  return (
    <Page title="Messages" sub="Threaded conversations per shift and worker" icon="💬">
      <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:16,minHeight:500}}>
        {/* Thread list */}
        <Card style={{padding:0,overflow:"hidden"}}>
          <div style={{padding:"14px 16px",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontWeight:700,fontSize:13}}>Conversations</span>
            {totalUnread>0&&<span style={{fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:20,background:T.amberBg,color:T.amberText}}>{totalUnread} unread</span>}
          </div>
          {threads.map(t=>{
            const lastMsg=messages.filter(m=>m.threadId===t.id).slice(-1)[0];
            const active=activeThread?.id===t.id;
            return(
              <div key={t.id} onClick={()=>{setActiveThread(t);setThreads(ts=>ts.map(x=>x.id===t.id?{...x,unread:0}:x));}}
                style={{padding:"12px 16px",borderBottom:`1px solid ${T.border}`,cursor:"pointer",background:active?T.amberBg:"transparent",borderLeft:active?`3px solid ${accent}`:"3px solid transparent",transition:"all 0.15s"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:3}}>
                  <span style={{fontWeight:700,fontSize:12,color:T.text}}>{t.subject}</span>
                  {t.unread>0&&<span style={{width:8,height:8,borderRadius:"50%",background:accent,flexShrink:0,marginTop:3}}/>}
                </div>
                {lastMsg&&<div style={{fontSize:11,color:T.muted,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}><strong>{lastMsg.from.split(" ")[0]}:</strong> {lastMsg.text}</div>}
                <div style={{fontSize:10,color:"#94a3b8",marginTop:3}}>{t.type==="shift"?"📋 Shift":"👤 Worker"} · {new Date(t.lastMessage).toLocaleDateString("en-GB")}</div>
              </div>
            );
          })}
        </Card>
        {/* Message pane */}
        <Card style={{padding:0,display:"flex",flexDirection:"column",minHeight:500}}>
          {activeThread?(
            <>
              <div style={{padding:"14px 18px",borderBottom:`1px solid ${T.border}`}}>
                <div style={{fontWeight:700,fontSize:14,color:T.text}}>{activeThread.subject}</div>
                <div style={{fontSize:11,color:T.muted,marginTop:2}}>Participants: {activeThread.participants.join(", ")}</div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"16px 18px",display:"flex",flexDirection:"column",gap:12}}>
                {threadMessages.map(m=>{
                  const mine=m.from===user.name;
                  return(
                    <div key={m.id} style={{display:"flex",flexDirection:mine?"row-reverse":"row",gap:10,alignItems:"flex-end"}}>
                      <div style={{width:30,height:30,borderRadius:"50%",background:mine?accent:T.navy,display:"flex",alignItems:"center",justifyContent:"center",color:T.white,fontSize:12,fontWeight:700,flexShrink:0}}>{m.from.charAt(0)}</div>
                      <div style={{maxWidth:"70%"}}>
                        <div style={{fontSize:10,color:T.muted,marginBottom:3,textAlign:mine?"right":"left"}}>{m.from} · {new Date(m.timestamp).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"})}</div>
                        <div style={{padding:"10px 14px",borderRadius:mine?"14px 14px 4px 14px":"14px 14px 14px 4px",background:mine?accent:T.navy,color:T.white,fontSize:13,lineHeight:1.5}}>{m.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{padding:"12px 18px",borderTop:`1px solid ${T.border}`,display:"flex",gap:10}}>
                <input value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type a message…" style={{flex:1,padding:"10px 14px",border:`1.5px solid ${T.border}`,borderRadius:10,fontSize:13,fontFamily:"Syne,sans-serif",outline:"none"}}/>
                <Btn onClick={send} disabled={!newMsg.trim()}>Send</Btn>
              </div>
            </>
          ):(
            <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:40,textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:12}}>💬</div>
              <div style={{fontWeight:700,fontSize:14,color:T.text,marginBottom:6}}>Select a conversation</div>
              <p style={{color:T.muted,fontSize:13}}>Choose a thread from the left to view messages.</p>
            </div>
          )}
        </Card>
      </div>
    </Page>
  );
};

/* ─── RECURRING SHIFT MANAGER (care home request page enhancement) ────────────── */
const RecurringShifts = ({user}) => {
  const [patterns,setPatterns]=useState(INIT_RECURRING_PATTERNS);
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({role:"RGN",days:[],time:"07:00–19:00",rate:35,notes:""});
  const toggleDay=(d)=>setForm(f=>({...f,days:f.days.includes(d)?f.days.filter(x=>x!==d):[...f.days,d]}));
  const save=()=>{
    setPatterns(p=>[...p,{id:`rp${p.length+1}`,carehome:"Sunrise Care",...form,active:true,createdBy:user?.name||"Karen Hughes"}]);
    setShowForm(false);setForm({role:"RGN",days:[],time:"07:00–19:00",rate:35,notes:""});
  };
  const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return (
    <Page title="Recurring Shift Patterns" sub="Auto-publish shifts on a weekly schedule without manual entry" icon="🔄">
      <Alert type="info">⚡ Active patterns auto-publish shifts every week. Nexus RPO will broadcast them to agencies based on your tier configuration.</Alert>
      <div style={{marginBottom:16}}><Btn onClick={()=>setShowForm(s=>!s)}>+ New Pattern</Btn></div>
      {showForm&&(
        <Card style={{padding:20,marginBottom:16}}>
          <CardHead title="New Recurring Pattern" icon="🔄"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
            <div><label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,marginBottom:4}}>Role</label>
              <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} style={{width:"100%",padding:"8px 10px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:12,fontFamily:"Syne,sans-serif",outline:"none"}}>
                {["RGN","RMN","HCA","Senior Carer"].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <Input label="Shift Time" value={form.time} onChange={v=>setForm(f=>({...f,time:v}))} placeholder="07:00–19:00"/>
            <Input label="Rate (£/hr)" type="number" value={form.rate} onChange={v=>setForm(f=>({...f,rate:parseFloat(v)||0}))}/>
          </div>
          <div style={{marginBottom:12}}>
            <label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,marginBottom:6}}>Days</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {days.map(d=><button key={d} onClick={()=>toggleDay(d)} style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${form.days.includes(d)?T.amber:T.border}`,background:form.days.includes(d)?T.amberBg:"transparent",color:form.days.includes(d)?T.amberText:T.muted,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"Syne,sans-serif"}}>{d}</button>)}
            </div>
          </div>
          <Input label="Notes" value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))}/>
          <div style={{display:"flex",gap:8,marginTop:12}}><Btn onClick={save} disabled={!form.days.length}>Save Pattern</Btn><Btn variant="secondary" onClick={()=>setShowForm(false)}>Cancel</Btn></div>
        </Card>
      )}
      <Card>
        <Table headers={["Role","Days","Time","Rate","Status","Created By","Actions"]} rows={patterns.map(p=>(
          <tr key={p.id} style={{borderBottom:`1px solid ${T.border}`,opacity:p.active?1:0.5}}>
            <Td><Badge label={p.role} color={T.purple} bg={T.purpleBg}/></Td>
            <Td><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{p.days.map(d=><span key={d} style={{fontSize:11,fontWeight:700,padding:"2px 7px",borderRadius:20,background:T.amberBg,color:T.amberText}}>{d}</span>)}</div></Td>
            <Td style={{fontSize:12,color:T.muted}}>{p.time}</Td>
            <Td bold>£{p.rate}{"/hr"}</Td>
            <Td>{p.active?<Badge label="Active" color={T.green} bg={T.greenBg} dot/>:<Badge label="Paused" color={T.muted} bg="#f1f5f9"/>}</Td>
            <Td style={{fontSize:11,color:T.muted}}>{p.createdBy}</Td>
            <Td><div style={{display:"flex",gap:4}}>
              <Btn small variant="secondary" onClick={()=>setPatterns(ps=>ps.map(x=>x.id===p.id?{...x,active:!x.active}:x))}>{p.active?"Pause":"Resume"}</Btn>
              <Btn small variant="danger" onClick={()=>setPatterns(ps=>ps.filter(x=>x.id!==p.id))}>Delete</Btn>
            </div></Td>
          </tr>
        ))}/>
      </Card>
    </Page>
  );
};

/* ─── WORKER FAVOURITES & BLACKLIST (care home) ────────────────────────────────── */
const WorkerPreferences = ({user}) => {
  const [prefs,setPrefs]=useState(INIT_WORKER_PREFS);
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({workerId:"",type:"favourite",note:""});
  const careHome=user?.role==="carehome"?"Sunrise Care":null;
  const myPrefs=prefs.filter(p=>!careHome||p.careHome===careHome);
  const addPref=()=>{
    const w=WORKERS.find(x=>x.id===parseInt(form.workerId));
    if(!w)return;
    setPrefs(p=>[...p,{careHome:careHome||"Sunrise Care",workerId:w.id,workerName:w.name,type:form.type,addedBy:user?.name||"Karen Hughes",note:form.note}]);
    setShowForm(false);setForm({workerId:"",type:"favourite",note:""});
  };
  return (
    <Page title="Worker Preferences" sub="Flag preferred or restricted workers for your site" icon="⭐">
      <div style={{marginBottom:16}}><Btn onClick={()=>setShowForm(s=>!s)}>+ Add Preference</Btn></div>
      {showForm&&(
        <Card style={{padding:20,marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,marginBottom:4}}>Worker</label>
              <select value={form.workerId} onChange={e=>setForm(f=>({...f,workerId:e.target.value}))} style={{width:"100%",padding:"8px 10px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:12,fontFamily:"Syne,sans-serif",outline:"none"}}>
                <option value="">Select worker…</option>
                {WORKERS.map(w=><option key={w.id} value={w.id}>{w.name} ({w.role})</option>)}
              </select>
            </div>
            <div><label style={{display:"block",fontSize:11,fontWeight:700,color:T.muted,marginBottom:4}}>Type</label>
              <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={{width:"100%",padding:"8px 10px",border:`1.5px solid ${T.border}`,borderRadius:8,fontSize:12,fontFamily:"Syne,sans-serif",outline:"none"}}>
                <option value="favourite">⭐ Favourite — request first</option>
                <option value="blocked">🚫 Blocked — do not place</option>
              </select>
            </div>
          </div>
          <div style={{marginTop:12}}><Input label="Note (visible only to your site)" value={form.note} onChange={v=>setForm(f=>({...f,note:v}))}/></div>
          <div style={{display:"flex",gap:8,marginTop:12}}><Btn onClick={addPref} disabled={!form.workerId}>Save</Btn><Btn variant="secondary" onClick={()=>setShowForm(false)}>Cancel</Btn></div>
        </Card>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {["favourite","blocked"].map(type=>(
          <Card key={type}>
            <CardHead title={type==="favourite"?"⭐ Preferred Workers":"🚫 Blocked Workers"} icon=""/>
            {myPrefs.filter(p=>p.type===type).length===0?<p style={{color:T.muted,fontSize:12,padding:"8px 0"}}>None set.</p>:
            myPrefs.filter(p=>p.type===type).map((p,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",padding:"10px 0",borderBottom:i<myPrefs.filter(x=>x.type===type).length-1?`1px solid ${T.border}`:"none"}}>
                <div>
                  <div style={{fontWeight:700,fontSize:13,color:T.text}}>{p.workerName}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:2}}>{p.note}</div>
                  <div style={{fontSize:10,color:"#94a3b8",marginTop:2}}>Added by {p.addedBy}</div>
                </div>
                <button onClick={()=>setPrefs(ps=>ps.filter((_,j)=>j!==prefs.indexOf(p)))} style={{background:"none",border:"none",cursor:"pointer",color:T.red,fontSize:13,fontWeight:700}}>✕</button>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </Page>
  );
};

/* ─── AGENCY ONBOARDING CHECKLIST ─────────────────────────────────────────────── */
const AgencyOnboarding = ({user}) => {
  const [checklists,setChecklists]=useState(INIT_AGENCY_CHECKLISTS);
  const [selected,setSelected]=useState(checklists[0]?.agencyId||null);
  const toggle=(agencyId,itemId)=>setChecklists(cs=>cs.map(c=>c.agencyId===agencyId?{...c,items:c.items.map(i=>i.id===itemId?{...i,done:!i.done,doneDate:!i.done?"2026-03-10":null}:i)}:c));
  const cl=checklists.find(c=>c.agencyId===selected)||checklists[0];
  const pct=cl?Math.round((cl.items.filter(i=>i.done).length/cl.items.length)*100):0;
  return (
    <Page title="Agency Onboarding Checklists" sub="Track agency setup progress from contract to first shift" icon="✅">
      <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:16}}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {checklists.map(c=>{
            const p=Math.round((c.items.filter(i=>i.done).length/c.items.length)*100);
            return(
              <div key={c.agencyId} onClick={()=>setSelected(c.agencyId)} style={{padding:"12px 14px",borderRadius:10,border:`1.5px solid ${selected===c.agencyId?T.amber:T.border}`,background:selected===c.agencyId?T.amberBg:T.white,cursor:"pointer"}}>
                <div style={{fontWeight:700,fontSize:12,color:T.text,marginBottom:4}}>{c.agencyName}</div>
                <ProgressBar value={p} color={p===100?T.green:p>=50?"#b45309":T.red}/>
                <div style={{fontSize:11,color:T.muted,marginTop:3}}>{p}% complete</div>
              </div>
            );
          })}
          <Btn variant="secondary" small onClick={()=>navigate&&navigate("agencies")}>+ Add Agency</Btn>
        </div>
        {cl&&(
          <Card>
            <CardHead title={cl.agencyName} icon="🤝"/>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,padding:"12px 14px",background:pct===100?T.greenBg:T.amberBg,borderRadius:10}}>
              <div style={{flex:1}}><ProgressBar value={pct} color={pct===100?T.green:"#b45309"}/></div>
              <span style={{fontWeight:800,fontSize:14,color:pct===100?T.green:"#b45309"}}>{pct}%</span>
              <span style={{fontSize:12,color:T.muted}}>{cl.items.filter(i=>i.done).length}/{cl.items.length} complete</span>
            </div>
            {cl.items.map(item=>(
              <div key={item.id} onClick={()=>toggle(cl.agencyId,item.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${T.border}`,cursor:"pointer"}}>
                <div style={{width:22,height:22,borderRadius:6,border:`2px solid ${item.done?T.green:T.border}`,background:item.done?T.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {item.done&&<span style={{color:T.white,fontSize:12,lineHeight:1}}>✓</span>}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:item.done?500:700,fontSize:13,color:item.done?T.muted:T.text,textDecoration:item.done?"line-through":"none"}}>{item.label}</div>
                  {item.doneDate&&<div style={{fontSize:10,color:T.green,marginTop:2}}>Completed {item.doneDate}</div>}
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </Page>
  );
};

/* ─── SHIFT ESCALATION TIMELINE (visible in shift detail / shift board) ─────────── */
const EscalationTimeline = ({shift}) => {
  if(!shift) return null;
  const delay={tier1:0,tier2:30,tier3:60};
  const now=new Date("2026-03-11T17:45:00");
  const broadcast=new Date("2026-03-11T15:30:00");
  const minsElapsed=Math.floor((now-broadcast)/60000);
  const stages=[
    {label:"Tier 1 Broadcast",mins:0,     desc:"First Choice Nursing, ProCare Staffing",done:true,  active:minsElapsed>=0&&minsElapsed<30},
    {label:"Tier 2 Escalation",mins:30,   desc:"MedStaff UK notified",                  done:minsElapsed>=30, active:minsElapsed>=30&&minsElapsed<60},
    {label:"Tier 3 Escalation",mins:60,   desc:"CareForce notified",                     done:minsElapsed>=60, active:minsElapsed>=60&&minsElapsed<120},
    {label:"Auto-cancelled",   mins:120,  desc:"No cover — care home notified",           done:false, active:false},
  ];
  return (
    <div style={{padding:"14px 16px",background:"#f8fafc",borderRadius:10,marginTop:12}}>
      <div style={{fontSize:11,fontWeight:700,color:T.muted,marginBottom:12,textTransform:"uppercase",letterSpacing:"0.07em"}}>Escalation Timeline — {minsElapsed}m since broadcast</div>
      <div style={{display:"flex",alignItems:"flex-start",gap:0,position:"relative"}}>
        {stages.map((s,i)=>(
          <div key={i} style={{flex:1,position:"relative"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:s.done?T.green:s.active?T.amber:T.border,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1,position:"relative",transition:"all 0.3s"}}>
                <span style={{color:T.white,fontSize:12,fontWeight:700}}>{s.done?"✓":s.active?"●":""}</span>
              </div>
              {i<stages.length-1&&<div style={{position:"absolute",top:14,left:"50%",width:"100%",height:2,background:s.done?T.green:T.border,zIndex:0}}/>}
              <div style={{marginTop:8,textAlign:"center",padding:"0 4px"}}>
                <div style={{fontSize:11,fontWeight:700,color:s.active?T.amber:s.done?T.green:T.muted}}>{s.label}</div>
                <div style={{fontSize:9,color:T.muted,marginTop:2}}>+{s.mins}min</div>
                <div style={{fontSize:10,color:T.muted,marginTop:2,lineHeight:1.3}}>{s.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClientAdminShifts = ({user}) => {
  const today = "2026-03-10";
  const allSites = [...new Set(SHIFTS.map(s=>s.carehome))].sort();
  const [site,    setSite]    = useState("all");
  const [tab,     setTab]     = useState("unfilled");
  const [pubModal,setPubModal] = useState(null);
  const [publishedToBank,setPublishedToBank] = useState([]);
  const [selectedBroadcast,setSelectedBroadcast] = useState("bank_first");

  const siteShifts = site==="all" ? SHIFTS : SHIFTS.filter(s=>s.carehome===site);

  const tabDefs = [
    {k:"unfilled", l:"Unfilled", count: siteShifts.filter(s=>(s.status==="open"||s.status==="pending")&&s.date>=today).length, color:T.red},
    {k:"filled",   l:"Filled",   count: siteShifts.filter(s=>s.status==="filled").length, color:T.green},
    {k:"expired",  l:"Expired",  count: siteShifts.filter(s=>s.date<today&&s.status!=="filled").length, color:T.muted},
  ];

  const visible = siteShifts.filter(s=>{
    if(tab==="unfilled") return (s.status==="open"||s.status==="pending") && s.date>=today;
    if(tab==="filled")   return s.status==="filled";
    if(tab==="expired")  return s.date<today && s.status!=="filled";
    return true;
  }).sort((a,b)=>a.date.localeCompare(b.date));

  return (
    <Page title="All Shifts" sub="Group-wide shift overview" icon="📋">
      {pubModal && (
        <Modal title={`Publish Shift — ${pubModal.carehome} (${pubModal.role})`} onClose={()=>{setPubModal(null);setSelectedBroadcast("bank_first");}}>
          <p style={{fontSize:13,color:T.muted,marginBottom:14}}>{pubModal.date} · {pubModal.time}</p>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:18}}>
            {BROADCAST_OPTIONS.map(opt=>{
              const sel=selectedBroadcast===opt.key;
              return (
                <button key={opt.key} onClick={()=>setSelectedBroadcast(opt.key)}
                  style={{display:"flex",gap:12,alignItems:"flex-start",padding:"12px 14px",borderRadius:10,border:`2px solid ${sel?opt.color:T.border}`,background:sel?opt.bg:T.white,cursor:"pointer",textAlign:"left",fontFamily:"Syne,sans-serif",width:"100%"}}>
                  <span style={{fontSize:20}}>{opt.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:12,color:sel?opt.color:T.text,marginBottom:2}}>{opt.label}</div>
                    <div style={{fontSize:11,color:T.muted,lineHeight:1.4}}>{opt.desc}</div>
                  </div>
                  <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${sel?opt.color:T.border}`,background:sel?opt.color:"transparent",flexShrink:0,marginTop:2}}/>
                </button>
              );
            })}
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={()=>{setPublishedToBank(b=>[...b,pubModal.id]);setPubModal(null);setSelectedBroadcast("bank_first");}}>Publish Shift {"→"}</Btn>
            <Btn variant="secondary" onClick={()=>{setPubModal(null);setSelectedBroadcast("bank_first");}}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Stats row */}
      <Grid cols={4}>
        <Stat label="Total Shifts" value={siteShifts.length}/>
        <Stat label="Filled" value={siteShifts.filter(s=>s.status==="filled").length} accent/>
        <Stat label="Unfilled" value={siteShifts.filter(s=>(s.status==="open"||s.status==="pending")&&s.date>=today).length} sub="Needs cover"/>
        <Stat label="Expired Unfilled" value={siteShifts.filter(s=>s.date<today&&s.status!=="filled").length} sub="No cover found"/>
      </Grid>

      {/* Site filter + tabs row */}
      <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap",marginBottom:4}}>
        {/* Site filter pills */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {["all",...allSites].map(s=>{
            const active=site===s;
            return (
              <button key={s} onClick={()=>setSite(s)}
                style={{padding:"6px 14px",borderRadius:20,border:`1.5px solid ${active?CA_PURPLE:T.border}`,
                  background:active?`${CA_PURPLE}18`:T.white,fontWeight:700,fontSize:12,cursor:"pointer",
                  color:active?CA_PURPLE:T.muted,fontFamily:"Syne,sans-serif"}}>
                {s==="all"?"All Sites":s}
              </button>
            );
          })}
        </div>

        <div style={{width:1,height:24,background:T.border}}/>

        {/* Status tabs */}
        <div style={{display:"flex",gap:0,background:"#f1f5f9",borderRadius:10,padding:4}}>
          {tabDefs.map(t=>{
            const active=tab===t.k;
            return (
              <button key={t.k} onClick={()=>setTab(t.k)}
                style={{padding:"6px 16px",borderRadius:8,border:"none",fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",
                  background:active?T.white:"transparent",color:active?T.navy:T.muted,
                  boxShadow:active?"0 1px 4px rgba(0,0,0,0.1)":"none",display:"flex",alignItems:"center",gap:6}}>
                {t.l}
                <span style={{fontSize:11,fontWeight:700,padding:"2px 7px",borderRadius:20,
                  background:active?t.color+"18":"transparent",color:active?t.color:T.muted}}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHead
          title={(site==="all"?"All Sites":site) + " — " + tabDefs.find(t=>t.k===tab)?.l}
          sub={`${visible.length} shift${visible.length!==1?"s":""} shown`}
        />
        {visible.length===0
          ? <div style={{padding:40,textAlign:"center",color:T.muted,fontSize:13}}>No {tab} shifts{site!=="all"?` for ${site}`:""} found.</div>
          : <Table
              headers={tab==="expired"
                ? ["Location","Role","Date","Time","Urgency","Status"]
                : ["Location","Role","Date","Time","Urgency","Status","Agency","Worker","Action"]}
              rows={visible.map(s=>(
                <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`}}>
                  <Td>
                    <span style={{fontSize:12,fontWeight:700,color:SITE_COLORS[s.carehome]||CA_PURPLE}}>{s.carehome}</span>
                  </Td>
                  <Td><Badge label={s.role} color={T.purple} bg={T.purpleBg}/></Td>
                  <Td bold>{s.date}</Td>
                  <Td style={{fontSize:12,color:T.muted}}>{s.time}</Td>
                  <Td><span style={{fontSize:12,color:urgencyColor(s.urgency),fontWeight:600}}><UrgDot u={s.urgency}/>{s.urgency}</span></Td>
                  <Td><SBadge s={s.status}/></Td>
                  {tab!=="expired" && <>
                    <Td style={{fontSize:12}}>{s.agency||"—"}</Td>
                    <Td style={{fontSize:12}}>{s.worker||<span style={{color:"#94a3b8"}}>Awaiting</span>}</Td>
                    <Td>
                      {publishedToBank.includes(s.id)
                        ? <Badge label="Published" color={T.teal} bg={T.tealBg}/>
                        : s.status==="open"
                        ? <Btn small onClick={()=>setPubModal(s)}>Publish {"→"}</Btn>
                        : <span style={{fontSize:11,color:T.muted}}>—</span>}
                    </Td>
                  </>}
                </tr>
              ))}
            />
        }
      </Card>
    </Page>
  );
};

const VIEWS = {
  admin:       {
    dashboard:AdminDashboard,shifts:ShiftBoard,schedule:Scheduler,agencies:AgencyManagement,
    clients:ClientManager,bankstaff:BankStaffManagement,workers:WorkerDirectory,
    compliance:ComplianceTracker,expirycal:ExpiryCalendar,cqcreport:CQCReadinessReport,
    documents:DocumentVault,ratecards:RateCards,bankrates:BankRateCards,rateuplifts:RateUpliftManager,
    invoices:InvoiceManager,creditnotes:CreditNoteManager,timesheets:AdminTimesheets,
    budgets:AdminBudgets,analytics:Analytics,forecast:DemandForecast,reports:CustomReports,
    messages:MessagingCentre,siteallocation:SiteAllocation,margins:MarginManager,
    users:UsersAndPermissions,
  },
  clientadmin: {
    dashboard:ClientAdminDashboard,analytics:CareHomeGroupAnalytics,forecast:DemandForecast,
    locations:ClientAdminLocations,
    shifts:ClientAdminShifts,
    timesheets:CareHomeTimesheets,invoices:CareHomeInvoices,budgets:ClientAdminBudgets,bankrates:BankRateCards,compliance:CareHomeCompliance,
    expirycal:ExpiryCalendar,rtw:RtwMonitoringReport,cqcreport:CQCReadinessReport,
    reports:CustomReports,messages:MessagingCentre,workers:CareHomeWorkers,
    users:CareHomeUsersAndPermissions,
  },
  carehome:    {
    dashboard:CareHomeDashboard,request:RequestShift,
    myshifts:CareHomeMyShifts,
    calendar:CareHomeCalendar,compliance:CareHomeCompliance,expirycal:ExpiryCalendar,
    rtw:RtwMonitoringReport,cqcreport:CQCReadinessReport,invoices:CareHomeInvoices,
    timesheets:CareHomeTimesheets,workers:CareHomeWorkers,messages:MessagingCentre,
    recurring:RecurringShifts,workerprefs:WorkerPreferences,
  },
  agency:      {
    dashboard:AgencyDashboard,available:AvailableShifts,workers:AgencyWorkers,
    timesheets:AgencyTimesheets,onboard:WorkerOnboarding,rtw:AgencyRightToWork,
    rateuplifts:RateUpliftManager,documents:AgencyDocuments,invoices:AgencyInvoices,
    messages:MessagingCentre,users:AgencyUsersAndPermissions,
  },
  bank:        {
    dashboard:BankDashboard,available:BankAvailableShifts,myshifts:BankMyShifts,
    availability:BankAvailability,earnings:BankEarnings,messages:MessagingCentre,
    profile:BankProfile,
  },
};

const AppShell = ({user,onLogout}) => {
  const [tab,setTab]                           = useState("dashboard");
  const [timesheets,setTimesheets]             = useState(INIT_TIMESHEETS);
  const [users,setUsers]                       = useState(INIT_USERS);
  const [complianceReqs,setComplianceReqs]     = useState(INIT_COMPLIANCE_REQS);
  const [marginCfg,setMarginCfg]               = useState(INIT_MARGIN_CONFIG);
  const [invoices,setInvoices]                 = useState(INVOICES);
  const [rateCards,setRateCards]               = useState(INIT_RATE_CARDS);
  const [rateUplifts,setRateUplifts]           = useState(INIT_RATE_UPLIFTS);
  const [budgets,setBudgets]                   = useState(INIT_BUDGETS);
  const [bankRates,setBankRates]               = useState(INIT_BANK_RATES);
  const [shiftPatterns,setShiftPatterns]       = useState(INIT_SHIFT_PATTERNS);
  const [showNotifs,setShowNotifs]             = useState(false);

  const thisUser = users.find(u=>u.email===user.email||(u.role===user.role&&u.org===user.org)) || users.find(u=>u.role===user.role);
  const perms    = thisUser?.superAdmin ? null : (thisUser?.perms || null);
  const effectiveTab = (perms&&perms[tab]===false) ? "dashboard" : tab;

  const pendingTs = user.role==="carehome"
    ? timesheets.filter(t=>t.carehome==="Sunrise Care"&&t.status==="pending").length
    : user.role==="clientadmin"
    ? timesheets.filter(t=>t.status==="pending").length
    : user.role==="admin"
    ? timesheets.filter(t=>t.status==="approved").length
    : user.role==="agency"
    ? timesheets.filter(t=>t.agency==="First Choice"&&t.status==="disputed").length
    : 0;

  const unreadNotifs = (INIT_NOTIFICATIONS[user.role]||[]).filter(n=>!n.read).length;
  const accent = user.role==="bank"?T.teal:user.role==="clientadmin"?"#7c3aed":T.amber;

  const View = VIEWS[user.role]?.[effectiveTab];

  return (
    <div style={{display:"flex",minHeight:"100vh",fontFamily:"Syne,sans-serif"}}>
      <style>{FONTS}</style>
      <Sidebar role={user.role} active={effectiveTab} setActive={setTab} user={user} onLogout={onLogout} tsBadge={pendingTs} perms={perms}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        {/* Top notification bar */}
        <div style={{height:48,background:T.white,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:24,gap:12,flexShrink:0}}>
          <button onClick={()=>setShowNotifs(s=>!s)} style={{position:"relative",background:"none",border:"none",cursor:"pointer",padding:6,borderRadius:8,color:T.text,fontSize:20,lineHeight:1,transition:"background 0.15s"}}
            onMouseEnter={e=>e.currentTarget.style.background="#f1f5f9"} onMouseLeave={e=>e.currentTarget.style.background="none"}>
            🔔
            {unreadNotifs>0&&<span style={{position:"absolute",top:2,right:2,width:16,height:16,borderRadius:"50%",background:accent,color:T.white,fontSize:9,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center"}}>{unreadNotifs}</span>}
          </button>
          <div style={{fontSize:12,color:T.muted,fontWeight:600}}>{user.name}</div>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {View
            ? <View user={user} navigate={setTab} timesheets={timesheets} setTimesheets={setTimesheets} users={users} setUsers={setUsers} complianceReqs={complianceReqs} setComplianceReqs={setComplianceReqs} marginCfg={marginCfg} setMarginCfg={setMarginCfg} rateCards={rateCards} setRateCards={setRateCards} invoices={invoices} setInvoices={setInvoices} rateUplifts={rateUplifts} setRateUplifts={setRateUplifts} budgets={budgets} setBudgets={setBudgets} bankRates={bankRates} setBankRates={setBankRates} shiftPatterns={shiftPatterns} setShiftPatterns={setShiftPatterns}/>
            : <Page title="Coming Soon"><p style={{color:T.muted}}>This section is under construction.</p></Page>}
        </div>
      </div>
      {showNotifs&&(
        <>
          <div onClick={()=>setShowNotifs(false)} style={{position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,0.2)"}}/>
          <NotificationPanel role={user.role} onClose={()=>setShowNotifs(false)} onNavigate={(tab)=>{setTab(tab);setShowNotifs(false);}}/>
        </>
      )}
    </div>
  );
};

/* ─── ROOT ───────────────────────────────────────────────────────────────────── */
export default function App() {
  const [user,setUser] = useState(null);
  return user
    ? <AppShell user={user} onLogout={()=>setUser(null)}/>
    : <AuthScreen onAuth={setUser}/>;
}
