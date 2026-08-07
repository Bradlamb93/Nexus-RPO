import { useState } from "react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Alert, Modal } from "../../components/ui/Feedback.jsx";
import { Input } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { SITE_COLORS } from "../../data/clients.js";
import { PERM_DEFS, defaultPerms } from "../../data/users.js";
import { cap } from "../../lib/format.js";
import { T } from "../../theme/tokens.js";

export const CareHomeUsersAndPermissions = ({users, setUsers, user}) => {
  const thisUser = users?.find(u=>u.email===user?.email) || users?.find(u=>u.role==="carehome"&&u.superAdmin);
  const myOrg    = thisUser?.org || "Sunrise Healthcare Group";
  const mySites  = thisUser?.sites || [];
  const isSuperAdmin = thisUser?.superAdmin;

  // Show users who share at least one site with this user (or same org)
  const myUsers = (users||[]).filter(u=>
    (u.role==="clientadmin"||u.role==="carehome") &&
    (u.org===myOrg || u.sites?.some(s=>mySites.includes(s)))
  );

  const [editing,     setEditing]     = useState(null);
  const [inviteModal, setInviteModal] = useState(false);
  const [invite,      setInvite]      = useState({name:"",email:"",sites:[mySites[0]||""]});
  const [search,      setSearch]      = useState("");
  const permDefs = PERM_DEFS["carehome"]||[];
  const statusColor = {active:{c:T.green,bg:T.greenBg},inactive:{c:T.muted,bg:T.sunken},suspended:{c:T.red,bg:T.redBg},invited:{c:T.yellow,bg:T.yellowBg}};

  const filtered = myUsers.filter(u=>!search||u.name.toLowerCase().includes(search.toLowerCase())||u.email.toLowerCase().includes(search.toLowerCase()));

  const togglePerm = (uid,perm) => setUsers(prev=>prev.map(u=>u.id===uid?{...u,perms:{...u.perms,[perm]:!u.perms[perm]}}:u));
  const toggleStatus = (uid,status) => setUsers(prev=>prev.map(u=>u.id===uid?{...u,status}:u));
  const toggleSite = (uid,site) => setUsers(prev=>prev.map(u=>{
    if(u.id!==uid) return u;
    const has=u.sites?.includes(site);
    const newSites=has?(u.sites||[]).filter(s=>s!==site):[...(u.sites||[]),site];
    return {...u,sites:newSites};
  }));

  const sendInvite = () => {
    if(!invite.name||!invite.email) return;
    const nu={id:`u${(users||[]).length+100}`,name:invite.name,email:invite.email,role:"clientadmin",org:myOrg,status:"invited",lastLogin:"Never",superAdmin:false,perms:{...defaultPerms("clientadmin"),users:false},createdAt:new Date().toISOString().split("T")[0],sites:invite.sites.filter(Boolean)};
    setUsers(p=>[...p,nu]);
    setInvite({name:"",email:"",sites:[mySites[0]||""]});
    setInviteModal(false);
  };

  return (
    <Page title="Users & Permissions" sub={`Manage who can access your portal and which locations they can see`} icon="lock"
      action={isSuperAdmin?<Btn onClick={()=>setInviteModal(true)}>+ Invite User</Btn>:null}>

      {!isSuperAdmin&&<Alert type="info">You have view-only access. Contact your group administrator to make changes.</Alert>}

      {/* Invite modal */}
      {inviteModal&&(
        <Modal title="Invite Portal User" onClose={()=>setInviteModal(false)}>
          <div style={{background:T.greenBg,borderRadius:8,padding:"10px 14px",marginBottom:14,fontSize:12,color:T.green,fontWeight:600,border:`1px solid ${T.green}44`}}>
            They'll receive an invitation email and set their own password on first login.
          </div>
          <Input label="Full Name *" value={invite.name} onChange={v=>setInvite(p=>({...p,name:v}))} placeholder="e.g. Sam Hughes"/>
          <Input label="Work Email *" type="email" value={invite.email} onChange={v=>setInvite(p=>({...p,email:v}))} placeholder="name@company.co.uk"/>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:8}}>Site Access</label>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {mySites.map(s=>(
                <label key={s} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer",fontSize:13}}>
                  <input type="checkbox" checked={invite.sites.includes(s)} onChange={()=>{
                    const has=invite.sites.includes(s);
                    setInvite(p=>({...p,sites:has?p.sites.filter(x=>x!==s):[...p.sites,s]}));
                  }} style={{accentColor:T.amber,width:15,height:15}}/>
                  <span style={{color:T.text}}>{s}</span>
                  <div style={{width:10,height:10,borderRadius:"50%",background:SITE_COLORS[s]||T.blue,flexShrink:0}}/>
                </label>
              ))}
            </div>
          </div>
          <Alert type="info">Default permissions applied — you can customise after inviting.</Alert>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <Btn variant="secondary" onClick={()=>setInviteModal(false)}>Cancel</Btn>
            <Btn onClick={sendInvite}>Send Invitation →</Btn>
          </div>
        </Modal>
      )}

      {/* Permission editor */}
      {editing&&(
        <Modal title="Edit User" onClose={()=>setEditing(null)}>
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:T.raised,borderRadius:8,marginBottom:16}}>
            <div style={{width:42,height:42,borderRadius:"50%",background:`linear-gradient(135deg,${T.blue}88,${T.navy}88)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:T.white,fontWeight:560,flexShrink:0}}>
              {editing.name.split(" ").map(n=>n[0]).join("")}
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:560,fontSize:14}}>{editing.name}</div>
              <div style={{fontSize:12,color:T.muted}}>{editing.email}</div>
            </div>
            {editing.superAdmin&&<Badge label="Group Admin" color={T.blue} bg={T.blueBg}/>}
          </div>

          {/* Site access */}
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:8}}>Site Access</div>
            {editing.superAdmin
              ? <Alert type="info">Group admin has access to all sites in your group.</Alert>
              : <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {mySites.map(s=>{
                    const hasSite=editing.sites?.includes(s);
                    return (
                      <label key={s} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderRadius:8,border:`1px solid ${hasSite?SITE_COLORS[s]||T.blue:T.border}`,background:hasSite?`${SITE_COLORS[s]||T.blue}10`:T.raised,cursor:isSuperAdmin?"pointer":"default"}}>
                        <input type="checkbox" checked={!!hasSite} disabled={!isSuperAdmin} onChange={()=>{
                          toggleSite(editing.id,s);
                          setEditing(prev=>({...prev,sites:hasSite?(prev.sites||[]).filter(x=>x!==s):[...(prev.sites||[]),s]}));
                        }} style={{accentColor:SITE_COLORS[s]||T.blue,width:15,height:15}}/>
                        <div style={{width:10,height:10,borderRadius:"50%",background:SITE_COLORS[s]||T.blue,flexShrink:0}}/>
                        <span style={{fontSize:13,fontWeight:hasSite?700:400,color:hasSite?T.text:T.muted}}>{s}</span>
                      </label>
                    );
                  })}
                </div>
            }
          </div>

          {/* Permission toggles */}
          <div style={{fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:8}}>Portal Permissions</div>
          {editing.superAdmin
            ? <Alert type="info">Group admin — all permissions permanently granted.</Alert>
            : <div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:16}}>
                {permDefs.map(p=>{
                  const granted=editing.perms[p.k]!==false;
                  const locked=p.k==="dashboard";
                  return (
                    <div key={p.k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"10px 14px",background:granted?T.greenBg:T.raised,borderRadius:8,border:`1px solid ${granted?T.green+"44":T.border}`}}>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:T.text}}>{p.l}</div>
                        <div style={{fontSize:11,color:T.muted,marginTop:1}}>{p.desc}</div>
                      </div>
                      <button onClick={locked?undefined:()=>{togglePerm(editing.id,p.k);setEditing(prev=>({...prev,perms:{...prev.perms,[p.k]:!prev.perms[p.k]}}));}}
                        disabled={!isSuperAdmin||locked}
                        style={{width:42,height:24,borderRadius:14,background:granted?T.green:T.border,border:"none",cursor:(isSuperAdmin&&!locked)?"pointer":"not-allowed",position:"relative",transition:"background 0.2s",flexShrink:0,opacity:(locked||!isSuperAdmin)?0.5:1}}>
                        <div style={{position:"absolute",top:3,left:granted?20:3,width:18,height:18,borderRadius:"50%",background:T.white,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
                      </button>
                    </div>
                  );
                })}
              </div>
          }

          {isSuperAdmin&&!editing.superAdmin&&(
            <div style={{display:"flex",gap:8,justifyContent:"space-between",flexWrap:"wrap",paddingTop:4,borderTop:`1px solid ${T.border}`}}>
              <div style={{display:"flex",gap:8}}>
                <Btn small variant="secondary" onClick={()=>{const all=Object.fromEntries(permDefs.map(p=>[p.k,true]));setUsers(prev=>prev.map(u=>u.id===editing.id?{...u,perms:all}:u));setEditing(prev=>({...prev,perms:all}));}}>Grant All</Btn>
                <Btn small variant="secondary" onClick={()=>{const none=Object.fromEntries(permDefs.map(p=>[p.k,p.k==="dashboard"]));setUsers(prev=>prev.map(u=>u.id===editing.id?{...u,perms:none}:u));setEditing(prev=>({...prev,perms:none}));}}>Revoke All</Btn>
              </div>
              <div style={{display:"flex",gap:8}}>
                {editing.status!=="suspended"?<Btn small variant="danger" onClick={()=>{toggleStatus(editing.id,"suspended");setEditing(null);}}>Suspend</Btn>:<Btn small onClick={()=>{toggleStatus(editing.id,"active");setEditing(null);}}>Reactivate</Btn>}
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Search */}
      <Card>
        <div style={{padding:"14px 16px 10px"}}>
          <Input placeholder="Search users by name or email…" value={search} onChange={setSearch}/>
        </div>
        <Table
          headers={["User","Sites","Permissions","Status","Last Login","Actions"]}
          rows={filtered.map(u=>{
            const sc=statusColor[u.status]||statusColor.active;
            const grantedCount=(u.perms?Object.values(u.perms).filter(Boolean).length:0);
            return (
              <tr key={u.id} style={{borderBottom:`1px solid ${T.border}`}}>
                <Td>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:34,height:34,borderRadius:"50%",background:`linear-gradient(135deg,${T.blue}66,${T.navy}66)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:T.white,fontWeight:560,flexShrink:0}}>
                      {u.name.split(" ").map(n=>n[0]).join("")}
                    </div>
                    <div>
                      <div style={{fontWeight:560,fontSize:13}}>{u.name}{u.superAdmin&&<Badge label="Admin" color={T.blue} bg={T.blueBg} style={{marginLeft:6,fontSize:10}}/>}</div>
                      <div style={{fontSize:11,color:T.muted}}>{u.email}</div>
                    </div>
                  </div>
                </Td>
                <Td>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {u.superAdmin
                      ? <Badge label="All Sites" color={T.blue} bg={T.blueBg}/>
                      : (u.sites||[]).map(s=><span key={s} style={{fontSize:10,fontWeight:560,padding:"2px 7px",borderRadius:10,background:`${SITE_COLORS[s]||T.blue}18`,color:SITE_COLORS[s]||T.blue,border:`1px solid ${SITE_COLORS[s]||T.blue}44`}}>{s.split(" ")[0]}</span>)
                    }
                  </div>
                </Td>
                <Td>
                  {u.superAdmin
                    ? <span style={{fontSize:12,color:T.muted}}>All granted</span>
                    : <span style={{fontSize:12,color:T.muted}}>{grantedCount} of {permDefs.length} granted</span>
                  }
                </Td>
                <Td><Badge label={cap(u.status)} color={sc.c} bg={sc.bg}/></Td>
                <Td style={{fontSize:12,color:T.muted}}>{u.lastLogin}</Td>
                <Td>
                  {(isSuperAdmin||u.id===thisUser?.id)&&<Btn small onClick={()=>setEditing({...u})}>Edit</Btn>}
                </Td>
              </tr>
            );
          })}
        />
      </Card>
    </Page>
  );
};
