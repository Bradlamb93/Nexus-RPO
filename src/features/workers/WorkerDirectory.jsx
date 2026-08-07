import { useState } from "react";
import { Icon } from "../../components/Icon.jsx";
import { Badge, SBadge } from "../../components/ui/Badge.jsx";
import { Btn, Pill } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Modal, ProgressBar } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { WORKERS } from "../../data/workers.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── ADMIN: WORKERS ─────────────────────────────────────────────────────────── */
export const WorkerDirectory = ({navigate}) => {
  const [search,setSearch] = useState("");
  const [roleF,setRoleF] = useState("All");
  const [selected,setSelected] = useState(null);
  const filtered = WORKERS.filter(w=>{
    const ms = !search||w.name.toLowerCase().includes(search.toLowerCase())||w.agency.toLowerCase().includes(search.toLowerCase());
    const mr = roleF==="All"||w.role===roleF;
    return ms&&mr;
  });
  return (
    <Page title="Worker Directory" sub="All registered workers across all agencies" icon="users">
      {selected && (
        <Modal title="Worker Profile" onClose={()=>setSelected(null)} width={460}>
          <div style={{textAlign:"center",marginBottom:20}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:`linear-gradient(135deg,${T.amber},${T.navy})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:T.white,fontWeight:560,margin:"0 auto 10px"}}>{selected.name.split(" ").map(n=>n[0]).join("")}</div>
            <div style={{fontSize:17,fontWeight:560,color:T.text}}>{selected.name}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:2}}>{selected.role} · {selected.agency}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
            {[["Email",selected.email],["Phone",selected.phone],["DBS Expiry",selected.dbsExpiry],["Training Expiry",selected.trainingExpiry],["NMC/PIN",selected.pin||"Not provided"],["Available",selected.available?"Yes":"Currently placed"]].map(([k,v])=>(
              <div key={k} style={{background:T.raised,borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:10,color:T.muted,fontWeight:560,letterSpacing:"-0.006em",marginBottom:3}}>{k}</div>
                <div style={{fontSize:12,fontWeight:600,color:T.text}}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,color:T.muted,fontWeight:560,letterSpacing:"-0.006em",marginBottom:6}}>Compliance Score</div>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{flex:1}}><ProgressBar value={selected.compliance} color={selected.compliance>=95?T.green:selected.compliance>=75?T.yellow:T.red}/></div>
              <span style={{fontWeight:600,fontSize:16,color:selected.compliance>=95?T.green:selected.compliance>=75?T.yellow:T.red}}>{selected.compliance}%</span>
            </div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <Btn small variant="secondary" onClick={()=>navigate&&navigate("documents")}>View Documents</Btn>
            {selected.compliance<80 && <Btn small variant="danger" onClick={()=>alert(`Alert sent to ${selected.agency} regarding ${selected.name}'s compliance (${selected.compliance}%). They have been notified to update outstanding documents.`)}>Alert Agency</Btn>}
          </div>
        </Modal>
      )}
      <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
        <div style={{position:"relative",flex:1,maxWidth:280}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:13}}><Icon name="search" size={15}/></span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search workers…" style={{width:"100%",padding:"9px 12px 9px 32px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,background:T.white,color:T.text,outline:"none",fontFamily:FONT}}/>
        </div>
        <div style={{display:"flex",gap:6}}>
          {["All","RGN","RMN","HCA","Senior Carer"].map(r=>(
            <Pill key={r} label={r} active={roleF===r} onClick={()=>setRoleF(r)}/>
          ))}
        </div>
      </div>
      <Card>
        <Table
          headers={["Worker","Role","Agency","DBS","Training","PIN","Score","Available","Action"]}
          empty="No workers found"
          rows={filtered.map(w=>(
            <tr key={w.id} style={{borderBottom:`1px solid ${T.border}`,background:w.compliance<60?T.redBg:"transparent"}}>
              <Td><div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:`linear-gradient(135deg,${T.amber}66,${T.navy}66)`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:560,color:T.navy,flexShrink:0}}>{w.name.split(" ").map(n=>n[0]).join("")}</div>
                <span style={{fontWeight:600,fontSize:13}}>{w.name}</span>
              </div></Td>
              <Td><Badge label={w.role} color={T.purple} bg={T.purpleBg}/></Td>
              <Td><span style={{fontSize:12,color:T.muted}}>{w.agency}</span></Td>
              <Td><SBadge s={w.dbs}/></Td>
              <Td><SBadge s={w.training}/></Td>
              <Td>{w.pinStatus?<Badge label="✓ Verified" color={T.green} bg={T.greenBg}/>:<Badge label="✗ Missing" color={T.red} bg={T.redBg}/>}</Td>
              <Td>
                <div style={{display:"flex",alignItems:"center",gap:8,minWidth:80}}>
                  <div style={{flex:1}}><ProgressBar value={w.compliance} color={w.compliance>=95?T.green:w.compliance>=75?T.yellow:T.red}/></div>
                  <span style={{fontSize:11,fontWeight:560,color:w.compliance>=95?T.green:w.compliance>=75?T.yellow:T.red}}>{w.compliance}%</span>
                </div>
              </Td>
              <Td>{w.available?<Badge label="Available" color={T.green} bg={T.greenBg}/>:<Badge label="On Shift" color={T.muted} bg={T.sunken}/>}</Td>
              <Td><Btn small variant="secondary" onClick={()=>setSelected(w)}>View</Btn></Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};
