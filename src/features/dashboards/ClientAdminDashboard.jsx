import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Icon } from "../../components/Icon.jsx";
import { Badge, SBadge } from "../../components/ui/Badge.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { ProgressBar } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { GROUP_TREND } from "../../data/analytics.js";
import { SITE_COLORS, SITE_DATA } from "../../data/clients.js";
import { SHIFTS } from "../../data/shifts.js";
import { CA_PURPLE, T } from "../../theme/tokens.js";

export const ClientAdminDashboard = ({user, users}) => {
  const thisUser = (users||[]).find(u=>u.email===user?.email) || {sites:["Sunrise Care","Sunrise Dementia Unit","Oakwood Nursing"]};
  const mySites = thisUser?.sites || [];
  const displaySites = mySites.filter(s=>SITE_DATA[s]);

  const totalShifts = displaySites.reduce((a,s)=>a+(SITE_DATA[s]?.shifts||0),0);
  const totalFilled = displaySites.reduce((a,s)=>a+(SITE_DATA[s]?.filled||0),0);
  const totalSpend  = displaySites.reduce((a,s)=>a+(SITE_DATA[s]?.spend||0),0);
  const totalBudget = displaySites.reduce((a,s)=>a+(SITE_DATA[s]?.budget||0),0);
  const fillRate    = totalShifts ? Math.round(totalFilled/totalShifts*100) : 0;
  const budgetPct   = Math.round(totalSpend/totalBudget*100);

  const urgentOpen = SHIFTS.filter(s=>mySites.includes(s.carehome)&&s.urgency==="urgent"&&s.status!=="filled");

  return (
    <Page title={`Hello, ${user?.name?.split(" ")[0]||"there"}`} sub={`${thisUser?.org||"Group"} — Group Overview`} icon="grid">

      {/* Group identity bar */}
      <div style={{background:`linear-gradient(135deg,${T.navyDeep} 0%,#2A2A4A 100%)`,borderRadius:T.r,padding:"20px 24px",color:"#fff",marginBottom:4,boxShadow:T.sh1}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
          <div>
            <div style={{fontSize:18,fontWeight:600,marginBottom:2}}>{thisUser?.org||"Sunrise Healthcare Group"}</div>
            <div style={{fontSize:13,opacity:0.75}}>{displaySites.length} locations · Client Admin Portal</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            {displaySites.map(s=>(
              <div key={s} style={{padding:"4px 12px",borderRadius:20,background:"rgba(255,255,255,0.15)",fontSize:11,fontWeight:560,display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:SITE_COLORS[s]||"#fff"}}/>
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI row */}
      <Grid cols={4}>
        <Stat label="Group Fill Rate" value={`${fillRate}%`} trend={fillRate>=85?"On target":"Below target"} trendUp={fillRate>=85} accent/>
        <Stat label="Total Shifts (Mar)" value={totalShifts} sub={`${totalFilled} filled · ${totalShifts-totalFilled} open`}/>
        <Stat label="Group MTD Spend" value={`£${totalSpend.toLocaleString()}`} trend={`${budgetPct}% of £${(totalBudget/1000).toFixed(0)}k budget`} trendUp={budgetPct>85}/>
        <Stat label="Outstanding Invoices" value="£6,780" sub="4 invoices pending"/>
      </Grid>

      {urgentOpen.length>0&&(
        <div style={{background:T.amberBg,border:"1px solid #f59e0b",borderRadius:10,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:18}}><Icon name="warning" size={15}/></span>
          <div>
            <div style={{fontWeight:560,fontSize:13,color:T.amberText}}>Action needed: {urgentOpen.length} urgent unfilled {urgentOpen.length===1?"shift":"shifts"} across group</div>
            <div style={{fontSize:12,color:T.amberText,marginTop:2}}>{urgentOpen.map(s=>`${s.carehome} · ${s.role} · ${s.date}`).join("  |  ")}</div>
          </div>
        </div>
      )}

      {/* Spend trend + fill by site */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18}}>
        <Card>
          <CardHead title="Group Spend & Fill Rate" sub="Last 6 months"/>
          <div style={{padding:"0 8px 8px"}}>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={GROUP_TREND} margin={{top:8,right:8,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.hairline} vertical={false}/>
                <XAxis dataKey="month" tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false}/>
                <YAxis yAxisId="left" tickFormatter={v=>`£${(v/1000).toFixed(0)}k`} tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false} width={42}/>
                <YAxis yAxisId="right" orientation="right" tickFormatter={v=>`${v}%`} tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false} width={36} domain={[60,100]}/>
                <Tooltip formatter={(v,n)=>n==="spend"?[`£${v.toLocaleString()}`,"Group Spend"]:[`${v}%`,"Fill Rate"]}/>
                <Bar yAxisId="left" dataKey="spend" fill={CA_PURPLE} radius={[4,4,0,0]} name="spend"/>
                <Line yAxisId="right" type="monotone" dataKey="fillRate" stroke={T.accent} strokeWidth={2.5} dot={{r:4,fill:T.accent}} name="fillRate"/>
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHead title="Fill Rate by Site"/>
          <div style={{padding:"8px 16px 12px"}}>
            {displaySites.map(s=>{
              const d=SITE_DATA[s]; if(!d) return null;
              const fr=Math.round(d.filled/d.shifts*100);
              return (
                <div key={s} style={{marginBottom:14}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:12,fontWeight:560,color:T.text}}>{s}</span>
                    <span style={{fontSize:12,fontWeight:560,color:fr>=85?T.green:fr>=70?T.amber:T.red}}>{fr}%</span>
                  </div>
                  <ProgressBar value={fr} max={100} color={SITE_COLORS[s]||CA_PURPLE}/>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Per-site cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16}}>
        {displaySites.map(s=>{
          const d=SITE_DATA[s]; if(!d) return null;
          const fr=Math.round(d.filled/d.shifts*100);
          const bp=Math.round(d.spend/d.budget*100);
          const accent=SITE_COLORS[s]||CA_PURPLE;
          const siteUrgent=SHIFTS.filter(sh=>sh.carehome===s&&sh.urgency==="urgent"&&sh.status!=="filled").length;
          return (
            <Card key={s} style={{borderTop:`3px solid ${accent}`}}>
              <div style={{padding:"14px 16px 12px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:14,color:T.text}}>{s}</div>
                    <div style={{fontSize:11,color:T.muted,marginTop:1}}>March 2026</div>
                  </div>
                  {siteUrgent>0&&<span style={{fontSize:10,fontWeight:560,color:T.amberText,background:T.amberBg,padding:"2px 8px",borderRadius:10}}>{siteUrgent} urgent</span>}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
                  {[{l:"Fill",v:`${fr}%`,c:fr>=85?T.green:fr>=70?T.amber:T.red},{l:"Shifts",v:d.shifts,c:T.text},{l:"Spend",v:`£${(d.spend/1000).toFixed(1)}k`,c:T.text}].map(stat=>(
                    <div key={stat.l} style={{textAlign:"center",padding:"8px 4px",background:T.raised,borderRadius:8}}>
                      <div style={{fontSize:16,fontWeight:600,color:stat.c}}>{stat.v}</div>
                      <div style={{fontSize:10,color:T.muted,fontWeight:600}}>{stat.l}</div>
                    </div>
                  ))}
                </div>
                <ProgressBar value={d.spend} max={d.budget} color={bp>90?T.red:bp>75?T.amber:accent}/>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.muted,marginTop:4}}>
                  <span>£{d.spend.toLocaleString()} spent</span><span>£{d.budget.toLocaleString()} budget</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent activity across all sites */}
      <Card>
        <CardHead title="Recent Activity — All Locations" sub="Shifts, timesheets and alerts"/>
        <Table headers={["Location","Role","Date","Status","Agency","Worker"]}
          rows={SHIFTS.filter(s=>mySites.includes(s.carehome)).slice(0,8).map(s=>(
            <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`,background:s.urgency==="urgent"&&s.status!=="filled"?T.amberBg:"transparent"}}>
              <Td><span style={{fontSize:11,fontWeight:560,color:SITE_COLORS[s.carehome]||CA_PURPLE}}>{s.carehome}</span></Td>
              <Td><Badge label={s.role} color={T.purple} bg={T.purpleBg}/></Td>
              <Td style={{fontSize:12}}>{s.date}</Td>
              <Td><SBadge s={s.status}/></Td>
              <Td style={{fontSize:12}}>{s.agency||<span style={{color:T.muted}}>—</span>}</Td>
              <Td style={{fontSize:12}}>{s.worker||<span style={{color:T.ghost}}>Awaiting</span>}</Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};
