import { useState } from "react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Card, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { RTW_LABEL } from "../../data/compliance.js";
import { WORKERS } from "../../data/workers.js";
import { cap } from "../../lib/format.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── EXPIRY CALENDAR ─────────────────────────────────────────────────────────── */
export const ExpiryCalendar = ({user,complianceReqs}) => {
  const today = "2026-03-10";
  const in90  = "2026-06-10";
  const expiryItems = [
    ...WORKERS.filter(w=>w.dbsExpiry).map(w=>({label:`${w.name} — DBS`,date:w.dbsExpiry,type:"DBS",agency:w.agency,role:w.role,status:w.dbsExpiry<today?"expired":w.dbsExpiry<=in90?"expiring":"ok"})),
    ...WORKERS.filter(w=>w.trainingExpiry).map(w=>({label:`${w.name} — Mandatory Training`,date:w.trainingExpiry,type:"Training",agency:w.agency,role:w.role,status:w.trainingExpiry<today?"expired":w.trainingExpiry<=in90?"expiring":"ok"})),
    ...WORKERS.filter(w=>w.rtwExpiry).map(w=>({label:`${w.name} — RTW (${RTW_LABEL[w.rtwType]||w.rtwType})`,date:w.rtwExpiry,type:"RTW",agency:w.agency,role:w.role,status:w.rtwExpiry<today?"expired":w.rtwExpiry<=in90?"expiring":"ok"})),
    ...WORKERS.filter(w=>w.pin&&w.role==="RGN"||w.role==="RMN").map(w=>({label:`${w.name} — NMC/PIN`,date:w.dbsExpiry,type:"NMC/PIN",agency:w.agency,role:w.role,status:"ok"})),
  ].filter(e=>e.date&&e.date<=in90).sort((a,b)=>a.date.localeCompare(b.date));

  const [typeF,setTypeF]=useState("all");
  const [monthF,setMonthF]=useState("all");
  const months=["2026-03","2026-04","2026-05","2026-06"];
  const filtered=expiryItems.filter(e=>(typeF==="all"||e.type===typeF)&&(monthF==="all"||e.date.startsWith(monthF)));
  const expired=filtered.filter(e=>e.status==="expired");
  const expiring=filtered.filter(e=>e.status==="expiring");
  const statusColor={expired:T.red,expiring:T.amberText,ok:T.green};
  const statusBg={expired:T.redBg,expiring:T.amberBg,ok:T.greenBg};
  return (
    <Page title="Expiry Calendar" sub="All upcoming document & credential expirations across all workers" icon="calendar">
      <Grid cols={3}>
        <Stat label="Expired Now"    value={expiryItems.filter(e=>e.status==="expired").length}   sub="Immediate action needed" accent/>
        <Stat label="Expiring ≤90d"  value={expiryItems.filter(e=>e.status==="expiring").length}  sub="Within next 3 months"/>
        <Stat label="Workers Affected" value={[...new Set(expiryItems.map(e=>e.label.split("—")[0].trim()))].length} sub="unique workers"/>
      </Grid>
      {expired.length>0&&<Alert type="error">{expired.length} document{expired.length>1?"s have":" has"} already expired. Workers cannot be placed until renewed.</Alert>}
      <Card style={{padding:"14px 16px"}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Type</label>
            <select value={typeF} onChange={e=>setTypeF(e.target.value)} style={{padding:"7px 10px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:12,fontFamily:FONT,background:T.white,color:T.text,outline:"none"}}>
              <option value="all">All Types</option>
              {["DBS","Training","RTW","NMC/PIN"].map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Month</label>
            <select value={monthF} onChange={e=>setMonthF(e.target.value)} style={{padding:"7px 10px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:12,fontFamily:FONT,background:T.white,color:T.text,outline:"none"}}>
              <option value="all">All Months</option>
              {months.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div style={{marginLeft:"auto",fontSize:12,color:T.muted,alignSelf:"flex-end",paddingBottom:2}}>{filtered.length} items</div>
        </div>
      </Card>
      {months.filter(m=>monthF==="all"||m===monthF).map(m=>{
        const monthItems=filtered.filter(e=>e.date.startsWith(m));
        if(!monthItems.length)return null;
        const label={[months[0]]:"March 2026",[months[1]]:"April 2026",[months[2]]:"May 2026",[months[3]]:"June 2026"}[m];
        return (
          <div key={m}>
            <div style={{fontSize:13,fontWeight:600,color:T.text,marginBottom:8,paddingLeft:4}}>{label}</div>
            <Card style={{padding:0,overflow:"hidden"}}>
              {monthItems.map((e,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 18px",borderBottom:i<monthItems.length-1?`1px solid ${T.border}`:"none",background:e.status==="expired"?"#fff5f5":e.status==="expiring"?T.amberBg:"transparent"}}>
                  <div style={{width:52,textAlign:"center",flexShrink:0}}>
                    <div style={{fontSize:18,fontWeight:600,color:statusColor[e.status]}}>{e.date.split("-")[2]}</div>
                    <div style={{fontSize:9,fontWeight:560,color:T.muted}}>{["","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(e.date.split("-")[1])]}</div>
                  </div>
                  <div style={{width:3,height:36,borderRadius:2,background:statusColor[e.status],flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:560,fontSize:13,color:T.text}}>{e.label}</div>
                    <div style={{fontSize:11,color:T.muted,marginTop:1}}>{e.agency} · {e.role}</div>
                  </div>
                  <Badge label={cap(e.type)} color={T.purple} bg={T.purpleBg}/>
                  <span style={{fontSize:11,fontWeight:560,padding:"3px 10px",borderRadius:20,color:statusColor[e.status],background:statusBg[e.status],textTransform:"capitalize"}}>{e.status==="expiring"?"Expiring Soon":e.status}</span>
                </div>
              ))}
            </Card>
          </div>
        );
      })}
    </Page>
  );
};
