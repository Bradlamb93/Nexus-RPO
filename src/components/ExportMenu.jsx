import React from "react";
import { Icon, renderIcon } from "./Icon.jsx";
import { FONT, T } from "../theme/tokens.js";

// ExportButton — drop-in component for any page
export const ExportMenu = ({exports}) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef(null);
  React.useEffect(()=>{
    const handle = e => { if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handle);
    return ()=>document.removeEventListener("mousedown", handle);
  },[]);
  return (
    <div ref={ref} style={{position:"relative",display:"inline-block"}}>
      <button onClick={()=>setOpen(o=>!o)}
        onMouseEnter={e=>e.currentTarget.style.background=T.raised}
        onMouseLeave={e=>e.currentTarget.style.background=T.white}
        style={{display:"flex",alignItems:"center",gap:6.5,padding:"8.5px 14px",borderRadius:T.rSm,border:`1px solid ${T.border}`,background:T.white,fontWeight:520,fontSize:13,letterSpacing:"-0.01em",cursor:"pointer",fontFamily:FONT,color:T.text,boxShadow:T.sh1,transition:`background ${T.t}`}}>
        <Icon name="download" size={15}/>Export
        <Icon name="chevronDown" size={14} style={{color:T.faint,transition:`transform ${T.t}`,transform:open?"rotate(180deg)":"none"}}/>
      </button>
      {open&&(
        <div style={{position:"absolute",right:0,top:"calc(100% + 7px)",background:"rgba(255,255,255,0.88)",backdropFilter:"saturate(180%) blur(24px)",WebkitBackdropFilter:"saturate(180%) blur(24px)",border:`1px solid ${T.hairline}`,borderRadius:T.r,boxShadow:T.sh3,zIndex:100,minWidth:224,overflow:"hidden",padding:5,animation:"fcRise 0.18s cubic-bezier(0.32,0.72,0,1) both"}}>
          {exports.map((ex,i)=>(
            <button key={i} onClick={()=>{ex.fn();setOpen(false);}}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,0.05)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
              style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"9px 11px",background:"transparent",border:"none",borderRadius:T.rXs,cursor:"pointer",fontFamily:FONT,fontSize:13,color:T.text,textAlign:"left",transition:`background ${T.t}`}}>
              <span style={{color:T.faint,display:"flex"}}>{renderIcon(ex.icon,16)}</span>
              <div>
                <div style={{fontWeight:510,letterSpacing:"-0.008em"}}>{ex.label}</div>
                {ex.desc&&<div style={{fontSize:11.5,color:T.faint,marginTop:1}}>{ex.desc}</div>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
