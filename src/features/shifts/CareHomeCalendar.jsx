import { useState } from "react";
import { Badge, SBadge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { SHIFTS } from "../../data/shifts.js";
import { T } from "../../theme/tokens.js";

export const CareHomeCalendar = () => {
  const [viewDate, setViewDate] = useState({year:2026, month:2}); // 0-indexed month
  const mine = SHIFTS.filter(s=>s.carehome==="Sunrise Care");
  const [selectedDay, setSelectedDay] = useState(null);

  const today = {year:2026, month:2, day:10}; // March 10 2026
  const dayNames = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const {year, month} = viewDate;
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  // Convert Sun-based to Mon-based offset
  const startOffset = (firstDay + 6) % 7;
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();

  const prevMonth = () => setViewDate(v => v.month===0?{year:v.year-1,month:11}:{year:v.year,month:v.month-1});
  const nextMonth = () => setViewDate(v => v.month===11?{year:v.year+1,month:0}:{year:v.year,month:v.month+1});

  // Build grid: 6 rows × 7 cols
  const cells = [];
  for(let i=0; i<startOffset; i++) cells.push({day:daysInPrev-startOffset+1+i, cur:false});
  for(let d=1; d<=daysInMonth; d++) cells.push({day:d, cur:true});
  while(cells.length<42) cells.push({day:cells.length-startOffset-daysInMonth+1, cur:false});

  const padDay = d => String(d).padStart(2,"0");
  const shiftsOn = (d) => {
    if(!viewDate) return [];
    const dateStr = `${year}-${padDay(month+1)}-${padDay(d)}`;
    return mine.filter(s=>s.date===dateStr);
  };

  const isToday = (d) => d===today.day && month===today.month && year===today.year;

  const selectedShifts = selectedDay ? shiftsOn(selectedDay) : [];

  // Month totals
  const monthShifts = mine.filter(s=>s.date.startsWith(`${year}-${padDay(month+1)}`));
  const filled  = monthShifts.filter(s=>s.status==="filled").length;
  const pending = monthShifts.filter(s=>s.status==="pending").length;
  const open    = monthShifts.filter(s=>s.status==="open").length;

  return (
    <Page title="Shift Calendar" sub={`${monthNames[month]} ${year}`} icon="calendar">
      {/* Controls */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:10}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Btn small variant="secondary" onClick={prevMonth}>← Prev</Btn>
          <span style={{fontWeight:600,fontSize:16,color:T.navy,minWidth:160,textAlign:"center"}}>{monthNames[month]} {year}</span>
          <Btn small variant="secondary" onClick={nextMonth}>Next →</Btn>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Badge label={`${filled} Filled`} color={T.green} bg={T.greenBg} dot/>
          <Badge label={`${pending} Pending`} color={T.yellow} bg={T.yellowBg} dot/>
          <Badge label={`${open} Open`} color={T.blue} bg={T.blueBg} dot/>
          <Badge label={`${monthShifts.length} Total`} color={T.muted} bg={T.sunken}/>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr",gap:14}}>
        <Card style={{overflow:"hidden"}}>
          {/* Day headers */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",borderBottom:`2px solid ${T.border}`}}>
            {dayNames.map((d,i)=>(
              <div key={i} style={{padding:"10px 6px",textAlign:"center",fontSize:11,fontWeight:560,color:i>=5?T.purple:T.muted,letterSpacing:"-0.006em",background:T.raised,borderRight:i<6?`1px solid ${T.border}`:"none"}}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)"}}>
            {cells.map((cell,i)=>{
              const col = i%7;
              const isLast = i>=35;
              const shifts = cell.cur ? shiftsOn(cell.day) : [];
              const isSelected = cell.cur && selectedDay===cell.day;
              const isTod = cell.cur && isToday(cell.day);
              return (
                <div
                  key={i}
                  onClick={()=>cell.cur&&setSelectedDay(selectedDay===cell.day?null:cell.day)}
                  style={{
                    minHeight:96,
                    padding:"6px 8px",
                    borderRight:col<6?`1px solid ${T.border}`:"none",
                    borderBottom:!isLast?`1px solid ${T.border}`:"none",
                    background:isSelected?T.accentBg:isTod?T.amberBg:!cell.cur?"#f9fafb":T.white,
                    cursor:cell.cur?"pointer":"default",
                    transition:"background 0.1s",
                  }}>
                  <div style={{
                    fontSize:12,fontWeight:isTod?800:cell.cur?500:400,
                    color:isTod?T.amber:cell.cur?T.text:T.border,
                    marginBottom:5,display:"flex",alignItems:"center",gap:4,
                  }}>
                    {isTod
                      ? <span style={{width:22,height:22,borderRadius:"50%",background:T.amber,color:T.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600}}>{cell.day}</span>
                      : cell.day}
                  </div>
                  {shifts.slice(0,3).map(s=>(
                    <div key={s.id} style={{
                      background:s.status==="filled"?T.greenBg:s.status==="pending"?T.yellowBg:T.blueBg,
                      borderLeft:`3px solid ${s.status==="filled"?T.green:s.status==="pending"?T.yellow:T.blue}`,
                      borderRadius:"0 4px 4px 0",padding:"2px 5px",marginBottom:3,
                      fontSize:9,fontWeight:560,
                      color:s.status==="filled"?T.green:s.status==="pending"?T.yellow:T.blue,
                      whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
                    }}>
                      {s.time.split("–")[0]} {s.role}
                    </div>
                  ))}
                  {shifts.length>3&&(
                    <div style={{fontSize:9,color:T.muted,fontWeight:600}}>+{shifts.length-3} more</div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Day detail panel */}
        {selectedDay && (
          <Card style={{padding:18}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h3 style={{fontWeight:600,fontSize:15}}>{monthNames[month]} {selectedDay}, {year}</h3>
              <Btn small variant="secondary" onClick={()=>setSelectedDay(null)}>✕ Close</Btn>
            </div>
            {selectedShifts.length===0
              ? <p style={{color:T.muted,fontSize:13}}>No shifts on this day.</p>
              : <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {selectedShifts.map(s=>(
                    <div key={s.id} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 16px",borderRadius:10,border:`1px solid ${s.status==="filled"?T.green+"44":s.status==="pending"?T.yellow+"44":T.blue+"44"}`,background:s.status==="filled"?T.greenBg:s.status==="pending"?T.yellowBg:T.blueBg}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}>
                          <Badge label={s.role} color={T.purple} bg={T.purpleBg}/>
                          <SBadge s={s.status}/>
                        </div>
                        <div style={{fontSize:13,fontWeight:600,color:T.text}}>{s.time}</div>
                        <div style={{fontSize:12,color:T.muted,marginTop:2}}>{s.agency||"Unassigned"}{s.worker?` · ${s.worker}`:""}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontWeight:600,fontSize:15,color:T.navy}}>£{s.rate}{"/hr"}</div>
                        <div style={{fontSize:11,color:T.muted}}>Est. £{s.rate*12}{"/shift"}</div>
                      </div>
                    </div>
                  ))}
                </div>
            }
          </Card>
        )}
      </div>
    </Page>
  );
};
