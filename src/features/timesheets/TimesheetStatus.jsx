import { Badge } from "../../components/ui/Badge.jsx";
import { T } from "../../theme/tokens.js";

/* ─── TIMESHEET: SHARED HELPERS ──────────────────────────────────────────────── */
export const tsStatusColor = s => s==="approved"?{c:T.green,bg:T.greenBg}:s==="pending"?{c:T.blue,bg:T.blueBg}:s==="disputed"?{c:T.red,bg:T.redBg}:s==="invoiced"?{c:T.amber,bg:T.amberBg}:{c:T.muted,bg:T.sunken};

export const TsBadge = ({s}) => { const {c,bg}=tsStatusColor(s); return <Badge label={s.charAt(0).toUpperCase()+s.slice(1)} color={c} bg={bg} dot/>; };
