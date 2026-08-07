import { useState } from "react";
import { ExportMenu } from "../../components/ExportMenu.jsx";
import { Icon } from "../../components/Icon.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Btn, Pill } from "../../components/ui/Button.jsx";
import { Card, Grid, Stat } from "../../components/ui/Card.jsx";
import { Modal } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { TsBadge } from "./TimesheetStatus.jsx";
import { buildTable, exportCSV, exportHTML } from "../../lib/export.js";
import { T } from "../../theme/tokens.js";

/* ─── ADMIN: TIMESHEETS ──────────────────────────────────────────────────────── */
export const AdminTimesheets = ({timesheets,setTimesheets,invoices,setInvoices}) => {
  const [filterAgency,setFilterAgency]   = useState("All");
  const [filterStatus,setFilterStatus]   = useState("all");
  const [expandedInv,setExpandedInv]     = useState(null);
  const [confirmedInv,setConfirmedInv]   = useState(null);

  const approved  = timesheets.filter(t=>t.status==="approved");
  const pending   = timesheets.filter(t=>t.status==="pending");
  const disputed  = timesheets.filter(t=>t.status==="disputed");
  const invoiced  = timesheets.filter(t=>t.status==="invoiced");

  const agencies = ["All",...[...new Set(timesheets.map(t=>t.agency))]];
  const filtered = timesheets
    .filter(t=>filterAgency==="All"||t.agency===filterAgency)
    .filter(t=>filterStatus==="all"||t.status===filterStatus);

  // Group ALL approved timesheets by agency into draft invoice batches
  const draftGroups = [...new Set(approved.map(t=>t.agency))].map(agency => {
    const sheets = approved.filter(t=>t.agency===agency);
    const total  = sheets.reduce((a,t)=>a+t.total,0);
    // Find existing draft invoice for this agency or generate an id
    const existing = invoices?.find(i=>i.agency===agency&&i.status==="draft"&&i.isDraft);
    return { agency, sheets, total, draftId: existing?.id || `DRAFT-${agency.replace(/\s+/g,"-")}` };
  });

  const finaliseInvoice = (group) => {
    const invId   = `INV-${String(Math.floor(Math.random()*900)+100).padStart(4,"0")}`;
    const today   = new Date().toISOString().split("T")[0];
    const dueDate = new Date(); dueDate.setDate(dueDate.getDate()+30);
    const due     = dueDate.toISOString().split("T")[0];
    const period  = new Date().toLocaleString("en-GB",{month:"long",year:"numeric"});

    // Stamp all approved timesheets for this agency as invoiced
    setTimesheets(p=>p.map(t=>
      t.agency===group.agency&&t.status==="approved"
        ? {...t, status:"invoiced", invoiceId:invId}
        : t
    ));

    // Replace draft with finalised invoice
    if(setInvoices) {
      setInvoices(p=>[
        ...p.filter(i=>!(i.agency===group.agency&&i.status==="draft"&&i.isDraft)),
        { id:invId, agency:group.agency, period, shifts:group.sheets.length,
          amount:group.total, status:"pending", due, issued:today, isDraft:false }
      ]);
    }
    setConfirmedInv({id:invId, agency:group.agency, count:group.sheets.length, total:group.total, due});
    setExpandedInv(null);
  };

  const tsExports = [
    {icon:"clipboard",label:"All Timesheets — CSV",fn:()=>exportCSV("fcc-timesheets.csv",
      ["ID","Agency","Location","Worker","Role","Date","Hours","Rate (£)","Total (£)","Status"],
      timesheets.map(t=>[t.id,t.agency,t.carehome,t.worker,t.role,t.date,t.hoursWorked,t.rate,t.total,t.status]))},
    {icon:"checkCircle",label:"Approved Timesheets — CSV",fn:()=>exportCSV("fcc-timesheets-approved.csv",
      ["ID","Agency","Location","Worker","Role","Date","Hours","Total (£)","Approved By"],
      timesheets.filter(t=>t.status==="approved").map(t=>[t.id,t.agency,t.carehome,t.worker,t.role,t.date,t.hoursWorked,t.total,t.approvedBy]))},
    {icon:"warning",label:"Disputed Timesheets — CSV",fn:()=>exportCSV("fcc-timesheets-disputed.csv",
      ["ID","Agency","Location","Worker","Role","Date","Hours","Total (£)","Dispute Reason"],
      timesheets.filter(t=>t.status==="disputed").map(t=>[t.id,t.agency,t.carehome,t.worker,t.role,t.date,t.hoursWorked,t.total,t.disputeReason]))},
    {icon:"printer",label:"Full Timesheet Report — PDF",fn:()=>exportHTML("Timesheet Report","All timesheets — Nexus RPO",
      buildTable(["ID","Agency","Location","Worker","Role","Date","Hours","Total","Status"],
        timesheets.map(t=>[t.id,t.agency,t.carehome,t.worker,t.role,t.date,t.hoursWorked,`£${t.total}`,t.status.toUpperCase()])))},
  ];

  return (
    <Page title="Timesheets" sub="Approval pipeline — approved timesheets are auto-grouped into invoices by agency" icon="clock" action={<ExportMenu exports={tsExports}/>}>

      {/* Confirmation modal */}
      {confirmedInv && (
        <Modal title="Invoice Finalised" onClose={()=>setConfirmedInv(null)}>
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{marginBottom:12,display:"flex",justifyContent:"center",color:T.ghost}}><Icon name="receipt" size={36} stroke={1.5}/></div>
            <div style={{fontSize:22,fontWeight:600,color:T.navy,marginBottom:4}}>{confirmedInv.id}</div>
            <div style={{fontSize:14,color:T.muted,marginBottom:20}}>{confirmedInv.agency} · {confirmedInv.count} timesheets</div>
            <div style={{fontSize:36,fontWeight:600,color:T.green,marginBottom:6}}>£{confirmedInv.total.toLocaleString()}</div>
            <div style={{fontSize:12,color:T.muted,marginBottom:24}}>Payment due {confirmedInv.due} · Invoice sent to {confirmedInv.agency}</div>
            <div style={{display:"flex",gap:10,justifyContent:"center"}}>
              <Btn onClick={()=>exportHTML(confirmedInv.id,`${confirmedInv.agency} · Invoice`,buildTable(["Invoice ID","Agency","Timesheets","Total","Due"],[[confirmedInv.id,confirmedInv.agency,confirmedInv.count,`£${confirmedInv.total.toLocaleString()}`,confirmedInv.due]]))}>Download PDF</Btn>
              <Btn variant="secondary" onClick={()=>setConfirmedInv(null)}>Close</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Stats */}
      <Grid cols={4}>
        <Stat label="Pending Approval" value={pending.length} sub="Awaiting care home" accent/>
        <Stat label="Grouped & Ready" value={approved.length} sub={`${draftGroups.length} draft invoice${draftGroups.length!==1?"s":""}`}/>
        <Stat label="Disputed" value={disputed.length} sub={disputed.length>0?"Needs resolution":"All clear"}/>
        <Stat label="Invoiceable Value" value={`£${approved.reduce((a,t)=>a+t.total,0).toLocaleString()}`} sub="Ready to finalise"/>
      </Grid>

      {/* Draft invoice groups — auto-built from approvals */}
      {draftGroups.length>0 && (
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
            <h3 style={{fontWeight:600,fontSize:14,color:T.text}}>Draft Invoices</h3>
            <span style={{fontSize:11,color:T.muted,background:T.sunken,padding:"2px 8px",borderRadius:20,fontWeight:600}}>
              Auto-grouped when care homes approve timesheets
            </span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {draftGroups.map(group=>{
              const isExpanded = expandedInv===group.agency;
              return (
                <Card key={group.agency} style={{overflow:"hidden",border:`1px solid ${T.green}55`}}>
                  {/* Group header */}
                  <div style={{padding:"16px 20px",display:"flex",alignItems:"center",gap:14,flexWrap:"wrap",background:T.greenBg}}>
                    <div style={{flex:1,minWidth:200}}>
                      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                        <span style={{fontWeight:600,fontSize:15,color:T.navy}}>{group.agency}</span>
                        <Badge label="Draft" color={T.green} bg={T.greenBg} dot/>
                        <span style={{fontSize:11,color:T.muted,background:"#e8f5e9",padding:"2px 8px",borderRadius:20,fontWeight:600}}>
                          {group.sheets.length} approved timesheet{group.sheets.length!==1?"s":""}
                        </span>
                      </div>
                      <div style={{fontSize:12,color:T.muted}}>
                        {[...new Set(group.sheets.map(t=>t.carehome))].join(" · ")}
                        {" · "}{group.sheets.reduce((a,t)=>a+t.hoursWorked,0).toFixed(1)} total hours
                      </div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:14,flexShrink:0}}>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:24,fontWeight:600,color:T.green}}>£{group.total.toLocaleString()}</div>
                        <div style={{fontSize:11,color:T.muted}}>Total value</div>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <Btn small variant="secondary" onClick={()=>setExpandedInv(isExpanded?null:group.agency)}>
                          {isExpanded?"Hide":"View"} breakdown
                        </Btn>
                        <Btn small onClick={()=>finaliseInvoice(group)}>Finalise Invoice →</Btn>
                      </div>
                    </div>
                  </div>

                  {/* Expanded breakdown */}
                  {isExpanded && (
                    <div style={{borderTop:`1px solid ${T.border}`}}>
                      <table style={{width:"100%",borderCollapse:"collapse"}}>
                        <thead>
                          <tr style={{background:T.raised}}>
                            {["Timesheet","Worker","Role","Care Home","Date","Hours","Rate","Total","Approved By"].map(h=>(
                              <th key={h} style={{padding:"8px 12px",fontSize:10,fontWeight:560,color:T.muted,textAlign:"left",letterSpacing:"-0.006em",borderBottom:`1px solid ${T.border}`}}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {group.sheets.map(ts=>(
                            <tr key={ts.id} style={{borderBottom:`1px solid ${T.border}`}}>
                              <Td><span style={{fontFamily:"monospace",fontSize:11,fontWeight:560,color:T.navy}}>{ts.id}</span></Td>
                              <Td bold>{ts.worker}</Td>
                              <Td><Badge label={ts.role} color={T.purple} bg={T.purpleBg}/></Td>
                              <Td>{ts.carehome}</Td>
                              <Td>{ts.date}</Td>
                              <Td>{ts.hoursWorked}h</Td>
                              <Td>£{ts.rate}{"/hr"}</Td>
                              <Td><span style={{fontWeight:600,color:T.green}}>£{ts.total.toLocaleString()}</span></Td>
                              <Td><span style={{fontSize:11,color:T.green}}>✓ {ts.approvedBy}</span></Td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr style={{background:T.greenBg,borderTop:`2px solid ${T.green}44`}}>
                            <td colSpan={7} style={{padding:"12px 14px",fontWeight:600,fontSize:13,color:T.text}}>Total</td>
                            <td style={{padding:"12px 14px",fontWeight:600,fontSize:16,color:T.green}}>£{group.total.toLocaleString()}</td>
                            <td/>
                          </tr>
                        </tfoot>
                      </table>
                      <div style={{padding:"12px 16px",display:"flex",justifyContent:"flex-end",background:T.raised,borderTop:`1px solid ${T.border}`}}>
                        <Btn onClick={()=>finaliseInvoice(group)}>Finalise & Send Invoice →</Btn>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {draftGroups.length===0 && approved.length===0 && (
        <Card style={{padding:28,marginBottom:18,background:T.greenBg,border:`1px solid ${T.green}44`}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:28}}><Icon name="checkCircle" size={15}/></span>
            <div>
              <div style={{fontWeight:560,fontSize:14,color:T.green}}>All caught up</div>
              <div style={{fontSize:12,color:T.muted}}>No approved timesheets waiting — invoices will appear here automatically as care homes approve hours.</div>
            </div>
          </div>
        </Card>
      )}

      {/* All timesheets table with filters */}
      <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:12,color:T.muted,fontWeight:600,marginRight:4}}>Agency:</span>
        {agencies.map(a=><Pill key={a} label={a} active={filterAgency===a} onClick={()=>setFilterAgency(a)}/>)}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:12,color:T.muted,fontWeight:600,marginRight:4}}>Status:</span>
        {["all","pending","approved","disputed","invoiced"].map(s=><Pill key={s} label={s==="all"?"All":s.charAt(0).toUpperCase()+s.slice(1)} active={filterStatus===s} onClick={()=>setFilterStatus(s)}/>)}
      </div>

      <Card>
        <Table
          headers={["ID","Agency","Worker","Care Home","Date","Hours","Rate","Total","Status","Approved By","Invoice"]}
          rows={filtered.map(ts=>(
            <tr key={ts.id} style={{borderBottom:`1px solid ${T.border}`,background:ts.status==="approved"?T.greenBg:ts.status==="disputed"?T.redBg:ts.status==="invoiced"?T.amberBg:"transparent"}}>
              <Td><span style={{fontFamily:"monospace",fontSize:11,fontWeight:560}}>{ts.id}</span></Td>
              <Td><span style={{fontSize:12,fontWeight:600}}>{ts.agency}</span></Td>
              <Td bold>{ts.worker}</Td>
              <Td>{ts.carehome}</Td>
              <Td>{ts.date}</Td>
              <Td>{ts.hoursWorked}h</Td>
              <Td>£{ts.rate}{"/hr"}</Td>
              <Td><span style={{fontWeight:600,color:T.green}}>£{ts.total.toLocaleString()}</span></Td>
              <Td><TsBadge s={ts.status}/></Td>
              <Td><span style={{fontSize:11,color:ts.approvedBy?T.green:T.muted}}>{ts.approvedBy||"Pending"}</span></Td>
              <Td>
                {ts.invoiceId
                  ? <span style={{fontFamily:"monospace",fontSize:11,color:T.amber,fontWeight:560}}>{ts.invoiceId}</span>
                  : ts.status==="approved"
                    ? <span style={{fontSize:10,color:T.green,fontWeight:560,background:T.greenBg,padding:"2px 7px",borderRadius:20}}>In draft</span>
                    : <span style={{fontSize:11,color:T.muted}}>—</span>}
              </Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};
