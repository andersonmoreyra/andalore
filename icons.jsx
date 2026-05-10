// Ícones SVG inline — desenhados com cuidado, traços leves, ar industrial
// Padrão: 18px viewbox, stroke 1.5

const Icon = ({ d, size = 18, fill = false, stroke = "currentColor", sw = 1.5, viewBox = "0 0 24 24", children }) => (
  <svg width={size} height={size} viewBox={viewBox} fill="none"
       stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d} /> : children}
  </svg>
);

// Ícone "M" da marca — desenhado em SVG
const BrandMark = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 19V5h2.5l4 9 4-9H17v14h-2.5v-9l-3.5 8h-1.5l-3.5-8v9H4z" fill="currentColor" />
  </svg>
);

const I = {
  dashboard: <Icon><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></Icon>,
  list: <Icon><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></Icon>,
  calendar: <Icon><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></Icon>,
  map: <Icon><path d="M9 4 3 7v13l6-3 6 3 6-3V4l-6 3-6-3zM9 4v13M15 7v13"/></Icon>,
  team: <Icon><circle cx="9" cy="8" r="3.5"/><path d="M2 20a7 7 0 0 1 14 0"/><circle cx="17" cy="6.5" r="2.5"/><path d="M16 13a5.5 5.5 0 0 1 6 5"/></Icon>,
  parts: <Icon><path d="M3 8.5 12 4l9 4.5v7L12 20l-9-4.5v-7zM12 4v8M3 8.5 12 12l9-3.5"/></Icon>,
  reports: <Icon><path d="M4 19V5M4 19h16M8 15v-3M12 15V8M16 15v-6"/></Icon>,
  settings: <Icon><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></Icon>,
  bell: <Icon><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9zM10 21a2 2 0 0 0 4 0"/></Icon>,
  search: <Icon><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></Icon>,
  filter: <Icon><path d="M3 5h18l-7 8v6l-4 2v-8L3 5z"/></Icon>,
  plus: <Icon><path d="M12 5v14M5 12h14"/></Icon>,
  alert: <Icon><path d="M12 3 2 20h20L12 3zM12 9v5M12 17.5v.5"/></Icon>,
  check: <Icon><path d="m5 12 5 5L20 7"/></Icon>,
  clock: <Icon><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>,
  arrowRight: <Icon><path d="M5 12h14M13 5l7 7-7 7"/></Icon>,
  arrowUp: <Icon><path d="M12 19V5M5 12l7-7 7 7"/></Icon>,
  arrowDown: <Icon><path d="M12 5v14M19 12l-7 7-7-7"/></Icon>,
  more: <Icon><circle cx="5" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="19" cy="12" r="1.5" fill="currentColor"/></Icon>,
  pin: <Icon><path d="M12 2v6l-4 4v3h8v-3l-4-4M12 15v7"/></Icon>,
  tool: <Icon><path d="m14.7 6.3 3 3a2 2 0 0 1 0 2.8l-9.4 9.4-5.6 1.1 1.1-5.6 9.4-9.4a2 2 0 0 1 2.8 0zM13 8l3 3"/></Icon>,
  flame: <Icon><path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-3-10 0 0-2 1-3 4-1-2-3-3-3-3-1 4-4 5-4 9a7 7 0 0 0 6 7z"/></Icon>,
  zap: <Icon><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></Icon>,
  pause: <Icon><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></Icon>,
  play: <Icon><path d="M6 4 20 12 6 20V4z" fill="currentColor"/></Icon>,
  trending: <Icon><path d="m3 17 6-6 4 4 8-8M14 7h7v7"/></Icon>,
  download: <Icon><path d="M12 3v13M6 12l6 6 6-6M4 21h16"/></Icon>,
  asset: <Icon><rect x="3" y="9" width="18" height="12" rx="1.5"/><path d="M7 9V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4M9 14h6"/></Icon>,
  request: <Icon><path d="M3 7h18v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7zM3 7l3-4h12l3 4M9 12h6"/></Icon>,
};

window.I = I;
window.BrandMark = BrandMark;

// Ícones adicionais
I.edit = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
I.trash = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
