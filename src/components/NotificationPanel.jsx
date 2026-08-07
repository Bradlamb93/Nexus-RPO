import { useState } from "react";
import { Icon } from "./Icon.jsx";
import { INIT_NOTIFICATIONS } from "../data/notifications.js";
import { FONT, T } from "../theme/tokens.js";

/* ═══════════════════════════════════════════════════════════════════════════════
   NEW FEATURE COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════════ */

/* ─── NOTIFICATION CENTRE ────────────────────────────────────────────────────── */
export const NotificationPanel = ({role,onClose,onNavigate}) => {
  const [notes,setNotes] = useState(INIT_NOTIFICATIONS[role]||[]);
  const unread = notes.filter(n=>!n.read).length;
  const markAll = () => setNotes(n=>n.map(x=>({...x,read:true})));
  const typeIcon = {urgent_shift:"siren",rate_uplift:"trendingUp",invoice_overdue:"receipt",compliance:"shield",contract:"document",message:"message",budget_alert:"money",timesheet:"clock"};
  const typeColor = {urgent_shift:T.red,rate_uplift:T.amber,invoice_overdue:T.amber,compliance:T.purple,contract:T.accent,message:T.teal,budget_alert:T.amberText,timesheet:T.green};
  return (
    <div style={{position:"fixed",top:0,right:0,bottom:0,width:392,background:T.white,boxShadow:T.sh4,zIndex:1000,display:"flex",flexDirection:"column",fontFamily:FONT,animation:"fcFade 0.24s ease both"}}>
      <div style={{padding:"18px 20px",borderBottom:`1px solid ${T.divider}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
        <div>
          <div style={{fontWeight:600,fontSize:17,color:T.text,letterSpacing:"-0.022em"}}>Notifications</div>
          <div style={{fontSize:12.5,color:T.faint,marginTop:2}}>{unread} unread</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          {unread>0&&<button onClick={markAll} style={{fontSize:13,fontWeight:510,color:T.accent,background:"none",border:"none",cursor:"pointer",fontFamily:FONT,letterSpacing:"-0.008em",padding:"4px 6px",borderRadius:T.rXs}}>Mark all read</button>}
          <button onClick={onClose} aria-label="Close"
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,0,0,0.06)";e.currentTarget.style.color=T.text;}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.faint;}}
            style={{background:"transparent",border:"none",cursor:"pointer",color:T.faint,width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:`background ${T.t}, color ${T.t}`}}>
            <Icon name="close" size={16}/>
          </button>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto"}}>
        {notes.length===0?<div style={{padding:40,textAlign:"center",color:T.muted,fontSize:13}}>You're all caught up!</div>:notes.map(n=>(
          <div key={n.id} onClick={()=>{setNotes(ns=>ns.map(x=>x.id===n.id?{...x,read:true}:x));if(n.action&&onNavigate)onNavigate(n.action);onClose();}}
            style={{padding:"14px 20px",borderBottom:`1px solid ${T.divider}`,cursor:"pointer",background:n.read?"transparent":T.accentBg,display:"flex",gap:12,alignItems:"flex-start",transition:`background ${T.t}`}}
            onMouseEnter={e=>e.currentTarget.style.background=n.read?T.raised:T.accentBg} onMouseLeave={e=>e.currentTarget.style.background=n.read?"transparent":T.accentBg}>
            <div style={{width:34,height:34,borderRadius:T.rSm,background:typeColor[n.type]+"1A",color:typeColor[n.type],display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Icon name={typeIcon[n.type]||"bell"} size={17}/>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                <span style={{fontWeight:560,fontSize:13.5,color:T.text,letterSpacing:"-0.012em"}}>{n.title}</span>
                {!n.read&&<span style={{width:6.5,height:6.5,borderRadius:"50%",background:T.accent,flexShrink:0,display:"inline-block"}}/>}
              </div>
              <div style={{fontSize:12.5,color:T.muted,lineHeight:1.5,marginBottom:5,letterSpacing:"-0.006em"}}>{n.body}</div>
              <div style={{fontSize:11.5,color:T.ghost}}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
