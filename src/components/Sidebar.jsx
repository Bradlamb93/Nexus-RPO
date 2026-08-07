import { Icon } from "./Icon.jsx";
import { FCCLogo } from "./Logo.jsx";
import { CHROME, FONT, T, roleAccent } from "../theme/tokens.js";

export const NAV = {
  admin:[
    {k:"dashboard",     i:"grid", l:"Dashboard"},
    {k:"shifts",        i:"clipboard", l:"Shift Board"},
    {k:"schedule",      i:"calendar", l:"Create Shift"},
    {k:"agencies",      i:"briefcase", l:"Agencies"},
    {k:"clients",       i:"building", l:"Clients & Pricing"},
    {k:"bankstaff",     i:"bank", l:"Bank Staff"},
    {k:"workers",       i:"users", l:"Workers"},
    {k:"compliance",    i:"shield", l:"Compliance"},
    {k:"expirycal",     i:"calendar", l:"Expiry Calendar"},
    {k:"cqcreport",     i:"award", l:"CQC Readiness"},
    {k:"documents",     i:"folder", l:"Documents"},
    {k:"timesheets",    i:"clock", l:"Timesheets"},
    {k:"invoices",      i:"document", l:"Invoices"},
    {k:"creditnotes",   i:"receipt", l:"Credit Notes"},
    {k:"budgets",       i:"money", l:"Budgets"},
    {k:"analytics",     i:"chartBar", l:"Analytics"},
    {k:"forecast",      i:"forecast", l:"Demand Forecast"},
    {k:"reports",       i:"archive", l:"Reports"},
    {k:"users",         i:"lock", l:"Users & Permissions"},
  ],
  clientadmin:[
    {k:"dashboard",  i:"grid", l:"Group Overview"},
    {k:"analytics",  i:"chartBar", l:"Analytics"},
    {k:"forecast",   i:"forecast", l:"Demand Forecast"},
    {k:"locations",  i:"hospital", l:"Locations"},
    {k:"shifts",     i:"clipboard", l:"All Shifts"},
    {k:"timesheets", i:"clock", l:"Timesheets"},
    {k:"invoices",   i:"document", l:"Invoices"},
    {k:"budgets",    i:"money", l:"Budgets"},
    {k:"compliance", i:"shield", l:"Compliance"},
    {k:"expirycal",  i:"calendar", l:"Expiry Calendar"},
    {k:"rtw",        i:"idCard", l:"RTW Monitoring"},
    {k:"cqcreport",  i:"award", l:"CQC Readiness"},
    {k:"reports",    i:"archive", l:"Custom Reports"},
    {k:"workers",    i:"users", l:"Worker Profiles"},
    {k:"users",      i:"lock", l:"Users & Permissions"},
  ],
  carehome:[
    {k:"dashboard",  i:"grid", l:"Overview"},
    {k:"request",    i:"plus", l:"Request Shift"},
    {k:"myshifts",   i:"clipboard", l:"My Shifts"},
    {k:"calendar",   i:"calendar", l:"Calendar"},
    {k:"compliance", i:"shield", l:"Compliance"},
    {k:"expirycal",  i:"calendar", l:"Expiry Calendar"},
    {k:"rtw",        i:"idCard", l:"RTW Monitoring"},
    {k:"cqcreport",  i:"award", l:"CQC Readiness"},
    {k:"invoices",   i:"document", l:"Invoices"},
    {k:"timesheets", i:"clock", l:"Timesheets"},
    {k:"workers",    i:"users", l:"Worker Profiles"},
  ],
  agency:[
    {k:"dashboard",  i:"grid", l:"Dashboard"},
    {k:"available",  i:"clipboard", l:"Available Shifts"},
    {k:"workers",    i:"users", l:"My Workers"},
    {k:"timesheets", i:"clock", l:"Timesheets"},
    {k:"onboard",    i:"plus", l:"Register Worker"},
    {k:"rtw",        i:"idCard", l:"Right to Work"},
    {k:"rateuplifts",i:"trendingUp", l:"Rate Requests"},
    {k:"documents",  i:"folder", l:"Documents"},
    {k:"invoices",   i:"document", l:"Invoices"},
    {k:"users",      i:"lock", l:"Users & Permissions"},
  ],
  bank:[
    {k:"dashboard",    i:"grid", l:"My Dashboard"},
    {k:"available",    i:"clipboard", l:"Available Shifts"},
    {k:"myshifts",     i:"checkCircle", l:"My Shifts"},
    {k:"availability", i:"calendar", l:"Set Availability"},
    {k:"earnings",     i:"pound", l:"Earnings"},
    {k:"profile",      i:"user", l:"My Profile"},
  ],
};

