import { useState } from "react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead } from "../../components/ui/Card.jsx";
import { Alert } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { INIT_BANK_RATES } from "../../data/rates.js";
import { ROLES, SHIFT_DAYS } from "../../data/shifts.js";
import { CA_PURPLE, FONT, T } from "../../theme/tokens.js";

export const BankRateCards = ({user, bankRates, setBankRates}) => {
  const isClientAdmin = user?.role === "clientadmin";
  const rates  = bankRates || INIT_BANK_RATES;
  const [tab,   setTab]   = useState("global");        // "global" | site name
  const [editRow, setEditRow] = useState(null);        // row being edited
  const [editForm, setEditForm] = useState({});
  const [newForm, setNewForm] = useState({role:"RGN", weekday:"", saturday:"", sunday:"", bankHoliday:"", nightMod:"1.20", notes:""});
  const [showAdd, setShowAdd] = useState(false);

  const sites = Object.keys(rates.sites||{});
  const isGlobal = tab === "global";
  const currentRows = isGlobal ? (rates.global||[]) : (rates.sites?.[tab]||[]);
  const globalRow   = role => (rates.global||[]).find(r=>r.role===role);

  const save = (updated) => {
    if(setBankRates) setBankRates(updated);
  };

  const openEdit = (row) => { setEditRow(row.id); setEditForm({...row}); };

  const saveEdit = () => {
    const updated = {...rates};
    if(isGlobal){
      updated.global = rates.global.map(r=>r.id===editRow?{...editForm,weekday:+editForm.weekday,saturday:+editForm.saturday,sunday:+editForm.sunday,bankHoliday:+editForm.bankHoliday,nightMod:+editForm.nightMod}:r);
    } else {
      updated.sites = {...rates.sites, [tab]: (rates.sites[tab]||[]).map(r=>r.id===editRow?{...editForm,weekday:+editForm.weekday,saturday:+editForm.saturday,sunday:+editForm.sunday,bankHoliday:+editForm.bankHoliday,nightMod:+editForm.nightMod}:r)};
    }
    save(updated); setEditRow(null);
  };

  const addRow = () => {
    const id = `br${Date.now()}`;
    const row = {...newForm, id, weekday:+newForm.weekday, saturday:+newForm.saturday, sunday:+newForm.sunday, bankHoliday:+newForm.bankHoliday, nightMod:+newForm.nightMod};
    const updated = {...rates};
    if(isGlobal){
      updated.global = [...(rates.global||[]), row];
    } else {
      updated.sites = {...rates.sites, [tab]: [...(rates.sites[tab]||[]), row]};
    }
    save(updated);
    setNewForm({role:"RGN", weekday:"", saturday:"", sunday:"", bankHoliday:"", nightMod:"1.20", notes:""});
    setShowAdd(false);
  };

  const deleteRow = (id) => {
    const updated = {...rates};
    if(isGlobal){
      updated.global = rates.global.filter(r=>r.id!==id);
    } else {
      updated.sites = {...rates.sites, [tab]: (rates.sites[tab]||[]).filter(r=>r.id!==id)};
    }
    save(updated);
  };

  const accent = isClientAdmin ? CA_PURPLE : T.teal;

  const RateInput = ({label, field}) => (
    <div>
      <label style={{display:"block",fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:4}}>{label}</label>
      <div style={{position:"relative"}}>
        <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",fontSize:12,color:T.muted,fontWeight:560}}>£</span>
        <input type="number" value={editForm[field]||""} onChange={e=>setEditForm(f=>({...f,[field]:e.target.value}))}
          style={{width:"100%",padding:"8px 8px 8px 22px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:FONT,outline:"none",boxSizing:"border-box"}}/>
      </div>
    </div>
  );
  const NewRateInput = ({label, field}) => (
    <div>
      <label style={{display:"block",fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:4}}>{label}</label>
      <div style={{position:"relative"}}>
        <span style={{position:"absolute",left:9,top:"50%",transform:"translateY(-50%)",fontSize:12,color:T.muted,fontWeight:560}}>£</span>
        <input type="number" value={newForm[field]||""} onChange={e=>setNewForm(f=>({...f,[field]:e.target.value}))}
          style={{width:"100%",padding:"8px 8px 8px 22px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:FONT,outline:"none",boxSizing:"border-box"}}/>
      </div>
    </div>
  );

  return (
    <Page title="Bank Staff Rates" sub="Set pay rates for internal bank staff by role and shift type" icon="bank">

      {/* Tabs — Global + per site */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:4}}>
        {["global",...sites].map(t=>{
          const isActive = tab===t;
          return (
            <button key={t} onClick={()=>{setTab(t);setShowAdd(false);setEditRow(null);}}
              style={{padding:"7px 16px",borderRadius:20,border:`1px solid ${isActive?accent:T.border}`,
                background:isActive?`${accent}18`:T.white,fontWeight:560,fontSize:12,cursor:"pointer",
                color:isActive?accent:T.muted,fontFamily:FONT}}>
              {t==="global" ? "Platform Default" : `${t}`}
            </button>
          );
        })}
      </div>

      {/* Context banner */}
      <Alert type={isGlobal?"info":"warning"}>
        {isGlobal
          ? "These are the default bank rates applied across all sites. Individual sites can have their own override rates below."
          : `These rates override the platform defaults for ${tab} only. Any role not listed here falls back to the platform default rate.`}
      </Alert>

      {/* Rate table */}
      <Card>
        <CardHead
          title={isGlobal ? "Platform Default Bank Rates" : `${tab} — Override Rates`}
          sub="All rates are pay rates (£/hr) — what bank staff are paid"
          action={<Btn small onClick={()=>setShowAdd(s=>!s)}>{showAdd?"Cancel":"+ Add Rate"}</Btn>}
        />

        {/* Add new row form */}
        {showAdd && (
          <div style={{padding:"16px 20px",background:T.raised,borderBottom:`1px solid ${T.border}`}}>
            <div style={{fontSize:12,fontWeight:560,color:T.text,marginBottom:12}}>New rate row</div>
            <div style={{display:"grid",gridTemplateColumns:"140px 1fr 1fr 1fr 1fr 100px 1fr",gap:10,alignItems:"end"}}>
              <div>
                <label style={{display:"block",fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:4}}>Role</label>
                <select value={newForm.role} onChange={e=>setNewForm(f=>({...f,role:e.target.value}))}
                  style={{width:"100%",padding:"8px 10px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:FONT,outline:"none"}}>
                  {ROLES.map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              {SHIFT_DAYS.map(d=><NewRateInput key={d.k} label={d.l} field={d.k}/>)}
              <div>
                <label style={{display:"block",fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:4}}>Night Mod</label>
                <input type="number" step="0.01" value={newForm.nightMod} onChange={e=>setNewForm(f=>({...f,nightMod:e.target.value}))}
                  style={{width:"100%",padding:"8px 10px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:FONT,outline:"none",boxSizing:"border-box"}}/>
              </div>
              <div>
                <label style={{display:"block",fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:4}}>Notes</label>
                <input type="text" value={newForm.notes} onChange={e=>setNewForm(f=>({...f,notes:e.target.value}))} placeholder="Optional"
                  style={{width:"100%",padding:"8px 10px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:13,fontFamily:FONT,outline:"none",boxSizing:"border-box"}}/>
              </div>
            </div>
            <div style={{marginTop:12,display:"flex",gap:8}}>
              <Btn onClick={addRow} disabled={!newForm.weekday||!newForm.saturday||!newForm.sunday||!newForm.bankHoliday}
                style={{background:accent}}>Save Rate</Btn>
              <Btn variant="secondary" onClick={()=>setShowAdd(false)}>Cancel</Btn>
            </div>
          </div>
        )}

        {/* Non-global: show which global rates are inherited */}
        {!isGlobal && (
          <div style={{padding:"10px 20px",background:T.greenBg,borderBottom:`1px solid ${T.border}`}}>
            <div style={{fontSize:11,fontWeight:560,color:T.green,marginBottom:6}}>✓ Inheriting from platform defaults</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {ROLES.map(role=>{
                const overridden = currentRows.some(r=>r.role===role);
                const gr = globalRow(role);
                return (
                  <span key={role} style={{fontSize:11,padding:"3px 10px",borderRadius:20,
                    background:overridden?T.amberBg:"#dcfce7",
                    color:overridden?T.amberText:T.green,fontWeight:560}}>
                    {role}: {overridden?"overridden":`£${gr?.weekday||"—"}{"/hr"}`}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <Table
          headers={["Role","Weekday (£/hr)","Saturday (£/hr)","Sunday (£/hr)","Bank Hol (£/hr)","Night Mod","Notes","Actions"]}
          rows={currentRows.length===0
            ? [<tr key="empty"><td colSpan={8} style={{padding:"28px",textAlign:"center",color:T.muted,fontSize:13}}>
                {isGlobal ? "No rates set yet. Use + Add Rate to get started." : `No overrides for ${tab}. All roles use platform default rates.`}
              </td></tr>]
            : currentRows.map(r=>(
              <tr key={r.id} style={{borderBottom:`1px solid ${T.border}`}}>
                {editRow===r.id ? (
                  <>
                    <Td><Badge label={r.role} color={accent} bg={`${accent}18`}/></Td>
                    <Td><RateInput label="" field="weekday"/></Td>
                    <Td><RateInput label="" field="saturday"/></Td>
                    <Td><RateInput label="" field="sunday"/></Td>
                    <Td><RateInput label="" field="bankHoliday"/></Td>
                    <Td>
                      <input type="number" step="0.01" value={editForm.nightMod||""} onChange={e=>setEditForm(f=>({...f,nightMod:e.target.value}))}
                        style={{width:70,padding:"6px 8px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:12,fontFamily:FONT,outline:"none"}}/>
                    </Td>
                    <Td>
                      <input type="text" value={editForm.notes||""} onChange={e=>setEditForm(f=>({...f,notes:e.target.value}))}
                        style={{width:"100%",padding:"6px 8px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:12,fontFamily:FONT,outline:"none"}}/>
                    </Td>
                    <Td>
                      <div style={{display:"flex",gap:5}}>
                        <Btn small onClick={saveEdit} style={{background:accent}}>Save</Btn>
                        <Btn small variant="secondary" onClick={()=>setEditRow(null)}>Cancel</Btn>
                      </div>
                    </Td>
                  </>
                ) : (
                  <>
                    <Td><Badge label={r.role} color={accent} bg={`${accent}18`}/></Td>
                    <Td bold>£{r.weekday}</Td>
                    <Td>£{r.saturday}</Td>
                    <Td>£{r.sunday}</Td>
                    <Td>£{r.bankHoliday}</Td>
                    <Td>
                      <span style={{fontSize:12,fontWeight:560,color:T.muted}}>×{r.nightMod}</span>
                      <div style={{fontSize:10,color:T.muted}}>Night: £{Math.round(r.weekday*r.nightMod)}{"/hr"}</div>
                    </Td>
                    <Td style={{fontSize:12,color:T.muted}}>{r.notes||"—"}</Td>
                    <Td>
                      <div style={{display:"flex",gap:5}}>
                        <Btn small variant="secondary" onClick={()=>openEdit(r)}>Edit</Btn>
                        <Btn small variant="danger" onClick={()=>deleteRow(r.id)}>×</Btn>
                      </div>
                    </Td>
                  </>
                )}
              </tr>
            ))
          }
        />
      </Card>

      {/* Summary comparison card */}
      {isGlobal && currentRows.length > 0 && (
        <Card>
          <CardHead title="Rate Summary — All Roles" sub="Weekday day shift vs night shift comparison"/>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14,padding:"4px 4px 8px"}}>
            {currentRows.map(r=>(
              <div key={r.id} style={{padding:"14px 16px",borderRadius:10,border:`1px solid ${T.border}`,background:T.raised}}>
                <div style={{fontWeight:600,fontSize:14,color:T.text,marginBottom:10}}>{r.role}</div>
                {SHIFT_DAYS.map(d=>(
                  <div key={d.k} style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:5}}>
                    <span style={{color:T.muted}}>{d.l}</span>
                    <span style={{fontWeight:560,color:T.text}}>£{r[d.k]}{"/hr"}</span>
                  </div>
                ))}
                <div style={{borderTop:`1px solid ${T.border}`,marginTop:8,paddingTop:8,display:"flex",justifyContent:"space-between",fontSize:12}}>
                  <span style={{color:T.muted}}>Night (wkday)</span>
                  <span style={{fontWeight:560,color:accent}}>£{Math.round(r.weekday*r.nightMod)}{"/hr"}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </Page>
  );
};
