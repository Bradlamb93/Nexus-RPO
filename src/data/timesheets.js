/* ─── TIMESHEETS — FIXTURE DATA ─────────────────────────────────────────── */

export const INIT_TIMESHEETS = [
  {id:"TS-001",shiftId:8, agency:"First Choice",carehome:"Riverside Manor",worker:"Emma Clarke",role:"RMN",date:"2026-03-08",time:"07:00–19:00",scheduledHrs:12,hoursWorked:12,breakMins:30,rate:38,total:456,status:"approved",submittedAt:"2026-03-09",approvedBy:"Steve Walters",disputeReason:"",invoiceId:null},
  {id:"TS-002",shiftId:16,agency:"First Choice",carehome:"Sunrise Care",worker:"Emma Clarke",role:"RMN",date:"2026-03-07",time:"07:00–19:00",scheduledHrs:12,hoursWorked:12,breakMins:30,rate:38,total:456,status:"pending",submittedAt:"2026-03-08",approvedBy:null,disputeReason:"",invoiceId:null},
  {id:"TS-003",shiftId:13,agency:"First Choice",carehome:"Sunrise Care",worker:"Lisa Park",role:"HCA",date:"2026-03-09",time:"07:00–15:00",scheduledHrs:8,hoursWorked:8,breakMins:30,rate:17,total:136,status:"disputed",submittedAt:"2026-03-10",approvedBy:null,disputeReason:"Worker left 30 minutes early — hours should be 7.5, not 8.",invoiceId:null},
  {id:"TS-004",shiftId:2, agency:"ProCare",carehome:"Meadowbrook Lodge",worker:"Sarah Johnson",role:"HCA",date:"2026-03-12",time:"19:00–07:00",scheduledHrs:12,hoursWorked:11,breakMins:30,rate:18,total:198,status:"pending",submittedAt:"2026-03-13",approvedBy:null,disputeReason:"",invoiceId:null},
  {id:"TS-005",shiftId:5, agency:"ProCare",carehome:"Meadowbrook Lodge",worker:"Mohammed Ali",role:"RGN",date:"2026-03-14",time:"07:00–19:00",scheduledHrs:12,hoursWorked:12,breakMins:30,rate:35,total:420,status:"approved",submittedAt:"2026-03-15",approvedBy:"Paul Osei",disputeReason:"",invoiceId:"INV-0013"},
];
