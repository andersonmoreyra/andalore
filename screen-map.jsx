// ─── Tela: Mapa de ativos / planta ───────────────────────────────────────────

function PlantMapScreen({ onOpenWO }) {
  const [hover, setHover] = React.useState(null);
  const [selected, setSelected] = React.useState("EX-01");
  const [tab, setTab] = React.useState("map");

  // Posições aproximadas dos ativos no layout da planta (% relativo)
  const positions = {
    "EX-01": { x: 12, y: 22, w: 13, h: 18 },
    "EX-02": { x: 28, y: 22, w: 13, h: 18 },
    "EX-03": { x: 44, y: 22, w: 13, h: 18 },
    "IM-01": { x: 12, y: 50, w: 17, h: 14 },
    "IM-02": { x: 32, y: 50, w: 17, h: 14 },
    "CT-01": { x: 60, y: 22, w: 14, h: 12 },
    "CT-02": { x: 60, y: 38, w: 14, h: 12 },
    "RB-01": { x: 60, y: 54, w: 14, h: 12 },
    "CP-01": { x: 80, y: 22, w: 14, h: 14 },
    "CL-01": { x: 80, y: 40, w: 14, h: 12 },
    "PT-01": { x: 12, y: 72, w: 36, h: 14 },
  };

  const sel = ASSETS.find(a => a.id === selected);
  const selWOs = WORK_ORDERS.filter(w => w.asset === selected && w.status !== "concluída");

  return (
    <div className="screen-pad map-screen">
      <div className="screen-head">
        <div>
          <h1 className="screen-title">{tab === "map" ? "Planta · Vinhedo" : "Árvore de ativos"}</h1>
          <p className="screen-sub">
            {tab === "map" ? "11 ativos monitorados · clique para inspecionar" : "Cadastro hierárquico — Planta › Área › Linha › Equipamento › Componente"}
          </p>
        </div>
        <div className="screen-actions">
          <div className="btn-group">
            <button className="btn" data-no-toast="true" data-active={tab === "map"} onClick={() => setTab("map")}>Mapa</button>
            <button className="btn" data-no-toast="true" data-active={tab === "tree"} onClick={() => setTab("tree")}>Árvore</button>
          </div>
        </div>
      </div>

      {tab === "tree" && <AssetTree onJumpMap={() => setTab("map")} />}
      {tab === "map" && (<>
      </>)}
      {tab === "map" && (
      <div className="map-grid">
        {/* Mapa */}
        <div className="map-canvas">
          {/* Grid de fundo */}
          <svg className="map-bg" viewBox="0 0 100 100" preserveAspectRatio="none">
            {Array.from({ length: 11 }, (_, i) => (
              <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100"
                    stroke="currentColor" strokeWidth="0.1" opacity="0.3" />
            ))}
            {Array.from({ length: 11 }, (_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10}
                    stroke="currentColor" strokeWidth="0.1" opacity="0.3" />
            ))}
          </svg>

          {/* Etiquetas de área */}
          <div className="map-area-label" style={{ left: "12%", top: "12%" }}>EXTRUSÃO</div>
          <div className="map-area-label" style={{ left: "12%", top: "44%" }}>IMPRESSÃO</div>
          <div className="map-area-label" style={{ left: "60%", top: "12%" }}>ACABAMENTO</div>
          <div className="map-area-label" style={{ left: "80%", top: "12%" }}>UTILIDADES</div>
          <div className="map-area-label" style={{ left: "12%", top: "66%" }}>EXPEDIÇÃO</div>

          {/* Ativos */}
          {ASSETS.map((a) => {
            const p = positions[a.id];
            if (!p) return null;
            const tone = a.health > 0.8 ? "good" : a.health > 0.6 ? "warn" : "crit";
            const hasWO = WORK_ORDERS.some(w => w.asset === a.id && (w.status === "executando" || w.status === "aguardando peça"));
            return (
              <button key={a.id} className="map-asset"
                      data-tone={tone}
                      data-active={selected === a.id}
                      style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, height: `${p.h}%` }}
                      onClick={() => setSelected(a.id)}
                      onMouseEnter={() => setHover(a.id)}
                      onMouseLeave={() => setHover(null)}>
                <span className="map-asset-id mono">{a.id}</span>
                <span className="map-asset-name">{a.name}</span>
                <span className="map-asset-bar">
                  <i style={{ width: `${a.health * 100}%` }} />
                </span>
                {hasWO && <span className="map-asset-badge">{I.tool}</span>}
              </button>
            );
          })}
        </div>

        {/* Painel lateral */}
        <div className="map-side scroll">
          {sel && (
            <>
              <div className="map-side-head">
                <div className="map-side-id mono">{sel.id}</div>
                <div className="map-side-name">{sel.name}</div>
                <div className="map-side-area">{sel.area} · Criticidade {sel.criticality}</div>
              </div>

              <div className="map-stats">
                <Stat label="Saúde" value={`${Math.round(sel.health * 100)}%`}
                      bar={sel.health}
                      tone={sel.health > 0.8 ? "good" : sel.health > 0.6 ? "warn" : "crit"} />
                <Stat label="Disponibilidade" value={`${sel.runtime}%`} bar={sel.runtime / 100} tone="accent" />
                <Stat label="MTBF" value={`${sel.mtbf}h`} mono />
              </div>

              <div className="map-section">
                <div className="map-section-label">OS ativas ({selWOs.length})</div>
                {selWOs.length === 0 ? (
                  <div className="ink-3" style={{ fontSize: 12 }}>Nenhuma OS aberta.</div>
                ) : selWOs.map((w) => (
                  <button key={w.id} className="map-wo" onClick={() => onOpenWO(w.id)}>
                    <div className="map-wo-h">
                      <span className="mono">{w.id}</span>
                      <span className="pill" data-tone={tonePriority(w.priority)}>{w.priority}</span>
                    </div>
                    <div className="map-wo-title">{w.title}</div>
                    {w.assigneeName && (
                      <div className="map-wo-meta">
                        <span className="avatar avatar-xs"
                              style={{ background: TECHNICIANS.find(t => t.id === w.assignee)?.color }}>
                          {TECHNICIANS.find(t => t.id === w.assignee)?.initials}
                        </span>
                        <span>{w.assigneeName}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="map-section">
                <div className="map-section-label">Ações rápidas</div>
                <div className="map-actions">
                  <button className="btn btn-primary">{I.plus}<span>Abrir OS</span></button>
                  <button className="btn"
                          onClick={() => window.dispatchEvent(new CustomEvent("__open_asset", { detail: sel.id }))}>
                    {I.calendar}<span>Ver detalhes completos</span>
                  </button>
                  <button className="btn">{I.pause}<span>Sinalizar parada</span></button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      )}
    </div>
  );
}

function Stat({ label, value, bar, tone, mono }) {
  return (
    <div className="map-stat">
      <div className="map-stat-label">{label}</div>
      <div className={`map-stat-value ${mono ? "mono" : ""}`}>{value}</div>
      {bar != null && (
        <div className="bar" data-tone={tone}><i style={{ width: `${bar * 100}%` }} /></div>
      )}
    </div>
  );
}

window.PlantMapScreen = PlantMapScreen;
