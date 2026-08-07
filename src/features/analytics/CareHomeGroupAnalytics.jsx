import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ExportMenu } from "../../components/ExportMenu.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { ProgressBar } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { GROUP_TREND } from "../../data/analytics.js";
import { SITE_COLORS, SITE_DATA } from "../../data/clients.js";
import { INIT_BUDGETS } from "../../data/finance.js";
import { buildTable, exportCSV, exportHTML } from "../../lib/export.js";
import { FONT, T } from "../../theme/tokens.js";

export const CareHomeGroupAnalytics = ({user,users,budgets}) => {
  const thisUser = users?.find(u=>u.email===user?.email) || users?.find(u=>u.role==="carehome"&&u.superAdmin);
  const mySites = thisUser?.sites || ["Sunrise Care"];
  const [activeSite, setActiveSite] = useState("all");

  const displaySites = mySites.filter(s=>SITE_DATA[s]);
  const filteredSites = activeSite==="all" ? displaySites : displaySites.filter(s=>s===activeSite);

  // Merge live budget data into SITE_DATA
  const getSiteData = (s) => {
    const sd = SITE_DATA[s]||{};
    const bd = budgets?.[s]||INIT_BUDGETS[s]||{};
    return {...sd, budget: bd.monthly||sd.budget, spend: bd.mtdSpend||sd.spend};
  };

  const totalShifts  = filteredSites.reduce((a,s)=>a+(getSiteData(s)?.shifts||0),0);
  const totalFilled  = filteredSites.reduce((a,s)=>a+(getSiteData(s)?.filled||0),0);
  const totalSpend   = filteredSites.reduce((a,s)=>a+(getSiteData(s)?.spend||0),0);
  const totalBudget  = filteredSites.reduce((a,s)=>a+(getSiteData(s)?.budget||0),0);
  const fillRate     = totalShifts ? Math.round(totalFilled/totalShifts*100) : 0;
  const budgetPct    = totalBudget ? Math.round(totalSpend/totalBudget*100) : 0;

  // Build per-site bar chart data
  const siteBarData = displaySites.map(s=>({
    site: s.replace(" Care","").replace(" Nursing","").replace(" Dementia Unit","—Dementia"),
    spend: getSiteData(s)?.spend||0,
    budget: getSiteData(s)?.budget||0,
    fill: getSiteData(s) ? Math.round((getSiteData(s).filled/getSiteData(s).shifts)*100) : 0,
  }));

  const gaExports = [
    {icon:"chartBar",label:"Group Spend — CSV",desc:"6-month trend",fn:()=>exportCSV("group-analytics-spend.csv",
      ["Month","Total Spend (£)","Fill Rate (%)"],
      GROUP_TREND.map(r=>[r.month,r.spend,r.fillRate]))},
    {icon:"hospital",label:"By Location — CSV",desc:"MTD breakdown per site",fn:()=>exportCSV("group-analytics-by-location.csv",
      ["Location","Shifts","Filled","Fill Rate (%)","MTD Spend (£)","Budget (£)","Budget Used (%)"],
      displaySites.map(s=>{const d=getSiteData(s);return[s,d?.shifts,d?.filled,d?Math.round(d.filled/d.shifts*100):"—",d?.spend,d?.budget,d?Math.round(d.spend/d.budget*100):"—"];}))},
    {icon:"money",label:"Budget Summary — CSV",fn:()=>exportCSV("group-budget-summary.csv",
      ["Location","Monthly Budget","MTD Spend","MTD %","Remaining","YTD Spend"],
      displaySites.map(s=>{const b=budgets?.[s]||INIT_BUDGETS[s]||{};const mp=Math.round((b.mtdSpend||0)/b.monthly*100);return[s,b.monthly,b.mtdSpend,`${mp}%`,b.monthly-b.mtdSpend,b.ytdSpend];}))},
    {icon:"printer",label:"Group Report — PDF",fn:()=>exportHTML("Group Analytics Report",`March 2026`,
      buildTable(["Location","Fill Rate","Shifts","MTD Spend","Budget","Budget Used"],
        displaySites.map(s=>{const d=getSiteData(s);return[s,d?`${Math.round(d.filled/d.shifts*100)}%`:"—",d?.shifts||0,d?`£${d.spend.toLocaleString()}`:"—",d?`£${d.budget.toLocaleString()}`:"—",d?`${Math.round(d.spend/d.budget*100)}%`:"—"];})))},
  ];

  return (
    <Page title="Group Analytics" sub={`Showing ${activeSite==="all"?`all ${displaySites.length} locations`:`${activeSite}`}`} icon="chartBar" action={<ExportMenu exports={gaExports}/>}>

      {/* Site filter tabs */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:4}}>
        <button onClick={()=>setActiveSite("all")} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${activeSite==="all"?T.amber:T.border}`,background:activeSite==="all"?T.amberBg:T.white,fontWeight:560,fontSize:12,cursor:"pointer",color:activeSite==="all"?T.amberText:T.muted,fontFamily:FONT}}>
          All Locations ({displaySites.length})
        </button>
        {displaySites.map(s=>(
          <button key={s} onClick={()=>setActiveSite(s)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${activeSite===s?SITE_COLORS[s]||T.blue:T.border}`,background:activeSite===s?`${SITE_COLORS[s]}18`||T.blueBg:T.white,fontWeight:560,fontSize:12,cursor:"pointer",color:activeSite===s?SITE_COLORS[s]||T.blue:T.muted,fontFamily:FONT}}>
            {s}
          </button>
        ))}
      </div>

      {/* KPIs */}
      <Grid cols={4}>
        <Stat label="Fill Rate (Mar)" value={`${fillRate}%`} trend={fillRate>=85?"On target":"Below target"} trendUp={fillRate>=85} accent/>
        <Stat label="Total Shifts" value={totalShifts} sub={`${totalFilled} filled · ${totalShifts-totalFilled} open`}/>
        <Stat label="MTD Spend" value={`£${totalSpend.toLocaleString()}`} trend={`${budgetPct}% of budget`} trendUp={budgetPct>85}/>
        <Stat label="Budget Remaining" value={`£${(totalBudget-totalSpend).toLocaleString()}`} sub={`of £${totalBudget.toLocaleString()} total`}/>
      </Grid>

      {/* Group trend + site comparison */}
      {activeSite==="all"&&(
        <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:18}}>
          <Card>
            <CardHead title="Group Spend Trend" sub="Last 6 months — all locations"/>
            <div style={{padding:"0 8px 8px"}}>
              <ResponsiveContainer width="100%" height={220}>
                <ComposedChart data={GROUP_TREND} margin={{top:8,right:8,bottom:0,left:0}}>
                  <CartesianGrid strokeDasharray="2 4" stroke={T.hairline} vertical={false}/>
                  <XAxis dataKey="month" tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false}/>
                  <YAxis yAxisId="left" tickFormatter={v=>`£${(v/1000).toFixed(0)}k`} tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false} width={42}/>
                  <YAxis yAxisId="right" orientation="right" tickFormatter={v=>`${v}%`} tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false} width={36} domain={[60,100]}/>
                  <Tooltip formatter={(v,n)=>n==="spend"?[`£${v.toLocaleString()}`,"Spend"]:[`${v}%`,"Fill Rate"]}/>
                  <Bar yAxisId="left" dataKey="spend" fill={T.accent} radius={[4,4,0,0]} name="spend"/>
                  <Line yAxisId="right" type="monotone" dataKey="fillRate" stroke={T.teal} strokeWidth={2.5} dot={{r:4,fill:T.teal}} name="fillRate"/>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <CardHead title="Fill Rate by Location"/>
            <div style={{padding:"8px 16px 12px"}}>
              {displaySites.map(s=>{
                const d=getSiteData(s); if(!d) return null;
                const fr=Math.round(d.filled/d.shifts*100);
                return (
                  <div key={s} style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:12,fontWeight:560,color:T.text}}>{s}</span>
                      <span style={{fontSize:12,fontWeight:560,color:fr>=85?T.green:fr>=70?T.amber:T.red}}>{fr}%</span>
                    </div>
                    <ProgressBar value={fr} max={100} color={SITE_COLORS[s]||T.blue}/>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Per-site spend comparison (group view only) */}
      {activeSite==="all"&&(
        <Card>
          <CardHead title="Spend vs Budget by Location" sub="March 2026"/>
          <div style={{padding:"0 8px 8px"}}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={siteBarData} margin={{top:8,right:8,bottom:0,left:0}}>
                <CartesianGrid strokeDasharray="2 4" stroke={T.hairline} vertical={false}/>
                <XAxis dataKey="site" tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false}/>
                <YAxis tickFormatter={v=>`£${(v/1000).toFixed(0)}k`} tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false} width={42}/>
                <Tooltip formatter={(v,n)=>[`£${v.toLocaleString()}`,n==="spend"?"MTD Spend":"Budget"]}/>
                <Bar dataKey="budget" fill={T.sunken} radius={[4,4,0,0]} name="budget"/>
                <Bar dataKey="spend" fill={T.accent} radius={[4,4,0,0]} name="spend"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Individual site detail cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
        {filteredSites.map(s=>{
          const d=getSiteData(s); if(!d) return null;
          const fr=Math.round(d.filled/d.shifts*100);
          const bp=Math.round(d.spend/d.budget*100);
          const accent=SITE_COLORS[s]||T.blue;
          return (
            <Card key={s} style={{borderTop:`3px solid ${accent}`}}>
              <div style={{padding:"14px 16px 4px"}}>
                <div style={{fontWeight:600,fontSize:14,color:T.text,marginBottom:2}}>{s}</div>
                <div style={{fontSize:11,color:T.muted,marginBottom:14}}>March 2026</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
                  <div style={{textAlign:"center",padding:"10px 8px",background:T.raised,borderRadius:8}}>
                    <div style={{fontSize:22,fontWeight:600,color:accent}}>{fr}%</div>
                    <div style={{fontSize:10,color:T.muted,fontWeight:600,marginTop:2}}>FILL RATE</div>
                  </div>
                  <div style={{textAlign:"center",padding:"10px 8px",background:T.raised,borderRadius:8}}>
                    <div style={{fontSize:22,fontWeight:600,color:T.text}}>{d.shifts}</div>
                    <div style={{fontSize:10,color:T.muted,fontWeight:600,marginTop:2}}>SHIFTS</div>
                  </div>
                </div>
                <div style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                    <span style={{color:T.muted}}>MTD Spend</span>
                    <span style={{fontWeight:560}}>£{d.spend.toLocaleString()} <span style={{color:T.muted,fontWeight:400}}>/ £{d.budget.toLocaleString()}</span></span>
                  </div>
                  <ProgressBar value={d.spend} max={d.budget} color={bp>90?T.red:bp>75?T.amber:accent}/>
                </div>
                <div style={{display:"flex",gap:8,fontSize:11,color:T.muted,paddingTop:8,borderTop:`1px solid ${T.border}`}}>
                  <span>HCAs: <strong style={{color:T.text}}>{d.hcas}</strong></span>
                  <span>RGNs: <strong style={{color:T.text}}>{d.rgns}</strong></span>
                  <span>RMNs: <strong style={{color:T.text}}>{d.rmns}</strong></span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </Page>
  );
};
