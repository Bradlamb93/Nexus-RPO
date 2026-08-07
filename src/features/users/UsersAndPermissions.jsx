import { useState } from "react";
import { Icon } from "../../components/Icon.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Btn, Pill } from "../../components/ui/Button.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert, Modal } from "../../components/ui/Feedback.jsx";
import { Input } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { PERM_DEFS, defaultPerms } from "../../data/users.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── ADMIN: USERS & PERMISSIONS ─────────────────────────────────────────────── */
export const UsersAndPermissions = ({users,setUsers}) => {
  const [roleFilter,setRoleFilter] = useState("all");
  const [editing,setEditing]       = useState(null);  // user being edited
  const [inviteModal,setInviteModal] = useState(false);
  const [invite,setInvite]         = useState({name:"",email:"",role:"carehome",org:""});
  const [search,setSearch]         = useState("");

  const roleColors = {admin:{c:T.amber,bg:T.amberBg},clientadmin:{c:T.accentText,bg:T.accentBg},carehome:{c:T.accent,bg:T.accentBg},agency:{c:T.purple,bg:T.purpleBg},bank:{c:T.teal,bg:T.tealBg}};
  const roleLabels = {admin:"Admin",clientadmin:"Client Admin",carehome:"Care Home",agency:"Agency",bank:"Bank Staff"};
  const statusColor= {active:{c:T.green,bg:T.greenBg},inactive:{c:T.muted,bg:T.sunken},suspended:{c:T.red,bg:T.redBg}};

  const filtered = users
    .filter(u=>roleFilter==="all"||u.role===roleFilter)
    .filter(u=>!search||u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase())||u.org.toLowerCase().includes(search.toLowerCase()));

  const togglePerm = (uid,perm) => setUsers(prev=>prev.map(u=>u.id===uid?{...u,perms:{...u.perms,[perm]:!u.perms[perm]}}:u));
  const toggleStatus = (uid,status) => setUsers(prev=>prev.map(u=>u.id===uid?{...u,status}:u));

  const sendInvite = () => {
    if(!invite.name||!invite.email||!invite.org) return;
    const nu = {
      id:`u${users.length+1}`,
      ...invite,
      status:"invited",
      lastLogin:"Never",
      superAdmin:false,
      perms:defaultPerms(invite.role),
      createdAt:new Date().toISOString().split("T")[0],
    };
    setUsers(p=>[...p,nu]);
    setInvite({name:"",email:"",role:"carehome",org:""});
    setInviteModal(false);
  };

  // Toggle chip
  const PermChip = ({on,label,onClick,disabled}) => (
    <button onClick={disabled?undefined:onClick} style={{padding:"4px 10px",borderRadius:20,border:`1px solid ${on?T.green:T.border}`,background:on?T.greenBg:T.raised,color:on?T.green:T.muted,fontSize:11,fontWeight:560,cursor:disabled?"not-allowed":"pointer",fontFamily:FONT,opacity:disabled?0.5:1,transition:"all 0.15s"}}>
      {on?"✓ ":""}{label}
    </button>
  );

  return (
    <Page title="Users & Permissions" sub="Manage who has access to Nexus RPO and what they can see and do" icon="lock"
      action={<Btn onClick={()=>setInviteModal(true)}>+ Invite User</Btn>}>

      {/* Invite modal */}
      {inviteModal&&(
        <Modal title="Invite New User" onClose={()=>setInviteModal(false)}>
          <div style={{background:T.amberBg,borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:12,color:T.amberText,fontWeight:600}}>
            An invitation email will be sent. The user sets their own password on first login.
          </div>
          <Input label="Full Name *" value={invite.name} onChange={v=>setInvite(p=>({...p,name:v}))} placeholder="e.g. Janet Mills"/>
          <Input label="Email Address *" type="email" value={invite.email} onChange={v=>setInvite(p=>({...p,email:v}))} placeholder="name@organisation.co.uk"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div>
              <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:5}}>Role *</label>
              <select value={invite.role} onChange={e=>setInvite(p=>({...p,role:e.target.value}))} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${T.border}`,fontSize:13,fontFamily:FONT,outline:"none",background:T.raised}}>
                <option value="admin">Admin</option>
                <option value="carehome">Care Home Manager</option>
                <option value="agency">Agency Coordinator</option>
                <option value="bank">Bank Staff</option>
              </select>
            </div>
            <Input label="Organisation *" value={invite.org} onChange={v=>setInvite(p=>({...p,org:v}))} placeholder="Organisation name"/>
          </div>
          <Alert type="info">Default permissions will be applied for the selected role. You can customise them after the user is created.</Alert>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="secondary" onClick={()=>setInviteModal(false)}>Cancel</Btn>
            <Btn onClick={sendInvite}>Send Invitation →</Btn>
          </div>
        </Modal>
      )}

      {/* Permission editor modal */}
      {editing&&(
        <Modal title="Edit Permissions" onClose={()=>setEditing(null)}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:T.raised,borderRadius:8,marginBottom:16}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${roleColors[editing.role]?.c||T.navy},${T.navy})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:T.white,fontWeight:560,flexShrink:0}}>
              {editing.name.split(" ").map(n=>n[0]).join("")}
            </div>
            <div>
              <div style={{fontWeight:560,fontSize:14}}>{editing.name}</div>
              <div style={{fontSize:12,color:T.muted}}>{editing.email} · {editing.org}</div>
            </div>
            <Badge label={roleLabels[editing.role]} color={roleColors[editing.role]?.c} bg={roleColors[editing.role]?.bg} style={{marginLeft:"auto"}}/>
          </div>

          {editing.superAdmin&&(
            <Alert type="info" style={{marginBottom:12}}>This is a super-admin — all permissions are permanently granted and cannot be restricted.</Alert>
          )}

          <div style={{marginBottom:8}}>
            <div style={{fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:10}}>Section Access</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {(PERM_DEFS[editing.role]||[]).map(p=>{
                const granted = editing.superAdmin||editing.perms[p.k]!==false;
                return (
                  <div key={p.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:granted?T.greenBg:T.raised,borderRadius:8,border:`1px solid ${granted?T.green+"44":T.border}`,transition:"all 0.15s"}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:T.text}}>{p.l}</div>
                      <div style={{fontSize:11,color:T.muted,marginTop:1}}>{p.desc}</div>
                    </div>
                    {/* Toggle switch */}
                    <button
                      onClick={editing.superAdmin?undefined:()=>{
                        togglePerm(editing.id,p.k);
                        setEditing(prev=>({...prev,perms:{...prev.perms,[p.k]:!prev.perms[p.k]}}));
                      }}
                      style={{width:42,height:24,borderRadius:14,background:granted?T.green:T.border,border:"none",cursor:editing.superAdmin?"not-allowed":"pointer",position:"relative",transition:"background 0.2s",flexShrink:0,opacity:editing.superAdmin?0.6:1}}>
                      <div style={{position:"absolute",top:3,left:granted?20:3,width:18,height:18,borderRadius:"50%",background:T.white,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{display:"flex",gap:10,justifyContent:"space-between",marginTop:16,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:8}}>
              {!editing.superAdmin&&<>
                <Btn small variant="secondary" onClick={()=>{
                  const all=Object.fromEntries((PERM_DEFS[editing.role]||[]).map(p=>[p.k,true]));
                  setUsers(prev=>prev.map(u=>u.id===editing.id?{...u,perms:all}:u));
                  setEditing(prev=>({...prev,perms:all}));
                }}>Grant All</Btn>
                <Btn small variant="secondary" onClick={()=>{
                  const none=Object.fromEntries((PERM_DEFS[editing.role]||[]).map(p=>[p.k,p.k==="dashboard"]));
                  setUsers(prev=>prev.map(u=>u.id===editing.id?{...u,perms:none}:u));
                  setEditing(prev=>({...prev,perms:none}));
                }}>Revoke All</Btn>
              </>}
            </div>
            <Btn onClick={()=>setEditing(null)}>Save Changes</Btn>
          </div>
        </Modal>
      )}

      {/* Summary stats */}
      <Grid cols={4}>
        <Stat label="Total Users" value={users.length} accent/>
        <Stat label="Active" value={users.filter(u=>u.status==="active").length}/>
        <Stat label="Suspended" value={users.filter(u=>u.status==="suspended").length} sub={users.filter(u=>u.status==="suspended").length>0?"Review access":"All clear"}/>
        <Stat label="Pending Invite" value={users.filter(u=>u.status==="invited").length}/>
      </Grid>

      {/* Filters */}
      <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:14}}>
        <div style={{flex:1,minWidth:200,position:"relative"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search name, email, org…"
            style={{width:"100%",padding:"8px 12px 8px 34px",borderRadius:8,border:`1px solid ${T.border}`,fontSize:13,fontFamily:FONT,outline:"none",background:T.raised}}/>
          <span style={{position:"absolute",left:11,top:"50%",transform:"translateY(-50%)",fontSize:14,color:T.muted}}><Icon name="search" size={15}/></span>
        </div>
        {[["all","All"],["admin","Admin"],["carehome","Care Homes"],["agency","Agencies"],["bank","Bank Staff"]].map(([v,l])=>(
          <Pill key={v} label={`${l}${v!=="all"?" ("+users.filter(u=>u.role===v).length+")":""}`} active={roleFilter===v} onClick={()=>setRoleFilter(v)}/>
        ))}
      </div>

      {/* Users table */}
      <Card>
        <Table
          headers={["User","Role","Organisation","Status","Last Login","Access","Actions"]}
          rows={filtered.map(u=>{
            const rc=roleColors[u.role];
            const sc=statusColor[u.status]||statusColor.inactive;
            const grantedCount=(PERM_DEFS[u.role]||[]).filter(p=>u.superAdmin||u.perms[p.k]!==false).length;
            const totalCount=(PERM_DEFS[u.role]||[]).length;
            return (
              <tr key={u.id} style={{borderBottom:`1px solid ${T.border}`,background:u.status==="suspended"?T.redBg:u.status==="invited"?T.amberBg:"transparent"}}>
                <Td>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${rc?.c||T.navy}88,${T.navy}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:560,color:T.white,flexShrink:0}}>
                      {u.name.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <div>
                      <div style={{fontWeight:560,fontSize:13}}>{u.name}{u.superAdmin&&<span style={{marginLeft:5,fontSize:9,background:T.amber,color:T.white,borderRadius:4,padding:"1px 5px",fontWeight:560}}>SUPER</span>}</div>
                      <div style={{fontSize:11,color:T.muted}}>{u.email}</div>
                    </div>
                  </div>
                </Td>
                <Td><Badge label={roleLabels[u.role]} color={rc?.c} bg={rc?.bg}/></Td>
                <Td><span style={{fontSize:13}}>{u.org}</span></Td>
                <Td>
                  <select value={u.status} onChange={e=>toggleStatus(u.id,e.target.value)}
                    style={{padding:"4px 8px",borderRadius:8,border:`1px solid ${sc.c}44`,background:sc.bg,color:sc.c,fontSize:11,fontWeight:560,fontFamily:FONT,cursor:"pointer",outline:"none"}}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                    {u.status==="invited"&&<option value="invited">Invited</option>}
                  </select>
                </Td>
                <Td><span style={{fontSize:12,color:T.muted}}>{u.lastLogin}</span></Td>
                <Td>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{width:60,height:5,background:T.border,borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${(grantedCount/totalCount)*100}%`,background:grantedCount===totalCount?T.green:T.yellow,borderRadius:3}}/>
                    </div>
                    <span style={{fontSize:11,color:T.muted,whiteSpace:"nowrap"}}>{grantedCount}/{totalCount}</span>
                  </div>
                </Td>
                <Td>
                  <div style={{display:"flex",gap:5}}>
                    <Btn small onClick={()=>setEditing({...u})}>Permissions</Btn>
                    <Btn small variant="secondary" onClick={()=>alert("Password reset email sent to this user.")}>Reset PW</Btn>
                  </div>
                </Td>
              </tr>
            );
          })}
        />
      </Card>

      {/* Role permission overview matrix */}
      <div style={{marginTop:20}}>
        <Card>
          <CardHead title="Default Permission Templates" sub="These are the baseline permissions applied when new users are invited. Customise per-user above." icon="clipboard"/>
          <div style={{overflowX:"auto",padding:"0 14px 14px"}}>
            {["admin","carehome","agency","bank"].map(role=>{
              const rc=roleColors[role];
              return(
                <div key={role} style={{marginTop:14}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <Badge label={roleLabels[role]} color={rc?.c} bg={rc?.bg}/>
                    <span style={{fontSize:12,color:T.muted}}>{(PERM_DEFS[role]||[]).length} sections</span>
                  </div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {(PERM_DEFS[role]||[]).map(p=>(
                      <span key={p.k} style={{padding:"4px 10px",borderRadius:20,background:T.greenBg,border:`1px solid ${T.green}44`,fontSize:11,fontWeight:600,color:T.green}} title={p.desc}>
                        ✓ {p.l}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </Page>
  );
};
