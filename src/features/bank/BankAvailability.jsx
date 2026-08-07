import { useState } from "react";
import { Btn } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { T } from "../../theme/tokens.js";

/* ─── BANK: AVAILABILITY ─────────────────────────────────────────────────────── */
export const BankAvailability = () => {
  const days=["Mon 11","Tue 12","Wed 13","Thu 14","Fri 15","Sat 16","Sun 17","Mon 18","Tue 19","Wed 20","Thu 21","Fri 22","Sat 23","Sun 24"];
  const [avail,setAvail]=useState({"Mon 11":"day","Tue 12":"both","Wed 13":"unavailable","Thu 14":"day","Fri 15":"both","Sat 16":"unavailable","Sun 17":"unavailable","Mon 18":"day","Tue 19":"day","Wed 20":"night","Thu 21":"both","Fri 22":"day","Sat 23":"unavailable","Sun 24":"unavailable"});
  const toggle=(d)=>setAvail(a=>({...a,[d]:a[d]==="unavailable"?"day":a[d]==="day"?"night":a[d]==="night"?"both":"unavailable"}));
  const cm={day:{bg:T.tealBg,color:T.teal,label:"Day"},night:{bg:T.purpleBg,color:T.purple,label:"Night"},both:{bg:T.greenBg,color:T.green,label:"Day & Night"},unavailable:{bg:T.sunken,color:T.ghost,label:"Unavailable"}};
  return (
    <Page title="Set My Availability" sub="Shifts will only be offered to you on days you mark as available" icon="calendar">
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:12,color:T.muted,fontWeight:600}}>Click a day to cycle:</span>
        {Object.entries(cm).map(([k,v])=><span key={k} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:8,background:v.bg,fontSize:11,fontWeight:560,color:v.color}}>{v.label}</span>)}
      </div>
      <Card>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d,i)=><div key={i} style={{padding:"8px",textAlign:"center",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",borderBottom:`1px solid ${T.border}`,background:T.raised,borderRight:i<6?`1px solid ${T.border}`:"none"}}>{d}</div>)}
          {days.map((d,i)=>{const c=cm[avail[d]||"unavailable"];return(<div key={i} onClick={()=>toggle(d)} style={{minHeight:80,padding:10,borderRight:i%7<6?`1px solid ${T.border}`:"none",borderBottom:i<7?`1px solid ${T.border}`:"none",cursor:"pointer",background:c.bg,transition:"background 0.15s",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}><span style={{fontSize:12,fontWeight:560,color:T.text}}>{d.split(" ")[1]}</span><span style={{fontSize:10,fontWeight:560,color:c.color,letterSpacing:"-0.006em"}}>{c.label}</span></div>);})}
        </div>
      </Card>
      <div style={{marginTop:16,display:"flex",gap:10}}>
        <Btn onClick={()=>alert("Availability saved. You'll now only receive shift notifications on your marked days.")}>Save Availability</Btn>
        <Btn variant="secondary" onClick={()=>setAvail(Object.fromEntries(days.map(d=>[d,"unavailable"])))}>Clear All</Btn>
      </div>
    </Page>
  );
};
