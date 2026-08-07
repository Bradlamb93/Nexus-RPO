import { Bar, CartesianGrid, ComposedChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Icon } from "../../components/Icon.jsx";
import { Badge, SBadge, UrgDot } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert, ProgressBar } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { CH_AGENCY_DATA, CH_FILL_DATA, CH_ROLE_DATA, CH_SPEND_DATA } from "../../data/analytics.js";
import { SHIFTS } from "../../data/shifts.js";
import { BudgetTracker } from "../finance/BudgetTracker.jsx";
import { cap, urgencyColor } from "../../lib/format.js";
import { T } from "../../theme/tokens.js";

export const CareHomeDashboard = ({user, navigate, budgets, setBudgets}) => {
  const mine = SHIFTS.filter(s=>s.carehome==="Sunrise Care");
  const filled = mine.filter(s=>s.status==="filled").length;
  const open = mine.filter(s=>["open","pending"].includes(s.status)).length;
  const urgent = mine.filter(s=>s.urgency==="urgent"&&s.status!=="filled");
  const fillRate = mine.length ? Math.round(filled/mine.length*100) : 0;
  const mtdSpend = 8420; const budget = 15000;
  const budgetPct = Math.round(mtdSpend/budget*100);

  return (
    <Page title={`Hello, ${user.name.split(" ")[0]}`} sub="Sunrise Care — Staffing Analytics Overview" icon="grid">

      {/* KPI Row */}
      <Grid cols={4}>
        <Stat label="Fill Rate (Mar)" value={`${fillRate}%`} trend="+7% vs Feb" trendUp={true} accent/>
        <Stat label="Shifts This Month" value={mine.length} sub={`${filled} filled · ${open} open`}/>
        <Stat label="MTD Spend" value={`£${mtdSpend.toLocaleString()}`} trend={`${budgetPct}% of budget`} trendUp={budgetPct>80}/>
        <Stat label="Outstanding Invoices" value="£2,340" sub="2 invoices pending"/>
      </Grid>

      {/* Urgent alerts */}
      {urgent.length>0&&(
        <div style={{background:T.amberBg,border:"1px solid #f59e0b",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
          <span style={{fontSize:18}}><Icon name="warning" size={15}/></span>
          <div>
            <div style={{fontWeight:560,fontSize:13,color:T.amberText}}>Action needed: {urgent.length} urgent unfilled {urgent.length===1?"shift":"shifts"}</div>
            <div style={{fontSize:12,color:T.amberText,marginTop:2}}>{urgent.map(s=>`${s.role} · ${s.date}`).join(" · ")}</div>
          </div>
        </div>
      )}

      {/* Charts row */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18}}>
        <Card>
          <CardHead title="Monthly Spend vs Budget" sub="Last 6 months"/>
          <div style={{padding:"0 8px 8px"}}>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={CH_SPEND_DATA} margin={{top:8,right:8,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.hairline} vertical={false}/>
                <XAxis dataKey="month" tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false}/>
                <YAxis tickFormatter={v=>`£${(v/1000).toFixed(0)}k`} tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false} width={40}/>
                <Tooltip formatter={(v,n)=>[`£${v.toLocaleString()}`,n==="spend"?"Spend":"Budget"]}/>
                <Bar dataKey="spend" fill={T.accent} radius={[4,4,0,0]} name="spend"/>
                <Line type="monotone" dataKey="budget" stroke={T.red} strokeDasharray="5 3" strokeWidth={2} dot={false} name="budget"/>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHead title="Fill Rate Trend"/>
          <div style={{padding:"0 8px 8px"}}>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={CH_FILL_DATA} margin={{top:8,right:8,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.hairline} vertical={false}/>
                <XAxis dataKey="month" tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false}/>
                <YAxis domain={[60,100]} tickFormatter={v=>`${v}%`} tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false} width={36}/>
                <Tooltip formatter={v=>[`${v}%`,"Fill Rate"]}/>
                <Line type="monotone" dataKey="rate" stroke={T.teal} strokeWidth={2.5} dot={{r:4,fill:T.teal}} activeDot={{r:6}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Role breakdown + Agency split + Budget */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:18}}>

        {/* Role breakdown */}
        <Card>
          <CardHead title="By Role (Mar)"/>
          <div style={{padding:"8px 16px 12px"}}>
            {CH_ROLE_DATA.map(r=>(
              <div key={r.role} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,fontWeight:560,color:T.text}}>{r.role}</span>
                  <span style={{fontSize:12,color:T.muted}}>{r.shifts} shifts · <strong style={{color:T.text}}>£{r.spend.toLocaleString()}</strong></span>
                </div>
                <ProgressBar value={r.shifts} max={24} color={r.role==="RGN"?T.amber:r.role==="RMN"?T.purple:r.role==="HCA"?T.teal:T.blue}/>
              </div>
            ))}
          </div>
        </Card>

        {/* Agency split */}
        <Card>
          <CardHead title="Agency Split (Mar)"/>
          <div style={{padding:"8px 16px 12px"}}>
            {CH_AGENCY_DATA.map((a,i)=>{
              const colors=[T.amber,T.teal,T.purple,T.blue];
              return (
                <div key={a.name} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:12,fontWeight:560,color:T.text}}>{a.name}</span>
                    <span style={{fontSize:12,color:T.muted}}>{a.shifts} shifts · {a.pct}%</span>
                  </div>
                  <ProgressBar value={a.pct} max={100} color={colors[i%colors.length]}/>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Budget tracker */}
        <BudgetTracker careHome="Sunrise Care" budgets={budgets} setBudgets={setBudgets}/>
      </div>

      {/* Upcoming shifts table */}
      <Card>
        <CardHead title="Upcoming Shifts" sub="Next 7 days" action={<Btn small onClick={()=>navigate&&navigate("request")}>Request New</Btn>}/>
        <Table
          headers={["Role","Date","Time","Urgency","Status","Agency","Worker"]}
          rows={mine.sort((a,b)=>a.date.localeCompare(b.date)).map(s=>(
            <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`,background:s.urgency==="urgent"&&s.status!=="filled"?T.amberBg:"transparent"}}>
              <Td><Badge label={s.role} color={T.purple} bg={T.purpleBg}/></Td>
              <Td>{s.date}</Td>
              <Td style={{color:T.muted,fontSize:12}}>{s.time}</Td>
              <Td><span style={{fontSize:12,color:urgencyColor(s.urgency),fontWeight:600}}><UrgDot u={s.urgency}/>{cap(s.urgency)}</span></Td>
              <Td><SBadge s={s.status}/></Td>
              <Td style={{fontSize:12}}>{s.agency||<span style={{color:T.muted}}>Unassigned</span>}</Td>
              <Td style={{fontSize:12}}>{s.worker||<span style={{color:T.ghost}}>Awaiting</span>}</Td>
            </tr>
          ))}
        />
      </Card>

      {/* Notices */}
      <Card>
        <CardHead title="Notices & Updates" icon="megaphone"/>
        <div style={{padding:"4px 16px 16px",display:"flex",flexDirection:"column",gap:8}}>
          <Alert type="warn">2 unfilled night shifts this week — contact your coordinator.</Alert>
          <Alert type="success">Emma Clarke confirmed for 15 Mar — fully verified and compliant.</Alert>
          <Alert type="info">New HCA compliance requirements take effect April 2026. Review your worker documents.</Alert>
          <Alert type="info">Invoice INV-0021 due in 5 days — £1,560 outstanding.</Alert>
        </div>
      </Card>
    </Page>
  );
};
