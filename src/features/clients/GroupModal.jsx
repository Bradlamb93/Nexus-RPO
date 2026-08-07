import { useState } from "react";
import { Btn } from "../../components/ui/Button.jsx";
import { Modal } from "../../components/ui/Feedback.jsx";
import { Input, Select } from "../../components/ui/Form.jsx";
import { CONTRACT_STATUSES } from "../../data/clients.js";

export const GroupModal = ({group, onSave, onClose, isNew}) => {
  const [g, setG] = useState({...group, locations:[...group.locations]});
  const f = (k,v) => setG(p=>({...p,[k]:v}));
  return (
    <Modal title={isNew?"Onboard New Client Group":"Edit Client Group"} onClose={onClose}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{gridColumn:"1/-1"}}><Input label="Group / Company Name *" value={g.name} onChange={v=>f("name",v)} placeholder="e.g. Sunrise Healthcare Group"/></div>
        <Select label="Primary Care Type" value={g.type} onChange={v=>f("type",v)} options={["Residential","Nursing","Dementia","Residential & Nursing","Mixed"]}/>
        <Select label="Contract Status" value={g.status} onChange={v=>f("status",v)} options={CONTRACT_STATUSES}/>
        <Input label="Group Contact *" value={g.contact} onChange={v=>f("contact",v)} placeholder="Primary contact name"/>
        <Input label="Contact Email *" type="email" value={g.email} onChange={v=>f("email",v)} placeholder="contact@group.co.uk"/>
        <Input label="Phone" value={g.phone} onChange={v=>f("phone",v)} placeholder="0161 000 0000"/>
        <Input label="Website" value={g.website} onChange={v=>f("website",v)} placeholder="groupname.co.uk"/>
        <Input label="Contract Start" type="date" value={g.contractStart} onChange={v=>f("contractStart",v)}/>
        <Input label="Contract End" type="date" value={g.contractEnd} onChange={v=>f("contractEnd",v)}/>
        <div style={{gridColumn:"1/-1"}}><Input label="Registered Address" value={g.address} onChange={v=>f("address",v)} placeholder="Head office address"/></div>
        <div style={{gridColumn:"1/-1"}}><Input label="Notes" value={g.notes} onChange={v=>f("notes",v)} placeholder="Contract notes, special terms…"/></div>
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}>
        <Btn variant="secondary" onClick={onClose}>Cancel</Btn>
        <Btn onClick={()=>{if(!g.name||!g.contact||!g.email)return;onSave(g);onClose();}}>
          {isNew?"Save & Add Locations →":"Save Changes"}
        </Btn>
      </div>
    </Modal>
  );
};
