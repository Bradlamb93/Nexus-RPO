import { Badge, SBadge } from "../../components/ui/Badge.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ProgressBar } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { Table, Td } from "../../components/ui/Table.jsx";
import { SHIFTS } from "../../data/shifts.js";
import { WORKERS } from "../../data/workers.js";
import { T } from "../../theme/tokens.js";

export const CareHomeWorkers = () => (
  <Page title="Worker Profiles" sub="Verified workers who have been placed with you" icon="users">
    <Card>
      <Table
        headers={["Worker","Role","Agency","DBS","NMC/PIN","Last Placed","Compliance"]}
        rows={WORKERS.filter(w=>w.compliance>=80).map(w=>(
          <tr key={w.id} style={{borderBottom:`1px solid ${T.border}`}}>
            <Td bold>{w.name}</Td>
            <Td><Badge label={w.role} color={T.purple} bg={T.purpleBg}/></Td>
            <Td><span style={{fontSize:12,color:T.muted}}>{w.agency}</span></Td>
            <Td><SBadge s={w.dbs}/></Td>
            <Td>{w.pin?<Badge label="✓ Verified" color={T.green} bg={T.greenBg}/>:<Badge label="N/A" color={T.muted} bg={T.sunken}/>}</Td>
            <Td>{SHIFTS.find(s=>s.worker===w.name)?.date||"—"}</Td>
            <Td>
              <div style={{display:"flex",alignItems:"center",gap:8,minWidth:80}}>
                <ProgressBar value={w.compliance} color={T.green}/>
                <span style={{fontSize:11,fontWeight:560,color:T.green}}>{w.compliance}%</span>
              </div>
            </Td>
          </tr>
        ))}
      />
    </Card>
  </Page>
);
