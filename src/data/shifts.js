import { T } from "../theme/tokens.js";

/* ─── SHIFTS — FIXTURE DATA ─────────────────────────────────────────────── */
export const SHIFTS = [
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

/* ─── EXTENDED SHIFT DATA (unfill reasons, response times, recurring patterns) ─ */
export const UNFILL_REASONS = ["No workers available","Rate too low","Short notice","Location too far","Worker declined","No response from agency","Already filled externally"];

export const SHIFT_RESPONSE_TIMES = [
  {shiftId:1, agency:"First Choice Nursing", broadcastTime:"06:30", submittedTime:"06:48", minsMins:18},
  {shiftId:3, agency:"MedStaff UK",          broadcastTime:"08:00", submittedTime:"08:47", minsMins:47},
  {shiftId:7, agency:"First Choice Nursing", broadcastTime:"09:00", submittedTime:"09:24", minsMins:24},
  {shiftId:12,agency:"First Choice Nursing", broadcastTime:"14:00", submittedTime:"14:19", minsMins:19},
];

export const INIT_RECURRING_PATTERNS = [
  {id:"rp1",carehome:"Sunrise Care",role:"RGN",days:["Mon","Wed","Fri"],time:"07:00–19:00",rate:35,active:true,createdBy:"Karen Hughes",notes:"Regular day cover"},
  {id:"rp2",carehome:"Sunrise Care",role:"HCA",days:["Sat","Sun"],time:"07:00–19:00",rate:18,active:true,createdBy:"Karen Hughes",notes:"Weekend HCA cover"},
  {id:"rp3",carehome:"Meadowbrook Lodge",role:"RGN",days:["Tue","Thu"],time:"19:00–07:00",rate:36,active:false,createdBy:"Paul Osei",notes:"Night cover — paused"},
];

export const ROLES = ["RGN","RMN","HCA","Senior Carer","Deputy Manager"];

export const SHIFT_DAYS = [
  {k:"weekday",     l:"Weekday",    sub:"Mon–Fri"},
  {k:"saturday",    l:"Saturday",   sub:""},
  {k:"sunday",      l:"Sunday",     sub:""},
  {k:"bankHoliday", l:"Bank Hol",   sub:""},
];

export const INIT_SHIFT_PATTERNS = [
  {id:"sp1", k:"07:00-19:00", l:"Early Day",   s:"07:00", e:"19:00", hrs:12},
  {id:"sp2", k:"19:00-07:00", l:"Night",        s:"19:00", e:"07:00", hrs:12},
  {id:"sp3", k:"08:00-20:00", l:"Late Day",     s:"08:00", e:"20:00", hrs:12},
  {id:"sp4", k:"07:00-13:00", l:"Half Day AM",  s:"07:00", e:"13:00", hrs:6},
  {id:"sp5", k:"13:00-19:00", l:"Half Day PM",  s:"13:00", e:"19:00", hrs:6},
];

export const BROADCAST_OPTIONS = [
  {
    key:"bank_first",
    label:"Bank Staff first",
    icon:"bank",
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
    icon:"briefcase",
    desc:"Broadcast directly to Tier 1 agencies immediately. Bank staff will not be notified.",
    color:T.amber,
    bg:T.amberBg,
    border:"rgba(178,94,0,0.3)",
    tag:"Standard",
    tagColor:T.amberText,
  },
  {
    key:"both",
    label:"Bank Staff + Agencies simultaneously",
    icon:"bolt",
    desc:"Notify both bank staff and Tier 1 agencies at the same time. Best for urgent shifts.",
    color:T.red,
    bg:T.redBg,
    border:"rgba(215,0,21,0.35)",
    tag:"Urgent cover",
    tagColor:T.red,
  },
];
