import { useState } from "react";
import { Icon } from "../../components/Icon.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Input, Select } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { CARE_HOMES } from "../../data/clients.js";
import { urgencyColor } from "../../lib/format.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── ADMIN: SCHEDULER ───────────────────────────────────────────────────────── */
export const Scheduler = ({navigate}) => {
  const [form,setForm] = useState({carehome:"Sunrise Care",role:"RGN",date:"",timeStart:"07:00",timeEnd:"19:00",urgency:"normal",rate:"35",notes:"",recurring:false,recDays:"1"});
  const [done,setDone] = useState(false);
  const set = (k,v)=>setForm(f=>({...f,[k]:v}));
  if(done) return (
    <Page title="Shift Created" icon="checkCircle">
      <div style={{maxWidth:480,background:T.white,borderRadius:18,border:`1px solid ${T.border}`,padding:40,textAlign:"center"}}>
        <div style={{marginBottom:16,display:"flex",justifyContent:"center",color:T.ghost}}><Icon name="checkCircle" size={46} stroke={1.5}/></div>
        <h2 style={{fontFamily:FONT,fontSize:22,marginBottom:8}}>Shift Published</h2>
        <p style={{color:T.muted,fontSize:13,lineHeight:1.7,marginBottom:24}}>Your shift for <strong>{form.role}</strong> at <strong>{form.carehome}</strong> on <strong>{form.date}</strong> has been published. Tier 1 agencies have been notified immediately.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <Btn onClick={()=>setDone(false)}>Create Another</Btn>
          <Btn variant="secondary" onClick={()=>navigate&&navigate("shifts")}>View Shift Board</Btn>
        </div>
      </div>
    </Page>
  );
  return (
    <Page title="Create Shift" sub="Publish a new shift — Tier 1 agencies notified first" icon="calendar">
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,maxWidth:900}}>
        <Card style={{padding:24}}>
          <h3 style={{fontWeight:560,fontSize:14,marginBottom:18,color:T.text}}>Shift Details</h3>
          <Select label="Care Home" value={form.carehome} onChange={v=>set("carehome",v)} options={CARE_HOMES.map(c=>c.name)} required/>
          <Select label="Role Required" value={form.role} onChange={v=>{set("role",v);}} options={["RGN","RMN","HCA","Senior Carer","Deputy Manager"]} required/>
          <Input label="Date" type="date" value={form.date} onChange={v=>set("date",v)} required/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Start Time" type="time" value={form.timeStart} onChange={v=>set("timeStart",v)}/>
            <Input label="End Time" type="time" value={form.timeEnd} onChange={v=>set("timeEnd",v)}/>
          </div>
          <Input label="Rate (£/hr)" type="number" value={form.rate} onChange={v=>set("rate",v)}/>
        </Card>
        <Card style={{padding:24}}>
          <h3 style={{fontWeight:560,fontSize:14,marginBottom:18,color:T.text}}>Options</h3>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:8}}>Urgency</label>
            <div style={{display:"flex",gap:8}}>
              {["normal","high","urgent"].map(u=>(
                <button key={u} onClick={()=>set("urgency",u)} style={{flex:1,padding:"8px",borderRadius:8,border:`1px solid ${form.urgency===u?urgencyColor(u):T.border}`,background:form.urgency===u?"rgba(0,0,0,0.03)":T.white,color:form.urgency===u?urgencyColor(u):T.muted,fontWeight:600,fontSize:12,cursor:"pointer",textTransform:"capitalize",fontFamily:FONT}}>
                  {u}
                </button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:8}}>Notes</label>
            <textarea value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Any specific requirements..." style={{width:"100%",padding:"10px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:FONT,minHeight:70,resize:"vertical",color:T.text}}/>
          </div>
          <div style={{marginBottom:20}}>
            <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13,color:T.text,fontWeight:500}}>
              <input type="checkbox" checked={form.recurring} onChange={e=>set("recurring",e.target.checked)} style={{width:16,height:16}}/>
              Recurring shift
            </label>
            {form.recurring && (
              <div style={{marginTop:10,paddingLeft:24}}>
                <Select label="Repeat every" value={form.recDays} onChange={v=>set("recDays",v)} options={[{value:"1",label:"Week"},{value:"2",label:"2 Weeks"},{value:"4",label:"Month"}]}/>
              </div>
            )}
          </div>
          <div style={{background:T.amberBg,borderRadius:8,padding:"12px 14px",marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:560,color:T.amberText,marginBottom:4}}>Estimated Cost</div>
            <div style={{fontSize:20,fontWeight:600,color:T.amberText}}>
              £{(() => {
                const hrs = form.timeStart && form.timeEnd ? Math.max(0, (parseInt(form.timeEnd) - parseInt(form.timeStart))) : 12;
                return (parseFloat(form.rate)||0) * Math.abs(hrs||12);
              })()}
              <span style={{fontSize:12,fontWeight:400,marginLeft:4}}>for this shift</span>
            </div>
          </div>
          <Btn full onClick={()=>form.date?setDone(true):alert("Please select a date")}>Publish Shift →</Btn>
        </Card>
      </div>
    </Page>
  );
};
