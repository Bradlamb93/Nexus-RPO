import { useState } from "react";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead } from "../../components/ui/Card.jsx";
import { Alert, Modal, ProgressBar } from "../../components/ui/Feedback.jsx";
import { Input } from "../../components/ui/Form.jsx";
import { T } from "../../theme/tokens.js";

/* ─── BUDGET TRACKER ──────────────────────────────────────────────────────────── */
export const BudgetTracker = ({careHome,budgets,setBudgets}) => {
  const site=careHome||"Sunrise Care";
  const b=budgets?.[site]||{annual:180000,monthly:15000,mtdSpend:8420,ytdSpend:48200,alertAt75:true,alertAt90:true};
  const [editModal,setEditModal]=useState(false);
  const [editForm,setEditForm]=useState({monthly:b.monthly,annual:b.annual,alertAt75:b.alertAt75,alertAt90:b.alertAt90});
  const openEdit=()=>{ setEditForm({monthly:b.monthly,annual:b.annual,alertAt75:b.alertAt75,alertAt90:b.alertAt90}); setEditModal(true); };
  const saveEdit=()=>{
    if(setBudgets) setBudgets(prev=>({...prev,[site]:{...b,monthly:Number(editForm.monthly),annual:Number(editForm.annual),alertAt75:editForm.alertAt75,alertAt90:editForm.alertAt90}}));
    setEditModal(false);
  };
  const mtdPct=Math.round((b.mtdSpend/b.monthly)*100);
  const ytdPct=Math.round((b.ytdSpend/b.annual)*100);
  const mtdCol=mtdPct>=90?T.red:mtdPct>=75?T.amberText:T.green;
  const remaining=b.monthly-b.mtdSpend;
  const daysInMonth=31; const dayOfMonth=10;
  const projectedMonthly=Math.round(b.mtdSpend*(daysInMonth/dayOfMonth));
  const overUnder=projectedMonthly-b.monthly;
  return (
    <Card style={{border:`1px solid ${mtdPct>=90?T.red:mtdPct>=75?"rgba(178,94,0,0.3)":T.border}`}}>
      {editModal&&(
        <Modal title={`Set Budget — ${site}`} onClose={()=>setEditModal(false)}>
          <Alert type="info">These budgets control the tracker bar and alert thresholds. Spend figures are populated automatically from approved timesheets.</Alert>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
            <Input label="Monthly Budget (£)" type="number" value={editForm.monthly} onChange={v=>setEditForm(f=>({...f,monthly:v}))}/>
            <Input label="Annual Budget (£)"  type="number" value={editForm.annual}  onChange={v=>setEditForm(f=>({...f,annual:v}))}/>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:10}}>Budget Alerts</label>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[{k:"alertAt75",label:"Alert me when 75% of monthly budget is used",color:T.amberText,bg:T.amberBg},{k:"alertAt90",label:"Alert me when 90% of monthly budget is used",color:T.red,bg:T.redBg}].map(opt=>(
                <label key={opt.k} onClick={()=>setEditForm(f=>({...f,[opt.k]:!f[opt.k]}))} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,border:`1px solid ${editForm[opt.k]?opt.color:T.border}`,background:editForm[opt.k]?opt.bg:T.white,cursor:"pointer"}}>
                  <input type="checkbox" checked={editForm[opt.k]} readOnly style={{accentColor:opt.color,width:14,height:14}}/>
                  <span style={{fontSize:13,fontWeight:600,color:editForm[opt.k]?opt.color:T.text}}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={saveEdit} disabled={!editForm.monthly||!editForm.annual}>Save Budget</Btn>
            <Btn variant="secondary" onClick={()=>setEditModal(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
      <CardHead title="Budget Tracker" icon="money" action={<Btn small variant="secondary" onClick={openEdit}>Set Budget</Btn>}/>
      {mtdPct>=90&&<Alert type="error">90% of monthly budget reached. £{remaining.toLocaleString()} remaining this month.</Alert>}
      {mtdPct>=75&&mtdPct<90&&<Alert type="warning">75% of monthly budget used. Monitor spending carefully.</Alert>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        <div style={{padding:"14px",background:T.raised,borderRadius:10}}>
          <div style={{fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:6}}>Month to Date</div>
          <ProgressBar value={mtdPct} color={mtdCol}/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
            <span style={{fontSize:13,fontWeight:600,color:mtdCol}}>£{b.mtdSpend.toLocaleString()}</span>
            <span style={{fontSize:11,color:T.muted}}>of £{b.monthly.toLocaleString()}</span>
          </div>
        </div>
        <div style={{padding:"14px",background:T.raised,borderRadius:10}}>
          <div style={{fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:6}}>Year to Date</div>
          <ProgressBar value={ytdPct} color={ytdPct>=85?T.red:T.blue}/>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
            <span style={{fontSize:13,fontWeight:600,color:T.blue}}>£{b.ytdSpend.toLocaleString()}</span>
            <span style={{fontSize:11,color:T.muted}}>of £{b.annual.toLocaleString()}</span>
          </div>
        </div>
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
        <div style={{flex:1,padding:"10px 14px",borderRadius:8,background:overUnder>0?T.redBg:T.greenBg,border:`1px solid ${overUnder>0?T.red+"44":T.green+"44"}`}}>
          <div style={{fontSize:10,color:T.muted,fontWeight:600}}>End-of-month projection</div>
          <div style={{fontSize:14,fontWeight:600,color:overUnder>0?T.red:T.green}}>£{projectedMonthly.toLocaleString()}</div>
          <div style={{fontSize:11,color:overUnder>0?T.red:T.green}}>{overUnder>0?`£${overUnder.toLocaleString()} over budget`:`£${Math.abs(overUnder).toLocaleString()} under budget`}</div>
        </div>
        <div style={{flex:1,padding:"10px 14px",borderRadius:8,background:T.raised,border:`1px solid ${T.border}`}}>
          <div style={{fontSize:10,color:T.muted,fontWeight:600}}>Remaining this month</div>
          <div style={{fontSize:14,fontWeight:600,color:T.text}}>£{remaining.toLocaleString()}</div>
          <div style={{fontSize:11,color:T.muted}}>≈ {Math.round(remaining/35)} RGN day shifts</div>
        </div>
      </div>
    </Card>
  );
};
