import { Icon, renderIcon } from "../Icon.jsx";
import { T } from "../../theme/tokens.js";

export const Stat = ({label,value,sub,accent,icon,trend,trendUp,tone}) => {
  const tint = tone || (accent ? T.accent : T.muted);
  return (
    <div style={{background:T.white,borderRadius:T.r,padding:"18px 20px",border:`1px solid ${T.hairline}`,boxShadow:T.sh1,position:"relative"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
        <div style={{minWidth:0}}>
          <div style={{fontSize:12.5,color:T.muted,fontWeight:510,marginBottom:9,letterSpacing:"-0.005em"}}>{label}</div>
          <div style={{fontSize:30,fontWeight:600,color:T.text,lineHeight:1,letterSpacing:"-0.028em",fontVariantNumeric:"tabular-nums"}}>{value}</div>
          {sub && <div style={{fontSize:12,color:T.faint,marginTop:7,letterSpacing:"-0.005em"}}>{sub}</div>}
          {trend && (
            <div style={{fontSize:12,marginTop:7,fontWeight:520,color:trendUp?T.green:T.red,display:"flex",alignItems:"center",gap:3.5}}>
              <Icon name="trendingUp" size={13} style={trendUp?undefined:{transform:"scaleY(-1)"}}/>{trend}
            </div>
          )}
        </div>
        {icon && (
          <div style={{width:34,height:34,borderRadius:T.rSm,background:`${tint}14`,color:tint,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            {renderIcon(icon,18)}
          </div>
        )}
      </div>
    </div>
  );
};

export const Grid = ({cols=4,gap=16,children,style={}}) => (
  <div style={{display:"grid",gridTemplateColumns:`repeat(${cols},minmax(0,1fr))`,gap,marginBottom:20,...style}}>{children}</div>
);

export const Card = ({children,style={}}) => (
  <div style={{background:T.white,borderRadius:T.r,border:`1px solid ${T.hairline}`,boxShadow:T.sh1,...style}}>{children}</div>
);

export const CardHead = ({title,sub,action,icon}) => (
  <div style={{padding:"15px 20px",borderBottom:`1px solid ${T.divider}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12}}>
    <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
      {icon && <span style={{color:T.faint,display:"flex"}}>{renderIcon(icon,17)}</span>}
      <div style={{minWidth:0}}>
        <div style={{fontWeight:590,fontSize:14.5,color:T.text,letterSpacing:"-0.016em"}}>{title}</div>
        {sub && <div style={{fontSize:12,color:T.faint,marginTop:2,letterSpacing:"-0.005em"}}>{sub}</div>}
      </div>
    </div>
    {action}
  </div>
);
