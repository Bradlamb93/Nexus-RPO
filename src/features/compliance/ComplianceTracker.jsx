import { useState } from "react";
import { Badge, SBadge } from "../../components/ui/Badge.jsx";
import { Btn, Pill } from "../../components/ui/Button.jsx";
import { Card, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert, ProgressBar } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { CARE_HOMES } from "../../data/clients.js";
import { WORKERS } from "../../data/workers.js";
import { RequirementFormModal } from "./RequirementFormModal.jsx";
import { cap } from "../../lib/format.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── ADMIN: COMPLIANCE ──────────────────────────────────────────────────────── */
export const ComplianceTracker = ({complianceReqs,setComplianceReqs,navigate}) => {
  const [tab,setTab]    = useState("workers");
  const [showForm,setShowForm] = useState(false);
  const [editing,setEditing]   = useState(null);
  const [filterScope,setFilterScope] = useState("all");

  const critical = WORKERS.filter(w=>w.compliance<60);
  const warning  = WORKERS.filter(w=>w.compliance>=60&&w.compliance<80);
  const good     = WORKERS.filter(w=>w.compliance>=80);

  const catColors = {safeguarding:{c:T.red,bg:T.redBg},training:{c:T.blue,bg:T.blueBg},specialist:{c:T.purple,bg:T.purpleBg},health:{c:T.green,bg:T.greenBg},safety:{c:T.yellow,bg:T.yellowBg},legal:{c:T.navy,bg:T.sunken},registration:{c:T.teal,bg:T.tealBg}};

  const addReq = (form) => {
    const newReq = {...form, id:`cr${complianceReqs.length+1}`, createdAt:new Date().toISOString().split("T")[0]};
    setComplianceReqs(p=>[...p,newReq]);
    setShowForm(false);
  };
  const saveEdit = (form) => {
    setComplianceReqs(p=>p.map(r=>r.id===editing.id?{...r,...form}:r));
    setEditing(null);
  };
  const toggleActive = (id) => setComplianceReqs(p=>p.map(r=>r.id===id?{...r,active:!r.active}:r));
  const deleteReq    = (id) => setComplianceReqs(p=>p.filter(r=>r.id!==id));

  const globalReqs = complianceReqs.filter(r=>r.scope==="global");
  const siteReqs   = complianceReqs.filter(r=>r.scope==="site");
  const displayed  = filterScope==="all"?complianceReqs:filterScope==="global"?globalReqs:siteReqs;

  return (
    <Page title="Compliance" sub="Track worker credentials and manage platform-wide compliance requirements" icon="shield"
      action={tab==="requirements"?<Btn onClick={()=>setShowForm(true)}>+ Add Requirement</Btn>:null}>

      {/* Modals */}
      {showForm&&<RequirementFormModal onSave={addReq} onClose={()=>setShowForm(false)} addedBy="Nexus Admin" careHome={null}/>}
      {editing&&<RequirementFormModal initial={editing} onSave={saveEdit} onClose={()=>setEditing(null)} addedBy="Nexus Admin" careHome={editing.careHome}/>}

      {/* Tabs */}
      <div style={{display:"flex",gap:8,marginBottom:18}}>
        {[["workers","Worker Status"],["requirements","Requirements Builder"]].map(([v,l])=>(
          <button key={v} onClick={()=>setTab(v)} style={{padding:"9px 18px",borderRadius:8,border:"none",background:tab===v?T.navy:T.sunken,color:tab===v?T.white:T.muted,fontWeight:560,fontSize:12,cursor:"pointer",fontFamily:FONT,transition:"all 0.12s"}}>
            {l}
          </button>
        ))}
      </div>

      {/* ── Worker Status ── */}
      {tab==="workers"&&(
        <>
          <Grid cols={4}>
            <Stat label="Fully Compliant" value={good.length} sub={`${Math.round(good.length/WORKERS.length*100)}% of workers`} accent/>
            <Stat label="Needs Attention" value={warning.length} sub="Expiring items"/>
            <Stat label="Non-Compliant"   value={critical.length} sub="Immediate action"/>
            <Stat label="Avg Score" value={`${Math.round(WORKERS.reduce((a,w)=>a+w.compliance,0)/WORKERS.length)}%`} sub="Target: 95%"/>
          </Grid>
          {critical.length>0&&<Alert type="error" style={{marginBottom:14}}><strong>{critical.length} worker{critical.length>1?"s are":" is"} non-compliant</strong> and cannot be placed on shifts until resolved.</Alert>}
          <Card>
            <Table
              headers={["Worker","Role","Agency","DBS","Training","NMC/PIN","Score","Action"]}
              rows={WORKERS.sort((a,b)=>a.compliance-b.compliance).map(w=>(
                <tr key={w.id} style={{borderBottom:`1px solid ${T.border}`,background:w.compliance<60?T.redBg:w.compliance<80?T.amberBg:"transparent"}}>
                  <Td bold>{w.name}</Td>
                  <Td><Badge label={w.role} color={T.purple} bg={T.purpleBg}/></Td>
                  <Td><span style={{fontSize:12,color:T.muted}}>{w.agency}</span></Td>
                  <Td><SBadge s={w.dbs}/></Td>
                  <Td><SBadge s={w.training}/></Td>
                  <Td>{w.pin?<Badge label="✓ Verified" color={T.green} bg={T.greenBg}/>:<Badge label="✗ Missing" color={T.red} bg={T.redBg}/>}</Td>
                  <Td>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:60}}><ProgressBar value={w.compliance} color={w.compliance>=95?T.green:w.compliance>=75?T.yellow:T.red}/></div>
                      <span style={{fontWeight:560,fontSize:12,color:w.compliance>=95?T.green:w.compliance>=75?T.yellow:T.red}}>{w.compliance}%</span>
                    </div>
                  </Td>
                  <Td>
                    <div style={{display:"flex",gap:5}}>
                      {w.compliance<80&&<Btn small variant="danger" onClick={()=>alert(`Alert sent to ${w.agency} regarding ${w.name}'s compliance (${w.compliance}%). Agency has been notified.`)}>Alert Agency</Btn>}
                      <Btn small variant="secondary" onClick={()=>{navigate&&navigate("documents");}}>View Docs</Btn>
                    </div>
                  </Td>
                </tr>
              ))}
            />
          </Card>
        </>
      )}

      {/* ── Requirements Builder ── */}
      {tab==="requirements"&&(
        <>
          <Grid cols={3}>
            <Stat label="Global Requirements" value={globalReqs.length} accent sub="Apply to all sites"/>
            <Stat label="Site-Specific" value={siteReqs.length} sub={`Across ${[...new Set(siteReqs.map(r=>r.careHome))].length} sites`}/>
            <Stat label="Active" value={complianceReqs.filter(r=>r.active).length} sub={`${complianceReqs.filter(r=>!r.active).length} inactive`}/>
          </Grid>

          {/* Info banner */}
          <div style={{background:T.accentBg,border:`1px solid ${T.blue}44`,borderRadius:14,padding:"12px 16px",marginBottom:16,fontSize:12,color:T.muted}}>
            <strong style={{color:T.blue}}>How requirements work:</strong> Global requirements apply to all workers on all sites. Care homes can also add site-specific requirements — workers must meet both global and their assigned site's requirements before being placed.
          </div>

          {/* Scope filter */}
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            {[["all","All Requirements"],["global","Global Only"],["site","Site-Specific"]].map(([v,l])=>(
              <Pill key={v} label={l} active={filterScope===v} onClick={()=>setFilterScope(v)}/>
            ))}
          </div>

          {/* Site breakdown cards */}
          {filterScope!=="global"&&siteReqs.length>0&&(
            <div style={{marginBottom:18}}>
              <div style={{fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:10}}>Site-Specific Requirements by Location</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
                {CARE_HOMES.map(ch=>{
                  const chReqs = siteReqs.filter(r=>r.careHome===ch.name);
                  return (
                    <div key={ch.id} style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 14px"}}>
                      <div style={{fontWeight:560,fontSize:13,marginBottom:4}}>{ch.name}</div>
                      <div style={{fontSize:11,color:T.muted,marginBottom:8}}>{chReqs.length} requirement{chReqs.length!==1?"s":""}</div>
                      {chReqs.length===0?<div style={{fontSize:11,color:T.muted,fontStyle:"italic"}}>No site-specific requirements</div>:(
                        chReqs.map(r=>(
                          <div key={r.id} style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
                            <span style={{fontSize:9,color:r.active?T.green:T.muted}}>●</span>
                            <span style={{fontSize:11,color:r.active?T.text:T.muted,textDecoration:r.active?"none":"line-through"}}>{r.name}</span>
                            {r.mandatory&&<span style={{fontSize:8,background:T.redBg,color:T.red,borderRadius:3,padding:"1px 4px",fontWeight:560}}>REQ</span>}
                          </div>
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Requirements table */}
          <Card>
            <Table
              headers={["Requirement","Type","Category","Applies To","Scope","Expiry","Mandatory","Added By","Status","Actions"]}
              rows={displayed.map(r=>{
                const cc = catColors[r.category]||{c:T.muted,bg:T.sunken};
                return (
                  <tr key={r.id} style={{borderBottom:`1px solid ${T.border}`,background:r.active?"transparent":T.raised,opacity:r.active?1:0.65}}>
                    <Td>
                      <div>
                        <div style={{fontWeight:560,fontSize:13}}>{r.name}</div>
                        {r.notes&&<div style={{fontSize:10,color:T.muted,marginTop:1,maxWidth:200}}>{r.notes}</div>}
                      </div>
                    </Td>
                    <Td><span style={{fontSize:11,fontWeight:600,color:T.text,textTransform:"capitalize"}}>{r.type}</span></Td>
                    <Td><Badge label={cap(r.category)} color={cc.c} bg={cc.bg}/></Td>
                    <Td>
                      <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                        {r.appliesToRoles.map(role=><span key={role} style={{fontSize:9,background:T.purpleBg,color:T.purple,borderRadius:4,padding:"2px 5px",fontWeight:560}}>{role}</span>)}
                      </div>
                    </Td>
                    <Td>
                      {r.scope==="global"
                        ?<Badge label="Global" color={T.navy} bg={T.sunken}/>
                        :<Badge label={`${r.careHome}`} color={T.teal} bg={T.tealBg}/>}
                    </Td>
                    <Td><span style={{fontSize:12,color:T.muted}}>{r.expiryMonths?`${r.expiryMonths} months`:"No expiry"}</span></Td>
                    <Td>{r.mandatory?<Badge label="Required" color={T.red} bg={T.redBg}/>:<Badge label="Optional" color={T.muted} bg={T.sunken}/>}</Td>
                    <Td><span style={{fontSize:11,color:T.muted}}>{r.addedBy}</span></Td>
                    <Td>
                      <button onClick={()=>toggleActive(r.id)} style={{padding:"4px 10px",borderRadius:20,border:`1px solid ${r.active?T.green:T.border}`,background:r.active?T.greenBg:T.sunken,color:r.active?T.green:T.muted,fontSize:10,fontWeight:560,cursor:"pointer",fontFamily:FONT}}>
                        {r.active?"Active":"Inactive"}
                      </button>
                    </Td>
                    <Td>
                      <div style={{display:"flex",gap:5}}>
                        <Btn small variant="secondary" onClick={()=>setEditing(r)}>Edit</Btn>
                        <Btn small variant="danger" onClick={()=>deleteReq(r.id)}>×</Btn>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            />
          </Card>
        </>
      )}
    </Page>
  );
};
