import { useState } from "react";
import { ExportMenu } from "../../components/ExportMenu.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert, ProgressBar } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { SITE_COLORS } from "../../data/clients.js";
import { RESTRICTED_HOURS, RTW_LABEL, RTW_WEEKS } from "../../data/compliance.js";
import { WORKERS } from "../../data/workers.js";
import { buildTable, exportCSV, exportHTML } from "../../lib/export.js";
import { CA_PURPLE, FONT, T } from "../../theme/tokens.js";

/* ─── RTW MONITORING REPORT ──────────────────────────────────────────────────── */
export const RtwMonitoringReport = ({user}) => {
  const isClientAdmin = user?.role==="clientadmin";
  const mySites = isClientAdmin
    ? ["Sunrise Care","Sunrise Dementia Unit","Oakwood Nursing"]
    : ["Sunrise Care"];

  const [filterSite,   setFilterSite]   = useState("all");
  const [filterAgency, setFilterAgency] = useState("all");
  const [tab, setTab] = useState("hours");
  const LIMIT = 20;

  const displayWorkers = RESTRICTED_HOURS.filter(w=>{
    const siteMatch   = filterSite==="all"   || w.sites.includes(filterSite);
    const agencyMatch = filterAgency==="all" || w.agency===filterAgency;
    return siteMatch && agencyMatch;
  });

  const agencies           = [...new Set(RESTRICTED_HOURS.map(w=>w.agency))];
  const today              = "2026-03-10";
  const currentWeekHours   = (w) => w.weekHours[w.weekHours.length-1]||0;
  const totalHours         = (w) => w.weekHours.reduce((a,b)=>a+b,0);
  const breaches           = RESTRICTED_HOURS.filter(w=>w.weekHours.some(h=>h>LIMIT));
  const expiringWorkers    = RESTRICTED_HOURS.filter(w=>{
    const wx = WORKERS.find(x=>x.id===w.workerId);
    return wx?.rtwExpiry && wx.rtwExpiry<="2026-06-10";
  });

  const rtwExports = [
    {icon:"idCard",label:"Restricted Workers — CSV",desc:"All 20hr limited workers",fn:()=>exportCSV("rtw-restricted-workers.csv",
      ["Worker","Agency","Role","Visa Expiry","Sites","w/c 27 Jan","w/c 3 Feb","w/c 10 Feb","w/c 17 Feb","w/c 24 Feb","w/c 3 Mar","Total Hrs"],
      RESTRICTED_HOURS.map(w=>[w.workerName,w.agency,w.role,WORKERS.find(x=>x.id===w.workerId)?.rtwExpiry||"—",w.sites.join("; "),...w.weekHours,w.weekHours.reduce((a,b)=>a+b,0)]))},
    {icon:"ban",label:"Hours Breaches — CSV",desc:"Weeks where 20hr limit exceeded",fn:()=>{
      const rows=[];
      RESTRICTED_HOURS.forEach(w=>w.weekHours.forEach((h,i)=>{if(h>20)rows.push([w.workerName,w.agency,w.role,RTW_WEEKS[i],h,h-20]);}));
      exportCSV("rtw-breaches.csv",["Worker","Agency","Role","Week","Hours Worked","Hours Over Limit"],rows);
    }},
    {icon:"warning",label:"Expiring RTW Docs — CSV",desc:"Expires within 90 days",fn:()=>exportCSV("rtw-expiring.csv",
      ["Worker","Agency","Role","RTW Type","Expiry Date","Hours Restriction"],
      WORKERS.filter(w=>w.rtwExpiry&&w.rtwExpiry<="2026-06-10").map(w=>[w.name,w.agency,w.role,RTW_LABEL[w.rtwType]||w.rtwType,w.rtwExpiry,w.hoursRestriction?"20hr/week":"None"]))},
    {icon:"printer",label:"Full RTW Report — PDF",fn:()=>exportHTML("Right to Work Monitoring Report","20-hour restricted workers — "+new Date().toLocaleDateString("en-GB"),
      buildTable(["Worker","Agency","Role","Visa Expiry","This Week (hrs)","Status"],
        RESTRICTED_HOURS.map(w=>{
          const cur=w.weekHours[w.weekHours.length-1];
          return[w.workerName,w.agency,w.role,WORKERS.find(x=>x.id===w.workerId)?.rtwExpiry||"—",`${cur}/20`,cur>20?"BREACH":cur===20?"AT LIMIT":"OK"];
        })))},
  ];

  return (
    <Page title="RTW Monitoring" sub="20-hour restricted workers — hours tracking and visa status" icon="idCard" action={<ExportMenu exports={rtwExports}/>}>

      {breaches.length>0&&(
        <Alert type="error">{breaches.length} worker{breaches.length>1?"s have":" has"} exceeded 20 hours in at least one week. Review immediately and contact the relevant agency.</Alert>
      )}
      {expiringWorkers.length>0&&(
        <Alert type="warn">{expiringWorkers.length} restricted worker{expiringWorkers.length>1?"s have":" has"} a visa or RTW document expiring within 90 days.</Alert>
      )}

      <Grid cols={4}>
        <Stat label="Restricted Workers" value={RESTRICTED_HOURS.length} accent/>
        <Stat label="Active This Week" value={RESTRICTED_HOURS.filter(w=>currentWeekHours(w)>0).length} sub="w/c 3 Mar"/>
        <Stat label="Hours Breaches" value={breaches.length} sub="Any week over 20hrs" trend={breaches.length>0?"Action required":""} trendUp={false}/>
        <Stat label="Visas Expiring" value={expiringWorkers.length} sub="Within 90 days"/>
      </Grid>

      {/* Filters */}
      {isClientAdmin&&(
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            <button onClick={()=>setFilterSite("all")} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${filterSite==="all"?CA_PURPLE:T.border}`,background:filterSite==="all"?T.purpleBg:T.white,fontWeight:560,fontSize:12,cursor:"pointer",color:filterSite==="all"?CA_PURPLE:T.muted,fontFamily:FONT}}>All Sites</button>
            {mySites.map(s=>(
              <button key={s} onClick={()=>setFilterSite(s)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${filterSite===s?SITE_COLORS[s]||CA_PURPLE:T.border}`,background:filterSite===s?`${SITE_COLORS[s]||CA_PURPLE}15`:T.white,fontWeight:560,fontSize:12,cursor:"pointer",color:filterSite===s?SITE_COLORS[s]||CA_PURPLE:T.muted,fontFamily:FONT}}>{s}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:6}}>
            <button onClick={()=>setFilterAgency("all")} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${filterAgency==="all"?T.amber:T.border}`,background:filterAgency==="all"?T.amberBg:T.white,fontWeight:600,fontSize:11,cursor:"pointer",color:filterAgency==="all"?T.amberText:T.muted,fontFamily:FONT}}>All Agencies</button>
            {agencies.map(a=>(
              <button key={a} onClick={()=>setFilterAgency(a)} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${filterAgency===a?T.amber:T.border}`,background:filterAgency===a?T.amberBg:T.white,fontWeight:600,fontSize:11,cursor:"pointer",color:filterAgency===a?T.amberText:T.muted,fontFamily:FONT}}>{a}</button>
            ))}
          </div>
        </div>
      )}

      {/* View toggle */}
      <div style={{display:"flex",gap:0,background:T.sunken,borderRadius:10,padding:4,width:"fit-content"}}>
        {[{k:"hours",l:"Weekly Hours Table"},{k:"cards",l:"Worker Cards"}].map(t=>{
          const active=tab===t.k;
          return (
            <button key={t.k} onClick={()=>setTab(t.k)}
              style={{padding:"7px 18px",borderRadius:8,border:"none",fontFamily:FONT,fontWeight:560,fontSize:13,cursor:"pointer",
                background:active?T.white:"transparent",color:active?T.navy:T.muted,
                boxShadow:active?"0 1px 4px rgba(0,0,0,0.1)":"none"}}>
              {t.l}
            </button>
          );
        })}
      </div>

      {/* Weekly hours table */}
      {tab==="hours"&&(
        <Card>
          <CardHead title="Weekly Hours — Last 6 Weeks" sub="20hr limit applies during term time"/>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead>
                <tr style={{background:T.raised,borderBottom:`2px solid ${T.border}`}}>
                  <th style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em"}}>Worker</th>
                  <th style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em"}}>Agency</th>
                  <th style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em"}}>Visa Expiry</th>
                  {RTW_WEEKS.map((wk,i)=>(
                    <th key={wk} style={{padding:"10px 10px",textAlign:"center",fontSize:10,fontWeight:560,color:i===RTW_WEEKS.length-1?T.navy:T.muted,letterSpacing:"0.04em",background:i===RTW_WEEKS.length-1?T.accentBg:"transparent",whiteSpace:"nowrap"}}>{wk}</th>
                  ))}
                  <th style={{padding:"10px 14px",textAlign:"center",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em"}}>Total</th>
                </tr>
              </thead>
              <tbody>
                {displayWorkers.map(w=>{
                  const wx=WORKERS.find(x=>x.id===w.workerId);
                  const isExpiringSoon=wx?.rtwExpiry&&wx.rtwExpiry<="2026-06-10";
                  return (
                    <tr key={w.workerId} style={{borderBottom:`1px solid ${T.border}`}}>
                      <td style={{padding:"12px 14px"}}>
                        <div style={{fontWeight:560,fontSize:13}}>{w.workerName}</div>
                        <div style={{display:"flex",gap:6,marginTop:3}}>
                          <Badge label={w.role} color={T.purple} bg={T.purpleBg}/>
                          <span style={{fontSize:10,fontWeight:560,color:T.purple,background:T.purpleBg,padding:"2px 7px",borderRadius:8}}>20hr limit</span>
                        </div>
                      </td>
                      <td style={{padding:"12px 14px",fontSize:12,color:T.muted}}>{w.agency}</td>
                      <td style={{padding:"12px 14px"}}>
                        {wx?.rtwExpiry
                          ? <span style={{fontSize:12,fontWeight:isExpiringSoon?700:400,color:isExpiringSoon?T.red:T.text}}>{wx.rtwExpiry}{isExpiringSoon&&" "}</span>
                          : <span style={{fontSize:12,color:T.muted}}>—</span>}
                      </td>
                      {w.weekHours.map((h,i)=>{
                        const over=h>LIMIT; const atLimit=h===LIMIT;
                        const bg=over?T.redBg:atLimit?T.amberBg:i===w.weekHours.length-1?"#eef2ff":"transparent";
                        const col=over?T.red:atLimit?T.amberText:i===w.weekHours.length-1?T.navy:T.text;
                        return (
                          <td key={i} style={{padding:"12px 10px",textAlign:"center",background:bg}}>
                            <span style={{fontSize:13,fontWeight:over||atLimit?800:500,color:col}}>{h}</span>
                            {over&&<div style={{fontSize:9,color:T.red,fontWeight:560}}>OVER</div>}
                            {atLimit&&<div style={{fontSize:9,color:T.amberText,fontWeight:560}}>AT LIMIT</div>}
                          </td>
                        );
                      })}
                      <td style={{padding:"12px 14px",textAlign:"center"}}>
                        <span style={{fontSize:13,fontWeight:560}}>{totalHours(w)}</span>
                        <div style={{fontSize:10,color:T.muted}}>hrs</div>
                      </td>
                    </tr>
                  );
                })}
                {displayWorkers.length===0&&(
                  <tr><td colSpan={10} style={{padding:"28px",textAlign:"center",color:T.muted,fontSize:13}}>No restricted workers match the current filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Worker cards view */}
      {tab==="cards"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:14}}>
          {displayWorkers.map(w=>{
            const wx=WORKERS.find(x=>x.id===w.workerId);
            const curHrs=currentWeekHours(w);
            const remaining=Math.max(0,LIMIT-curHrs);
            const over=curHrs>LIMIT;
            const atLimit=curHrs===LIMIT;
            const isExpiring=wx?.rtwExpiry&&wx.rtwExpiry<="2026-06-10";
            const barColor=over?T.red:curHrs>=18?T.amber:CA_PURPLE;
            return (
              <Card key={w.workerId} style={{borderTop:`3px solid ${over?T.red:atLimit?T.amber:CA_PURPLE}`,padding:0}}>
                <div style={{padding:"14px 16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:14}}>{w.workerName}</div>
                      <div style={{fontSize:11,color:T.muted,marginTop:2}}>{w.agency} · {w.role}</div>
                    </div>
                    <div>
                      {over&&<span style={{fontSize:11,fontWeight:560,color:T.red,background:T.redBg,padding:"3px 8px",borderRadius:8}}>BREACH</span>}
                      {!over&&atLimit&&<span style={{fontSize:11,fontWeight:560,color:T.amberText,background:T.amberBg,padding:"3px 8px",borderRadius:8}}>AT LIMIT</span>}
                      {!over&&!atLimit&&<span style={{fontSize:11,fontWeight:560,color:T.green,background:T.greenBg,padding:"3px 8px",borderRadius:8}}>OK</span>}
                    </div>
                  </div>

                  <div style={{marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12}}>
                      <span style={{color:T.muted}}>This week (w/c 3 Mar)</span>
                      <span style={{fontWeight:560,color:over?T.red:T.text}}>{curHrs} / {LIMIT} hrs</span>
                    </div>
                    <ProgressBar value={Math.min(curHrs,LIMIT+2)} max={LIMIT} color={barColor}/>
                  </div>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:11,color:T.muted,marginBottom:8}}>
                    <div>Remaining: <strong style={{color:over?T.red:T.green}}>{over?`${curHrs-LIMIT}h over`:`${remaining}h left`}</strong></div>
                    <div>Visa expiry: <strong style={{color:isExpiring?T.red:T.text}}>{wx?.rtwExpiry||"—"}</strong></div>
                  </div>

                  {wx?.rtwNotes&&<div style={{padding:"7px 10px",background:T.raised,borderRadius:8,fontSize:11,color:T.muted,borderLeft:`3px solid ${CA_PURPLE}`,marginBottom:8}}>{wx.rtwNotes}</div>}

                  <div style={{paddingTop:8,borderTop:`1px solid ${T.border}`,display:"flex",flexWrap:"wrap",gap:4}}>
                    {w.sites.map(s=><span key={s} style={{fontSize:10,fontWeight:560,padding:"2px 7px",borderRadius:8,background:`${SITE_COLORS[s]||CA_PURPLE}18`,color:SITE_COLORS[s]||CA_PURPLE}}>{s}</span>)}
                  </div>
                </div>
              </Card>
            );
          })}
          {displayWorkers.length===0&&(
            <div style={{gridColumn:"1/-1",padding:40,textAlign:"center",color:T.muted,fontSize:13}}>No restricted workers match the current filters.</div>
          )}
        </div>
      )}

      {/* Compliance reminder */}
      <Card style={{background:T.purpleBg,border:`1px solid #ddd6fe`}}>
        <div style={{padding:"16px 18px"}}>
          <div style={{fontWeight:600,fontSize:14,color:T.purple,marginBottom:8}}>Your Responsibilities as a Host Employer</div>
          <div style={{fontSize:13,color:"#4c1d95",lineHeight:1.8}}>
            <div>• Student visa holders are restricted to <strong>20 hours per week during term time</strong>. Outside term time, they may work full time.</div>
            <div>• You must report suspected breaches to the sponsoring agency immediately.</div>
            <div>• Under the Immigration, Asylum and Nationality Act 2006, knowingly employing a person without the right to work is a criminal offence.</div>
            <div>• Ensure RTW checks are repeated before any time-limited permission expires.</div>
            <div>• If a worker presents a Share Code, verify via the <strong>Home Office online checking service</strong> before placement.</div>
          </div>
        </div>
      </Card>
    </Page>
  );
};
