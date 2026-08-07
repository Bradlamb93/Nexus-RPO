/* ─── EXPORT UTILITIES ───────────────────────────────────────────────────────── */
export const exportCSV = (filename, headers, rows) => {
  const escape = v => {
    const s = v == null ? "" : String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s.replace(/"/g,'""')}"` : s;
  };
  const csv = [headers, ...rows].map(r => r.map(escape).join(",")).join("\n");
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=filename; a.click();
  URL.revokeObjectURL(url);
};

export const exportHTML = (title, subtitle, tableHTML) => {
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:Arial,sans-serif;font-size:12px;color:#1e293b;padding:32px 40px}
    .header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:28px;padding-bottom:16px;border-bottom:2px solid #f59e0b}
    .logo{font-size:20px;font-weight:900;color:#08132a;letter-spacing:-0.5px}
    .logo span{color:#f59e0b}
    .meta{text-align:right;font-size:11px;color:#64748b}
    h1{font-size:18px;font-weight:800;margin-bottom:4px}
    .subtitle{font-size:12px;color:#64748b;margin-bottom:24px}
    table{width:100%;border-collapse:collapse;font-size:11px}
    th{background:#08132a;color:#fff;padding:8px 10px;text-align:left;font-weight:700;font-size:10px;text-transform:uppercase;letter-spacing:0.05em}
    td{padding:7px 10px;border-bottom:1px solid #e2e8f0}
    tr:nth-child(even) td{background:#f8fafc}
    tr:last-child td{border-bottom:none}
    .footer{margin-top:24px;font-size:10px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px;display:flex;justify-content:space-between}
    @media print{body{padding:16px 20px}}
  </style></head><body>
  <div class="header">
    <div class="logo">First Choice<span>Connect</span></div>
    <div class="meta"><div>Generated: ${new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</div><div>Nexus RPO Ltd</div></div>
  </div>
  <h1>${title}</h1><p class="subtitle">${subtitle||""}</p>
  ${tableHTML}
  <div class="footer"><span>Nexus RPO — Confidential</span><span>Page 1</span></div>
  </body></html>`;
  const blob = new Blob([html], {type:"text/html;charset=utf-8;"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download=`${title.replace(/\s+/g,"-")}.html`; a.click();
  URL.revokeObjectURL(url);
};

export const buildTable = (headers, rows) =>
  `<table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c??""}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
