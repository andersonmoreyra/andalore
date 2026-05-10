// ─── Shell: topbar + sidebar ────────────────────────────────────────────────

const NOTIFICATIONS = [
  {
    id: 1, kind: "crit", time: "há 4 min",
    title: "Vibração crítica · Extrusora 01",
    body: "Sensor S-A12 ultrapassou 7,2 mm/s. Recomendado parada controlada.",
    actor: "Sistema preditivo",
    actions: ["Abrir OS", "Inspecionar ativo"],
    unread: true,
  },
  {
    id: 2, kind: "warn", time: "há 12 min",
    title: "OS #4521 fora do SLA",
    body: "Cortadeira 02 — atribuída a Carlos Mendes. Atraso de 38 min.",
    actor: "SLA monitor",
    actions: ["Reatribuir", "Ver OS"],
    unread: true,
  },
  {
    id: 3, kind: "info", time: "há 28 min",
    title: "Solicitação aprovada",
    body: "Compra emergencial de rolamento SKF 6308 liberada por F. Almeida.",
    actor: "Aprovação",
    actions: ["Ver pedido"],
    unread: true,
  },
  {
    id: 4, kind: "good", time: "há 1 h",
    title: "OS #4519 concluída",
    body: "Lubrificação preventiva da Impressora Flexo 1 finalizada por J. Pereira.",
    actor: "Equipe",
    actions: ["Ver registro"],
    unread: false,
  },
  {
    id: 5, kind: "info", time: "há 2 h",
    title: "Plano semanal atualizado",
    body: "12 OS preventivas reagendadas para a próxima semana.",
    actor: "Planejamento",
    actions: ["Ver agenda"],
    unread: false,
  },
  {
    id: 6, kind: "warn", time: "há 3 h",
    title: "Ruptura de estoque",
    body: "Filtro hidráulico HF-204 abaixo do mínimo (3 un.).",
    actor: "Estoque",
    actions: ["Solicitar"],
    unread: false,
  },
];

function TopBar({ accent }) {
  const [notifOpen, setNotifOpen] = React.useState(false);
  const [notifFilter, setNotifFilter] = React.useState("all");
  const [items, setItems] = React.useState(NOTIFICATIONS);
  const wrapRef = React.useRef(null);

  React.useEffect(() => {
    if (!notifOpen) return;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setNotifOpen(false);
    };
    const onEsc = (e) => { if (e.key === "Escape") setNotifOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [notifOpen]);

  const unread = items.filter(n => n.unread).length;
  const filtered = items.filter(n => {
    if (notifFilter === "all") return true;
    if (notifFilter === "unread") return n.unread;
    return n.kind === notifFilter;
  });
  const markAll = () => setItems(items.map(n => ({ ...n, unread: false })));
  const markOne = (id) => setItems(items.map(n => n.id === id ? { ...n, unread: false } : n));

  return (
    <div className="topbar">
      <div className="topbar-brand">
        <div className="topbar-brand-mark"><BrandMark size={14} /></div>
      </div>
      <div className="topbar-context">
        <strong>{PLANT.name}</strong>
        <span className="ctx-shift">·</span>
        <span className="ctx-shift">{PLANT.shift}</span>
        <span className="ctx-date">·</span>
        <span className="ctx-date mono">{PLANT.date}</span>
      </div>
      <div className="topbar-kpis">
        {KPIS.map((k, i) => (
          <div key={k.label} className="kpi-chip" data-tone={k.tone}
               data-priority={i < 3 ? 1 : i < 5 ? 2 : 3}>
            <span className="kpi-chip-label">{k.label}</span>
            <span className="kpi-chip-value">
              <b>{k.value}</b>
              <span className="kpi-chip-delta">
                {k.trend === "up" ? "↑" : "↓"} {k.delta}
              </span>
            </span>
          </div>
        ))}
      </div>
      <div className="topbar-actions" ref={wrapRef}>
        <button className="icon-btn" title="Buscar (⌘K)" data-no-toast="true"
                onClick={() => window.dispatchEvent(new Event("__open_command_palette"))}>{I.search}</button>
        <button className="icon-btn" title="Notificações" data-no-toast="true"
                data-active={notifOpen}
                onClick={() => setNotifOpen(!notifOpen)}>
          {I.bell}
          {unread > 0 && <span className="bell-badge">{unread}</span>}
        </button>
        <div className="avatar" style={{ background: accent }}>FA</div>

        {notifOpen && (
          <div className="notif-pop" role="dialog">
            <div className="notif-pop-h">
              <div>
                <strong>Notificações</strong>
                <span className="sub">{unread} não lidas</span>
              </div>
              <button className="btn btn-mini" onClick={markAll}>Marcar todas como lidas</button>
            </div>
            <div className="notif-pop-tabs">
              {[
                { id: "all", label: "Todas" },
                { id: "unread", label: `Não lidas (${unread})` },
                { id: "crit", label: "Críticas" },
                { id: "warn", label: "Atenção" },
              ].map(t => (
                <button key={t.id} className="notif-tab"
                        data-active={notifFilter === t.id}
                        onClick={() => setNotifFilter(t.id)}>{t.label}</button>
              ))}
            </div>
            <div className="notif-pop-list scroll">
              {filtered.length === 0 && (
                <div className="notif-empty">Nada por aqui.</div>
              )}
              {filtered.map(n => (
                <div key={n.id} className="notif-row" data-unread={n.unread} data-tone={n.kind}>
                  <span className="notif-dot" />
                  <div className="notif-body">
                    <div className="notif-row-h">
                      <span className="notif-title">{n.title}</span>
                      <span className="notif-time">{n.time}</span>
                    </div>
                    <div className="notif-text">{n.body}</div>
                    <div className="notif-foot">
                      <span className="notif-actor">{n.actor}</span>
                      <div className="notif-actions">
                        {n.actions.map(a => (
                          <button key={a} className="btn-link" onClick={() => markOne(n.id)}>{a}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="notif-pop-foot">
              <button className="btn-link">Ver todas</button>
              <button className="btn-link">Configurar alertas</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Sidebar({ active, onChange }) {
  const items = [
    { id: "dashboard",   icon: I.dashboard, label: "Sala de controle" },
    { id: "ordens",      icon: I.list,      label: "Ordens de serviço", badge: 18 },
    { id: "agenda",      icon: I.calendar,  label: "Agenda do turno" },
    { id: "ativos",      icon: I.asset,     label: "Ativos & planta" },
    { id: "equipe",      icon: I.team,      label: "Equipe" },
    { id: "solicitacoes",icon: I.request,   label: "Solicitações", badge: 4 },
    { id: "estoque",     icon: I.parts,     label: "Estoque" },
    { id: "relatorios",  icon: I.reports,   label: "Relatórios" },
  ];
  return (
    <aside className="sidebar">
      {items.map((it) => (
        <button key={it.id} className="nav-item"
                data-active={active === it.id}
                onClick={() => onChange(it.id)}>
          {it.icon}
          {it.badge && <span className="badge">{it.badge}</span>}
          <span className="nav-tip">{it.label}</span>
        </button>
      ))}
      <div className="nav-spacer" />
      <button className="nav-item"><span className="nav-tip">Configurações</span>{I.settings}</button>
    </aside>
  );
}

window.TopBar = TopBar;
window.Sidebar = Sidebar;
