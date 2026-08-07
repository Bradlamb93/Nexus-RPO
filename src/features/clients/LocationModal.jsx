import { useState } from "react";
import { Btn } from "../../components/ui/Button.jsx";
import { Modal } from "../../components/ui/Feedback.jsx";
import { Input, Select } from "../../components/ui/Form.jsx";
import { HOME_TYPES } from "../../data/clients.js";

export const LocationModal = ({loc, onSave, onClose, isNew}) => {
  const [l, setL] = useState({...loc});
  const f = (k,v) => setL(p=>({...p,[k]:v}));
  return (
    <Modal title={isNew?"Add Location":"Edit Location"} onClose={onClose}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{gridColumn:"1/-1"}}><Input label="Location Name *" value={l.name} onChange={v=>f("name",v)} placeholder="e.g. Sunrise Care — Didsbury"/></div>
        <Select label="Type" value={l.type} onChange={v=>f("type",v)} options={HOME_TYPES}/>
        <Input label="Beds" type="number" value={l.beds} onChange={v=>f("beds",v)} placeholder="42"/>
        <div style={{gridColumn:"1/-1"}}><Input label="Address *" value={l.address} onChange={v=>f("address",v)} placeholder="Full address including postcode"/></div>
        <Input label="Site Contact" value={l.contact} onChange={v=>f("contact",v)} placeholder="Name"/>
        <Input label="Contact Email" type="email" value={l.email} onChange={v=>f("email",v)} placeholder="manager@home.co.uk"/>
        <Input label="Contact Phone" value={l.phone} onChange={v=>f("phone",v)} placeholder="0161 000 0000"/>
        <Input label="CQC Inspection Date" type="date" value={l.cqcDate} onChange={v=>f("cqcDate",v)}/>
        <Select label="CQC Rating" value={l.cqcRating} onChange={v=>f("cqcRating",v)} options={["Outstanding","Good","Requires Improvement","Inadequate","Not rated"]}/>
        <Select label="Status" value={l.status} onChange={v=>f("status",v)} options={["active","inactive","suspended"]}/>
        <div style={{gridColumn:"1/-1"}}><Input label="Notes" value={l.notes} onChange={v=>f("notes",v)} placeholder="e.g. specialist requirements, access notes…"/></div>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={()=>{if(!l.name||!l.address)return;onSave(l);onClose();}}>Save Location</Btn>
      </div>
    </Modal>
  );
};
