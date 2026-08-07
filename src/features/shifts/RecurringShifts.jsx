import { useState } from "react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead } from "../../components/ui/Card.jsx";
import { Alert } from "../../components/ui/Feedback.jsx";
import { Input } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { INIT_RECURRING_PATTERNS } from "../../data/shifts.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── RECURRING SHIFT MANAGER (care home request page enhancement) ────────────── */
export const RecurringShifts = ({user}) => {
  const [patterns,setPatterns]=useState(INIT_RECURRING_PATTERNS);
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({role:"RGN",days:[],time:"07:00–19:00",rate:35,notes:""});
  const toggleDay=(d)=>setForm(f=>({...f,days:f.days.includes(d)?f.days.filter(x=>x!==d):[...f.days,d]}));
  const save=()=>{
    setPatterns(p=>[...p,{id:`rp${p.length+1}`,carehome:"Sunrise Care",...form,active:true,createdBy:user?.name||"Karen Hughes"}]);
    setShowForm(false);setForm({role:"RGN",days:[],time:"07:00–19:00",rate:35,notes:""});
  };
  const days=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  return (
    <Page title="Recurring Shift Patterns" sub="Auto-publish shifts on a weekly schedule without manual entry" icon="refresh">
      <Alert type="info">Active patterns auto-publish shifts every week. Nexus RPO will broadcast them to agencies based on your tier configuration.</Alert>
      <div style={{marginBottom:16}}><Btn onClick={()=>setShowForm(s=>!s)}>+ New Pattern</Btn></div>
      {showForm&&(
        <Card style={{padding:20,marginBottom:16}}>
          <CardHead title="New Recurring Pattern" icon="refresh"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
            <div><label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,marginBottom:4}}>Role</label>
              <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} style={{width:"100%",padding:"8px 10px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:12,fontFamily:FONT,outline:"none"}}>
                {["RGN","RMN","HCA","Senior Carer"].map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
            <Input label="Shift Time" value={form.time} onChange={v=>setForm(f=>({...f,time:v}))} placeholder="07:00–19:00"/>
            <Input label="Rate (£/hr)" type="number" value={form.rate} onChange={v=>setForm(f=>({...f,rate:parseFloat(v)||0}))}/>
          </div>
          <div style={{marginBottom:12}}>
            <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,marginBottom:6}}>Days</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {days.map(d=><button key={d} onClick={()=>toggleDay(d)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${form.days.includes(d)?T.amber:T.border}`,background:form.days.includes(d)?T.amberBg:"transparent",color:form.days.includes(d)?T.amberText:T.muted,fontSize:12,fontWeight:560,cursor:"pointer",fontFamily:FONT}}>{d}</button>)}
            </div>
          </div>
          <Input label="Notes" value={form.notes} onChange={v=>setForm(f=>({...f,notes:v}))}/>
          <div style={{display:"flex",gap:8,marginTop:12}}><Btn onClick={save} disabled={!form.days.length}>Save Pattern</Btn><Btn variant="secondary" onClick={()=>setShowForm(false)}>Cancel</Btn></div>
        </Card>
      )}
      <Card>
        <Table headers={["Role","Days","Time","Rate","Status","Created By","Actions"]} rows={patterns.map(p=>(
          <tr key={p.id} style={{borderBottom:`1px solid ${T.border}`,opacity:p.active?1:0.5}}>
            <Td><Badge label={p.role} color={T.purple} bg={T.purpleBg}/></Td>
            <Td><div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{p.days.map(d=><span key={d} style={{fontSize:11,fontWeight:560,padding:"2px 7px",borderRadius:20,background:T.amberBg,color:T.amberText}}>{d}</span>)}</div></Td>
            <Td style={{fontSize:12,color:T.muted}}>{p.time}</Td>
            <Td bold>£{p.rate}{"/hr"}</Td>
            <Td>{p.active?<Badge label="Active" color={T.green} bg={T.greenBg} dot/>:<Badge label="Paused" color={T.muted} bg={T.sunken}/>}</Td>
            <Td style={{fontSize:11,color:T.muted}}>{p.createdBy}</Td>
            <Td><div style={{display:"flex",gap:4}}>
              <Btn small variant="secondary" onClick={()=>setPatterns(ps=>ps.map(x=>x.id===p.id?{...x,active:!x.active}:x))}>{p.active?"Pause":"Resume"}</Btn>
              <Btn small variant="danger" onClick={()=>setPatterns(ps=>ps.filter(x=>x.id!==p.id))}>Delete</Btn>
            </div></Td>
          </tr>
        ))}/>
      </Card>
    </Page>
  );
};
