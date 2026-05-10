// ─── Tela: Ordens de serviço (lista + detalhe) ───────────────────────────────

function WorkOrdersScreen({ selectedId, onSelect }) {
  const [filter, setFilter] = React.useState("todas");
  const [search, setSearch] = React.useState("");
  const [workOrders, setWorkOrders] = React.useState([]);
  const [editingWO, setEditingWO] = React.useState(null);
  const [checklistWO, setChecklistWO] = React.useState(null);

  // Carregar ordens do Storage
  const loadWorkOrders = () => {
    const orders = Storage.getWorkOrders();
    setWorkOrders(orders);
  };

  // Carregar na montagem
  React.useEffect(() => {
    loadWorkOrders();
  }, []);

  // Escutar evento de refresh
  React.useEffect(() => {
    const handleRefresh = () => loadWorkOrders();
    window.addEventListener('__refresh_work_orders', handleRefresh);
    return () => window.removeEventListener('__refresh_work_orders', handleRefresh);
  }, []);

  const filters = [
    { id: "todas", label: "Todas", count: workOrders.length },
    { id: "executando", label: "Em execução", count: workOrders.filter(w => w.status === "executando").length },
    { id: "aberta", label: "Abertas", count: workOrders.filter(w => w.status === "aberta").length },
    { id: "aguardando", label: "Aguardando peça", count: workOrders.filter(w => w.status === "aguardando peça").length },
    { id: "atrasadas", label: "Atrasadas", count: workOrders.filter(w => w.sla && w.sla > 0.7).length },
  ];

  const items = workOrders.filter((w) => {
    if (filter === "executando" && w.status !== "executando") return false;
    if (filter === "aberta" && w.status !== "aberta") return false;
    if (filter === "aguardando" && w.status !== "aguardando peça") return false;
    if (filter === "atrasadas" && (!w.sla || w.sla < 0.7)) return false;
    if (search && !(`${w.id} ${w.titulo} ${w.equipamentoNome}`.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const selected = workOrders.find(w => w.id === selectedId) || items[0];

  return (
    <div className="wo-screen">
      {/* Lista */}
      <div className="wo-list-pane">
        <div className="wo-list-head">
          <h1 className="screen-title">Ordens de serviço</h1>
          <div className="wo-list-actions">
            <div className="search">
              {I.search}
              <input placeholder="Buscar por OS, ativo, técnico…"
                     value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button className="btn">{I.filter}<span>Filtros</span></button>
            <button className="btn btn-primary" onClick={() => window.dispatchEvent(new CustomEvent("__open_new_wo"))}>{I.plus}<span>Nova OS</span></button>
          </div>
        </div>
        <div className="wo-tabs">
          {filters.map((f) => (
            <button key={f.id} className="wo-tab" data-active={filter === f.id}
                    onClick={() => setFilter(f.id)}>
              <span>{f.label}</span>
              <span className="wo-tab-count mono">{f.count}</span>
            </button>
          ))}
        </div>
        <div className="wo-list scroll">
          <div className="wo-list-header">
            <span>OS</span>
            <span>Título / Ativo</span>
            <span>Tipo</span>
            <span>Prioridade</span>
            <span>Responsável</span>
            <span>SLA</span>
            <span>Prazo</span>
          </div>
          {items.map((w) => (
            <button key={w.id} className="wo-row" data-active={selected?.id === w.id}
                    onClick={() => onSelect(w.id)}>
              <span className="mono wo-cell-id">{w.id}</span>
              <span className="wo-cell-title">
                <span className="wo-title-main">{w.titulo}</span>
                <span className="wo-title-asset">
                  <span className="mono">{w.equipamento}</span> · {w.equipamentoNome}
                </span>
              </span>
              <span><span className="pill" data-tone={toneType(w.tipo)}>{w.tipo}</span></span>
              <span><span className="pill" data-tone={tonePriority(w.prioridade)}>
                <span className="dot" />{w.prioridade}
              </span></span>
              <span className="wo-cell-assignee">
                {w.tecnico ? (
                  <>
                    <span className="avatar avatar-xs"
                          style={{ background: TECHNICIANS.find(t => t.id === w.tecnico)?.color }}>
                      {TECHNICIANS.find(t => t.id === w.tecnico)?.initials}
                    </span>
                    <span>{w.tecnicoNome?.split(" ")[0] || 'Técnico'}</span>
                  </>
                ) : <span className="ink-3">Não atribuído</span>}
              </span>
              <span className="wo-cell-sla">
                <div className="bar bar-sm" data-tone={(w.sla || 0) > 0.7 ? "crit" : (w.sla || 0) > 0.4 ? "warn" : "good"}>
                  <i style={{ width: `${(w.sla || 0) * 100}%` }} />
                </div>
                <span className="mono">{Math.round((w.sla || 0) * 100)}%</span>
              </span>
              <span className="mono ink-2">{w.prazo?.split(" ")[1] || '--:--'}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Detalhe */}
      {selected ? (
        <WorkOrderDetail 
          wo={selected} 
          onEdit={() => setEditingWO(selected.id)}
          onChecklist={() => setChecklistWO(selected.id)}
        />
      ) : (
        <div className="wo-detail scroll" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px', color: 'var(--ink-3)' }}>
          <div style={{ fontSize: '48px', opacity: 0.3 }}>📋</div>
          <div style={{ fontSize: '14px' }}>Nenhuma ordem de serviço encontrada</div>
          <button className="btn btn-primary" onClick={() => window.dispatchEvent(new CustomEvent("__open_new_wo"))}>
            {I.plus}<span>Criar primeira OS</span>
          </button>
        </div>
      )}

      {/* Modal de edição */}
      {editingWO && (
        <EditWOModal 
          woId={editingWO} 
          onClose={() => setEditingWO(null)} 
          onSave={() => {
            loadWorkOrders();
            setEditingWO(null);
          }}
        />
      )}

      {/* Modal de checklist */}
      {checklistWO && (
        <ChecklistExecutor
          woId={checklistWO}
          onClose={() => setChecklistWO(null)}
          onComplete={() => {
            loadWorkOrders();
            setChecklistWO(null);
          }}
        />
      )}
    </div>
  );
}

function WorkOrderDetail({ wo, onEdit, onChecklist }) {
  const technicians = Storage.getTechnicians();
  const tech = technicians.find(t => t.id === wo.tecnico);
  const pct = (wo.estimativa || 0) > 0 ? Math.min(100, ((wo.decorrido || 0) / wo.estimativa) * 100) : 0;
  const status = statusLabel[wo.status] || { label: wo.status, tone: "neutral" };

  return (
    <div className="wo-detail scroll">
      <div className="wo-detail-head">
        <div className="wo-detail-meta">
          <span className="mono wo-detail-id">{wo.id}</span>
          <span className="pill" data-tone={status.tone}><span className="dot" />{status.label}</span>
          <span className="pill" data-tone={tonePriority(wo.prioridade)}>
            <span className="dot" />{wo.prioridade}
          </span>
          <span className="pill" data-tone={toneType(wo.tipo)}>{wo.tipo}</span>
        </div>
        <div className="wo-detail-actions">
          <button className="btn" onClick={onChecklist}>✓<span>Checklist</span></button>
          <button className="btn" onClick={onEdit}>{I.edit}<span>Editar</span></button>
          <button className="btn">{I.more}</button>
        </div>
      </div>
      <h2 className="wo-detail-title">{wo.titulo}</h2>
      <div className="wo-detail-asset">
        <span style={{ color: "var(--ink-3)" }}>{I.equipamento}</span>
        <span className="mono">{wo.equipamento}</span>
        <span>·</span>
        <span>{wo.equipamentoNome}</span>
        <span style={{ color: "var(--ink-4)" }}>·</span>
        <span style={{ color: "var(--ink-3)" }}>{wo.area}</span>
      </div>

      {/* Cronômetro grande - só mostra se tiver dados de tempo */}
      {wo.estimativa && (
        <div className="wo-timer">
          <div className="wo-timer-block">
            <div className="wo-timer-label">Decorrido</div>
            <div className="wo-timer-value mono">{fmtMin(wo.decorrido || 0)}</div>
          </div>
          <div className="wo-timer-bar">
            <div className="bar bar-lg" data-tone={pct > 90 ? "crit" : pct > 70 ? "warn" : "accent"}>
              <i style={{ width: `${pct}%` }} />
            </div>
            <div className="wo-timer-bar-meta">
              <span className="mono">{Math.round(pct)}% do estimado</span>
              <span className="mono">restante: {fmtMin(Math.max(0, wo.estimativa - (wo.decorrido || 0)))}</span>
            </div>
          </div>
          <div className="wo-timer-block">
            <div className="wo-timer-label">Estimado</div>
            <div className="wo-timer-value mono">{fmtMin(wo.estimativa)}</div>
          </div>
        </div>
      )}

      {/* Impacto - só mostra se tiver */}
      {wo.impacto && (
        <div className={`wo-impact ${wo.impacto.includes("R$") ? "wo-impact-crit" : ""}`}>
          <span style={{ color: "var(--crit)" }}>{I.alert}</span>
          <span>{wo.impacto}</span>
        </div>
      )}

      <div className="wo-detail-grid">
        <Section label="Descrição">
          <p className="wo-desc">{wo.descricao || 'Sem descrição'}</p>
        </Section>

        <Section label="Responsável">
          {tech ? (
            <div className="wo-tech-card">
              <div className="avatar avatar-lg" style={{ background: tech.color }}>{tech.initials}</div>
              <div>
                <div className="wo-tech-name">{tech.nome}</div>
                <div className="wo-tech-role">{tech.especialidade} · <span className="mono">{tech.id}</span></div>
              </div>
              <button className="btn btn-mini" style={{ marginLeft: "auto" }}>Reatribuir</button>
            </div>
          ) : (
            <button className="btn btn-accent">{I.plus}<span>Atribuir técnico</span></button>
          )}
        </Section>

        <Section label="Datas">
          <dl className="wo-dl">
            <dt>Aberta</dt><dd className="mono">{wo.dataAbertura ? new Date(wo.dataAbertura).toLocaleString('pt-BR') : '--'}</dd>
            <dt>Prazo</dt><dd className="mono">{wo.prazo ? new Date(wo.prazo).toLocaleString('pt-BR') : '--'}</dd>
            <dt>Estimativa</dt><dd className="mono">{wo.estimativa ? fmtMin(wo.estimativa) : '--'}</dd>
          </dl>
        </Section>

        <Section label={`Peças & materiais (${(wo.pecas || []).length})`}>
          {(!wo.pecas || wo.pecas.length === 0) ? (
            <div className="ink-3" style={{ fontSize: 12 }}>Nenhum material requerido.</div>
          ) : (
            <table className="parts-table">
              <thead>
                <tr><th>Código</th><th>Descrição</th><th>Qtd</th><th>Estoque</th><th></th></tr>
              </thead>
              <tbody>
                {wo.pecas.map((p) => (
                  <tr key={p.codigo}>
                    <td className="mono">{p.codigo}</td>
                    <td>{p.nome}</td>
                    <td className="mono">{p.quantidade}</td>
                    <td className={`mono ${(p.estoque || 0) < p.quantidade ? "ink-crit" : ""}`}>{p.estoque || 0}</td>
                    <td>
                      {(p.estoque || 0) < p.quantidade
                        ? <span className="pill" data-tone="crit">sem estoque</span>
                        : <span className="pill" data-tone="good">disponível</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Section>

        <Section label="Checklist (3/5)">
          <div className="checklist">
            {[
              { done: true, text: "LOTO aplicado e validado" },
              { done: true, text: "Permissão de trabalho a quente" },
              { done: true, text: "Inspeção visual do componente" },
              { done: false, text: "Substituição do rolamento" },
              { done: false, text: "Teste de vibração ≤ 2.5 mm/s" },
            ].map((c, i) => (
              <div key={i} className="check-row" data-done={c.done}>
                <span className="check-box">{c.done ? I.check : null}</span>
                <span>{c.text}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div className="wo-section">
      <div className="wo-section-label">{label}</div>
      {children}
    </div>
  );
}

window.WorkOrdersScreen = WorkOrdersScreen;
