import { useState } from "react";
import { Icon } from "../../components/Icon.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Alert } from "../../components/ui/Feedback.jsx";
import { Input, Select } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { RTW_TYPES } from "../../data/compliance.js";
import { FONT, T } from "../../theme/tokens.js";

export const WorkerOnboarding = ({navigate}) => {
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({firstName:"",lastName:"",email:"",phone:"",role:"RGN",pin:"",dob:"",address:"",dbsDate:"",trainingDate:"",notes:""});
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const steps = ["Personal Details","Credentials","Documents","Review"];
  if(step>4) return (
    <Page title="Worker Registered" icon="checkCircle">
      <div style={{maxWidth:440,background:T.white,borderRadius:18,border:`1px solid ${T.border}`,padding:40,textAlign:"center"}}>
        <div style={{marginBottom:12,display:"flex",justifyContent:"center",color:T.ghost}}><Icon name="sparkle" size={46} stroke={1.5}/></div>
        <h2 style={{fontFamily:FONT,fontSize:22,marginBottom:8}}>Worker Registered!</h2>
        <p style={{color:T.muted,fontSize:13,lineHeight:1.7,marginBottom:24}}><strong>{form.firstName} {form.lastName}</strong> has been added to your worker register. Once documents are verified by Nexus RPO, they'll be available for shift placement.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <Btn onClick={()=>{setStep(1);setForm({firstName:"",lastName:"",email:"",phone:"",role:"RGN",pin:"",dob:"",address:"",dbsDate:"",trainingDate:"",notes:""});}}>Register Another</Btn>
          <Btn variant="secondary" onClick={()=>navigate&&navigate("workers")}>View Workers</Btn>
        </div>
      </div>
    </Page>
  );
  return (
    <Page title="Register New Worker" sub="Add a worker to your First Choice Nursing register" icon="plus">
      <div style={{maxWidth:620}}>
        <div style={{display:"flex",gap:0,marginBottom:24,background:T.white,borderRadius:10,border:`1px solid ${T.border}`,overflow:"hidden"}}>
          {steps.map((s,i)=>(
            <div key={i} style={{flex:1,padding:"10px",textAlign:"center",background:step===i+1?T.navy:step>i+1?T.amberBg:"transparent",color:step===i+1?T.white:step>i+1?T.amberText:T.muted,fontSize:11,fontWeight:560,borderRight:i<3?`1px solid ${T.border}`:"none",transition:"all 0.2s"}}>
              {step>i+1?"✓ ":""}{s}
            </div>
          ))}
        </div>
        <Card style={{padding:28}}>
          {step===1 && <>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Input label="First Name" value={form.firstName} onChange={v=>set("firstName",v)} required/>
              <Input label="Last Name" value={form.lastName} onChange={v=>set("lastName",v)} required/>
            </div>
            <Input label="Email" type="email" value={form.email} onChange={v=>set("email",v)} required/>
            <Input label="Phone" value={form.phone} onChange={v=>set("phone",v)} required/>
            <Input label="Date of Birth" type="date" value={form.dob} onChange={v=>set("dob",v)}/>
            <Input label="Address" value={form.address} onChange={v=>set("address",v)} placeholder="Full address"/>
          </>}
          {step===2 && <>
            <Select label="Role" value={form.role} onChange={v=>set("role",v)} options={["RGN","RMN","HCA","Senior Carer"]} required/>
            <Input label="NMC/PIN Number (if applicable)" value={form.pin} onChange={v=>set("pin",v)} placeholder="e.g. 12A3456"/>
            <Input label="DBS Issue Date" type="date" value={form.dbsDate} onChange={v=>set("dbsDate",v)}/>
            <Input label="Last Mandatory Training Date" type="date" value={form.trainingDate} onChange={v=>set("trainingDate",v)}/>
            <div style={{borderTop:`1px solid ${T.border}`,paddingTop:16,marginTop:4}}>
              <div style={{fontSize:12,fontWeight:560,color:T.text,marginBottom:12}}>Right to Work</div>
              <div style={{marginBottom:12}}>
                <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:8}}>RTW Document Type *</label>
                <select value={form.rtwType||"pending"} onChange={e=>set("rtwType",e.target.value)}
                  style={{width:"100%",padding:"10px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:FONT,color:T.text,background:T.white}}>
                  {RTW_TYPES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                {(()=>{
                  const selType = RTW_TYPES.find(t=>t.value===(form.rtwType||"pending"));
                  if(!selType||selType.value==="pending") return null;
                  return <div style={{marginTop:6,padding:"8px 12px",background:selType.restricted?T.purpleBg:selType.restricted===false?T.greenBg:T.raised,borderRadius:8,fontSize:12,color:selType.restricted?T.purple:selType.restricted===false?T.green:T.muted}}>
                    {selType.restricted&&""}{selType.restricted===false&&""}{selType.desc}
                    {selType.restricted&&<strong> 20hr/week restriction will be applied.</strong>}
                  </div>;
                })()}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <Input label="Reference / Document Number" value={form.rtwRef||""} onChange={v=>set("rtwRef",v)} placeholder="e.g. share code, BRP no."/>
                <Input label="RTW Expiry Date" type="date" value={form.rtwExpiry||""} onChange={v=>set("rtwExpiry",v)}/>
              </div>
            </div>
            <Alert type="info">All credential dates will need to be verified by the neutral vendor before this worker can be placed on shifts.</Alert>
          </>}
          {step===3 && <>
            <p style={{fontSize:13,color:T.muted,marginBottom:16,lineHeight:1.6}}>Upload required compliance documents. The neutral vendor will verify these before activating the worker.</p>
            {[{label:"DBS Certificate",req:true},{label:"Proof of ID (Passport/Driving Licence)",req:true},{label:"NMC Certificate (if applicable)",req:false},{label:"Mandatory Training Certificate",req:true},{label:"Right to Work documentation",req:true}].map((doc,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",border:`1.5px dashed ${T.border}`,borderRadius:8,marginBottom:8,cursor:"pointer",background:T.raised}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:T.text}}>{doc.label}{doc.req&&<span style={{color:T.red}}> *</span>}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:2}}>Click to upload PDF, JPG or PNG (max 5MB)</div>
                </div>
                <Btn small variant="secondary" onClick={()=>alert(`Upload started for "${doc.label}". Select a PDF, JPG or PNG file.`)}>Upload</Btn>
              </div>
            ))}
          </>}
          {step===4 && <>
            <Alert type="success">Ready to register <strong>{form.firstName||"this"} {form.lastName||"worker"}</strong> as a <strong>{form.role}</strong>.</Alert>
            <div style={{background:T.raised,borderRadius:8,padding:14,marginBottom:16}}>
              {[["Full Name",`${form.firstName} ${form.lastName}`||"—"],["Email",form.email||"—"],["Phone",form.phone||"—"],["Role",form.role],["NMC/PIN",form.pin||"N/A"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}>
                  <span style={{color:T.muted}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
            <Alert type="info">After registration, Nexus RPO will review uploaded documents (typically within 1 working day) before activating this worker.</Alert>
          </>}
          <div style={{display:"flex",gap:10,justifyContent:"space-between",marginTop:16}}>
            <div>{step>1 && <Btn variant="secondary" onClick={()=>setStep(s=>s-1)}>← Back</Btn>}</div>
            <Btn onClick={()=>setStep(s=>s+1)}>{step<4?"Continue →":"Submit Registration →"}</Btn>
          </div>
        </Card>
      </div>
    </Page>
  );
};
