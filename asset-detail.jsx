// ─── Drawer: Detalhe de ativo expandido ──────────────────────────────────────

// Histórico simulado de saúde (90 dias)
function generateHealthSeries(currentHealth) {
  const seed = Math.floor(currentHealth * 1000);
  const rand = (n) => {
    const x = Math.sin(seed + n) * 10000;
    return x - Math.floor(x);
  };
  const target = currentHealth;
  const data = [];
  let v = Math.min(0.98, target + 0.15);
  for (let i = 0; i < 90; i++) {
    const drift = (target - v) * 0.04;
    const noise = (rand(i) - 0.5) * 0.04;
    v = Math.max(0.2, Math.min(1, v + drift + noise));
    data.push(v);
  }
  // Garantir que último ponto bate com saúde atual
  data[data.length - 1] = target;
  return data;
}

// Eventos do timeline (90 dias) — gerados a partir do ativo
function generateEvents(asset) {
  const base = [
    { day: 0,  kind: "alert", title: "Vibração acima do limiar", note: "Sensor S-A12 · 6,8 mm/s" },
    { day: 8,  kind: "wo",    title: `OS-${4500 + (asset.id.charCodeAt(0) % 30)} concluída`, note: "Lubrificação preventiva · 2,4 h" },
    { day: 22, kind: "insp",  title: "Inspeção de rotina", note: "Termografia · sem ocorrências" },
    { day: 31, kind: "alert", title: "Temperatura motor elevada", note: "78 °C · normalizado em 12 min" },
    { day: 47, kind: "wo",    title: "Substituição de rolamento SKF 6308", note: "Corretiva planejada · J. Pereira" },
    { day: 58, kind: "insp",  title: "Análise de óleo", note: "Viscosidade dentro do esperado" },
    { day: 73, kind: "alert", title: "Pressão hidráulica baixa", note: "Filtro substituído" },
    { day: 89, kind: "wo",    title: "OS-4521 aberta", note: "Diagnóstico de vibração crítica" },
  ];
  return base;
}

// Componentes/sub-ativos simulados
const ASSET_COMPONENTS = {
  "EX-01": [
    { name: "Motor principal 75kW",        health: 0.74, last: "há 12 dias" },
    { name: "Redutor planetário",          health: 0.62, last: "há 28 dias" },
    { name: "Rosca extrusora Ø 90mm",     health: 0.81, last: "há 6 dias" },
    { name: "Sistema hidráulico",          health: 0.55, last: "há 4 dias" },
    { name: "Painel elétrico CCM-A",       health: 0.92, last: "há 45 dias" },
  ],
  "default": [
    { name: "Motor principal",        health: 0.85, last: "há 18 dias" },
    { name: "Sistema de transmissão", health: 0.78, last: "há 22 dias" },
    { name: "Painel de comando",      health: 0.94, last: "há 60 dias" },
    { name: "Sensores de vibração",   health: 0.88, last: "há 9 dias" },
  ],
};

