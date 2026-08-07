import { T } from "../../theme/tokens.js";

export const fieldStyle = {width:"100%",padding:"10px 13px",border:`1px solid ${T.border}`,borderRadius:T.rSm,fontSize:13.5,color:T.text,background:T.white,letterSpacing:"-0.008em",transition:`border-color ${T.t}, box-shadow ${T.t}`};

export const labelStyle = {display:"block",fontSize:12.5,fontWeight:510,color:T.muted,marginBottom:6,letterSpacing:"-0.006em"};

export const Input = ({label,value,onChange,type="text",placeholder,required,small}) => (
  <div style={{marginBottom:small?0:16}}>
    {label && <label style={labelStyle}>{label}{required&&<span style={{color:T.red}}> *</span>}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={fieldStyle} />
  </div>
);

export const Select = ({label,value,onChange,options,required}) => (
  <div style={{marginBottom:16}}>
    {label && <label style={labelStyle}>{label}{required&&<span style={{color:T.red}}> *</span>}</label>}
    <select value={value} onChange={e=>onChange(e.target.value)} style={{...fieldStyle,cursor:"pointer"}}>
      {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
    </select>
  </div>
);
