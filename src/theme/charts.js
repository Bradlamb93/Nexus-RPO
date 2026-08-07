import { FONT, T } from "./tokens.js";

/* Categorical series colours — held at a similar lightness so no one series
   shouts louder than the rest, and distinguishable without relying on hue alone. */
export const CHART_COLORS = ['#0071E3', '#5A55E0', '#0E9BAA', '#C86A12', '#1E8E4A', '#A8558F'];

export const PIE_COLORS = CHART_COLORS;

export const TOOLTIP_STYLE = {
  borderRadius:14, border:`1px solid ${T.hairline}`, boxShadow:T.sh3,
  fontFamily:FONT, fontSize:12.5, letterSpacing:'-0.008em', padding:'9px 12px',
  background:'rgba(255,255,255,0.92)', backdropFilter:'saturate(180%) blur(20px)',
};
