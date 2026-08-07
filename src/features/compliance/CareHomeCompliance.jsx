import { useState } from "react";
import { Icon } from "../../components/Icon.jsx";
import { Badge, SBadge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert, ProgressBar } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { SHIFTS } from "../../data/shifts.js";
import { WORKERS } from "../../data/workers.js";
import { RequirementFormModal } from "./RequirementFormModal.jsx";
import { cap } from "../../lib/format.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── CARE HOME: COMPLIANCE ──────────────────────────────────────────────────── */
export const CareHomeCompliance = ({complianceReqs,setComplianceReqs,user}) => {
  const [tab,setTab]           = useState("requirements");
  const [showForm,setShowForm] = useState(false);
  const [editing,setEditing]   = useState(null);
  const mySite = user?.org || "Sunrise Care";

  const globalReqs = complianceReqs.filter(r=>r.scope==="global"&&r.active);
  const myReqs     = complianceReqs.filter(r=>r.scope==="site"&&r.careHome===mySite);
  const allActive  = [...globalReqs,...myReqs.filter(r=>r.active)];

  // Worker compliance for this site
  const myWorkers   = WORKERS.filter(w=>SHIFTS.some(s=>s.carehome===mySite&&s.worker===w.name));
  const compliant   = myWorkers.filter(w=>w.compliance>=80);
  const needsAction = myWorkers.filter(w=>w.compliance<80);

  const catColors = {safeguarding:{c:T.red,bg:T.redBg},training:{c:T.blue,bg:T.blueBg},specialist:{c:T.purple,bg:T.purpleBg},health:{c:T.green,bg:T.greenBg},safety:{c:T.yellow,bg:T.yellowBg},legal:{c:T.navy,bg:T.sunken},registration:{c:T.teal,bg:T.tealBg}};
  const typeIcon = {document:"document",training:"book",registration:"award",vaccination:"medical"};

  const addReq  = (form) => { setComplianceReqs(p=>[...p,{...form,id:`cr${p.length+1}`,scope:"site",careHome:mySite,createdAt:new Date().toISOString().split("T")[0]}]); setShowForm(false); };
  const saveEdit = (form) => { setComplianceReqs(p=>p.map(r=>r.id===editing.id?{...r,...form}:r)); setEditing(null); };
  const toggleActive = (id) => setComplianceReqs(p=>p.map(r=>r.id===id?{...r,active:!r.active}:r));
  const deleteReq    = (id) => setComplianceReqs(p=>p.filter(r=>r.id!==id));

  const tabs = [
    {k:"requirements", l:"Requirements", count:allActive.length},
    {k:"workers",      l:"Worker Status", count:myWorkers.length},
    {k:"mine",         l:"My Requirements", count:myReqs.filter(r=>r.active).length},
  ];

  const ReqCard = ({r, showEdit=false, borderColor=T.border}) => {
    const cc = catColors[r.category]||{c:T.muted,bg:T.sunken};
    return (
      <div style={{background:T.white,border:`1px solid ${borderColor}`,borderRadius:10,padding:"14px 16px",marginBottom:8,display:"flex",alignItems:"flex-start",gap:12}}>
        <div style={{width:38,height:38,borderRadius:10,background:cc.bg,color:cc.c,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <Icon name={typeIcon[r.type]||"document"} size={18}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4,flexWrap:"wrap"}}>
            <span style={{fontWeight:560,fontSize:13}}>{r.name}</span>
            {r.mandatory
              ? <Badge label="Required" color={T.red} bg={T.redBg}/>
              : <Badge label="Optional" color={T.muted} bg={T.sunken}/>}
            <Badge label={cap(r.category)} color={cc.c} bg={cc.bg}/>
            {r.expiryMonths&&<span style={{fontSize:10,color:T.muted,background:T.raised,padding:"2px 7px",borderRadius:8,border:`1px solid ${T.border}`}}>Renews every {r.expiryMonths}m</span>}
          </div>
          {r.notes&&<div style={{fontSize:12,color:T.muted,marginBottom:5,lineHeight:1.5}}>{r.notes}</div>}
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
            {(r.appliesToRoles||[]).map(role=><span key={role} style={{fontSize:9,background:T.purpleBg,color:T.purple,borderRadius:4,padding:"2px 6px",fontWeight:560}}>{role}</span>)}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0}}>
          <span style={{fontSize:10,color:T.muted,fontWeight:600}}>{r.scope==="global"?"Platform":"Your site"}</span>
          {showEdit&&<Btn small variant="secondary" onClick={()=>setEditing(r)}>Edit</Btn>}
        </div>
      </div>
    );
  };

  return (
    <Page title="Compliance" sub={`${mySite} — compliance requirements and worker status`} icon="shield"
      action={tab==="mine"?<Btn onClick={()=>setShowForm(true)}>+ Add Requirement</Btn>:null}>

      {showForm&&<RequirementFormModal onSave={addReq} onClose={()=>setShowForm(false)} addedBy={user?.name||"Care Home Manager"} careHome={mySite}/>}
      {editing&&<RequirementFormModal initial={editing} onSave={saveEdit} onClose={()=>setEditing(null)} addedBy={user?.name||"Care Home Manager"} careHome={mySite}/>}

      <Grid cols={4}>
        <Stat label="Platform Requirements" value={globalReqs.length} sub="Nexus RPO — all sites" accent/>
        <Stat label="Your Site Requirements" value={myReqs.filter(r=>r.active).length} sub="Added by your team"/>
        <Stat label="Compliant Workers" value={compliant.length} sub="Placed at your site"/>
        <Stat label="Needs Attention" value={needsAction.length} sub="Below 80% compliance"/>
      </Grid>

      {needsAction.length>0&&(
        <Alert type="warn">{needsAction.length} worker{needsAction.length>1?"s":""} placed at {mySite} {needsAction.length>1?"are":"is"} below 80% compliance — contact the relevant agency to resolve.</Alert>
      )}

      {/* Tabs */}
      <div style={{display:"flex",gap:0,background:T.sunken,borderRadius:10,padding:4,width:"fit-content",marginBottom:4}}>
        {tabs.map(t=>{
          const active=tab===t.k;
          return (
            <button key={t.k} onClick={()=>setTab(t.k)}
              style={{padding:"7px 18px",borderRadius:8,border:"none",fontFamily:FONT,fontWeight:560,fontSize:13,cursor:"pointer",
                background:active?T.white:"transparent",color:active?T.navy:T.muted,
                boxShadow:active?"0 1px 4px rgba(0,0,0,0.1)":"none",display:"flex",alignItems:"center",gap:7}}>
              {t.l}
              <span style={{fontSize:11,padding:"1px 6px",borderRadius:10,background:active?T.sunken:"transparent",color:active?T.navy:T.muted,fontWeight:560}}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Requirements tab ── */}
      {tab==="requirements"&&(
        <>
          <div style={{background:T.accentBg,border:`1px solid ${T.blue}33`,borderRadius:10,padding:"11px 15px",marginBottom:14,fontSize:12,color:T.muted,lineHeight:1.6}}>
            <strong style={{color:T.blue}}>How this works:</strong> All workers placed at {mySite} must meet both the platform-wide requirements below and any additional requirements your site has added.
          </div>
          {globalReqs.length>0&&(
            <div style={{marginBottom:16}}>
              <div style={{fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:10}}>Platform-Wide ({globalReqs.length})</div>
              {globalReqs.map(r=><ReqCard key={r.id} r={r}/>)}
            </div>
          )}
          {myReqs.filter(r=>r.active).length>0&&(
            <div>
              <div style={{fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:10}}>{mySite} Specific ({myReqs.filter(r=>r.active).length})</div>
              {myReqs.filter(r=>r.active).map(r=><ReqCard key={r.id} r={r} showEdit borderColor={`${T.teal}66`}/>)}
            </div>
          )}
          {allActive.length===0&&(
            <Card style={{padding:40,textAlign:"center"}}><div style={{marginBottom:8,display:"flex",justifyContent:"center",color:T.ghost}}><Icon name="shield" size={30} stroke={1.5}/></div><div style={{color:T.muted}}>No active requirements found.</div></Card>
          )}
        </>
      )}

      {/* ── Worker Status tab ── */}
      {tab==="workers"&&(
        <>
          {myWorkers.length===0?(
            <Card style={{padding:40,textAlign:"center"}}>
              <div style={{marginBottom:10,display:"flex",justifyContent:"center",color:T.ghost}}><Icon name="users" size={30} stroke={1.5}/></div>
              <div style={{fontWeight:560,fontSize:15,marginBottom:6}}>No workers placed yet</div>
              <p style={{color:T.muted,fontSize:13}}>Workers will appear here once they have been placed at {mySite}.</p>
            </Card>
          ):(
            <Card>
              <Table
                headers={["Worker","Role","Agency","DBS","Training","NMC/PIN","Compliance","RTW"]}
                rows={myWorkers.sort((a,b)=>a.compliance-b.compliance).map(w=>(
                  <tr key={w.id} style={{borderBottom:`1px solid ${T.border}`,background:w.compliance<60?T.redBg:w.compliance<80?T.amberBg:"transparent"}}>
                    <Td bold>{w.name}</Td>
                    <Td><Badge label={w.role} color={T.purple} bg={T.purpleBg}/></Td>
                    <Td style={{fontSize:12,color:T.muted}}>{w.agency}</Td>
                    <Td><SBadge s={w.dbs}/></Td>
                    <Td><SBadge s={w.training}/></Td>
                    <Td>{w.pin?<Badge label="✓ Verified" color={T.green} bg={T.greenBg}/>:<Badge label="N/A" color={T.muted} bg={T.sunken}/>}</Td>
                    <Td>
                      <div style={{display:"flex",alignItems:"center",gap:8,minWidth:90}}>
                        <div style={{flex:1}}><ProgressBar value={w.compliance} color={w.compliance>=80?T.green:w.compliance>=60?T.amber:T.red}/></div>
                        <span style={{fontSize:11,fontWeight:560,color:w.compliance>=80?T.green:w.compliance>=60?T.amber:T.red,minWidth:32}}>{w.compliance}%</span>
                      </div>
                    </Td>
                    <Td>
                      {w.rtwExpiry
                        ? <span style={{fontSize:11,fontWeight:600,color:w.rtwExpiry<"2026-06-10"?T.red:T.green}}>{w.rtwExpiry}</span>
                        : <Badge label="Permanent" color={T.green} bg={T.greenBg}/>}
                    </Td>
                  </tr>
                ))}
              />
            </Card>
          )}
        </>
      )}

      {/* ── My Requirements tab ── */}
      {tab==="mine"&&(
        <>
          <div style={{background:T.tealBg,border:`1px solid ${T.teal}44`,borderRadius:10,padding:"11px 15px",marginBottom:14,fontSize:12,color:T.teal,fontWeight:600,lineHeight:1.6}}>
            Site-specific requirements you manage. Workers placed at {mySite} must meet these in addition to all platform requirements.
          </div>
          {myReqs.length===0?(
            <Card style={{padding:40,textAlign:"center"}}>
              <div style={{marginBottom:10,display:"flex",justifyContent:"center",color:T.ghost}}><Icon name="clipboard" size={30} stroke={1.5}/></div>
              <div style={{fontWeight:560,fontSize:15,marginBottom:6}}>No site-specific requirements yet</div>
              <p style={{color:T.muted,fontSize:13,marginBottom:16}}>Add requirements specific to your home — specialist training, site health checks, or additional certifications.</p>
              <Btn onClick={()=>setShowForm(true)}>+ Add Your First Requirement</Btn>
            </Card>
          ):(
            <Card>
              <Table
                headers={["Requirement","Category","Applies To","Renews","Status","Actions"]}
                rows={myReqs.map(r=>{
                  const cc=catColors[r.category]||{c:T.muted,bg:T.sunken};
                  return (
                    <tr key={r.id} style={{borderBottom:`1px solid ${T.border}`,opacity:r.active?1:0.55}}>
                      <Td>
                        <div style={{fontWeight:560,fontSize:13}}>{r.name}</div>
                        {r.notes&&<div style={{fontSize:10,color:T.muted,marginTop:1}}>{r.notes}</div>}
                        <div style={{marginTop:3}}>{r.mandatory?<Badge label="Required" color={T.red} bg={T.redBg}/>:<Badge label="Optional" color={T.muted} bg={T.sunken}/>}</div>
                      </Td>
                      <Td><Badge label={cap(r.category)} color={cc.c} bg={cc.bg}/></Td>
                      <Td><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{(r.appliesToRoles||[]).map(role=><span key={role} style={{fontSize:9,background:T.purpleBg,color:T.purple,borderRadius:4,padding:"2px 5px",fontWeight:560}}>{role}</span>)}</div></Td>
                      <Td><span style={{fontSize:12,color:T.muted}}>{r.expiryMonths?`${r.expiryMonths} months`:"None"}</span></Td>
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
          )}
        </>
      )}
    </Page>
  );
};
