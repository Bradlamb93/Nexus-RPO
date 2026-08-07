import { useState } from "react";
import { Badge, SBadge, UrgDot } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert, Modal } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { SHIFTS } from "../../data/shifts.js";
import { cap, tierBg, tierColor, urgencyColor } from "../../lib/format.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── CARE HOME: MY SHIFTS (with Tier Push) ──────────────────────────────────── */
export const CareHomeMyShifts = ({user}) => {
  const today = "2026-03-10";
  const [shifts, setShifts] = useState(SHIFTS.filter(s=>s.carehome==="Sunrise Care"));
  const allShifts = shifts;
  const [tab,       setTab]       = useState("unfilled");
  const [tierModal, setTierModal] = useState(null);
  const [newTier,   setNewTier]   = useState("Tier 2");
  const [pushed,    setPushed]    = useState({});
  const [actionModal, setActionModal] = useState(null);
  const [actionReason, setActionReason] = useState("");

  const canPush = s => s.status==="open"||s.status==="pending";

  const tabDefs = [
    {k:"unfilled", l:"Unfilled", count: allShifts.filter(s=>(s.status==="open"||s.status==="pending")&&s.date>=today).length, color:T.red},
    {k:"filled",   l:"Filled",   count: allShifts.filter(s=>s.status==="filled").length, color:T.green},
    {k:"expired",  l:"Expired",  count: allShifts.filter(s=>s.date<today&&s.status!=="filled").length, color:T.muted},
  ];

  const visibleShifts = allShifts.filter(s=>{
    if(tab==="unfilled") return (s.status==="open"||s.status==="pending") && s.date>=today;
    if(tab==="filled")   return s.status==="filled";
    if(tab==="expired")  return s.date<today && s.status!=="filled";
    return true;
  }).sort((a,b)=>a.date.localeCompare(b.date));

  const doPush = () => {
    const note = newTier==="Tier 1" ? "Pushed to Tier 1 — Priority agencies notified immediately."
      : newTier==="Tier 2" ? "Pushed to Tier 2 — Secondary agencies notified. Tier 1 window bypassed."
      : "Pushed to Tier 3 — All agency tiers now notified.";
    setPushed(p=>({...p,[tierModal.id]:{tier:newTier,note}}));
    setTierModal(null);
  };

  const doAction = () => {
    setShifts(prev=>prev.map(s=>s.id===actionModal.shift.id?{...s,status:"open",agency:null,worker:null}:s));
    setActionModal(null); setActionReason("");
  };

  const TIERS = [
    {v:"Tier 1",desc:"Priority agencies — notified immediately.",delay:"Immediate"},
    {v:"Tier 2",desc:"Secondary agencies — bypasses the Tier 1 window and notifies Tier 2 now.",delay:"Now (bypass Tier 1 wait)"},
    {v:"Tier 3",desc:"All agencies — opens the shift to every tier simultaneously.",delay:"Now (all tiers)"},
  ];

  return (
    <Page title="My Shifts" sub="Sunrise Care" icon="clipboard">

      {/* Tier push modal */}
      {tierModal && (
        <Modal title="Push Shift to Different Tier" onClose={()=>setTierModal(null)}>
          <div style={{padding:"12px 16px",background:T.raised,borderRadius:10,marginBottom:16,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:11,color:T.muted,fontWeight:600,marginBottom:4}}>SHIFT</div>
            <div style={{fontWeight:600,fontSize:15}}>{tierModal.role} — {tierModal.date}</div>
            <div style={{fontSize:12,color:T.muted}}>{tierModal.time} · {tierModal.carehome}</div>
            <div style={{marginTop:8,display:"flex",gap:8,alignItems:"center"}}>
              <span style={{fontSize:12,color:T.muted}}>Currently broadcasting to:</span>
              <Badge label={pushed[tierModal.id]?.tier||"Tier 1"} color={tierColor(pushed[tierModal.id]?.tier||"Tier 1")} bg={tierBg(pushed[tierModal.id]?.tier||"Tier 1")}/>
            </div>
          </div>
          <Alert type="warning">Pushing to a different tier will notify those agencies immediately. This cannot be undone.</Alert>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:10}}>Push to which tier?</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {TIERS.map(opt=>{
                const isActive=newTier===opt.v; const col=tierColor(opt.v); const bg=tierBg(opt.v);
                return (
                  <label key={opt.v} onClick={()=>setNewTier(opt.v)}
                    style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",borderRadius:10,border:`1px solid ${isActive?col:T.border}`,background:isActive?bg:T.raised,cursor:"pointer"}}>
                    <input type="radio" checked={isActive} onChange={()=>setNewTier(opt.v)} style={{marginTop:3,accentColor:col}}/>
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                        <span style={{fontWeight:600,fontSize:13,color:isActive?col:T.text}}>{opt.v}</span>
                        <span style={{fontSize:10,fontWeight:560,padding:"2px 7px",borderRadius:20,background:isActive?col+"22":T.sunken,color:isActive?col:T.muted}}>{opt.delay}</span>
                      </div>
                      <div style={{fontSize:12,color:T.muted,lineHeight:1.5}}>{opt.desc}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={doPush}>Push to {newTier}</Btn>
            <Btn variant="secondary" onClick={()=>setTierModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Cancel/Withdraw modal */}
      {actionModal && (
        <Modal title={actionModal.type==="cancel" ? "Cancel Agency from Shift" : "Withdraw Worker from Shift"} onClose={()=>{setActionModal(null);setActionReason("");}}>
          <div style={{padding:"12px 16px",background:T.raised,borderRadius:10,marginBottom:16,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:11,color:T.muted,fontWeight:600,marginBottom:3}}>SHIFT</div>
            <div style={{fontWeight:600,fontSize:15}}>{actionModal.shift.role} — {actionModal.shift.date}</div>
            <div style={{fontSize:12,color:T.muted}}>{actionModal.shift.time}</div>
            {actionModal.type==="cancel" && <div style={{marginTop:6,fontSize:12}}>Agency: <strong>{actionModal.shift.agency}</strong></div>}
            {actionModal.type==="withdraw" && <div style={{marginTop:6,fontSize:12}}>Worker: <strong>{actionModal.shift.worker}</strong> ({actionModal.shift.agency})</div>}
          </div>
          <Alert type="warn">
            {actionModal.type==="cancel"
              ? "This will remove the agency from the shift and reopen it. Nexus RPO will be notified."
              : "This will withdraw the worker and reopen the shift. The agency and Nexus RPO will be notified."}
          </Alert>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Reason (optional)</label>
            <textarea value={actionReason} onChange={e=>setActionReason(e.target.value)} rows={2}
              placeholder="e.g. Worker called in sick, agency can no longer fill…"
              style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${T.border}`,fontSize:12,fontFamily:FONT,resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn variant="danger" onClick={doAction}>
              {actionModal.type==="cancel" ? "Cancel Agency" : "Withdraw Worker"}
            </Btn>
            <Btn variant="secondary" onClick={()=>{setActionModal(null);setActionReason("");}}>Back</Btn>
          </div>
        </Modal>
      )}

      {/* Stats */}
      <Grid cols={4}>
        <Stat label="Total Shifts" value={allShifts.length}/>
        <Stat label="Filled" value={allShifts.filter(s=>s.status==="filled").length} accent/>
        <Stat label="Unfilled" value={allShifts.filter(s=>canPush(s)&&s.date>=today).length} sub="Needs cover"/>
        <Stat label="Tier Pushes" value={Object.keys(pushed).length} sub="This session"/>
      </Grid>

      {/* Tabs */}
      <div style={{display:"flex",gap:0,background:T.sunken,borderRadius:10,padding:4,width:"fit-content",marginBottom:4}}>
        {tabDefs.map(t=>{
          const active = tab===t.k;
          return (
            <button key={t.k} onClick={()=>setTab(t.k)}
              style={{padding:"7px 18px",borderRadius:8,border:"none",fontFamily:FONT,fontWeight:560,fontSize:13,cursor:"pointer",
                background:active?T.white:"transparent",color:active?T.navy:T.muted,
                boxShadow:active?"0 1px 4px rgba(0,0,0,0.1)":"none",display:"flex",alignItems:"center",gap:7}}>
              {t.l}
              <span style={{fontSize:11,fontWeight:560,padding:"2px 7px",borderRadius:20,
                background:active?t.color+"18":"transparent",color:active?t.color:T.muted}}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      <Card>
        <CardHead
          title={tabDefs.find(t=>t.k===tab)?.l + " Shifts"}
          sub={tab==="unfilled"?"Open shifts can be pushed to a different agency tier":tab==="filled"?"Shifts with confirmed workers":"Shifts that passed without being filled"}
        />
        {visibleShifts.length===0
          ? <div style={{padding:40,textAlign:"center",color:T.muted,fontSize:13}}>No {tab} shifts found.</div>
          : <Table
              headers={tab==="expired"
                ? ["Role","Date","Time","Urgency","Status","Notes"]
                : ["Role","Date","Time","Urgency","Status","Agency","Worker","Tier Broadcast","Actions"]}
              rows={visibleShifts.map(s=>{
                const pushInfo=pushed[s.id];
                return (
                  <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`,background:s.urgency==="urgent"&&tab==="unfilled"?T.amberBg:"transparent"}}>
                    <Td><Badge label={s.role} color={T.purple} bg={T.purpleBg}/></Td>
                    <Td bold>{s.date}</Td>
                    <Td style={{color:T.muted,fontSize:12}}>{s.time}</Td>
                    <Td><span style={{fontSize:12,color:urgencyColor(s.urgency),fontWeight:600}}><UrgDot u={s.urgency}/>{cap(s.urgency)}</span></Td>
                    <Td><SBadge s={s.status}/></Td>
                    {tab==="expired"
                      ? <Td style={{fontSize:12,color:T.muted}}>{s.notes||"—"}</Td>
                      : <>
                          <Td>{s.agency||<span style={{color:T.muted,fontSize:12}}>Awaiting</span>}</Td>
                          <Td>{s.worker||<span style={{color:T.ghost,fontSize:12}}>TBC</span>}</Td>
                          <Td>
                            {pushInfo
                              ? <div><Badge label={pushInfo.tier} color={tierColor(pushInfo.tier)} bg={tierBg(pushInfo.tier)}/><div style={{fontSize:10,color:T.muted,marginTop:3}}>Pushed ✓</div></div>
                              : <Badge label="Tier 1" color={tierColor("Tier 1")} bg={tierBg("Tier 1")}/>}
                          </Td>
                          <Td>
                            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                              {canPush(s) && <Btn small onClick={()=>{setTierModal(s);setNewTier("Tier 2");}}>Push Tier</Btn>}
                              {s.status==="pending" && <Btn small variant="danger" onClick={()=>setActionModal({shift:s,type:"cancel"})}>Cancel</Btn>}
                              {s.status==="filled"  && <Btn small variant="danger" onClick={()=>setActionModal({shift:s,type:"withdraw"})}>Withdraw</Btn>}
                            </div>
                          </Td>
                        </>
                    }
                  </tr>
                );
              })}
            />
        }
      </Card>
    </Page>
  );
};
