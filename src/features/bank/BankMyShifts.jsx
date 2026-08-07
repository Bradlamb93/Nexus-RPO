import { useState } from "react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert, Modal } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { BANK_STAFF } from "../../data/workers.js";
import { T } from "../../theme/tokens.js";

/* ─── BANK: MY SHIFTS ────────────────────────────────────────────────────────── */
export const BankMyShifts = ({user}) => {
  const me=BANK_STAFF.find(w=>w.name===user.name)||BANK_STAFF[0];
  const rate=me.role==="RGN"?32:me.role==="RMN"?35:16;
  const [shifts,setShifts]=useState([
    {id:201,carehome:"Sunrise Care",role:me.role,date:"2026-03-18",time:"07:00–19:00",status:"confirmed",rate},
    {id:202,carehome:"Oakwood Nursing",role:me.role,date:"2026-03-20",time:"19:00–07:00",status:"confirmed",rate},
    {id:203,carehome:"Sunrise Care",role:me.role,date:"2026-03-11",time:"07:00–19:00",status:"completed",rate},
    {id:204,carehome:"Meadowbrook Lodge",role:me.role,date:"2026-03-08",time:"19:00–07:00",status:"completed",rate},
  ]);
  const [detailModal,setDetailModal]=useState(null);
  const cancelShift=(id)=>setShifts(ss=>ss.map(s=>s.id===id?{...s,status:"cancelled"}:s));
  return (
    <Page title="My Shifts" sub="Confirmed and completed shifts" icon="checkCircle">
      {detailModal&&(
        <Modal title={`Shift Details — ${detailModal.carehome}`} onClose={()=>setDetailModal(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[["Care Home",detailModal.carehome],["Role",detailModal.role],["Date",detailModal.date],["Time",detailModal.time],["Rate",`£${detailModal.rate}{"/hr"}`],["Pay",`£${detailModal.rate*12}`]].map(([k,v])=>(
              <div key={k} style={{background:T.raised,borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:11,color:T.muted,fontWeight:560,letterSpacing:"-0.006em",marginBottom:3}}>{k}</div>
                <div style={{fontSize:13,fontWeight:600}}>{v}</div>
              </div>
            ))}
          </div>
          {detailModal.status==="confirmed"&&<Alert type="warn">If you need to cancel, please do so at least 4 hours before the shift starts.</Alert>}
          <div style={{display:"flex",gap:8,marginTop:8}}>
            {detailModal.status==="confirmed"&&<Btn variant="danger" onClick={()=>{cancelShift(detailModal.id);setDetailModal(null);}}>Cancel Shift</Btn>}
            <Btn variant="secondary" onClick={()=>setDetailModal(null)}>Close</Btn>
          </div>
        </Modal>
      )}
      <Grid cols={3}>
        <Stat label="Upcoming" value={shifts.filter(s=>s.status==="confirmed").length} accent/>
        <Stat label="Completed (MTD)" value={shifts.filter(s=>s.status==="completed").length}/>
        <Stat label="Hours Worked" value={`${me.hoursThisMonth}hrs`} trend="vs last month" trendUp={true}/>
      </Grid>
      <Card>
        <Table headers={["Care Home","Role","Date","Time","Rate","Pay","Status","Action"]}
          rows={shifts.filter(s=>s.status!=="cancelled").map(s=>(
            <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`,background:s.status==="completed"?T.raised:"transparent"}}>
              <Td bold>{s.carehome}</Td>
              <Td><Badge label={s.role} color={T.teal} bg={T.tealBg}/></Td>
              <Td>{s.date}</Td><Td>{s.time}</Td>
              <Td>£{s.rate}{"/hr"}</Td><Td bold>£{s.rate*12}</Td>
              <Td>{s.status==="completed"?<Badge label="Completed" color={T.green} bg={T.greenBg} dot/>:<Badge label="Confirmed" color={T.blue} bg={T.blueBg} dot/>}</Td>
              <Td><div style={{display:"flex",gap:5}}>
                <Btn small variant="secondary" onClick={()=>setDetailModal(s)}>Details</Btn>
                {s.status==="confirmed"&&<Btn small variant="danger" onClick={()=>cancelShift(s.id)}>Cancel</Btn>}
              </div></Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};
