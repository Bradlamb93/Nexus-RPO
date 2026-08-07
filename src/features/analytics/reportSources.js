import { AGENCIES } from "../../data/agencies.js";
import { INIT_COMPLIANCE_REQS, RTW_LABEL } from "../../data/compliance.js";
import { INIT_BUDGETS, INVOICES } from "../../data/finance.js";
import { SHIFTS } from "../../data/shifts.js";
import { INIT_TIMESHEETS } from "../../data/timesheets.js";
import { WORKERS } from "../../data/workers.js";

/* ─── CUSTOM REPORTS ─────────────────────────────────────────────────────────── */
export const REPORT_SOURCES = {
  shifts: {
    label:"Shifts", icon:"clipboard",
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
    label:"Workers", icon:"users",
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
    label:"Invoices", icon:"document",
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
    label:"Agencies", icon:"briefcase",
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
    label:"Timesheets", icon:"clock",
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
    label:"Compliance Requirements", icon:"shield",
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
    label:"Worker Compliance Status", icon:"checkCircle",
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
    label:"Budgets", icon:"money",
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
export const buildBudgetReportData = (budgets) => Object.entries(budgets||INIT_BUDGETS).map(([site,b])=>({
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

export const SAVED_REPORT_TEMPLATES = [
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
