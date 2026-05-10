// ─── Tela: Equipe ────────────────────────────────────────────────────────────

function TeamScreen() {
  const [technicians, setTechnicians] = React.useState([]);
  const [workOrders, setWorkOrders] = React.useState([]);

  React.useEffect(() => {
    setTechnicians(Storage.getTechnicians());
    setWorkOrders(Storage.getWorkOrders());
  }, []);

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
          <p className="screen-sub">{technicians.length} técnicos cadastrados</p>
        </div>
        <div className="screen-actions">
          <button className="btn">{I.calendar}<span>Escala</span></button>
          <button className="btn btn-primary">{I.plus}<span>Atribuir OS</span></button>
        </div>
      </div>

      <div className="team-grid">
        {technicians.map((t) => {
          const wo = workOrders.find(w => w.tecnico === t.id && w.status === 'executando');
          return (
            <div key={t.id} className="tech-card">
              <div className="tech-card-h">
                <div className="avatar avatar-md" style={{ background: t.color }}>{t.initials}</div>
                <div className="tech-card-info">
                  <div className="tech-card-name">{t.nome}</div>
                  <div className="tech-card-role">{t.especialidade} · <span className="mono">{t.id}</span></div>
                </div>
                <span className="pill" data-tone={statusTone[t.status] || "neutral"}>
                  <span className="dot" />{t.status}
                </span>
              </div>

              <div className="tech-card-load">
                <div className="tech-card-load-l">
                  <span>Carga do turno</span>
                  <span className="mono">{Math.round((t.carga || 0) * 100)}%</span>
                </div>
                <div className="bar" data-tone={(t.carga || 0) > 0.85 ? "crit" : (t.carga || 0) > 0.7 ? "warn" : "good"}>
                  <i style={{ width: `${(t.carga || 0) * 100}%` }} />
                </div>
              </div>

              {wo ? (
                <div className="tech-card-wo">
                  <div className="tech-card-wo-h">
                    <span className="mono">{wo.id}</span>
                    <span className="pill" data-tone={tonePriority(wo.prioridade)}>{wo.prioridade}</span>
                  </div>
                  <div className="tech-card-wo-title">{wo.titulo}</div>
                  <div className="tech-card-wo-meta mono">
                    <span>{wo.equipamento}</span> · <span>{fmtMin(wo.decorrido || 0)} / {fmtMin(wo.estimativa)}</span>
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