export const Sidebar = ({role,active,setActive,user,onLogout,tsBadge,perms,chrome="light"}) => {
  const roleLabel = {admin:"Neutral Vendor",clientadmin:"Client Admin",carehome:"Care Home",agency:"Agency",bank:"Bank Staff"};
  const accent = roleAccent(role);
  const c = CHROME[chrome] || CHROME.light;
  const visibleNav = (NAV[role]||[]).filter(item=>!perms||perms[item.k]!==false);
  return (
    <div style={{width:236,minHeight:"100vh",background:c.surface,backdropFilter:"saturate(180%) blur(24px)",WebkitBackdropFilter:"saturate(180%) blur(24px)",
      borderRight:`1px solid ${c.border}`,display:"flex",flexDirection:"column",position:"sticky",top:0,flexShrink:0,
      transition:`background ${T.t}, border-color ${T.t}`}}>

      <div style={{padding:"20px 16px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:16,paddingLeft:4}}>
          <FCCLogo size={28} showText={true} textColor={c.logo} textSize={15}/>
        </div>
        <div style={{background:c.well,borderRadius:T.rSm,padding:"10px 12px",transition:`background ${T.t}`}}>
          <div style={{fontSize:11,color:c.label,fontWeight:500,letterSpacing:"-0.004em"}}>{roleLabel[role]}</div>
          <div style={{fontSize:13,color:c.name,fontWeight:560,marginTop:2,letterSpacing:"-0.014em",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.org}</div>
          <div style={{fontSize:11.5,color:c.sub,marginTop:1.5,letterSpacing:"-0.004em"}}>{user.name}</div>
        </div>
      </div>

      <nav style={{flex:1,padding:"2px 10px 14px",overflow:"auto"}}>
        {visibleNav.map(item=>{
          const on = active===item.k;
          return (
            <button key={item.k} onClick={()=>setActive(item.k)}
              style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"7.5px 10px",borderRadius:T.rXs,
                background:on?(chrome==="dark"?`${accent}2E`:`${accent}14`):"transparent",border:"none",cursor:"pointer",
                color:on?(chrome==="dark"?"#FFFFFF":accent):c.item,fontFamily:FONT,fontSize:13,
                fontWeight:on?550:450,letterSpacing:"-0.011em",marginBottom:1.5,textAlign:"left",
                transition:`background ${T.t}, color ${T.t}`}}
              onMouseEnter={e=>{if(!on){e.currentTarget.style.color=c.itemHover;e.currentTarget.style.background=c.itemHoverBg;}}}
              onMouseLeave={e=>{if(!on){e.currentTarget.style.color=c.item;e.currentTarget.style.background="transparent";}}}>
              <span style={{display:"flex",opacity:on?1:c.iconOpacity,color:on&&chrome==="dark"?accent:undefined}}>
                <Icon name={item.i} size={17} stroke={on?1.9:1.7}/>
              </span>
              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.l}</span>
              {item.k==="timesheets"&&tsBadge>0&&(
                <span style={{marginLeft:"auto",background:role==="agency"?T.red:T.accent,color:"#fff",borderRadius:T.rPill,minWidth:18,height:18,padding:"0 5px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:600,flexShrink:0,fontVariantNumeric:"tabular-nums"}}>{tsBadge}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div style={{padding:"10px 10px 14px",borderTop:`1px solid ${c.border}`}}>
        <button onClick={onLogout}
          onMouseEnter={e=>{e.currentTarget.style.color=c.itemHover;e.currentTarget.style.background=c.itemHoverBg;}}
          onMouseLeave={e=>{e.currentTarget.style.color=c.footer;e.currentTarget.style.background="transparent";}}
          style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"7.5px 10px",borderRadius:T.rXs,background:"transparent",border:"none",cursor:"pointer",color:c.footer,fontFamily:FONT,fontSize:12.5,fontWeight:450,letterSpacing:"-0.01em",transition:`background ${T.t}, color ${T.t}`}}>
          <Icon name="logout" size={16}/>Sign out
        </button>
        <div style={{fontSize:11,color:c.footer,opacity:0.7,textAlign:"center",marginTop:8,letterSpacing:"-0.004em"}}>v1.0.0 — Demo</div>
      </div>
    </div>
  );
};
