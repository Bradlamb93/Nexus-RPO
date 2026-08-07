/* ─── PERMISSIONS ─────────────────────────────────────────────────────────────── */
// Each permission key maps to a nav section or action capability
export const PERM_DEFS = {
  admin: [
    {k:"dashboard",   l:"Dashboard",      desc:"View admin dashboard & KPIs"},
    {k:"shifts",      l:"Shift Board",     desc:"View and manage shift board"},
    {k:"schedule",    l:"Scheduler",       desc:"Create and edit shifts"},
    {k:"agencies",    l:"Agencies",        desc:"View and manage agencies"},
    {k:"clients",     l:"Clients & Pricing",desc:"Onboard and manage client groups, locations, panels and pricing"},
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
export const defaultPerms = (role) => Object.fromEntries(PERM_DEFS[role]?.map(p=>[p.k,true])||[]);

export const INIT_USERS = [
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
  {id:"u23",name:"Bev Simmons",    email:"b.simmons@careforce.co.uk",      role:"agency",org:"CareForce",          status:"active",   lastLogin:"2026-03-03",superAdmin:false,perms:{...defaultPerms("agency"),invoices:false,users:false},createdAt:"2025-01-10"},
  // Bank staff users
  {id:"u10",name:"Diane Foster",email:"d.foster@internal.co.uk",role:"bank",org:"Bank Staff",status:"active",lastLogin:"2026-03-10",superAdmin:false,perms:defaultPerms("bank"),createdAt:"2024-05-01"},
  {id:"u11",name:"Carlos Mendes",email:"c.mendes@internal.co.uk",role:"bank",org:"Bank Staff",status:"active",lastLogin:"2026-03-09",superAdmin:false,perms:{...defaultPerms("bank"),earnings:false},createdAt:"2024-05-01"},
  {id:"u12",name:"Yvette Okafor",email:"y.okafor@internal.co.uk",role:"bank",org:"Bank Staff",status:"suspended",lastLogin:"2026-02-14",superAdmin:false,perms:defaultPerms("bank"),createdAt:"2024-06-10"},
];
