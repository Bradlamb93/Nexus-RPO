import { useState } from "react";
import { Icon } from "../../components/Icon.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert } from "../../components/ui/Feedback.jsx";
import { AGENCIES } from "../../data/agencies.js";
import { blankGroup, blankLocation } from "../../data/clients.js";
import { CQC_COLORS } from "../../data/compliance.js";
import { GroupModal } from "./GroupModal.jsx";
import { LocationModal } from "./LocationModal.jsx";
import { tierBg, tierColor } from "../../lib/format.js";
import { FONT, T } from "../../theme/tokens.js";

export const ClientManager = ({groups, setGroups}) => {
  const [expanded, setExpanded]       = useState("cg1");
  const [editGroup, setEditGroup]     = useState(null);
  const [isNewGroup, setIsNewGroup]   = useState(false);
  const [editLoc, setEditLoc]         = useState(null);
  const [editLocGroup, setEditLocGroup] = useState(null);
  const [isNewLoc, setIsNewLoc]       = useState(false);
  const [search, setSearch]           = useState("");
  const [innerTab, setInnerTab]       = useState({});  // groupId -> "locations"|"panel"

  const getTab = (id) => innerTab[id] || "locations";
  const setTab = (id, t) => setInnerTab(p => ({ ...p, [id]: t }));

  const saveGroup = (g) => {
    if (isNewGroup) setGroups(p=>[...p, { ...g, panelAgencies: [] }]);
    else setGroups(p=>p.map(x=>x.id===g.id?g:x));
  };
  const deleteGroup = (id) => setGroups(p=>p.filter(x=>x.id!==id));
  const saveLoc = (groupId, loc) => {
    setGroups(p=>p.map(g=>{
      if(g.id!==groupId) return g;
      const existing = g.locations.find(l=>l.id===loc.id);
      return {...g, locations: existing ? g.locations.map(l=>l.id===loc.id?loc:l) : [...g.locations, loc]};
    }));
  };
  const deleteLoc = (groupId, locId) => setGroups(p=>p.map(g=>g.id!==groupId?g:{...g,locations:g.locations.filter(l=>l.id!==locId)}));

  const togglePanel = (groupId, agencyId) => {
    setGroups(p=>p.map(g=>{
      if(g.id!==groupId) return g;
      const panel = g.panelAgencies || [];
      return { ...g, panelAgencies: panel.includes(agencyId) ? panel.filter(id=>id!==agencyId) : [...panel, agencyId] };
    }));
  };

  const filtered = groups.filter(g=>!search||g.name.toLowerCase().includes(search.toLowerCase())||g.locations.some(l=>l.name.toLowerCase().includes(search.toLowerCase())));

  const totalLocations = groups.reduce((a,g)=>a+g.locations.length,0);
  const totalBeds = groups.reduce((a,g)=>a+g.locations.reduce((b,l)=>b+(parseInt(l.beds)||0),0),0);
  const activeGroups = groups.filter(g=>g.status==="active").length;
  const cqcWarnings = groups.reduce((a,g)=>a+g.locations.filter(l=>l.cqcRating==="Requires Improvement"||l.cqcRating==="Inadequate").length,0);

  const statusColor = {active:{c:T.green,bg:T.greenBg},pending:{c:T.yellow,bg:T.yellowBg},expired:{c:T.red,bg:T.redBg},terminated:{c:T.muted,bg:T.sunken},inactive:{c:T.muted,bg:T.sunken},suspended:{c:T.red,bg:T.redBg}};

  return (
    <div>
      {editGroup && <GroupModal group={editGroup} isNew={isNewGroup} onSave={saveGroup} onClose={()=>setEditGroup(null)}/>}
      {editLoc && <LocationModal loc={editLoc} isNew={isNewLoc} onSave={(l)=>saveLoc(editLocGroup,l)} onClose={()=>setEditLoc(null)}/>}

      <Grid cols={4}>
        <Stat label="Client Groups" value={groups.length} sub={`${activeGroups} active`} accent/>
        <Stat label="Locations" value={totalLocations} sub="Across all groups"/>
        <Stat label="Total Beds" value={totalBeds} sub="Under management"/>
        <Stat label="CQC Warnings" value={cqcWarnings} sub={cqcWarnings>0?"Action needed":"All clear"} accent={cqcWarnings>0}/>
      </Grid>

      {cqcWarnings>0 && (
        <Alert type="warn">{cqcWarnings} location{cqcWarnings>1?"s are":" is"} rated "Requires Improvement" or below. Review and ensure compliance plans are in place.</Alert>
      )}

      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16,flexWrap:"wrap"}}>
        <div style={{position:"relative",flex:1,minWidth:200,maxWidth:340}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:13}}><Icon name="search" size={15}/></span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search groups or locations…"
            style={{width:"100%",padding:"8px 12px 8px 34px",borderRadius:8,border:`1px solid ${T.border}`,fontSize:13,fontFamily:FONT,outline:"none",background:T.raised}}/>
        </div>
        <Btn onClick={()=>{setEditGroup(blankGroup());setIsNewGroup(true);}}>+ Onboard Client</Btn>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {filtered.map(group=>{
          const isOpen = expanded===group.id;
          const sc = statusColor[group.status]||statusColor.active;
          const contractExpiring = group.contractEnd && new Date(group.contractEnd)<new Date("2026-06-01");
          const tab = getTab(group.id);
          const panel = group.panelAgencies || [];
          return (
            <Card key={group.id} style={{overflow:"hidden",border:contractExpiring?`1px solid ${T.yellow}66`:"1px solid transparent"}}>
              {/* Header */}
              <div onClick={()=>setExpanded(isOpen?null:group.id)}
                style={{padding:"18px 20px",cursor:"pointer",display:"flex",alignItems:"center",gap:16,background:isOpen?T.raised:T.white,borderBottom:isOpen?`1px solid ${T.border}`:"none",transition:"background 0.15s",flexWrap:"wrap"}}>
                <div style={{width:44,height:44,borderRadius:14,background:`linear-gradient(135deg,${T.navy}22,${T.navy}44)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}></div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3,flexWrap:"wrap"}}>
                    <span style={{fontWeight:600,fontSize:15,color:T.navy}}>{group.name}</span>
                    <Badge label={group.status.charAt(0).toUpperCase()+group.status.slice(1)} color={sc.c} bg={sc.bg} dot/>
                    {contractExpiring && <Badge label="Contract expiring soon" color={T.yellow} bg={T.yellowBg}/>}
                  </div>
                  <div style={{fontSize:12,color:T.muted}}>{group.type} · {group.contact} · {group.email}</div>
                </div>
                <div style={{display:"flex",gap:8,alignItems:"center",flexShrink:0,flexWrap:"wrap"}}>
                  <span style={{background:T.sunken,borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:560,color:T.navy}}>
                    {group.locations.length} location{group.locations.length!==1?"s":""}
                  </span>
                  <span style={{background:T.sunken,borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:560,color:T.navy}}>
                    {group.locations.reduce((a,l)=>a+(parseInt(l.beds)||0),0)} beds
                  </span>
                  <span style={{background:T.sunken,borderRadius:20,padding:"4px 12px",fontSize:11,fontWeight:560,color:T.navy}}>
                    {panel.length} agenc{panel.length===1?"y":"ies"} on panel
                  </span>
                  <div style={{display:"flex",gap:6}} onClick={e=>e.stopPropagation()}>
                    <Btn small variant="secondary" onClick={()=>{setEditGroup({...group});setIsNewGroup(false);}}>Edit</Btn>
                  </div>
                  <span style={{fontSize:18,color:T.muted,marginLeft:4}}>{isOpen?"▲":"▼"}</span>
                </div>
              </div>

              {/* Expanded */}
              {isOpen && (
                <div style={{padding:"0 20px 20px"}}>
                  {/* Detail strip */}
                  <div style={{display:"flex",gap:24,padding:"14px 16px",background:T.raised,borderRadius:10,flexWrap:"wrap",marginTop:16,marginBottom:16}}>
                    {[
                      ["Phone", group.phone||"—"],
                      ["Website", group.website||"—"],
                      ["Address", group.address||"—"],
                      ["Contract", group.contractStart ? `${group.contractStart} – ${group.contractEnd||"Open"}` : "—"],
                    ].map(([k,v])=>(
                      <div key={k} style={{minWidth:160}}>
                        <div style={{fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:2}}>{k}</div>
                        <div style={{fontSize:12,color:T.text,fontWeight:600}}>{v}</div>
                      </div>
                    ))}
                    {group.notes && (
                      <div style={{flex:"1 1 100%"}}>
                        <div style={{fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:2}}>Notes</div>
                        <div style={{fontSize:12,color:T.muted,fontStyle:"italic"}}>{group.notes}</div>
                      </div>
                    )}
                  </div>

                  {/* Inner tabs */}
                  <div style={{display:"flex",gap:0,background:T.sunken,borderRadius:10,padding:4,width:"fit-content",marginBottom:16}}>
                    {[["locations","Locations"],["panel","Agency Panel"]].map(([k,l])=>{
                      const active=tab===k;
                      return (
                        <button key={k} onClick={()=>setTab(group.id,k)}
                          style={{padding:"6px 18px",borderRadius:8,border:"none",fontFamily:FONT,fontWeight:560,fontSize:12,cursor:"pointer",
                            background:active?T.white:"transparent",color:active?T.navy:T.muted,
                            boxShadow:active?"0 1px 4px rgba(0,0,0,0.1)":"none",transition:"all 0.15s"}}>
                          {l}
                          {k==="panel" && <span style={{marginLeft:6,fontSize:10,padding:"2px 6px",borderRadius:20,background:active?T.amberBg:"transparent",color:active?T.amberText:T.muted,fontWeight:560}}>{panel.length}</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* Locations tab */}
                  {tab==="locations" && (
                    <div>
                      <div style={{marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <h4 style={{fontWeight:600,fontSize:13,color:T.text}}>Locations ({group.locations.length})</h4>
                        <Btn small onClick={()=>{setEditLoc(blankLocation(group.id));setEditLocGroup(group.id);setIsNewLoc(true);}}>+ Add Location</Btn>
                      </div>
                      {group.locations.length===0
                        ? <div style={{padding:"24px",textAlign:"center",background:T.raised,borderRadius:10,border:`1.5px dashed ${T.border}`}}>
                            <div style={{marginBottom:6,display:"flex",justifyContent:"center",color:T.ghost}}><Icon name="hospital" size={21} stroke={1.5}/></div>
                            <div style={{fontWeight:560,fontSize:13,marginBottom:4}}>No locations yet</div>
                            <Btn small onClick={()=>{setEditLoc(blankLocation(group.id));setEditLocGroup(group.id);setIsNewLoc(true);}}>+ Add First Location</Btn>
                          </div>
                        : <div style={{display:"flex",flexDirection:"column",gap:10}}>
                            {group.locations.map(loc=>{
                              const cqc = CQC_COLORS[loc.cqcRating]||CQC_COLORS["Not rated"];
                              const lsc = statusColor[loc.status]||statusColor.active;
                              return (
                                <div key={loc.id} style={{display:"flex",gap:14,alignItems:"flex-start",padding:"14px 16px",borderRadius:10,border:`1px solid ${T.border}`,background:loc.status!=="active"?T.raised:T.white,flexWrap:"wrap"}}>
                                  <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${T.blue}22,${T.blue}44)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}></div>
                                  <div style={{flex:1,minWidth:180}}>
                                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4,flexWrap:"wrap"}}>
                                      <span style={{fontWeight:560,fontSize:14}}>{loc.name}</span>
                                      <Badge label={loc.type} color={T.blue} bg={T.blueBg}/>
                                      <Badge label={loc.status.charAt(0).toUpperCase()+loc.status.slice(1)} color={lsc.c} bg={lsc.bg} dot/>
                                    </div>
                                    <div style={{fontSize:11,color:T.muted,marginBottom:4}}>{loc.address}</div>
                                    <div style={{fontSize:11,color:T.muted}}>{loc.contact||"—"} · {loc.email||"—"} · {loc.phone||"—"}</div>
                                    {loc.notes && <div style={{fontSize:11,color:T.muted,fontStyle:"italic",marginTop:4}}>{loc.notes}</div>}
                                  </div>
                                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6,flexShrink:0}}>
                                    <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",justifyContent:"flex-end"}}>
                                      <span style={{background:T.sunken,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:560,color:T.navy}}>{loc.beds||"?"} beds</span>
                                      <span style={{background:cqc.bg,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:560,color:cqc.c}}>CQC: {loc.cqcRating}</span>
                                    </div>
                                    {loc.cqcDate && <div style={{fontSize:10,color:T.muted}}>Last inspected {loc.cqcDate}</div>}
                                    <div style={{display:"flex",gap:6,marginTop:4}}>
                                      <Btn small variant="secondary" onClick={()=>{setEditLoc({...loc});setEditLocGroup(group.id);setIsNewLoc(false);}}>Edit</Btn>
                                      <Btn small variant="danger" onClick={()=>deleteLoc(group.id,loc.id)}>Remove</Btn>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                      }
                    </div>
                  )}

                  {/* Agency Panel tab */}
                  {tab==="panel" && (
                    <div>
                      <div style={{marginBottom:12}}>
                        <div style={{fontWeight:600,fontSize:13,color:T.text,marginBottom:4}}>Agency Panel — {group.name}</div>
                        <div style={{fontSize:12,color:T.muted}}>Only agencies on this client's panel will receive shift notifications for their locations. Add or remove agencies below.</div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:10}}>
                        {AGENCIES.map(a=>{
                          const onPanel = panel.includes(a.id);
                          return (
                            <div key={a.id} style={{display:"flex",gap:14,alignItems:"center",padding:"14px 16px",borderRadius:10,
                              border:`1px solid ${onPanel?T.green+"88":T.border}`,
                              background:onPanel?T.greenBg:T.white,transition:"all 0.2s"}}>
                              <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${T.amber}33,${T.amber}66)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}></div>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3,flexWrap:"wrap"}}>
                                  <span style={{fontWeight:560,fontSize:14,color:T.text}}>{a.name}</span>
                                  <Badge label={a.tier} color={tierColor(a.tier)} bg={tierBg(a.tier)}/>
                                  {onPanel && <Badge label="On Panel" color={T.green} bg={T.greenBg} dot/>}
                                </div>
                                <div style={{fontSize:11,color:T.muted}}>
                                  {a.contact} · Fill rate: {a.fillRate}% · Compliance: {a.compliance}% · Response: {a.avgResponse}
                                </div>
                              </div>
                              <Btn small variant={onPanel?"danger":"secondary"}
                                onClick={()=>togglePanel(group.id, a.id)}>
                                {onPanel ? "Remove from Panel" : "+ Add to Panel"}
                              </Btn>
                            </div>
                          );
                        })}
                      </div>
                      {panel.length===0 && (
                        <Alert type="warn" style={{marginTop:12}}>No agencies on this client's panel. Shifts for this client will not be sent to any agency until at least one is added.</Alert>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {filtered.length===0 && (
        <Card style={{padding:40,textAlign:"center"}}>
          <div style={{marginBottom:12,display:"flex",justifyContent:"center",color:T.ghost}}><Icon name="hospital" size={32} stroke={1.5}/></div>
          <div style={{fontWeight:560,fontSize:16,marginBottom:6}}>No clients found</div>
          <Btn onClick={()=>{setEditGroup(blankGroup());setIsNewGroup(true);}}>+ Onboard First Client</Btn>
        </Card>
      )}
    </div>
  );
};
