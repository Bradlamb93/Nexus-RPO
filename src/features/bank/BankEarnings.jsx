import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SBadge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { BANK_EARNINGS, BANK_STAFF } from "../../data/workers.js";
import { exportCSV } from "../../lib/export.js";
import { TOOLTIP_STYLE } from "../../theme/charts.js";
import { T } from "../../theme/tokens.js";

/* ─── BANK: EARNINGS ─────────────────────────────────────────────────────────── */
export const BankEarnings = ({user}) => {
  const me=BANK_STAFF.find(w=>w.name===user.name)||BANK_STAFF[0];
  const rate=me.role==="RGN"?32:me.role==="RMN"?35:16;
  const payslips=[
    {id:"PS-0024",period:"Mar 2026",shifts:Math.ceil(me.hoursThisMonth/12),hours:me.hoursThisMonth,gross:me.hoursThisMonth*rate,status:"pending"},
    {id:"PS-0023",period:"Feb 2026",shifts:4,hours:48,gross:48*rate,status:"paid"},
    {id:"PS-0022",period:"Jan 2026",shifts:3,hours:36,gross:36*rate,status:"paid"},
    {id:"PS-0021",period:"Dec 2025",shifts:2,hours:24,gross:24*rate,status:"paid"},
  ];
  return (
    <Page title="My Earnings" sub="Payslips, hours and YTD summary" icon="pound">
      <Grid cols={3}>
        <Stat label="Earnings YTD" value={`£${me.earningsYTD.toLocaleString()}`} accent/>
        <Stat label="Hours YTD" value={`${me.hoursYTD}hrs`} trend="12hrs vs last year" trendUp={true}/>
        <Stat label="This Month" value={`£${(me.hoursThisMonth*rate).toLocaleString()}`} sub="Pending payroll"/>
      </Grid>
      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:18,marginBottom:18}}>
        <Card>
          <CardHead title="Monthly Earnings" icon="trendingUp"/>
          <div style={{padding:"12px 4px"}}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={BANK_EARNINGS} barSize={28}>
                <XAxis dataKey="month" tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false} tickFormatter={v=>`£${v}`}/>
                <Tooltip formatter={v=>[`£${v}`,"Earnings"]} contentStyle={TOOLTIP_STYLE}/>
                <Bar dataKey="pay" fill={T.teal} radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <CardHead title="Hours per Month" icon="timer"/>
          <div style={{padding:"12px 4px"}}>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={BANK_EARNINGS}>
                <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={T.teal} stopOpacity={0.3}/><stop offset="95%" stopColor={T.teal} stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="month" tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11.5,fill:T.faint}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={TOOLTIP_STYLE}/>
                <Area type="monotone" dataKey="hrs" stroke={T.teal} strokeWidth={2} fill="url(#tg)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card>
        <CardHead title="Payslip History"/>
        <Table headers={["Payslip","Period","Shifts","Hours","Rate/hr","Gross","Status","Download"]}
          rows={payslips.map(p=>(
            <tr key={p.id} style={{borderBottom:`1px solid ${T.border}`}}>
              <Td><span style={{fontFamily:"monospace",fontSize:12,fontWeight:560}}>{p.id}</span></Td>
              <Td>{p.period}</Td><Td>{p.shifts}</Td><Td>{p.hours}hrs</Td>
              <Td>£{rate}{"/hr"}</Td><Td bold>£{p.gross.toLocaleString()}</Td>
              <Td><SBadge s={p.status}/></Td>
              <Td>{p.status==="paid"?<Btn small variant="secondary" onClick={()=>exportCSV(`${p.id}-${p.period.replace(/ /g,"-")}.csv`,["Payslip","Period","Shifts","Hours","Rate/hr","Gross","Status"],[[p.id,p.period,p.shifts,p.hours,`£${rate}{"/hr"}`,`£${p.gross}`,p.status]])}>PDF</Btn>:<span style={{fontSize:12,color:T.muted}}>Processing</span>}</Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};
