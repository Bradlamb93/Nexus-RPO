import { useState } from "react";
import { Icon } from "../../components/Icon.jsx";
import { FCCLogo } from "../../components/Logo.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Alert } from "../../components/ui/Feedback.jsx";
import { Input, Select } from "../../components/ui/Form.jsx";
import { FONT, FONTS, T, roleAccent } from "../../theme/tokens.js";

/* ─── AUTH SCREEN ────────────────────────────────────────────────────────────── */
export const AuthScreen = ({onAuth}) => {
  const [mode,setMode] = useState("login");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [name,setName] = useState("");
  const [role,setRole] = useState("admin");
  const [org,setOrg] = useState("");
  const [error,setError] = useState("");

  const handle = () => {
    if(!email||!password){setError("Please fill in all required fields.");return;}
    if(mode==="register"&&!name){setError("Please enter your name.");return;}
    setError("");
    onAuth({email,name:name||"Admin User",role,org:org||"Nexus RPO"});
  };

  return (
    <div style={{minHeight:"100vh",display:"grid",gridTemplateColumns:"minmax(0,1.05fr) minmax(0,1fr)",fontFamily:FONT,background:T.white}}>
      <style>{FONTS}</style>

      {/* Brand panel — near-black with a single cool light source, no gradient noise */}
      <div style={{background:T.navyDeep,display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"52px 56px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-22%",left:"-12%",width:620,height:620,borderRadius:"50%",background:"radial-gradient(circle,rgba(107,184,220,0.20) 0%,rgba(107,184,220,0) 68%)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",bottom:"-30%",right:"-18%",width:560,height:560,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,113,227,0.16) 0%,rgba(0,113,227,0) 70%)",pointerEvents:"none"}}/>

        <div style={{display:"flex",alignItems:"center",gap:10,position:"relative"}}>
          <FCCLogo size={32} showText={true} textColor="#FFFFFF" textSize={18}/>
        </div>

        <div style={{position:"relative",maxWidth:460}}>
          <h2 style={{fontSize:48,fontWeight:600,color:"#FFFFFF",lineHeight:1.08,marginBottom:20,letterSpacing:"-0.035em"}}>
            Healthcare workforce,<br/><span style={{color:"rgba(255,255,255,0.45)"}}>connected.</span>
          </h2>
          <p style={{color:"rgba(255,255,255,0.56)",fontSize:16,lineHeight:1.65,maxWidth:400,letterSpacing:"-0.012em"}}>
            One platform connecting care homes, agencies and workers — with full compliance tracking, automated invoicing and real-time shift management.
          </p>
          <div style={{marginTop:42,display:"flex",flexDirection:"column",gap:15}}>
            {[
              {icon:"briefcase",   t:"Neutral vendor shift distribution"},
              {icon:"shieldCheck", t:"Live compliance & credential tracking"},
              {icon:"receipt",     t:"Automated invoicing & rate cards"},
              {icon:"users",       t:"Multi-role access portals"},
            ].map((f,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:13,fontSize:14.5,color:"rgba(255,255,255,0.78)",letterSpacing:"-0.011em"}}>
                <span style={{width:30,height:30,borderRadius:10,background:"rgba(255,255,255,0.08)",color:"#6BB8DC",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Icon name={f.icon} size={16}/>
                </span>
                {f.t}
              </div>
            ))}
          </div>
        </div>

        <p style={{color:"rgba(255,255,255,0.26)",fontSize:12,position:"relative",letterSpacing:"-0.005em"}}>© 2026 Nexus RPO Ltd. All rights reserved.</p>
      </div>

      {/* Form panel */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"40px 56px",background:T.white,overflowY:"auto"}}>
        <div style={{width:"100%",maxWidth:392,animation:"fcRise 0.4s cubic-bezier(0.32,0.72,0,1) both"}}>
          <h2 style={{fontSize:30,fontWeight:600,color:T.text,marginBottom:7,letterSpacing:"-0.03em"}}>{mode==="login"?"Welcome back":"Create account"}</h2>
          <p style={{fontSize:14.5,color:T.muted,marginBottom:26,letterSpacing:"-0.01em"}}>{mode==="login"?"Sign in to your Nexus RPO portal.":"Set up your Nexus RPO account."}</p>
          {error && <Alert type="error">{error}</Alert>}

          {/* Demo quick-access — a quiet, uniform list rather than a row of coloured chips */}
          {mode==="login" && (
            <div style={{marginBottom:26}}>
              <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:11}}>
                <span style={{fontSize:12.5,fontWeight:510,color:T.faint,letterSpacing:"-0.005em",whiteSpace:"nowrap"}}>Or explore a demo portal</span>
                <span style={{flex:1,height:1,background:T.divider}}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
                {[
                  {r:"admin",       l:"Nexus Admin",   icon:"grid",      name:"Rachel Obi",     org:"Nexus RPO"},
                  {r:"clientadmin", l:"Client Admin",  icon:"building",  name:"Margaret Cole",  org:"Sunrise Healthcare Group"},
                  {r:"carehome",    l:"Site Manager",  icon:"hospital",  name:"Karen Hughes",   org:"Sunrise Care"},
                  {r:"agency",      l:"Agency",        icon:"briefcase", name:"Laura Bennett",  org:"First Choice Nursing"},
                  {r:"bank",        l:"Bank Staff",    icon:"user",      name:"Diane Foster",   org:"Bank Staff"},
                ].map((x,i,arr)=>(
                  <button key={x.r}
                    onClick={()=>onAuth({email:"demo@example.com",name:x.name,role:x.r,org:x.org})}
                    onMouseEnter={e=>{e.currentTarget.style.background=T.raised;e.currentTarget.style.borderColor=T.border;}}
                    onMouseLeave={e=>{e.currentTarget.style.background=T.white;e.currentTarget.style.borderColor=T.hairline;}}
                    style={{display:"flex",alignItems:"center",gap:9,padding:"10px 12px",borderRadius:T.rSm,
                      background:T.white,border:`1px solid ${T.hairline}`,boxShadow:T.sh1,
                      fontSize:13,fontWeight:500,letterSpacing:"-0.011em",cursor:"pointer",color:T.text,
                      fontFamily:FONT,textAlign:"left",transition:`background ${T.t}, border-color ${T.t}`,
                      gridColumn:i===arr.length-1&&arr.length%2?"span 2":undefined}}>
                    <span style={{color:roleAccent(x.r),display:"flex",flexShrink:0}}><Icon name={x.icon} size={16}/></span>
                    {x.l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {mode==="register" && <Input label="Full name" value={name} onChange={setName} placeholder="Your name" required />}
          <Input label="Email address" type="email" value={email} onChange={setEmail} placeholder="you@organisation.co.uk" required />
          <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />
          {mode==="register" && <>
            <Select label="Your role" value={role} onChange={setRole} options={[{value:"admin",label:"Neutral Vendor Admin"},{value:"carehome",label:"Care Home Manager"},{value:"agency",label:"Agency Coordinator"}]} />
            <Input label="Organisation" value={org} onChange={setOrg} placeholder="Your organisation name" />
          </>}

          <div style={{marginTop:20,marginBottom:18}}>
            <Btn onClick={handle} full>{mode==="login"?"Sign in":"Create account"}</Btn>
          </div>

          <p style={{fontSize:13.5,color:T.muted,textAlign:"center",letterSpacing:"-0.008em"}}>
            {mode==="login"?"Don't have an account?":"Already have an account?"}{" "}
            <button onClick={()=>setMode(m=>m==="login"?"register":"login")}
              style={{background:"none",border:"none",color:T.accent,fontWeight:520,cursor:"pointer",fontSize:13.5,fontFamily:FONT,letterSpacing:"-0.008em",padding:0}}>
              {mode==="login"?"Sign up":"Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
