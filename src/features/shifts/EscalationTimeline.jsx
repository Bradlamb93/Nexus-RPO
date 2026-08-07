import { T } from "../../theme/tokens.js";

/* ─── SHIFT ESCALATION TIMELINE (visible in shift detail / shift board) ─────────── */
export const EscalationTimeline = ({shift}) => {
  if(!shift) return null;
  const delay={tier1:0,tier2:30,tier3:60};
  const now=new Date("2026-03-11T17:45:00");
  const broadcast=new Date("2026-03-11T15:30:00");
  const minsElapsed=Math.floor((now-broadcast)/60000);
  const stages=[
    {label:"Tier 1 Broadcast",mins:0,     desc:"First Choice Nursing, ProCare Staffing",done:true,  active:minsElapsed>=0&&minsElapsed<30},
    {label:"Tier 2 Escalation",mins:30,   desc:"MedStaff UK notified",                  done:minsElapsed>=30, active:minsElapsed>=30&&minsElapsed<60},
    {label:"Tier 3 Escalation",mins:60,   desc:"CareForce notified",                     done:minsElapsed>=60, active:minsElapsed>=60&&minsElapsed<120},
    {label:"Auto-cancelled",   mins:120,  desc:"No cover — care home notified",           done:false, active:false},
  ];
  return (
    <div style={{padding:"14px 16px",background:T.raised,borderRadius:10,marginTop:12}}>
      <div style={{fontSize:11,fontWeight:560,color:T.muted,marginBottom:12,letterSpacing:"-0.006em"}}>Escalation Timeline — {minsElapsed}m since broadcast</div>
      <div style={{display:"flex",alignItems:"flex-start",gap:0,position:"relative"}}>
        {stages.map((s,i)=>(
          <div key={i} style={{flex:1,position:"relative"}}>
            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
              <div style={{width:28,height:28,borderRadius:"50%",background:s.done?T.green:s.active?T.amber:T.border,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1,position:"relative",transition:"all 0.3s"}}>
                <span style={{color:T.white,fontSize:12,fontWeight:560}}>{s.done?"✓":s.active?"●":""}</span>
              </div>
              {i<stages.length-1&&<div style={{position:"absolute",top:14,left:"50%",width:"100%",height:2,background:s.done?T.green:T.border,zIndex:0}}/>}
              <div style={{marginTop:8,textAlign:"center",padding:"0 4px"}}>
                <div style={{fontSize:11,fontWeight:560,color:s.active?T.amber:s.done?T.green:T.muted}}>{s.label}</div>
                <div style={{fontSize:9,color:T.muted,marginTop:2}}>+{s.mins}min</div>
                <div style={{fontSize:10,color:T.muted,marginTop:2,lineHeight:1.3}}>{s.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
