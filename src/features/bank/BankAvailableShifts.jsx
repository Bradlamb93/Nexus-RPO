import { useState } from "react";
import { Icon } from "../../components/Icon.jsx";
import { Badge, UrgDot } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead } from "../../components/ui/Card.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { INIT_CLIENT_GROUPS } from "../../data/clients.js";
import { BANK_SHIFTS, BANK_STAFF } from "../../data/workers.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── BANK: AVAILABLE SHIFTS ─────────────────────────────────────────────────── */
export const BankAvailableShifts = ({user}) => {
  const [shifts,   setShifts]    = useState(BANK_SHIFTS);
  const [filterGroup,  setFilterGroup]  = useState("all");
  const [filterHome,   setFilterHome]   = useState("all");
  const [filterRole,   setFilterRole]   = useState("all");
  const me = BANK_STAFF.find(w=>w.name===user.name)||BANK_STAFF[0];

  const groups = INIT_CLIENT_GROUPS;
  const groupForHome = (homeName) => groups.find(g=>g.locations.some(l=>l.name===homeName));

  const homesInGroup = filterGroup==="all"
    ? [...new Set(shifts.filter(s=>s.status==="bank-open").map(s=>s.carehome))]
    : (groups.find(g=>g.id===filterGroup)?.locations.map(l=>l.name)||[])
        .filter(name=>shifts.some(s=>s.carehome===name&&s.status==="bank-open"));

  const available = shifts.filter(s => {
    if (s.status !== "bank-open") return false;
    if (filterGroup !== "all") { const grp=groupForHome(s.carehome); if(!grp||grp.id!==filterGroup) return false; }
    if (filterHome !== "all" && s.carehome !== filterHome) return false;
    if (filterRole !== "all" && s.role !== filterRole)     return false;
    return true;
  });
  const claimed = shifts.filter(s=>s.status==="bank-claimed"&&s.claimedBy===user.name);
  const claim = (id) => setShifts(prev=>prev.map(s=>s.id===id?{...s,status:"bank-claimed",claimedBy:user.name}:s));

  const hasFilters = filterGroup!=="all"||filterHome!=="all"||filterRole!=="all";
  const roles = [...new Set(shifts.filter(s=>s.status==="bank-open").map(s=>s.role))];

  const selStyle = (active) => ({
    padding:"8px 12px", border:`1px solid ${active?T.teal:T.border}`,
    borderRadius:8, fontSize:12, fontFamily:FONT,
    color:T.text, background:active?T.tealBg:T.white, cursor:"pointer",
    fontWeight:active?700:400, outline:"none", minWidth:0,
  });

  return (
    <Page title="Available Shifts" sub="Your priority window — claim before it goes to agencies" icon="clipboard">
      <div style={{background:`linear-gradient(135deg,${T.teal}18,${T.tealBg})`,borderRadius:14,padding:"13px 18px",marginBottom:16,border:`1px solid ${T.teal}44`,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
        <span style={{fontSize:18}}><Icon name="timer" size={15}/></span>
        <span style={{fontSize:13,color:T.text}}><strong style={{color:T.teal}}>First refusal is yours.</strong> These shifts expire from your window soon — once the timer hits zero they're sent to all agencies automatically.</span>
      </div>

      {/* ── Filter bar ──────────────────────────────────────────────────────── */}
      <Card style={{padding:"14px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto",gap:10,alignItems:"end"}}>
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Group Owner</label>
            <select value={filterGroup} onChange={e=>{setFilterGroup(e.target.value);setFilterHome("all");}} style={selStyle(filterGroup!=="all")}>
              <option value="all">All Groups</option>
              {groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Care Home</label>
            <select value={filterHome} onChange={e=>setFilterHome(e.target.value)} style={selStyle(filterHome!=="all")} disabled={homesInGroup.length===0}>
              <option value="all">{filterGroup==="all"?"All Homes":"All in Group"}</option>
              {homesInGroup.map(h=><option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Role</label>
            <select value={filterRole} onChange={e=>setFilterRole(e.target.value)} style={selStyle(filterRole!=="all")}>
              <option value="all">All Roles</option>
              {roles.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div style={{paddingBottom:1}}>
            <label style={{display:"block",fontSize:10,fontWeight:560,color:"transparent",marginBottom:5}}>_</label>
            <button onClick={()=>{setFilterGroup("all");setFilterHome("all");setFilterRole("all");}} disabled={!hasFilters}
              style={{padding:"8px 12px",borderRadius:8,border:`1px solid ${hasFilters?T.red:T.border}`,background:hasFilters?T.redBg:"transparent",color:hasFilters?T.red:T.muted,fontSize:12,fontWeight:560,cursor:hasFilters?"pointer":"default",fontFamily:FONT}}>
              {hasFilters?"✕ Clear":"Filters"}
            </button>
          </div>
        </div>
        {hasFilters&&(
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`}}>
            {filterGroup!=="all"&&<span style={{fontSize:11,fontWeight:560,padding:"3px 10px",borderRadius:20,background:T.tealBg,color:T.teal}}>Group: {groups.find(g=>g.id===filterGroup)?.name}</span>}
            {filterHome!=="all"&&<span style={{fontSize:11,fontWeight:560,padding:"3px 10px",borderRadius:20,background:T.tealBg,color:T.teal}}>Home: {filterHome}</span>}
            {filterRole!=="all"&&<span style={{fontSize:11,fontWeight:560,padding:"3px 10px",borderRadius:20,background:T.tealBg,color:T.teal}}>Role: {filterRole}</span>}
            <span style={{fontSize:11,color:T.muted,padding:"3px 6px"}}>{available.length} shift{available.length!==1?"s":""} shown</span>
          </div>
        )}
      </Card>

      {available.length===0?(
        <Card style={{padding:40,textAlign:"center"}}><div style={{marginBottom:12,display:"flex",justifyContent:"center",color:T.ghost}}><Icon name="sparkle" size={30} stroke={1.5}/></div><div style={{fontWeight:560,fontSize:15,marginBottom:6}}>{hasFilters?"No shifts match those filters":"No shifts in window right now"}</div><p style={{color:T.muted,fontSize:13}}>{hasFilters?"Try adjusting or clearing your filters.":"You'll be notified when new shifts are published. Check back soon."}</p></Card>
      ):(
        <Card>
          <Table headers={["","Group","Care Home","Role","Date","Time","Rate","Est. Pay","Window","Action"]}
            rows={available.map(s=>{
              const hrs=s.time.includes("–")?12:8;
              const urgent=s.bankWindowMins<60;
              const grp=groupForHome(s.carehome);
              return(
                <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`,background:urgent?"#f0fdfc":"transparent"}}>
                  <Td><UrgDot u={s.urgency}/></Td>
                  <Td><span style={{fontSize:11,color:T.muted,fontWeight:600}}>{grp?.name||"—"}</span></Td>
                  <Td bold>{s.carehome}</Td>
                  <Td><Badge label={s.role} color={T.teal} bg={T.tealBg}/></Td>
                  <Td>{s.date}</Td><Td>{s.time}</Td>
                  <Td bold>£{s.rate}{"/hr"}</Td>
                  <Td><span style={{fontWeight:560,color:T.green}}>£{s.rate*hrs}</span></Td>
                  <Td><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontWeight:560,fontSize:12,color:urgent?T.red:T.teal,minWidth:36}}>{s.bankWindowMins}m</span><div style={{width:52,height:5,background:T.border,borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,(s.bankWindowMins/240)*100)}%`,background:urgent?T.red:T.teal,borderRadius:3}}/></div></div></Td>
                  <Td><Btn small onClick={()=>claim(s.id)}>Claim ✓</Btn></Td>
                </tr>
              );
            })}
          />
        </Card>
      )}
      {claimed.length>0&&(
        <div style={{marginTop:20}}>
          <Card>
            <CardHead title="Shifts I've Claimed" icon="checkCircle"/>
            <Table headers={["Care Home","Role","Date","Time","Rate","Pay","Status"]}
              rows={claimed.map(s=>(
                <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`}}>
                  <Td bold>{s.carehome}</Td><Td><Badge label={s.role} color={T.teal} bg={T.tealBg}/></Td>
                  <Td>{s.date}</Td><Td>{s.time}</Td><Td bold>£{s.rate}{"/hr"}</Td>
                  <Td><span style={{fontWeight:560,color:T.green}}>£{s.rate*12}</span></Td>
                  <Td><Badge label="Confirmed" color={T.green} bg={T.greenBg} dot/></Td>
                </tr>
              ))}
            />
          </Card>
        </div>
      )}
    </Page>
  );
};
