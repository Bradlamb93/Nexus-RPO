import { useState } from "react";
import { Icon } from "../../components/Icon.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { AGENCIES } from "../../data/agencies.js";
import { blankRate } from "../../data/rates.js";
import { ROLES } from "../../data/shifts.js";
import { RateEditModal } from "./RateEditModal.jsx";
import { tierBg, tierColor } from "../../lib/format.js";
import { FONT, T } from "../../theme/tokens.js";

export const RateCards = ({rateCards, setRateCards}) => {
  const rates    = rateCards;
  const setRates = setRateCards;
  const [tab, setTab]       = useState("agency");       // "agency" | "client"
  const [selAgency,  setSelAgency]  = useState("First Choice Nursing");
  const [selClient,  setSelClient]  = useState("Sunrise Care");
  const [editing,    setEditing]    = useState(null);
  const [isNew,      setIsNew]      = useState(false);

  const agencyNames    = AGENCIES.map(a=>a.name);
  const careHomeNames  = ["Sunrise Care","Meadowbrook Lodge","Oakwood Nursing","Riverside Manor"];

  const saveRate = (r) => {
    if (isNew) setRates(p=>[...p, r]);
    else setRates(p=>p.map(x=>x.id===r.id?r:x));
  };
  const deleteRate = (id) => setRates(p=>p.filter(x=>x.id!==id));

  // ── Agency tab ──────────────────────────────────────────────────────────────
  const agencyRates = rates.filter(r=>r.type==="agency" && r.agency===selAgency);

  // ── Client tab ──────────────────────────────────────────────────────────────
  const clientRates = rates.filter(r=>r.type==="client" && r.careHome===selClient);

  // ── Coverage matrix: which agencies have rates set for selected client ──────
  const coverageMatrix = agencyNames.map(ag => ({
    agency: ag,
    roles: ROLES.map(role => ({
      role,
      agRate: rates.find(r=>r.type==="agency"&&r.agency===ag&&r.role===role),
      clRate: rates.find(r=>r.type==="client"&&r.careHome===selClient&&r.role===role),
    }))
  }));

  const TabBtn = ({id,label}) => (
    <button onClick={()=>setTab(id)} style={{
      padding:"8px 20px",borderRadius:8,border:`1px solid ${tab===id?T.navy:T.border}`,
      background:tab===id?T.navy:"transparent",color:tab===id?T.white:T.muted,
      fontWeight:560,fontSize:12,cursor:"pointer",fontFamily:FONT,transition:"all 0.15s"
    }}>{label}</button>
  );

  const RateRow = ({r}) => (
    <tr style={{borderBottom:`1px solid ${T.border}`,background:r.notes?T.amberBg:"transparent"}}>
      <Td><Badge label={r.role} color={T.purple} bg={T.purpleBg}/></Td>
      <Td><span style={{fontSize:11,color:T.muted}}>{r.band}</span></Td>
      <Td bold>£{r.weekday}</Td>
      <Td>£{r.saturday}</Td>
      <Td>£{r.sunday}</Td>
      <Td>£{r.bankHoliday}</Td>
      <Td><span style={{fontSize:12,color:T.muted}}>×{r.nightMod}</span></Td>
      <Td>
        {r.notes
          ? <span title={r.notes} style={{fontSize:11,color:T.yellow,cursor:"help"}}>Note</span>
          : <span style={{fontSize:11,color:T.muted}}>—</span>}
      </Td>
      <Td>
        <Btn small variant="secondary" onClick={()=>{setEditing({...r});setIsNew(false);}}>Edit</Btn>
      </Td>
    </tr>
  );

  const tableHeaders = ["Role","Band","Weekday","Saturday","Sunday","Bank Hol","Night ×","Notes",""];

  return (
    <Page title="Rate Cards" sub="Set pay rates per agency and charge rates per client" icon="pound">

      {editing && (
        <RateEditModal rate={editing} isNew={isNew} onSave={saveRate} onDelete={deleteRate} onClose={()=>setEditing(null)}/>
      )}

      {/* Summary stats */}
      <Grid cols={4}>
        <Stat label="Agency Rate Cards" value={rates.filter(r=>r.type==="agency").length} sub={`Across ${agencyNames.length} agencies`} accent/>
        <Stat label="Client Rate Cards" value={rates.filter(r=>r.type==="client").length} sub={`Across ${careHomeNames.length} care homes`}/>
        <Stat label="Agencies Configured" value={agencyNames.filter(ag=>rates.some(r=>r.type==="agency"&&r.agency===ag)).length} sub={`of ${agencyNames.length} agencies`}/>
        <Stat label="Clients Configured" value={careHomeNames.filter(ch=>rates.some(r=>r.type==="client"&&r.careHome===ch)).length} sub={`of ${careHomeNames.length} clients`}/>
      </Grid>

      <Alert type="info">Rate changes apply to all new shifts. Existing confirmed shifts are unaffected. Agency rates = what Nexus RPO pays. Client rates = what care homes are billed. The difference forms Nexus RPO's margin.</Alert>

      {/* Tab switcher */}
      <div style={{display:"flex",gap:8,marginBottom:18}}>
        <TabBtn id="agency" label="Agency Rates"/>
        <TabBtn id="client" label="Client Rates"/>
        <TabBtn id="matrix" label="Coverage Matrix"/>
      </div>

      {/* ── AGENCY RATES TAB ─────────────────────────────────────────────────── */}
      {tab==="agency" && (
        <>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:6}}>
              {agencyNames.map(ag=>(
                <button key={ag} onClick={()=>setSelAgency(ag)} style={{
                  padding:"6px 14px",borderRadius:20,border:`1px solid ${selAgency===ag?T.navy:T.border}`,
                  background:selAgency===ag?T.navy:"transparent",color:selAgency===ag?T.white:T.muted,
                  fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:FONT,transition:"all 0.15s",whiteSpace:"nowrap"
                }}>{ag}</button>
              ))}
            </div>
            <div style={{marginLeft:"auto"}}>
              <Btn small onClick={()=>{setEditing(blankRate("agency",{agency:selAgency}));setIsNew(true);}}>+ Add Rate</Btn>
            </div>
          </div>

          {agencyRates.length === 0
            ? <Card style={{padding:32,textAlign:"center"}}>
                <div style={{marginBottom:8,display:"flex",justifyContent:"center",color:T.ghost}}><Icon name="clipboard" size={30} stroke={1.5}/></div>
                <div style={{fontWeight:560,marginBottom:6}}>No rates set for {selAgency}</div>
                <div style={{color:T.muted,fontSize:13,marginBottom:16}}>Add rate cards to define what Nexus RPO pays this agency per role.</div>
                <Btn onClick={()=>{setEditing(blankRate("agency",{agency:selAgency}));setIsNew(true);}}>+ Add First Rate Card</Btn>
              </Card>
            : <Card>
                <div style={{padding:"12px 18px",background:T.greenBg,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:12,fontWeight:560,color:T.green}}>Pay rates for {selAgency}</span>
                  <span style={{fontSize:11,color:T.muted}}>— what Nexus RPO pays this agency per hour billed</span>
                </div>
                <Table headers={tableHeaders} rows={agencyRates.map(r=><RateRow key={r.id} r={r}/>)}/>
              </Card>
          }

          {/* Tier / notes summary */}
          {agencyRates.length > 0 && (
            <Card style={{marginTop:14,padding:18}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <h3 style={{fontWeight:560,fontSize:13}}>12-Hour Shift Cost Estimate ({selAgency})</h3>
                <Badge label={AGENCIES.find(a=>a.name===selAgency)?.tier||"Tier 2"} color={tierColor(AGENCIES.find(a=>a.name===selAgency)?.tier||"Tier 2")} bg={tierBg(AGENCIES.find(a=>a.name===selAgency)?.tier||"Tier 2")}/>
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {agencyRates.map(r=>(
                  <div key={r.id} style={{background:T.raised,borderRadius:8,padding:"10px 14px",minWidth:120}}>
                    <div style={{fontSize:11,color:T.muted,marginBottom:2}}>{r.role} · 12hr weekday</div>
                    <div style={{fontSize:20,fontWeight:600,color:T.navy}}>£{r.weekday*12}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* ── CLIENT RATES TAB ─────────────────────────────────────────────────── */}
      {tab==="client" && (
        <>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14,flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {careHomeNames.map(ch=>(
                <button key={ch} onClick={()=>setSelClient(ch)} style={{
                  padding:"6px 14px",borderRadius:20,border:`1px solid ${selClient===ch?T.navy:T.border}`,
                  background:selClient===ch?T.navy:"transparent",color:selClient===ch?T.white:T.muted,
                  fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:FONT,transition:"all 0.15s",whiteSpace:"nowrap"
                }}>{ch}</button>
              ))}
            </div>
            <div style={{marginLeft:"auto"}}>
              <Btn small onClick={()=>{setEditing(blankRate("client",{careHome:selClient}));setIsNew(true);}}>+ Add Rate</Btn>
            </div>
          </div>

          {clientRates.length === 0
            ? <Card style={{padding:32,textAlign:"center"}}>
                <div style={{marginBottom:8,display:"flex",justifyContent:"center",color:T.ghost}}><Icon name="hospital" size={30} stroke={1.5}/></div>
                <div style={{fontWeight:560,marginBottom:6}}>No rates set for {selClient}</div>
                <div style={{color:T.muted,fontSize:13,marginBottom:16}}>Add rate cards to define what this care home is billed per role.</div>
                <Btn onClick={()=>{setEditing(blankRate("client",{careHome:selClient}));setIsNew(true);}}>+ Add First Rate Card</Btn>
              </Card>
            : <Card>
                <div style={{padding:"12px 18px",background:T.accentBg,borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:12,fontWeight:560,color:T.blue}}>Charge rates for {selClient}</span>
                  <span style={{fontSize:11,color:T.muted}}>— what Nexus RPO bills this care home per hour</span>
                </div>
                <Table headers={tableHeaders} rows={clientRates.map(r=><RateRow key={r.id} r={r}/>)}/>
              </Card>
          }

          {clientRates.length > 0 && (
            <Card style={{marginTop:14,padding:18}}>
              <h3 style={{fontWeight:560,fontSize:13,marginBottom:12}}>12-Hour Shift Revenue Estimate ({selClient})</h3>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {clientRates.map(r=>(
                  <div key={r.id} style={{background:T.raised,borderRadius:8,padding:"10px 14px",minWidth:120}}>
                    <div style={{fontSize:11,color:T.muted,marginBottom:2}}>{r.role} · 12hr weekday</div>
                    <div style={{fontSize:20,fontWeight:600,color:T.blue}}>£{r.weekday*12}</div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </>
      )}

      {/* ── COVERAGE MATRIX TAB ──────────────────────────────────────────────── */}
      {tab==="matrix" && (
        <>
          <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:14,flexWrap:"wrap"}}>
            <span style={{fontSize:12,color:T.muted,fontWeight:600}}>Client:</span>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {careHomeNames.map(ch=>(
                <button key={ch} onClick={()=>setSelClient(ch)} style={{
                  padding:"6px 14px",borderRadius:20,border:`1px solid ${selClient===ch?T.navy:T.border}`,
                  background:selClient===ch?T.navy:"transparent",color:selClient===ch?T.white:T.muted,
                  fontWeight:600,fontSize:11,cursor:"pointer",fontFamily:FONT,transition:"all 0.15s",whiteSpace:"nowrap"
                }}>{ch}</button>
              ))}
            </div>
          </div>

          <Card>
            <div style={{padding:"12px 18px",background:T.raised,borderBottom:`1px solid ${T.border}`}}>
              <span style={{fontWeight:560,fontSize:12}}>Rate Coverage — {selClient}</span>
              <span style={{fontSize:11,color:T.muted,marginLeft:8}}>Green = agency rate set · Blue = client rate set · Red = gap</span>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
                <thead>
                  <tr style={{background:T.raised}}>
                    <th style={{padding:"9px 14px",fontSize:11,fontWeight:560,color:T.muted,textAlign:"left",borderBottom:`1px solid ${T.border}`,letterSpacing:"-0.006em"}}>Agency</th>
                    {ROLES.slice(0,4).map(role=>(
                      <th key={role} style={{padding:"9px 12px",fontSize:11,fontWeight:560,color:T.muted,textAlign:"center",borderBottom:`1px solid ${T.border}`,letterSpacing:"-0.006em"}}>{role}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {agencyNames.map(ag=>{
                    return (
                      <tr key={ag} style={{borderBottom:`1px solid ${T.border}`}}>
                        <td style={{padding:"11px 14px",fontWeight:600,fontSize:13}}>{ag}</td>
                        {ROLES.slice(0,4).map(role=>{
                          const agRate = rates.find(r=>r.type==="agency"&&r.agency===ag&&r.role===role);
                          const clRate = rates.find(r=>r.type==="client"&&r.careHome===selClient&&r.role===role);
                          const bothSet = agRate && clRate;
                          const noneSet = !agRate && !clRate;
                          const margin  = bothSet ? clRate.weekday - agRate.weekday : null;
                          return (
                            <td key={role} style={{padding:"11px 12px",textAlign:"center"}}>
                              {noneSet
                                ? <span style={{fontSize:11,color:T.red,fontWeight:560,background:T.redBg,padding:"3px 8px",borderRadius:8}}>No rates</span>
                                : <div style={{display:"flex",flexDirection:"column",gap:3,alignItems:"center"}}>
                                    {agRate && <span style={{fontSize:11,color:T.green,fontWeight:560,background:T.greenBg,padding:"2px 7px",borderRadius:5}}>£{agRate.weekday} pay</span>}
                                    {clRate && <span style={{fontSize:11,color:T.blue, fontWeight:560,background:T.accentBg,padding:"2px 7px",borderRadius:5}}>£{clRate.weekday} bill</span>}
                                    {bothSet && <span style={{fontSize:10,color:margin>=0?T.green:T.red,fontWeight:600}}>
                                      {margin>=0?`+£${margin} margin`:`-£${Math.abs(margin)} loss`}
                                    </span>}
                                    {!agRate && <span style={{fontSize:10,color:T.yellow,fontWeight:560}}>no pay rate</span>}
                                    {!clRate && <span style={{fontSize:10,color:T.yellow,fontWeight:560}}>no charge rate</span>}
                                  </div>
                              }
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </Page>
  );
};
