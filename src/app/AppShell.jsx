import React, { useState } from "react";
import { VIEWS } from "./routes.js";
import { Icon } from "../components/Icon.jsx";
import { NotificationPanel } from "../components/NotificationPanel.jsx";
import { Sidebar } from "../components/Sidebar.jsx";
import { Page } from "../components/ui/Page.jsx";
import { INIT_COMPLIANCE_REQS } from "../data/compliance.js";
import { INIT_BUDGETS, INVOICES } from "../data/finance.js";
import { INIT_NOTIFICATIONS } from "../data/notifications.js";
import { INIT_BANK_RATES, INIT_CLIENT_PRICING, INIT_RATE_CARDS, INIT_RATE_UPLIFTS } from "../data/rates.js";
import { INIT_SHIFT_PATTERNS } from "../data/shifts.js";
import { INIT_TIMESHEETS } from "../data/timesheets.js";
import { INIT_USERS } from "../data/users.js";
import { CHROME, FONT, FONTS, T, roleAccent } from "../theme/tokens.js";

/* ─── APP SHELL — CHROME, SHARED STATE & ACTIVE VIEW ────────────────────── */

export const AppShell = ({user,onLogout}) => {
  const [tab,setTab]                           = useState("dashboard");
  const [timesheets,setTimesheets]             = useState(INIT_TIMESHEETS);
  const [users,setUsers]                       = useState(INIT_USERS);
  const [complianceReqs,setComplianceReqs]     = useState(INIT_COMPLIANCE_REQS);
  const [clientPricing,setClientPricing]         = useState(INIT_CLIENT_PRICING);
  const [invoices,setInvoices]                 = useState(INVOICES);
  const [rateCards,setRateCards]               = useState(INIT_RATE_CARDS);
  const [rateUplifts,setRateUplifts]           = useState(INIT_RATE_UPLIFTS);
  const [budgets,setBudgets]                   = useState(INIT_BUDGETS);
  const [bankRates,setBankRates]               = useState(INIT_BANK_RATES);
  const [shiftPatterns,setShiftPatterns]       = useState(INIT_SHIFT_PATTERNS);
  const [showNotifs,setShowNotifs]             = useState(false);
  /* Chrome appearance is a per-user preference, so it outlives the session. */
  const [chrome,setChrome] = useState(() => {
    try { return localStorage.getItem("nexus.chrome") === "dark" ? "dark" : "light"; }
    catch { return "light"; }
  });
  React.useEffect(() => {
    try { localStorage.setItem("nexus.chrome", chrome); } catch { /* private mode */ }
  }, [chrome]);

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
  const accent = roleAccent(user.role);
  const c = CHROME[chrome] || CHROME.light;
  const initials = (user.name||"").split(" ").filter(Boolean).slice(0,2).map(w=>w[0]).join("").toUpperCase();

  const View = VIEWS[user.role]?.[effectiveTab];

  return (
    <div style={{display:"flex",minHeight:"100vh",fontFamily:FONT,background:T.bg}}>
      <style>{FONTS}</style>
      <Sidebar role={user.role} active={effectiveTab} setActive={setTab} user={user} onLogout={onLogout} tsBadge={pendingTs} perms={perms} chrome={chrome}/>
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        {/* Top bar — frosted, sits above the scrolling content */}
        <div style={{height:52,background:c.surface,backdropFilter:"saturate(180%) blur(24px)",WebkitBackdropFilter:"saturate(180%) blur(24px)",
          borderBottom:`1px solid ${c.border}`,display:"flex",alignItems:"center",justifyContent:"flex-end",
          padding:"0 20px",gap:6,flexShrink:0,position:"sticky",top:0,zIndex:60,transition:`background ${T.t}, border-color ${T.t}`}}>

          <button onClick={()=>setChrome(m=>m==="dark"?"light":"dark")}
            title={chrome==="dark"?"Switch to light chrome":"Switch to dark chrome"} aria-label="Toggle appearance"
            onMouseEnter={e=>e.currentTarget.style.background=c.itemHoverBg}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            style={{display:"flex",alignItems:"center",justifyContent:"center",width:32,height:32,background:"transparent",border:"none",cursor:"pointer",borderRadius:T.rXs,color:c.item,transition:`background ${T.t}, color ${T.t}`}}>
            <Icon name={chrome==="dark"?"sun":"moon"} size={17}/>
          </button>

          <button onClick={()=>setShowNotifs(s=>!s)} aria-label="Notifications"
            onMouseEnter={e=>e.currentTarget.style.background=c.itemHoverBg}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            style={{position:"relative",display:"flex",alignItems:"center",justifyContent:"center",width:32,height:32,background:"transparent",border:"none",cursor:"pointer",borderRadius:T.rXs,color:c.item,transition:`background ${T.t}, color ${T.t}`}}>
            <Icon name="bell" size={17}/>
            {unreadNotifs>0&&(
              <span style={{position:"absolute",top:3,right:3,minWidth:15,height:15,padding:"0 4px",borderRadius:T.rPill,background:T.red,color:"#fff",fontSize:9.5,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${c.solid}`,fontVariantNumeric:"tabular-nums"}}>{unreadNotifs}</span>
            )}
          </button>

          <div style={{width:1,height:20,background:c.border,margin:"0 6px"}}/>

          <div style={{display:"flex",alignItems:"center",gap:9,paddingRight:2}}>
            <div style={{width:27,height:27,borderRadius:"50%",background:`${accent}1F`,color:accent,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,letterSpacing:"-0.01em",flexShrink:0}}>{initials}</div>
            <div style={{fontSize:13,color:c.name,fontWeight:510,letterSpacing:"-0.011em"}}>{user.name}</div>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {View
            ? <View user={user} navigate={setTab} timesheets={timesheets} setTimesheets={setTimesheets} users={users} setUsers={setUsers} complianceReqs={complianceReqs} setComplianceReqs={setComplianceReqs} clientPricing={clientPricing} setClientPricing={setClientPricing} rateCards={rateCards} setRateCards={setRateCards} invoices={invoices} setInvoices={setInvoices} rateUplifts={rateUplifts} setRateUplifts={setRateUplifts} budgets={budgets} setBudgets={setBudgets} bankRates={bankRates} setBankRates={setBankRates} shiftPatterns={shiftPatterns} setShiftPatterns={setShiftPatterns}/>
            : <Page title="Coming Soon"><p style={{color:T.muted}}>This section is under construction.</p></Page>}
        </div>
      </div>
      {showNotifs&&(
        <>
          <div onClick={()=>setShowNotifs(false)} style={{position:"fixed",inset:0,zIndex:999,background:"rgba(0,0,0,0.18)",backdropFilter:"blur(2px)",WebkitBackdropFilter:"blur(2px)",animation:"fcScrim 0.2s ease both"}}/>
          <NotificationPanel role={user.role} onClose={()=>setShowNotifs(false)} onNavigate={(tab)=>{setTab(tab);setShowNotifs(false);}}/>
        </>
      )}
    </div>
  );
};
