import { useMemo } from "react";
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert, ProgressBar } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { FORECAST_DATA } from "../../data/analytics.js";
import { SITE_COLORS } from "../../data/clients.js";
import { TOOLTIP_STYLE } from "../../theme/charts.js";
import { T } from "../../theme/tokens.js";

/* ─── DEMAND FORECAST ─────────────────────────────────────────────────────────── */
export const DemandForecast = ({user}) => {
  const accent=user?.role==="clientadmin"?T.purple:T.amber;
  const sites=Object.keys(SITE_COLORS);
  // Per-site split of the group forecast. Derived from a hash of the site and week
  // rather than Math.random, so the figures stay put across re-renders instead of
  // reshuffling every time an unrelated bit of state changes.
  const siteShare=(site,week)=>{
    let h=2166136261;
    for(const ch of `${site}|${week}`){ h^=ch.charCodeAt(0); h=Math.imul(h,16777619); }
    return 0.15+((h>>>0)%1000)/1000*0.25;
  };
  const siteForecasts=useMemo(()=>sites.map(s=>({site:s,weeks:FORECAST_DATA.map(w=>({...w,value:Math.round((w.forecast||0)*siteShare(s,w.week))}))})),[sites.join("|")]);
  return (
    <Page title="Demand Forecast" sub="Predicted shift demand based on historical patterns — next 6 weeks" icon="forecast">
      <Alert type="info">Forecasts use 12-week rolling averages weighted by day-of-week, seasonality, and historic fill patterns. Actual demand may vary.</Alert>
      <Grid cols={4}>
        <Stat label="Forecast This Week"  value={21}  sub="shifts predicted" accent/>
        <Stat label="Peak Week"           value="w/c 31 Mar" sub="24 shifts — Easter period"/>
        <Stat label="Avg Fill Rate"       value="87%" sub="last 12 weeks"/>
        <Stat label="Capacity Risk"       value="High" sub="Easter week — book early"/>
      </Grid>
      <Card>
        <CardHead title="Total Shift Demand — 6 Week Forecast" icon="trendingUp"/>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={FORECAST_DATA} margin={{top:10,right:20,left:0,bottom:0}}>
            <CartesianGrid strokeDasharray="2 4" stroke={T.hairline} vertical={false}/>
            <XAxis dataKey="week" tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false}/>
            <Tooltip contentStyle={TOOLTIP_STYLE}/>
            <Bar dataKey="actual" fill={T.accent} name="Actual" radius={[4,4,0,0]} maxBarSize={32}/>
            <Line dataKey="forecast" stroke={accent} strokeWidth={2.5} dot={{r:4,fill:accent}} name="Forecast" strokeDasharray="6 3"/>
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
      <Card>
        <CardHead title="Forecast by Site" icon="hospital"/>
        <Table headers={["Site","w/c 10 Mar","w/c 17 Mar","w/c 24 Mar","w/c 31 Mar","w/c 7 Apr","w/c 14 Apr","Trend"]} rows={siteForecasts.map(sf=>(
          <tr key={sf.site} style={{borderBottom:`1px solid ${T.border}`}}>
            <Td><span style={{fontWeight:560,fontSize:12,color:SITE_COLORS[sf.site]||T.text}}>{sf.site}</span></Td>
            {sf.weeks.map((w,i)=><Td key={i}><span style={{fontWeight:600,color:w.value>5?T.red:w.value>3?T.amberText:T.text}}>{w.value}</span></Td>)}
            <Td><span style={{color:T.green,fontWeight:560}}>↑ +12%</span></Td>
          </tr>
        ))}/>
      </Card>
      <Card style={{padding:"18px 20px"}}>
        <CardHead title="Unfill Root Cause Analysis" icon="search"/>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",marginTop:8}}>
          {[["No workers available",38],["Short notice",24],["Rate too low",18],["Location too far",11],["Worker declined",9]].map(([reason,pct])=>(
            <div key={reason} style={{flex:1,minWidth:140,padding:"12px 14px",border:`1px solid ${T.border}`,borderRadius:10,background:T.raised}}>
              <div style={{fontSize:11,color:T.muted,marginBottom:4}}>{reason}</div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <ProgressBar value={pct} color={pct>30?T.red:pct>20?T.amberText:T.muted}/>
                <span style={{fontWeight:560,fontSize:13,color:T.text}}>{pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Page>
  );
};
