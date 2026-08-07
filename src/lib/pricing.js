// Neutral vendor margin — what Nexus RPO charges care homes on top of agency rates
// Per-client pricing: platformFee (% of total spend) + hourlyMargin (£/hr or % per hour)
export const blankClientPricing = () => ({
  platformFee:   { enabled: false, value: 2.5 },
  hourlyMargin:  { enabled: true, type: "fixed", usePerRole: true, globalValue: 2.50,
                   perRole: { RGN: 3.00, RMN: 3.50, HCA: 2.00, "Senior Carer": 2.50 } },
  notes: "",
});

// cfg here = a client's hourlyMargin object (or legacy full cfg)
export const calcClientRate = (agencyRate, role, cfg) => {
  if (!cfg || !cfg.enabled) return agencyRate;
  if (cfg.type === "percentage") {
    const pct = cfg.usePerRole ? (cfg.perRole?.[role] ?? cfg.globalValue) : cfg.globalValue;
    return +(agencyRate * (1 + pct / 100)).toFixed(2);
  }
  const margin = cfg.usePerRole ? (cfg.perRole?.[role] ?? cfg.globalValue) : cfg.globalValue;
  return +(agencyRate + margin).toFixed(2);
};

export const getMargin = (agencyRate, role, cfg) => {
  if (!cfg || !cfg.enabled) return 0;
  return +(calcClientRate(agencyRate, role, cfg) - agencyRate).toFixed(2);
};

// Calculate platform fee revenue from a spend amount
export const calcPlatformFee = (totalSpend, feeCfg) => {
  if (!feeCfg || !feeCfg.enabled) return 0;
  return +(totalSpend * feeCfg.value / 100).toFixed(2);
};
