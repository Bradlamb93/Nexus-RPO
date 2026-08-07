import { T } from "../theme/tokens.js";

/* Data fields are stored lowercase; labels used to rely on CSS uppercasing them. */
export const cap = v => typeof v === "string" && v ? v.charAt(0).toUpperCase() + v.slice(1) : v;

export const urgencyColor = u => u==="urgent"?T.red:u==="high"?T.amber:T.ghost;

export const TIER_CFG = {
  "Tier 1": {c:T.amberText, bg:T.amberBg,  border:"rgba(178,94,0,0.24)",  label:"Tier 1 — Priority"},
  "Tier 2": {c:T.accentText,bg:T.accentBg, border:"rgba(0,113,227,0.22)", label:"Tier 2 — Secondary"},
  "Tier 3": {c:T.muted,     bg:T.sunken,   border:T.border,               label:"Tier 3 — Supplementary"},
};

export const tierColor  = t => TIER_CFG[t]?.c  || T.muted;

export const tierBg     = t => TIER_CFG[t]?.bg  || T.sunken;
