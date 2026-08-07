import { useState } from "react";
import { Icon, renderIcon } from "../../components/Icon.jsx";
import { UrgDot } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead } from "../../components/ui/Card.jsx";
import { Modal } from "../../components/ui/Feedback.jsx";
import { Input, Select } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { INIT_BANK_RATES, INIT_RATE_CARDS } from "../../data/rates.js";
import { BROADCAST_OPTIONS, INIT_SHIFT_PATTERNS } from "../../data/shifts.js";
import { urgencyColor } from "../../lib/format.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── CARE HOME: REQUEST SHIFT ───────────────────────────────────────────────── */
export const RequestShift = ({user, navigate, rateCards, bankRates, shiftPatterns, setShiftPatterns}) => {
  const [mode, setMode] = useState("single");

  /* ── helpers ── */
  const getAgencyRate = (role) => {
    const rc = (rateCards||INIT_RATE_CARDS).find(r=>r.type==="client"&&r.role===role);
    return rc ? rc.weekday : 30;
  };
  const getBankRate = (role) => {
    const br = (bankRates?.global||INIT_BANK_RATES.global).find(r=>r.role===role);
    return br ? br.weekday : 20;
  };
  const getEffectiveRate = (role, broadcast) => {
    if(broadcast==="bank_first") return getBankRate(role);
    return getAgencyRate(role);
  };
  const calcHrs = (s,e) => {
    if(!s||!e) return 12;
    const [sh,sm]=s.split(":").map(Number);
    const [eh,em]=e.split(":").map(Number);
    let d=(eh*60+em)-(sh*60+sm);
    if(d<=0) d+=1440;
    return Math.round(d/60*10)/10;
  };

  /* ── SINGLE STATE ── */
  const [form,setForm]=useState({role:"RGN",date:"",timeStart:"07:00",timeEnd:"19:00",urgency:"normal",notes:"",broadcastTo:"bank_first"});
  const [submitted,setSubmitted]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const selectedBroadcast = BROADCAST_OPTIONS.find(o=>o.key===form.broadcastTo);
  const singleHrs = calcHrs(form.timeStart, form.timeEnd);
  const singleRate = getEffectiveRate(form.role, form.broadcastTo);
  const singleCost = Math.round(singleRate * singleHrs);

  /* ── BULK STATE ── */
  const [bRole,      setBRole]      = useState("RGN");
  const [bPattern,   setBPattern]   = useState("sp1");
  const [bCustomS,   setBCustomS]   = useState("07:00");
  const [bCustomE,   setBCustomE]   = useState("19:00");
  const [bUrgency,   setBUrgency]   = useState("normal");
  const [bBroadcast, setBBroadcast] = useState("bank_first");
  const [bNotes,     setBNotes]     = useState("");
  const [bRows,      setBRows]      = useState([{id:1,date:""},{id:2,date:""},{id:3,date:""}]);
  const [bSubmitted, setBSubmitted] = useState(false);

  /* ── PATTERN EDITOR STATE ── */
  const [showPatternEditor, setShowPatternEditor] = useState(false);
  const [patForm, setPatForm] = useState({l:"",s:"07:00",e:"19:00"});
  const [editPatId, setEditPatId] = useState(null);

  const patterns = shiftPatterns || INIT_SHIFT_PATTERNS;
  const patCfg = patterns.find(p=>p.id===bPattern) || patterns[0];
  const isCustomPat = bPattern==="custom";
  const bStart = isCustomPat ? bCustomS : patCfg?.s||"07:00";
  const bEnd   = isCustomPat ? bCustomE : patCfg?.e||"19:00";
  const bHrs   = isCustomPat ? calcHrs(bCustomS,bCustomE) : (patCfg?.hrs||12);
  const bRate  = getEffectiveRate(bRole, bBroadcast);
  const validBRows = bRows.filter(r=>r.date);
  const bTotalCost = Math.round(validBRows.length * bRate * bHrs);

  const addBRow = () => setBRows(r=>[...r,{id:Date.now(),date:""}]);
  const removeBRow = id => setBRows(r=>r.filter(x=>x.id!==id));
  const setBRowDate = (id,v) => setBRows(r=>r.map(x=>x.id===id?{...x,date:v}:x));

  /* pattern editor actions */
  const openAddPat = () => { setEditPatId(null); setPatForm({l:"",s:"07:00",e:"19:00"}); setShowPatternEditor(true); };
  const openEditPat = (p) => { setEditPatId(p.id); setPatForm({l:p.l,s:p.s,e:p.e}); setShowPatternEditor(true); };
  const savePat = () => {
    const hrs = calcHrs(patForm.s, patForm.e);
    if(editPatId) {
      setShiftPatterns(ps=>ps.map(p=>p.id===editPatId?{...p,...patForm,hrs,k:`${patForm.s}-${patForm.e}`}:p));
    } else {
      const id = `sp${Date.now()}`;
      setShiftPatterns(ps=>[...ps,{id,k:`${patForm.s}-${patForm.e}`,l:patForm.l,s:patForm.s,e:patForm.e,hrs}]);
    }
    setShowPatternEditor(false);
  };
  const deletePat = (id) => {
    setShiftPatterns(ps=>ps.filter(p=>p.id!==id));
    if(bPattern===id) setBPattern(patterns.find(p=>p.id!==id)?.id||"custom");
  };

  const rateLabel = bBroadcast==="bank_first" ? "Bank rate" : "Agency rate";
  const singleRateLabel = form.broadcastTo==="bank_first" ? "Bank rate" : "Agency rate";

  /* ── SUCCESS SCREENS ── */
  if(submitted) return (
    <Page title="Request Submitted" icon="checkCircle">
      <div style={{maxWidth:460,background:T.white,borderRadius:18,border:`1px solid ${T.border}`,padding:40,textAlign:"center"}}>
        <div style={{marginBottom:12,display:"flex",justifyContent:"center",color:T.ghost}}><Icon name="checkCircle" size={46} stroke={1.5}/></div>
        <h2 style={{fontFamily:FONT,fontSize:22,marginBottom:8}}>Shift Published</h2>
        <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 14px",borderRadius:20,background:selectedBroadcast.bg,border:`1px solid ${selectedBroadcast.border}`,marginBottom:14}}>
          <span style={{display:"flex"}}>{renderIcon(selectedBroadcast.icon,16)}</span>
          <span style={{fontSize:12,fontWeight:560,color:selectedBroadcast.color}}>{selectedBroadcast.label}</span>
        </div>
        <p style={{color:T.muted,fontSize:13,lineHeight:1.7,marginBottom:24}}>Your {form.role} shift for {form.date} has been published. Est. cost: <strong>£{singleCost}</strong>.</p>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <Btn onClick={()=>setSubmitted(false)}>Request Another</Btn>
          <Btn variant="secondary" onClick={()=>navigate&&navigate("myshifts")}>View My Shifts</Btn>
        </div>
      </div>
    </Page>
  );

  if(bSubmitted) return (
    <Page title="Bulk Request Submitted" icon="checkCircle">
      <div style={{maxWidth:500,background:T.white,borderRadius:18,border:`1px solid ${T.border}`,padding:40,textAlign:"center"}}>
        <div style={{marginBottom:12,display:"flex",justifyContent:"center",color:T.ghost}}><Icon name="checkCircle" size={46} stroke={1.5}/></div>
        <h2 style={{fontFamily:FONT,fontSize:22,marginBottom:8}}>{validBRows.length} Shifts Published</h2>
        <div style={{background:T.amberBg,borderRadius:10,padding:"14px 20px",marginBottom:20}}>
          {validBRows.map(r=>(
            <div key={r.id} style={{fontSize:12,color:T.amberText,display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span>{bRole}</span><span>{r.date} · {bStart}{"–"}{bEnd}</span>
            </div>
          ))}
          <div style={{borderTop:"1px solid #fcd34d",marginTop:10,paddingTop:10,fontWeight:600,fontSize:14,color:T.amberText}}>Total est. £{bTotalCost.toLocaleString()}</div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <Btn onClick={()=>{setBSubmitted(false);setBRows([{id:1,date:""},{id:2,date:""},{id:3,date:""}]);}}>Add More</Btn>
          <Btn variant="secondary" onClick={()=>navigate&&navigate("myshifts")}>View My Shifts</Btn>
        </div>
      </div>
    </Page>
  );

  return (
    <Page title="Request Shifts" sub="Single or bulk shift requests" icon="plus">

      {/* Pattern editor modal */}
      {showPatternEditor && (
        <Modal title={editPatId?"Edit Shift Pattern":"Add Shift Pattern"} onClose={()=>setShowPatternEditor(false)}>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <Input label="Pattern Name" value={patForm.l} onChange={v=>setPatForm(f=>({...f,l:v}))} placeholder="e.g. Long Day, Twilight…"/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Input label="Start Time" type="time" value={patForm.s} onChange={v=>setPatForm(f=>({...f,s:v}))}/>
              <Input label="End Time"   type="time" value={patForm.e} onChange={v=>setPatForm(f=>({...f,e:v}))}/>
            </div>
            <div style={{padding:"10px 14px",borderRadius:8,background:T.raised,border:`1px solid ${T.border}`,fontSize:12,color:T.muted}}>
              Duration: <strong style={{color:T.text}}>{calcHrs(patForm.s,patForm.e)} hours</strong>
            </div>
            <div style={{display:"flex",gap:8}}>
              <Btn onClick={savePat} disabled={!patForm.l||!patForm.s||!patForm.e}>Save Pattern</Btn>
              <Btn variant="secondary" onClick={()=>setShowPatternEditor(false)}>Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* Mode toggle */}
      <div style={{display:"flex",gap:0,background:T.sunken,borderRadius:10,padding:4,width:"fit-content",marginBottom:20}}>
        {[{k:"single",l:"Single Shift"},{k:"bulk",l:"Bulk Upload"}].map(m=>(
          <button key={m.k} onClick={()=>setMode(m.k)}
            style={{padding:"8px 22px",borderRadius:8,border:"none",fontFamily:FONT,fontWeight:560,fontSize:13,cursor:"pointer",
              background:mode===m.k?T.white:"transparent",color:mode===m.k?T.navy:T.muted,
              boxShadow:mode===m.k?"0 1px 4px rgba(0,0,0,0.1)":"none"}}>
            {m.l}
          </button>
        ))}
      </div>

      {/* ══ SINGLE MODE ══ */}
      {mode==="single" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,maxWidth:860,alignItems:"start"}}>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <Card style={{padding:24}}>
              <h3 style={{fontWeight:560,fontSize:14,marginBottom:18}}>Shift Details</h3>
              <Select label="Role Required" value={form.role} onChange={v=>set("role",v)} options={["RGN","RMN","HCA","Senior Carer","Deputy Manager"]} required/>
              <Input label="Date" type="date" value={form.date} onChange={v=>set("date",v)} required/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <Input label="Start Time" type="time" value={form.timeStart} onChange={v=>set("timeStart",v)}/>
                <Input label="End Time"   type="time" value={form.timeEnd}   onChange={v=>set("timeEnd",v)}/>
              </div>
              <div style={{marginBottom:4}}>
                <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:8}}>Urgency</label>
                <div style={{display:"flex",gap:8}}>
                  {["normal","high","urgent"].map(u=>(
                    <button key={u} onClick={()=>set("urgency",u)} style={{flex:1,padding:"8px",borderRadius:8,border:`1px solid ${form.urgency===u?urgencyColor(u):T.border}`,background:form.urgency===u?"rgba(0,0,0,0.03)":T.white,color:form.urgency===u?urgencyColor(u):T.muted,fontWeight:600,fontSize:12,cursor:"pointer",textTransform:"capitalize",fontFamily:FONT}}>
                      <UrgDot u={u}/>{u}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
            <Card style={{padding:24}}>
              <h3 style={{fontWeight:560,fontSize:14,marginBottom:14}}>Notes</h3>
              <textarea value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Specific requirements, access codes…" style={{width:"100%",padding:"10px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:FONT,minHeight:90,resize:"vertical",color:T.text,boxSizing:"border-box"}}/>
            </Card>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <Card style={{padding:24}}>
              <h3 style={{fontWeight:560,fontSize:14,marginBottom:4}}>Publish To</h3>
              <p style={{fontSize:12,color:T.muted,marginBottom:16,lineHeight:1.5}}>Choose who receives this shift first.</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {BROADCAST_OPTIONS.map(opt=>{
                  const sel=form.broadcastTo===opt.key;
                  return(
                    <button key={opt.key} onClick={()=>set("broadcastTo",opt.key)}
                      style={{display:"flex",gap:14,alignItems:"flex-start",padding:"14px 16px",borderRadius:14,border:`2px solid ${sel?opt.color:T.border}`,background:sel?opt.bg:T.white,cursor:"pointer",textAlign:"left",fontFamily:FONT,width:"100%"}}>
                      <div style={{width:36,height:36,borderRadius:10,background:sel?opt.color:T.sunken,color:sel?"#fff":T.muted,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{renderIcon(opt.icon,18)}</div>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:560,fontSize:13,color:sel?opt.color:T.text,marginBottom:3}}>{opt.label}</div>
                        <div style={{fontSize:11,color:T.muted,lineHeight:1.5}}>{opt.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
            <Card style={{padding:24}}>
              <div style={{background:T.amberBg,borderRadius:8,padding:"14px 16px",marginBottom:16}}>
                <div style={{fontSize:11,fontWeight:560,color:T.amberText,marginBottom:4}}>Estimated Cost</div>
                <div style={{fontSize:26,fontWeight:600,color:T.amberText}}>£{singleCost}</div>
                <div style={{fontSize:11,color:T.amberText,marginTop:4,display:"flex",gap:12}}>
                  <span>{singleRateLabel}: £{singleRate}{"/hr"}</span>
                  <span>·</span>
                  <span>{singleHrs}h shift</span>
                </div>
              </div>
              {form.broadcastTo==="bank_first"&&(
                <div style={{padding:"10px 12px",borderRadius:8,background:T.tealBg,border:`1px solid #5eead4`,marginBottom:14,fontSize:11,color:T.teal,lineHeight:1.5}}>
                  <strong>Bank rate shown.</strong> If unclaimed after 2hrs, agency rate of £{getAgencyRate(form.role)}{"/hr"} applies.
                </div>
              )}
              <Btn full onClick={()=>form.date?setSubmitted(true):alert("Please select a date")}>
                Publish Shift →
              </Btn>
            </Card>
          </div>
        </div>
      )}

      {/* ══ BULK MODE ══ */}
      {mode==="bulk" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:20,maxWidth:1000,alignItems:"start"}}>

          {/* Left — template + rows */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>

            {/* Template */}
            <Card style={{padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <h3 style={{fontWeight:560,fontSize:14,margin:0}}>Shift Template</h3>
                <span style={{fontSize:12,color:T.muted}}>Applies to all shifts below</span>
              </div>

              {/* Role */}
              <div style={{marginBottom:14}}>
                <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:6}}>Role</label>
                <select value={bRole} onChange={e=>setBRole(e.target.value)}
                  style={{width:"100%",padding:"9px 10px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:FONT,outline:"none"}}>
                  {["RGN","RMN","HCA","Senior Carer","Deputy Manager"].map(r=><option key={r}>{r}</option>)}
                </select>
              </div>

              {/* Shift Pattern — with manage link */}
              <div style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <label style={{fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em"}}>Shift Pattern</label>
                  <button onClick={openAddPat}
                    style={{fontSize:11,fontWeight:560,color:T.blue,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:FONT}}>
                    + Add pattern
                  </button>
                </div>

                {/* Pattern pills */}
                <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
                  {patterns.map(p=>{
                    const sel = bPattern===p.id;
                    return (
                      <div key={p.id} style={{display:"flex",alignItems:"center",gap:0,borderRadius:20,border:`1px solid ${sel?T.navy:T.border}`,background:sel?T.navy:T.raised,overflow:"hidden"}}>
                        <button onClick={()=>setBPattern(p.id)}
                          style={{padding:"5px 12px",background:"transparent",border:"none",cursor:"pointer",fontSize:12,fontWeight:560,color:sel?T.white:T.text,fontFamily:FONT}}>
                          {p.l}
                          <span style={{fontSize:10,fontWeight:400,marginLeft:5,color:sel?"rgba(255,255,255,0.7)":T.muted}}>{p.s}{"–"}{p.e}</span>
                        </button>
                        <button onClick={()=>openEditPat(p)}
                          style={{padding:"5px 7px",background:"transparent",border:"none",borderLeft:`1px solid ${sel?"rgba(255,255,255,0.2)":T.border}`,cursor:"pointer",fontSize:11,color:sel?"rgba(255,255,255,0.7)":T.muted,fontFamily:FONT}}>
                          ✎
                        </button>
                        <button onClick={()=>deletePat(p.id)}
                          style={{padding:"5px 7px",background:"transparent",border:"none",borderLeft:`1px solid ${sel?"rgba(255,255,255,0.2)":T.border}`,cursor:"pointer",fontSize:12,color:sel?"rgba(255,255,255,0.7)":T.muted,fontFamily:FONT}}>
                          ×
                        </button>
                      </div>
                    );
                  })}
                  {/* Custom option */}
                  <button onClick={()=>setBPattern("custom")}
                    style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${bPattern==="custom"?T.navy:T.border}`,background:bPattern==="custom"?T.navy:T.raised,cursor:"pointer",fontSize:12,fontWeight:560,color:bPattern==="custom"?T.white:T.muted,fontFamily:FONT}}>
                    Custom ✎
                  </button>
                </div>

                {/* Custom time inputs */}
                {bPattern==="custom" && (
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:10}}>
                    <Input label="Start Time" type="time" value={bCustomS} onChange={setBCustomS}/>
                    <Input label="End Time"   type="time" value={bCustomE} onChange={setBCustomE}/>
                  </div>
                )}

                {/* Duration indicator */}
                <div style={{fontSize:11,color:T.muted,marginTop:6}}>
                  Duration: <strong style={{color:T.text}}>{bHrs} hours</strong> &nbsp;·&nbsp; {bStart} – {bEnd}
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:6}}>Urgency</label>
                <div style={{display:"flex",gap:8}}>
                  {["normal","high","urgent"].map(u=>(
                    <button key={u} onClick={()=>setBUrgency(u)} style={{flex:1,padding:"7px",borderRadius:8,border:`1px solid ${bUrgency===u?urgencyColor(u):T.border}`,background:bUrgency===u?"rgba(0,0,0,0.03)":T.white,color:bUrgency===u?urgencyColor(u):T.muted,fontWeight:600,fontSize:12,cursor:"pointer",textTransform:"capitalize",fontFamily:FONT}}>
                      <UrgDot u={u}/>{u}
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Date rows */}
            <Card>
              <CardHead title="Shift Dates" sub={`${validBRows.length} of ${bRows.length} dates filled`}
                action={<Btn small onClick={addBRow}>+ Add Row</Btn>}/>
              <div style={{padding:"8px 16px 16px"}}>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {bRows.map((row)=>(
                    <div key={row.id} style={{display:"grid",gridTemplateColumns:"1fr 36px",gap:10,alignItems:"center"}}>
                      <div style={{position:"relative"}}>
                        <input type="date" value={row.date} onChange={e=>setBRowDate(row.id,e.target.value)}
                          style={{width:"100%",padding:"9px 12px",border:`1px solid ${row.date?T.green:T.border}`,borderRadius:8,fontSize:13,fontFamily:FONT,outline:"none",boxSizing:"border-box",
                            background:row.date?T.greenBg:T.white,color:T.text}}/>
                        {row.date && <span style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",fontSize:14,color:T.green}}>✓</span>}
                      </div>
                      <button onClick={()=>removeBRow(row.id)} disabled={bRows.length===1}
                        style={{width:34,height:34,borderRadius:8,border:`1px solid ${T.border}`,background:T.raised,cursor:bRows.length===1?"not-allowed":"pointer",fontSize:16,color:T.muted,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
                    </div>
                  ))}
                </div>
                <button onClick={addBRow}
                  style={{marginTop:12,width:"100%",padding:"9px",borderRadius:8,border:`1.5px dashed ${T.border}`,background:"transparent",cursor:"pointer",fontSize:13,color:T.muted,fontFamily:FONT,fontWeight:600}}>
                  + Add another date
                </button>
              </div>
            </Card>

            {/* Notes */}
            <Card style={{padding:20}}>
              <label style={{display:"block",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:8}}>Notes (applies to all)</label>
              <textarea value={bNotes} onChange={e=>setBNotes(e.target.value)} placeholder="Specific requirements, floor, access codes…"
                style={{width:"100%",padding:"10px 12px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:FONT,minHeight:72,resize:"vertical",color:T.text,boxSizing:"border-box"}}/>
            </Card>
          </div>

          {/* Right — summary + broadcast + submit */}
          <div style={{display:"flex",flexDirection:"column",gap:16,position:"sticky",top:16}}>

            {/* Broadcast */}
            <Card style={{padding:20}}>
              <div style={{fontSize:12,fontWeight:560,color:T.muted,marginBottom:12,letterSpacing:"-0.006em"}}>Publish To</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {BROADCAST_OPTIONS.map(opt=>{
                  const sel=bBroadcast===opt.key;
                  return(
                    <button key={opt.key} onClick={()=>setBBroadcast(opt.key)}
                      style={{display:"flex",gap:10,alignItems:"center",padding:"10px 12px",borderRadius:10,border:`2px solid ${sel?opt.color:T.border}`,background:sel?opt.bg:T.white,cursor:"pointer",textAlign:"left",fontFamily:FONT,width:"100%"}}>
                      <span style={{display:"flex"}}>{renderIcon(opt.icon,17)}</span>
                      <div style={{flex:1}}>
                        <div style={{fontWeight:560,fontSize:12,color:sel?opt.color:T.text}}>{opt.label}</div>
                        <div style={{fontSize:10,color:T.muted}}>{opt.tag}</div>
                      </div>
                      <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${sel?opt.color:T.border}`,background:sel?opt.color:"transparent",flexShrink:0}}/>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Live cost summary */}
            <Card style={{padding:20}}>
              <div style={{fontSize:12,fontWeight:560,color:T.muted,marginBottom:12,letterSpacing:"-0.006em"}}>Cost Summary</div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:13}}>
                <span style={{color:T.muted}}>Shifts</span>
                <span style={{fontWeight:560}}>{validBRows.length}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:13}}>
                <span style={{color:T.muted}}>Hours each</span>
                <span style={{fontWeight:560}}>{bHrs}h</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,fontSize:13}}>
                <span style={{color:T.muted}}>{rateLabel}</span>
                <span style={{fontWeight:560}}>£{bRate}{"/hr"}</span>
              </div>
              {bBroadcast==="bank_first" && (
                <div style={{fontSize:11,color:T.teal,background:T.tealBg,padding:"6px 10px",borderRadius:8,marginBottom:6,lineHeight:1.5}}>
                  If escalated to agency: £{getAgencyRate(bRole)}{"/hr"} applies
                </div>
              )}
              <div style={{borderTop:`1px solid ${T.border}`,marginTop:10,paddingTop:12}}>
                <div style={{background:T.amberBg,borderRadius:8,padding:"12px 14px"}}>
                  <div style={{fontSize:11,fontWeight:560,color:T.amberText,marginBottom:4}}>Est. Total</div>
                  <div style={{fontSize:26,fontWeight:600,color:T.amberText}}>£{bTotalCost.toLocaleString()}</div>
                  <div style={{fontSize:10,color:T.amberText,marginTop:3}}>{validBRows.length} &times; {bHrs}h &times; £{bRate}{"/hr"}</div>
                </div>
              </div>
            </Card>

            <Btn full disabled={validBRows.length===0}
              onClick={()=>validBRows.length>0?setBSubmitted(true):null}
              style={{opacity:validBRows.length===0?0.5:1,fontSize:14,padding:"13px"}}>
              Publish {validBRows.length>0?validBRows.length:""} Shift{validBRows.length!==1?"s":""} {"→"}
            </Btn>
            {validBRows.length===0 && <div style={{fontSize:11,color:T.muted,textAlign:"center",marginTop:-8}}>Add at least one date to continue</div>}
          </div>
        </div>
      )}
    </Page>
  );
};
