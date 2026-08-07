import { useState } from "react";
import { Icon } from "../../components/Icon.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { SHIFTS } from "../../data/shifts.js";
import { TsBadge } from "./TimesheetStatus.jsx";
import { FONT, T } from "../../theme/tokens.js";

/* ─── AGENCY: TIMESHEETS ─────────────────────────────────────────────────────── */
export const AgencyTimesheets = ({timesheets,setTimesheets}) => {
  // All filled shifts for First Choice with no timesheet yet
  const myFilledShifts = SHIFTS.filter(s=>s.agency==="First Choice"&&s.status==="filled");
  const submittedShiftIds = new Set(timesheets.filter(t=>t.agency==="First Choice").map(t=>t.shiftId));
  const unsubmitted = myFilledShifts.filter(s=>!submittedShiftIds.has(s.id));

  // Per-row hour inputs (keyed by shift id)
  const [rowData,setRowData] = useState(() => {
    const init={};
    myFilledShifts.forEach(s=>{
      const sched = s.time.includes("–") ? (() => {
        const [st,en]=s.time.split("–");
        const [sh,sm]=st.split(":").map(Number);
        const [eh,em]=en.split(":").map(Number);
        let diff=(eh*60+em)-(sh*60+sm);
        if(diff<0)diff+=1440;
        return +(diff/60).toFixed(2);
      })() : 12;
      init[s.id]={hoursWorked:String(sched),breakMins:"30",notes:""};
    });
    return init;
  });

  const setRow=(id,k,v)=>setRowData(p=>({...p,[id]:{...p[id],[k]:v}}));

  const [filterStatus,setFilterStatus]=useState("unsubmitted");
  const [tsView,setTsView]=useState("list");   // "list" | "week"
  const [weekStart,setWeekStart]=useState("2026-03-09");
  const [submittedIds,setSubmittedIds]=useState(new Set());
  const [bulkSelect,setBulkSelect]=useState(new Set());

  const mySubmitted = timesheets.filter(t=>t.agency==="First Choice");

  const calcTotal=(shiftId)=>{
    const s=SHIFTS.find(x=>x.id===shiftId);
    const row=rowData[shiftId];
    if(!s||!row)return 0;
    return +((parseFloat(row.hoursWorked)||0)*s.rate).toFixed(2);
  };

  const submitOne=(shiftId)=>{
    const s=SHIFTS.find(x=>x.id===shiftId);
    const row=rowData[shiftId];
    if(!s||!row||!row.hoursWorked)return;
    const ts={
      id:`TS-${String(timesheets.length+1).padStart(3,"0")}`,
      shiftId:s.id,
      agency:"First Choice",
      carehome:s.carehome,
      worker:s.worker,
      role:s.role,
      date:s.date,
      time:s.time,
      scheduledHrs:(() => {
        const [st,en]=s.time.split("–");
        const [sh,sm]=st.split(":").map(Number);
        const [eh,em]=en.split(":").map(Number);
        let d=(eh*60+em)-(sh*60+sm);if(d<0)d+=1440;return +(d/60).toFixed(2);
      })(),
      hoursWorked:parseFloat(row.hoursWorked),
      breakMins:parseInt(row.breakMins)||0,
      rate:s.rate,
      total:calcTotal(shiftId),
      status:"pending",
      submittedAt:new Date().toISOString().split("T")[0],
      approvedBy:null,disputeReason:"",invoiceId:null,
      notes:row.notes||"",
    };
    setTimesheets(p=>[...p,ts]);
    setSubmittedIds(p=>new Set([...p,shiftId]));
  };

  const submitBulk=()=>{
    const toSubmit=[...bulkSelect].filter(id=>!submittedShiftIds.has(id));
    toSubmit.forEach(id=>submitOne(id));
    setBulkSelect(new Set());
  };

  const toggleBulk=(id)=>setBulkSelect(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});
  const toggleAll=()=>setBulkSelect(p=>p.size===unsubmitted.length?new Set():new Set(unsubmitted.map(s=>s.id)));

  const disputed=mySubmitted.filter(t=>t.status==="disputed");

  return (
    <Page title="Timesheets" sub="Review completed shifts and confirm hours — care homes are notified to approve before invoicing" icon="clock">

      {disputed.length>0&&(
        <Alert type="error" style={{marginBottom:14}}>
          {disputed.length} timesheet{disputed.length>1?"s have":" has"} been disputed by the care home. Review below and resubmit.
        </Alert>
      )}

      {/* Tabs + view toggle */}
      <div style={{display:"flex",gap:8,marginBottom:18,flexWrap:"wrap",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",gap:8}}>
          {[["unsubmitted",`Awaiting Submission (${unsubmitted.length})`],["submitted","Submitted"]].map(([v,l])=>(
            <button key={v} onClick={()=>setFilterStatus(v)} style={{padding:"8px 16px",borderRadius:8,border:"none",background:filterStatus===v?T.navy:T.sunken,color:filterStatus===v?T.white:T.muted,fontWeight:560,fontSize:12,cursor:"pointer",fontFamily:FONT}}>
              {l}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:4,background:T.sunken,padding:3,borderRadius:8}}>
          {[["list","☰ List"],["week","Week"]].map(([v,l])=>(
            <button key={v} onClick={()=>setTsView(v)} style={{padding:"6px 14px",borderRadius:8,border:"none",background:tsView===v?T.white:"transparent",color:tsView===v?T.navy:T.muted,fontWeight:560,fontSize:11,cursor:"pointer",fontFamily:FONT,boxShadow:tsView===v?"0 1px 3px rgba(0,0,0,0.1)":"none",transition:"all 0.15s"}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* ── WEEK VIEW ──────────────────────────────────────────────────────── */}
      {tsView==="week"&&(()=>{
        const weekDays=Array.from({length:7},(_,i)=>{const d=new Date(weekStart);d.setDate(d.getDate()+i);return d.toISOString().split("T")[0];});
        const dayLabels=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
        const prevWeek=()=>{const d=new Date(weekStart);d.setDate(d.getDate()-7);setWeekStart(d.toISOString().split("T")[0]);};
        const nextWeek=()=>{const d=new Date(weekStart);d.setDate(d.getDate()+7);setWeekStart(d.toISOString().split("T")[0]);};
        const allWeekShifts=myFilledShifts.filter(s=>weekDays.includes(s.date));
        const workerNames=[...new Set(allWeekShifts.map(s=>s.worker))];
        const weekLabel=`${new Date(weekDays[0]).toLocaleDateString("en-GB",{day:"numeric",month:"short"})} – ${new Date(weekDays[6]).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})}`;
        return (
          <>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
              <Btn small variant="secondary" onClick={prevWeek}>← Prev</Btn>
              <span style={{fontWeight:560,fontSize:14,color:T.navy,minWidth:200,textAlign:"center"}}>{weekLabel}</span>
              <Btn small variant="secondary" onClick={nextWeek}>Next →</Btn>
            </div>
            {workerNames.length===0
              ? <Card style={{padding:32,textAlign:"center"}}><div style={{marginBottom:8,display:"flex",justifyContent:"center",color:T.ghost}}><Icon name="calendar" size={26} stroke={1.5}/></div><div style={{fontWeight:560}}>No shifts this week</div><p style={{color:T.muted,fontSize:13,marginTop:4}}>Navigate to a different week.</p></Card>
              : <Card style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
                    <thead>
                      <tr style={{background:T.raised,borderBottom:`2px solid ${T.border}`}}>
                        <th style={{padding:"10px 14px",textAlign:"left",fontSize:11,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",minWidth:130,borderRight:`1px solid ${T.border}`}}>Worker</th>
                        {weekDays.map((date,i)=>{
                          const isToday=date==="2026-03-10";
                          return <th key={date} style={{padding:"8px 6px",textAlign:"center",fontSize:10,fontWeight:560,color:isToday?T.amber:i>=5?T.purple:T.muted,letterSpacing:"-0.006em",borderRight:i<6?`1px solid ${T.border}`:"none",background:isToday?T.amberBg:"transparent",minWidth:86}}>
                            <div>{dayLabels[i]}</div>
                            <div style={{fontSize:14,fontWeight:600,color:isToday?T.amber:T.text,marginTop:2}}>{new Date(date).getDate()}</div>
                          </th>;
                        })}
                        <th style={{padding:"10px 8px",textAlign:"center",fontSize:10,fontWeight:560,color:T.muted,borderLeft:`2px solid ${T.border}`,minWidth:80}}>Total Hrs</th>
                        <th style={{padding:"10px 8px",textAlign:"center",fontSize:10,fontWeight:560,color:T.muted,minWidth:80}}>Total Pay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workerNames.map(worker=>{
                        const ws=allWeekShifts.filter(s=>s.worker===worker);
                        const totalHrs=weekDays.reduce((acc,date)=>{const s=ws.find(s=>s.date===date);if(!s)return acc;const ts=timesheets.find(t=>t.shiftId===s.id);return acc+(ts?ts.hoursWorked:parseFloat(rowData[s.id]?.hoursWorked||0));},0);
                        const totalPay=weekDays.reduce((acc,date)=>{const s=ws.find(s=>s.date===date);if(!s)return acc;const ts=timesheets.find(t=>t.shiftId===s.id);const hrs=ts?ts.hoursWorked:parseFloat(rowData[s.id]?.hoursWorked||0);return acc+(hrs*s.rate);},0);
                        return (
                          <tr key={worker} style={{borderBottom:`1px solid ${T.border}`}}>
                            <td style={{padding:"12px 14px",borderRight:`1px solid ${T.border}`,background:T.raised}}>
                              <div style={{fontWeight:560,fontSize:13}}>{worker}</div>
                              {ws[0]?.role&&<Badge label={ws[0].role} color={T.purple} bg={T.purpleBg}/>}
                            </td>
                            {weekDays.map((date,i)=>{
                              const s=ws.find(s=>s.date===date);
                              const ts=s?timesheets.find(t=>t.shiftId===s.id):null;
                              const submitted=s?(submittedShiftIds.has(s.id)||submittedIds.has(s.id)):false;
                              const row=s?rowData[s.id]:null;
                              const isToday=date==="2026-03-10";
                              if(!s) return <td key={date} style={{padding:"10px 6px",textAlign:"center",borderRight:i<6?`1px solid ${T.border}`:"none",background:isToday?"#fffbeb22":"transparent"}}><span style={{fontSize:12,color:T.border}}>—</span></td>;
                              const hrs=ts?ts.hoursWorked:parseFloat(row?.hoursWorked||0);
                              return (
                                <td key={date} style={{padding:"6px 5px",textAlign:"center",borderRight:i<6?`1px solid ${T.border}`:"none",background:isToday?"#fffbeb44":ts?.status==="disputed"?T.redBg:submitted?T.greenBg:"transparent",verticalAlign:"middle"}}>
                                  <div style={{fontSize:9,color:T.muted,marginBottom:2}}>{s.time.split("–")[0]}</div>
                                  {submitted||ts
                                    ? <div><span style={{fontWeight:600,fontSize:15,color:ts?.status==="disputed"?T.red:T.green}}>{hrs}h</span><div style={{marginTop:2}}>{ts?<TsBadge s={ts.status}/>:<Badge label="✓" color={T.green} bg={T.greenBg}/>}</div></div>
                                    : <div>
                                        <input type="number" step="0.25" min="0" max="24" value={row?.hoursWorked||""} onChange={e=>setRow(s.id,"hoursWorked",e.target.value)}
                                          style={{width:54,padding:"5px 6px",borderRadius:8,border:`1px solid ${T.border}`,fontSize:13,fontFamily:FONT,fontWeight:560,outline:"none",textAlign:"center"}}/>
                                        <div style={{marginTop:4}}>
                                          <button onClick={()=>submitOne(s.id)} style={{fontSize:9,fontWeight:560,padding:"2px 7px",borderRadius:5,background:T.navy,color:T.white,border:"none",cursor:"pointer",fontFamily:FONT}}>Submit</button>
                                        </div>
                                      </div>
                                  }
                                </td>
                              );
                            })}
                            <td style={{padding:"12px 8px",textAlign:"center",borderLeft:`2px solid ${T.border}`,background:T.raised}}><span style={{fontWeight:600,fontSize:16,color:T.navy}}>{totalHrs.toFixed(1)}h</span></td>
                            <td style={{padding:"12px 8px",textAlign:"center",background:T.raised}}><span style={{fontWeight:600,fontSize:14,color:T.green}}>£{totalPay.toFixed(0)}</span></td>
                          </tr>
                        );
                      })}
                      {/* Totals footer */}
                      <tr style={{background:T.sunken,borderTop:`2px solid ${T.border}`}}>
                        <td style={{padding:"10px 14px",fontWeight:600,fontSize:11,color:T.muted,borderRight:`1px solid ${T.border}`}}>Daily Totals</td>
                        {weekDays.map((date,i)=>{
                          const hrs=allWeekShifts.filter(s=>s.date===date).reduce((acc,s)=>{const ts=timesheets.find(t=>t.shiftId===s.id);return acc+(ts?ts.hoursWorked:parseFloat(rowData[s.id]?.hoursWorked||0));},0);
                          return <td key={date} style={{padding:"10px 6px",textAlign:"center",borderRight:i<6?`1px solid ${T.border}`:"none"}}>
                            {hrs>0?<span style={{fontWeight:560,fontSize:13,color:T.navy}}>{hrs.toFixed(1)}h</span>:<span style={{fontSize:12,color:T.border}}>—</span>}
                          </td>;
                        })}
                        <td style={{padding:"10px 8px",textAlign:"center",borderLeft:`2px solid ${T.border}`,background:T.sunken}}><span style={{fontWeight:600,fontSize:15,color:T.navy}}>{allWeekShifts.reduce((acc,s)=>{const ts=timesheets.find(t=>t.shiftId===s.id);return acc+(ts?ts.hoursWorked:parseFloat(rowData[s.id]?.hoursWorked||0));},0).toFixed(1)}h</span></td>
                        <td style={{padding:"10px 8px",textAlign:"center",background:T.sunken}}><span style={{fontWeight:600,fontSize:14,color:T.green}}>£{allWeekShifts.reduce((acc,s)=>{const ts=timesheets.find(t=>t.shiftId===s.id);const hrs=ts?ts.hoursWorked:parseFloat(rowData[s.id]?.hoursWorked||0);return acc+(hrs*s.rate);},0).toFixed(0)}</span></td>
                      </tr>
                    </tbody>
                  </table>
                </Card>
            }
          </>
        );
      })()}

      {tsView==="list"&&<>
      {filterStatus==="unsubmitted"&&(
        <>
          {unsubmitted.length===0?(
            <Card style={{padding:40,textAlign:"center"}}>
              <div style={{marginBottom:10,display:"flex",justifyContent:"center",color:T.ghost}}><Icon name="checkCircle" size={30} stroke={1.5}/></div>
              <div style={{fontWeight:560,fontSize:15,marginBottom:6}}>All shifts submitted</div>
              <p style={{color:T.muted,fontSize:13}}>No completed shifts are awaiting timesheet submission. Switch to "Submitted" to track approvals.</p>
            </Card>
          ):(
            <>
              {/* Info banner */}
              <div style={{background:T.accentBg,border:`1px solid ${T.blue}44`,borderRadius:14,padding:"14px 18px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontWeight:560,fontSize:13,color:T.blue,marginBottom:3}}>{unsubmitted.length} completed shift{unsubmitted.length>1?"s":""} ready to submit</div>
                  <div style={{fontSize:12,color:T.muted}}>Worker and shift details are pre-filled from the booking. Just confirm the hours worked and break taken, then submit for care home approval.</div>
                </div>
                {bulkSelect.size>0&&(
                  <Btn onClick={submitBulk}>Submit {bulkSelect.size} selected →</Btn>
                )}
              </div>

              {/* Table */}
              <Card>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse"}}>
                    <thead>
                      <tr style={{background:T.raised,borderBottom:`2px solid ${T.border}`}}>
                        <th style={{padding:"10px 12px",textAlign:"left"}}>
                          <input type="checkbox" checked={bulkSelect.size===unsubmitted.length&&unsubmitted.length>0} onChange={toggleAll} style={{cursor:"pointer"}}/>
                        </th>
                        {["Worker","Role","Care Home","Date","Shift Time","Sched. Hrs","Hrs Worked","Break (min)","Rate","Total","Notes","Action"].map(h=>(
                          <th key={h} style={{padding:"10px 8px",textAlign:"left",fontSize:10,fontWeight:560,color:T.muted,letterSpacing:"-0.006em",whiteSpace:"nowrap"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {unsubmitted.map(s=>{
                        const row=rowData[s.id]||{hoursWorked:"12",breakMins:"30",notes:""};
                        const total=calcTotal(s.id);
                        const justSubmitted=submittedIds.has(s.id);
                        const selected=bulkSelect.has(s.id);
                        const schedHrs=(()=>{const [st,en]=s.time.split("–");const[sh,sm]=st.split(":").map(Number);const[eh,em]=en.split(":").map(Number);let d=(eh*60+em)-(sh*60+sm);if(d<0)d+=1440;return+(d/60).toFixed(1);})();
                        const hrsDiff=parseFloat(row.hoursWorked)-schedHrs;
                        return(
                          <tr key={s.id} style={{borderBottom:`1px solid ${T.border}`,background:justSubmitted?T.greenBg:selected?T.accentBg:"transparent",transition:"background 0.15s"}}>
                            <td style={{padding:"10px 12px"}}>
                              {justSubmitted
                                ?<span style={{color:T.green,fontSize:16}}>✓</span>
                                :<input type="checkbox" checked={selected} onChange={()=>toggleBulk(s.id)} style={{cursor:"pointer"}}/>}
                            </td>
                            <td style={{padding:"10px 8px",fontWeight:560,fontSize:13,whiteSpace:"nowrap"}}>{s.worker}</td>
                            <td style={{padding:"10px 8px"}}><Badge label={s.role} color={T.purple} bg={T.purpleBg}/></td>
                            <td style={{padding:"10px 8px",fontSize:13,color:T.muted,whiteSpace:"nowrap"}}>{s.carehome}</td>
                            <td style={{padding:"10px 8px",fontSize:12,whiteSpace:"nowrap"}}>{s.date}</td>
                            <td style={{padding:"10px 8px",fontSize:12,color:T.muted,whiteSpace:"nowrap"}}>{s.time}</td>
                            <td style={{padding:"10px 8px",fontSize:12,color:T.muted,textAlign:"center"}}>{schedHrs}h</td>
                            <td style={{padding:"6px 4px",minWidth:72}}>
                              {justSubmitted
                                ?<span style={{fontWeight:560,color:T.green}}>{row.hoursWorked}h</span>
                                :<div style={{position:"relative"}}>
                                  <input
                                    type="number" step="0.25" min="0" max="24"
                                    value={row.hoursWorked}
                                    onChange={e=>setRow(s.id,"hoursWorked",e.target.value)}
                                    style={{width:68,padding:"6px 8px",borderRadius:8,border:`1px solid ${hrsDiff<-0.5||hrsDiff>0?T.yellow:T.border}`,fontSize:13,fontFamily:FONT,fontWeight:560,outline:"none",textAlign:"center",background:hrsDiff<-0.5||hrsDiff>0?T.amberBg:T.white}}
                                  />
                                  {(hrsDiff<-0.5||hrsDiff>0.01)&&(
                                    <div style={{position:"absolute",top:-18,left:"50%",transform:"translateX(-50%)",background:T.yellow,color:T.white,fontSize:9,fontWeight:560,padding:"1px 5px",borderRadius:4,whiteSpace:"nowrap"}}>
                                      {hrsDiff>0?"+":""}{hrsDiff.toFixed(1)}h vs booked
                                    </div>
                                  )}
                                </div>}
                            </td>
                            <td style={{padding:"6px 4px",minWidth:64}}>
                              {justSubmitted
                                ?<span style={{fontSize:12,color:T.muted}}>{row.breakMins}m</span>
                                :<input
                                  type="number" step="5" min="0" max="60"
                                  value={row.breakMins}
                                  onChange={e=>setRow(s.id,"breakMins",e.target.value)}
                                  style={{width:58,padding:"6px 8px",borderRadius:8,border:`1px solid ${T.border}`,fontSize:13,fontFamily:FONT,outline:"none",textAlign:"center"}}
                                />}
                            </td>
                            <td style={{padding:"10px 8px",fontSize:12,fontWeight:600}}>£{s.rate}{"/hr"}</td>
                            <td style={{padding:"10px 8px"}}>
                              <span style={{fontWeight:600,color:T.green,fontSize:14}}>£{total.toLocaleString()}</span>
                            </td>
                            <td style={{padding:"6px 4px",minWidth:120}}>
                              {justSubmitted
                                ?<span style={{fontSize:12,color:T.muted,fontStyle:"italic"}}>{row.notes||"—"}</span>
                                :<input
                                  value={row.notes}
                                  onChange={e=>setRow(s.id,"notes",e.target.value)}
                                  placeholder="Optional note…"
                                  style={{width:120,padding:"6px 8px",borderRadius:8,border:`1px solid ${T.border}`,fontSize:12,fontFamily:FONT,outline:"none"}}
                                />}
                            </td>
                            <td style={{padding:"6px 8px"}}>
                              {justSubmitted
                                ?<Badge label="Submitted ✓" color={T.green} bg={T.greenBg}/>
                                :<Btn small onClick={()=>submitOne(s.id)}>Submit →</Btn>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {unsubmitted.filter(s=>!submittedIds.has(s.id)).length>1&&(
                  <div style={{padding:"12px 16px",borderTop:`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontSize:12,color:T.muted}}>
                      Total if all submitted: <strong style={{color:T.green}}>£{unsubmitted.filter(s=>!submittedIds.has(s.id)).reduce((a,s)=>a+calcTotal(s.id),0).toLocaleString()}</strong>
                    </span>
                    <Btn onClick={()=>unsubmitted.filter(s=>!submittedIds.has(s.id)).forEach(s=>submitOne(s.id))}>Submit All →</Btn>
                  </div>
                )}
              </Card>
            </>
          )}
        </>
      )}

      {filterStatus==="submitted"&&(
        <>
          <Grid cols={4}>
            <Stat label="Pending Approval" value={mySubmitted.filter(t=>t.status==="pending").length} accent/>
            <Stat label="Approved" value={mySubmitted.filter(t=>t.status==="approved").length}/>
            <Stat label="Disputed" value={disputed.length} sub={disputed.length>0?"Action needed":""}/>
            <Stat label="Invoiced" value={mySubmitted.filter(t=>t.status==="invoiced").length}/>
          </Grid>
          <Card>
            <Table
              headers={["ID","Worker","Care Home","Date","Hrs Booked","Hrs Submitted","Rate","Total","Status","Submitted","Action"]}
              rows={mySubmitted.map(ts=>(
                <tr key={ts.id} style={{borderBottom:`1px solid ${T.border}`,background:ts.status==="disputed"?T.redBg:ts.status==="approved"?T.greenBg:"transparent"}}>
                  <Td><span style={{fontFamily:"monospace",fontSize:11,fontWeight:560,color:T.navy}}>{ts.id}</span></Td>
                  <Td bold>{ts.worker}</Td>
                  <Td>{ts.carehome}</Td>
                  <Td>{ts.date}</Td>
                  <Td style={{color:T.muted}}>{ts.scheduledHrs}h</Td>
                  <Td bold>{ts.hoursWorked}h</Td>
                  <Td>£{ts.rate}{"/hr"}</Td>
                  <Td><span style={{fontWeight:600,color:T.green}}>£{ts.total.toLocaleString()}</span></Td>
                  <Td><TsBadge s={ts.status}/></Td>
                  <Td style={{fontSize:11,color:T.muted}}>{ts.submittedAt}</Td>
                  <Td>
                    {ts.status==="disputed"?(
                      <div style={{display:"flex",gap:5}}>
                        <Btn small onClick={()=>setTimesheets(prev=>prev.map(t=>t.id===ts.id?{...t,status:"pending",disputeReason:null}:t))}>Resubmit</Btn>
                        <Btn small variant="secondary" onClick={()=>alert(`Dispute reason: "${ts.disputeReason}"`)}>Reason</Btn>
                      </div>
                    ):<Btn small variant="secondary" onClick={()=>alert(`Timesheet ${ts.id}\nWorker: ${ts.worker}\nDate: ${ts.date}\nHours: ${ts.hoursWorked}h @ £${ts.rate}{"/hr"} = £${ts.total}\nStatus: ${ts.status}`)}>View</Btn>}
                  </Td>
                </tr>
              ))}
            />
          </Card>
          {disputed.length>0&&(
            <Card style={{marginTop:16,border:`1px solid ${T.red}55`}}>
              <CardHead title="Disputes Raised" icon="warning" sub="Care home queries — correct and resubmit"/>
              {disputed.map(ts=>(
                <div key={ts.id} style={{margin:"10px 14px",padding:"14px 16px",background:T.redBg,borderRadius:8,border:`1px solid ${T.red}33`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,flexWrap:"wrap",gap:6}}>
                    <span style={{fontWeight:560,fontSize:13}}>{ts.worker} — {ts.carehome} ({ts.date})</span>
                    <span style={{fontFamily:"monospace",fontSize:11,color:T.muted}}>{ts.id}</span>
                  </div>
                  <div style={{fontSize:12,color:T.red,fontWeight:600,marginBottom:10}}>"{ts.disputeReason}"</div>
                  <div style={{display:"flex",gap:8}}>
                    <Btn small onClick={()=>setTimesheets(prev=>prev.map(t=>t.id===ts.id?{...t,status:"pending",disputeReason:null}:t))}>Correct & Resubmit</Btn>
                    <Btn small variant="secondary" onClick={()=>alert(`Message sent to ${ts.carehome} regarding timesheet ${ts.id}. They will respond within 1 working day.`)}>Contact Care Home</Btn>
                  </div>
                </div>
              ))}
            </Card>
          )}
        </>
      )}
      </>}{/* end tsView==="list" */}
    </Page>
  );
};
