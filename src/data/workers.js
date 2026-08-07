/* ─── WORKERS & BANK STAFF — FIXTURE DATA ───────────────────────────────── */

export const WORKERS = [
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

export const BANK_STAFF = [
  {id:1,name:"Diane Foster",role:"RGN",email:"d.foster@internal.co.uk",phone:"07800 111001",dbs:"valid",dbsExpiry:"2027-05-01",training:"valid",trainingExpiry:"2027-02-01",pin:"44F1122",pinStatus:true,compliance:100,available:true,hoursThisMonth:36,hoursYTD:148,earningsYTD:5180,contracts:["Sunrise Care","Meadowbrook Lodge"]},
  {id:2,name:"Carlos Mendes",role:"HCA",email:"c.mendes@internal.co.uk",phone:"07800 111002",dbs:"valid",dbsExpiry:"2026-11-01",training:"valid",trainingExpiry:"2026-10-01",pin:null,pinStatus:false,compliance:85,available:true,hoursThisMonth:24,hoursYTD:96,earningsYTD:1632,contracts:["Sunrise Care","Oakwood Nursing","Riverside Manor"]},
  {id:3,name:"Yvette Okafor",role:"RMN",email:"y.okafor@internal.co.uk",phone:"07800 111003",dbs:"valid",dbsExpiry:"2027-08-01",training:"valid",trainingExpiry:"2027-04-01",pin:"77Y4489",pinStatus:true,compliance:100,available:false,hoursThisMonth:48,hoursYTD:192,earningsYTD:7104,contracts:["Meadowbrook Lodge","Riverside Manor"]},
  {id:4,name:"Ryan Ashworth",role:"HCA",email:"r.ashworth@internal.co.uk",phone:"07800 111004",dbs:"expiring",dbsExpiry:"2026-04-20",training:"valid",trainingExpiry:"2026-09-01",pin:null,pinStatus:false,compliance:70,available:true,hoursThisMonth:16,hoursYTD:64,earningsYTD:1088,contracts:["Sunrise Care"]},
  {id:5,name:"Miriam Osei",role:"RGN",email:"m.osei@internal.co.uk",phone:"07800 111005",dbs:"valid",dbsExpiry:"2027-03-01",training:"expiring",trainingExpiry:"2026-04-05",pin:"88M5531",pinStatus:true,compliance:80,available:true,hoursThisMonth:40,hoursYTD:160,earningsYTD:5600,contracts:["Oakwood Nursing","Meadowbrook Lodge","Sunrise Care"]},
  {id:6,name:"Jake Thornton",role:"Senior Carer",email:"j.thornton@internal.co.uk",phone:"07800 111006",dbs:"valid",dbsExpiry:"2027-01-01",training:"valid",trainingExpiry:"2026-12-01",pin:null,pinStatus:false,compliance:90,available:true,hoursThisMonth:32,hoursYTD:128,earningsYTD:2816,contracts:["Riverside Manor","Oakwood Nursing"]},
];

export const BANK_SHIFTS = [
  {id:101,carehome:"Sunrise Care",role:"RGN",date:"2026-03-12",time:"07:00–19:00",status:"bank-open",claimedBy:null,rate:32,urgency:"urgent",bankWindowMins:120},
  {id:102,carehome:"Oakwood Nursing",role:"HCA",date:"2026-03-13",time:"07:00–15:00",status:"bank-claimed",claimedBy:"Carlos Mendes",rate:16,urgency:"normal",bankWindowMins:0},
  {id:103,carehome:"Meadowbrook Lodge",role:"RGN",date:"2026-03-14",time:"07:00–19:00",status:"bank-open",claimedBy:null,rate:32,urgency:"high",bankWindowMins:45},
  {id:104,carehome:"Riverside Manor",role:"RMN",date:"2026-03-15",time:"19:00–07:00",status:"bank-claimed",claimedBy:"Yvette Okafor",rate:35,urgency:"normal",bankWindowMins:0},
  {id:105,carehome:"Sunrise Care",role:"HCA",date:"2026-03-16",time:"07:00–19:00",status:"bank-open",claimedBy:null,rate:16,urgency:"normal",bankWindowMins:180},
  {id:106,carehome:"Oakwood Nursing",role:"RGN",date:"2026-03-17",time:"19:00–07:00",status:"bank-open",claimedBy:null,rate:32,urgency:"normal",bankWindowMins:60},
];

export const BANK_EARNINGS=[{month:"Oct",hrs:32,pay:1120},{month:"Nov",hrs:40,pay:1400},{month:"Dec",hrs:28,pay:980},{month:"Jan",hrs:44,pay:1540},{month:"Feb",hrs:48,pay:1680},{month:"Mar",hrs:16,pay:560}];

/* ─── WORKER FAVOURITES / BLACKLIST ────────────────────────────────────────────── */
export const INIT_WORKER_PREFS = [
  {careHome:"Sunrise Care",   workerId:3, workerName:"Emma Clarke",  type:"favourite", addedBy:"Karen Hughes",  note:"Excellent with residents, always punctual"},
  {careHome:"Sunrise Care",   workerId:4, workerName:"James Wilson",  type:"favourite", addedBy:"Karen Hughes",  note:"Familiar with our routines"},
  {careHome:"Oakwood Nursing",workerId:5, workerName:"Priya Patel",   type:"blocked",   addedBy:"Janet Mills",   note:"Previous incident — speak to manager before placing"},
  {careHome:"Meadowbrook Lodge",workerId:7,workerName:"Lisa Park",    type:"favourite", addedBy:"Paul Osei",     note:"Great with dementia patients"},
];
