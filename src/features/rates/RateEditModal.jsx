import { useState } from "react";
import { Btn } from "../../components/ui/Button.jsx";
import { Modal } from "../../components/ui/Feedback.jsx";
import { Input, Select } from "../../components/ui/Form.jsx";
import { AGENCIES } from "../../data/agencies.js";
import { BANDS, RATE_DAY_KEYS, RATE_DAY_LABELS } from "../../data/rates.js";
import { ROLES } from "../../data/shifts.js";
import { T } from "../../theme/tokens.js";

export const RateEditModal = ({rate, onSave, onClose, onDelete, isNew}) => {
  const [r, setR] = useState({...rate});
  const f = (k,v) => setR(p=>({...p,[k]:v}));
  const agencyNames  = AGENCIES.map(a=>a.name);
  const careHomeNames = ["Sunrise Care","Meadowbrook Lodge","Oakwood Nursing","Riverside Manor"];
  return (
    <Modal title={isNew ? `Add ${r.type==="agency"?"Agency":"Client"} Rate Card` : `Edit Rate — ${r.role} (${r.band})`} onClose={onClose}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:4}}>
        {r.type==="agency"
          ? <div style={{gridColumn:"1/-1"}}><Select label="Agency *" value={r.agency||""} onChange={v=>f("agency",v)} options={agencyNames}/></div>
          : <div style={{gridColumn:"1/-1"}}><Select label="Care Home (Client) *" value={r.careHome||""} onChange={v=>f("careHome",v)} options={careHomeNames}/></div>
        }
        <Select label="Role" value={r.role} onChange={v=>f("role",v)} options={ROLES}/>
        <Select label="Band" value={r.band} onChange={v=>f("band",v)} options={BANDS}/>
      </div>
      <div style={{background:T.raised,borderRadius:8,padding:"12px 14px",margin:"10px 0 14px"}}>
        <div style={{fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:10}}>
          {r.type==="agency"?"Pay Rate (£/hr — what Nexus RPO pays agency)":"Charge Rate (£/hr — what Nexus RPO bills client)"}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {RATE_DAY_KEYS.map(k=>(
            <Input key={k} label={RATE_DAY_LABELS[k]} type="number" value={r[k]} onChange={v=>f(k,parseFloat(v)||0)}/>
          ))}
        </div>
        <div style={{marginTop:10,display:"flex",alignItems:"center",gap:10}}>
          <Input label="Night Modifier ×" type="number" value={r.nightMod} onChange={v=>f("nightMod",parseFloat(v)||1)}/>
          <div style={{fontSize:11,color:T.muted,paddingTop:20}}>Applied to all overnight rates</div>
        </div>
      </div>
      <Input label="Notes" value={r.notes} onChange={v=>f("notes",v)} placeholder="e.g. Negotiated premium, specialist uplift…"/>
      <div style={{display:"flex",gap:10,justifyContent:"space-between",marginTop:16}}>
        <div>
          {!isNew && <Btn variant="danger" small onClick={()=>{onDelete(r.id);onClose();}}>Delete</Btn>}
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
          <Btn onClick={()=>{onSave(r);onClose();}}>Save Rate Card</Btn>
        </div>
      </div>
    </Modal>
  );
};
