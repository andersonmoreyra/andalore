// ─── Tela: Solicitações de serviço (triagem) ────────────────────────────────
// Kanban: Novas → Em triagem → Aprovadas → Rejeitadas
// + tabela densa abaixo, com SLA visual e ações de conversão em OS

const ALL_REQUESTS = [
  { id: "SR-118", from: "Sandro Lima",   role: "Op. Linha 3",    asset: "EX-03", title: "Temperatura instável zona 4", desc: "Variação ±8°C nos últimos 40 min. Produto fora de spec.", priority: "média", time: "09:22", age: 4, status: "nova",      sla: 0.10 },
  { id: "SR-117", from: "Ana Beatriz",   role: "Qualidade",      asset: "IM-02", title: "Variação de cor lote #4421", desc: "ΔE > 3.0 detectado em amostragem. Possível desgaste no anilox.", priority: "média", time: "08:55", age: 31, status: "nova",  sla: 0.30 },
  { id: "SR-116", from: "Marcos Vinícius", role: "Op. Linha 1",  asset: "EX-01", title: "Ruído metálico intermitente", desc: "Som metálico audível a cada ~2 min. Operador suspeita de mancal.", priority: "alta", time: "08:40", age: 46, status: "triagem", sla: 0.65, owner: "FA" },
  { id: "SR-115", from: "Juliana Castro", role: "Sup. Acabamento", asset: "RB-01", title: "Tensionador desregulado", desc: "Bobina saindo com tensão irregular. Refugo aumentando.", priority: "baixa", time: "07:30", age: 116, status: "triagem", sla: 0.40, owner: "FA" },
  { id: "SR-114", from: "Carlos Eduardo", role: "Op. Linha 2",   asset: "EX-02", title: "Vazamento de óleo no redutor", desc: "Pequena gota visível no piso.", priority: "média", time: "Ontem", age: 720, status: "aprovada", convertedTo: "OS-2832" },
  { id: "SR-113", from: "Patrícia Nunes", role: "Manut. Predial",asset: "CL-01", title: "Vibração no chiller", desc: "Aumento perceptível de vibração na carcaça.", priority: "baixa", time: "Ontem", age: 800, status: "aprovada", convertedTo: "OS-2849" },
  { id: "SR-112", from: "Rogério Dias",  role: "Almoxarifado",   asset: "PT-01", title: "Sensor de presença sujo", desc: "Já limpamos no local. Não é manutenção.", priority: "baixa", time: "Ontem", age: 900, status: "rejeitada", reason: "Resolvido pela operação" },
];

const COLUMNS = [
  { id: "nova",      label: "Novas",       tone: "warn", desc: "Aguardando triagem do coordenador" },
  { id: "triagem",   label: "Em triagem",  tone: "info", desc: "Em análise técnica" },
  { id: "aprovada",  label: "Aprovadas",   tone: "good", desc: "Convertidas em OS" },
  { id: "rejeitada", label: "Rejeitadas",  tone: "neutral", desc: "Não procedem" },
];

