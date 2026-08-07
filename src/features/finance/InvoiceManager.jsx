import { useState } from "react";
import { ExportMenu } from "../../components/ExportMenu.jsx";
import { SBadge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert, Modal } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { INVOICES } from "../../data/finance.js";
import { buildTable, exportCSV, exportHTML } from "../../lib/export.js";
import { T } from "../../theme/tokens.js";

/* ─── ADMIN: INVOICES ────────────────────────────────────────────────────────── */
export const InvoiceManager = ({invoices=INVOICES, setInvoices, timesheets=[]}) => {
  const [viewInv, setViewInv] = useState(null);

  const allInvoices = invoices;
  const drafts   = allInvoices.filter(i=>i.status==="draft");
  const live     = allInvoices.filter(i=>i.status!=="draft");
  const paid     = live.filter(i=>i.status==="paid").reduce((a,i)=>a+i.amount,0);
  const pending  = live.filter(i=>i.status==="pending").reduce((a,i)=>a+i.amount,0);
  const overdue  = live.filter(i=>i.status==="overdue").reduce((a,i)=>a+i.amount,0);
  const draftVal = drafts.reduce((a,i)=>a+i.amount,0);

  const finalise = (inv) => {
    const invId = `INV-${String(Math.floor(Math.random()*9000)+1000)}`;
    const today = new Date().toISOString().split("T")[0];
    const due   = new Date(Date.now()+30*24*60*60*1000).toISOString().split("T")[0];
    // Stamp timesheets as invoiced
    if(setInvoices) {
      setInvoices(prev => prev.map(i => i.id===inv.id
        ? {...i, id:invId, status:"pending", issued:today, due, isDraft:false}
        : i
      ));
    }
    setViewInv({...inv, id:invId, issued:today, due});
  };

  const getTimesheets = (inv) => timesheets.filter(t =>
    t.agency===inv.agency && (t.status==="approved"||t.invoiceId===inv.id)
  );

  const statusColors = {draft:{c:T.purple,bg:T.purpleBg},pending:{c:T.yellow,bg:T.yellowBg},paid:{c:T.green,bg:T.greenBg},overdue:{c:T.red,bg:T.redBg}};

  const invExports = [
    {icon:"clipboard",label:"All Invoices — CSV",desc:"Full invoice ledger",fn:()=>exportCSV("fcc-invoices.csv",
      ["Invoice ID","Agency","Period","Shifts","Amount (£)","Issued","Due","Status"],
      live.map(i=>[i.id,i.agency,i.period,i.shifts,i.amount,i.issued,i.due,i.status]))},
    {icon:"pound",label:"Paid Invoices — CSV",desc:"Settled invoices only",fn:()=>exportCSV("fcc-invoices-paid.csv",
      ["Invoice ID","Agency","Period","Amount (£)","Paid Date"],
      live.filter(i=>i.status==="paid").map(i=>[i.id,i.agency,i.period,i.amount,i.due]))},
    {icon:"warning",label:"Overdue Invoices — CSV",desc:"Outstanding overdue",fn:()=>exportCSV("fcc-invoices-overdue.csv",
      ["Invoice ID","Agency","Period","Amount (£)","Due Date"],
      live.filter(i=>i.status==="overdue").map(i=>[i.id,i.agency,i.period,i.amount,i.due]))},
    {icon:"printer",label:"Invoice Ledger — PDF",desc:"Printable HTML report",fn:()=>exportHTML("Invoice Ledger","Nexus RPO — All Invoices",
      buildTable(["Invoice ID","Agency","Period","Shifts","Amount","Due","Status"],
        live.map(i=>[i.id,i.agency,i.period,i.shifts,`£${i.amount.toLocaleString()}`,i.due,i.status.toUpperCase()])))},
  ];

  return (
    <Page title="Invoice Manager" sub="All agency invoices — draft and issued" icon="document" action={<ExportMenu exports={invExports}/>}>

      {/* Invoice detail modal */}
      {viewInv && (
        <Modal title={`Invoice ${viewInv.id}`} onClose={()=>setViewInv(null)}>
          <div style={{background:T.raised,borderRadius:10,padding:"14px 16px",marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div>
                <div style={{fontWeight:600,fontSize:16,color:T.navy,marginBottom:2}}>{viewInv.id}</div>
                <div style={{fontSize:12,color:T.muted}}>{viewInv.agency} · {viewInv.period}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:24,fontWeight:600,color:T.green}}>£{viewInv.amount?.toLocaleString()}</div>
                <div style={{fontSize:11,color:T.muted}}>Due {viewInv.due||"TBC"}</div>
              </div>
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:8}}>Timesheets included</div>
            {getTimesheets(viewInv).map(ts=>(
              <div key={ts.id} style={{display:"flex",justifyContent:"space-between",padding:"8px 12px",borderRadius:8,background:T.greenBg,border:`1px solid ${T.green}33`,marginBottom:5}}>
                <div>
                  <span style={{fontWeight:560,fontSize:12}}>{ts.worker}</span>
                  <span style={{fontSize:11,color:T.muted,marginLeft:8}}>{ts.role} · {ts.date} · {ts.hoursWorked}h</span>
                </div>
                <span style={{fontWeight:600,fontSize:13,color:T.green}}>£{ts.total}</span>
              </div>
            ))}
            {getTimesheets(viewInv).length===0 && <p style={{fontSize:12,color:T.muted}}>No timesheet detail available.</p>}
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="secondary" onClick={()=>setViewInv(null)}>Close</Btn>
            <Btn onClick={()=>exportHTML(`Invoice ${viewInv.id}`,`${viewInv.agency} · ${viewInv.period}`,buildTable(["Worker","Role","Date","Hours","Total"],getTimesheets(viewInv).map(ts=>[ts.worker,ts.role,ts.date,`${ts.hoursWorked}h`,`£${ts.total}`])))}>Download PDF</Btn>
          </div>
        </Modal>
      )}

      {/* Stats */}
      <Grid cols={4}>
        <Stat label="Draft (Awaiting Send)" value={drafts.length} sub={`£${draftVal.toLocaleString()} to send`} accent={drafts.length>0}/>
        <Stat label="Pending Payment" value={`£${pending.toLocaleString()}`} sub={`${live.filter(i=>i.status==="pending").length} invoices`}/>
        <Stat label="Paid" value={`£${paid.toLocaleString()}`} sub={`${live.filter(i=>i.status==="paid").length} invoices`}/>
        <Stat label="Overdue" value={`£${overdue.toLocaleString()}`} sub={overdue>0?"Immediate action":"All clear"} accent={overdue>0}/>
      </Grid>

      {overdue>0 && <Alert type="error">{live.filter(i=>i.status==="overdue").length} invoice{live.filter(i=>i.status==="overdue").length>1?"s are":" is"} overdue.</Alert>}

      {/* Draft invoices — auto-grouped from approved timesheets */}
      {drafts.length>0 && (
        <Card style={{marginBottom:18,border:`2px solid ${T.purple}44`}}>
          <CardHead title="Draft Invoices" icon="receipt" sub="Auto-grouped from approved timesheets — review and send to agencies"/>
          <div style={{padding:"0 14px 14px"}}>
            {drafts.map(inv=>{
              const ts = getTimesheets(inv);
              return (
                <div key={inv.id} style={{padding:"16px 18px",background:T.purpleBg,borderRadius:10,border:`1px solid ${T.purple}44`,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10,marginBottom:12}}>
                    <div>
                      <div style={{fontWeight:600,fontSize:15,color:T.navy,marginBottom:3}}>{inv.agency}</div>
                      <div style={{fontSize:12,color:T.muted}}>{inv.shifts} timesheet{inv.shifts!==1?"s":""} · {inv.period} · All care-home approved</div>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:22,fontWeight:600,color:T.green}}>£{inv.amount.toLocaleString()}</div>
                        <div style={{fontSize:11,color:T.muted}}>Total value</div>
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        <Btn small variant="secondary" onClick={()=>setViewInv(inv)}>View Details</Btn>
                        <Btn small onClick={()=>finalise(inv)}>Finalise & Send →</Btn>
                      </div>
                    </div>
                  </div>
                  {/* Timesheet breakdown */}
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {ts.slice(0,5).map(t=>(
                      <span key={t.id} style={{fontSize:10,fontWeight:600,padding:"3px 9px",borderRadius:20,background:T.white,border:`1px solid ${T.border}`,color:T.text}}>
                        {t.worker} · {t.role} · {t.date} · £{t.total}
                      </span>
                    ))}
                    {ts.length>5 && <span style={{fontSize:10,color:T.muted,padding:"3px 9px"}}>+{ts.length-5} more</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Sent invoices */}
      <Card>
        <CardHead title="Sent Invoices" sub="All issued invoices" icon="clipboard"/>
        <Table
          headers={["Invoice","Agency","Period","Timesheets","Amount","Issued","Due","Status","Actions"]}
          empty="No sent invoices yet"
          rows={live.map(inv=>(
            <tr key={inv.id} style={{borderBottom:`1px solid ${T.border}`,background:inv.status==="overdue"?T.redBg:"transparent"}}>
              <Td><span style={{fontFamily:"monospace",fontSize:12,fontWeight:560,color:T.navy}}>{inv.id}</span></Td>
              <Td bold>{inv.agency}</Td>
              <Td>{inv.period}</Td>
              <Td>{inv.shifts}</Td>
              <Td bold>£{inv.amount.toLocaleString()}</Td>
              <Td>{inv.issued}</Td>
              <Td>{inv.due}</Td>
              <Td><SBadge s={inv.status}/></Td>
              <Td>
                <div style={{display:"flex",gap:5}}>
                  <Btn small variant="secondary" onClick={()=>setViewInv(inv)}>View</Btn>
                  <Btn small variant="secondary" onClick={()=>exportHTML(`Invoice ${inv.id}`,`${inv.agency} · ${inv.period}`,buildTable(["Invoice","Agency","Period","Timesheets","Amount","Due","Status"],[[inv.id,inv.agency,inv.period,inv.shifts,`£${inv.amount.toLocaleString()}`,inv.due,inv.status.toUpperCase()]]))}>PDF</Btn>
                  {inv.status==="overdue" && <Btn small variant="danger" onClick={()=>alert(`Chase email sent to ${inv.agency} for invoice ${inv.id} (£${inv.amount.toLocaleString()} overdue since ${inv.due}).`)}>Chase</Btn>}
                </div>
              </Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};
