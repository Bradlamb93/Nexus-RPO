/* ─── NOTIFICATIONS ───────────────────────────────────────────────────────────── */
export const INIT_NOTIFICATIONS = {
  admin:[
    {id:"n1", type:"urgent_shift",    title:"Urgent Shift Unfilled",         body:"Sunrise Care RGN 12 Mar — 2h 15m remaining before escalation to Tier 2.", time:"17m ago",  read:false, action:"shifts"},
    {id:"n2", type:"rate_uplift",     title:"Rate Uplift Request",           body:"First Choice Nursing requesting £2/hr increase for RGN. Awaiting your approval.", time:"2h ago",   read:false, action:"ratecards"},
    {id:"n3", type:"invoice_overdue", title:"Invoice Overdue",               body:"INV-0010 (MedStaff UK) is 10 days overdue. £13,200 outstanding.",          time:"1d ago",   read:true,  action:"invoices"},
    {id:"n4", type:"compliance",      title:"Worker Compliance Lapsed",      body:"Priya Patel — mandatory training expired Dec 2025. Cannot be placed.",     time:"3d ago",   read:true,  action:"compliance"},
    {id:"n5", type:"contract",        title:"Contract Renewal Due",          body:"Lakeside Care Ltd contract expires Dec 2025. Renewal workflow triggered.",  time:"5d ago",   read:true,  action:"clients"},
  ],
  clientadmin:[
    {id:"n7", type:"budget_alert",    title:"Budget Alert — Meadowbrook Lodge", body:"Meadowbrook Lodge has reached 78% of monthly budget with 3 weeks remaining.", time:"4h ago",  read:false, action:"analytics"},
    {id:"n8", type:"urgent_shift",    title:"Urgent Shift Unfilled",            body:"Sunrise Care RGN 12 Mar still open — no agency has responded.",             time:"17m ago", read:false, action:"shifts"},
    {id:"n9", type:"compliance",      title:"RTW Expiring Soon",                body:"Priya Patel (MedStaff UK) BRP expires 31 Mar. Speak to agency.",            time:"1d ago",  read:true,  action:"rtw"},
  ],
  carehome:[
    {id:"n11",type:"urgent_shift",    title:"Your Shift Needs Filling",      body:"RGN 12 Mar — submitted to Tier 1 agencies. Awaiting response.",              time:"17m ago", read:false, action:"myshifts"},
    {id:"n12",type:"timesheet",       title:"Timesheet Awaiting Approval",   body:"2 timesheets from First Choice Nursing need your sign-off.",                  time:"6h ago",  read:false, action:"timesheets"},
    {id:"n13",type:"budget_alert",    title:"Budget Alert — 90% Reached",    body:"You have spent 90% of this month's agency budget. £1,580 remaining.",        time:"1d ago",  read:true,  action:"dashboard"},
  ],
  agency:[
    {id:"n15",type:"urgent_shift",    title:"Urgent Shift — Act Now",        body:"Sunrise Care RGN 12 Mar — 2h 15m left in your Tier 1 window.",               time:"17m ago", read:false, action:"available"},
    {id:"n16",type:"compliance",      title:"Worker Document Expiring",      body:"James Wilson DBS expires 15 Apr. Upload renewal to avoid suspension.",        time:"2h ago",  read:false, action:"rtw"},
    {id:"n17",type:"rate_uplift",     title:"Rate Request Approved",         body:"Your HCA rate uplift request (£1/hr) was approved by Nexus RPO. Effective Mar 2026.",time:"5d ago", read:true,  action:"ratecards"},
  ],
  bank:[
    {id:"n19",type:"urgent_shift",    title:"New Shift in Your Window",      body:"Sunrise Care RGN — 12 Mar, 07:00–19:00. Claim within 2 hours.",              time:"5m ago",  read:false, action:"available"},
    {id:"n20",type:"timesheet",       title:"Timesheet Approved",            body:"Your timesheet for Oakwood Nursing 8 Mar has been approved. Payment processing.",time:"1d ago",read:true,  action:"earnings"},
  ],
};
