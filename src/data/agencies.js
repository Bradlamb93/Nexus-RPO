/* ─── AGENCIES — FIXTURE DATA ───────────────────────────────────────────── */

export const AGENCIES = [
  {id:1,name:"First Choice Nursing",tier:"Tier 1",contact:"Laura Bennett",email:"laura@firstchoice.co.uk",phone:"07700 900123",shifts:42,fillRate:94,avgResponse:"18m",compliance:98,status:"active",spend:28900,joined:"2023-01-15"},
  {id:2,name:"ProCare Staffing",tier:"Tier 1",contact:"Daniel Reid",email:"d.reid@procare.co.uk",phone:"07700 900456",shifts:38,fillRate:89,avgResponse:"25m",compliance:95,status:"active",spend:24650,joined:"2023-03-10"},
  {id:3,name:"MedStaff UK",tier:"Tier 2",contact:"Priya Shah",email:"priya@medstaff.co.uk",phone:"07700 900789",shifts:21,fillRate:76,avgResponse:"45m",compliance:87,status:"active",spend:13200,joined:"2024-01-08"},
  {id:4,name:"CareForce",tier:"Tier 3",contact:"Mike Turner",email:"mike@careforce.co.uk",phone:"07700 900321",shifts:14,fillRate:71,avgResponse:"52m",compliance:82,status:"active",spend:8750,joined:"2024-06-01"},
];

/* ─── AGENCY ONBOARDING CHECKLISTS ────────────────────────────────────────────── */
export const INIT_AGENCY_CHECKLISTS = [
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