function AssetDetailDrawer({ assetId, onClose, onOpenWO }) {
  const wrapRef = React.useRef(null);

  React.useEffect(() => {
    if (!assetId) return;
    const onEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [assetId, onClose]);

  if (!assetId) return null;
  const asset = ASSETS.find(a => a.id === assetId);
  if (!asset) return null;

  const series = generateHealthSeries(asset.health);
  const events = generateEvents(asset);
  const components = ASSET_COMPONENTS[asset.id] || ASSET_COMPONENTS.default;
  const tone = asset.health > 0.8 ? "good" : asset.health > 0.6 ? "warn" : "crit";
  const wos = WORK_ORDERS.filter(w => w.asset === asset.id);
  const openWos = wos.filter(w => w.status !== "concluída");

  return (
    <div className="ad-backdrop" onClick={onClose}>
      <aside className="ad-drawer" ref={wrapRef} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="ad-head">
          <div className="ad-head-l">
            <div className="ad-id mono">{asset.id}</div>
            <div className="ad-name">{asset.name}</div>
            <div className="ad-meta">
              <span>{asset.area}</span>
              <span className="dot-sep">·</span>
              <span>Criticidade <b>{asset.criticality}</b></span>
              <span className="dot-sep">·</span>
              <span>Instalado 2019</span>
            </div>
          </div>
          <div className="ad-head-r">
            <button className="btn btn-mini">{I.calendar}<span>Histórico completo</span></button>
            <button className="btn btn-mini">{I.tool}<span>Documentação</span></button>
            <button className="icon-btn" onClick={onClose} title="Fechar (Esc)">{I.close || "✕"}</button>
          </div>
        </div>

        <div className="ad-body scroll">
          {/* Status hero */}
          <div className="ad-hero">
            <HealthGauge value={asset.health} tone={tone} />
            <div className="ad-hero-stats">
              <ADStat label="Disponibilidade" value={`${asset.runtime}%`} bar={asset.runtime / 100} tone="accent" />
              <ADStat label="MTBF" value={`${asset.mtbf}h`} sub="Tempo médio entre falhas" mono />
              <ADStat label="MTTR" value={`${(2.4 + (1 - asset.health) * 2).toFixed(1)}h`} sub="Tempo médio de reparo" mono />
              <ADStat label="OS abertas" value={openWos.length} sub={openWos.length === 0 ? "Sem pendências" : `${openWos.filter(w => w.priority === "Crítica").length} crítica(s)`} mono />
            </div>
          </div>

          {/* Histórico de saúde (90 dias) */}
          <div className="ad-card">
            <div className="ad-card-h">
              <div>
                <strong>Saúde do ativo · 90 dias</strong>
                <span className="sub">Compósito de vibração, temperatura e pressão</span>
              </div>
              <div className="btn-group">
                <button className="btn btn-mini">30d</button>
                <button className="btn btn-mini" data-active="true">90d</button>
                <button className="btn btn-mini">12m</button>
              </div>
            </div>
            <div className="ad-chart-wrap">
              <HealthHistoryChart series={series} events={events} />
            </div>
            <div className="ad-chart-legend">
              <span className="ad-leg"><span className="ad-leg-dot" style={{ background: "var(--good)" }} />Saudável (≥80%)</span>
              <span className="ad-leg"><span className="ad-leg-dot" style={{ background: "var(--warn)" }} />Atenção (60–79%)</span>
              <span className="ad-leg"><span className="ad-leg-dot" style={{ background: "var(--crit)" }} />Crítico (&lt;60%)</span>
              <span className="ad-leg" style={{ marginLeft: "auto" }}>
                <span className="ad-leg-tick" /> Eventos no período: <b>{events.length}</b>
              </span>
            </div>
          </div>

          {/* Duas colunas: Componentes + Timeline */}
          <div className="ad-cols">
            {/* Componentes */}
            <div className="ad-card">
              <div className="ad-card-h">
                <strong>Sub-componentes</strong>
                <span className="sub">{components.length} monitorados</span>
              </div>
              <div className="ad-comp-list">
                {components.map((c) => {
                  const t = c.health > 0.8 ? "good" : c.health > 0.6 ? "warn" : "crit";
                  return (
                    <div key={c.name} className="ad-comp">
                      <div className="ad-comp-h">
                        <span className="ad-comp-name">{c.name}</span>
                        <span className="mono ad-comp-pct" data-tone={t}>{Math.round(c.health * 100)}%</span>
                      </div>
                      <div className="bar" data-tone={t}><i style={{ width: `${c.health * 100}%` }} /></div>
                      <div className="ad-comp-meta">Última inspeção · {c.last}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline */}
            <div className="ad-card">
              <div className="ad-card-h">
                <strong>Eventos recentes</strong>
                <span className="sub">90 dias</span>
              </div>
              <div className="ad-timeline">
                {events.slice().reverse().map((ev, i) => (
                  <div key={i} className="ad-tl-row" data-kind={ev.kind}>
                    <div className="ad-tl-marker">
                      <span className="ad-tl-dot" />
                      {i < events.length - 1 && <span className="ad-tl-line" />}
                    </div>
                    <div className="ad-tl-body">
                      <div className="ad-tl-h">
                        <span className="ad-tl-title">{ev.title}</span>
                        <span className="mono ad-tl-day">D-{89 - ev.day}</span>
                      </div>
                      <div className="ad-tl-note">{ev.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* OS deste ativo */}
          <div className="ad-card">
            <div className="ad-card-h">
              <strong>Ordens de serviço · {asset.id}</strong>
              <span className="sub">{wos.length} no histórico · {openWos.length} aberta(s)</span>
            </div>
            <table className="ad-wo-table">
              <thead>
                <tr>
                  <th>OS</th>
                  <th>Tipo</th>
                  <th>Prioridade</th>
                  <th>Status</th>
                  <th>Responsável</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {wos.length === 0 && (
                  <tr><td colSpan="6" className="ad-empty">Sem ordens de serviço para este ativo.</td></tr>
                )}
                {wos.map(w => (
                  <tr key={w.id}>
                    <td className="mono">{w.id}</td>
                    <td>{w.title}</td>
                    <td><span className="pill" data-tone={tonePriority(w.priority)}>{w.priority}</span></td>
                    <td><span className="pill pill-soft">{w.status}</span></td>
                    <td>
                      {w.assigneeName ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span className="avatar avatar-xs" style={{ background: TECHNICIANS.find(t => t.id === w.assignee)?.color }}>
                            {TECHNICIANS.find(t => t.id === w.assignee)?.initials}
                          </span>
                          <span style={{ fontSize: 12 }}>{w.assigneeName}</span>
                        </div>
                      ) : <span className="ink-3" style={{ fontSize: 12 }}>—</span>}
                    </td>
                    <td><button className="btn btn-mini" onClick={() => { onOpenWO(w.id); onClose(); }}>Abrir</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer com ações */}
        <div className="ad-foot">
          <div className="ad-foot-l">
            <span className="ink-3" style={{ fontSize: 11.5 }}>Última sincronização: há 2 min</span>
          </div>
          <div className="ad-foot-r">
            <button className="btn">{I.pause}<span>Sinalizar parada</span></button>
            <button className="btn">{I.calendar}<span>Agendar inspeção</span></button>
            <button className="btn btn-primary">{I.plus}<span>Abrir OS para este ativo</span></button>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ─── Subcomponentes ──────────────────────────────────────────────────────────

function HealthGauge({ value, tone }) {
  const pct = Math.round(value * 100);
  const r = 54;
  const c = 2 * Math.PI * r;
  const dash = c * value;
  const color = tone === "good" ? "var(--good)" : tone === "warn" ? "var(--warn)" : "var(--crit)";
  return (
    <div className="ad-gauge">
      <svg viewBox="0 0 140 140" width="140" height="140">
        <circle cx="70" cy="70" r={r} fill="none" stroke="var(--bg-3)" strokeWidth="10" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="10"
                strokeDasharray={`${dash} ${c}`}
                strokeLinecap="round"
                transform="rotate(-90 70 70)" />
      </svg>
      <div className="ad-gauge-center">
        <div className="ad-gauge-pct mono" style={{ color }}>{pct}<span>%</span></div>
        <div className="ad-gauge-label">Índice de saúde</div>
      </div>
    </div>
  );
}

function HealthHistoryChart({ series, events }) {
  const W = 800, H = 180;
  const padL = 32, padR = 12, padT = 12, padB = 22;
  const xStep = (W - padL - padR) / (series.length - 1);
  const yScale = (v) => H - padB - v * (H - padT - padB);

  // Construir path com cor por trecho
  const pts = series.map((v, i) => ({ x: padL + i * xStep, y: yScale(v), v }));
  const linePath = "M" + pts.map(p => `${p.x},${p.y}`).join(" L");
  const areaPath = `M${pts[0].x},${H - padB} L` + pts.map(p => `${p.x},${p.y}`).join(" L") + ` L${pts[pts.length-1].x},${H - padB} Z`;

  // Bandas de threshold
  const yGood = yScale(0.8);
  const yWarn = yScale(0.6);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" preserveAspectRatio="none">
      {/* Bandas */}
      <rect x={padL} y={padT} width={W - padL - padR} height={yGood - padT} fill="var(--good)" opacity="0.04" />
      <rect x={padL} y={yGood} width={W - padL - padR} height={yWarn - yGood} fill="var(--warn)" opacity="0.05" />
      <rect x={padL} y={yWarn} width={W - padL - padR} height={H - padB - yWarn} fill="var(--crit)" opacity="0.05" />

      {/* Linhas de threshold */}
      <line x1={padL} y1={yGood} x2={W - padR} y2={yGood} stroke="var(--good)" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5" />
      <line x1={padL} y1={yWarn} x2={W - padR} y2={yWarn} stroke="var(--crit)" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5" />

      {/* Y labels */}
      {[0, 0.5, 1].map((v, i) => (
        <g key={i}>
          <text x={padL - 6} y={yScale(v) + 3} fontSize="9" fill="currentColor" opacity="0.55"
                textAnchor="end" fontFamily="var(--font-mono)">{Math.round(v * 100)}%</text>
        </g>
      ))}

      {/* X labels (D-90 → hoje) */}
      {[0, 30, 60, 89].map(d => (
        <text key={d} x={padL + d * xStep} y={H - 6} fontSize="9.5" fill="currentColor" opacity="0.55" textAnchor="middle">
          {d === 89 ? "hoje" : `D-${89 - d}`}
        </text>
      ))}

      {/* Área */}
      <path d={areaPath} fill="var(--accent)" opacity="0.06" />
      {/* Linha */}
      <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />

      {/* Marcadores de eventos */}
      {events.map((ev, i) => {
        const x = padL + ev.day * xStep;
        const y = yScale(series[ev.day]);
        const c = ev.kind === "alert" ? "var(--crit)" : ev.kind === "wo" ? "var(--info)" : "var(--good)";
        return (
          <g key={i}>
            <line x1={x} y1={padT} x2={x} y2={H - padB} stroke={c} strokeWidth="0.5" opacity="0.18" />
            <circle cx={x} cy={y} r="3.5" fill="var(--surface)" stroke={c} strokeWidth="1.5" />
          </g>
        );
      })}

      {/* Ponto atual */}
      <circle cx={pts[pts.length - 1].x} cy={pts[pts.length - 1].y}
              r="4.5" fill="var(--accent)" stroke="var(--surface)" strokeWidth="2" />
    </svg>
  );
}

function ADStat({ label, value, sub, bar, tone, mono }) {
  return (
    <div className="ad-stat">
      <div className="ad-stat-label">{label}</div>
      <div className={`ad-stat-value ${mono ? "mono" : ""}`}>{value}</div>
      {bar != null && <div className="bar" data-tone={tone}><i style={{ width: `${bar * 100}%` }} /></div>}
      {sub && <div className="ad-stat-sub">{sub}</div>}
    </div>
  );
}

window.AssetDetailDrawer = AssetDetailDrawer;
