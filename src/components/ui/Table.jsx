import { T } from "../../theme/tokens.js";

export const Th = ({children}) => <th style={{padding:"11px 16px",fontSize:12,fontWeight:510,color:T.faint,textAlign:"left",letterSpacing:"-0.005em",background:"transparent",borderBottom:`1px solid ${T.divider}`,whiteSpace:"nowrap"}}>{children}</th>;

export const Td = ({children,bold}) => <td style={{padding:"12px 16px",fontSize:13.5,color:T.text,fontWeight:bold?560:420,letterSpacing:"-0.008em",verticalAlign:"middle",borderBottom:`1px solid ${T.divider}`}}>{children}</td>;

export const Table = ({headers,rows,empty}) => (
  <div style={{overflowX:"auto"}}>
    <table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead><tr>{headers.map((h,i)=><Th key={i}>{h}</Th>)}</tr></thead>
      <tbody>{rows.length ? rows : (empty && <tr><td colSpan={headers.length} style={{padding:"44px 32px",textAlign:"center",color:T.faint,fontSize:13.5}}>{empty}</td></tr>)}</tbody>
    </table>
  </div>
);
