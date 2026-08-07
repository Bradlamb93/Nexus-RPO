import { useState } from "react";
import { Btn } from "../../components/ui/Button.jsx";
import { Modal } from "../../components/ui/Feedback.jsx";
import { Input } from "../../components/ui/Form.jsx";
import { FONT, T } from "../../theme/tokens.js";

/* ─── SHARED: REQUIREMENT FORM MODAL ─────────────────────────────────────────── */
export const RequirementFormModal = ({onSave,onClose,careHome,addedBy,initial}) => {
  const blank = {name:"",type:"training",category:"training",appliesToRoles:[],mandatory:true,expiryMonths:"12",notes:""};
  const [form,setForm] = useState(initial||blank);
  const set = (k,v) => setForm(p=>({...p,[k]:v}));
  const allRoles = ["RGN","RMN","HCA","Senior Carer"];
  const toggleRole = (r) => set("appliesToRoles", form.appliesToRoles.includes(r)?form.appliesToRoles.filter(x=>x!==r):[...form.appliesToRoles,r]);
  const valid = form.name && form.appliesToRoles.length>0;
  return (
    <Modal title={initial?"Edit Requirement":"Add Compliance Requirement"} onClose={onClose}>
      <Input label="Requirement Name *" value={form.name} onChange={v=>set("name",v)} placeholder="e.g. Dementia Care Certificate"/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <div>
          <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Type *</label>
          <select value={form.type} onChange={e=>set("type",e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${T.border}`,fontSize:13,fontFamily:FONT,outline:"none",background:T.raised}}>
            <option value="document">Document</option>
            <option value="training">Training Certificate</option>
            <option value="registration">Professional Registration</option>
            <option value="vaccination">Vaccination Record</option>
          </select>
        </div>
        <div>
          <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Category</label>
          <select value={form.category} onChange={e=>set("category",e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${T.border}`,fontSize:13,fontFamily:FONT,outline:"none",background:T.raised}}>
            <option value="safeguarding">Safeguarding</option>
            <option value="training">General Training</option>
            <option value="specialist">Specialist</option>
            <option value="health">Health</option>
            <option value="safety">Safety</option>
            <option value="legal">Legal</option>
            <option value="registration">Registration</option>
          </select>
        </div>
      </div>
      <div style={{marginBottom:12}}>
        <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:8}}>Applies To Roles *</label>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {allRoles.map(r=>{
            const on = form.appliesToRoles.includes(r);
            return <button key={r} onClick={()=>toggleRole(r)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${on?T.navy:T.border}`,background:on?T.navy:T.raised,color:on?T.white:T.muted,fontSize:12,fontWeight:560,cursor:"pointer",fontFamily:FONT,transition:"all 0.12s"}}>{r}</button>;
          })}
          <button onClick={()=>set("appliesToRoles",allRoles)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${T.border}`,background:"transparent",color:T.muted,fontSize:11,cursor:"pointer",fontFamily:FONT}}>All Roles</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
        <div>
          <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Mandatory?</label>
          <div style={{display:"flex",gap:8}}>
            {[true,false].map(v=>(
              <button key={String(v)} onClick={()=>set("mandatory",v)} style={{flex:1,padding:"8px",borderRadius:8,border:`1px solid ${form.mandatory===v?T.navy:T.border}`,background:form.mandatory===v?T.navy:T.raised,color:form.mandatory===v?T.white:T.muted,fontSize:12,fontWeight:560,cursor:"pointer",fontFamily:FONT}}>
                {v?"Mandatory":"Optional"}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Expiry (months)</label>
          <input type="number" min="1" max="120" value={form.expiryMonths} onChange={e=>set("expiryMonths",e.target.value)} placeholder="Leave blank if no expiry"
            style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${T.border}`,fontSize:13,fontFamily:FONT,outline:"none",background:T.raised}}/>
        </div>
      </div>
      <div style={{marginBottom:16}}>
        <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Notes / Guidance</label>
        <textarea value={form.notes} onChange={e=>set("notes",e.target.value)} rows={2} placeholder="Any guidance for agencies or workers on fulfilling this requirement…"
          style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${T.border}`,fontSize:13,fontFamily:FONT,resize:"vertical",outline:"none"}}/>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={()=>valid&&onSave({...form,expiryMonths:form.expiryMonths?parseInt(form.expiryMonths):null,careHome:careHome||null,addedBy,scope:careHome?"site":"global",active:true})} style={{opacity:valid?1:0.5}}>
          {initial?"Save Changes":"Add Requirement"}
        </Btn>
      </div>
    </Modal>
  );
};
