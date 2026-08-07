export const INVOICES = [
  {id:"INV-0012",agency:"ProCare",period:"Feb 2026",shifts:38,amount:24650,status:"paid",due:"2026-03-01",issued:"2026-02-28"},
  {id:"INV-0011",agency:"First Choice",period:"Feb 2026",shifts:42,amount:28900,status:"paid",due:"2026-03-01",issued:"2026-02-28"},
  {id:"INV-0010",agency:"MedStaff UK",period:"Feb 2026",shifts:21,amount:13200,status:"overdue",due:"2026-03-15",issued:"2026-02-28"},
  {id:"INV-0009",agency:"CareForce",period:"Feb 2026",shifts:14,amount:8750,status:"pending",due:"2026-03-15",issued:"2026-02-28"},
  {id:"INV-0013",agency:"ProCare",period:"Mar 2026",shifts:18,amount:12100,status:"draft",due:"2026-04-01",issued:"—"},
];

export const INIT_BUDGETS = {
  "Sunrise Care":          {annual:180000, monthly:15000, alertAt75:true,  alertAt90:true,  mtdSpend:8420,  ytdSpend:48200},
  "Sunrise Dementia Unit": {annual:120000, monthly:10000, alertAt75:true,  alertAt90:true,  mtdSpend:6100,  ytdSpend:31400},
  "Oakwood Nursing":       {annual:144000, monthly:12000, alertAt75:false, alertAt90:true,  mtdSpend:7200,  ytdSpend:39800},
  "Meadowbrook Lodge":     {annual:192000, monthly:16000, alertAt75:true,  alertAt90:false, mtdSpend:9800,  ytdSpend:55100},
  "Riverside Manor":       {annual:168000, monthly:14000, alertAt75:true,  alertAt90:true,  mtdSpend:4200,  ytdSpend:22600},
};

/* ─── CREDIT NOTES ────────────────────────────────────────────────────────────── */
export const INIT_CREDIT_NOTES = [
  {id:"CN-001",invoiceRef:"INV-0010",agency:"MedStaff UK",reason:"Disputed hours — 3hr reduction agreed",amount:180,issuedDate:"2026-02-20",status:"applied"},
  {id:"CN-002",invoiceRef:"INV-0012",agency:"ProCare",    reason:"Worker no-show — 1 shift reversed",   amount:420,issuedDate:"2026-03-01",status:"pending"},
];
