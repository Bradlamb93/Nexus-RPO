import { useState } from "react";
import { Icon } from "../../components/Icon.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert, Modal } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { CARE_HOMES } from "../../data/clients.js";
import { cap } from "../../lib/format.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── ADMIN: SITE ALLOCATION ─────────────────────────────────────────────────── */
export const SiteAllocation = ({users,setUsers,navigate}) => {
  const careHomeUsers = users.filter(u=>u.role==="carehome");
  const [editingUser,setEditingUser] = useState(null);
  const [draftSites,setDraftSites]   = useState([]);
  const [viewMode,setViewMode]       = useState("users"); // "users" | "sites"

  const allSiteNames = CARE_HOMES.map(c=>c.name);

  const openEdit = (u) => { setEditingUser(u); setDraftSites([...(u.sites||[])]); };
  const saveEdit = () => {
    setUsers(prev=>prev.map(u=>u.id===editingUser.id?{...u,sites:draftSites,org:draftSites[0]||u.org}:u));
    setEditingUser(null);
  };
  const toggleSite = (site) => setDraftSites(p=>p.includes(site)?p.filter(s=>s!==site):[...p,site]);

  // Site view — for each care home, who has access
  const siteAccessMap = CARE_HOMES.map(ch=>({
    ...ch,
    managers:careHomeUsers.filter(u=>(u.sites||[]).includes(ch.name)),
  }));

  return (
    <Page title="Site Allocation" sub="Control which care home staff can access which locations" icon="pin"
      action={
        <div style={{display:"flex",gap:8}}>
          {[["users","By User"],["sites","By Site"]].map(([v,l])=>(
            <button key={v} onClick={()=>setViewMode(v)} style={{padding:"8px 16px",borderRadius:8,border:"none",background:viewMode===v?T.navy:T.sunken,color:viewMode===v?T.white:T.muted,fontWeight:560,fontSize:12,cursor:"pointer",fontFamily:FONT}}>
              {l}
            </button>
          ))}
        </div>
      }>

      {/* Edit sites modal */}
      {editingUser&&(
        <Modal title={`Edit Site Access — ${editingUser.name}`} onClose={()=>setEditingUser(null)}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:T.raised,borderRadius:8,marginBottom:16}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${T.blue}88,${T.navy}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:T.white,fontWeight:560,flexShrink:0}}>
              {editingUser.name.split(" ").map(n=>n[0]).join("")}
            </div>
            <div>
              <div style={{fontWeight:560,fontSize:14}}>{editingUser.name}</div>
              <div style={{fontSize:12,color:T.muted}}>{editingUser.email}</div>
            </div>
          </div>

          <div style={{marginBottom:8}}>
            <div style={{fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:12}}>Site Access</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {CARE_HOMES.map(ch=>{
                const granted = draftSites.includes(ch.name);
                const currentUserCount = careHomeUsers.filter(u=>u.id!==editingUser.id&&(u.sites||[]).includes(ch.name)).length;
                return (
                  <div key={ch.id} onClick={()=>toggleSite(ch.name)} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 16px",borderRadius:10,border:`2px solid ${granted?T.navy:T.border}`,background:granted?T.accentBg:T.raised,cursor:"pointer",transition:"all 0.15s"}}>
                    <div style={{width:42,height:42,borderRadius:10,background:granted?T.navy:T.sunken,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0,transition:"background 0.15s"}}>
                      
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:560,fontSize:13,color:T.text}}>{ch.name}</div>
                      <div style={{fontSize:11,color:T.muted,marginTop:2}}>{ch.type} · {ch.beds} beds · {ch.contact}</div>
                      <div style={{fontSize:10,color:T.muted,marginTop:2}}>
                        {currentUserCount>0?`${currentUserCount} other manager${currentUserCount>1?"s":""} also have access`:"No other managers assigned"}
                      </div>
                    </div>
                    <div style={{width:24,height:24,borderRadius:8,background:granted?T.navy:T.border,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.15s"}}>
                      {granted&&<span style={{color:T.white,fontSize:14,fontWeight:560}}>✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {draftSites.length===0&&(
            <Alert type="error" style={{marginTop:12}}>This user will have no site access and won't be able to see any data. Assign at least one site.</Alert>
          )}

          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}>
            <Btn variant="secondary" onClick={()=>setEditingUser(null)}>Cancel</Btn>
            <Btn onClick={saveEdit} style={{opacity:draftSites.length>0?1:0.5}}>Save Access ({draftSites.length} site{draftSites.length!==1?"s":""})</Btn>
          </div>
        </Modal>
      )}

      {/* Stats */}
      <Grid cols={4}>
        <Stat label="Care Home Users" value={careHomeUsers.length} accent/>
        <Stat label="Active Sites" value={CARE_HOMES.length}/>
        <Stat label="Multi-Site Users" value={careHomeUsers.filter(u=>(u.sites||[]).length>1).length} sub="Access 2+ locations"/>
        <Stat label="Unallocated" value={careHomeUsers.filter(u=>!(u.sites||[]).length).length} sub={careHomeUsers.filter(u=>!(u.sites||[]).length).length>0?"Action needed":"All allocated"}/>
      </Grid>

      {/* Info banner */}
      <div style={{background:T.accentBg,border:`1px solid ${T.blue}44`,borderRadius:14,padding:"12px 16px",marginBottom:16,fontSize:12,color:T.muted}}>
        <strong style={{color:T.blue}}>How site allocation works:</strong> Care home managers only see shifts, timesheets, invoices and workers for their allocated sites. A relief or regional manager can be given access to multiple sites. Changing allocation takes effect immediately.
      </div>

      {viewMode==="users"&&(
        <Card>
          <Table
            headers={["Manager","Email","Allocated Sites","Site Types","Last Login","Status","Actions"]}
            rows={careHomeUsers.map(u=>{
              const sites = u.sites||[];
              const siteData = CARE_HOMES.filter(c=>sites.includes(c.name));
              return (
                <tr key={u.id} style={{borderBottom:`1px solid ${T.border}`,background:sites.length===0?T.redBg:u.status==="inactive"?T.raised:"transparent"}}>
                  <Td>
                    <div style={{display:"flex",alignItems:"center",gap:9}}>
                      <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${T.blue}88,${T.navy}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:560,color:T.white,flexShrink:0}}>
                        {u.name.split(" ").map(n=>n[0]).join("")}
                      </div>
                      <div>
                        <div style={{fontWeight:560,fontSize:13}}>{u.name}</div>
                        <div style={{fontSize:10,color:T.muted}}>{u.org}</div>
                      </div>
                    </div>
                  </Td>
                  <Td><span style={{fontSize:12,color:T.muted}}>{u.email}</span></Td>
                  <Td>
                    {sites.length===0
                      ?<Badge label="No Sites" color={T.red} bg={T.redBg}/>
                      :<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                        {sites.map(s=>(
                          <span key={s} style={{padding:"3px 8px",borderRadius:8,background:T.navy+"11",border:`1px solid ${T.navy}22`,fontSize:10,fontWeight:560,color:T.navy}}>{s}</span>
                        ))}
                      </div>}
                  </Td>
                  <Td>
                    <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                      {siteData.map(sd=><span key={sd.id} style={{fontSize:10,background:T.tealBg,color:T.teal,borderRadius:4,padding:"2px 5px",fontWeight:600}}>{sd.type}</span>)}
                    </div>
                  </Td>
                  <Td><span style={{fontSize:12,color:T.muted}}>{u.lastLogin}</span></Td>
                  <Td>
                    <Badge
                      label={u.status.charAt(0).toUpperCase()+u.status.slice(1)}
                      color={u.status==="active"?T.green:u.status==="suspended"?T.red:T.muted}
                      bg={u.status==="active"?T.greenBg:u.status==="suspended"?T.redBg:T.sunken}
                    />
                  </Td>
                  <Td>
                    <Btn small onClick={()=>openEdit(u)}>Edit Sites</Btn>
                  </Td>
                </tr>
              );
            })}
          />
        </Card>
      )}

      {viewMode==="sites"&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
          {siteAccessMap.map(ch=>(
            <Card key={ch.id} style={{padding:0,overflow:"hidden"}}>
              <div style={{background:T.navy,padding:"16px 18px",display:"flex",alignItems:"center",gap:12}}>
                <div style={{display:"flex",justifyContent:"center",color:T.ghost}}><Icon name="hospital" size={21} stroke={1.5}/></div>
                <div>
                  <div style={{fontFamily:FONT,fontSize:16,color:T.white}}>{ch.name}</div>
                  <div style={{fontSize:11,color:"rgba(255,255,255,0.5)"}}>{ch.type} · {ch.beds} beds</div>
                </div>
                <div style={{marginLeft:"auto",background:"rgba(255,255,255,0.12)",padding:"4px 10px",borderRadius:20}}>
                  <span style={{fontSize:11,fontWeight:560,color:T.white}}>{ch.managers.length} manager{ch.managers.length!==1?"s":""}</span>
                </div>
              </div>
              <div style={{padding:"14px 18px"}}>
                {ch.managers.length===0?(
                  <div style={{padding:"12px",background:T.redBg,borderRadius:8,fontSize:12,color:T.red,fontWeight:600,textAlign:"center"}}>
                    No managers allocated to this site
                  </div>
                ):(
                  ch.managers.map(m=>(
                    <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:`linear-gradient(135deg,${T.blue}88,${T.navy}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:560,color:T.white,flexShrink:0}}>
                        {m.name.split(" ").map(n=>n[0]).join("")}
                      </div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:560,fontSize:12}}>{m.name}</div>
                        <div style={{fontSize:10,color:T.muted}}>{m.email}</div>
                      </div>
                      <div style={{display:"flex",gap:4,alignItems:"center"}}>
                        {(m.sites||[]).length>1&&(
                          <span style={{fontSize:9,background:T.amberBg,color:T.amberText,borderRadius:4,padding:"2px 5px",fontWeight:560}}>{(m.sites||[]).length} sites</span>
                        )}
                        <Badge
                          label={cap(m.status)}
                          color={m.status==="active"?T.green:T.muted}
                          bg={m.status==="active"?T.greenBg:T.sunken}
                        />
                      </div>
                    </div>
                  ))
                )}
                <div style={{marginTop:10}}>
                  <Btn small variant="secondary" onClick={()=>openEdit(ch.managers[0]||careHomeUsers[0])}>
                    Manage Access
                  </Btn>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Page>
  );
};
