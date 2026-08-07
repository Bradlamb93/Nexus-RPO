import { useState } from "react";
import { Badge, UrgDot } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { Modal } from "../../components/ui/Feedback.jsx";
import { Select } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { SHIFTS } from "../../data/shifts.js";
import { WORKERS } from "../../data/workers.js";
import { cap, tierColor, urgencyColor } from "../../lib/format.js";
import { T } from "../../theme/tokens.js";

/* ─── AGENCY VIEWS ───────────────────────────────────────────────────────────── */
export const AgencyDashboard = ({user, navigate}) => {
  const myShifts = SHIFTS.filter(s=>s.agency==="First Choice");
  const [claimed, setClaimed] = useState([]);
  const [claimModal, setClaimModal] = useState(null);
  return (
    <Page title={`Hello, ${user.name.split(" ")[0]}`} sub="First Choice Nursing — Your dashboard" icon="grid">
      {claimModal && (
        <Modal title={`Claim Shift — ${claimModal.carehome}`} onClose={()=>setClaimModal(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
            {[["Role",claimModal.role],["Date",claimModal.date],["Time",claimModal.time],["Rate",`£${claimModal.rate}{"/hr"}`],["Urgency",claimModal.urgency],["Care Home",claimModal.carehome]].map(([k,v])=>(
              <div key={k} style={{background:T.raised,borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:11,color:T.muted,fontWeight:560,letterSpacing:"-0.006em",marginBottom:3}}>{k}</div>
                <div style={{fontSize:13,fontWeight:600,textTransform:"capitalize"}}>{v}</div>
              </div>
            ))}
          </div>
          <Select label="Assign Worker" value="" onChange={()=>{}} options={WORKERS.filter(w=>w.agency==="First Choice"&&w.role===claimModal.role&&w.compliance>=80).map(w=>w.name)}/>
          <div style={{display:"flex",gap:8,marginTop:4}}>
            <Btn onClick={()=>{setClaimed(c=>[...c,claimModal.id]);setClaimModal(null);}}>Confirm Claim →</Btn>
            <Btn variant="secondary" onClick={()=>setClaimModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
      <Grid cols={4}>
        <Stat label="Available Shifts" value={SHIFTS.filter(s=>s.status==="open").length} sub="Broadcast now" accent/>
        <Stat label="Filled (MTD)" value={myShifts.filter(s=>s.status==="filled").length} trend="94% fill rate" trendUp={true}/>
        <Stat label="Workers on Platform" value={WORKERS.filter(w=>w.agency==="First Choice").length} sub="All active"/>
        <Stat label="Compliance Score" value="98%" trend="2% this month" trendUp={true}/>
      </Grid>
      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:18}}>
        <Card>
          <CardHead title="New Shift Broadcasts" action={<Badge label={`${SHIFTS.filter(s=>s.status==="open").length} new`} color={T.blue} bg={T.blueBg} dot/>}/>
          <Table
            headers={["Care Home","Role","Date","Time","Rate","Urgency","Action"]}
            rows={SHIFTS.filter(s=>s.status==="open").map(s=>(
              <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`}}>
                <Td bold>{s.carehome}</Td>
                <Td><Badge label={s.role} color={T.purple} bg={T.purpleBg}/></Td>
                <Td>{s.date}</Td>
                <Td>{s.time}</Td>
                <Td bold>£{s.rate}{"/hr"}</Td>
                <Td><span style={{fontSize:12,color:urgencyColor(s.urgency)}}><UrgDot u={s.urgency}/>{cap(s.urgency)}</span></Td>
                <Td>{claimed.includes(s.id)?<Badge label="✓ Claimed" color={T.green} bg={T.greenBg}/>:<Btn small onClick={()=>setClaimModal(s)}>Claim</Btn>}</Td>
              </tr>
            ))}
          />
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <CardHead title="My Performance" icon="star"/>
            <div style={{padding:14}}>
              {[["Fill Rate","94%",T.green],["Avg Response","18 min",T.blue],["Tier Status","Tier 1",tierColor("Tier 1")],["Compliance","98%",T.green]].map(([k,v,c])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${T.border}`,fontSize:13}}>
                  <span style={{color:T.muted}}>{k}</span>
                  <span style={{fontWeight:560,color:c}}>{v}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHead title="Compliance Alerts" icon="warning"/>
            <div style={{padding:12}}>
              {WORKERS.filter(w=>w.agency==="First Choice"&&w.compliance<90).map(w=>(
                <div key={w.id} style={{background:T.yellowBg,borderRadius:8,padding:"8px 10px",marginBottom:7,fontSize:12,borderLeft:`3px solid ${T.yellow}`}}>
                  <div style={{fontWeight:560,color:T.yellow}}>{w.name}</div>
                  <div style={{color:T.muted,marginTop:2}}>{w.dbs==="expiring"?"DBS expiring soon":w.training!=="valid"?"Training needs renewal":"Review needed"}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};
