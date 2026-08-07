import { useState } from "react";
import { ExportMenu } from "../../components/ExportMenu.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead } from "../../components/ui/Card.jsx";
import { Alert } from "../../components/ui/Feedback.jsx";
import { Input } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { RTW_LABEL, RTW_TYPES } from "../../data/compliance.js";
import { WORKERS } from "../../data/workers.js";
import { buildTable, exportCSV, exportHTML } from "../../lib/export.js";
import { FONT, T } from "../../theme/tokens.js";

export const AgencyRightToWork = () => {
  const myWorkers = WORKERS.filter(w=>w.agency==="First Choice");
  const [selected, setSelected] = useState(null);
  const [rtwForms, setRtwForms] = useState(
    Object.fromEntries(myWorkers.map(w=>[w.id,{rtwType:w.rtwType||"pending",rtwRef:w.rtwRef||"",rtwExpiry:w.rtwExpiry||"",rtwNotes:w.rtwNotes||"",visaType:w.visaType||""}]))
  );
  const [saved, setSaved] = useState({});
  const set = (wid,k,v) => setRtwForms(p=>({...p,[wid]:{...p[wid],[k]:v}}));
  const saveWorker = (wid) => { setSaved(p=>({...p,[wid]:true})); setTimeout(()=>setSaved(p=>({...p,[wid]:false})),2500); };

  const today = "2026-03-10";
  const expiring = myWorkers.filter(w=>w.rtwExpiry&&w.rtwExpiry<="2026-06-10"&&w.rtwExpiry>=today);
  const expired  = myWorkers.filter(w=>w.rtwExpiry&&w.rtwExpiry<today);
  const restricted = myWorkers.filter(w=>w.hoursRestriction===20);

  const rtwStatus = (w) => {
    if(!w.rtwType||w.rtwType==="pending") return {l:"Pending",c:T.muted,bg:T.sunken};
    if(w.rtwExpiry&&w.rtwExpiry<today) return {l:"Expired",c:T.red,bg:T.redBg};
    if(w.rtwExpiry&&w.rtwExpiry<="2026-06-10") return {l:"Expiring Soon",c:T.yellow,bg:T.yellowBg};
    return {l:"Verified",c:T.green,bg:T.greenBg};
  };

  const rtwAgencyExports = [
    {icon:"idCard",label:"All RTW Records — CSV",fn:()=>exportCSV("agency-rtw-all.csv",
      ["Worker","Role","RTW Type","Reference","Expiry","Hours Restriction","Verified By","Notes"],
      myWorkers.map(w=>[w.name,w.role,RTW_LABEL[w.rtwType]||w.rtwType||"—",w.rtwRef||"—",w.rtwExpiry||"Permanent",w.hoursRestriction?"20hr/week":"Unrestricted",w.rtwVerifiedBy||"—",w.rtwNotes||""]))},
    {icon:"warning",label:"Expiring / Expired — CSV",fn:()=>exportCSV("agency-rtw-expiring.csv",
      ["Worker","Role","RTW Type","Expiry","Days Until Expiry"],
      myWorkers.filter(w=>w.rtwExpiry).map(w=>{
        const days=Math.round((new Date(w.rtwExpiry)-new Date(today))/(1000*60*60*24));
        return[w.name,w.role,RTW_LABEL[w.rtwType]||w.rtwType,w.rtwExpiry,days<0?"EXPIRED":days];
      }))},
    {icon:"printer",label:"RTW Register — PDF",fn:()=>exportHTML("Agency Right to Work Register","First Choice Nursing — "+new Date().toLocaleDateString("en-GB"),
      buildTable(["Worker","Role","RTW Type","Reference","Expiry","Hours Limit","Status"],
        myWorkers.map(w=>{
          const st=rtwStatus(w);
          return[w.name,w.role,RTW_LABEL[w.rtwType]||"—",w.rtwRef||"—",w.rtwExpiry||"Permanent",w.hoursRestriction?"20hr/week":"Unrestricted",st.l.toUpperCase()];
        })))},
  ];

  return (
    <Page title="Right to Work" sub="Manage RTW checks for First Choice Nursing workers" icon="idCard"
      action={<div style={{display:"flex",gap:8,alignItems:"center"}}>
        {expired.length>0&&<span style={{padding:"6px 12px",borderRadius:8,background:T.redBg,color:T.red,fontSize:12,fontWeight:560}}>{expired.length} Expired</span>}
        {expiring.length>0&&<span style={{padding:"6px 12px",borderRadius:8,background:T.yellowBg,color:T.amberText,fontSize:12,fontWeight:560}}>{expiring.length} Expiring Soon</span>}
        {restricted.length>0&&<span style={{padding:"6px 12px",borderRadius:8,background:T.purpleBg,color:T.purple,fontSize:12,fontWeight:560}}>{restricted.length} &times; 20hr Restricted</span>}
        <ExportMenu exports={rtwAgencyExports}/>
      </div>}>

      {expired.length>0&&<Alert type="error">{expired.length} worker{expired.length>1?"s have":" has"} an expired RTW document — {expired.map(w=>w.name).join(", ")}. They must not be placed on shifts until renewed.</Alert>}
      {expiring.length>0&&<Alert type="warn">{expiring.length} RTW document{expiring.length>1?"s are":" is"} expiring within 90 days. Schedule repeat checks now.</Alert>}

      <Card>
        <Table headers={["Worker","Role","RTW Type","Reference","Expiry","Hours","Status","Actions"]}
          rows={myWorkers.map(w=>{
            const st = rtwStatus(w);
            const type = RTW_TYPES.find(t=>t.value===w.rtwType);
            return (
              <tr key={w.id} style={{borderBottom:`1px solid ${T.border}`,background:w.rtwExpiry&&w.rtwExpiry<today?T.redBg:"transparent"}}>
                <Td bold>{w.name}</Td>
                <Td><Badge label={w.role} color={T.purple} bg={T.purpleBg}/></Td>
                <Td style={{fontSize:12}}>{w.rtwType?RTW_LABEL[w.rtwType]||w.rtwType:<span style={{color:T.muted}}>Not set</span>}</Td>
                <Td style={{fontSize:12,fontFamily:"monospace"}}>{w.rtwRef||<span style={{color:T.muted}}>—</span>}</Td>
                <Td style={{fontSize:12}}>{w.rtwExpiry?<span style={{color:w.rtwExpiry<today?T.red:w.rtwExpiry<="2026-06-10"?T.amberText:T.text,fontWeight:w.rtwExpiry<="2026-06-10"?700:400}}>{w.rtwExpiry}</span>:<span style={{color:T.muted}}>Permanent</span>}</Td>
                <Td>{w.hoursRestriction?<span style={{fontSize:11,fontWeight:560,color:T.purple,background:T.purpleBg,padding:"2px 8px",borderRadius:10}}>{w.hoursRestriction}hr/wk</span>:<span style={{fontSize:11,color:T.muted}}>Unrestricted</span>}</Td>
                <Td><Badge label={st.l} color={st.c} bg={st.bg}/></Td>
                <Td><Btn small onClick={()=>setSelected(selected===w.id?null:w.id)}>Edit</Btn></Td>
              </tr>
            );
          })}
        />
      </Card>

      {/* Inline edit panel */}
      {selected&&(()=>{
        const w = myWorkers.find(x=>x.id===selected);
        if(!w) return null;
        const f = rtwForms[w.id]||{};
        const selType = RTW_TYPES.find(t=>t.value===f.rtwType);
        return (
          <Card style={{border:`2px solid ${T.amber}`}}>
            <CardHead title={`Edit RTW — ${w.name}`} sub={w.role} action={<Btn small variant="secondary" onClick={()=>setSelected(null)}>✕ Close</Btn>}/>
            <div style={{padding:"4px 16px 20px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div style={{gridColumn:"1/-1"}}>
                <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:8}}>RTW Type *</label>
                <select value={f.rtwType} onChange={e=>set(w.id,"rtwType",e.target.value)}
                  style={{width:"100%",padding:"10px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:FONT,color:T.text,background:T.white}}>
                  {RTW_TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {selType&&<div style={{marginTop:6,padding:"8px 12px",background:selType.restricted?T.purpleBg:selType.restricted===false?T.greenBg:T.raised,borderRadius:8,fontSize:12,color:selType.restricted?T.purple:selType.restricted===false?T.green:T.muted}}>
                  {selType.restricted&&""}{selType.restricted===false&&""}{selType.desc}
                  {selType.restricted&&<strong> This worker must not exceed 20 hours/week during term time.</strong>}
                </div>}
              </div>
              <Input label="Reference / Document Number" value={f.rtwRef} onChange={v=>set(w.id,"rtwRef",v)} placeholder="e.g. Share code, BRP number, passport no."/>
              <Input label="Expiry Date" type="date" value={f.rtwExpiry} onChange={v=>set(w.id,"rtwExpiry",v)}/>
              <div style={{gridColumn:"1/-1"}}>
                <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:6}}>Notes</label>
                <textarea value={f.rtwNotes} onChange={e=>set(w.id,"rtwNotes",e.target.value)} rows={3}
                  placeholder="e.g. Term dates, visa conditions, follow-up actions..."
                  style={{width:"100%",padding:"10px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:FONT,resize:"vertical",color:T.text,boxSizing:"border-box"}}/>
              </div>
              <div style={{gridColumn:"1/-1",display:"flex",gap:10,justifyContent:"flex-end"}}>
                <Btn variant="secondary" onClick={()=>setSelected(null)}>Cancel</Btn>
                <Btn onClick={()=>saveWorker(w.id)}>{saved[w.id]?"Saved!":"Save RTW Record"}</Btn>
              </div>
            </div>
          </Card>
        );
      })()}

      {/* RTW type reference guide */}
      <Card>
        <CardHead title="RTW Type Reference Guide" sub="UK right to work document categories"/>
        <div style={{padding:"8px 16px 16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {RTW_TYPES.filter(t=>t.value!=="pending").map(t=>(
            <div key={t.value} style={{padding:"10px 14px",borderRadius:8,background:t.restricted?T.purpleBg:t.restricted===false?T.greenBg:T.raised,border:`1px solid ${t.restricted?T.purpleBg:t.restricted===false?"#bbf7d0":T.border}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                <span style={{fontSize:12,fontWeight:560,color:T.text}}>{t.label}</span>
                {t.restricted&&<span style={{fontSize:10,fontWeight:560,color:T.purple,background:T.purpleBg,padding:"1px 6px",borderRadius:8}}>20hr limit</span>}
                {t.restricted===false&&<span style={{fontSize:10,fontWeight:560,color:T.green,background:T.greenBg,padding:"1px 6px",borderRadius:8}}>Unrestricted</span>}
                {t.expiry&&t.restricted===null&&<span style={{fontSize:10,fontWeight:560,color:T.amber,background:T.amberBg,padding:"1px 6px",borderRadius:8}}>Check visa type</span>}
              </div>
              <div style={{fontSize:11,color:T.muted,lineHeight:1.5}}>{t.desc}</div>
            </div>
          ))}
        </div>
      </Card>
    </Page>
  );
};
