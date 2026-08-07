import { useState } from "react";
import { Badge } from "../../components/ui/Badge.jsx";
import { Btn } from "../../components/ui/Button.jsx";
import { Card, CardHead, Grid, Stat } from "../../components/ui/Card.jsx";
import { Alert } from "../../components/ui/Feedback.jsx";
import { Page } from "../../components/ui/Page.jsx";
import { INIT_CLIENT_GROUPS } from "../../data/clients.js";
import { INIT_RATE_CARDS } from "../../data/rates.js";
import { ROLES } from "../../data/shifts.js";
import { blankClientPricing, calcClientRate, calcPlatformFee, getMargin } from "../../lib/pricing.js";
import { FONT, T } from "../../theme/tokens.js";

/* ─── ADMIN: MARGINS & PRICING ───────────────────────────────────────────────── */
export const MarginManager = ({clientPricing, setClientPricing}) => {
  const clients = INIT_CLIENT_GROUPS.map(g => ({ id: g.id, name: g.name, contact: g.contact }));
  const [selId, setSelId]   = useState(clients[0].id);
  const [saved, setSaved]   = useState(false);
  const ROLES = ["RGN","RMN","HCA","Senior Carer"];

  // per-client monthly spend estimates (illustrative)
  const EST_SPEND = { cg1: 32000, cg2: 28000, cg3: 15000 };

  // local draft for selected client
  const basePricing = clientPricing[selId] || blankClientPricing();
  const [draft, setDraft] = useState({ ...basePricing,
    platformFee:  { ...basePricing.platformFee },
    hourlyMargin: { ...basePricing.hourlyMargin, perRole: { ...basePricing.hourlyMargin.perRole } },
  });

  // reset draft when switching clients
  const selectClient = (id) => {
    setSelId(id);
    const p = clientPricing[id] || blankClientPricing();
    setDraft({ ...p, platformFee: { ...p.platformFee }, hourlyMargin: { ...p.hourlyMargin, perRole: { ...p.hourlyMargin.perRole } } });
    setSaved(false);
  };

  const setFee  = (k, v) => setDraft(d => ({ ...d, platformFee:  { ...d.platformFee,  [k]: v } }));
  const setHrly = (k, v) => setDraft(d => ({ ...d, hourlyMargin: { ...d.hourlyMargin, [k]: v } }));
  const setRole = (role, v) => setDraft(d => ({ ...d, hourlyMargin: { ...d.hourlyMargin, perRole: { ...d.hourlyMargin.perRole, [role]: parseFloat(v)||0 } } }));

  const save = () => {
    setClientPricing(p => ({ ...p, [selId]: { ...draft } }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  // preview calcs for selected client
  const sampleRates = INIT_RATE_CARDS.filter(r => r.type === "agency" && r.agency === "First Choice Nursing");
  const estSpend    = EST_SPEND[selId] || 20000;
  const feeRevenue  = calcPlatformFee(estSpend, draft.platformFee);
  const hrsPerRole  = { RGN: 120, RMN: 80, HCA: 160, "Senior Carer": 52 };
  const hrlyRevenue = draft.hourlyMargin.enabled
    ? sampleRates.reduce((acc, r) => acc + getMargin(r.weekday, r.role, draft.hourlyMargin) * (hrsPerRole[r.role] || 0), 0)
    : 0;
  const totalRevenue = feeRevenue + hrlyRevenue;

  // summary across all clients
  const allClientsRevenue = clients.reduce((sum, c) => {
    const p = clientPricing[c.id] || blankClientPricing();
    const sp = EST_SPEND[c.id] || 20000;
    const fee = calcPlatformFee(sp, p.platformFee);
    const hrly = p.hourlyMargin.enabled
      ? sampleRates.reduce((a, r) => a + getMargin(r.weekday, r.role, p.hourlyMargin) * (hrsPerRole[r.role]||0), 0) : 0;
    return sum + fee + hrly;
  }, 0);

  const Toggle = ({ on, onToggle, label }) => (
    <label style={{ display:"flex", alignItems:"center", gap:10, cursor:"pointer" }}>
      <button onClick={onToggle} style={{ width:42, height:24, borderRadius:14, background:on?T.green:T.border, border:"none", cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
        <div style={{ position:"absolute", top:3, left:on?20:3, width:18, height:18, borderRadius:"50%", background:T.white, transition:"left 0.2s", boxShadow:"0 1px 3px rgba(0,0,0,0.2)" }}/>
      </button>
      <span style={{ fontSize:13, fontWeight:600, color:T.text }}>{label}</span>
    </label>
  );

  return (
    <Page title="Margins & Pricing" sub="Configure platform fees and hourly margins per client" icon="money">

      {saved && <Alert type="success">✓ Pricing saved for {clients.find(c=>c.id===selId)?.name}. Applies to all new timesheets and invoices.</Alert>}

      {/* Platform summary */}
      <Grid cols={3}>
        <Stat label="Est. Total Monthly Revenue" value={`£${allClientsRevenue.toFixed(0)}`} sub="Across all active clients (illustrative)" accent/>
        <Stat label="Active Clients" value={`${clients.length}`} sub="With configured pricing"/>
        <Stat label="Fee Structures in Use" value={
          `${Object.values(clientPricing).filter(p=>p?.platformFee?.enabled).length} platform fee · ${Object.values(clientPricing).filter(p=>p?.hourlyMargin?.enabled).length} hourly margin`
        } sub="Across all clients"/>
      </Grid>

      {/* Client selector */}
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {clients.map(c => {
          const p = clientPricing[c.id];
          const hasFee  = p?.platformFee?.enabled;
          const hasHrly = p?.hourlyMargin?.enabled;
          const active  = selId === c.id;
          return (
            <button key={c.id} onClick={() => selectClient(c.id)} style={{
              padding:"10px 18px", borderRadius:10, border:`2px solid ${active?T.navy:T.border}`,
              background: active ? T.navy : T.white, color: active ? T.white : T.text,
              fontWeight:560, fontSize:13, cursor:"pointer", fontFamily:FONT,
              display:"flex", alignItems:"center", gap:8, transition:"all 0.15s"
            }}>
              {c.name}
              <div style={{ display:"flex", gap:3 }}>
                {hasFee  && <span style={{ fontSize:10, padding:"2px 6px", borderRadius:20, background:active?"rgba(255,255,255,0.2)":"#e0f2fe", color:active?T.white:T.accentText, fontWeight:560 }}>% fee</span>}
                {hasHrly && <span style={{ fontSize:10, padding:"2px 6px", borderRadius:20, background:active?"rgba(255,255,255,0.2)":T.amberBg, color:active?T.white:T.amberText, fontWeight:560 }}>£/hr</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Two fee type cards */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18, marginBottom:18 }}>

        {/* Platform fee card */}
        <Card style={{ padding:24, border:`2px solid ${draft.platformFee.enabled ? T.accentText : T.border}`, transition:"border-color 0.2s" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
            <div>
              <div style={{ fontWeight:600, fontSize:14, color:T.text, marginBottom:3 }}>Platform Fee</div>
              <div style={{ fontSize:11, color:T.muted }}>Charged as a % of total monthly spend put through the system</div>
            </div>
            <Toggle on={draft.platformFee.enabled} onToggle={() => setFee("enabled", !draft.platformFee.enabled)} label=""/>
          </div>

          <div style={{ opacity: draft.platformFee.enabled ? 1 : 0.4, pointerEvents: draft.platformFee.enabled ? "auto" : "none", transition:"opacity 0.2s" }}>
            <label style={{ display:"block", fontSize:11, fontWeight:560, color:T.muted, letterSpacing:"0.07em", marginBottom:8 }}>
              Fee Rate (% of total spend)
            </label>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <input type="number" step="0.1" min="0" max="20" value={draft.platformFee.value}
                onChange={e => setFee("value", parseFloat(e.target.value)||0)}
                style={{ width:100, padding:"10px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:20, fontWeight:600, fontFamily:FONT, outline:"none", textAlign:"center" }}/>
              <span style={{ fontSize:18, fontWeight:560, color:T.muted }}>%</span>
              <span style={{ fontSize:12, color:T.muted }}>of total spend</span>
            </div>

            {/* Preview */}
            <div style={{ background:"#f0f9ff", borderRadius:10, padding:"14px 16px" }}>
              <div style={{ fontSize:11, fontWeight:560, color:T.accentText, letterSpacing:"0.07em", marginBottom:8 }}>Revenue Preview</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <span style={{ fontSize:12, color:T.muted }}>Est. monthly spend (this client)</span>
                <span style={{ fontSize:13, fontWeight:600, color:T.text }}>£{estSpend.toLocaleString()}</span>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <span style={{ fontSize:12, color:T.muted }}>Platform fee ({draft.platformFee.value}%)</span>
                <span style={{ fontSize:14, fontWeight:600, color:T.accentText }}>£{feeRevenue.toFixed(0)}{"/mo"}</span>
              </div>
              <div style={{ fontSize:11, color:T.muted, marginTop:4 }}>
                Invoiced separately to client — not passed to agencies
              </div>
            </div>
          </div>

          {!draft.platformFee.enabled && (
            <div style={{ marginTop:12, padding:"10px 14px", background:T.raised, borderRadius:8, fontSize:12, color:T.muted, textAlign:"center" }}>
              Platform fee disabled for this client
            </div>
          )}
        </Card>

        {/* Hourly margin card */}
        <Card style={{ padding:24, border:`2px solid ${draft.hourlyMargin.enabled ? T.amber : T.border}`, transition:"border-color 0.2s" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
            <div>
              <div style={{ fontWeight:600, fontSize:14, color:T.text, marginBottom:3 }}>Hourly Margin</div>
              <div style={{ fontSize:11, color:T.muted }}>Added to agency rate on every hour billed through the platform</div>
            </div>
            <Toggle on={draft.hourlyMargin.enabled} onToggle={() => setHrly("enabled", !draft.hourlyMargin.enabled)} label=""/>
          </div>

          <div style={{ opacity: draft.hourlyMargin.enabled ? 1 : 0.4, pointerEvents: draft.hourlyMargin.enabled ? "auto" : "none", transition:"opacity 0.2s" }}>

            {/* Type toggle */}
            <div style={{ marginBottom:14 }}>
              <label style={{ display:"block", fontSize:11, fontWeight:560, color:T.muted, letterSpacing:"0.07em", marginBottom:7 }}>Charge Type</label>
              <div style={{ display:"flex", gap:8 }}>
                {[["fixed","Fixed £/hr"],["percentage","Percentage (%)"]].map(([v,l]) => (
                  <button key={v} onClick={() => setHrly("type", v)} style={{
                    flex:1, padding:"9px", borderRadius:8, border:`1px solid ${draft.hourlyMargin.type===v?T.navy:T.border}`,
                    background: draft.hourlyMargin.type===v ? T.navy : T.raised,
                    color: draft.hourlyMargin.type===v ? T.white : T.muted,
                    fontWeight:560, fontSize:12, cursor:"pointer", fontFamily:FONT, transition:"all 0.15s"
                  }}>{l}</button>
                ))}
              </div>
            </div>

            {/* Per-role toggle */}
            <div style={{ marginBottom:14 }}>
              <Toggle on={draft.hourlyMargin.usePerRole} onToggle={() => setHrly("usePerRole", !draft.hourlyMargin.usePerRole)} label="Different margin per role"/>
            </div>

            {/* Global value */}
            {!draft.hourlyMargin.usePerRole && (
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:560, color:T.muted, letterSpacing:"0.07em", marginBottom:6 }}>
                  Global Margin ({draft.hourlyMargin.type==="fixed" ? "£/hr" : "%"})
                </label>
                <input type="number" step="0.25" min="0" max="50" value={draft.hourlyMargin.globalValue}
                  onChange={e => setHrly("globalValue", parseFloat(e.target.value)||0)}
                  style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:18, fontWeight:600, fontFamily:FONT, outline:"none", textAlign:"center" }}/>
              </div>
            )}

            {/* Per-role values */}
            {draft.hourlyMargin.usePerRole && (
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"block", fontSize:11, fontWeight:560, color:T.muted, letterSpacing:"0.07em", marginBottom:8 }}>
                  Per-Role ({draft.hourlyMargin.type==="fixed" ? "£/hr" : "%"})
                </label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {ROLES.map(role => (
                    <div key={role} style={{ display:"flex", alignItems:"center", gap:8, background:T.raised, borderRadius:8, padding:"8px 10px" }}>
                      <span style={{ fontSize:11, fontWeight:560, color:T.muted, flex:1, minWidth:0, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{role}</span>
                      <input type="number" step="0.25" min="0" max="50"
                        value={draft.hourlyMargin.perRole[role] ?? draft.hourlyMargin.globalValue}
                        onChange={e => setRole(role, e.target.value)}
                        style={{ width:56, padding:"5px 7px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:13, fontWeight:600, fontFamily:FONT, outline:"none", textAlign:"center" }}/>
                      <span style={{ fontSize:11, color:T.muted, minWidth:24 }}>{draft.hourlyMargin.type==="fixed"?"£/hr":"%"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hourly preview */}
            <div style={{ background:T.amberBg, borderRadius:10, padding:"12px 14px" }}>
              <div style={{ fontSize:11, fontWeight:560, color:T.amberText, letterSpacing:"0.07em", marginBottom:6 }}>Est. Monthly Margin Revenue</div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, color:T.amberText }}>~412 hrs/mo (illustrative)</span>
                <span style={{ fontSize:16, fontWeight:600, color:T.amberText }}>£{hrlyRevenue.toFixed(0)}{"/mo"}</span>
              </div>
            </div>
          </div>

          {!draft.hourlyMargin.enabled && (
            <div style={{ marginTop:12, padding:"10px 14px", background:T.raised, borderRadius:8, fontSize:12, color:T.muted, textAlign:"center" }}>
              Hourly margin disabled for this client
            </div>
          )}
        </Card>
      </div>

      {/* Notes + save */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:12, marginBottom:18, alignItems:"flex-end" }}>
        <div>
          <label style={{ display:"block", fontSize:11, fontWeight:560, color:T.muted, letterSpacing:"0.07em", marginBottom:5 }}>Internal Notes (this client)</label>
          <textarea value={draft.notes} onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))} rows={2}
            placeholder="e.g. pricing agreed in contract review March 2026…"
            style={{ width:"100%", padding:"9px 12px", borderRadius:8, border:`1px solid ${T.border}`, fontSize:12, fontFamily:FONT, resize:"vertical", outline:"none", color:T.muted, boxSizing:"border-box" }}/>
        </div>
        <Btn onClick={save} style={{ whiteSpace:"nowrap", alignSelf:"flex-end" }}>Save Pricing →</Btn>
      </div>

      {/* Rate preview table */}
      <Card>
        <CardHead title="Live Rate Preview" sub={`How rates break down for ${clients.find(c=>c.id===selId)?.name}`} icon="search"/>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ background:T.raised }}>
                {["Role","Agency Rate","Hourly Margin","Client Rate","Platform Fee*","Total Nexus Revenue/hr"].map(h => (
                  <th key={h} style={{ padding:"9px 12px", fontSize:10, fontWeight:560, color:T.muted, textAlign:"left", letterSpacing:"0.07em", borderBottom:`1px solid ${T.border}`, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sampleRates.map(r => {
                const clientRate  = calcClientRate(r.weekday, r.role, draft.hourlyMargin);
                const hrlyMargin  = getMargin(r.weekday, r.role, draft.hourlyMargin);
                const feePerHour  = draft.platformFee.enabled ? +(r.weekday * draft.platformFee.value / 100).toFixed(2) : 0;
                const totalPerHr  = +(hrlyMargin + feePerHour).toFixed(2);
                return (
                  <tr key={r.id} style={{ borderBottom:`1px solid ${T.border}` }}>
                    <td style={{ padding:"11px 12px" }}><Badge label={r.role} color={T.purple} bg={T.purpleBg}/></td>
                    <td style={{ padding:"11px 12px", fontSize:13, fontWeight:600, color:T.muted }}>£{r.weekday}{"/hr"}</td>
                    <td style={{ padding:"11px 12px" }}>
                      {draft.hourlyMargin.enabled
                        ? <span style={{ fontWeight:560, fontSize:13, color:T.green }}>+£{hrlyMargin.toFixed(2)}</span>
                        : <span style={{ fontSize:12, color:T.muted }}>—</span>}
                    </td>
                    <td style={{ padding:"11px 12px" }}>
                      <span style={{ fontWeight:600, fontSize:14, color:T.navy }}>£{clientRate}{"/hr"}</span>
                    </td>
                    <td style={{ padding:"11px 12px" }}>
                      {draft.platformFee.enabled
                        ? <span style={{ fontSize:13, fontWeight:600, color:T.accentText }}>+£{feePerHour.toFixed(2)}</span>
                        : <span style={{ fontSize:12, color:T.muted }}>—</span>}
                    </td>
                    <td style={{ padding:"11px 12px" }}>
                      <span style={{ fontWeight:600, fontSize:14, color: totalPerHr > 0 ? T.green : T.muted }}>
                        {totalPerHr > 0 ? `£${totalPerHr.toFixed(2)}` : "—"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop:12, padding:"10px 14px", background:T.raised, borderRadius:8, fontSize:11, color:T.muted }}>
          * Platform fee per hour shown as indicative only — it is charged as a single monthly invoice calculated on total spend, not per-shift.
        </div>
      </Card>

      {/* Combined revenue summary */}
      <div style={{ marginTop:18, padding:"20px 24px", background:T.navy, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.6)", fontWeight:600, marginBottom:4 }}>
            {clients.find(c=>c.id===selId)?.name} — Est. Combined Monthly Revenue
          </div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.45)" }}>
            {draft.platformFee.enabled ? `Platform fee: £${feeRevenue.toFixed(0)}` : "No platform fee"}
            {draft.platformFee.enabled && draft.hourlyMargin.enabled ? "  +  " : ""}
            {draft.hourlyMargin.enabled ? `Hourly margin: £${hrlyRevenue.toFixed(0)}` : ""}
          </div>
        </div>
        <div style={{ fontSize:32, fontWeight:900, color:T.amber }}>£{totalRevenue.toFixed(0)}<span style={{ fontSize:14, fontWeight:600, color:"rgba(255,255,255,0.5)" }}>/mo</span></div>
      </div>

    </Page>
  );
};
