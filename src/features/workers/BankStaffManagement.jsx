import { useState } from "react";
import { Badge, SBadge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert, Modal, ProgressBar } from "../../components/ui/Feedback.jsx";
import { Input, Select } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { CARE_HOMES } from "../../data/clients.js";
import { BANK_SHIFTS, BANK_STAFF } from "../../data/workers.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── ADMIN: BANK STAFF MANAGEMENT ──────────────────────────────────────────── */
export const BankStaffManagement = () => {
  const [modal,setModal]=useState(false);
  const [selected,setSelected]=useState(null);
  const [windowMins,setWindowMins]=useState(120);
  return (
    <Page title="Bank Staff" sub="Internal workforce with first-refusal on shifts before agencies" icon="bank" action={<Btn onClick={()=>setModal(true)}>+ Add Bank Worker</Btn>}>
      {modal&&(
        <Modal title="Add Bank Staff Member" onClose={()=>setModal(false)}>
          <Input label="Full Name" value="" onChange={()=>{}} placeholder="e.g. Diane Foster" required/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Select label="Role" value="RGN" onChange={()=>{}} options={["RGN","RMN","HCA","Senior Carer"]}/>
            <Input label="Phone" value="" onChange={()=>{}} placeholder="07800 000000"/>
          </div>
          <Input label="Email" type="email" value="" onChange={()=>{}} placeholder="name@internal.co.uk"/>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:6}}>Eligible Care Homes</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{CARE_HOMES.map(c=><button key={c.id} style={{padding:"5px 12px",borderRadius:8,border:`1px solid ${T.border}`,background:T.raised,fontSize:12,cursor:"pointer",fontFamily:FONT,color:T.muted}}>{c.name}</button>)}</div>
          </div>
          <Alert type="info">An invite email will be sent so they can access their bank staff portal.</Alert>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><Btn variant="secondary" onClick={()=>setModal(false)}>Cancel</Btn><Btn onClick={()=>setModal(false)}>Add & Send Invite</Btn></div>
        </Modal>
      )}
      {selected&&(
        <Modal title="Bank Staff Profile" onClose={()=>setSelected(null)}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{width:60,height:60,borderRadius:"50%",background:`linear-gradient(135deg,${T.teal},${T.navy})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:T.white,fontWeight:560,margin:"0 auto 10px"}}>{selected.name.split(" ").map(n=>n[0]).join("")}</div>
            <div style={{fontSize:16,fontWeight:560}}>{selected.name}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:2}}>{selected.role} · Bank Staff</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
            {[["Email",selected.email],["Phone",selected.phone],["DBS Expiry",selected.dbsExpiry],["Training Expiry",selected.trainingExpiry],["Hours (MTD)",`${selected.hoursThisMonth}hrs`],["Earnings YTD",`£${selected.earningsYTD.toLocaleString()}`]].map(([k,v])=>(
              <div key={k} style={{background:T.raised,borderRadius:8,padding:"10px 12px"}}><div style={{fontSize:10,color:T.muted,fontWeight:560,letterSpacing:"-0.006em",marginBottom:3}}>{k}</div><div style={{fontSize:12,fontWeight:600,color:T.text}}>{v}</div></div>
            ))}
          </div>
          <div style={{marginBottom:12}}><div style={{fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:4}}>Eligible Homes</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{selected.contracts.map(c=><Badge key={c} label={c} color={T.teal} bg={T.tealBg}/>)}</div></div>
          <div style={{marginBottom:16}}><div style={{fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:4}}>Compliance</div><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{flex:1}}><ProgressBar value={selected.compliance} color={selected.compliance>=95?T.green:selected.compliance>=75?T.yellow:T.red}/></div><span style={{fontWeight:600,color:selected.compliance>=95?T.green:selected.compliance>=75?T.yellow:T.red}}>{selected.compliance}%</span></div></div>
          <Btn full variant="secondary" onClick={()=>setSelected(null)}>Close</Btn>
        </Modal>
      )}
      <div style={{background:`linear-gradient(135deg,${T.teal}18,${T.tealBg})`,borderRadius:14,padding:"16px 20px",marginBottom:20,border:`1px solid ${T.teal}44`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontWeight:560,fontSize:14,color:T.teal,marginBottom:4}}>Bank Priority Window</div>
          <div style={{fontSize:13,color:T.text}}>Bank staff have <strong>{windowMins} minutes</strong> to claim a shift before it's broadcast to agencies. Lower the window to increase agency response; raise it to maximise bank fill rate.</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontSize:12,color:T.muted,fontWeight:600}}>Window:</span>
          {[30,60,120,240].map(m=>(
            <button key={m} onClick={()=>setWindowMins(m)} style={{padding:"6px 12px",borderRadius:8,border:`1px solid ${windowMins===m?T.teal:T.border}`,background:windowMins===m?T.tealBg:T.white,color:windowMins===m?T.teal:T.muted,fontWeight:560,fontSize:12,cursor:"pointer",fontFamily:FONT}}>{m}m</button>
          ))}
        </div>
      </div>
      <Grid cols={4}>
        <Stat label="Bank Staff" value={BANK_STAFF.length} accent/>
        <Stat label="Fully Compliant" value={BANK_STAFF.filter(w=>w.compliance>=95).length}/>
        <Stat label="Bank-Filled (MTD)" value={BANK_SHIFTS.filter(s=>s.status==="bank-claimed").length} trend="saves agency fees" trendUp={true}/>
        <Stat label="Cost Saving vs Agency" value="£1,240" sub="This month at internal rates"/>
      </Grid>
      <Card style={{marginBottom:20}}>
        <Table
          headers={["Staff Member","Role","DBS","Training","Compliance","Hours (MTD)","Earnings YTD","Eligible Homes","Actions"]}
          rows={BANK_STAFF.map(w=>(
            <tr key={w.id} style={{borderBottom:`1px solid ${T.border}`,background:w.compliance<75?T.amberBg:"transparent"}}>
              <Td><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${T.teal}88,${T.navy}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:560,color:T.white,flexShrink:0}}>{w.name.split(" ").map(n=>n[0]).join("")}</div><span style={{fontWeight:600,fontSize:13}}>{w.name}</span></div></Td>
              <Td><Badge label={w.role} color={T.teal} bg={T.tealBg}/></Td>
              <Td><SBadge s={w.dbs}/></Td>
              <Td><SBadge s={w.training}/></Td>
              <Td><div style={{display:"flex",alignItems:"center",gap:6,minWidth:80}}><div style={{flex:1}}><ProgressBar value={w.compliance} color={w.compliance>=95?T.green:w.compliance>=75?T.yellow:T.red}/></div><span style={{fontSize:11,fontWeight:560,color:w.compliance>=95?T.green:w.compliance>=75?T.yellow:T.red}}>{w.compliance}%</span></div></Td>
              <Td>{w.hoursThisMonth}hrs</Td>
              <Td bold>£{w.earningsYTD.toLocaleString()}</Td>
              <Td><div style={{display:"flex",flexWrap:"wrap",gap:3}}>{w.contracts.slice(0,2).map(c=><Badge key={c} label={c.split(" ")[0]} color={T.teal} bg={T.tealBg}/>)}{w.contracts.length>2&&<Badge label={`+${w.contracts.length-2}`} color={T.muted} bg={T.sunken}/>}</div></Td>
              <Td><div style={{display:"flex",gap:5}}><Btn small onClick={()=>setSelected(w)}>Profile</Btn><Btn small variant="secondary" onClick={()=>setSelected(w)}>Edit</Btn></div></Td>
            </tr>
          ))}
        />
      </Card>
      <Card>
        <CardHead title="Bank Shift Activity" sub="Shifts in priority window + claimed" icon="clipboard"/>
        <Table
          headers={["Care Home","Role","Date","Time","Rate","Status","Claimed By","Action"]}
          rows={BANK_SHIFTS.map(s=>(
            <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`}}>
              <Td bold>{s.carehome}</Td>
              <Td><Badge label={s.role} color={T.teal} bg={T.tealBg}/></Td>
              <Td>{s.date}</Td>
              <Td>{s.time}</Td>
              <Td bold>£{s.rate}{"/hr"}</Td>
              <Td>{s.status==="bank-claimed"?<Badge label="Claimed" color={T.green} bg={T.greenBg} dot/>:<span style={{display:"flex",alignItems:"center",gap:5}}><Badge label="Bank Window" color={T.teal} bg={T.tealBg} dot/>{s.bankWindowMins>0&&<span style={{fontSize:10,color:T.teal,fontWeight:560}}>{s.bankWindowMins}m left</span>}</span>}</Td>
              <Td>{s.claimedBy||<span style={{color:T.ghost,fontSize:12,fontStyle:"italic"}}>Awaiting claim</span>}</Td>
              <Td><Btn small variant="secondary" onClick={()=>alert(`Shift: ${s.carehome} · ${s.role}\nDate: ${s.date} · ${s.time}\nRate: £${s.rate}{"/hr"}\nStatus: ${s.status}\nClaimed by: ${s.claimedBy||"Unclaimed"}`)}>View</Btn></Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};
