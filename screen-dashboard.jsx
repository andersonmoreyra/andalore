// ─── Tela: Sala de Controle (Dashboard) ──────────────────────────────────────

function Sparkline({ values, width, height }) {
  if (!values || values.length === 0) return null;
  
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const tonePriority = (p) =>
  p === "crítica" ? "crit" : p === "alta" ? "warn" : p === "média" ? "info" : "good";

const toneType = (t) =>
  t === "corretiva" ? "crit" : t === "preventiva" ? "info" : t === "preditiva" ? "pred" : "good";

const statusLabel = {
  "executando": { label: "Executando", tone: "info" },
  "deslocando": { label: "Em deslocamento", tone: "warn" },
  "aguardando peça": { label: "Aguardando peça", tone: "warn" },
  "aberta": { label: "Aberta", tone: "neutral" },
  "concluída": { label: "Concluída", tone: "good" },
};

function fmtMin(m) {
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h > 0 ? `${h}h${String(r).padStart(2, "0")}` : `${r}min`;
}

// ─── Componente: faixa de técnico no timeline ────────────────────────────────
// Visualização diferenciada: cada técnico é uma linha, OS ocupam blocos no tempo

function ShiftTimeline() {
  const HOURS = [6, 7, 8, 9, 10, 11, 12, 13, 14];
  const start = 6, end = 14;
  const NOW = 9 + 26 / 60; // 09:26
  const pct = (h) => `${((h - start) / (end - start)) * 100}%`;

  // Mapa OS por técnico — com timing realista
  const blocks = {
    T01: [{ s: 6, e: 9.5, wo: "OS-2841", title: "Subst. cilindro Flexo 1", tone: "info" }],
    T02: [{ s: 8.25, e: 9.25, wo: "OS-2847", title: "Calibração CP-01", tone: "pred" },
          { s: 10, e: 12, wo: "—", title: "Janela livre", tone: "ghost" }],
    T03: [{ s: 6.2, e: 8.4, wo: "OS-2839", title: "Vibração eixo EX-01", tone: "crit" },
          { s: 8.5, e: 11, wo: "OS-2832", title: "Vazamento CT-02", tone: "warn" }],
    T04: [{ s: 6, e: 7, wo: "—", title: "Reunião turno", tone: "ghost" },
          { s: 7, e: 14, wo: "—", title: "Disponível", tone: "free" }],
    T05: [{ s: 6, e: 9, wo: "—", title: "Folga programada", tone: "ghost" },
          { s: 9, e: 9.5, wo: "—", title: "Pausa", tone: "ghost" }],
    T06: [{ s: 7.8, e: 10, wo: "OS-2845", title: "Curto painel EX-02", tone: "crit" }],
    T07: [{ s: 7, e: 8.5, wo: "OS-2842", title: "Lubrif. Cortadeira 01", tone: "info" }],
    T08: [{ s: 6, e: 14, wo: "—", title: "Disponível", tone: "free" }],
  };

  return (
    <div className="card timeline">
      <div className="card-hd">
        <span>Timeline do turno</span>
        <span className="sub mono">{HOURS[0]}:00 — {HOURS[HOURS.length-1]}:00</span>
      </div>
      <div className="timeline-grid">
        {/* Cabeçalho de horas */}
        <div className="tl-header">
          <div className="tl-tech-cell" />
          <div className="tl-track tl-hours">
            {HOURS.map((h) => (
              <div key={h} className="tl-tick" style={{ left: pct(h) }}>
                <span className="mono">{String(h).padStart(2, "0")}:00</span>
              </div>
            ))}
          </div>
        </div>
        {/* Linhas dos técnicos */}
        {TECHNICIANS.map((t) => (
          <div key={t.id} className="tl-row">
            <div className="tl-tech-cell">
              <div className="tl-tech-dot" style={{ background: t.color }}>{t.initials}</div>
              <div className="tl-tech-info">
                <div className="tl-tech-name">{t.name}</div>
                <div className="tl-tech-role">{t.especialidade}</div>
              </div>
            </div>
            <div className="tl-track">
              {/* Linhas de grade */}
              {HOURS.map((h) => (
                <div key={h} className="tl-grid-line" style={{ left: pct(h) }} />
              ))}
              {/* Blocos de OS */}
              {(blocks[t.id] || []).map((b, i) => (
                <div key={i} className={`tl-block tl-${b.tone}`}
                     style={{ left: pct(b.s), width: `calc(${pct(b.e)} - ${pct(b.s)})` }}
                     title={`${b.wo} · ${b.title}`}>
                  <span className="tl-block-wo mono">{b.wo}</span>
                  <span className="tl-block-title">{b.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        {/* Indicador "agora" */}
        <div className="tl-now" style={{ left: `calc(220px + ${pct(NOW)} * (100% - 220px) / 100%)` }}>
          <span className="mono">09:26</span>
        </div>
      </div>
    </div>
  );
}

// ─── Cards superiores ────────────────────────────────────────────────────────

function CriticalAlerts({ onOpenWO }) {
  const critical = WORK_ORDERS.filter(w => w.priority === "crítica" || (w.priority === "alta" && w.sla > 0.7));
  return (
    <div className="card alert-card">
      <div className="card-hd">
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "var(--crit)" }}>{I.flame}</span>
          Crítico agora
        </span>
        <span className="sub">{critical.length} OS</span>
      </div>
      <div className="alert-list">
        {critical.map((w) => (
          <button key={w.id} className="alert-row" onClick={() => onOpenWO(w.id)}>
            <div className="alert-row-l">
              <span className="pill" data-tone={tonePriority(w.priority)}>
                <span className="dot" />{w.priority}
              </span>
              <span className="mono alert-id">{w.id}</span>
              <span className="alert-title">{w.title}</span>
            </div>
            <div className="alert-row-r">
              <span className="alert-asset mono">{w.asset}</span>
              <div className="bar bar-sm" data-tone={w.sla > 0.7 ? "crit" : "warn"}>
                <i style={{ width: `${w.sla * 100}%` }} />
              </div>
              <span className="alert-sla mono">{Math.round(w.sla * 100)}%</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function AssetHealthMatrix() {
  const areas = [...new Set(ASSETS.map(a => a.area))];
  return (
    <div className="card">
      <div className="card-hd">
        <span>Saúde dos ativos</span>
        <span className="sub">por área · saúde × criticidade</span>
      </div>
      <div className="health-matrix">
        {areas.map((area) => (
          <div key={area} className="health-area">
            <div className="health-area-label">{area}</div>
            <div className="health-cells">
              {ASSETS.filter(a => a.area === area).map((a) => {
                const tone = a.health > 0.8 ? "good" : a.health > 0.6 ? "warn" : "crit";
                return (
                  <div key={a.id} className="health-cell" data-tone={tone}
                       data-crit={a.criticality}
                       title={`${a.name} · saúde ${Math.round(a.health*100)}% · MTBF ${a.mtbf}h`}>
                    <span className="health-cell-id mono">{a.id}</span>
                    <span className="health-cell-bar">
                      <i style={{ width: `${a.health * 100}%` }} />
                    </span>
                    <span className="health-cell-crit">{a.criticality}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        <div className="health-legend">
          <span className="legend-dot" data-tone="good" /> ≥ 80%
          <span className="legend-dot" data-tone="warn" /> 60–80%
          <span className="legend-dot" data-tone="crit" /> &lt; 60%
          <span style={{ marginLeft: "auto", color: "var(--ink-3)" }}>A · B · C = criticidade</span>
        </div>
      </div>
    </div>
  );
}

function ActivityFeed() {
  const tagTone = {
    "alta": "warn", "preditivo": "pred", "exec": "info",
    "estoque": "good", "solic": "neutral", "alerta": "crit",
  };
  return (
    <div className="card">
      <div className="card-hd">
        <span>Atividade ao vivo</span>
        <span className="sub mono">turno A</span>
      </div>
      <div className="activity-feed scroll">
        {ACTIVITY.map((a, i) => (
          <div key={i} className="activity-row">
            <span className="activity-time mono">{a.time}</span>
            <span className="pill" data-tone={tagTone[a.tag] || "neutral"}>{a.tag}</span>
            <span className="activity-text">
              <strong>{a.who}</strong> {a.what}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RequestsQueue({ onConvert }) {
  return (
    <div className="card">
      <div className="card-hd">
        <span>Solicitações abertas</span>
        <span className="sub">{REQUESTS.length} aguardando triagem</span>
      </div>
      <div className="request-list">
        {REQUESTS.map((r) => (
          <div key={r.id} className="request-row">
            <div className="request-head">
              <span className="mono request-id">{r.id}</span>
              <span className="pill" data-tone={tonePriority(r.priority)}>{r.priority}</span>
              <span className="mono request-time">{r.time}</span>
            </div>
            <div className="request-title">{r.title}</div>
            <div className="request-meta">
              <span>{r.from}</span>
              <span>·</span>
              <span className="mono">{r.asset}</span>
              <button className="btn btn-mini" onClick={() => onConvert(r.id)}>
                Triar →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Strip de KPIs com sparkline (refino do dashboard) ───────────────────────

function DashKpiStrip({ onNavReports }) {
  // Séries de tendência (últimos 14 turnos) — minicompleta
  const kpis = [
    { label: "OS abertas hoje",     value: "18",     delta: "+3",     trend: "up",   tone: "info",
      series: [12, 14, 13, 15, 14, 16, 17, 15, 16, 18, 17, 19, 18, 18], color: "var(--info)" },
    { label: "Críticas",            value: "3",      delta: "+1",     trend: "up",   tone: "crit",
      series: [1, 2, 1, 2, 3, 2, 2, 1, 2, 3, 2, 4, 3, 3], color: "var(--crit)" },
    { label: "Aderência ao plano",  value: "87%",    delta: "+4 pp",  trend: "up",   tone: "good",
      series: [78, 80, 79, 82, 81, 83, 82, 84, 85, 83, 84, 86, 85, 87], color: "var(--good)" },
    { label: "MTTR (turno)",        value: "2h24",   delta: "−18min", trend: "down", tone: "good",
      series: [3.2, 3.0, 3.1, 2.9, 2.8, 2.7, 2.9, 2.6, 2.5, 2.6, 2.5, 2.4, 2.4, 2.4], color: "var(--accent)" },
    { label: "Disp. dos ativos",    value: "94,2%",  delta: "+0,4 pp", trend: "up",  tone: "good",
      series: [92.8, 93.0, 92.9, 93.2, 93.4, 93.1, 93.5, 93.6, 93.8, 93.7, 93.9, 94.0, 94.1, 94.2], color: "var(--preditivo)" },
    { label: "Backlog (h)",          value: "42h",    delta: "−6h",    trend: "down", tone: "good",
      series: [56, 54, 55, 52, 51, 50, 48, 49, 47, 46, 45, 44, 43, 42], color: "var(--warn)" },
  ];
  return (
    <div className="dash-kpi-strip">
      {kpis.map((k) => (
        <button key={k.label} className="dash-kpi" onClick={onNavReports}>
          <div className="dash-kpi-h">
            <span className="dash-kpi-label">{k.label}</span>
            <span className="pill" data-tone={k.tone}>
              {k.trend === "up" ? "↑" : "↓"} {k.delta}
            </span>
          </div>
          <div className="dash-kpi-v">
            <span className="mono">{k.value}</span>
          </div>
          <div className="dash-kpi-spark" style={{ color: k.color }}>
            <Sparkline values={k.series} width={200} height={28} />
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Tela completa: Dashboard ────────────────────────────────────────────────

function DashboardScreen({ onOpenWO, onNav }) {
  return (
    <div className="screen-pad scroll">
      <div className="screen-head">
        <div>
          <h1 className="screen-title">Sala de controle</h1>
          <p className="screen-sub">Visão consolidada do turno · atualizado há 12s</p>
        </div>
        <div className="screen-actions">
          <button className="btn">{I.download}<span>Exportar turno</span></button>
          <button className="btn btn-primary"
                  onClick={() => window.dispatchEvent(new Event("__open_new_wo"))}>
            {I.plus}<span>Nova OS</span>
          </button>
        </div>
      </div>

      <DashKpiStrip onNavReports={() => onNav && onNav("relatorios")} />

      <div className="dash-grid">
        <div className="dash-row dash-row-1">
          <CriticalAlerts onOpenWO={onOpenWO} />
          <ActivityFeed />
        </div>
        <div className="dash-row dash-row-2">
          <ShiftTimeline />
        </div>
        <div className="dash-row dash-row-3">
          <AssetHealthMatrix />
          <RequestsQueue onConvert={() => {}} />
        </div>
      </div>
    </div>
  );
}

window.DashboardScreen = DashboardScreen;
window.tonePriority = tonePriority;
window.toneType = toneType;
window.statusLabel = statusLabel;
window.fmtMin = fmtMin;
