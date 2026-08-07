import { useState } from "react";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { Input } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { AGENCIES } from "../../data/agencies.js";
import { INIT_CREDIT_NOTES } from "../../data/finance.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── CREDIT NOTE MANAGER ─────────────────────────────────────────────────────── */
export const CreditNoteManager = ({user}) => {
  const [notes,setNotes]=useState(INIT_CREDIT_NOTES);
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({invoiceRef:"",agency:"",reason:"",amount:""});
  const create=()=>{
    setNotes(n=>[{id:`CN-00${n.length+1}`,...form,amount:parseFloat(form.amount),issuedDate:"2026-03-10",status:"pending"},...n]);
    setShowForm(false);setForm({invoiceRef:"",agency:"",reason:"",amount:""});
  };
  return (
    <Page title="Credit Notes" sub="Manage credit notes against disputed or adjusted invoices" icon="receipt">
      <div style={{marginBottom:16,display:"flex",gap:10}}>
        <Btn onClick={()=>setShowForm(s=>!s)}>+ New Credit Note</Btn>
      </div>
      {showForm&&(
        <Card style={{padding:20,marginBottom:16}}>
          <CardHead title="Issue Credit Note" icon="receipt"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Invoice Reference" value={form.invoiceRef} onChange={v=>setForm(f=>({...f,invoiceRef:v}))} placeholder="INV-0010"/>
            <div><label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,marginBottom:4}}>Agency</label>
              <select value={form.agency} onChange={e=>setForm(f=>({...f,agency:e.target.value}))} style={{width:"100%",padding:"8px 10px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:12,fontFamily:FONT,outline:"none"}}>
                <option value="">Select agency</option>
                {AGENCIES.map(a=><option key={a.name} value={a.name}>{a.name}</option>)}
              </select>
            </div>
            <Input label="Amount (£)" type="number" value={form.amount} onChange={v=>setForm(f=>({...f,amount:v}))}/>
            <Input label="Reason" value={form.reason} onChange={v=>setForm(f=>({...f,reason:v}))}/>
          </div>
          <div style={{display:"flex",gap:8,marginTop:12}}><Btn onClick={create} disabled={!form.invoiceRef||!form.agency||!form.amount}>Issue Credit Note</Btn><Btn variant="secondary" onClick={()=>setShowForm(false)}>Cancel</Btn></div>
        </Card>
      )}
      <Grid cols={3}>
        <Stat label="Total Credit Notes" value={notes.length} accent/>
        <Stat label="Total Value"        value={`£${notes.reduce((s,n)=>s+n.amount,0).toLocaleString()}`}/>
        <Stat label="Pending Application" value={notes.filter(n=>n.status==="pending").length}/>
      </Grid>
      <Card>
        <Table headers={["Credit Note ID","Invoice Ref","Agency","Reason","Amount","Issued","Status","Action"]} rows={notes.map(n=>(
          <tr key={n.id} style={{borderBottom:`1px solid ${T.border}`}}>
            <Td bold style={{fontFamily:"monospace",fontSize:12}}>{n.id}</Td>
            <Td style={{fontSize:11,color:T.muted}}>{n.invoiceRef}</Td>
            <Td>{n.agency}</Td>
            <Td style={{fontSize:11,color:T.muted,maxWidth:200,whiteSpace:"normal"}}>{n.reason}</Td>
            <Td><span style={{fontWeight:560,color:T.red}}>-£{n.amount.toLocaleString()}</span></Td>
            <Td style={{fontSize:11,color:T.muted}}>{n.issuedDate}</Td>
            <Td><span style={{fontSize:11,fontWeight:560,padding:"3px 10px",borderRadius:20,color:n.status==="applied"?T.green:T.amberText,background:n.status==="applied"?T.greenBg:T.amberBg,textTransform:"capitalize"}}>{n.status==="applied"?"Applied":"Pending"}</span></Td>
            <Td>{n.status==="pending"&&<Btn small onClick={()=>setNotes(ns=>ns.map(x=>x.id===n.id?{...x,status:"applied"}:x))}>Mark Applied</Btn>}</Td>
          </tr>
        ))}/>
      </Card>
    </Page>
  );
};
