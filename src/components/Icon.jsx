/* ─── ICONS ──────────────────────────────────────────────────────────────────
   A monoline set in the spirit of SF Symbols: single 24×24 grid, 1.7 stroke,
   round caps and joins, no fills except intentional dots. Everything inherits
   currentColor so icons pick up the surrounding text colour for free.         */
export const ICON_PATHS = {
  grid:        <><rect x="3.5" y="3.5" width="7" height="7" rx="2.2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2.2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2.2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2.2"/></>,
  clipboard:   <><path d="M9 4.75H7.5a2 2 0 0 0-2 2v11.75a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V6.75a2 2 0 0 0-2-2H15"/><rect x="9" y="2.9" width="6" height="3.7" rx="1.3"/></>,
  calendar:    <><rect x="3.75" y="5.5" width="16.5" height="15" rx="3"/><path d="M3.75 10.25h16.5M8.5 3.5v4M15.5 3.5v4"/></>,
  briefcase:   <><rect x="3" y="7.5" width="18" height="13" rx="3"/><path d="M8.5 7.5V6a2.5 2.5 0 0 1 2.5-2.5h2A2.5 2.5 0 0 1 15.5 6v1.5M3 13.25h18"/></>,
  hospital:    <><path d="M4 20.5V8.2a1.5 1.5 0 0 1 .79-1.32l6.5-3.5a1.5 1.5 0 0 1 1.42 0l6.5 3.5A1.5 1.5 0 0 1 20 8.2V20.5"/><path d="M2.75 20.5h18.5M12 9.75v5M9.5 12.25h5"/></>,
  bank:        <><path d="M3 9.75 12 4.5l9 5.25M4.9 9.9v8.85M9.3 9.9v8.85M14.7 9.9v8.85M19.1 9.9v8.85M2.75 19.75h18.5"/></>,
  building:    <><rect x="4.5" y="3.5" width="15" height="17" rx="2.5"/><path d="M8.75 8h1.75M13.5 8h1.75M8.75 12h1.75M13.5 12h1.75M10 20.5v-4h4v4"/></>,
  users:       <><circle cx="9.25" cy="8.5" r="3.4"/><path d="M2.9 20.25c0-3.35 2.85-5.6 6.35-5.6s6.35 2.25 6.35 5.6"/><path d="M16.4 5.6a3.4 3.4 0 0 1 0 6.6M17.9 15.1c1.98.78 3.2 2.5 3.2 4.6"/></>,
  user:        <><circle cx="12" cy="8.25" r="3.85"/><path d="M4.9 20.4c0-3.7 3.2-6.15 7.1-6.15s7.1 2.45 7.1 6.15"/></>,
  shield:      <><path d="M12 3.3 5.1 6.05v5.6c0 4.2 2.86 7.62 6.9 9.15 4.04-1.53 6.9-4.95 6.9-9.15v-5.6L12 3.3Z"/></>,
  shieldCheck: <><path d="M12 3.3 5.1 6.05v5.6c0 4.2 2.86 7.62 6.9 9.15 4.04-1.53 6.9-4.95 6.9-9.15v-5.6L12 3.3Z"/><path d="m9.15 11.85 2.1 2.1 3.6-3.9"/></>,
  document:    <><path d="M13.4 3.5H8A2.5 2.5 0 0 0 5.5 6v12A2.5 2.5 0 0 0 8 20.5h8a2.5 2.5 0 0 0 2.5-2.5V8.6L13.4 3.5Z"/><path d="M13.15 3.8v4.85h4.9"/></>,
  folder:      <><path d="M3.5 7.4A2.5 2.5 0 0 1 6 4.9h3.1a2 2 0 0 1 1.55.74l1 1.22a2 2 0 0 0 1.55.74H18a2.5 2.5 0 0 1 2.5 2.5v7.4A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5V7.4Z"/></>,
  archive:     <><rect x="2.9" y="4" width="18.2" height="4.9" rx="2"/><path d="M4.75 9v9.05a2.5 2.5 0 0 0 2.5 2.5h9.5a2.5 2.5 0 0 0 2.5-2.5V9M10 13.15h4"/></>,
  book:        <><path d="M4.5 4.9A1.9 1.9 0 0 1 6.4 3H19.2v14.6H6.4a1.9 1.9 0 0 0-1.9 1.9V4.9Z"/><path d="M4.5 19.5c0 1.05.85 1.9 1.9 1.9H19.2"/></>,
  clock:       <><circle cx="12" cy="12" r="8.6"/><path d="M12 6.9v5.35l3.35 2"/></>,
  timer:       <><circle cx="12" cy="13.4" r="7.4"/><path d="M12 9.9v3.6M9.5 2.75h5M18.6 6.4l1.5-1.5"/></>,
  hourglass:   <><path d="M6.9 3.5h10.2M6.9 20.5h10.2M8.1 3.5v3.15c0 2.05 3.9 3.9 3.9 5.35 0-1.45 3.9-3.3 3.9-5.35V3.5M8.1 20.5v-3.15c0-2.05 3.9-3.9 3.9-5.35 0 1.45 3.9 3.3 3.9 5.35v3.15"/></>,
  pound:       <><circle cx="12" cy="12" r="8.6"/><path d="M14.6 8.6a2.75 2.75 0 0 0-5 1.6c0 2.5.95 3.25.95 4.6 0 .95-.5 1.7-1.25 2.1h6.05M9.3 12.75h3.8"/></>,
  money:       <><rect x="2.75" y="6.1" width="18.5" height="11.8" rx="2.6"/><circle cx="12" cy="12" r="2.65"/><path d="M6.1 9.6v4.8M17.9 9.6v4.8"/></>,
  receipt:     <><path d="M6 3.6h12v16.9l-2.4-1.6-2.4 1.6-2.4-1.6-2.4 1.6L6 20.5V3.6Z"/><path d="M9.25 8.6h5.5M9.25 12.35h5.5"/></>,
  chartBar:    <><path d="M3.5 20.5h17"/><rect x="5.4" y="10.9" width="3.6" height="7.1" rx="1.3"/><rect x="10.2" y="6.4" width="3.6" height="11.6" rx="1.3"/><rect x="15" y="9" width="3.6" height="9" rx="1.3"/></>,
  chartPie:    <><circle cx="12" cy="12" r="8.6"/><path d="M12 3.4v8.6h8.6"/></>,
  trendingUp:  <><path d="m3.5 16.6 5.75-5.75 3.5 3.5L20.5 6.6"/><path d="M15.15 6.6h5.35v5.35"/></>,
  forecast:    <><circle cx="11.4" cy="11.2" r="6.4"/><path d="M6.1 19.6h10.6"/><path d="m19.6 3.3.78 1.96 1.96.78-1.96.78-.78 1.96-.78-1.96-1.96-.78 1.96-.78.78-1.96Z"/></>,
  search:      <><circle cx="10.75" cy="10.75" r="6.75"/><path d="m15.65 15.65 4.6 4.6"/></>,
  filter:      <><path d="M3.6 5.5h16.8l-6.65 7.9v5.55l-3.5 2.05V13.4L3.6 5.5Z"/></>,
  lock:        <><rect x="4.6" y="10.1" width="14.8" height="10.4" rx="3"/><path d="M8.1 10.1V7.6a3.9 3.9 0 0 1 7.8 0v2.5"/></>,
  idCard:      <><rect x="2.75" y="5" width="18.5" height="14" rx="3"/><circle cx="8.6" cy="10.6" r="2.3"/><path d="M5.1 16.1c.5-1.65 1.9-2.55 3.5-2.55s3 .9 3.5 2.55M15 9.75h4M15 13.6h4"/></>,
  pin:         <><path d="M12 20.9s6.4-5.6 6.4-10.15a6.4 6.4 0 1 0-12.8 0C5.6 15.3 12 20.9 12 20.9Z"/><circle cx="12" cy="10.55" r="2.5"/></>,
  globe:       <><circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2M12 3.4c2.25 2.35 3.45 5.35 3.45 8.6S14.25 18.25 12 20.6c-2.25-2.35-3.45-5.35-3.45-8.6S9.75 5.75 12 3.4Z"/></>,
  warning:     <><path d="M10.63 4.24 2.94 17.5a1.58 1.58 0 0 0 1.37 2.37h15.38a1.58 1.58 0 0 0 1.37-2.37L13.37 4.24a1.58 1.58 0 0 0-2.74 0Z"/><path d="M12 9.6v4.3"/><circle cx="12" cy="16.85" r="0.95" fill="currentColor" stroke="none"/></>,
  siren:       <><path d="M8.55 2.9h6.9l4.65 4.65v6.9l-4.65 4.65h-6.9L3.9 14.45v-6.9L8.55 2.9Z"/><path d="M12 7.6v4.6"/><circle cx="12" cy="15.5" r="0.95" fill="currentColor" stroke="none"/></>,
  checkCircle: <><circle cx="12" cy="12" r="8.6"/><path d="m8.15 12.25 2.65 2.65 5.05-5.5"/></>,
  check:       <><path d="m5.2 12.6 4.55 4.55L18.9 7.4"/></>,
  close:       <><path d="m6.6 6.6 10.8 10.8M17.4 6.6 6.6 17.4"/></>,
  plus:        <><path d="M12 5.1v13.8M5.1 12h13.8"/></>,
  minus:       <><path d="M5.1 12h13.8"/></>,
  info:        <><circle cx="12" cy="12" r="8.6"/><path d="M12 11.1v5.4"/><circle cx="12" cy="7.85" r="0.95" fill="currentColor" stroke="none"/></>,
  star:        <><path d="m12 3.4 2.66 5.39 5.94.86-4.3 4.19 1.02 5.92L12 17.05l-5.32 2.71 1.02-5.92-4.3-4.19 5.94-.86L12 3.4Z"/></>,
  award:       <><circle cx="12" cy="9.15" r="5.65"/><path d="m8.4 14.05-1.15 6.45L12 17.95l4.75 2.55-1.15-6.45"/></>,
  trophy:      <><path d="M7.9 4.4h8.2v5.05a4.1 4.1 0 0 1-8.2 0V4.4Z"/><path d="M7.9 6.2H5.4a2.6 2.6 0 0 0 2.5 2.6M16.1 6.2h2.5a2.6 2.6 0 0 1-2.5 2.6M12 13.55v3.5M8.6 20.5h6.8"/></>,
  medical:     <><circle cx="12" cy="12" r="8.6"/><path d="M12 7.9v8.2M7.9 12h8.2"/></>,
  bed:         <><path d="M3.4 19.9V6.6M3.4 12.6h16.1a2.1 2.1 0 0 1 2.1 2.1v5.2M21.6 16.7H3.4"/><circle cx="7.85" cy="9.35" r="2"/></>,
  printer:     <><path d="M7 8.6V4.35h10V8.6"/><path d="M6.6 8.6h10.8a3 3 0 0 1 3 3v3.4a1.6 1.6 0 0 1-1.6 1.6H17M6.6 8.6a3 3 0 0 0-3 3v3.4a1.6 1.6 0 0 0 1.6 1.6H7"/><rect x="7" y="13.4" width="10" height="6.35" rx="1.3"/></>,
  bell:        <><path d="M17.9 9.6a5.9 5.9 0 1 0-11.8 0c0 4.9-2 6.4-2 6.4h15.8s-2-1.5-2-6.4Z"/><path d="M13.7 19.4a2 2 0 0 1-3.4 0"/></>,
  mail:        <><rect x="2.75" y="5" width="18.5" height="14" rx="3"/><path d="m4.1 7.6 6.85 4.85a2 2 0 0 0 2.3 0L20.1 7.6"/></>,
  phone:       <><path d="M8.35 3.75H5.7A2 2 0 0 0 3.71 6c.6 6.86 6.43 12.69 13.29 13.29a2 2 0 0 0 2.25-1.99v-2.65l-3.95-1.35-1.9 1.9a13.6 13.6 0 0 1-5.5-5.5l1.9-1.9L8.35 3.75Z"/></>,
  message:     <><path d="M20.6 12.2a7.8 7.8 0 0 1-11.3 6.97L4 20.5l1.33-5.3A7.8 7.8 0 1 1 20.6 12.2Z"/></>,
  megaphone:   <><path d="M3.5 10.4v3.2a2 2 0 0 0 2 2h2l8.4 4.6V3.8L7.5 8.4h-2a2 2 0 0 0-2 2Z"/><path d="M19.1 9.15a4 4 0 0 1 0 5.7"/></>,
  flag:        <><path d="M5.6 21V3.9M5.6 4.9h11.3l-2.05 3.55 2.05 3.55H5.6"/></>,
  ban:         <><circle cx="12" cy="12" r="8.6"/><path d="m6.15 6.15 11.7 11.7"/></>,
  hand:        <><path d="M8.9 12.4V5.9a1.75 1.75 0 0 1 3.5 0v5.3m0-4.9a1.75 1.75 0 0 1 3.5 0v5.4m0-3.4a1.75 1.75 0 0 1 3.5 0v6.9a6.4 6.4 0 0 1-6.4 6.4h-1.2a6.4 6.4 0 0 1-6.4-6.4v-2a1.75 1.75 0 0 1 3.5 0"/></>,
  trash:       <><path d="M4.6 6.85h14.8M9.6 6.85V5.1a1.6 1.6 0 0 1 1.6-1.6h1.6a1.6 1.6 0 0 1 1.6 1.6v1.75M6.6 6.85V18.9a2 2 0 0 0 2 2h6.8a2 2 0 0 0 2-2V6.85M10.1 11.1v5.5M13.9 11.1v5.5"/></>,
  edit:        <><path d="M16.45 3.9a2.15 2.15 0 0 1 3.05 3.05L8.55 17.9l-4.05 1 1-4.05L16.45 3.9Z"/></>,
  save:        <><path d="M5.6 3.6h9.95L20.4 8.45V19a1.5 1.5 0 0 1-1.5 1.5H5.6A1.5 1.5 0 0 1 4.1 19V5.1a1.5 1.5 0 0 1 1.5-1.5Z"/><path d="M8.1 3.6v5.05h6.9V3.6M8.1 20.5v-5.85h7.8v5.85"/></>,
  refresh:     <><path d="M20.1 12a8.1 8.1 0 1 1-2.42-5.78"/><path d="M20.5 4.1v4.6h-4.6"/></>,
  download:    <><path d="M12 4.1v10.6M7.7 10.4 12 14.7l4.3-4.3M4.6 19.6h14.8"/></>,
  upload:      <><path d="M12 19.6V9M7.7 13.3 12 9l4.3 4.3M4.6 4.4h14.8"/></>,
  paperclip:   <><path d="M19.9 11.4 12.2 19.1a4.6 4.6 0 1 1-6.5-6.5l7.9-7.9a3.07 3.07 0 0 1 4.34 4.34l-7.85 7.85a1.53 1.53 0 1 1-2.17-2.17l7.25-7.2"/></>,
  bolt:        <><path d="M13.2 2.6 4.6 13.7h6.5l-1.3 7.7 8.6-11.1h-6.5l1.3-7.7Z"/></>,
  sparkle:     <><path d="m11 3.4 1.85 4.75L17.6 10l-4.75 1.85L11 16.6l-1.85-4.75L4.4 10l4.75-1.85L11 3.4Z"/><path d="m18.4 15.1.85 2.15 2.15.85-2.15.85-.85 2.15-.85-2.15-2.15-.85 2.15-.85.85-2.15Z"/></>,
  rocket:      <><path d="M9.15 11.6c1.6-5.15 5.15-8.15 10.4-8.15 0 5.25-3 8.8-8.15 10.4L9.15 11.6Z"/><path d="M9.6 14.4 4.7 19.3M8.85 13.65l-2.9-.5 1.55-2.6M10.35 15.15l.5 2.9 2.6-1.55"/></>,
  eye:         <><path d="M2.6 12S6.1 5.6 12 5.6 21.4 12 21.4 12 17.9 18.4 12 18.4 2.6 12 2.6 12Z"/><circle cx="12" cy="12" r="3.05"/></>,
  settings:    <><circle cx="12" cy="12" r="3.05"/><path d="M18.8 14.6a1.5 1.5 0 0 0 .3 1.65l.05.05a1.85 1.85 0 1 1-2.6 2.6l-.05-.05a1.5 1.5 0 0 0-1.65-.3 1.5 1.5 0 0 0-.9 1.37v.13a1.85 1.85 0 1 1-3.7 0v-.07a1.5 1.5 0 0 0-.98-1.37 1.5 1.5 0 0 0-1.65.3l-.05.05a1.85 1.85 0 1 1-2.6-2.6l.05-.05a1.5 1.5 0 0 0 .3-1.65 1.5 1.5 0 0 0-1.37-.9h-.13a1.85 1.85 0 1 1 0-3.7h.07a1.5 1.5 0 0 0 1.37-.98 1.5 1.5 0 0 0-.3-1.65l-.05-.05a1.85 1.85 0 1 1 2.6-2.6l.05.05a1.5 1.5 0 0 0 1.65.3h.07a1.5 1.5 0 0 0 .9-1.37v-.13a1.85 1.85 0 1 1 3.7 0v.07a1.5 1.5 0 0 0 .9 1.37 1.5 1.5 0 0 0 1.65-.3l.05-.05a1.85 1.85 0 1 1 2.6 2.6l-.05.05a1.5 1.5 0 0 0-.3 1.65v.07a1.5 1.5 0 0 0 1.37.9h.13a1.85 1.85 0 1 1 0 3.7h-.07a1.5 1.5 0 0 0-1.37.9Z"/></>,
  logout:      <><path d="M9.6 20.4H6.1a2 2 0 0 1-2-2V5.6a2 2 0 0 1 2-2h3.5M15.6 16.3l4.3-4.3-4.3-4.3M19.9 12H9.1"/></>,
  sun:         <><circle cx="12" cy="12" r="4.15"/><path d="M12 2.8v2.1M12 19.1v2.1M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M2.8 12h2.1M19.1 12h2.1M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5"/></>,
  moon:        <><path d="M20.5 14.3A8.55 8.55 0 0 1 9.7 3.5a8.55 8.55 0 1 0 10.8 10.8Z"/></>,
  chevronDown: <><path d="m6.2 9.4 5.8 5.8 5.8-5.8"/></>,
  chevronUp:   <><path d="m6.2 14.6 5.8-5.8 5.8 5.8"/></>,
  chevronRight:<><path d="m9.4 6.2 5.8 5.8-5.8 5.8"/></>,
  chevronLeft: <><path d="M14.6 6.2 8.8 12l5.8 5.8"/></>,
  arrowRight:  <><path d="M4.4 12h15.2M13.4 5.8l6.2 6.2-6.2 6.2"/></>,
  arrowLeft:   <><path d="M19.6 12H4.4M10.6 5.8 4.4 12l6.2 6.2"/></>,
  link:        <><path d="M10.1 13.6a4.05 4.05 0 0 0 5.72 0l2.87-2.87a4.05 4.05 0 0 0-5.73-5.73l-1.62 1.62"/><path d="M13.9 10.4a4.05 4.05 0 0 0-5.72 0L5.31 13.27a4.05 4.05 0 0 0 5.73 5.73l1.62-1.62"/></>,
};

