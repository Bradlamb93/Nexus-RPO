import { useState } from "react";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead } from "../../components/ui/Card.jsx";
import { ProgressBar } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { INIT_AGENCY_CHECKLISTS } from "../../data/agencies.js";
import { T } from "../../theme/tokens.js";

/* ─── AGENCY ONBOARDING CHECKLIST ─────────────────────────────────────────────── */
export const AgencyOnboarding = ({user}) => {
  const [checklists,setChecklists]=useState(INIT_AGENCY_CHECKLISTS);
  const [selected,setSelected]=useState(checklists[0]?.agencyId||null);
  const toggle=(agencyId,itemId)=>setChecklists(cs=>cs.map(c=>c.agencyId===agencyId?{...c,items:c.items.map(i=>i.id===itemId?{...i,done:!i.done,doneDate:!i.done?"2026-03-10":null}:i)}:c));
  const cl=checklists.find(c=>c.agencyId===selected)||checklists[0];
  const pct=cl?Math.round((cl.items.filter(i=>i.done).length/cl.items.length)*100):0;
  return (
    <Page title="Agency Onboarding Checklists" sub="Track agency setup progress from contract to first shift" icon="checkCircle">
      <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:16}}>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {checklists.map(c=>{
            const p=Math.round((c.items.filter(i=>i.done).length/c.items.length)*100);
            return(
              <div key={c.agencyId} onClick={()=>setSelected(c.agencyId)} style={{padding:"12px 14px",borderRadius:10,border:`1px solid ${selected===c.agencyId?T.amber:T.border}`,background:selected===c.agencyId?T.amberBg:T.white,cursor:"pointer"}}>
                <div style={{fontWeight:560,fontSize:12,color:T.text,marginBottom:4}}>{c.agencyName}</div>
                <ProgressBar value={p} color={p===100?T.green:p>=50?T.amberText:T.red}/>
                <div style={{fontSize:11,color:T.muted,marginTop:3}}>{p}% complete</div>
              </div>
            );
          })}
          <Btn variant="secondary" small onClick={()=>navigate&&navigate("agencies")}>+ Add Agency</Btn>
        </div>
        {cl&&(
          <Card>
            <CardHead title={cl.agencyName} icon="briefcase"/>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,padding:"12px 14px",background:pct===100?T.greenBg:T.amberBg,borderRadius:10}}>
              <div style={{flex:1}}><ProgressBar value={pct} color={pct===100?T.green:T.amberText}/></div>
              <span style={{fontWeight:600,fontSize:14,color:pct===100?T.green:T.amberText}}>{pct}%</span>
              <span style={{fontSize:12,color:T.muted}}>{cl.items.filter(i=>i.done).length}/{cl.items.length} complete</span>
            </div>
            {cl.items.map(item=>(
              <div key={item.id} onClick={()=>toggle(cl.agencyId,item.id)} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 0",borderBottom:`1px solid ${T.border}`,cursor:"pointer"}}>
                <div style={{width:22,height:22,borderRadius:8,border:`2px solid ${item.done?T.green:T.border}`,background:item.done?T.green:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  {item.done&&<span style={{color:T.white,fontSize:12,lineHeight:1}}>✓</span>}
                </div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:item.done?500:700,fontSize:13,color:item.done?T.muted:T.text,textDecoration:item.done?"line-through":"none"}}>{item.label}</div>
                  {item.doneDate&&<div style={{fontSize:10,color:T.green,marginTop:2}}>Completed {item.doneDate}</div>}
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </Page>
  );
};