function RequestsScreen() {
  const [selected, setSelected] = React.useState(null);
  const byCol = (id) => ALL_REQUESTS.filter(r => r.status === id);

  return (
    <div className="screen-pad scroll">
      <div className="screen-head">
        <div>
          <h1 className="screen-title">Solicitações de serviço</h1>
          <p className="screen-sub">Triagem das requisições abertas pela operação · 7 itens</p>
        </div>
        <div className="screen-actions">
          <div className="search">
            {I.search}
            <input placeholder="Buscar solicitação, ativo ou solicitante…" />
          </div>
          <button className="btn">{I.filter}<span>Filtros</span></button>
          <button className="btn btn-primary">{I.plus}<span>Nova solicitação</span></button>
        </div>
      </div>

      {/* Kanban */}
      <div className="sr-kanban">
        {COLUMNS.map(col => {
          const items = byCol(col.id);
          return (
            <div key={col.id} className="sr-col">
              <div className="sr-col-head">
                <div className="sr-col-h-l">
                  <span className={`sr-col-dot sr-tone-${col.tone}`} />
                  <span className="sr-col-label">{col.label}</span>
                  <span className="sr-col-count mono">{items.length}</span>
                </div>
                <button className="icon-btn-sm" title="Adicionar">{I.plus}</button>
              </div>
              <div className="sr-col-desc">{col.desc}</div>
              <div className="sr-col-items">
                {items.length === 0 && (
                  <div className="sr-empty">Nada por aqui</div>
                )}
                {items.map(r => (
                  <button key={r.id} className="sr-card" onClick={() => setSelected(r.id)}
                          data-active={selected === r.id}>
                    <div className="sr-card-h">
                      <span className="mono sr-card-id">{r.id}</span>
                      {r.priority && (
                        <span className="pill" data-tone={tonePriority(r.priority)}>
                          <span className="dot" />{r.priority}
                        </span>
                      )}
                    </div>
                    <div className="sr-card-title">{r.title}</div>
                    <div className="sr-card-meta">
                      <span className="mono">{r.asset}</span>
                      <span>·</span>
                      <span>{r.from.split(" ")[0]}</span>
                    </div>
                    {r.status === "nova" || r.status === "triagem" ? (
                      <div className="sr-card-foot">
                        <div className="bar bar-sm" data-tone={r.sla > 0.7 ? "crit" : r.sla > 0.4 ? "warn" : "good"}>
                          <i style={{ width: `${(r.sla || 0) * 100}%` }} />
                        </div>
                        <span className="mono sr-card-age">{r.age < 60 ? `${r.age}min` : `${Math.floor(r.age/60)}h${r.age%60}`}</span>
                        {r.owner && <span className="avatar avatar-xs" style={{ background: "var(--accent)" }}>{r.owner}</span>}
                      </div>
                    ) : r.convertedTo ? (
                      <div className="sr-card-foot">
                        <span className="pill" data-tone="good">→ <span className="mono">{r.convertedTo}</span></span>
                      </div>
                    ) : (
                      <div className="sr-card-foot sr-card-foot-rej">
                        <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{r.reason}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Painel de detalhe da solicitação selecionada */}
      {selected && (() => {
        const r = ALL_REQUESTS.find(x => x.id === selected);
        return (
          <div className="sr-detail card">
            <div className="card-hd">
              <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="mono">{r.id}</span>
                <span className="pill" data-tone={tonePriority(r.priority || "baixa")}>
                  <span className="dot" />{r.priority}
                </span>
                <span style={{ fontSize: 14 }}>{r.title}</span>
              </span>
              <button className="icon-btn-sm" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="sr-detail-body">
              <div className="sr-detail-grid">
                <div>
                  <div className="wo-section-label">Solicitante</div>
                  <div className="sr-detail-from">
                    <div className="avatar avatar-md" style={{ background: "var(--info)" }}>
                      {r.from.split(" ").map(s => s[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{r.from}</div>
                      <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{r.role}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="wo-section-label">Ativo</div>
                  <div className="mono" style={{ fontSize: 14, fontWeight: 600 }}>{r.asset}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)" }}>
                    {ASSETS.find(a => a.id === r.asset)?.name}
                  </div>
                </div>
                <div>
                  <div className="wo-section-label">Aberta</div>
                  <div className="mono" style={{ fontSize: 14 }}>{r.time}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>há {r.age < 60 ? `${r.age} min` : `${Math.floor(r.age/60)}h`}</div>
                </div>
              </div>
              <div className="sr-detail-desc">
                <div className="wo-section-label">Descrição do problema</div>
                <p>{r.desc}</p>
              </div>
              {r.status === "nova" || r.status === "triagem" ? (
                <div className="sr-detail-actions">
                  <button className="btn">Solicitar mais info</button>
                  <button className="btn">Rejeitar</button>
                  <button className="btn btn-primary">{I.arrowRight}<span>Converter em OS</span></button>
                </div>
              ) : null}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

window.RequestsScreen = RequestsScreen;
