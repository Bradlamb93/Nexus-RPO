import { useState } from "react";
import { Badge, SBadge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, Grid, Stat } from "../../components/ui/Card.jsx";
import { Modal, ProgressBar } from "../../components/ui/Feedback.jsx";
import { Input, Select } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { WORKERS } from "../../data/workers.js";
import { T } from "../../theme/tokens.js";

export const AgencyWorkers = ({navigate}) => {
  const mine = WORKERS.filter(w=>w.agency==="First Choice");
  const [editModal,setEditModal] = useState(null);
  const [editForm,setEditForm] = useState({});
  const openEdit = (w) => { setEditForm({...w}); setEditModal(w); };
  return (
    <Page title="My Workers" sub="Compliance status for all First Choice Nursing staff" icon="users">
      {editModal && (
        <Modal title={`Edit Worker — ${editModal.name}`} onClose={()=>setEditModal(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Full Name" value={editForm.name} onChange={v=>setEditForm(f=>({...f,name:v}))}/>
            <Input label="Email" value={editForm.email} onChange={v=>setEditForm(f=>({...f,email:v}))}/>
            <Input label="Phone" value={editForm.phone} onChange={v=>setEditForm(f=>({...f,phone:v}))}/>
            <Select label="Role" value={editForm.role} onChange={v=>setEditForm(f=>({...f,role:v}))} options={["RGN","RMN","HCA","Senior Carer","Deputy Manager"]}/>
            <Input label="DBS Expiry" type="date" value={editForm.dbsExpiry} onChange={v=>setEditForm(f=>({...f,dbsExpiry:v}))}/>
            <Input label="Training Expiry" type="date" value={editForm.trainingExpiry} onChange={v=>setEditForm(f=>({...f,trainingExpiry:v}))}/>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16}}>
            <Btn onClick={()=>setEditModal(null)}>Save Changes</Btn>
            <Btn variant="secondary" onClick={()=>setEditModal(null)}>Cancel</Btn>
          </div>
        </Modal>
      )}
      <Grid cols={3}>
        <Stat label="Total Workers" value={mine.length} accent/>
        <Stat label="Fully Compliant" value={mine.filter(w=>w.compliance>=95).length}/>
        <Stat label="Needs Attention" value={mine.filter(w=>w.compliance<80).length}/>
      </Grid>
      <Card>
        <Table
          headers={["Name","Role","DBS","Exp.","Training","Exp.","PIN","Score","Available","Actions"]}
          rows={mine.map(w=>(
            <tr key={w.id} style={{borderBottom:`1px solid ${T.border}`}}>
              <Td bold>{w.name}</Td>
              <Td><Badge label={w.role} color={T.purple} bg={T.purpleBg}/></Td>
              <Td><SBadge s={w.dbs}/></Td>
              <Td><span style={{fontSize:11,color:w.dbs==="expiring"?T.red:T.muted}}>{w.dbsExpiry}</span></Td>
              <Td><SBadge s={w.training}/></Td>
              <Td><span style={{fontSize:11,color:w.training!=="valid"?T.red:T.muted}}>{w.trainingExpiry}</span></Td>
              <Td>{w.pin?<Badge label="✓" color={T.green} bg={T.greenBg}/>:<Badge label="✗" color={T.red} bg={T.redBg}/>}</Td>
              <Td>
                <div style={{display:"flex",alignItems:"center",gap:6,minWidth:70}}>
                  <ProgressBar value={w.compliance} color={w.compliance>=95?T.green:w.compliance>=75?T.yellow:T.red}/>
                  <span style={{fontSize:11,fontWeight:560,color:w.compliance>=95?T.green:w.compliance>=75?T.yellow:T.red}}>{w.compliance}%</span>
                </div>
              </Td>
              <Td>{w.available?<Badge label="Available" color={T.green} bg={T.greenBg}/>:<Badge label="On Shift" color={T.muted} bg={T.sunken}/>}</Td>
              <Td>
                <div style={{display:"flex",gap:4}}>
                  <Btn small variant="secondary" onClick={()=>navigate&&navigate("documents")}>Docs</Btn>
                  <Btn small variant="secondary" onClick={()=>openEdit(w)}>Edit</Btn>
                </div>
              </Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};
