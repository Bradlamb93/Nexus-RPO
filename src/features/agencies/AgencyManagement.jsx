import { useState } from "react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert, Modal, ProgressBar } from "../../components/ui/Feedback.jsx";
import { Input } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { AGENCIES } from "../../data/agencies.js";
import { tierBg, tierColor } from "../../lib/format.js";
import { T } from "../../theme/tokens.js";

/* ─── ADMIN: AGENCIES ────────────────────────────────────────────────────────── */
export const AgencyManagement = ({navigate}) => {
  const [modal,setModal] = useState(false);
  const [profileModal,setProfileModal] = useState(null);
  const [step,setStep] = useState(1);
  const [form,setForm] = useState({name:"",tier:"Tier 1",contact:"",email:"",phone:""});
  const set = (k,v)=>setForm(f=>({...f,[k]:v}));

  return (
    <Page title="Agency Management" sub="Monitor and manage all staffing agencies on the platform" icon="briefcase" action={<Btn onClick={()=>{setModal(true);setStep(1);}}>+ Onboard Agency</Btn>}>
      {profileModal && (
        <Modal title={`Agency Profile — ${profileModal.name}`} onClose={()=>setProfileModal(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            {[["Tier",<Badge label={profileModal.tier} color={tierColor(profileModal.tier)} bg={tierBg(profileModal.tier)}/>],["Contact",profileModal.contact],["Email",profileModal.email],["Shifts Total",profileModal.shifts],["Fill Rate",<span style={{fontWeight:560,color:profileModal.fillRate>=90?T.green:T.yellow}}>{profileModal.fillRate}%</span>],["Avg Response",profileModal.avgResponse],["MTD Spend",`£${profileModal.spend.toLocaleString()}`],["Compliance",`${profileModal.compliance}%`]].map(([k,v])=>(
              <div key={k} style={{background:T.raised,borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:11,color:T.muted,fontWeight:560,letterSpacing:"-0.006em",marginBottom:4}}>{k}</div>
                <div style={{fontSize:13,fontWeight:600}}>{v}</div>
              </div>
            ))}
          </div>
          <ProgressBar value={profileModal.compliance} color={profileModal.compliance>=95?T.green:T.yellow}/>
          <div style={{display:"flex",gap:8,marginTop:16}}>
            <Btn onClick={()=>{setProfileModal(null);navigate&&navigate("workers");}}>View Workers</Btn>
            <Btn variant="secondary" onClick={()=>setProfileModal(null)}>Close</Btn>
          </div>
        </Modal>
      )}
      {modal && (
        <Modal title="Onboard New Agency" onClose={()=>setModal(false)}>
          <div style={{display:"flex",gap:8,marginBottom:20}}>
            {[1,2,3].map(s=>(
              <div key={s} style={{flex:1,height:4,borderRadius:2,background:step>=s?T.amber:T.border}}/>
            ))}
          </div>
          <div style={{fontSize:11,color:T.muted,marginBottom:16,letterSpacing:"-0.006em",fontWeight:560}}>
            Step {step} of 3 — {["Agency Details","Contacts & Access","Review & Confirm"][step-1]}
          </div>
          {step===1 && <>
            <Input label="Agency Name" value={form.name} onChange={v=>set("name",v)} placeholder="e.g. Medway Staffing Ltd" required/>
            <div style={{marginBottom:16}}>
              <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:8}}>Agency Tier</label>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  {v:"Tier 1",title:"Tier 1 — Priority",desc:"First broadcast of all new shifts. Notified immediately when a shift is published."},
                  {v:"Tier 2",title:"Tier 2 — Secondary",desc:"Notified if no Tier 1 agency fills within 30 minutes."},
                  {v:"Tier 3",title:"Tier 3 — Supplementary",desc:"Notified if no Tier 1 or Tier 2 agency fills within 60 minutes. Useful for cover overflow."},
                ].map(opt=>(
                  <label key={opt.v} onClick={()=>set("tier",opt.v)} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 14px",borderRadius:8,border:`1px solid ${form.tier===opt.v?tierColor(opt.v):T.border}`,background:form.tier===opt.v?tierBg(opt.v):T.raised,cursor:"pointer"}}>
                    <input type="radio" checked={form.tier===opt.v} onChange={()=>set("tier",opt.v)} style={{marginTop:2,accentColor:tierColor(opt.v)}}/>
                    <div>
                      <div style={{fontSize:13,fontWeight:560,color:form.tier===opt.v?tierColor(opt.v):T.text}}>{opt.title}</div>
                      <div style={{fontSize:11,color:T.muted,marginTop:2}}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </>}
          {step===2 && <>
            <Input label="Primary Contact" value={form.contact} onChange={v=>set("contact",v)} placeholder="Full name" required/>
            <Input label="Email Address" type="email" value={form.email} onChange={v=>set("email",v)} placeholder="contact@agency.co.uk" required/>
            <Input label="Phone Number" value={form.phone} onChange={v=>set("phone",v)} placeholder="07700 000000"/>
            <Alert type="info">An invite email will be sent to this address to set up their agency portal login.</Alert>
          </>}
          {step===3 && <>
            <Alert type="success">Ready to onboard <strong>{form.name||"this agency"}</strong> as a <strong>{form.tier}</strong> partner.</Alert>
            <div style={{background:T.raised,borderRadius:8,padding:14,marginBottom:16}}>
              {[["Agency",form.name||"—"],["Tier",form.tier],["Contact",form.contact||"—"],["Email",form.email||"—"],["Phone",form.phone||"—"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}>
                  <span style={{color:T.muted}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
                </div>
              ))}
            </div>
          </>}
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            {step>1 && <Btn variant="secondary" onClick={()=>setStep(s=>s-1)}>Back</Btn>}
            {step<3 ? <Btn onClick={()=>setStep(s=>s+1)}>Continue →</Btn> : <Btn onClick={()=>setModal(false)}>Confirm & Send Invite</Btn>}
          </div>
        </Modal>
      )}
      <Grid cols={4}>
        <Stat label="Total Agencies" value={AGENCIES.length} accent/>
        <Stat label="Shifts This Month" value="115" trend="17 vs last month" trendUp={true}/>
        <Stat label="Avg Fill Rate" value="83%" trend="4% MoM" trendUp={true}/>
        <Stat label="Total Spend" value="£75.5k" sub="Budget: £90k"/>
      </Grid>
      <Card>
        <Table
          headers={["Agency","Tier","Contact","Shifts","Fill Rate","Avg Response","Compliance","Spend","Actions"]}
          rows={AGENCIES.map(a=>(
            <tr key={a.id} style={{borderBottom:`1px solid ${T.border}`}}>
              <Td bold>{a.name}</Td>
              <Td><Badge label={a.tier} color={tierColor(a.tier)} bg={tierBg(a.tier)}/></Td>
              <Td><div style={{fontSize:12}}><div style={{fontWeight:600}}>{a.contact}</div><div style={{color:T.muted}}>{a.email}</div></div></Td>
              <Td>{a.shifts}</Td>
              <Td><span style={{fontWeight:560,color:a.fillRate>=90?T.green:T.yellow}}>{a.fillRate}%</span></Td>
              <Td>{a.avgResponse}</Td>
              <Td>
                <div style={{display:"flex",flexDirection:"column",gap:4}}>
                  <ProgressBar value={a.compliance} color={a.compliance>=95?T.green:T.yellow}/>
                  <span style={{fontSize:11,color:T.muted}}>{a.compliance}%</span>
                </div>
              </Td>
              <Td bold>£{a.spend.toLocaleString()}</Td>
              <Td>
                <div style={{display:"flex",gap:5}}>
                  <Btn small variant="secondary" onClick={()=>setProfileModal(a)}>Profile</Btn>
                  <Btn small variant="secondary" onClick={()=>navigate&&navigate("workers")}>Workers</Btn>
                </div>
              </Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};
