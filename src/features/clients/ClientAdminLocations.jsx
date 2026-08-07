import { Card, Grid, Stat } from "../../components/ui/Card.jsx";
import { ProgressBar } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { INIT_CLIENT_GROUPS, SITE_COLORS, SITE_DATA } from "../../data/clients.js";
import { CA_PURPLE, T } from "../../theme/tokens.js";

export const ClientAdminLocations = ({user, users}) => {
  const thisUser = (users||[]).find(u=>u.email===user?.email) || {sites:["Sunrise Care","Sunrise Dementia Unit","Oakwood Nursing"]};
  const mySites = (thisUser?.sites||[]).filter(s=>SITE_DATA[s]);

  return (
    <Page title="Locations" sub="Your contracted sites under this group" icon="hospital">
      <Grid cols={3}>
        <Stat label="Total Locations" value={mySites.length} accent/>
        <Stat label="Total Beds" value={mySites.reduce((a,s)=>{const g=INIT_CLIENT_GROUPS.flatMap(g=>g.locations).find(l=>l.name===s);return a+(g?.beds||0);},0)} sub="Across all sites"/>
        <Stat label="Active Locations" value={mySites.length} trend="All operational"/>
      </Grid>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16}}>
        {mySites.map(siteName=>{
          const d=SITE_DATA[siteName];
          const locData=INIT_CLIENT_GROUPS.flatMap(g=>g.locations).find(l=>l.name===siteName);
          const accent=SITE_COLORS[siteName]||CA_PURPLE;
          const fr=d?Math.round(d.filled/d.shifts*100):0;
          const CQC_C={Outstanding:T.purple,Good:T.green,"Requires Improvement":T.amber,Inadequate:T.red};
          return (
            <Card key={siteName} style={{borderLeft:`4px solid ${accent}`}}>
              <div style={{padding:"16px 18px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:15,color:T.text}}>{siteName}</div>
                    {locData&&<div style={{fontSize:11,color:T.muted,marginTop:2}}>{locData.type} · {locData.beds} beds</div>}
                  </div>
                  {locData?.cqcRating&&<span style={{fontSize:10,fontWeight:560,padding:"3px 8px",borderRadius:10,background:`${CQC_C[locData.cqcRating]}18`,color:CQC_C[locData.cqcRating]}}>{locData.cqcRating}</span>}
                </div>
                {d&&<>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                    <div style={{padding:"10px",background:T.raised,borderRadius:8,textAlign:"center"}}>
                      <div style={{fontSize:20,fontWeight:600,color:accent}}>{fr}%</div>
                      <div style={{fontSize:10,color:T.muted,fontWeight:600}}>FILL RATE</div>
                    </div>
                    <div style={{padding:"10px",background:T.raised,borderRadius:8,textAlign:"center"}}>
                      <div style={{fontSize:20,fontWeight:600,color:T.text}}>£{(d.spend/1000).toFixed(1)}k</div>
                      <div style={{fontSize:10,color:T.muted,fontWeight:600}}>MTD SPEND</div>
                    </div>
                  </div>
                  <ProgressBar value={d.spend} max={d.budget} color={accent}/>
                  <div style={{fontSize:10,color:T.muted,marginTop:4,display:"flex",justifyContent:"space-between"}}>
                    <span>Budget: £{d.budget.toLocaleString()}</span>
                    <span>{Math.round(d.spend/d.budget*100)}% used</span>
                  </div>
                </>}
                {locData?.contact&&<div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${T.border}`,fontSize:11,color:T.muted}}>Manager: <strong style={{color:T.text}}>{locData.contact}</strong></div>}
              </div>
            </Card>
          );
        })}
      </div>
    </Page>
  );
};
