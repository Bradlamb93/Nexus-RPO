import { useState } from "react";
import { Badge, UrgDot } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Alert, Modal } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { INIT_CLIENT_GROUPS } from "../../data/clients.js";
import { SHIFTS } from "../../data/shifts.js";
import { WORKERS } from "../../data/workers.js";
import { cap, urgencyColor } from "../../lib/format.js";
import { FONT, T } from "../../theme/tokens.js";

export const AvailableShifts = () => {
  const [claimed,  setClaimed]  = useState([]);
  const [modal,    setModal]    = useState(null);
  const [filterGroup,  setFilterGroup]  = useState("all");
  const [filterHome,   setFilterHome]   = useState("all");
  const [filterRole,   setFilterRole]   = useState("all");
  const [filterDate,   setFilterDate]   = useState("");
  const [filterUrgency,setFilterUrgency]= useState("all");

  const available = SHIFTS.filter(s => s.status === "open");

  // Build group → locations map from INIT_CLIENT_GROUPS
  const groups = INIT_CLIENT_GROUPS;
  const groupForHome = (homeName) => groups.find(g => g.locations.some(l => l.name === homeName));

  // Derive unique homes scoped to selected group
  const homesInGroup = filterGroup === "all"
    ? [...new Set(available.map(s => s.carehome))]
    : (groups.find(g => g.id === filterGroup)?.locations.map(l => l.name) || [])
        .filter(name => available.some(s => s.carehome === name));

  // Apply all filters
  const filtered = available.filter(s => {
    if (filterGroup !== "all") {
      const grp = groupForHome(s.carehome);
      if (!grp || grp.id !== filterGroup) return false;
    }
    if (filterHome    !== "all" && s.carehome !== filterHome)  return false;
    if (filterRole    !== "all" && s.role     !== filterRole)  return false;
    if (filterUrgency !== "all" && s.urgency  !== filterUrgency) return false;
    if (filterDate    && s.date !== filterDate) return false;
    return true;
  });

  const urgent = filtered.filter(s => s.urgency === "urgent").length;
  const roles  = [...new Set(available.map(s => s.role))];

  const resetFilters = () => { setFilterGroup("all"); setFilterHome("all"); setFilterRole("all"); setFilterDate(""); setFilterUrgency("all"); };
  const hasFilters = filterGroup !== "all" || filterHome !== "all" || filterRole !== "all" || filterDate || filterUrgency !== "all";

  const selStyle = (active) => ({
    padding:"8px 12px", border:`1px solid ${active?T.amber:T.border}`,
    borderRadius:8, fontSize:12, fontFamily:FONT,
    color:T.text, background:active?T.amberBg:T.white, cursor:"pointer",
    fontWeight:active?700:400, outline:"none", minWidth:0,
  });

  return (
    <Page title="Available Shifts" sub="Shifts broadcast to First Choice Nursing by Nexus RPO" icon="clipboard">
      {modal && (
        <Modal title={`Submit Worker — ${modal.carehome} (${modal.role})`} onClose={()=>setModal(null)}>
          <p style={{fontSize:13,color:T.muted,marginBottom:14}}>Select a compliant worker to submit for this shift.</p>
          <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
            {WORKERS.filter(w=>w.agency==="First Choice"&&w.compliance>=80&&(w.role===modal.role||w.role==="RGN")).map(w=>(
              <button key={w.id} onClick={()=>{setClaimed(c=>[...c,modal.id]);setModal(null);}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",borderRadius:10,border:`1px solid ${T.border}`,background:T.white,cursor:"pointer",fontFamily:FONT,textAlign:"left"}}>
                <div>
                  <div style={{fontWeight:560,fontSize:13,color:T.text}}>{w.name}</div>
                  <div style={{fontSize:11,color:T.muted,marginTop:2}}>{w.role} · Compliance: {w.compliance}% · {w.available?"Available":"Currently placed"}</div>
                </div>
                <Badge label={`${w.compliance}%`} color={w.compliance>=95?T.green:T.yellow} bg={w.compliance>=95?T.greenBg:T.yellowBg}/>
              </button>
            ))}
          </div>
          <Btn variant="secondary" onClick={()=>setModal(null)}>Cancel</Btn>
        </Modal>
      )}

      {urgent > 0 && (
        <Alert type="error">{urgent} urgent shift{urgent>1?"s need":"needs"} immediate filling. Respond within 30 minutes to maintain Tier 1 status.</Alert>
      )}

      {/* ── Filter bar ──────────────────────────────────────────────────────── */}
      <Card style={{padding:"14px 16px"}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr auto auto auto",gap:10,alignItems:"end"}}>

          {/* Group owner */}
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Group Owner</label>
            <select value={filterGroup} onChange={e=>{setFilterGroup(e.target.value);setFilterHome("all");}} style={selStyle(filterGroup!=="all")}>
              <option value="all">All Groups</option>
              {groups.map(g=><option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>

          {/* Care home — scoped to group */}
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Care Home</label>
            <select value={filterHome} onChange={e=>setFilterHome(e.target.value)} style={selStyle(filterHome!=="all")} disabled={homesInGroup.length===0}>
              <option value="all">{filterGroup==="all"?"All Homes":"All in Group"}</option>
              {homesInGroup.map(h=><option key={h} value={h}>{h}</option>)}
            </select>
          </div>

          {/* Role */}
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Role</label>
            <select value={filterRole} onChange={e=>setFilterRole(e.target.value)} style={selStyle(filterRole!=="all")}>
              <option value="all">All Roles</option>
              {roles.map(r=><option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          {/* Date */}
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Date</label>
            <input type="date" value={filterDate} onChange={e=>setFilterDate(e.target.value)} style={{...selStyle(!!filterDate),padding:"7px 10px"}}/>
          </div>

          {/* Urgency */}
          <div>
            <label style={{display:"block",fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Urgency</label>
            <select value={filterUrgency} onChange={e=>setFilterUrgency(e.target.value)} style={selStyle(filterUrgency!=="all")}>
              <option value="all">Any</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
            </select>
          </div>

          {/* Reset */}
          <div style={{paddingBottom:1}}>
            <label style={{display:"block",fontSize:10,fontWeight:560,color:"transparent",marginBottom:5}}>_</label>
            <button onClick={resetFilters} disabled={!hasFilters}
              style={{padding:"8px 12px",borderRadius:8,border:`1px solid ${hasFilters?T.red:T.border}`,background:hasFilters?T.redBg:"transparent",color:hasFilters?T.red:T.muted,fontSize:12,fontWeight:560,cursor:hasFilters?"pointer":"default",fontFamily:FONT}}>
              {hasFilters?"✕ Clear":"Filters"}
            </button>
          </div>
        </div>

        {/* Active filter pills */}
        {hasFilters && (
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`}}>
            {filterGroup!=="all"&&<span style={{fontSize:11,fontWeight:560,padding:"3px 10px",borderRadius:20,background:T.amberBg,color:T.amberText}}>Group: {groups.find(g=>g.id===filterGroup)?.name}</span>}
            {filterHome!=="all"&&<span style={{fontSize:11,fontWeight:560,padding:"3px 10px",borderRadius:20,background:T.amberBg,color:T.amberText}}>Home: {filterHome}</span>}
            {filterRole!=="all"&&<span style={{fontSize:11,fontWeight:560,padding:"3px 10px",borderRadius:20,background:T.purpleBg,color:T.purple}}>Role: {filterRole}</span>}
            {filterDate&&<span style={{fontSize:11,fontWeight:560,padding:"3px 10px",borderRadius:20,background:T.accentBg,color:T.blue}}>Date: {filterDate}</span>}
            {filterUrgency!=="all"&&<span style={{fontSize:11,fontWeight:560,padding:"3px 10px",borderRadius:20,background:T.redBg,color:T.red,textTransform:"capitalize"}}>Urgency: {filterUrgency}</span>}
            <span style={{fontSize:11,color:T.muted,padding:"3px 6px"}}>{filtered.length} shift{filtered.length!==1?"s":""} shown</span>
          </div>
        )}
      </Card>

      {/* ── Results table ────────────────────────────────────────────────────── */}
      <Card>
        <Table
          headers={["","Group","Care Home","Role","Date","Time","Rate/hr","Est. Pay","Urgency","Action"]}
          empty="No shifts match the current filters"
          rows={filtered.map(s => {
            const isClaimed = claimed.includes(s.id);
            const grp = groupForHome(s.carehome);
            const hrs = 12;
            return (
              <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`,background:s.urgency==="urgent"?T.redBg:"transparent"}}>
                <Td><UrgDot u={s.urgency}/></Td>
                <Td><span style={{fontSize:11,color:T.muted,fontWeight:600}}>{grp?.name||"—"}</span></Td>
                <Td bold>{s.carehome}</Td>
                <Td><Badge label={s.role} color={T.purple} bg={T.purpleBg}/></Td>
                <Td>{s.date}</Td>
                <Td>{s.time}</Td>
                <Td bold>£{s.rate}</Td>
                <Td><span style={{fontWeight:560,color:T.green}}>£{s.rate*hrs}</span></Td>
                <Td><span style={{fontSize:12,color:urgencyColor(s.urgency),display:"flex",alignItems:"center",gap:4}}><UrgDot u={s.urgency}/>{cap(s.urgency)}</span></Td>
                <Td>
                  {isClaimed
                    ? <Badge label="Submitted ✓" color={T.green} bg={T.greenBg} dot/>
                    : <Btn small onClick={()=>setModal(s)}>Submit Worker</Btn>}
                </Td>
              </tr>
            );
          })}
        />
      </Card>
    </Page>
  );
};
