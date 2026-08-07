import { Badge, SBadge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { ProgressBar } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { BANK_SHIFTS, BANK_STAFF } from "../../data/workers.js";
import { T } from "../../theme/tokens.js";

/* ─── BANK: DASHBOARD ────────────────────────────────────────────────────────── */
export const BankDashboard = ({user}) => {
  const me = BANK_STAFF.find(w=>w.name===user.name)||BANK_STAFF[0];
  const open = BANK_SHIFTS.filter(s=>s.status==="bank-open");
  return (
    <Page title={`Hello, ${(user.name||"").split(" ")[0]}`} sub="Your bank staff dashboard — shift picks, earnings & compliance" icon="grid">
      <div style={{background:`linear-gradient(135deg,${T.teal}18,${T.tealBg})`,borderRadius:14,padding:"16px 20px",marginBottom:20,border:`1px solid ${T.teal}44`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:14,fontWeight:560,color:T.teal,marginBottom:4}}>You have first pick on new shifts</div>
          <div style={{fontSize:13,color:T.text,lineHeight:1.6}}>As bank staff, you see shifts <strong>before agencies</strong>. Each shift has a countdown — claim it before the window closes or it goes to agencies.</div>
        </div>
        {open.length>0?<Badge label={`${open.length} shifts open now`} color={T.teal} bg={T.tealBg} dot/>:<Badge label="All caught up" color={T.green} bg={T.greenBg} dot/>}
      </div>
      <Grid cols={4}>
        <Stat label="Available to Claim" value={open.length} sub="In your window" accent/>
        <Stat label="My Shifts (MTD)" value={me.hoursThisMonth>0?Math.ceil(me.hoursThisMonth/12):0} sub="Confirmed"/>
        <Stat label="Hours This Month" value={`${me.hoursThisMonth}hrs`} trend="vs last month" trendUp={true}/>
        <Stat label="Earnings (MTD)" value={`£${(me.hoursThisMonth*(me.role==="RGN"?32:me.role==="RMN"?35:16)).toLocaleString()}`}/>
      </Grid>
      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:18}}>
        <Card>
          <CardHead title="Shifts Open to You Now" action={<Badge label="Priority window" color={T.teal} bg={T.tealBg} dot/>}/>
          {open.length===0?(<div style={{padding:32,textAlign:"center",color:T.muted,fontSize:13}}>No shifts in your window right now. Check back soon.</div>):(
            <Table headers={["Care Home","Role","Date","Time","Rate","Window","Action"]}
              rows={open.map(s=>(
                <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`}}>
                  <Td bold>{s.carehome}</Td>
                  <Td><Badge label={s.role} color={T.teal} bg={T.tealBg}/></Td>
                  <Td>{s.date}</Td><Td>{s.time}</Td>
                  <Td bold>£{s.rate}{"/hr"}</Td>
                  <Td><div style={{display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:11,fontWeight:560,color:s.bankWindowMins<60?T.red:T.teal,minWidth:36}}>{s.bankWindowMins}m</span><div style={{width:40,height:4,background:T.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,(s.bankWindowMins/240)*100)}%`,background:s.bankWindowMins<60?T.red:T.teal}}/></div></div></Td>
                  <Td><Btn small onClick={()=>claim(s.id)}>Claim</Btn></Td>
                </tr>
              ))}
            />
          )}
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <CardHead title="My Compliance" icon="shield"/>
            <div style={{padding:16}}>
              <div style={{textAlign:"center",marginBottom:12}}>
                <div style={{fontSize:30,fontWeight:600,color:me.compliance>=95?T.green:me.compliance>=75?T.yellow:T.red}}>{me.compliance}%</div>
                <ProgressBar value={me.compliance} color={me.compliance>=95?T.green:me.compliance>=75?T.yellow:T.red}/>
              </div>
              {[["DBS",me.dbs],["Training",me.training],["PIN",me.pinStatus?"valid":"missing"]].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${T.border}`,fontSize:12}}>
                  <span style={{color:T.muted}}>{k}</span><SBadge s={v}/>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHead title="Eligible Care Homes" icon="hospital"/>
            <div style={{padding:12}}>
              {me.contracts.map(c=>(
                <div key={c} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${T.border}`,fontSize:12}}>
                  <span style={{color:T.teal}}>✓</span><span style={{fontWeight:500}}>{c}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};
