import { Badge, SBadge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead } from "../../components/ui/Card.jsx";
import { ProgressBar } from "../../components/ui/Feedback.jsx";
import { Input } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { BANK_STAFF } from "../../data/workers.js";
import { T } from "../../theme/tokens.js";

/* ─── BANK: PROFILE ──────────────────────────────────────────────────────────── */
export const BankProfile = ({user}) => {
  const me=BANK_STAFF.find(w=>w.name===user.name)||BANK_STAFF[0];
  return (
    <Page title="My Profile" sub="Compliance documents and personal details" icon="user">
      <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:18,maxWidth:860}}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card style={{padding:22,textAlign:"center"}}>
            <div style={{width:68,height:68,borderRadius:"50%",background:`linear-gradient(135deg,${T.teal},${T.navy})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,color:T.white,fontWeight:560,margin:"0 auto 10px"}}>{me.name.split(" ").map(n=>n[0]).join("")}</div>
            <div style={{fontSize:15,fontWeight:560}}>{me.name}</div>
            <div style={{fontSize:12,color:T.muted,marginTop:3}}>{me.role} · Bank Staff</div>
            <div style={{marginTop:10}}><Badge label="Active" color={T.green} bg={T.greenBg} dot/></div>
            <div style={{marginTop:14,fontSize:26,fontWeight:600,color:me.compliance>=95?T.green:me.compliance>=75?T.yellow:T.red}}>{me.compliance}%</div>
            <div style={{fontSize:11,color:T.muted,marginBottom:8}}>Compliance score</div>
            <ProgressBar value={me.compliance} color={me.compliance>=95?T.green:T.yellow}/>
          </Card>
          <Card>
            <CardHead title="Eligible Care Homes" icon="hospital"/>
            <div style={{padding:12}}>
              {me.contracts.map(c=><div key={c} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 0",borderBottom:`1px solid ${T.border}`,fontSize:12}}><span style={{color:T.teal}}>✓</span><span style={{fontWeight:500}}>{c}</span></div>)}
            </div>
          </Card>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <Card style={{padding:20}}>
            <h3 style={{fontWeight:560,fontSize:14,marginBottom:14}}>Personal Details</h3>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Input label="Full Name" value={me.name} onChange={()=>{}}/>
              <Input label="Role" value={me.role} onChange={()=>{}}/>
              <Input label="Email" value={me.email} onChange={()=>{}}/>
              <Input label="Phone" value={me.phone} onChange={()=>{}}/>
            </div>
            <Btn variant="secondary" onClick={()=>alert("Details updated successfully.")}>Update Details</Btn>
          </Card>
          <Card>
            <CardHead title="Compliance Documents" icon="folder"/>
            <div style={{padding:14}}>
              {[
                {type:"DBS Certificate",expiry:me.dbsExpiry,status:me.dbs},
                {type:"Mandatory Training",expiry:me.trainingExpiry,status:me.training},
                {type:"NMC / PIN",expiry:"—",status:me.pinStatus?"valid":"expired"},
              ].map((doc,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 14px",border:`1px solid ${doc.status==="valid"?T.border:doc.status==="expiring"?T.yellow:T.red}`,borderRadius:8,marginBottom:8,background:doc.status==="expired"?T.redBg:doc.status==="expiring"?T.amberBg:T.white}}>
                  <div><div style={{fontSize:13,fontWeight:600,color:T.text}}>{doc.type}</div><div style={{fontSize:11,color:T.muted,marginTop:2}}>Expires: {doc.expiry}</div></div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}><SBadge s={doc.status}/><Btn small variant="secondary" onClick={()=>alert(`Upload started for ${doc.type}. Select a file from your device.`)}>Upload</Btn></div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Page>
  );
};
