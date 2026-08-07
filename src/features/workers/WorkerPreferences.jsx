import { useState } from "react";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead } from "../../components/ui/Card.jsx";
import { Input } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { INIT_WORKER_PREFS, WORKERS } from "../../data/workers.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── WORKER FAVOURITES & BLACKLIST (care home) ────────────────────────────────── */
export const WorkerPreferences = ({user}) => {
  const [prefs,setPrefs]=useState(INIT_WORKER_PREFS);
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({workerId:"",type:"favourite",note:""});
  const careHome=user?.role==="carehome"?"Sunrise Care":null;
  const myPrefs=prefs.filter(p=>!careHome||p.careHome===careHome);
  const addPref=()=>{
    const w=WORKERS.find(x=>x.id===parseInt(form.workerId));
    if(!w)return;
    setPrefs(p=>[...p,{careHome:careHome||"Sunrise Care",workerId:w.id,workerName:w.name,type:form.type,addedBy:user?.name||"Karen Hughes",note:form.note}]);
    setShowForm(false);setForm({workerId:"",type:"favourite",note:""});
  };
  return (
    <Page title="Worker Preferences" sub="Flag preferred or restricted workers for your site" icon="star">
      <div style={{marginBottom:16}}><Btn onClick={()=>setShowForm(s=>!s)}>+ Add Preference</Btn></div>
      {showForm&&(
        <Card style={{padding:20,marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,marginBottom:4}}>Worker</label>
              <select value={form.workerId} onChange={e=>setForm(f=>({...f,workerId:e.target.value}))} style={{width:"100%",padding:"8px 10px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:12,fontFamily:FONT,outline:"none"}}>
                <option value="">Select worker…</option>
                {WORKERS.map(w=><option key={w.id} value={w.id}>{w.name} ({w.role})</option>)}
              </select>
            </div>
            <div><label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,marginBottom:4}}>Type</label>
              <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} style={{width:"100%",padding:"8px 10px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:12,fontFamily:FONT,outline:"none"}}>
                <option value="favourite">Favourite — request first</option>
                <option value="blocked">Blocked — do not place</option>
              </select>
            </div>
          </div>
          <div style={{marginTop:12}}><Input label="Note (visible only to your site)" value={form.note} onChange={v=>setForm(f=>({...f,note:v}))}/></div>
          <div style={{display:"flex",gap:8,marginTop:12}}><Btn onClick={addPref} disabled={!form.workerId}>Save</Btn><Btn variant="secondary" onClick={()=>setShowForm(false)}>Cancel</Btn></div>
        </Card>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {["favourite","blocked"].map(type=>(
          <Card key={type}>
            <CardHead title={type==="favourite"?"Preferred Workers":"Blocked Workers"} icon=""/>
            {myPrefs.filter(p=>p.type===type).length===0?<p style={{color:T.muted,fontSize:12,padding:"8px 0"}}>None set.</p>:
            myPrefs.filter(p=>p.type===type).map((p,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",padding:"10px 0",borderBottom:i<myPrefs.filter(x=>x.type===type).length-1?`1px solid ${T.border}`:"none"}}>
                <div>
                  <div style={{fontWeight:560,fontSize:13,color:T.text}}>{p.workerName}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:2}}>{p.note}</div>
                  <div style={{fontSize:10,color:T.ghost,marginTop:2}}>Added by {p.addedBy}</div>
                </div>
                <button onClick={()=>setPrefs(ps=>ps.filter((_,j)=>j!==prefs.indexOf(p)))} style={{background:"none",border:"none",cursor:"pointer",color:T.red,fontSize:13,fontWeight:560}}>✕</button>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </Page>
  );
};
