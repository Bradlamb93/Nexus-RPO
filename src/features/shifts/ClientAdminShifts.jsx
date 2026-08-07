import { useState } from "react";
import { renderIcon } from "../../components/Icon.jsx";
import { Badge, SBadge, UrgDot } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert, Modal } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { SITE_COLORS } from "../../data/clients.js";
import { BROADCAST_OPTIONS, SHIFTS } from "../../data/shifts.js";
import { cap, urgencyColor } from "../../lib/format.js";
import { CA_PURPLE, FONT, T } from "../../theme/tokens.js";

export const ClientAdminShifts = ({user}) => {
  const today = "2026-03-10";
  const [shifts, setShifts] = useState(SHIFTS);
  const allSites = [...new Set(shifts.map(s=>s.carehome))].sort();
  const [site,    setSite]    = useState("all");
  const [tab,     setTab]     = useState("unfilled");
  const [pubModal,setPubModal] = useState(null);
  const [publishedToBank,setPublishedToBank] = useState([]);
  const [selectedBroadcast,setSelectedBroadcast] = useState("bank_first");
  const [actionModal, setActionModal] = useState(null);
  const [actionReason, setActionReason] = useState("");

  const siteShifts = site==="all" ? shifts : shifts.filter(s=>s.carehome===site);

  const tabDefs = [
    {k:"unfilled", l:"Unfilled", count: siteShifts.filter(s=>(s.status==="open"||s.status==="pending")&&s.date>=today).length, color:T.red},
    {k:"filled",   l:"Filled",   count: siteShifts.filter(s=>s.status==="filled").length, color:T.green},
    {k:"expired",  l:"Expired",  count: siteShifts.filter(s=>s.date<today&&s.status!=="filled").length, color:T.muted},
  ];

  const visible = siteShifts.filter(s=>{
    if(tab==="unfilled") return (s.status==="open"||s.status==="pending") && s.date>=today;
    if(tab==="filled")   return s.status==="filled";
    if(tab==="expired")  return s.date<today && s.status!=="filled";
    return true;
  }).sort((a,b)=>a.date.localeCompare(b.date));

  const doAction = () => {
    setShifts(prev=>prev.map(s=>s.id===actionModal.shift.id?{...s,status:"open",agency:null,worker:null}:s));
    setActionModal(null); setActionReason("");
  };

  return (
    <Page title="All Shifts" sub="Group-wide shift overview" icon="clipboard">
      {pubModal && (
        <Modal title={`Publish Shift — ${pubModal.carehome} (${pubModal.role})`} onClose={()=>{setPubModal(null);setSelectedBroadcast("bank_first");}}>
          <p style={{fontSize:13,color:T.muted,marginBottom:14}}>{pubModal.date} · {pubModal.time}</p>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:18}}>
            {BROADCAST_OPTIONS.map(opt=>{
              const sel=selectedBroadcast===opt.key;
              return (
                <button key={opt.key} onClick={()=>setSelectedBroadcast(opt.key)}
                  style={{display:"flex",gap:12,alignItems:"flex-start",padding:"12px 14px",borderRadius:10,border:`2px solid ${sel?opt.color:T.border}`,background:sel?opt.bg:T.white,cursor:"pointer",textAlign:"left",fontFamily:FONT,width:"100%"}}>
                  <span style={{display:"flex"}}>{renderIcon(opt.icon,18)}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:560,fontSize:12,color:sel?opt.color:T.text,marginBottom:2}}>{opt.label}</div>
                    <div style={{fontSize:11,color:T.muted,lineHeight:1.4}}>{opt.desc}</div>
                  </div>
                  <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${sel?opt.color:T.border}`,background:sel?opt.color:"transparent",flexShrink:0,marginTop:2}}/>
                </button>
              );
            })}
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={()=>{setPublishedToBank(b=>[...b,pubModal.id]);setPubModal(null);setSelectedBroadcast("bank_first");}}>Publish Shift {"→"}</Btn>
            <Btn variant="secondary" onClick={()=>{setPubModal(null);setSelectedBroadcast("bank_first");}}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Cancel/Withdraw modal */}
      {actionModal && (
        <Modal title={actionModal.type==="cancel" ? "Cancel Agency from Shift" : "Withdraw Worker from Shift"} onClose={()=>{setActionModal(null);setActionReason("");}}>
          <div style={{padding:"12px 16px",background:T.raised,borderRadius:10,marginBottom:16,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:11,color:T.muted,fontWeight:600,marginBottom:3}}>SHIFT</div>
            <div style={{fontWeight:600,fontSize:15}}>{actionModal.shift.role} — {actionModal.shift.carehome}</div>
            <div style={{fontSize:12,color:T.muted}}>{actionModal.shift.date} · {actionModal.shift.time}</div>
            {actionModal.type==="cancel"   && <div style={{marginTop:6,fontSize:12}}>Agency: <strong>{actionModal.shift.agency}</strong></div>}
            {actionModal.type==="withdraw" && <div style={{marginTop:6,fontSize:12}}>Worker: <strong>{actionModal.shift.worker}</strong> ({actionModal.shift.agency})</div>}
          </div>
          <Alert type="warn">
            {actionModal.type==="cancel"
              ? "Removing this agency will reopen the shift. Nexus RPO will be notified to reassign."
              : "Withdrawing this worker will reopen the shift. The agency and Nexus RPO will be notified."}
          </Alert>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Reason (optional)</label>
            <textarea value={actionReason} onChange={e=>setActionReason(e.target.value)} rows={2}
              placeholder="e.g. Worker no longer available, agency withdrew candidate…"
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

      {/* Stats row */}
      <Grid cols={4}>
        <Stat label="Total Shifts" value={siteShifts.length}/>
        <Stat label="Filled" value={siteShifts.filter(s=>s.status==="filled").length} accent/>
        <Stat label="Unfilled" value={siteShifts.filter(s=>(s.status==="open"||s.status==="pending")&&s.date>=today).length} sub="Needs cover"/>
        <Stat label="Expired Unfilled" value={siteShifts.filter(s=>s.date<today&&s.status!=="filled").length} sub="No cover found"/>
      </Grid>

      {/* Site filter + tabs row */}
      <div style={{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap",marginBottom:4}}>
        {/* Site filter pills */}
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {["all",...allSites].map(s=>{
            const active=site===s;
            return (
              <button key={s} onClick={()=>setSite(s)}
                style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${active?CA_PURPLE:T.border}`,
                  background:active?`${CA_PURPLE}18`:T.white,fontWeight:560,fontSize:12,cursor:"pointer",
                  color:active?CA_PURPLE:T.muted,fontFamily:FONT}}>
                {s==="all"?"All Sites":s}
              </button>
            );
          })}
        </div>

        <div style={{width:1,height:24,background:T.border}}/>

        {/* Status tabs */}
        <div style={{display:"flex",gap:0,background:T.sunken,borderRadius:10,padding:4}}>
          {tabDefs.map(t=>{
            const active=tab===t.k;
            return (
              <button key={t.k} onClick={()=>setTab(t.k)}
                style={{padding:"6px 16px",borderRadius:8,border:"none",fontFamily:FONT,fontWeight:560,fontSize:13,cursor:"pointer",
                  background:active?T.white:"transparent",color:active?T.navy:T.muted,
                  boxShadow:active?"0 1px 4px rgba(0,0,0,0.1)":"none",display:"flex",alignItems:"center",gap:6}}>
                {t.l}
                <span style={{fontSize:11,fontWeight:560,padding:"2px 7px",borderRadius:20,
                  background:active?t.color+"18":"transparent",color:active?t.color:T.muted}}>
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Card>
        <CardHead
          title={(site==="all"?"All Sites":site) + " — " + tabDefs.find(t=>t.k===tab)?.l}
          sub={`${visible.length} shift${visible.length!==1?"s":""} shown`}
        />
        {visible.length===0
          ? <div style={{padding:40,textAlign:"center",color:T.muted,fontSize:13}}>No {tab} shifts{site!=="all"?` for ${site}`:""} found.</div>
          : <Table
              headers={tab==="expired"
                ? ["Location","Role","Date","Time","Urgency","Status"]
                : ["Location","Role","Date","Time","Urgency","Status","Agency","Worker","Action"]}
              rows={visible.map(s=>(
                <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`}}>
                  <Td>
                    <span style={{fontSize:12,fontWeight:560,color:SITE_COLORS[s.carehome]||CA_PURPLE}}>{s.carehome}</span>
                  </Td>
                  <Td><Badge label={s.role} color={T.purple} bg={T.purpleBg}/></Td>
                  <Td bold>{s.date}</Td>
                  <Td style={{fontSize:12,color:T.muted}}>{s.time}</Td>
                  <Td><span style={{fontSize:12,color:urgencyColor(s.urgency),fontWeight:600}}><UrgDot u={s.urgency}/>{cap(s.urgency)}</span></Td>
                  <Td><SBadge s={s.status}/></Td>
                  {tab!=="expired" && <>
                    <Td style={{fontSize:12}}>{s.agency||"—"}</Td>
                    <Td style={{fontSize:12}}>{s.worker||<span style={{color:T.ghost}}>Awaiting</span>}</Td>
                    <Td>
                      {publishedToBank.includes(s.id)
                        ? <Badge label="Published" color={T.teal} bg={T.tealBg}/>
                        : <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                            {s.status==="open"    && <Btn small onClick={()=>setPubModal(s)}>Publish {"→"}</Btn>}
                            {s.status==="pending" && <Btn small variant="danger" onClick={()=>setActionModal({shift:s,type:"cancel"})}>Cancel Agency</Btn>}
                            {s.status==="filled"  && <Btn small variant="danger" onClick={()=>setActionModal({shift:s,type:"withdraw"})}>Withdraw</Btn>}
                          </div>}
                    </Td>
                  </>}
                </tr>
              ))}
            />
        }
      </Card>
    </Page>
  );
};
