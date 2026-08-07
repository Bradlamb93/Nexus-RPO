import { FONT } from "../theme/tokens.js";

/* ─── LOGO ───────────────────────────────────────────────────────────────────── */
export const FCCLogo = ({size=32,textColor="#ffffff",showText=false,textSize=17}) => (
  <div style={{display:"flex",alignItems:"center",gap:9}}>
    {/* Nexus RPO orbital logo mark — two interlocking elliptical rings */}
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer blue ring — tilted ellipse */}
      <ellipse cx="50" cy="50" rx="38" ry="16"
        stroke="#6BB8DC" strokeWidth="5.5" fill="none"
        transform="rotate(-35 50 50)"/>
      {/* Inner grey ring — tilted opposite */}
      <ellipse cx="50" cy="50" rx="38" ry="16"
        stroke="#9CA3AF" strokeWidth="4.5" fill="none"
        transform="rotate(35 50 50)"/>
      {/* Small centre dot */}
      <circle cx="50" cy="50" r="4" fill="#6BB8DC"/>
    </svg>
    {showText && (
      <span style={{fontFamily:FONT,fontWeight:600,fontSize:textSize,color:textColor,letterSpacing:"-0.02em",lineHeight:1}}>
        Nexus <span style={{fontWeight:400,opacity:0.55}}>RPO</span>
      </span>
    )}
  </div>
);
