import { T } from "../theme/tokens.js";

// Agency panels per client — which agencies are approved to fill shifts for each client group
// Maps care home name → client group ID (for panel lookups)
export const HOME_TO_GROUP = {
  "Sunrise Care":          "cg1",
  "Sunrise Dementia Unit": "cg1",
  "Meadowbrook Lodge":     "cg2",
  "Oakwood Nursing":       "cg2",
  "Riverside Manor":       "cg3",
};

export const CARE_HOMES = [
  {id:1,name:"Sunrise Care",contact:"Karen Hughes",email:"k.hughes@sunrise.co.uk",beds:42,type:"Residential"},
  {id:2,name:"Meadowbrook Lodge",contact:"Paul Osei",email:"p.osei@meadowbrook.co.uk",beds:58,type:"Nursing"},
  {id:3,name:"Oakwood Nursing",contact:"Janet Mills",email:"j.mills@oakwood.co.uk",beds:36,type:"Dementia"},
  {id:4,name:"Riverside Manor",contact:"Steve Walters",email:"s.walters@riverside.co.uk",beds:64,type:"Nursing"},
];

export const INIT_CLIENT_GROUPS = [
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
    panelAgencies:[1,2,3],
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
    panelAgencies:[1,3,4],
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

export const HOME_TYPES = ["Residential","Nursing","Dementia","Learning Disabilities","Mental Health","Mixed"];

export const CONTRACT_STATUSES = ["active","pending","expired","terminated"];

export const blankGroup = () => ({id:`cg_${Date.now()}`,name:"",type:"Residential & Nursing",contact:"",email:"",phone:"",address:"",website:"",contractStart:"",contractEnd:"",status:"active",notes:"",locations:[]});

export const blankLocation = (groupId) => ({id:`l_${Date.now()}`,name:"",type:"Residential",address:"",beds:"",contact:"",email:"",phone:"",cqcRating:"Good",cqcDate:"",status:"active",notes:""});

export const SITE_COLORS = {
  "Sunrise Care": T.amber,
  "Sunrise Dementia Unit": "#8B5CF6",
  "Oakwood Nursing": "#0EA5E9",
  "Meadowbrook Lodge": "#10B981",
  "Riverside Manor": "#EF4444",
};

export const SITE_DATA = {
  "Sunrise Care":          {shifts:16,filled:13,spend:8420, budget:15000,hcas:8, rgns:5,rmns:3},
  "Sunrise Dementia Unit": {shifts:9, filled:8, spend:6100, budget:10000,hcas:4, rgns:3,rmns:2},
  "Oakwood Nursing":       {shifts:14,filled:11,spend:7200, budget:12000,hcas:6, rgns:5,rmns:3},
  "Meadowbrook Lodge":     {shifts:12,filled:9, spend:5800, budget:11000,hcas:5, rgns:4,rmns:3},
  "Riverside Manor":       {shifts:10,filled:8, spend:4900, budget:9000, hcas:4, rgns:4,rmns:2},
};

/* ─── CARE HOME USERS & PERMISSIONS ─────────────────────────────────────────── */
export const ALL_CAREHOME_SITES = ["Sunrise Care","Sunrise Dementia Unit","Oakwood Nursing","Meadowbrook Lodge","Riverside Manor"];
