import { Icon } from "../Icon.jsx";
import { T } from "../../theme/tokens.js";

/* ─── ALERTS, MODALS & PROGRESS ─────────────────────────────────────────── */

export const Alert = ({type="info",children}) => {
  const cfg = {
    info:   {bg:T.accentBg, color:T.accentText, icon:"info"},
    warn:   {bg:T.amberBg,  color:T.amberText,  icon:"warning"},
    warning:{bg:T.amberBg,  color:T.amberText,  icon:"warning"},
    error:  {bg:T.redBg,    color:T.red,        icon:"warning"},
    success:{bg:T.greenBg,  color:T.green,      icon:"checkCircle"},
  };
  const c = cfg[type] || cfg.info;
  return (
    <div style={{background:c.bg,borderRadius:T.rSm,padding:"11px 14px",fontSize:13,color:T.text,marginBottom:12,lineHeight:1.55,letterSpacing:"-0.006em",display:"flex",gap:9,alignItems:"flex-start"}}>
      <span style={{color:c.color,display:"flex",marginTop:1.5,flexShrink:0}}><Icon name={c.icon} size={15}/></span>
      <div style={{minWidth:0}}>{children}</div>
    </div>
  );
};

export const Modal = ({title,onClose,children,width=520}) => (
  <div onClick={e=>{if(e.target===e.currentTarget&&onClose)onClose();}}
    style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.32)",backdropFilter:"saturate(150%) blur(6px)",WebkitBackdropFilter:"saturate(150%) blur(6px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:24,animation:"fcScrim 0.2s ease both"}}>
    <div style={{background:T.white,borderRadius:T.rLg,width:"100%",maxWidth:width,maxHeight:"88vh",overflow:"auto",boxShadow:T.sh4,animation:"fcRise 0.26s cubic-bezier(0.32,0.72,0,1) both"}}>
      <div style={{padding:"18px 22px",borderBottom:`1px solid ${T.divider}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,position:"sticky",top:0,background:"rgba(255,255,255,0.86)",backdropFilter:"saturate(180%) blur(20px)",WebkitBackdropFilter:"saturate(180%) blur(20px)",zIndex:1,borderRadius:`${T.rLg}px ${T.rLg}px 0 0`}}>
        <span style={{fontWeight:600,fontSize:16.5,color:T.text,letterSpacing:"-0.02em"}}>{title}</span>
        <button onClick={onClose} aria-label="Close"
          onMouseEnter={e=>{e.currentTarget.style.background="rgba(0,0,0,0.06)";e.currentTarget.style.color=T.text;}}
          onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=T.faint;}}
          style={{background:"transparent",border:"none",cursor:"pointer",color:T.faint,width:28,height:28,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:`background ${T.t}, color ${T.t}`}}>
          <Icon name="close" size={16}/>
        </button>
      </div>
      <div style={{padding:"22px"}}>{children}</div>
    </div>
  </div>
);

export const ProgressBar = ({value,max=100,color=T.green}) => (
  <div style={{height:6,background:"rgba(0,0,0,0.075)",borderRadius:T.rPill,overflow:"hidden"}}>
    <div style={{height:"100%",width:`${Math.min(100,(value/max)*100)}%`,background:color,borderRadius:T.rPill,transition:"width 0.45s cubic-bezier(0.4,0,0.2,1)"}}/>
  </div>
);
