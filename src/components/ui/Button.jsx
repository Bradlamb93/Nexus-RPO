import { renderIcon } from "../Icon.jsx";
import { FONT, T } from "../../theme/tokens.js";

export const BTN_VARIANTS = {
  primary:  {background:T.accent, color:"#fff",   border:"1px solid transparent", hover:T.accentHover, press:T.accentPress, shadow:"0 1px 2px rgba(0,0,0,0.06)"},
  secondary:{background:T.white,  color:T.text,   border:`1px solid ${T.border}`, hover:T.raised,      press:T.sunken,      shadow:T.sh1},
  danger:   {background:T.white,  color:T.red,    border:`1px solid rgba(215,0,21,0.28)`, hover:T.redBg, press:"#FFE0DE",   shadow:T.sh1},
  ghost:    {background:"transparent", color:T.muted, border:"1px solid transparent", hover:"rgba(0,0,0,0.045)", press:"rgba(0,0,0,0.075)", shadow:"none"},
  dark:     {background:T.navy,   color:"#fff",   border:"1px solid transparent", hover:T.navyMid,     press:T.navyDeep,    shadow:"0 1px 2px rgba(0,0,0,0.10)"},
};

export const Btn = ({children,onClick,variant="primary",small,disabled,full,icon,type,title}) => {
  const v = BTN_VARIANTS[variant] || BTN_VARIANTS.primary;
  const set = (el,bg) => { if(!disabled) el.style.background = bg; };
  return (
    <button type={type} title={title} onClick={onClick} disabled={disabled}
      onMouseEnter={e=>set(e.currentTarget,v.hover)}
      onMouseLeave={e=>set(e.currentTarget,v.background)}
      onMouseDown={e=>set(e.currentTarget,v.press)}
      onMouseUp={e=>set(e.currentTarget,v.hover)}
      style={{background:v.background,color:v.color,border:v.border,boxShadow:disabled?"none":v.shadow,
        display:"inline-flex",alignItems:"center",justifyContent:"center",gap:small?5:6.5,
        padding:small?"5.5px 11px":"9px 17px",borderRadius:small?T.rXs:T.rSm,
        fontSize:small?12:13.5,fontWeight:btnWeight(variant),letterSpacing:"-0.01em",lineHeight:1.35,
        cursor:disabled?"not-allowed":"pointer",opacity:disabled?0.42:1,
        transition:`background ${T.t}, box-shadow ${T.t}, opacity ${T.t}`,
        width:full?"100%":undefined,whiteSpace:"nowrap",fontFamily:FONT}}>
      {icon && renderIcon(icon,small?13:15)}
      {children}
    </button>
  );
};

/* Filled buttons carry slightly more weight so they hold against their fill. */
export function btnWeight(variant){ return variant==="primary"||variant==="dark" ? 560 : 520; }

export const Pill = ({label,active,onClick,icon}) => (
  <button onClick={onClick}
    onMouseEnter={e=>{if(!active)e.currentTarget.style.background=T.raised}}
    onMouseLeave={e=>{if(!active)e.currentTarget.style.background=T.white}}
    style={{display:"inline-flex",alignItems:"center",gap:5.5,padding:"6px 13px",borderRadius:T.rPill,
      border:`1px solid ${active?"transparent":T.border}`,background:active?T.accent:T.white,
      color:active?"#fff":T.muted,fontSize:12.5,fontWeight:active?540:490,letterSpacing:"-0.008em",
      cursor:"pointer",fontFamily:FONT,transition:`background ${T.t}, color ${T.t}, border-color ${T.t}`,
      boxShadow:active?"0 1px 2px rgba(0,113,227,0.24)":"none",whiteSpace:"nowrap"}}>
    {icon && renderIcon(icon,13)}{label}
  </button>
);
