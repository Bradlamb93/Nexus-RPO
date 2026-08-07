import { useState } from "react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert, Modal } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { TsBadge } from "./TimesheetStatus.jsx";
import { FONT, T } from "../../theme/tokens.js";

/* ─── CARE HOME: TIMESHEETS ──────────────────────────────────────────────────── */
export const CareHomeTimesheets = ({timesheets,setTimesheets,user,invoices,setInvoices}) => {
  const approverName = user?.name || "Karen Hughes";
  const mySite = user?.org || "Sunrise Care";

  const autoGroupInvoice = (ts, updatedTimesheets) => {
    if(!setInvoices) return;
    // Build draft invoice key: agency + current month
    const month = new Date().toLocaleString("en-GB",{month:"long",year:"numeric"});
    const draftId = `DRAFT-${ts.agency.replace(/\s+/g,"-")}-${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}`;
    // All approved timesheets for this agency (including the one just approved)
    const agencyApproved = updatedTimesheets.filter(t => t.agency===ts.agency && (t.status==="approved"||t.id===ts.id) && !t.invoiceId);
    const total = agencyApproved.reduce((a,t)=>a+t.total,0);
    setInvoices(prev => {
      const exists = prev.find(i=>i.id===draftId);
      if(exists) {
        return prev.map(i=>i.id===draftId ? {...i, shifts:agencyApproved.length, amount:total} : i);
      }
      return [...prev, {
        id:draftId,
        agency:ts.agency,
        period:month,
        shifts:agencyApproved.length,
        amount:total,
        status:"draft",
        due:"—",
        issued:"—",
        isDraft:true,
      }];
    });
  };

  const approve = (id) => {
    const ts = timesheets.find(t=>t.id===id);
    if(!ts) return;
    const updated = timesheets.map(t=>t.id===id?{...t,status:"approved",approvedBy:approverName}:t);
    setTimesheets(updated);
    autoGroupInvoice({...ts,status:"approved"}, updated);
  };

  const [disputeModal,setDisputeModal]=useState(null);
  const [disputeText,setDisputeText]=useState("");

  const mySheets = timesheets.filter(t=>t.carehome===mySite);
  const pending = mySheets.filter(t=>t.status==="pending");
  const disputeSubmit = () => {
    if(!disputeText.trim())return;
    setTimesheets(p=>p.map(t=>t.id===disputeModal.id?{...t,status:"disputed",disputeReason:disputeText}:t));
    setDisputeModal(null); setDisputeText("");
  };

  return (
    <Page title="Timesheets" sub="Review and approve agency-submitted hours before invoices are generated" icon="clock">
      {disputeModal&&(
        <Modal title="Raise a Dispute" onClose={()=>setDisputeModal(null)}>
          <div style={{background:T.raised,borderRadius:8,padding:"12px 14px",marginBottom:14,fontSize:13}}>
            <div style={{fontWeight:560,marginBottom:4}}>{disputeModal.worker} — {disputeModal.role}</div>
            <div style={{color:T.muted}}>{disputeModal.date} · {disputeModal.time} · {disputeModal.hoursWorked}hrs · £{disputeModal.total}</div>
          </div>
          <div style={{marginBottom:14}}>
            <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Reason for Dispute *</label>
            <textarea value={disputeText} onChange={e=>setDisputeText(e.target.value)} rows={3} placeholder="e.g. Worker arrived 45 minutes late, hours should be 11.25 not 12…" style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${T.red}`,fontSize:13,fontFamily:FONT,resize:"vertical",outline:"none"}}/>
          </div>
          <Alert type="warn">The agency will be notified and asked to correct and resubmit the timesheet.</Alert>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="secondary" onClick={()=>setDisputeModal(null)}>Cancel</Btn>
            <Btn onClick={disputeSubmit} style={{background:T.red}}>Raise Dispute</Btn>
          </div>
        </Modal>
      )}

      {pending.length>0&&(
        <div style={{background:`linear-gradient(135deg,${T.blue}18,${T.blueBg})`,borderRadius:14,padding:"14px 18px",marginBottom:18,border:`1px solid ${T.blue}44`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
          <div>
            <div style={{fontWeight:560,fontSize:14,color:T.blue,marginBottom:4}}>{pending.length} timesheet{pending.length>1?"s":""}  awaiting your approval</div>
            <div style={{fontSize:13,color:T.text}}>Review hours submitted by agencies. Approving will trigger invoice generation. Disputes are sent back to the agency.</div>
          </div>
          <Badge label={`£${pending.reduce((a,t)=>a+t.total,0).toLocaleString()} to approve`} color={T.blue} bg={T.blueBg}/>
        </div>
      )}

      <Grid cols={4}>
        <Stat label="Awaiting Approval" value={pending.length} sub="Your action needed" accent/>
        <Stat label="Approved (MTD)" value={mySheets.filter(t=>t.status==="approved"||t.status==="invoiced").length}/>
        <Stat label="Disputed" value={mySheets.filter(t=>t.status==="disputed").length}/>
        <Stat label="Total Approved Value" value={`£${mySheets.filter(t=>["approved","invoiced"].includes(t.status)).reduce((a,t)=>a+t.total,0).toLocaleString()}`}/>
      </Grid>

      {pending.length>0&&(
        <Card style={{marginBottom:18,border:`2px solid ${T.blue}55`}}>
          <CardHead title="Pending Your Approval" icon="hourglass" sub="Review each entry carefully before approving"/>
          {pending.map(ts=>(
            <div key={ts.id} style={{margin:"0 14px 12px",padding:"16px 18px",background:"#f8fbff",borderRadius:10,border:`1px solid ${T.blue}33`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12,flexWrap:"wrap",gap:8}}>
                <div>
                  <div style={{fontWeight:560,fontSize:14,color:T.text,marginBottom:3}}>{ts.worker} <span style={{color:T.muted,fontWeight:400}}>·</span> <Badge label={ts.role} color={T.purple} bg={T.purpleBg}/></div>
                  <div style={{fontSize:12,color:T.muted}}>{ts.agency} · {ts.date} · {ts.time}</div>
                </div>
                <span style={{fontFamily:"monospace",fontSize:11,color:T.muted,background:"#eef2f7",padding:"3px 8px",borderRadius:5}}>{ts.id}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:14}}>
                {[["Hours Worked",`${ts.hoursWorked}hrs`],["Break",`${ts.breakMins} mins`],["Rate",`£${ts.rate}{"/hr"}`],["Total Payable",`£${ts.total.toLocaleString()}`]].map(([k,v],i)=>(
                  <div key={i} style={{background:T.white,borderRadius:8,padding:"10px 12px",border:`1px solid ${T.border}`,textAlign:"center"}}>
                    <div style={{fontSize:10,color:T.muted,fontWeight:560,letterSpacing:"-0.006em",marginBottom:4}}>{k}</div>
                    <div style={{fontSize:i===3?16:14,fontWeight:600,color:i===3?T.green:T.text}}>{v}</div>
                  </div>
                ))}
              </div>
              {ts.disputeReason&&<Alert type="warn" style={{marginBottom:10}}>{ts.disputeReason}</Alert>}
              <div style={{display:"flex",gap:10}}>
                <Btn onClick={()=>approve(ts.id)}>✓ Approve Hours</Btn>
                <Btn variant="secondary" onClick={()=>setDisputeModal(ts)} style={{borderColor:T.red,color:T.red}}>✕ Dispute</Btn>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Card>
        <CardHead title="All Timesheets" sub="Full history for your care home"/>
        <Table
          headers={["ID","Worker","Agency","Date","Hours","Total","Status","Approved By","Action"]}
          rows={mySheets.map(ts=>(
            <tr key={ts.id} style={{borderBottom:`1px solid ${T.border}`,background:ts.status==="disputed"?T.redBg:ts.status==="approved"?T.greenBg:"transparent"}}>
              <Td><span style={{fontFamily:"monospace",fontSize:11,fontWeight:560}}>{ts.id}</span></Td>
              <Td bold>{ts.worker}</Td>
              <Td><span style={{fontSize:12,color:T.muted}}>{ts.agency}</span></Td>
              <Td>{ts.date}</Td>
              <Td bold>{ts.hoursWorked}hrs</Td>
              <Td><span style={{fontWeight:600,color:T.green}}>£{ts.total.toLocaleString()}</span></Td>
              <Td><TsBadge s={ts.status}/></Td>
              <Td><span style={{fontSize:12,color:T.muted}}>{ts.approvedBy||"—"}</span></Td>
              <Td>
                {ts.status==="pending"?(
                  <div style={{display:"flex",gap:5}}>
                    <Btn small onClick={()=>approve(ts.id)}>Approve</Btn>
                    <Btn small variant="secondary" onClick={()=>setDisputeModal(ts)}>Dispute</Btn>
                  </div>
                ):<Btn small variant="secondary" onClick={()=>alert(`Timesheet ${ts.id}\n${ts.worker} — ${ts.carehome}\n${ts.date} · ${ts.hoursWorked}h @ £${ts.rate}{"/hr"} = £${ts.total}\nStatus: ${ts.status}${ts.approvedBy?'\nApproved by: '+ts.approvedBy:''}`)}>View</Btn>}
              </Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};
