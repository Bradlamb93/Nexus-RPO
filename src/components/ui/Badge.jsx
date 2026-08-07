import { renderIcon } from "../Icon.jsx";
import { urgencyColor } from "../../lib/format.js";
import { T } from "../../theme/tokens.js";

/* ─── ATOMS ──────────────────────────────────────────────────────────────────── */
export const Badge = ({label,color=T.blue,bg=T.blueBg,dot,icon}) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:5,padding:"3.5px 9px",borderRadius:T.rPill,fontSize:11.5,fontWeight:590,letterSpacing:"-0.005em",color,background:bg,whiteSpace:"nowrap",lineHeight:1.45}}>
    {dot && <span style={{width:5.5,height:5.5,borderRadius:"50%",background:color,display:"inline-block",flexShrink:0}}/>}
    {icon && renderIcon(icon,12)}
    {label}
  </span>
);

export const statusConfig = {
  open:{label:"Open",color:T.blue,bg:T.blueBg},
  pending:{label:"Pending",color:T.yellow,bg:T.yellowBg},
  filled:{label:"Filled",color:T.green,bg:T.greenBg},
  paid:{label:"Paid",color:T.green,bg:T.greenBg},
  draft:{label:"Draft",color:T.muted,bg:T.sunken},
  overdue:{label:"Overdue",color:T.red,bg:T.redBg},
  active:{label:"Active",color:T.green,bg:T.greenBg},
  verified:{label:"Verified",color:T.green,bg:T.greenBg},
  expiring:{label:"Expiring",color:T.yellow,bg:T.yellowBg},
  expired:{label:"Expired",color:T.red,bg:T.redBg},
  valid:{label:"Valid",color:T.green,bg:T.greenBg},
};

export const SBadge = ({s}) => { const c = statusConfig[s]||statusConfig.open; return <Badge label={c.label} color={c.color} bg={c.bg} dot />; };

export const UrgDot = ({u}) => <span style={{display:"inline-block",width:7,height:7,borderRadius:"50%",background:urgencyColor(u),marginRight:6,flexShrink:0}}/>;
