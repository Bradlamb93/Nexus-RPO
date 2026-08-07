import { useState } from "react";
import { Icon } from "../../components/Icon.jsx";
import { SBadge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Alert, Modal } from "../../components/ui/Feedback.jsx";
import { Input, Select } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { DOCS } from "../../data/compliance.js";
import { WORKERS } from "../../data/workers.js";
import { exportCSV } from "../../lib/export.js";
import { T } from "../../theme/tokens.js";

export const AgencyDocuments = () => {
  const [uploadModal,setUploadModal] = useState(false);
  const [viewModal,setViewModal] = useState(null);
  const myDocs = DOCS.filter(d=>WORKERS.find(w=>w.name===d.worker&&w.agency==="First Choice"));
  return (
  <Page title="Compliance Documents" sub="Manage documents for First Choice Nursing workers" icon="folder" action={<Btn onClick={()=>setUploadModal(true)}>Upload Document</Btn>}>
    {uploadModal && (
      <Modal title="Upload Document" onClose={()=>setUploadModal(false)}>
        <Select label="Worker" value="" onChange={()=>{}} options={WORKERS.filter(w=>w.agency==="First Choice").map(w=>w.name)}/>
        <Select label="Document Type" value="" onChange={()=>{}} options={["DBS Certificate","Mandatory Training","Right to Work","NMC PIN","Passport"]}/>
        <div style={{border:`2px dashed ${T.border}`,borderRadius:8,padding:"28px",textAlign:"center",cursor:"pointer",background:T.raised,marginBottom:12}}>
          <div style={{marginBottom:8,display:"flex",justifyContent:"center",color:T.ghost}}><Icon name="paperclip" size={26} stroke={1.5}/></div>
          <div style={{fontSize:13,color:T.muted}}>Drag & drop or click to browse</div>
          <div style={{fontSize:11,color:T.ghost,marginTop:4}}>PDF, JPG, PNG — max 10MB</div>
        </div>
        <Input label="Expiry Date" type="date" value="" onChange={()=>{}}/>
        <div style={{display:"flex",gap:8}}>
          <Btn onClick={()=>{setUploadModal(false);alert("Document uploaded and sent to Nexus RPO for verification.");}}>Upload</Btn>
          <Btn variant="secondary" onClick={()=>setUploadModal(false)}>Cancel</Btn>
        </div>
      </Modal>
    )}
    {viewModal && (
      <Modal title={`${viewModal.type} — ${viewModal.worker}`} onClose={()=>setViewModal(null)}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          {[["Worker",viewModal.worker],["Type",viewModal.type],["Uploaded",viewModal.uploaded],["Expires",viewModal.expires]].map(([k,v])=>(
            <div key={k} style={{background:T.raised,borderRadius:8,padding:"10px 12px"}}>
              <div style={{fontSize:11,color:T.muted,fontWeight:560,letterSpacing:"-0.006em",marginBottom:3}}>{k}</div>
              <div style={{fontSize:13,fontWeight:600}}>{v}</div>
            </div>
          ))}
        </div>
        <SBadge s={viewModal.status}/>
        <div style={{display:"flex",gap:8,marginTop:14}}>
          <Btn onClick={()=>{exportCSV(`${viewModal.worker}_${viewModal.type}.csv`,["Worker","Type","Uploaded","Expires","Status"],[[viewModal.worker,viewModal.type,viewModal.uploaded,viewModal.expires,viewModal.status]]);setViewModal(null);}}>Download</Btn>
          <Btn variant="secondary" onClick={()=>setViewModal(null)}>Close</Btn>
        </div>
      </Modal>
    )}
    <Alert type="warn">2 documents are expiring within 30 days. Upload replacements to maintain compliance scores.</Alert>
    <Card>
      <Table
        headers={["Worker","Document Type","Upload Date","Expiry Date","Status","Actions"]}
        rows={myDocs.map((d,i)=>(
          <tr key={i} style={{borderBottom:`1px solid ${T.border}`,background:d.status==="expired"?T.redBg:d.status==="expiring"?T.amberBg:"transparent"}}>
            <Td bold>{d.worker}</Td>
            <Td>{d.type}</Td>
            <Td>{d.uploaded}</Td>
            <Td>{d.expires}</Td>
            <Td><SBadge s={d.status}/></Td>
            <Td>
              <div style={{display:"flex",gap:5}}>
                <Btn small variant="secondary" onClick={()=>setViewModal(d)}>View</Btn>
                <Btn small variant="secondary" onClick={()=>setUploadModal(true)}>Replace</Btn>
              </div>
            </Td>
          </tr>
        ))}
      />
    </Card>
  </Page>
  );
};
