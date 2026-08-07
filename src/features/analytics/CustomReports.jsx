import { useState } from "react";
import { ExportMenu } from "../../components/ExportMenu.jsx";
import { renderIcon } from "../../components/Icon.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead } from "../../components/ui/Card.jsx";
import { Input } from "../../components/ui/Form.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { AGENCIES } from "../../data/agencies.js";
import { RTW_LABEL, RTW_TYPES } from "../../data/compliance.js";
import { SHIFTS } from "../../data/shifts.js";
import { REPORT_SOURCES, SAVED_REPORT_TEMPLATES } from "./reportSources.js";
import { buildTable, exportCSV, exportHTML } from "../../lib/export.js";
import { FONT, T } from "../../theme/tokens.js";

export const CustomReports = ({user, timesheets: tsProp, complianceReqs, budgets}) => {
  const isClientAdmin = user?.role==="clientadmin";
  const [view,        setView]        = useState("home");       // home | builder | preview | saved
  const [source,      setSource]      = useState("shifts");
  const [selFields,   setSelFields]   = useState([]);
  const [filters,     setFilters]     = useState({});
  const [reportName,  setReportName]  = useState("");
  const [saved,       setSaved]       = useState(SAVED_REPORT_TEMPLATES);
  const [activeReport,setActiveReport]= useState(null);
  const [justSaved,   setJustSaved]   = useState(false);

  const src = REPORT_SOURCES[source];

  // ── Filter options ────────────────────────────────────────────────────────
  const filterOpts = {
    status:            ["","open","pending","filled","approved","disputed","paid","overdue","draft"],
    agency:            ["",...[...new Set(AGENCIES.map(a=>a.name))]],
    carehome:          ["",...[...new Set(SHIFTS.map(s=>s.carehome))]],
    role:              ["",...["RGN","RMN","HCA","Senior Carer","Deputy Manager"]],
    tier:              ["",...["Tier 1","Tier 2","Tier 3"]],
    dbs:               ["",...["valid","expiring","expired"]],
    rtwType:           ["",...RTW_TYPES.map(t=>t.value)],
    dateFrom:          null,
    dateTo:            null,
    // Compliance-specific
    compScope:         ["","global","site"],
    compType:          ["","document","training","registration"],
    compCategory:      ["","safeguarding","training","registration","health","legal","specialist","safety"],
    compMandatory:     ["","Yes","No"],
    compActive:        ["","Active","Inactive"],
    compOverallStatus: ["","Pass","Warning","Fail"],
  };

  // ── Apply filters to data ─────────────────────────────────────────────────
  const getRows = (overrideSrc, overrideFields, overrideFilters) => {
    const s   = overrideSrc     || source;
    const fds = overrideFields  || selFields;
    const flt = overrideFilters || filters;
    const rawData = REPORT_SOURCES[s].getData(tsProp, complianceReqs, budgets);
    const filtered = rawData.filter(row => {
      if(flt.status            && row.status            && row.status            !== flt.status)            return false;
      if(flt.agency            && row.agency            && row.agency            !== flt.agency)            return false;
      if(flt.carehome          && row.carehome          && row.carehome          !== flt.carehome)          return false;
      if(flt.role              && row.role              && row.role              !== flt.role)              return false;
      if(flt.tier              && row.tier              && row.tier              !== flt.tier)              return false;
      if(flt.dbs               && row.dbs               && row.dbs               !== flt.dbs)               return false;
      if(flt.rtwType           && row.rtwType           && row.rtwType           !== flt.rtwType)           return false;
      if(flt.dateFrom          && row.date              && row.date < flt.dateFrom)                         return false;
      if(flt.dateTo            && row.date              && row.date > flt.dateTo)                           return false;
      // Compliance-specific filters
      if(flt.compScope         && row.scope             && row.scope             !== flt.compScope)         return false;
      if(flt.compType          && row.type              && row.type              !== flt.compType)          return false;
      if(flt.compCategory      && row.category          && row.category          !== flt.compCategory)      return false;
      if(flt.compMandatory     && row.mandatory         && row.mandatory         !== flt.compMandatory)     return false;
      if(flt.compActive        && row.active            && row.active            !== flt.compActive)        return false;
      if(flt.compOverallStatus && row.overallStatus     && row.overallStatus     !== flt.compOverallStatus) return false;
      return true;
    });
    return { headers: fds.map(k=>REPORT_SOURCES[s].fields.find(f=>f.k===k)?.l||k), rows: filtered.map(row=>fds.map(k=>{ const v=row[k]; if(v===true) return "Yes"; if(v===false) return "No"; if(v===null||v===undefined) return "—"; return String(v); })) };
  };

  const toggleField = k => setSelFields(p => p.includes(k) ? p.filter(x=>x!==k) : [...p,k]);
  const selectAll   = () => setSelFields(src.fields.map(f=>f.k));
  const clearAll    = () => setSelFields([]);

  const loadTemplate = (tpl) => {
    setSource(tpl.source);
    setSelFields(tpl.fields);
    setFilters(tpl.filters||{});
    setReportName(tpl.name);
    setActiveReport(tpl);
    setView("preview");
  };

  const saveReport = () => {
    if(!reportName.trim()) return;
    const newR = {id:`r${Date.now()}`,name:reportName,source,fields:selFields,filters,created:new Date().toISOString().split("T")[0],createdBy:user?.name||"You"};
    setSaved(p=>[newR,...p]);
    setJustSaved(true);
    setTimeout(()=>setJustSaved(false),2500);
  };

  const deleteReport = id => setSaved(p=>p.filter(r=>r.id!==id));

  // ── SOURCE ICONS / colours ─────────────────────────────────────────────────
  const srcColor = {shifts:T.blue,workers:T.purple,invoices:T.green,agencies:T.amber,timesheets:T.teal,compliance_reqs:"#0f766e",worker_compliance:T.green,budgets:T.amber};

  // ── RENDER ─────────────────────────────────────────────────────────────────
  return (
    <Page title="Custom Reports" sub="Build, save and export tailored data reports" icon="archive"
      action={
        <div style={{display:"flex",gap:8}}>
          {view!=="home"&&<Btn variant="secondary" onClick={()=>setView("home")}>← Back</Btn>}
          <Btn onClick={()=>{setSource("shifts");setSelFields([]);setFilters({});setReportName("");setActiveReport(null);setView("builder");}}>+ New Report</Btn>
        </div>
      }>

      {/* ── HOME: saved reports + quick-start ──────────────────────────────── */}
      {view==="home"&&(
        <>
          {/* Quick start tiles */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12,marginBottom:4}}>
            {Object.entries(REPORT_SOURCES).map(([k,s])=>(
              <button key={k} onClick={()=>{setSource(k);setSelFields(s.fields.map(f=>f.k));setFilters({});setReportName(s.label+" Report");setView("builder");}}
                style={{display:"flex",flexDirection:"column",alignItems:"flex-start",padding:"16px 18px",background:T.white,border:`1px solid ${T.border}`,borderTop:`3px solid ${srcColor[k]}`,borderRadius:10,cursor:"pointer",textAlign:"left",fontFamily:FONT,transition:"box-shadow 0.15s"}}>
                <span style={{marginBottom:8,display:"flex",color:T.faint}}>{renderIcon(s.icon,22)}</span>
                <span style={{fontWeight:600,fontSize:13,color:T.text}}>{s.label}</span>
                <span style={{fontSize:11,color:T.muted,marginTop:3}}>{s.fields.length} fields available</span>
              </button>
            ))}
          </div>

          {/* Saved reports */}
          <Card>
            <CardHead title="Saved Reports" sub={`${saved.length} report${saved.length!==1?"s":""} saved`}/>
            {saved.length===0&&(
              <div style={{padding:"32px",textAlign:"center",color:T.muted,fontSize:13}}>No saved reports yet. Build one with + New Report.</div>
            )}
            <Table headers={["Report Name","Data Source","Fields","Filters","Created","By","Actions"]}
              rows={saved.map(r=>{
                const s=REPORT_SOURCES[r.source];
                const activeFilters=Object.entries(r.filters||{}).filter(([,v])=>v).length;
                return(
                  <tr key={r.id} style={{borderBottom:`1px solid ${T.border}`}}>
                    <Td><div style={{fontWeight:560,fontSize:13}}>{r.name}</div></Td>
                    <Td><span style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:12,fontWeight:600,color:srcColor[r.source]}}><span style={{display:"flex"}}>{renderIcon(s?.icon,14)}</span>{s?.label}</span></Td>
                    <Td><span style={{fontSize:12,color:T.muted}}>{r.fields.length} columns</span></Td>
                    <Td><span style={{fontSize:12,color:activeFilters?T.amber:T.muted}}>{activeFilters?`${activeFilters} active`:"None"}</span></Td>
                    <Td style={{fontSize:12,color:T.muted}}>{r.created}</Td>
                    <Td style={{fontSize:12}}>{r.createdBy}</Td>
                    <Td>
                      <div style={{display:"flex",gap:5}}>
                        <Btn small onClick={()=>loadTemplate(r)}>Run</Btn>
                        <Btn small variant="secondary" onClick={()=>{setSource(r.source);setSelFields(r.fields);setFilters(r.filters||{});setReportName(r.name);setActiveReport(r);setView("builder");}}>Edit</Btn>
                        <Btn small variant="secondary" onClick={()=>deleteReport(r.id)}></Btn>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            />
          </Card>
        </>
      )}

      {/* ── BUILDER ────────────────────────────────────────────────────────── */}
      {view==="builder"&&(
        <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:18,alignItems:"start"}}>

          {/* Left panel */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>

            {/* Report name */}
            <Card style={{padding:"16px 18px"}}>
              <Input label="Report Name" value={reportName} onChange={v=>setReportName(v)} placeholder="e.g. Weekly Agency Spend"/>
            </Card>

            {/* Data source */}
            <Card style={{padding:"16px 18px"}}>
              <div style={{fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:10}}>Data Source</div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {Object.entries(REPORT_SOURCES).map(([k,s])=>(
                  <button key={k} onClick={()=>{setSource(k);setSelFields(s.fields.map(f=>f.k));setFilters({});}}
                    style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",borderRadius:8,border:`1px solid ${source===k?srcColor[k]:T.border}`,background:source===k?`${srcColor[k]}12`:T.white,cursor:"pointer",fontFamily:FONT,textAlign:"left"}}>
                    <span style={{display:"flex"}}>{renderIcon(s.icon,16)}</span>
                    <span style={{fontWeight:560,fontSize:12,color:source===k?srcColor[k]:T.text}}>{s.label}</span>
                    {source===k&&<span style={{marginLeft:"auto",fontSize:10,color:srcColor[k],fontWeight:560}}>✓</span>}
                  </button>
                ))}
              </div>
            </Card>

            {/* Field selector */}
            <Card style={{padding:"16px 18px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em"}}>Columns ({selFields.length}/{src.fields.length})</span>
                <div style={{display:"flex",gap:6}}>
                  <button onClick={selectAll}  style={{fontSize:10,fontWeight:560,color:T.amber,background:"none",border:"none",cursor:"pointer",padding:"2px 4px"}}>All</button>
                  <button onClick={clearAll}   style={{fontSize:10,fontWeight:560,color:T.muted,background:"none",border:"none",cursor:"pointer",padding:"2px 4px"}}>None</button>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {src.fields.map(f=>(
                  <label key={f.k} onClick={()=>toggleField(f.k)}
                    style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:8,background:selFields.includes(f.k)?`${srcColor[source]}10`:"transparent",cursor:"pointer",border:`1px solid ${selFields.includes(f.k)?srcColor[source]:T.border}`}}>
                    <div style={{width:14,height:14,borderRadius:3,border:`2px solid ${selFields.includes(f.k)?srcColor[source]:T.border}`,background:selFields.includes(f.k)?srcColor[source]:"transparent",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                      {selFields.includes(f.k)&&<span style={{color:"white",fontSize:9,lineHeight:1}}>✓</span>}
                    </div>
                    <span style={{fontSize:12,color:selFields.includes(f.k)?srcColor[source]:T.text}}>{f.l}</span>
                  </label>
                ))}
              </div>
            </Card>

            {/* Filters */}
            <Card style={{padding:"16px 18px"}}>
              <div style={{fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",marginBottom:10}}>Filters</div>
              {src.filters.map(fk=>(
                <div key={fk} style={{marginBottom:10}}>
                  <label style={{display:"block",fontSize:11,fontWeight:600,color:T.muted,marginBottom:4}}>
                    {fk==="dateFrom"?"Date From"
                    :fk==="dateTo"?"Date To"
                    :fk==="dbs"?"DBS Status"
                    :fk==="rtwType"?"RTW Type"
                    :fk==="compScope"?"Scope (Global / Site)"
                    :fk==="compType"?"Document Type"
                    :fk==="compCategory"?"Category"
                    :fk==="compMandatory"?"Mandatory"
                    :fk==="compActive"?"Active Status"
                    :fk==="compOverallStatus"?"Overall Compliance Status"
                    :fk.charAt(0).toUpperCase()+fk.slice(1)}
                  </label>
                  {(fk==="dateFrom"||fk==="dateTo")
                    ? <input type="date" value={filters[fk]||""} onChange={e=>setFilters(p=>({...p,[fk]:e.target.value}))}
                        style={{width:"100%",padding:"7px 10px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:12,fontFamily:FONT,color:T.text}}/>
                    : <select value={filters[fk]||""} onChange={e=>setFilters(p=>({...p,[fk]:e.target.value}))}
                        style={{width:"100%",padding:"7px 10px",border:`1px solid ${T.border}`,borderRadius:8,fontSize:12,fontFamily:FONT,color:T.text,background:T.white}}>
                        {(filterOpts[fk]||[""]).map(o=>(
                          <option key={o} value={o}>{fk==="rtwType"&&o?RTW_LABEL[o]||o:o||`All ${fk.charAt(0).toUpperCase()+fk.slice(1)}s`}</option>
                        ))}
                      </select>
                  }
                </div>
              ))}
              {Object.values(filters).some(v=>v)&&(
                <button onClick={()=>setFilters({})} style={{fontSize:11,fontWeight:560,color:T.red,background:"none",border:"none",cursor:"pointer",padding:"2px 0"}}>✕ Clear all filters</button>
              )}
            </Card>
          </div>

          {/* Right: preview */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {selFields.length===0
              ? <Card style={{padding:"48px",textAlign:"center",color:T.muted}}>
                  <div style={{marginBottom:8,display:"flex",justifyContent:"center",color:T.ghost}}>{renderIcon(src.icon,28)}</div>
                  <div style={{fontWeight:560,marginBottom:4}}>No columns selected</div>
                  <div style={{fontSize:12}}>Tick at least one field on the left to preview results.</div>
                </Card>
              : (()=>{
                  const {headers,rows} = getRows();
                  const activeFilters = Object.entries(filters).filter(([,v])=>v).length;
                  return (
                    <>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <span style={{fontWeight:600,fontSize:14,color:T.text}}>{rows.length} row{rows.length!==1?"s":""} </span>
                          <span style={{fontSize:13,color:T.muted}}>· {selFields.length} columns{activeFilters?` · ${activeFilters} filter${activeFilters>1?"s":""}`:""}</span>
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          <ExportMenu exports={[
                            {icon:"clipboard",label:"Export CSV",fn:()=>exportCSV(`${(reportName||"report").replace(/\s+/g,"-")}.csv`,headers,rows)},
                            {icon:"printer",label:"Export PDF",fn:()=>exportHTML(reportName||"Custom Report","Nexus RPO — Custom Report",buildTable(headers,rows))},
                          ]}/>
                          <Btn onClick={()=>setView("preview")}>Preview Full →</Btn>
                          <Btn variant="secondary" onClick={saveReport}>{justSaved?"Saved!":"Save Report"}</Btn>
                        </div>
                      </div>
                      <Card>
                        <div style={{overflowX:"auto",maxHeight:460,overflowY:"auto"}}>
                          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                            <thead style={{position:"sticky",top:0,zIndex:2}}>
                              <tr style={{background:T.navy}}>
                                {headers.map(h=>(
                                  <th key={h} style={{padding:"9px 12px",textAlign:"left",color:"white",fontWeight:560,fontSize:10,letterSpacing:"-0.006em",whiteSpace:"nowrap"}}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {rows.slice(0,50).map((row,i)=>(
                                <tr key={i} style={{borderBottom:`1px solid ${T.border}`,background:i%2===0?"transparent":T.raised}}>
                                  {row.map((cell,j)=>(
                                    <td key={j} style={{padding:"8px 12px",color:T.text,whiteSpace:"nowrap"}}>
                                      {(cell==="Fail"||cell==="Expired"||cell==="expired"||cell==="overdue")
                                        ? <span style={{fontWeight:560,color:T.red,background:T.redBg,padding:"2px 8px",borderRadius:8,fontSize:11}}>{cell}</span>
                                        :(cell==="Warning"||cell==="Expiring Soon"||cell==="expiring")
                                        ? <span style={{fontWeight:560,color:T.amberText,background:T.amberBg,padding:"2px 8px",borderRadius:8,fontSize:11}}>{cell}</span>
                                        :(cell==="Pass"||cell==="Verified"||cell==="valid"||cell==="approved"||cell==="paid"||cell==="Active")
                                        ? <span style={{fontWeight:560,color:T.green,background:T.greenBg,padding:"2px 8px",borderRadius:8,fontSize:11}}>{cell}</span>
                                        : cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                              {rows.length===0&&(
                                <tr><td colSpan={headers.length} style={{padding:"32px",textAlign:"center",color:T.muted}}>No data matches the current filters.</td></tr>
                              )}
                            </tbody>
                          </table>
                          {rows.length>50&&<div style={{padding:"10px 14px",fontSize:11,color:T.muted,borderTop:`1px solid ${T.border}`,background:T.raised}}>Showing 50 of {rows.length} rows. Export to see all data.</div>}
                        </div>
                      </Card>
                    </>
                  );
                })()
            }
          </div>
        </div>
      )}

      {/* ── FULL PREVIEW ───────────────────────────────────────────────────── */}
      {view==="preview"&&(()=>{
        const {headers,rows} = getRows();
        const activeFilters = Object.entries(filters).filter(([,v])=>v).length;
        return (
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <span style={{fontWeight:600,fontSize:16,color:T.text}}>{reportName||"Custom Report"}</span>
                <div style={{fontSize:12,color:T.muted,marginTop:2}}>{REPORT_SOURCES[source]?.icon} {REPORT_SOURCES[source]?.label} · {rows.length} rows · {selFields.length} columns{activeFilters?` · ${activeFilters} filter${activeFilters>1?"s":""}`:""}</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <ExportMenu exports={[
                  {icon:"clipboard",label:"Export CSV",fn:()=>exportCSV(`${(reportName||"report").replace(/\s+/g,"-")}.csv`,headers,rows)},
                  {icon:"printer",label:"Export PDF",fn:()=>exportHTML(reportName||"Custom Report","Nexus RPO — Custom Report",buildTable(headers,rows))},
                ]}/>
                <Btn variant="secondary" onClick={()=>setView("builder")}>← Edit Report</Btn>
                <Btn variant="secondary" onClick={saveReport}>{justSaved?"Saved!":"Save"}</Btn>
              </div>
            </div>

            {/* Active filters summary */}
            {activeFilters>0&&(
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {Object.entries(filters).filter(([,v])=>v).map(([k,v])=>(
                  <span key={k} style={{fontSize:11,fontWeight:560,padding:"4px 10px",borderRadius:20,background:T.amberBg,color:T.amberText,display:"flex",alignItems:"center",gap:5}}>
                    {k==="compScope"?"Scope"
                    :k==="compType"?"Type"
                    :k==="compCategory"?"Category"
                    :k==="compMandatory"?"Mandatory"
                    :k==="compActive"?"Status"
                    :k==="compOverallStatus"?"Overall"
                    :k.charAt(0).toUpperCase()+k.slice(1)}: {k==="rtwType"?RTW_LABEL[v]||v:v}
                    <button onClick={()=>setFilters(p=>({...p,[k]:""}))} style={{background:"none",border:"none",cursor:"pointer",color:T.amberText,fontSize:12,padding:0,lineHeight:1}}>✕</button>
                  </span>
                ))}
              </div>
            )}

            <Card>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead>
                    <tr style={{background:T.navy}}>
                      <th style={{padding:"9px 12px",color:"rgba(255,255,255,0.5)",fontWeight:560,fontSize:10,letterSpacing:"-0.006em",whiteSpace:"nowrap",width:40}}>#</th>
                      {headers.map(h=>(
                        <th key={h} style={{padding:"9px 12px",textAlign:"left",color:"white",fontWeight:560,fontSize:10,letterSpacing:"-0.006em",whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row,i)=>(
                      <tr key={i} style={{borderBottom:`1px solid ${T.border}`,background:i%2===0?"transparent":T.raised}}>
                        <td style={{padding:"8px 12px",color:T.muted,fontSize:11}}>{i+1}</td>
                        {row.map((cell,j)=>(
                          <td key={j} style={{padding:"8px 12px",color:T.text}}>
                            {(cell==="Fail"||cell==="Expired"||cell==="expired"||cell==="overdue")
                              ? <span style={{fontWeight:560,color:T.red,background:T.redBg,padding:"2px 8px",borderRadius:8,fontSize:11}}>{cell}</span>
                              :(cell==="Warning"||cell==="Expiring Soon"||cell==="expiring")
                              ? <span style={{fontWeight:560,color:T.amberText,background:T.amberBg,padding:"2px 8px",borderRadius:8,fontSize:11}}>{cell}</span>
                              :(cell==="Pass"||cell==="Verified"||cell==="valid"||cell==="approved"||cell==="paid"||cell==="Active")
                              ? <span style={{fontWeight:560,color:T.green,background:T.greenBg,padding:"2px 8px",borderRadius:8,fontSize:11}}>{cell}</span>
                              : cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {rows.length===0&&(
                      <tr><td colSpan={headers.length+1} style={{padding:"40px",textAlign:"center",color:T.muted,fontSize:13}}>No data matches the current filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        );
      })()}
    </Page>
  );
};
