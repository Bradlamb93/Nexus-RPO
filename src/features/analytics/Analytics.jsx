import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ExportMenu } from "../../components/ExportMenu.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { ProgressBar } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { AGENCIES } from "../../data/agencies.js";
import { ANALYTICS_FILL, ANALYTICS_SHIFTS, ANALYTICS_SPEND } from "../../data/analytics.js";
import { INIT_BUDGETS } from "../../data/finance.js";
import { buildTable, exportCSV, exportHTML } from "../../lib/export.js";
import { TOOLTIP_STYLE } from "../../theme/charts.js";
import { T } from "../../theme/tokens.js";

/* ─── ADMIN: ANALYTICS ───────────────────────────────────────────────────────── */
export const Analytics = ({budgets}) => {
  const exports = [
    {icon:"chartBar",label:"Spend Report — CSV",desc:"Monthly spend by agency",fn:()=>exportCSV("fcc-spend-report.csv",
      ["Month","Spend (£)"],
      ANALYTICS_SPEND.map(r=>[r.month,r.spend]))},
    {icon:"clipboard",label:"Shift Summary — CSV",desc:"Open vs filled by month",fn:()=>exportCSV("fcc-shift-summary.csv",
      ["Month","Filled","Open"],
      ANALYTICS_SHIFTS.map(r=>[r.month,r.filled,r.open]))},
    {icon:"bank",label:"Agency Performance — CSV",desc:"Fill rate, response, compliance",fn:()=>exportCSV("fcc-agency-performance.csv",
      ["Agency","Tier","Shifts","Fill Rate (%)","Avg Response","Compliance (%)","Spend (£)"],
      AGENCIES.map(a=>[a.name,a.tier,a.shifts,a.fillRate,a.avgResponse,a.compliance,a.spend]))},
    {icon:"money",label:"Budget Summary — CSV",desc:"Spend vs budget per site",fn:()=>exportCSV("budget-summary.csv",
      ["Care Home","Monthly Budget","MTD Spend","MTD %","Remaining","YTD Spend"],
      Object.entries(budgets||INIT_BUDGETS).map(([s,b])=>[s,b.monthly,b.mtdSpend,`${Math.round((b.mtdSpend/b.monthly)*100)}%`,b.monthly-b.mtdSpend,b.ytdSpend]))},
    {icon:"printer",label:"Full Analytics Report — PDF",desc:"Printable HTML report",fn:()=>exportHTML("Nexus RPO Analytics Report","January–March 2026",
      buildTable(["Month","Spend (£)","Fill Rate (%)","Filled Shifts","Open Shifts"],
        ANALYTICS_SPEND.map((r,i)=>[r.month,`£${r.spend.toLocaleString()}`,ANALYTICS_FILL[i]?.rate||"—",ANALYTICS_SHIFTS[i]?.filled||"—",ANALYTICS_SHIFTS[i]?.open||"—"])))},
  ];

  const totalBudgetAll  = Object.values(budgets||INIT_BUDGETS).reduce((a,b)=>a+b.monthly,0);
  const totalSpendAll   = Object.values(budgets||INIT_BUDGETS).reduce((a,b)=>a+b.mtdSpend,0);
  const budgetPctAll    = Math.round(totalSpendAll/totalBudgetAll*100);
  const budgetSiteData  = Object.entries(budgets||INIT_BUDGETS).map(([site,b])=>({
    site:site.replace(" Care","").replace(" Nursing","").replace(" Dementia Unit","—Dem").replace(" Lodge","").replace(" Manor",""),
    spend:b.mtdSpend, budget:b.monthly, pct:Math.round((b.mtdSpend/b.monthly)*100),
  }));

  return (
  <Page title="Analytics & Reporting" sub="Performance insights across your neutral vendor operation" icon="chartBar" action={<ExportMenu exports={exports}/>}>
    <Grid cols={4}>
      <Stat label="YTD Spend" value="£423k" accent trend="£18k vs budget" trendUp={true}/>
      <Stat label="Avg Fill Rate" value="86%" trend="6% vs last year" trendUp={true}/>
      <Stat label="Total Shifts" value="568" sub="Jan–Mar 2026"/>
      <Stat label="Group MTD Budget Used" value={`${budgetPctAll}%`} trend={`£${totalSpendAll.toLocaleString()} of £${totalBudgetAll.toLocaleString()}`} trendUp={budgetPctAll>85}/>
    </Grid>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:18}}>
      <Card>
        <CardHead title="Monthly Spend (£)" icon="pound"/>
        <div style={{padding:"12px 4px"}}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ANALYTICS_SPEND} barSize={28}>
              <XAxis dataKey="month" tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false} tickFormatter={v=>`£${v/1000}k`}/>
              <Tooltip formatter={v=>[`£${v.toLocaleString()}`,"Spend"]} contentStyle={TOOLTIP_STYLE}/>
              <Bar dataKey="spend" fill={T.accent} radius={[4,4,0,0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <CardHead title="Shifts: Open vs Filled" icon="clipboard"/>
        <div style={{padding:"12px 4px"}}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ANALYTICS_SHIFTS} barSize={14}>
              <XAxis dataKey="month" tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={TOOLTIP_STYLE}/>
              <Bar dataKey="filled" fill={T.green} radius={[3,3,0,0]} name="Filled"/>
              <Bar dataKey="open" fill={T.ghost} radius={[3,3,0,0]} name="Open"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18,marginBottom:18}}>
      <Card>
        <CardHead title="Fill Rate Trend" icon="trendingUp"/>
        <div style={{padding:"12px 4px"}}>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={ANALYTICS_FILL}>
              <XAxis dataKey="month" tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false}/>
              <YAxis domain={[60,100]} tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false} unit="%"/>
              <Tooltip formatter={v=>`${v}%`} contentStyle={TOOLTIP_STYLE}/>
              <Line type="monotone" dataKey="rate" stroke={T.green} strokeWidth={2.5} dot={{r:5,fill:T.green}} activeDot={{r:7}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <CardHead title="Agency League Table" icon="trophy"/>
        <div style={{padding:16}}>
          {AGENCIES.sort((a,b)=>b.fillRate-a.fillRate).map((a,i)=>(
            <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <span style={{width:20,height:20,borderRadius:"50%",background:i===0?T.amber:i===1?T.faint:i===2?"#9A6B3F":T.sunken,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10.5,fontWeight:600,color:i<3?"#fff":T.muted,flexShrink:0}}>{i+1}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,marginBottom:3}}>{a.name}</div>
                <ProgressBar value={a.fillRate} color={i===0?T.amber:i===1?T.muted:i===2?"#cd7f32":T.border}/>
              </div>
              <span style={{fontSize:13,fontWeight:560,color:T.text}}>{a.fillRate}%</span>
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* Budget breakdown section */}
    <Card>
      <CardHead title="Spend vs Budget by Site — March 2026" icon="money" sub="Live figures from budget tracker"/>
      <div style={{padding:"0 8px 8px"}}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={budgetSiteData} margin={{top:8,right:8,bottom:0,left:0}}>
            <CartesianGrid strokeDasharray="2 4" stroke={T.hairline} vertical={false}/>
            <XAxis dataKey="site" tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false}/>
            <YAxis tickFormatter={v=>`£${(v/1000).toFixed(0)}k`} tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false} width={44}/>
            <Tooltip formatter={(v,n)=>[`£${v.toLocaleString()}`,n==="spend"?"MTD Spend":"Monthly Budget"]}/>
            <Bar dataKey="budget" fill={T.sunken} radius={[4,4,0,0]} name="budget"/>
            <Bar dataKey="spend" fill={T.accent} radius={[4,4,0,0]} name="spend"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{padding:"0 16px 14px"}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          {budgetSiteData.map(d=>{
            const col=d.pct>=90?T.red:d.pct>=75?T.amberText:T.green;
            return (
              <div key={d.site} style={{flex:"1 1 160px",padding:"10px 12px",background:T.raised,borderRadius:8,border:`1px solid ${T.border}`}}>
                <div style={{fontSize:11,fontWeight:560,color:T.text,marginBottom:4}}>{d.site}</div>
                <ProgressBar value={d.pct} color={col}/>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.muted,marginTop:3}}>
                  <span style={{fontWeight:560,color:col}}>{d.pct}%</span>
                  <span>£{d.spend.toLocaleString()} / £{d.budget.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  </Page>
  );
};
