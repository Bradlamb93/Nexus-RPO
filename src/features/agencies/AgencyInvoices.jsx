import { useState } from "react";
import { SBadge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, Grid, Stat } from "../../components/ui/Card.jsx";
import { Modal } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { INVOICES } from "../../data/finance.js";
import { buildTable, exportHTML } from "../../lib/export.js";
import { T } from "../../theme/tokens.js";

export const AgencyInvoices = () => {
  const [viewInv,setViewInv] = useState(null);
  const myInvoices = INVOICES.filter(i=>i.agency==="First Choice");
  return (
  <Page title="My Invoices" sub="Payment history from Nexus RPO" icon="document">
    {viewInv && (
      <Modal title={`Invoice ${viewInv.id}`} onClose={()=>setViewInv(null)}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {[["Period",viewInv.period],["Shifts",viewInv.shifts],["Amount",`£${viewInv.amount?.toLocaleString()}`],["Due",viewInv.due]].map(([k,v])=>(
            <div key={k} style={{background:T.raised,borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:11,color:T.muted,fontWeight:560,letterSpacing:"-0.006em",marginBottom:3}}>{k}</div>
              <div style={{fontSize:13,fontWeight:600}}>{v}</div>
            </div>
          ))}
        </div>
        <SBadge s={viewInv.status}/>
        <div style={{display:"flex",gap:8,marginTop:14}}>
          <Btn onClick={()=>exportHTML(`Invoice ${viewInv.id}`,`First Choice Nursing · ${viewInv.period}`,buildTable(["Invoice","Period","Shifts","Amount","Due","Status"],[[viewInv.id,viewInv.period,viewInv.shifts,`£${viewInv.amount?.toLocaleString()}`,viewInv.due,viewInv.status.toUpperCase()]]))}>Download PDF</Btn>
          <Btn variant="secondary" onClick={()=>setViewInv(null)}>Close</Btn>
        </div>
      </Modal>
    )}
    <Grid cols={3}>
      <Stat label="Total Earned" value="£53,550" accent/>
      <Stat label="Paid" value="£28,900" sub="Feb 2026"/>
      <Stat label="Pending" value="£12,100" sub="Mar 2026 — due Apr 1"/>
    </Grid>
    <Card>
      <Table
        headers={["Invoice","Period","Shifts","Amount","Due Date","Status","Action"]}
        rows={myInvoices.map(inv=>(
          <tr key={inv.id} style={{borderBottom:`1px solid ${T.border}`}}>
            <Td><span style={{fontFamily:"monospace",fontSize:12,fontWeight:560}}>{inv.id}</span></Td>
            <Td>{inv.period}</Td>
            <Td>{inv.shifts}</Td>
            <Td bold>£{inv.amount.toLocaleString()}</Td>
            <Td>{inv.due}</Td>
            <Td><SBadge s={inv.status}/></Td>
            <Td>
              <div style={{display:"flex",gap:5}}>
                <Btn small variant="secondary" onClick={()=>setViewInv(inv)}>View</Btn>
                <Btn small variant="secondary" onClick={()=>exportHTML(`Invoice ${inv.id}`,`First Choice Nursing · ${inv.period}`,buildTable(["Invoice","Period","Shifts","Amount","Due","Status"],[[inv.id,inv.period,inv.shifts,`£${inv.amount.toLocaleString()}`,inv.due,inv.status.toUpperCase()]]))}>Download</Btn>
              </div>
            </Td>
          </tr>
        ))}
      />
    </Card>
  </Page>
  );
};
