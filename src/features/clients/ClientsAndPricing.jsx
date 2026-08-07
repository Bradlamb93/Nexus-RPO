import { useState } from "react";
import { renderIcon } from "../../components/Icon.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { INIT_CLIENT_GROUPS } from "../../data/clients.js";
import { ClientManager } from "./ClientManager.jsx";
import { BankRateCards } from "../rates/BankRateCards.jsx";
import { MarginManager } from "../rates/MarginManager.jsx";
import { RateCards } from "../rates/RateCards.jsx";
import { RateUpliftManager } from "../rates/RateUpliftManager.jsx";
import { FONT, T } from "../../theme/tokens.js";

/* ─── ADMIN: CLIENTS & PRICING HUB ─────────────────────────────────────────── */
export const ClientsAndPricing = (props) => {
  const [tab, setTab] = useState("clients");
  const [groups, setGroups] = useState(INIT_CLIENT_GROUPS);

  const TABS = [
    { k:"clients",    l:"Clients & Panels",  i:"" },
    { k:"ratecards",  l:"Rate Cards",        i:"" },
    { k:"bankrates",  l:"Bank Rates",        i:"" },
    { k:"rateuplifts",l:"Rate Uplifts",      i:"" },
    { k:"margins",    l:"Margins & Pricing", i:"" },
  ];

  return (
    <Page title="Clients & Pricing" sub="Client groups, agency panels, rates, and platform pricing" icon="hospital">
      {/* Tab bar */}
      <div style={{display:"flex",gap:0,background:T.sunken,borderRadius:14,padding:4,width:"fit-content",marginBottom:22,flexWrap:"wrap"}}>
        {TABS.map(t=>{
          const active=tab===t.k;
          return (
            <button key={t.k} onClick={()=>setTab(t.k)}
              style={{padding:"8px 18px",borderRadius:10,border:"none",fontFamily:FONT,fontWeight:560,fontSize:13,cursor:"pointer",
                background:active?T.white:"transparent",color:active?T.navy:T.muted,
                boxShadow:active?"0 1px 4px rgba(0,0,0,0.1)":"none",transition:"all 0.15s",
                display:"flex",alignItems:"center",gap:6}}>
              <span style={{display:"flex"}}>{renderIcon(t.i,15)}</span> {t.l}
            </button>
          );
        })}
      </div>

      {tab==="clients"    && <ClientManager groups={groups} setGroups={setGroups}/>}
      {tab==="ratecards"  && <RateCards {...props}/>}
      {tab==="bankrates"  && <BankRateCards {...props}/>}
      {tab==="rateuplifts"&& <RateUpliftManager {...props}/>}
      {tab==="margins"    && <MarginManager clientPricing={props.clientPricing} setClientPricing={props.setClientPricing}/>}
    </Page>
  );
};
