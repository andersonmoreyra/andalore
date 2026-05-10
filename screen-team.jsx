// ─── Tela: Equipe ────────────────────────────────────────────────────────────

function TeamScreen() {
  const statusTone = {
    "executando": "info",
    "deslocando": "warn",
    "disponível": "good",
    "pausa": "neutral",
  };

  return (
    <div className="screen-pad scroll">
      <div className="screen-head">
        <div>
          <h1 className="screen-title">Equipe</h1>
          <p className="screen-sub">8 técnicos no turno A · 5 em campo · 2 disponíveis · 1 em pausa</p>
        </div>
        <div className="screen-actions">
          <button className="btn">{I.calendar}<span>Escala</span></button>
          <button className="btn btn-primary">{I.plus}<span>Atribuir OS</span></button>
        </div>
      </div>

      <div className="team-grid">
        {TECHNICIANS.map((t) => {
          const wo = WORK_ORDERS.find(w => w.id === t.currentWO);
          return (
            <div key={t.id} className="tech-card">
              <div className="tech-card-h">
                <div className="avatar avatar-md" style={{ background: t.color }}>{t.initials}</div>
                <div className="tech-card-info">
                  <div className="tech-card-name">{t.name}</div>
                  <div className="tech-card-role">{t.role} · <span className="mono">{t.id}</span></div>
                </div>
                <span className="pill" data-tone={statusTone[t.status] || "neutral"}>
                  <span className="dot" />{t.status}
                </span>
              </div>

              <div className="tech-card-load">
                <div className="tech-card-load-l">
                  <span>Carga do turno</span>
                  <span className="mono">{Math.round(t.load * 100)}%</span>
                </div>
                <div className="bar" data-tone={t.load > 0.85 ? "crit" : t.load > 0.7 ? "warn" : "good"}>
                  <i style={{ width: `${t.load * 100}%` }} />
                </div>
              </div>

              {wo ? (
                <div className="tech-card-wo">
                  <div className="tech-card-wo-h">
                    <span className="mono">{wo.id}</span>
                    <span className="pill" data-tone={tonePriority(wo.priority)}>{wo.priority}</span>
                  </div>
                  <div className="tech-card-wo-title">{wo.title}</div>
                  <div className="tech-card-wo-meta mono">
                    <span>{wo.asset}</span> · <span>{fmtMin(wo.elapsed)} / {fmtMin(wo.estimate)}</span>
                  </div>
                </div>
              ) : (
                <div className="tech-card-empty ink-3">Sem OS atribuída</div>
              )}

              <div className="tech-card-actions">
                <button className="btn btn-mini">Ver agenda</button>
                <button className="btn btn-mini">Atribuir →</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

window.TeamScreen = TeamScreen;
