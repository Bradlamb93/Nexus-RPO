import { useState } from "react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { Input } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { INIT_RATE_UPLIFTS } from "../../data/rates.js";
import { cap } from "../../lib/format.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── RATE UPLIFT MANAGER ─────────────────────────────────────────────────────── */
export const RateUpliftManager = ({user,rateUplifts,setRateUplifts}) => {
  const [uplifts,setLocal]=useState(rateUplifts||INIT_RATE_UPLIFTS);
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({role:"RGN",current:"",requested:"",reason:""});
  const isAdmin=user?.role==="admin";
  const isAgency=user?.role==="agency";
  const respond=(id,decision)=>setLocal(u=>u.map(x=>x.id===id?{...x,status:decision,respondedDate:"2026-03-10",respondedBy:user.name}:x));
  const submit=()=>{
    const nu={id:`ru${uplifts.length+1}`,agency:"First Choice Nursing",role:form.role,current:parseFloat(form.current),requested:parseFloat(form.requested),reason:form.reason,status:"pending",submittedDate:"2026-03-10",respondedDate:null,respondedBy:null,notes:""};
    setLocal(u=>[nu,...u]);setShowForm(false);setForm({role:"RGN",current:"",requested:"",reason:""});
  };
  const statusColor={pending:T.amberText,approved:T.green,rejected:T.red};
  const statusBg={pending:T.amberBg,approved:T.greenBg,rejected:T.redBg};
  return (
    <Page title={isAdmin?"Rate Uplift Requests":"Rate Uplift Requests"} sub={isAdmin?"Review and approve agency rate change requests":"Submit a rate change request to Nexus RPO"} icon="trendingUp">
      {isAgency&&(
        <div style={{marginBottom:16}}>
          {showForm?(
            <Card style={{padding:20}}>
              <CardHead title="New Rate Request" icon="plus"/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
                <div><label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,marginBottom:4}}>Role</label>
                  <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} style={{width:"100%",padding:"8px 10px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:12,fontFamily:FONT,outline:"none"}}>
                    {["RGN","RMN","HCA","Senior Carer"].map(r=><option key={r}>{r}</option>)}
                  </select>
                </div>
                <Input label="Current Rate (£/hr)" type="number" value={form.current} onChange={v=>setForm(f=>({...f,current:v}))}/>
                <Input label="Requested Rate (£/hr)" type="number" value={form.requested} onChange={v=>setForm(f=>({...f,requested:v}))}/>
              </div>
              <Input label="Business Justification" value={form.reason} onChange={v=>setForm(f=>({...f,reason:v}))}/>
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <Btn onClick={submit} disabled={!form.current||!form.requested||!form.reason}>Submit Request</Btn>
                <Btn variant="secondary" onClick={()=>setShowForm(false)}>Cancel</Btn>
              </div>
            </Card>
          ):<Btn onClick={()=>setShowForm(true)}>+ New Rate Request</Btn>}
        </div>
      )}
      <Grid cols={3}>
        <Stat label="Pending"  value={uplifts.filter(u=>u.status==="pending").length}  accent/>
        <Stat label="Approved" value={uplifts.filter(u=>u.status==="approved").length}/>
        <Stat label="Rejected" value={uplifts.filter(u=>u.status==="rejected").length}/>
      </Grid>
      <Card>
        <Table headers={isAdmin?["Agency","Role","Current","Requested","Uplift","Reason","Submitted","Status","Actions"]:["Role","Current","Requested","Reason","Submitted","Status"]}
          rows={uplifts.map(u=>(
            <tr key={u.id} style={{borderBottom:`1px solid ${T.border}`,background:u.status==="pending"?T.amberBg:"transparent"}}>
              {isAdmin&&<Td bold>{u.agency}</Td>}
              <Td><Badge label={u.role} color={T.purple} bg={T.purpleBg}/></Td>
              <Td>£{u.current}{"/hr"}</Td>
              <Td bold>£{u.requested}{"/hr"}</Td>
              <Td><span style={{fontWeight:560,color:T.green}}>+£{(u.requested-u.current).toFixed(2)}</span></Td>
              <Td style={{maxWidth:200,whiteSpace:"normal",fontSize:11,color:T.muted}}>{u.reason}</Td>
              <Td style={{fontSize:11,color:T.muted}}>{u.submittedDate}</Td>
              <Td><span style={{fontSize:11,fontWeight:560,padding:"3px 10px",borderRadius:20,color:statusColor[u.status],background:statusBg[u.status],textTransform:"capitalize"}}>{cap(u.status)}</span></Td>
              {isAdmin&&<Td>{u.status==="pending"&&<div style={{display:"flex",gap:4}}><Btn small onClick={()=>respond(u.id,"approved")}>✓ Approve</Btn><Btn small variant="danger" onClick={()=>respond(u.id,"rejected")}>✕ Reject</Btn></div>}</Td>}
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};
