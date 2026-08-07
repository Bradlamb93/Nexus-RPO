import { Area, AreaChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Badge, SBadge, UrgDot } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { ProgressBar } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { AGENCIES } from "../../data/agencies.js";
import { AGENCY_PIE, ANALYTICS_FILL } from "../../data/analytics.js";
import { SHIFTS } from "../../data/shifts.js";
import { WORKERS } from "../../data/workers.js";
import { cap, urgencyColor } from "../../lib/format.js";
import { PIE_COLORS, TOOLTIP_STYLE } from "../../theme/charts.js";
import { T } from "../../theme/tokens.js";

/* ─── ADMIN: DASHBOARD ───────────────────────────────────────────────────────── */
export const AdminDashboard = ({user, navigate}) => {
  const open = SHIFTS.filter(s=>s.status==="open").length;
  const filled = SHIFTS.filter(s=>s.status==="filled").length;
  const urgent = SHIFTS.filter(s=>s.urgency==="urgent"&&s.status==="open").length;
  const compAlerts = WORKERS.filter(w=>w.compliance<80).length;
  return (
    <Page title={`Good morning, ${user.name.split(" ")[0]}`} sub="Tuesday 10 March 2026 — Here's your overview" icon="grid">
      <Grid cols={4}>
        <Stat label="Open Shifts" value={open} sub={`${urgent} urgent`} accent icon="clipboard" trend="2 from yesterday" trendUp={false}/>
        <Stat label="Shifts Filled (MTD)" value="82" sub="Fill rate: 91%" icon="checkCircle" trend="4% vs last month" trendUp={true}/>
        <Stat label="Compliance Alerts" value={compAlerts} sub="Immediate action" icon="warning"/>
        <Stat label="MTD Spend" value="£75.5k" sub="Budget: £90k (84%)" icon="pound" trend="vs £83k last month" trendUp={true}/>
      </Grid>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18,marginBottom:18}}>
        <Card>
          <CardHead title="Fill Rate Trend" sub="Last 6 months" icon="trendingUp"/>
          <div style={{padding:"16px 8px"}}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={ANALYTICS_FILL}>
                <defs><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.accent} stopOpacity={0.2}/><stop offset="95%" stopColor={T.accent} stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="month" tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false}/>
                <YAxis domain={[60,100]} tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false} unit="%"/>
                <Tooltip formatter={v=>`${v}%`} contentStyle={TOOLTIP_STYLE}/>
                <Area type="monotone" dataKey="rate" stroke={T.accent} strokeWidth={2.5} fill="url(#fg)" dot={{r:4,fill:T.accent}}/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHead title="Shifts by Agency" sub="This month" icon="chartPie"/>
          <div style={{padding:"16px",display:"flex",flexDirection:"column",alignItems:"center"}}>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={AGENCY_PIE} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                  {AGENCY_PIE.map((_,i)=><Cell key={i} fill={PIE_COLORS[i]}/>)}
                </Pie>
                <Tooltip formatter={(v,n)=>[`${v} shifts`,n]} contentStyle={TOOLTIP_STYLE}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{display:"flex",flexWrap:"wrap",gap:"6px 12px",justifyContent:"center"}}>
              {AGENCY_PIE.map((a,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:T.muted}}>
                  <span style={{width:8,height:8,borderRadius:2,background:PIE_COLORS[i],display:"inline-block"}}/>
                  {a.name}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:18}}>
        <Card>
          <CardHead title="Live Shift Activity" action={<Badge label="Real-time" color={T.green} bg={T.greenBg} dot/>}/>
          <Table
            headers={["Care Home","Role","Date","Status","Agency","Urgency"]}
            rows={SHIFTS.slice(0,7).map(s=>(
              <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`}}>
                <Td bold>{s.carehome}</Td>
                <Td><Badge label={s.role} color={T.purple} bg={T.purpleBg}/></Td>
                <Td>{s.date}</Td>
                <Td><SBadge s={s.status}/></Td>
                <Td>{s.agency||<span style={{color:T.ghost,fontStyle:"italic",fontSize:12}}>Unassigned</span>}</Td>
                <Td><span style={{display:"flex",alignItems:"center",fontSize:12,color:urgencyColor(s.urgency)}}><UrgDot u={s.urgency}/>{cap(s.urgency)}</span></Td>
              </tr>
            ))}
          />
        </Card>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card>
            <CardHead title="Urgent Actions" icon="siren"/>
            <div style={{padding:12}}>
              {SHIFTS.filter(s=>s.urgency==="urgent"&&s.status==="open").map(s=>(
                <div key={s.id} style={{background:T.redBg,borderRadius:8,padding:"9px 11px",marginBottom:8,borderLeft:`3px solid ${T.red}`}}>
                  <div style={{fontSize:12,fontWeight:560,color:T.red}}>{s.carehome}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:2}}>{s.role} · {s.date} · {s.time}</div>
                  <div style={{marginTop:6}}><Btn small onClick={()=>navigate("shifts")}>Assign Now</Btn></div>
                </div>
              ))}
              {WORKERS.filter(w=>w.compliance<60).map(w=>(
                <div key={w.id} style={{background:T.yellowBg,borderRadius:8,padding:"9px 11px",marginBottom:8,borderLeft:`3px solid ${T.yellow}`}}>
                  <div style={{fontSize:12,fontWeight:560,color:T.yellow}}>{w.name}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:2}}>Compliance: {w.compliance}% — {w.agency}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <CardHead title="Agency Performance" icon="chartBar"/>
            <div style={{padding:14}}>
              {AGENCIES.map(a=>(
                <div key={a.id} style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:3}}>
                    <span style={{fontWeight:600,color:T.text}}>{a.name}</span>
                    <span style={{fontWeight:560,color:a.fillRate>=90?T.green:T.yellow}}>{a.fillRate}%</span>
                  </div>
                  <ProgressBar value={a.fillRate} color={a.fillRate>=90?T.green:T.yellow}/>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};
