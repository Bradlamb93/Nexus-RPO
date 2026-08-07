import { useState } from "react";
import { ExportMenu } from "../../components/ExportMenu.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert, Modal, ProgressBar } from "../../components/ui/Feedback.jsx";
import { Input } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { SITE_COLORS } from "../../data/clients.js";
import { INIT_BUDGETS } from "../../data/finance.js";
import { buildTable, exportCSV, exportHTML } from "../../lib/export.js";
import { CA_PURPLE, T } from "../../theme/tokens.js";

/* ─── CLIENT ADMIN: BUDGETS ──────────────────────────────────────────────────── */
export const ClientAdminBudgets = ({user, users, budgets, setBudgets}) => {
  const thisUser    = users?.find(u=>u.email===user?.email) || users?.find(u=>u.role==="clientadmin");
  const mySites     = thisUser?.sites || ["Sunrise Care","Sunrise Dementia Unit","Oakwood Nursing"];
  const [editSite, setEditSite] = useState(null);
  const [editForm, setEditForm] = useState({});

  const openEdit = (site) => {
    const b = budgets?.[site] || INIT_BUDGETS[site] || {monthly:15000,annual:180000,alertAt75:true,alertAt90:true,mtdSpend:0,ytdSpend:0};
    setEditForm({monthly:b.monthly, annual:b.annual, alertAt75:b.alertAt75, alertAt90:b.alertAt90});
    setEditSite(site);
  };
  const saveEdit = () => {
    if(setBudgets) setBudgets(prev=>({...prev,[editSite]:{...(prev[editSite]||INIT_BUDGETS[editSite]||{}),...editForm,monthly:Number(editForm.monthly),annual:Number(editForm.annual)}}));
    setEditSite(null);
  };

  const groupMonthly = mySites.reduce((a,s)=>a+((budgets?.[s]||INIT_BUDGETS[s])?.monthly||0),0);
  const groupAnnual  = mySites.reduce((a,s)=>a+((budgets?.[s]||INIT_BUDGETS[s])?.annual||0),0);
  const groupMtd     = mySites.reduce((a,s)=>a+((budgets?.[s]||INIT_BUDGETS[s])?.mtdSpend||0),0);
  const groupYtd     = mySites.reduce((a,s)=>a+((budgets?.[s]||INIT_BUDGETS[s])?.ytdSpend||0),0);
  const groupMtdPct  = Math.round(groupMtd/groupMonthly*100);

  const budgetExports = [
    {icon:"chartBar",label:"Budget Summary — CSV",fn:()=>exportCSV("budget-summary.csv",
      ["Care Home","Monthly Budget","Annual Budget","MTD Spend","MTD %","Remaining","YTD Spend","YTD %","75% Alert","90% Alert"],
      mySites.map(s=>{const b=budgets?.[s]||INIT_BUDGETS[s]||{};const mp=Math.round((b.mtdSpend||0)/b.monthly*100);return[s,b.monthly,b.annual,b.mtdSpend,`${mp}%`,b.monthly-b.mtdSpend,b.ytdSpend,`${Math.round((b.ytdSpend||0)/b.annual*100)}%`,b.alertAt75?"Yes":"No",b.alertAt90?"Yes":"No"];}))},
    {icon:"printer",label:"Budget Report — PDF",fn:()=>exportHTML("Group Budget Report",`${thisUser?.org||"Group"} · March 2026`,
      buildTable(["Care Home","Monthly Budget","MTD Spend","MTD %","Remaining","YTD Spend"],
        mySites.map(s=>{const b=budgets?.[s]||INIT_BUDGETS[s]||{};return[s,`£${b.monthly?.toLocaleString()}`,`£${b.mtdSpend?.toLocaleString()}`,`${Math.round((b.mtdSpend||0)/b.monthly*100)}%`,`£${(b.monthly-b.mtdSpend)?.toLocaleString()}`,`£${b.ytdSpend?.toLocaleString()}`];})))},
  ];

  return (
    <Page title="Budget Management" sub={`Monitoring ${mySites.length} locations · ${thisUser?.org||"Group"}`} icon="money" action={<ExportMenu exports={budgetExports}/>}>
      {editSite&&(
        <Modal title={`Set Budget — ${editSite}`} onClose={()=>setEditSite(null)}>
          <Alert type="info">Budgets set here are visible to the site manager and control their tracker bars and alert thresholds.</Alert>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            <Input label="Monthly Budget (£)" type="number" value={editForm.monthly} onChange={v=>setEditForm(f=>({...f,monthly:v}))}/>
            <Input label="Annual Budget (£)"  type="number" value={editForm.annual}  onChange={v=>setEditForm(f=>({...f,annual:v}))}/>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:10}}>Alert Thresholds — notify site manager when:</label>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[{k:"alertAt75",label:"75% of monthly budget is reached",color:T.amberText,bg:T.amberBg},{k:"alertAt90",label:"90% of monthly budget is reached",color:T.red,bg:T.redBg}].map(opt=>(
                <label key={opt.k} onClick={()=>setEditForm(f=>({...f,[opt.k]:!f[opt.k]}))} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,border:`1px solid ${editForm[opt.k]?opt.color:T.border}`,background:editForm[opt.k]?opt.bg:T.white,cursor:"pointer"}}>
                  <input type="checkbox" checked={!!editForm[opt.k]} readOnly style={{accentColor:opt.color,width:14,height:14}}/>
                  <span style={{fontSize:13,fontWeight:600,color:editForm[opt.k]?opt.color:T.text}}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={saveEdit} style={{background:CA_PURPLE}} disabled={!editForm.monthly||!editForm.annual}>Save Budget</Btn>
            <Btn variant="secondary" onClick={()=>setEditSite(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}

      {/* Group totals */}
      <Grid cols={4}>
        <Stat label="Group Monthly Budgets" value={`£${groupMonthly.toLocaleString()}`} accent sub={`across ${mySites.length} sites`}/>
        <Stat label="Group Annual Budgets"  value={`£${groupAnnual.toLocaleString()}`}/>
        <Stat label="Group MTD Spend"       value={`£${groupMtd.toLocaleString()}`}    trend={`${groupMtdPct}% of total monthly`} trendUp={groupMtdPct>85}/>
        <Stat label="Group YTD Spend"       value={`£${groupYtd.toLocaleString()}`}    sub={`${Math.round(groupYtd/groupAnnual*100)}% of annual`}/>
      </Grid>

      {/* Per-site budget cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16}}>
        {mySites.map(site=>{
          const b    = budgets?.[site] || INIT_BUDGETS[site] || {monthly:15000,annual:180000,mtdSpend:0,ytdSpend:0,alertAt75:true,alertAt90:true};
          const mp   = Math.round((b.mtdSpend||0)/b.monthly*100);
          const yp   = Math.round((b.ytdSpend||0)/b.annual*100);
          const col  = mp>=90?T.red:mp>=75?T.amberText:CA_PURPLE;
          const rem  = b.monthly-b.mtdSpend;
          const sc   = SITE_COLORS[site]||CA_PURPLE;
          return (
            <Card key={site} style={{borderTop:`3px solid ${sc}`}}>
              <div style={{padding:"14px 16px 4px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:14,color:T.text}}>{site}</div>
                    <div style={{fontSize:11,color:T.muted}}>March 2026</div>
                  </div>
                  <Btn small variant="secondary" onClick={()=>openEdit(site)}>Edit</Btn>
                </div>
                {mp>=90&&<div style={{marginBottom:8,padding:"6px 10px",borderRadius:8,background:T.redBg,border:`1px solid ${T.red}44`,fontSize:11,fontWeight:560,color:T.red}}>90% budget reached</div>}
                {mp>=75&&mp<90&&<div style={{marginBottom:8,padding:"6px 10px",borderRadius:8,background:T.amberBg,border:"1px solid #fcd34d",fontSize:11,fontWeight:560,color:T.amberText}}>75% budget used</div>}
                <div style={{marginBottom:12}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                    <span style={{color:T.muted}}>MTD Spend</span>
                    <span style={{fontWeight:560,color:col}}>£{b.mtdSpend?.toLocaleString()} <span style={{color:T.muted,fontWeight:400}}>/ £{b.monthly?.toLocaleString()}</span></span>
                  </div>
                  <ProgressBar value={mp} color={col}/>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.muted,marginTop:4}}>
                    <span>{mp}% used</span><span>£{rem?.toLocaleString()} remaining</span>
                  </div>
                </div>
                <div style={{padding:"10px 14px",borderRadius:8,background:T.raised,marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:11,fontWeight:560,color:T.muted}}>Year to Date</span>
                    <span style={{fontSize:12,fontWeight:560,color:yp>=85?T.red:T.blue}}>£{b.ytdSpend?.toLocaleString()}</span>
                  </div>
                  <ProgressBar value={yp} color={yp>=85?T.red:T.blue}/>
                  <div style={{fontSize:11,color:T.muted,marginTop:3}}>{yp}% of £{b.annual?.toLocaleString()} annual budget</div>
                </div>
                <div style={{display:"flex",gap:6,fontSize:10,paddingTop:8,borderTop:`1px solid ${T.border}`}}>
                  {b.alertAt75&&<span style={{padding:"2px 7px",borderRadius:4,background:T.amberBg,color:T.amberText,fontWeight:560}}>75% alert on</span>}
                  {b.alertAt90&&<span style={{padding:"2px 7px",borderRadius:4,background:T.redBg,color:T.red,fontWeight:560}}>90% alert on</span>}
                  {!b.alertAt75&&!b.alertAt90&&<span style={{color:T.muted}}>No alerts set</span>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Full table */}
      <Card>
        <CardHead title="All Sites — Budget Summary"/>
        <Table headers={["Care Home","Monthly Budget","Annual Budget","MTD Spend","MTD Used","Remaining","YTD Spend","YTD Used","Alerts","Actions"]}
          rows={mySites.map(site=>{
            const b=budgets?.[site]||INIT_BUDGETS[site]||{};
            const mp=Math.round((b.mtdSpend||0)/b.monthly*100);
            const yp=Math.round((b.ytdSpend||0)/b.annual*100);
            const col=mp>=90?T.red:mp>=75?T.amberText:T.green;
            return (
              <tr key={site} style={{borderBottom:`1px solid ${T.border}`,background:mp>=90?T.redBg:mp>=75?T.amberBg:"transparent"}}>
                <Td bold>{site}</Td>
                <Td bold>£{b.monthly?.toLocaleString()}</Td>
                <Td>£{b.annual?.toLocaleString()}</Td>
                <Td><span style={{fontWeight:560,color:col}}>£{b.mtdSpend?.toLocaleString()}</span></Td>
                <Td>
                  <div style={{display:"flex",alignItems:"center",gap:8,minWidth:100}}>
                    <div style={{flex:1}}><ProgressBar value={mp} color={col}/></div>
                    <span style={{fontSize:11,fontWeight:560,color:col,minWidth:30}}>{mp}%</span>
                  </div>
                </Td>
                <Td><span style={{fontWeight:560,color:(b.monthly-b.mtdSpend)<2000?T.red:T.text}}>£{(b.monthly-b.mtdSpend)?.toLocaleString()}</span></Td>
                <Td>£{b.ytdSpend?.toLocaleString()}</Td>
                <Td><span style={{fontWeight:560,color:yp>=85?T.red:T.muted}}>{yp}%</span></Td>
                <Td>
                  <div style={{display:"flex",gap:4}}>
                    {b.alertAt75&&<span style={{fontSize:10,fontWeight:560,padding:"2px 6px",borderRadius:4,background:T.amberBg,color:T.amberText}}>75%</span>}
                    {b.alertAt90&&<span style={{fontSize:10,fontWeight:560,padding:"2px 6px",borderRadius:4,background:T.redBg,color:T.red}}>90%</span>}
                    {!b.alertAt75&&!b.alertAt90&&<span style={{fontSize:11,color:T.muted}}>None</span>}
                  </div>
                </Td>
                <Td><Btn small onClick={()=>openEdit(site)}>Edit Budget</Btn></Td>
              </tr>
            );
          })}
        />
      </Card>
    </Page>
  );
};
