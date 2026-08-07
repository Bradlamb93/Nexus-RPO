import { renderIcon } from "../Icon.jsx";
import { FONT, FONTS, T } from "../../theme/tokens.js";

/* ─── PAGE SHELL ────────────────────────────────────────────────────────── */

export const Page = ({title,sub,action,children,icon}) => (
  <div style={{flex:1,padding:"34px 38px 48px",background:T.bg,minHeight:"100vh",fontFamily:FONT,maxWidth:"100%",overflow:"hidden",animation:"fcFade 0.28s ease both"}}>
    <style>{FONTS}</style>
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:20,marginBottom:26}}>
      <div style={{minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:11}}>
          {icon && <span style={{color:T.ghost,display:"flex"}}>{renderIcon(icon,22)}</span>}
          <h1 style={{fontSize:27,fontWeight:600,color:T.text,letterSpacing:"-0.028em",lineHeight:1.15}}>{title}</h1>
        </div>
        {sub && <p style={{fontSize:14,color:T.muted,marginTop:5,letterSpacing:"-0.008em"}}>{sub}</p>}
      </div>
      {action}
    </div>
    {children}
  </div>
);
