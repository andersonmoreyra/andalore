// ─── Tela: Agenda do turno (calendário 7 dias + plano) ───────────────────────

function ScheduleScreen() {
  const HOURS_PER_DAY = 8; // representação compacta
  const typeTone = { preventiva: "info", preditiva: "pred", corretiva: "crit" };

  const totalByDay = SCHEDULE_DAYS.map((_, di) =>
    PLANNED.filter(p => p.day === di).reduce((s, p) => s + p.duration, 0)
  );

  return (
    <div className="screen-pad scroll">
      <div className="screen-head">
        <div>
          <h1 className="screen-title">Agenda do turno</h1>
          <p className="screen-sub">Plano de manutenções · próximos 7 dias</p>
        </div>
        <div className="screen-actions">
          <div className="btn-group">
            <button className="btn" data-active="true">Semana</button>
            <button className="btn">Mês</button>
            <button className="btn">Equipe</button>
          </div>
          <button className="btn btn-primary">{I.plus}<span>Programar</span></button>
        </div>
      </div>

      {/* Resumo da semana */}
      <div className="week-summary">
        <div className="week-summary-item">
          <div className="week-summary-label">Preventivas</div>
          <div className="week-summary-value mono">14</div>
        </div>
        <div className="week-summary-item">
          <div className="week-summary-label">Preditivas</div>
          <div className="week-summary-value mono">6</div>
        </div>
        <div className="week-summary-item">
          <div className="week-summary-label">Horas previstas</div>
          <div className="week-summary-value mono">42h</div>
        </div>
        <div className="week-summary-item">
          <div className="week-summary-label">Capacidade</div>
          <div className="week-summary-value mono">68%</div>
          <div className="bar" data-tone="warn"><i style={{ width: "68%" }} /></div>
        </div>
        <div className="week-summary-item">
          <div className="week-summary-label">Aderência (mês)</div>
          <div className="week-summary-value mono">87%</div>
          <div className="bar" data-tone="good"><i style={{ width: "87%" }} /></div>
        </div>
      </div>

      {/* Calendário em colunas */}
      <div className="week-grid">
        {SCHEDULE_DAYS.map((day, di) => {
          const items = PLANNED.filter(p => p.day === di);
          const isToday = di === 0;
          return (
            <div key={di} className={`week-col ${isToday ? "week-col-today" : ""}`}>
              <div className="week-col-head">
                <div className="week-col-day">{day}</div>
                <div className="week-col-meta mono">{totalByDay[di].toFixed(1)}h</div>
              </div>
              <div className="week-col-bar">
                <i style={{ height: `${Math.min(100, (totalByDay[di] / HOURS_PER_DAY) * 100)}%` }} />
              </div>
              <div className="week-col-items">
                {items.length === 0 && <div className="week-empty">—</div>}
                {items.map((p, i) => {
                  const asset = ASSETS.find(a => a.id === p.asset);
                  return (
                    <div key={i} className="week-item" data-tone={typeTone[p.type]}>
                      <div className="week-item-h">
                        <span className="mono">{p.asset}</span>
                        <span className="mono ink-3">{p.duration}h</span>
                      </div>
                      <div className="week-item-title">{p.title}</div>
                      <div className="week-item-meta">
                        <span className="pill" data-tone={typeTone[p.type]}>{p.type}</span>
                        <span className="ink-3">{asset?.area}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Conflitos & sugestões */}
      <div className="card" style={{ marginTop: 18 }}>
        <div className="card-hd">
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ color: "var(--warn)" }}>{I.alert}</span>
            Sugestões de balanceamento
          </span>
          <span className="sub">3 sugestões da IA preditiva</span>
        </div>
        <div className="suggestions">
          <div className="suggest-row">
            <span style={{ color: "var(--warn)" }}>{I.zap}</span>
            <div>
              <div className="suggest-title">Sex 07 está com 9h planejadas (sobrecarga)</div>
              <div className="suggest-meta">Mover overhaul da bomba CT-02 para Sáb 08 reduz a carga em 8h</div>
            </div>
            <button className="btn btn-mini">Aplicar</button>
          </div>
          <div className="suggest-row">
            <span style={{ color: "var(--info)" }}>{I.trending}</span>
            <div>
              <div className="suggest-title">EX-01 mostra padrão de degradação acelerada</div>
              <div className="suggest-meta">Antecipar troca de rolamentos de Qui 06 para hoje à tarde</div>
            </div>
            <button className="btn btn-mini">Avaliar</button>
          </div>
          <div className="suggest-row">
            <span style={{ color: "var(--good)" }}>{I.check}</span>
            <div>
              <div className="suggest-title">Larissa Pinto tem 2h livres hoje</div>
              <div className="suggest-meta">Aproveitar para inspeção termográfica IM-02 (programada Qui)</div>
            </div>
            <button className="btn btn-mini">Programar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.ScheduleScreen = ScheduleScreen;
