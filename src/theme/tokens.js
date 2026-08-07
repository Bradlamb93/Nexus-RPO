/* ─── TYPOGRAPHY ─────────────────────────────────────────────────────────────
   San Francisco where it exists (Apple platforms), Inter as the metric-compatible
   fallback everywhere else. Inter is only fetched by browsers that need it.      */
export const FONT = `-apple-system,BlinkMacSystemFont,"SF Pro Display","SF Pro Text","Inter","Helvetica Neue","Segoe UI",Roboto,Arial,sans-serif`;

export const FONT_MONO = `"SF Mono",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace`;

/* ─── GLOBAL RESET & CHROME ──────────────────────────────────────────────────── */
export const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}
body{font-family:${FONT};background:#F5F5F7;color:#1D1D1F;letter-spacing:-0.011em;font-synthesis-weight:none}
input,select,textarea,button{font-family:inherit;letter-spacing:inherit;color:inherit}
button{-webkit-tap-highlight-color:transparent}
h1,h2,h3,h4{font-weight:600;letter-spacing:-0.021em}

/* Thin overlay scrollbars, Apple-style — invisible until there's something to scroll */
::-webkit-scrollbar{width:10px;height:10px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.16);border-radius:99px;border:3px solid transparent;background-clip:content-box}
::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,0.30);background-clip:content-box;border:3px solid transparent}
::-webkit-scrollbar-corner{background:transparent}

::selection{background:rgba(0,113,227,0.20)}
:focus{outline:none}
:focus-visible{outline:3px solid rgba(0,113,227,0.36);outline-offset:2px;border-radius:7px}
input:focus,select:focus,textarea:focus{border-color:#0071E3 !important;box-shadow:0 0 0 3.5px rgba(0,113,227,0.15)}
input::placeholder,textarea::placeholder{color:#A1A1A6}

/* Native select chevron replaced with a monoline glyph */
select{appearance:none;-webkit-appearance:none;
  background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236E6E73' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 11px center;padding-right:34px !important}

@keyframes fcFade{from{opacity:0}to{opacity:1}}
@keyframes fcRise{from{opacity:0;transform:translateY(10px) scale(0.99)}to{opacity:1;transform:none}}
@keyframes fcScrim{from{opacity:0}to{opacity:1}}
@keyframes fcPulse{0%,100%{opacity:1}50%{opacity:0.45}}
@media (prefers-reduced-motion:reduce){*{animation-duration:0.01ms !important;transition-duration:0.01ms !important}}`;

/* ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
   Neutral greyscale base carrying one action colour. The accent is the logo's
   outer ring (#6BB8DC) deepened to a hue that passes contrast on white, so the
   brand mark and the primary button finally agree with each other.
   Amber is a *status* colour only — it no longer competes for attention.       */
export const T = {
  /* dark chrome */
  navy:'#1D1D1F', navyMid:'#2C2C2E', navyDeep:'#161617',
  navyBorder:'rgba(255,255,255,0.10)',

  /* action */
  accent:'#0071E3', accentHover:'#0077ED', accentPress:'#0062C4',
  accentBg:'#EBF4FE', accentText:'#0058B0', accentRing:'rgba(0,113,227,0.15)',
  blue:'#0071E3', blueBg:'#EBF4FE',

  /* status */
  green:'#1E8E4A', greenBg:'#E6F6ED',
  red:'#D70015',   redBg:'#FFEDEC',
  amber:'#B25E00', amberDark:'#8A4A00', amberBg:'#FFF4E3', amberText:'#7A4100',
  yellow:'#B25E00', yellowBg:'#FFF4E3',
  purple:'#5A55E0', purpleBg:'#EFEEFD',
  teal:'#0E7C8A',   tealBg:'#E2F4F7',

  /* surfaces */
  white:'#FFFFFF', bg:'#F5F5F7', raised:'#FBFBFD', sunken:'#F0F0F3',
  border:'#E4E4E8', hairline:'rgba(0,0,0,0.07)', divider:'rgba(0,0,0,0.055)',

  /* ink */
  text:'#1D1D1F', muted:'#6E6E73', faint:'#8E8E93', ghost:'#A1A1A6',

  /* elevation — diffuse and low-contrast, never a hard drop shadow */
  sh1:'0 1px 2px rgba(0,0,0,0.04)',
  sh2:'0 1px 3px rgba(0,0,0,0.05), 0 6px 16px -6px rgba(0,0,0,0.08)',
  sh3:'0 2px 6px rgba(0,0,0,0.05), 0 16px 36px -12px rgba(0,0,0,0.14)',
  sh4:'0 8px 24px rgba(0,0,0,0.10), 0 32px 72px -16px rgba(0,0,0,0.24)',

  /* geometry */
  r:14, rSm:10, rXs:7, rLg:20, rPill:980,

  /* motion */
  ease:'cubic-bezier(0.4,0,0.2,1)', t:'0.2s cubic-bezier(0.4,0,0.2,1)',
};

/* Role tinting — each portal keeps a quiet identity without four clashing hues */
export const ROLE_ACCENT = {
  admin:T.accent, clientadmin:T.purple, carehome:T.accent,
  agency:T.accent, bank:T.teal,
};

export const roleAccent = r => ROLE_ACCENT[r] || T.accent;

/* ─── BUDGET DATA ─────────────────────────────────────────────────────────────── */
/* ─── BANK STAFF RATES ───────────────────────────────────────────────────────── */
export const CA_PURPLE    = T.purple;

export const CA_PURPLE_BG = T.purpleBg;

/* ─── CHROME THEME ───────────────────────────────────────────────────────────
   The sidebar and top bar render in either a light translucent treatment or a
   dark one. The content area stays light in both — the toggle governs chrome
   only, the way a pro Mac app lets you pick a window appearance.              */
export const CHROME = {
  light: {
    surface:'rgba(250,250,252,0.80)', solid:'#FAFAFC', border:T.hairline,
    logo:T.text, label:T.faint, name:T.text, sub:T.muted,
    item:T.muted, itemHover:T.text, itemHoverBg:'rgba(0,0,0,0.045)',
    well:'rgba(0,0,0,0.035)', footer:T.ghost, iconOpacity:0.85,
  },
  dark: {
    surface:'rgba(29,29,31,0.94)', solid:'#1D1D1F', border:T.navyBorder,
    logo:'#FFFFFF', label:'rgba(255,255,255,0.42)', name:'#FFFFFF', sub:'rgba(255,255,255,0.5)',
    item:'rgba(255,255,255,0.58)', itemHover:'rgba(255,255,255,0.95)', itemHoverBg:'rgba(255,255,255,0.07)',
    well:'rgba(255,255,255,0.06)', footer:'rgba(255,255,255,0.28)', iconOpacity:0.9,
  },
};
