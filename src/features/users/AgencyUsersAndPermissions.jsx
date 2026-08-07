import { useState } from "react";
import { Icon } from "../../components/Icon.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert, Modal } from "../../components/ui/Feedback.jsx";
import { Input } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { PERM_DEFS, defaultPerms } from "../../data/users.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── AGENCY: USERS & PERMISSIONS ────────────────────────────────────────────── */
export const AgencyUsersAndPermissions = ({users, setUsers, user}) => {
  const myOrg = user?.org || "First Choice Nursing";
  const myUsers = users.filter(u => u.role === "agency" && u.org === myOrg);
  const thisUser = users.find(u => u.email === user?.email);
  const isSuperAdmin = thisUser?.superAdmin;

  const [editing, setEditing]       = useState(null);
  const [inviteModal, setInviteModal] = useState(false);
  const [invite, setInvite]         = useState({name:"", email:"", role:"agency"});
  const [search, setSearch]         = useState("");

  const statusColor = {active:{c:T.green,bg:T.greenBg}, inactive:{c:T.muted,bg:T.sunken}, suspended:{c:T.red,bg:T.redBg}, invited:{c:T.yellow,bg:T.yellowBg}};
  const permDefs = PERM_DEFS["agency"] || [];

  const filtered = myUsers.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  const togglePerm = (uid, perm) => setUsers(prev => prev.map(u =>
    u.id === uid ? {...u, perms:{...u.perms, [perm]:!u.perms[perm]}} : u
  ));
  const toggleStatus = (uid, status) => setUsers(prev => prev.map(u =>
    u.id === uid ? {...u, status} : u
  ));

  const sendInvite = () => {
    if (!invite.name || !invite.email) return;
    const nu = {
      id:`u${users.length+1}`,
      name: invite.name,
      email: invite.email,
      role: "agency",
      org: myOrg,
      status: "invited",
      lastLogin: "Never",
      superAdmin: false,
      perms: defaultPerms("agency"),
      createdAt: new Date().toISOString().split("T")[0],
    };
    setUsers(p => [...p, nu]);
    setInvite({name:"", email:""});
    setInviteModal(false);
  };

  return (
    <Page title="Users & Permissions" sub={`Manage who can access the ${myOrg} portal and what they can do`} icon="lock"
      action={isSuperAdmin ? <Btn onClick={()=>setInviteModal(true)}>+ Invite User</Btn> : null}>

      {!isSuperAdmin && (
        <Alert type="info">You have view-only access to this section. Contact your account administrator to make changes.</Alert>
      )}

      {/* Invite modal */}
      {inviteModal && (
        <Modal title="Invite Team Member" onClose={()=>setInviteModal(false)}>
          <div style={{background:T.greenBg,borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:12,color:T.green,fontWeight:600,border:`1px solid ${T.green}44`}}>
            An invitation email will be sent. They'll set their own password on first login.
          </div>
          <Input label="Full Name *" value={invite.name} onChange={v=>setInvite(p=>({...p,name:v}))} placeholder="e.g. Sam Hughes"/>
          <Input label="Work Email *" type="email" value={invite.email} onChange={v=>setInvite(p=>({...p,email:v}))} placeholder={`name@${myOrg.toLowerCase().replace(/\s/g,"")}.co.uk`}/>
          <Alert type="info">Default permissions will be applied. You can customise them after the user is created.</Alert>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="secondary" onClick={()=>setInviteModal(false)}>Cancel</Btn>
            <Btn onClick={sendInvite}>Send Invitation →</Btn>
          </div>
        </Modal>
      )}

      {/* Permission editor modal */}
      {editing && (
        <Modal title="Edit Permissions" onClose={()=>setEditing(null)}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:T.raised,borderRadius:8,marginBottom:16}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${T.purple}88,${T.navy}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:T.white,fontWeight:560,flexShrink:0}}>
              {editing.name.split(" ").map(n=>n[0]).join("")}
            </div>
            <div>
              <div style={{fontWeight:560,fontSize:14}}>{editing.name}</div>
              <div style={{fontSize:12,color:T.muted}}>{editing.email} · {myOrg}</div>
            </div>
            {editing.superAdmin && <Badge label="Admin" color={T.purple} bg={T.purpleBg} style={{marginLeft:"auto"}}/>}
          </div>

          {editing.superAdmin ? (
            <Alert type="info">This user is a portal admin — all permissions are permanently granted.</Alert>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
              {permDefs.map(p => {
                const granted = editing.perms[p.k] !== false;
                // Prevent revoking dashboard
                const locked = p.k === "dashboard";
                return (
                  <div key={p.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:granted?T.greenBg:T.raised,borderRadius:8,border:`1px solid ${granted?T.green+"44":T.border}`,transition:"all 0.15s"}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:T.text}}>{p.l}</div>
                      <div style={{fontSize:11,color:T.muted,marginTop:1}}>{p.desc}</div>
                    </div>
                    <button
                      onClick={locked ? undefined : () => {
                        togglePerm(editing.id, p.k);
                        setEditing(prev => ({...prev, perms:{...prev.perms,[p.k]:!prev.perms[p.k]}}));
                      }}
                      title={locked?"Dashboard access cannot be revoked":""}
                      style={{width:42,height:24,borderRadius:14,background:granted?T.green:T.border,border:"none",cursor:locked?"not-allowed":"pointer",position:"relative",transition:"background 0.2s",flexShrink:0,opacity:locked?0.5:1}}>
                      <div style={{position:"absolute",top:3,left:granted?20:3,width:18,height:18,borderRadius:"50%",background:T.white,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{display:"flex",gap:10,justifyContent:"space-between",marginTop:4,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:8}}>
              {!editing.superAdmin && <>
                <Btn small variant="secondary" onClick={()=>{
                  const all = Object.fromEntries(permDefs.map(p=>[p.k,true]));
                  setUsers(prev=>prev.map(u=>u.id===editing.id?{...u,perms:all}:u));
                  setEditing(prev=>({...prev,perms:all}));
                }}>Grant All</Btn>
                <Btn small variant="secondary" onClick={()=>{
                  const none = Object.fromEntries(permDefs.map(p=>[p.k,p.k==="dashboard"]));
                  setUsers(prev=>prev.map(u=>u.id===editing.id?{...u,perms:none}:u));
                  setEditing(prev=>({...prev,perms:none}));
                }}>Revoke All</Btn>
              </>}
            </div>
            <Btn onClick={()=>setEditing(null)}>Done</Btn>
          </div>
        </Modal>
      )}

      {/* Stats */}
      <Grid cols={4}>
        <Stat label="Team Members" value={myUsers.length} accent/>
        <Stat label="Active" value={myUsers.filter(u=>u.status==="active").length}/>
        <Stat label="Suspended" value={myUsers.filter(u=>u.status==="suspended").length} sub={myUsers.filter(u=>u.status==="suspended").length>0?"Review access":"All clear"}/>
        <Stat label="Pending Invite" value={myUsers.filter(u=>u.status==="invited").length}/>
      </Grid>

      {/* Info */}
      <div style={{background:T.greenBg,border:`1px solid ${T.green}44`,borderRadius:14,padding:"12px 16px",marginBottom:16,fontSize:12,color:T.muted}}>
        <strong style={{color:T.green}}>How permissions work:</strong> Each team member only sees the sections you grant them. The Dashboard is always visible. Revoking a section removes it from their sidebar immediately.
      </div>

      {/* Search */}
      <div style={{position:"relative",marginBottom:14,maxWidth:320}}>
        <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:13}}><Icon name="search" size={15}/></span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search team members…"
          style={{width:"100%",padding:"8px 12px 8px 34px",borderRadius:8,border:`1px solid ${T.border}`,fontSize:13,fontFamily:FONT,outline:"none",background:T.raised}}/>
      </div>

      <Card>
        <Table
          headers={["Team Member","Email","Status","Last Login","Access","Actions"]}
          empty="No team members found"
          rows={filtered.map(u => {
            const sc = statusColor[u.status] || statusColor.inactive;
            const grantedCount = permDefs.filter(p => u.superAdmin || u.perms[p.k] !== false).length;
            const totalCount = permDefs.length;
            const isMe = u.email === user?.email;
            return (
              <tr key={u.id} style={{borderBottom:`1px solid ${T.border}`,background:u.status==="suspended"?T.redBg:u.status==="invited"?T.amberBg:"transparent"}}>
                <Td>
                  <div style={{display:"flex",alignItems:"center",gap:9}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${T.purple}88,${T.navy}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:560,color:T.white,flexShrink:0}}>
                      {u.name.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <div>
                      <div style={{fontWeight:560,fontSize:13}}>
                        {u.name}
                        {u.superAdmin && <span style={{marginLeft:5,fontSize:9,background:T.purple,color:T.white,borderRadius:4,padding:"1px 5px",fontWeight:560}}>ADMIN</span>}
                        {isMe && <span style={{marginLeft:5,fontSize:9,background:T.navy,color:T.white,borderRadius:4,padding:"1px 5px",fontWeight:560}}>YOU</span>}
                      </div>
                      <div style={{fontSize:11,color:T.muted}}>{u.email}</div>
                    </div>
                  </div>
                </Td>
                <Td><span style={{fontSize:12,color:T.muted}}>{u.email}</span></Td>
                <Td>
                  {isSuperAdmin && !isMe && !u.superAdmin ? (
                    <select value={u.status} onChange={e=>toggleStatus(u.id,e.target.value)}
                      style={{padding:"4px 8px",borderRadius:8,border:`1px solid ${sc.c}44`,background:sc.bg,color:sc.c,fontSize:11,fontWeight:560,fontFamily:FONT,cursor:"pointer",outline:"none"}}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                      {u.status==="invited"&&<option value="invited">Invited</option>}
                    </select>
                  ) : (
                    <Badge label={u.status.charAt(0).toUpperCase()+u.status.slice(1)} color={sc.c} bg={sc.bg} dot/>
                  )}
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
                    {(isSuperAdmin && !isMe) ? (
                      <>
                        <Btn small onClick={()=>setEditing({...u})}>Permissions</Btn>
                        <Btn small variant="secondary" onClick={()=>alert("Password reset email sent to this user.")}>Reset PW</Btn>
                      </>
                    ) : (
                      <Btn small variant="secondary" onClick={()=>setEditing({...u})}>View</Btn>
                    )}
                  </div>
                </Td>
              </tr>
            );
          })}
        />
      </Card>

      {/* Default permissions reference */}
      <div style={{marginTop:20}}>
        <Card>
          <CardHead title="Default Permission Template" sub="Permissions applied to all new invites. Contact Nexus RPO to request additional section access." icon="clipboard"/>
          <div style={{padding:"14px 18px"}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {permDefs.map(p=>(
                <span key={p.k} style={{padding:"4px 10px",borderRadius:20,background:T.greenBg,border:`1px solid ${T.green}44`,fontSize:11,fontWeight:600,color:T.green}} title={p.desc}>
                  ✓ {p.l}
                </span>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </Page>
  );
};
