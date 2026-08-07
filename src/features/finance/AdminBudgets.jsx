import { useState } from "react";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert, Modal, ProgressBar } from "../../components/ui/Feedback.jsx";
import { Input } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { INIT_BUDGETS } from "../../data/finance.js";
import { T } from "../../theme/tokens.js";

/* ─── ADMIN: BUDGETS ──────────────────────────────────────────────────────────── */
export const AdminBudgets = ({budgets,setBudgets}) => {
  const [editSite,setEditSite] = useState(null);
  const [editForm,setEditForm] = useState({});
  const sites = Object.keys(INIT_BUDGETS);
  const openEdit = (site) => {
    const b = budgets?.[site]||INIT_BUDGETS[site];
    setEditForm({monthly:b.monthly,annual:b.annual,alertAt75:b.alertAt75,alertAt90:b.alertAt90});
    setEditSite(site);
  };
  const saveEdit = () => {
    if(setBudgets) setBudgets(prev=>({...prev,[editSite]:{...prev[editSite],...editForm,monthly:Number(editForm.monthly),annual:Number(editForm.annual)}}));
    setEditSite(null);
  };
  const totalMonthly = sites.reduce((a,s)=>a+((budgets?.[s]||INIT_BUDGETS[s]).monthly),0);
  const totalAnnual  = sites.reduce((a,s)=>a+((budgets?.[s]||INIT_BUDGETS[s]).annual),0);
  const totalMtd     = sites.reduce((a,s)=>a+((budgets?.[s]||INIT_BUDGETS[s]).mtdSpend),0);
  return (
    <Page title="Budget Management" sub="Set and monitor agency spend budgets for each care home" icon="money"
      action={<div style={{fontSize:13,fontWeight:560,color:T.amber}}>Total monthly: £{totalMonthly.toLocaleString()}</div>}>
      {editSite&&(
        <Modal title={`Set Budget — ${editSite}`} onClose={()=>setEditSite(null)}>
          <Alert type="info">Budget figures control the tracker bars shown to site managers. Spend is populated automatically from approved timesheets.</Alert>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            <Input label="Monthly Budget (£)" type="number" value={editForm.monthly} onChange={v=>setEditForm(f=>({...f,monthly:v}))}/>
            <Input label="Annual Budget (£)"  type="number" value={editForm.annual}  onChange={v=>setEditForm(f=>({...f,annual:v}))}/>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:10}}>Alert Thresholds</label>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[{k:"alertAt75",label:"Alert site manager at 75% of monthly budget",color:T.amberText,bg:T.amberBg},{k:"alertAt90",label:"Alert site manager at 90% of monthly budget",color:T.red,bg:T.redBg}].map(opt=>(
                <label key={opt.k} onClick={()=>setEditForm(f=>({...f,[opt.k]:!f[opt.k]}))} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,border:`1px solid ${editForm[opt.k]?opt.color:T.border}`,background:editForm[opt.k]?opt.bg:T.white,cursor:"pointer"}}>
                  <input type="checkbox" checked={editForm[opt.k]} readOnly style={{accentColor:opt.color,width:14,height:14}}/>
                  <span style={{fontSize:13,fontWeight:600,color:editForm[opt.k]?opt.color:T.text}}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={saveEdit} disabled={!editForm.monthly||!editForm.annual}>Save Budget</Btn>
            <Btn variant="secondary" onClick={()=>setEditSite(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
      <Grid cols={3}>
        <Stat label="Total Monthly Budgets" value={`£${totalMonthly.toLocaleString()}`} accent/>
        <Stat label="Total Annual Budgets"  value={`£${totalAnnual.toLocaleString()}`}/>
        <Stat label="Group MTD Spend"       value={`£${totalMtd.toLocaleString()}`} sub={`${Math.round(totalMtd/totalMonthly*100)}% of combined monthly`}/>
      </Grid>
      <Card>
        <Table headers={["Care Home","Monthly Budget","Annual Budget","MTD Spend","MTD Used","Remaining","Alerts","Actions"]}
          rows={sites.map(site=>{
            const b=budgets?.[site]||INIT_BUDGETS[site];
            const pct=Math.round((b.mtdSpend/b.monthly)*100);
            const col=pct>=90?T.red:pct>=75?T.amberText:T.green;
            return (
              <tr key={site} style={{borderBottom:`1px solid ${T.border}`,background:pct>=90?T.redBg:pct>=75?T.amberBg:"transparent"}}>
                <Td bold>{site}</Td>
                <Td bold>£{b.monthly.toLocaleString()}</Td>
                <Td>£{b.annual.toLocaleString()}</Td>
                <Td><span style={{fontWeight:560,color:col}}>£{b.mtdSpend.toLocaleString()}</span></Td>
                <Td>
                  <div style={{display:"flex",alignItems:"center",gap:8,minWidth:100}}>
                    <div style={{flex:1}}><ProgressBar value={pct} color={col}/></div>
                    <span style={{fontSize:11,fontWeight:560,color:col,minWidth:30}}>{pct}%</span>
                  </div>
                </Td>
                <Td><span style={{fontWeight:560,color:b.monthly-b.mtdSpend<2000?T.red:T.text}}>£{(b.monthly-b.mtdSpend).toLocaleString()}</span></Td>
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
