import { renderIcon } from "../../components/Icon.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead, Grid } from "../../components/ui/Card.jsx";
import { ProgressBar } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { AGENCIES } from "../../data/agencies.js";
import { INIT_COMPLIANCE_REQS } from "../../data/compliance.js";
import { WORKERS } from "../../data/workers.js";
import { exportHTML } from "../../lib/export.js";
import { TIER_CFG } from "../../lib/format.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── CQC READINESS REPORT ────────────────────────────────────────────────────── */
export const CQCReadinessReport = ({user,complianceReqs}) => {
  const totalWorkers=WORKERS.length;
  const dbsOk=WORKERS.filter(w=>w.dbs==="valid").length;
  const trainOk=WORKERS.filter(w=>w.training==="valid").length;
  const rtwOk=WORKERS.filter(w=>w.rtwVerified).length;
  const pinOk=WORKERS.filter(w=>w.pin||(w.role!=="RGN"&&w.role!=="RMN")).length;
  const overallScore=Math.round(((dbsOk+trainOk+rtwOk+pinOk)/(totalWorkers*4))*100);
  const sections=[
    {label:"DBS Certificates",    pass:dbsOk,   total:totalWorkers, icon:"search", notes:"Enhanced DBS required for all staff"},
    {label:"Mandatory Training",  pass:trainOk, total:totalWorkers, icon:"book", notes:"Safeguarding, fire, IPC, moving & handling"},
    {label:"Right to Work",       pass:rtwOk,   total:totalWorkers, icon:"idCard", notes:"All workers verified pre-placement"},
    {label:"NMC/PIN (Nurses)",    pass:pinOk,   total:WORKERS.filter(w=>w.role==="RGN"||w.role==="RMN").length, icon:"medical",notes:"Active PIN verified against NMC register"},
  ];
  const agencyCompliance=AGENCIES.map(a=>({name:a.name,tier:a.tier,compliance:a.compliance,shifts:a.shifts,fillRate:a.fillRate})).sort((a,b)=>b.compliance-a.compliance);
  const accent=user?.role==="clientadmin"?T.purple:T.amber;
  return (
    <Page title="CQC Readiness Report" sub="One-click compliance summary for inspection readiness" icon="award">
      <div style={{background:`linear-gradient(135deg,${T.navy},#1e3a5f)`,borderRadius:18,padding:"24px 28px",marginBottom:20,display:"flex",alignItems:"center",gap:24,flexWrap:"wrap"}}>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:48,fontWeight:600,color:T.white,lineHeight:1}}>{overallScore}%</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,0.6)",marginTop:4}}>Overall Readiness</div>
        </div>
        <div style={{width:1,height:60,background:"rgba(255,255,255,0.15)"}}/>
        <div style={{flex:1}}>
          <div style={{fontFamily:FONT,fontSize:18,color:T.white,marginBottom:6}}>CQC Inspection Readiness</div>
          <p style={{fontSize:12,color:"rgba(255,255,255,0.6)",lineHeight:1.6,margin:0}}>This report consolidates worker credentials, compliance rates, and agency performance into a single inspection-ready summary. Generated {new Date().toLocaleDateString("en-GB")}.</p>
        </div>
        <Btn onClick={()=>exportHTML("CQC Readiness Report","Nexus RPO","<h2>Generated: "+new Date().toLocaleDateString("en-GB")+"</h2><p>Overall score: "+overallScore+"%</p>")}>Export PDF</Btn>
      </div>
      <Grid cols={4}>
        {sections.map(s=>{
          const pct=Math.round((s.pass/Math.max(s.total,1))*100);
          const col=pct>=95?T.green:pct>=80?T.amberText:T.red;
          return(
            <Card key={s.label}>
              <div style={{marginBottom:8,display:"flex",justifyContent:"center",color:T.faint}}>{renderIcon(s.icon,22)}</div>
              <div style={{fontWeight:600,fontSize:13,color:T.text,marginBottom:2}}>{s.label}</div>
              <div style={{fontSize:11,color:T.muted,marginBottom:10}}>{s.notes}</div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <ProgressBar value={pct} color={col}/>
                <span style={{fontWeight:600,fontSize:14,color:col}}>{pct}%</span>
              </div>
              <div style={{fontSize:11,color:T.muted}}>{s.pass}/{s.total} workers compliant</div>
            </Card>
          );
        })}
      </Grid>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <Card>
          <CardHead title="Agency Compliance League" icon="trophy"/>
          <Table headers={["Agency","Tier","Compliance","Fill Rate","Shifts"]} rows={agencyCompliance.map((a,i)=>(
            <tr key={a.name} style={{borderBottom:`1px solid ${T.border}`}}>
              <Td><span style={{fontWeight:560,marginRight:6,color:T.muted}}>#{i+1}</span>{a.name}</Td>
              <Td><Badge label={a.tier} color={TIER_CFG[a.tier]?.c||T.muted} bg={TIER_CFG[a.tier]?.bg||T.sunken}/></Td>
              <Td><span style={{fontWeight:560,color:a.compliance>=95?T.green:a.compliance>=80?T.amberText:T.red}}>{a.compliance}%</span></Td>
              <Td>{a.fillRate}%</Td>
              <Td>{a.shifts}</Td>
            </tr>
          ))}/>
        </Card>
        <Card>
          <CardHead title="Compliance Requirements Register" icon="shield"/>
          <Table headers={["Requirement","Scope","Mandatory","Expiry"]} rows={(complianceReqs||INIT_COMPLIANCE_REQS).filter(r=>r.active).map(r=>(
            <tr key={r.id} style={{borderBottom:`1px solid ${T.border}`}}>
              <Td bold>{r.name}</Td>
              <Td><Badge label={r.scope==="global"?"Global":"Site"} color={r.scope==="global"?T.blue:T.purple} bg={r.scope==="global"?T.blueBg:T.purpleBg}/></Td>
              <Td>{r.mandatory?<Badge label="Mandatory" color={T.red} bg={T.redBg}/>:<Badge label="Recommended" color={T.muted} bg={T.sunken}/>}</Td>
              <Td style={{fontSize:11,color:T.muted}}>{r.expiryMonths?`${r.expiryMonths}m`:"Permanent"}</Td>
            </tr>
          ))}/>
        </Card>
      </div>
    </Page>
  );
};