export const Icon = ({name, size=18, stroke=1.7, style, title}) => {
  const body = ICON_PATHS[name];
  if (!body) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden={title?undefined:true}
      role={title?"img":undefined} focusable="false"
      style={{flexShrink:0,display:"block",...style}}>
      {title && <title>{title}</title>}
      {body}
    </svg>
  );
};

/* Every emoji the app previously rendered, mapped onto the set above. Lets the
   shared primitives swap glyphs centrally instead of at 300+ call sites.       */
export const EMOJI_ICON = {
  "📋":"clipboard", "⚠️":"warning", "⚠":"warning", "✅":"checkCircle", "🏥":"hospital",
  "💰":"money", "📊":"chartBar", "🏦":"bank", "🛡":"shield", "🛡️":"shield",
  "📄":"document", "📍":"pin", "📅":"calendar", "📆":"calendar", "🤝":"briefcase",
  "👥":"users", "👤":"user", "🕐":"clock", "🖨️":"printer", "🖨":"printer",
  "🪪":"idCard", "📈":"trendingUp", "🔍":"search", "🔐":"lock", "💷":"pound",
  "🧾":"receipt", "🏅":"award", "📁":"folder", "➕":"plus", "🌐":"globe",
  "🚨":"siren", "⭐":"star", "🔮":"forecast", "🗂":"archive", "🗂️":"archive",
  "📧":"mail", "✉️":"mail", "⛔":"ban", "🚫":"ban", "📚":"book", "📎":"paperclip",
  "🏢":"building", "🏆":"trophy", "⚡":"bolt", "🎉":"sparkle", "⏱":"timer", "⏱️":"timer",
  "🛏":"bed", "🛏️":"bed", "📞":"phone", "📝":"edit", "💾":"save", "🔔":"bell",
  "🔄":"refresh", "⬇":"download", "🚀":"rocket", "🥧":"chartPie", "💉":"medical",
  "ℹ️":"info", "📢":"megaphone", "🚩":"flag", "✋":"hand", "⏳":"hourglass",
  "🗑":"trash", "🗑️":"trash", "💬":"message", "⚕️":"medical", "◈":"grid",
};

/* Accepts an icon name, a legacy emoji, or a ready-made node. */
export const renderIcon = (icon, size=18, style) => {
  if (!icon) return null;
  if (typeof icon !== "string") return icon;
  const name = ICON_PATHS[icon] ? icon : EMOJI_ICON[icon.trim()];
  return name ? <Icon name={name} size={size} style={style}/> : null;
};
