import { useMemo, useState } from "react";
import { Icon } from "../../components/Icon.jsx";
import { Badge, SBadge, UrgDot } from "../../components/ui/Badge.jsx";
import { Btn, Pill } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Alert, Modal } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { AGENCIES } from "../../data/agencies.js";
import { HOME_TO_GROUP, INIT_CLIENT_GROUPS } from "../../data/clients.js";
import { SHIFTS } from "../../data/shifts.js";
import { TIER_CFG, tierBg, tierColor } from "../../lib/format.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── ADMIN: SHIFT BOARD ─────────────────────────────────────────────────────── */
export const ShiftBoard = ({navigate}) => {
  const [filter,setFilter] = useState("all");
  const [search,setSearch] = useState("");
  const [modal,setModal] = useState(null);         // "assign" modal
  const [actionModal,setActionModal] = useState(null); // {shift, type: "cancel"|"withdraw"}
  const [actionReason,setActionReason] = useState("");
  const [shifts,setShifts] = useState(SHIFTS);
  const filtered = useMemo(()=>shifts.filter(s=>{
    const matchStatus = filter==="all"||s.status===filter;
    const matchSearch = !search||s.carehome.toLowerCase().includes(search.toLowerCase())||s.role.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  }),[shifts,filter,search]);

  const assign = (shift) => setModal(shift);
  const doAssign = (shiftId,agency) => {
    setShifts(prev=>prev.map(s=>s.id===shiftId?{...s,status:"pending",agency}:s));
    setModal(null);
  };

  const doCancel = () => {
    setShifts(prev=>prev.map(s=>s.id===actionModal.shift.id?{...s,status:"open",agency:null,worker:null}:s));
    setActionModal(null); setActionReason("");
  };
  const doWithdraw = () => {
    setShifts(prev=>prev.map(s=>s.id===actionModal.shift.id?{...s,status:"open",agency:null,worker:null}:s));
    setActionModal(null); setActionReason("");
  };

  return (
    <Page title="Shift Board" sub="Manage and distribute all shifts across agencies" icon="clipboard" action={<Btn onClick={()=>navigate&&navigate("schedule")}>+ Create Shift</Btn>}>

      {/* Assign modal */}
      {modal && modal.status==="open" && (
        <Modal title={`Assign Shift — ${modal.carehome} (${modal.role})`} onClose={()=>setModal(null)}>
          <p style={{fontSize:13,color:T.muted,marginBottom:16}}>Select an agency to receive this shift request. Only agencies on this client{"'"}s approved panel are shown.</p>
          {(() => {
            const groupId = HOME_TO_GROUP[modal.carehome];
            const group = INIT_CLIENT_GROUPS.find(g => g.id === groupId);
            const panelIds = group?.panelAgencies || AGENCIES.map(a=>a.id);
            const available = AGENCIES.filter(a => panelIds.includes(a.id));
            if(available.length === 0) return (
              <Alert type="warn" style={{marginBottom:16}}>No agencies are on this client{"'"}s panel. Add agencies in Clients {"→"} Agency Panels.</Alert>
            );
            return (
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                {available.map(a=>(
                  <button key={a.id} onClick={()=>doAssign(modal.id,a.name)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",borderRadius:10,border:`1px solid ${TIER_CFG[a.tier]?.border||T.border}`,background:T.white,cursor:"pointer",fontFamily:FONT}}>
                    <div style={{textAlign:"left"}}>
                      <div style={{fontWeight:560,fontSize:13,color:T.text}}>{a.name}</div>
                      <div style={{fontSize:11,color:T.muted,marginTop:2}}>Fill rate: {a.fillRate}% · Avg response: {a.avgResponse}</div>
                    </div>
                    <Badge label={a.tier} color={tierColor(a.tier)} bg={tierBg(a.tier)}/>
                  </button>
                ))}
              </div>
            );
          })()}
          <Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn>
        </Modal>
      )}

      {/* Cancel agency / Withdraw worker modal */}
      {actionModal && (
        <Modal title={actionModal.type==="cancel" ? "Cancel Agency from Shift" : "Withdraw Worker from Shift"} onClose={()=>{setActionModal(null);setActionReason("");}}>
          <div style={{padding:"12px 16px",background:T.raised,borderRadius:10,marginBottom:16,border:`1px solid ${T.border}`}}>
            <div style={{fontSize:11,color:T.muted,fontWeight:600,marginBottom:3}}>SHIFT</div>
            <div style={{fontWeight:600,fontSize:15}}>{actionModal.shift.role} — {actionModal.shift.carehome}</div>
            <div style={{fontSize:12,color:T.muted}}>{actionModal.shift.date} · {actionModal.shift.time}</div>
            {actionModal.type==="cancel" && <div style={{marginTop:6,fontSize:12,color:T.text}}>Agency: <strong>{actionModal.shift.agency}</strong></div>}
            {actionModal.type==="withdraw" && <div style={{marginTop:6,fontSize:12,color:T.text}}>Worker: <strong>{actionModal.shift.worker}</strong> ({actionModal.shift.agency})</div>}
          </div>
          <Alert type="warn">
            {actionModal.type==="cancel"
              ? "Cancelling this agency will revert the shift to Open and they will no longer be notified."
              : "Withdrawing this worker will revert the shift to Open. The site manager and agency will be notified."}
          </Alert>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Reason (optional)</label>
            <textarea value={actionReason} onChange={e=>setActionReason(e.target.value)} rows={2}
              placeholder={actionModal.type==="cancel" ? "e.g. Agency unable to fill, reassigning to another…" : "e.g. Worker cancelled, personal reasons…"}
              style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${T.border}`,fontSize:12,fontFamily:FONT,resize:"vertical",outline:"none",boxSizing:"border-box"}}/>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn variant="danger" onClick={actionModal.type==="cancel" ? doCancel : doWithdraw}>
              {actionModal.type==="cancel" ? "Cancel Agency" : "Withdraw Worker"}
            </Btn>
            <Btn variant="secondary" onClick={()=>{setActionModal(null);setActionReason("");}}>Back</Btn>
          </div>
        </Modal>
      )}

      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:18,flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:1,minWidth:200}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:13}}><Icon name="search" size={15}/></span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search care home or role…" style={{width:"100%",padding:"9px 12px 9px 32px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,background:T.white,color:T.text,outline:"none",fontFamily:FONT}}/>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {["all","open","pending","filled"].map(f=>(
            <Pill key={f} label={`${f==="all"?"All":f.charAt(0).toUpperCase()+f.slice(1)} (${f==="all"?shifts.length:shifts.filter(s=>s.status===f).length})`} active={filter===f} onClick={()=>setFilter(f)}/>
          ))}
        </div>
      </div>
      <Card>
        <Table
          headers={["","Care Home","Role","Date","Time","Rate","Status","Agency","Worker","Actions"]}
          empty="No shifts found"
          rows={filtered.map(s=>(
            <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`}}>
              <Td><UrgDot u={s.urgency}/></Td>
              <Td bold>{s.carehome}</Td>
              <Td><Badge label={s.role} color={T.purple} bg={T.purpleBg}/></Td>
              <Td>{s.date}</Td>
              <Td>{s.time}</Td>
              <Td bold>£{s.rate}{"/hr"}</Td>
              <Td><SBadge s={s.status}/></Td>
              <Td>{s.agency||<span style={{color:T.ghost,fontSize:12,fontStyle:"italic"}}>Unassigned</span>}</Td>
              <Td>{s.worker||<span style={{color:T.ghost,fontSize:12}}>—</span>}</Td>
              <Td>
                <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                  {s.status==="open"    && <Btn small onClick={()=>assign(s)}>Assign</Btn>}
                  {s.status==="pending" && <Btn small variant="danger" onClick={()=>setActionModal({shift:s,type:"cancel"})}>Cancel Agency</Btn>}
                  {s.status==="filled"  && <Btn small variant="danger" onClick={()=>setActionModal({shift:s,type:"withdraw"})}>Withdraw</Btn>}
                </div>
              </Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};
