import { useState } from "react";
import { Icon } from "../../components/Icon.jsx";
import { Badge, SBadge } from "../../components/ui/Badge.jsx";
import { Btn, Pill } from "../../components/ui/Button.jsx";
import { Card, Grid, Stat } from "../../components/ui/Card.jsx";
import { Modal } from "../../components/ui/Feedback.jsx";
import { Input, Select } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { DOCS } from "../../data/compliance.js";
import { WORKERS } from "../../data/workers.js";
import { exportCSV } from "../../lib/export.js";
import { T } from "../../theme/tokens.js";

/* ─── ADMIN: DOCUMENTS ───────────────────────────────────────────────────────── */
export const DocumentVault = () => {
  const [filter,setFilter] = useState("all");
  const [uploadModal,setUploadModal] = useState(false);
  const [viewModal,setViewModal] = useState(null);
  const [requestedNew,setRequestedNew] = useState([]);
  const filtered = filter==="all"?DOCS:DOCS.filter(d=>d.status===filter);

  const handleDownload = (d) => {
    exportCSV(`${d.worker.replace(/ /g,"_")}_${d.type.replace(/ /g,"_")}.csv`,
      ["Worker","Document Type","Uploaded","Expires","Status"],
      [[d.worker,d.type,d.uploaded,d.expires,d.status]]);
  };

  return (
    <Page title="Document Vault" sub="Centralised storage for all worker credentials" icon="folder" action={<Btn onClick={()=>setUploadModal(true)}>Upload Document</Btn>}>
      {uploadModal && (
        <Modal title="Upload Document" onClose={()=>setUploadModal(false)}>
          <Select label="Worker" value="" onChange={()=>{}} options={WORKERS.map(w=>w.name)}/>
          <Select label="Document Type" value="" onChange={()=>{}} options={["DBS Certificate","Mandatory Training","Right to Work","NMC PIN","Passport","Visa/BRP"]}/>
          <div style={{marginBottom:16}}>
            <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:8}}>Upload File</label>
            <div style={{border:`2px dashed ${T.border}`,borderRadius:8,padding:"28px",textAlign:"center",cursor:"pointer",background:T.raised}}>
              <div style={{marginBottom:8,display:"flex",justifyContent:"center",color:T.ghost}}><Icon name="paperclip" size={26} stroke={1.5}/></div>
              <div style={{fontSize:13,color:T.muted}}>Drag & drop or click to browse</div>
              <div style={{fontSize:11,color:T.ghost,marginTop:4}}>PDF, JPG, PNG — max 10MB</div>
            </div>
          </div>
          <Input label="Expiry Date" type="date" value="" onChange={()=>{}}/>
          <div style={{display:"flex",gap:8}}>
            <Btn onClick={()=>{setUploadModal(false);alert("Document uploaded successfully.");}}>Upload</Btn>
            <Btn variant="secondary" onClick={()=>setUploadModal(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
      {viewModal && (
        <Modal title={`${viewModal.type} — ${viewModal.worker}`} onClose={()=>setViewModal(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
            {[["Worker",viewModal.worker],["Document Type",viewModal.type],["Uploaded",viewModal.uploaded],["Expires",viewModal.expires]].map(([k,v])=>(
              <div key={k} style={{background:T.raised,borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:11,color:T.muted,fontWeight:560,letterSpacing:"-0.006em",marginBottom:3}}>{k}</div>
                <div style={{fontSize:13,fontWeight:600}}>{v}</div>
              </div>
            ))}
          </div>
          <SBadge s={viewModal.status}/>
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <Btn onClick={()=>{handleDownload(viewModal);setViewModal(null);}}>Download</Btn>
            <Btn variant="secondary" onClick={()=>setViewModal(null)}>Close</Btn>
          </div>
        </Modal>
      )}
      <Grid cols={3}>
        <Stat label="Total Documents" value={DOCS.length} accent/>
        <Stat label="Verified" value={DOCS.filter(d=>d.status==="verified").length}/>
        <Stat label="Expiring / Expired" value={DOCS.filter(d=>d.status!=="verified").length} sub="Action required"/>
      </Grid>
      <div style={{display:"flex",gap:6,marginBottom:14}}>
        {["all","verified","expiring","expired"].map(f=>(
          <Pill key={f} label={f==="all"?"All":f.charAt(0).toUpperCase()+f.slice(1)} active={filter===f} onClick={()=>setFilter(f)}/>
        ))}
      </div>
      <Card>
        <Table
          headers={["Worker","Document Type","Upload Date","Expiry Date","Status","Actions"]}
          rows={filtered.map((d,i)=>(
            <tr key={i} style={{borderBottom:`1px solid ${T.border}`,background:d.status==="expired"?T.redBg:d.status==="expiring"?T.amberBg:"transparent"}}>
              <Td bold>{d.worker}</Td>
              <Td>{d.type}</Td>
              <Td>{d.uploaded}</Td>
              <Td>{d.expires}</Td>
              <Td><SBadge s={d.status}/></Td>
              <Td>
                <div style={{display:"flex",gap:5}}>
                  <Btn small variant="secondary" onClick={()=>setViewModal(d)}>View</Btn>
                  <Btn small variant="secondary" onClick={()=>handleDownload(d)}>Download</Btn>
                  {d.status==="expired" && !requestedNew.includes(i) && <Btn small variant="danger" onClick={()=>setRequestedNew(r=>[...r,i])}>Request New</Btn>}
                  {requestedNew.includes(i) && <Badge label="Requested" color={T.amber} bg={T.amberBg}/>}
                </div>
              </Td>
            </tr>
          ))}
        />
      </Card>
    </Page>
  );
};
