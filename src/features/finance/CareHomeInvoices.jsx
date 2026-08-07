import { useState } from "react";
import { SBadge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Alert, Modal } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { INVOICES } from "../../data/finance.js";
import { buildTable, exportHTML } from "../../lib/export.js";
import { T } from "../../theme/tokens.js";

export const CareHomeInvoices = () => {
  const [viewInv, setViewInv] = useState(null);
  const myInvoices = INVOICES.filter(i=>["First Choice","ProCare"].includes(i.agency));
  return (
  <Page title="Invoices" sub="Your billing history from Nexus RPO" icon="document">
    {viewInv && (
      <Modal title={`Invoice ${viewInv.id}`} onClose={()=>setViewInv(null)}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
          {[["Agency",viewInv.agency],["Period",viewInv.period],["Shifts",viewInv.shifts],["Amount",`£${viewInv.amount?.toLocaleString()}`],["Issued",viewInv.issued||"—"],["Due",viewInv.due]].map(([k,v])=>(
            <div key={k} style={{background:T.raised,borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:11,color:T.muted,fontWeight:560,letterSpacing:"-0.006em",marginBottom:3}}>{k}</div>
              <div style={{fontSize:13,fontWeight:600}}>{v}</div>
            </div>
          ))}
        </div>
        <SBadge s={viewInv.status}/>
        <div style={{display:"flex",gap:8,marginTop:14}}>
          <Btn onClick={()=>exportHTML(`Invoice ${viewInv.id}`,`${viewInv.agency} · ${viewInv.period}`,buildTable(["Invoice","Agency","Period","Shifts","Amount","Due","Status"],[[viewInv.id,viewInv.agency,viewInv.period,viewInv.shifts,`£${viewInv.amount?.toLocaleString()}`,viewInv.due,viewInv.status.toUpperCase()]]))}>Download PDF</Btn>
          <Btn variant="secondary" onClick={()=>setViewInv(null)}>Close</Btn>
        </div>
      </Modal>
    )}
    <Alert type="info">Invoices are generated automatically at the end of each billing period. Contact your coordinator for queries.</Alert>
    <Card>
      <Table
        headers={["Invoice","Period","Shifts Used","Amount","Due Date","Status","Action"]}
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
                <Btn small variant="secondary" onClick={()=>exportHTML(`Invoice ${inv.id}`,`${inv.agency} · ${inv.period}`,buildTable(["Invoice","Period","Amount","Due","Status"],[[inv.id,inv.period,`£${inv.amount.toLocaleString()}`,inv.due,inv.status.toUpperCase()]]))}>Download PDF</Btn>
              </div>
            </Td>
          </tr>
        ))}
      />
    </Card>
  </Page>
  );
};
