// ─── Modal: Nova Ordem de Serviço ────────────────────────────────────────────
// Formulário real para criação de OS — abre via evento "__open_new_wo".

function NewWOModal() {
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({
    title: "",
    asset: "",
    type: "corretiva",
    priority: "média",
    assignee: "",
    estimatedTime: 60,
    description: "",
    requestedBy: "Coord. F. Almeida",
    attachments: [],
  });
  const [submitting, setSubmitting] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const dialogRef = React.useRef(null);
  const firstFieldRef = React.useRef(null);
  
  // Carregar dados do Storage
  const [assets, setAssets] = React.useState([]);
  const [technicians, setTechnicians] = React.useState([]);
  
  React.useEffect(() => {
    setAssets(Storage.getAssets());
    setTechnicians(Storage.getTechnicians());
  }, []);

  React.useEffect(() => {
    const onOpen = (e) => {
      setOpen(true);
      setStep(1);
      setSubmitting(false);
      // Pré-preencher se vier de um ativo / solicitação
      if (e.detail) {
        setForm(f => ({ ...f, ...e.detail }));
      } else {
        setForm({
          title: "", asset: "", type: "corretiva", priority: "média",
          assignee: "", estimatedTime: 60, description: "",
          requestedBy: "Coord. F. Almeida", attachments: [],
        });
      }
    };
    window.addEventListener("__open_new_wo", onOpen);
    return () => window.removeEventListener("__open_new_wo", onOpen);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onEsc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onEsc);
    requestAnimationFrame(() => firstFieldRef.current?.focus());
    return () => document.removeEventListener("keydown", onEsc);
  }, [open]);

  if (!open) return null;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const valid1 = form.title.trim() && form.asset && form.type && form.priority;
  const valid2 = true; // descrição opcional

  const submit = () => {
    setSubmitting(true);
    
    // Buscar dados do Storage
    const assets = Storage.getAssets();
    const technicians = Storage.getTechnicians();
    
    // Buscar dados do ativo selecionado
    const asset = assets.find(a => a.id === form.asset);
    
    // Buscar dados do técnico selecionado
    const tech = technicians.find(t => t.id === form.assignee);
    
    // Criar objeto da nova OS
    const newWO = {
      titulo: form.title,
      descricao: form.description || '',
      equipamento: form.asset,
      equipamentoNome: asset?.nome || form.asset,
      area: asset?.area || 'N/A',
      tipo: form.type,
      prioridade: form.priority,
      tecnico: form.assignee || null,
      tecnicoNome: tech?.nome || null,
      estimativa: form.estimatedTime,
      solicitante: form.requestedBy,
      status: 'aberta',
      anexos: form.attachments
    };
    
    // Salvar no Storage
    const savedWO = Storage.addWorkOrder(newWO);
    
    setTimeout(() => {
      setOpen(false);
      window.showToast?.(
        `Ordem ${savedWO.id} criada com sucesso!`,
        "good",
        `${savedWO.titulo} · ${savedWO.prioridade} · ${savedWO.tecnicoNome || 'não atribuída'}`
      );
      
      // Recarregar a tela para mostrar a nova OS
      window.dispatchEvent(new CustomEvent('__refresh_work_orders'));
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={() => setOpen(false)} data-no-toast-zone>
      <div className="modal" ref={dialogRef} onClick={(e) => e.stopPropagation()} role="dialog">
        <div className="modal-h">
          <div>
            <div className="modal-title">Nova ordem de serviço</div>
            <div className="modal-sub">Etapa {step} de 2 · {step === 1 ? "Detalhes da OS" : "Atribuição e envio"}</div>
          </div>
          <button className="icon-btn" data-no-toast="true" onClick={() => setOpen(false)} title="Fechar (Esc)">✕</button>
        </div>

        <div className="modal-stepper">
          <div className="modal-step" data-active={step === 1} data-done={step > 1}>
            <span className="modal-step-num">1</span><span>Detalhes</span>
          </div>
          <div className="modal-step-line" />
          <div className="modal-step" data-active={step === 2}>
            <span className="modal-step-num">2</span><span>Atribuição</span>
          </div>
        </div>

        <div className="modal-body scroll">
          {step === 1 && (
            <>
              <div className="form-row">
                <label className="form-label" htmlFor="wo-title">Título da OS *</label>
                <input id="wo-title" ref={firstFieldRef}
                       className="form-input"
                       placeholder="Ex.: Vibração anormal no eixo da Extrusora 01"
                       value={form.title}
                       onChange={(e) => set("title", e.target.value)} />
                <div className="form-hint">Descreva resumidamente o problema ou tarefa.</div>
              </div>

              <div className="form-grid">
                <div className="form-row">
                  <label className="form-label">Ativo *</label>
                  <select className="form-input" value={form.asset} onChange={(e) => set("asset", e.target.value)}>
                    <option value="">Selecione…</option>
                    {assets.map(a => (
                      <option key={a.id} value={a.id}>{a.codigo} · {a.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <label className="form-label">Tipo *</label>
                  <div className="form-segments">
                    {[
                      { v: "corretiva", l: "Corretiva", tone: "crit" },
                      { v: "preventiva", l: "Preventiva", tone: "info" },
                      { v: "preditiva", l: "Preditiva", tone: "pred" },
                      { v: "melhoria", l: "Melhoria", tone: "good" },
                    ].map(o => (
                      <button key={o.v} type="button"
                              data-no-toast="true"
                              className="form-seg"
                              data-active={form.type === o.v}
                              data-tone={o.tone}
                              onClick={() => set("type", o.v)}>{o.l}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-row">
                  <label className="form-label">Prioridade *</label>
                  <div className="form-segments">
                    {[
                      { v: "baixa", l: "Baixa", tone: "good" },
                      { v: "média", l: "Média", tone: "info" },
                      { v: "alta", l: "Alta", tone: "warn" },
                      { v: "crítica", l: "Crítica", tone: "crit" },
                    ].map(o => (
                      <button key={o.v} type="button"
                              data-no-toast="true"
                              className="form-seg"
                              data-active={form.priority === o.v}
                              data-tone={o.tone}
                              onClick={() => set("priority", o.v)}>{o.l}</button>
                    ))}
                  </div>
                </div>
                <div className="form-row">
                  <label className="form-label">Tempo estimado</label>
                  <div className="form-time-input">
                    <input type="number" min="5" step="5" className="form-input"
                           value={form.estimatedTime}
                           onChange={(e) => set("estimatedTime", parseInt(e.target.value) || 0)} />
                    <span className="form-time-unit">min</span>
                    <div className="form-time-presets">
                      {[30, 60, 120, 240].map(p => (
                        <button key={p} type="button" data-no-toast="true"
                                className="form-time-preset"
                                data-active={form.estimatedTime === p}
                                onClick={() => set("estimatedTime", p)}>{p < 60 ? `${p}m` : `${p/60}h`}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <label className="form-label" htmlFor="wo-desc">Descrição detalhada</label>
                <textarea id="wo-desc" className="form-input" rows="4"
                          placeholder="O que foi observado? Histórico recente? Itens necessários?"
                          value={form.description}
                          onChange={(e) => set("description", e.target.value)} />
              </div>

              <div className="form-row">
                <label className="form-label">Anexos</label>
                <div className="form-attach">
                  <button className="form-attach-btn" data-no-toast="true"
                          onClick={() => {
                            const name = `anexo-${form.attachments.length + 1}.jpg`;
                            set("attachments", [...form.attachments, { name, size: "1.2 MB" }]);
                          }}>
                    <span style={{ fontSize: 16 }}>+</span> Adicionar foto ou arquivo
                  </button>
                  {form.attachments.map((a, i) => (
                    <div key={i} className="form-attach-item">
                      <span>📎</span>
                      <span>{a.name}</span>
                      <span className="ink-3" style={{ fontSize: 11 }}>{a.size}</span>
                      <button data-no-toast="true" className="icon-btn"
                              onClick={() => set("attachments", form.attachments.filter((_, j) => j !== i))}
                              title="Remover">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="form-summary">
                <div className="form-summary-h">Resumo</div>
                <div className="form-summary-row">
                  <span className="form-summary-k">Título</span>
                  <span className="form-summary-v"><strong>{form.title}</strong></span>
                </div>
                <div className="form-summary-row">
                  <span className="form-summary-k">Ativo</span>
                  <span className="form-summary-v mono">{form.asset || "—"}</span>
                </div>
                <div className="form-summary-row">
                  <span className="form-summary-k">Tipo / Prioridade</span>
                  <span className="form-summary-v">
                    <span className="pill" data-tone={toneType(form.type)}>{form.type}</span>
                    <span className="pill" data-tone={tonePriority(form.priority)} style={{ marginLeft: 6 }}>{form.priority}</span>
                  </span>
                </div>
                <div className="form-summary-row">
                  <span className="form-summary-k">Tempo estimado</span>
                  <span className="form-summary-v mono">{fmtMin(form.estimatedTime)}</span>
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Atribuir a um técnico</label>
                <div className="assignee-list">
                  {technicians.map(t => (
                    <button key={t.id} type="button"
                            data-no-toast="true"
                            className="assignee-pick"
                            data-active={form.assignee === t.id}
                            onClick={() => {
                              console.log('Selecionando técnico:', t.id, t.nome);
                              console.log('Assignee atual:', form.assignee);
                              set("assignee", t.id);
                              console.log('Assignee depois:', t.id);
                            }}>
                      <span className="avatar avatar-sm" style={{ background: t.color }}>{t.initials}</span>
                      <div className="assignee-info">
                        <span className="assignee-name">{t.nome}</span>
                        <span className="assignee-role">{t.especialidade}</span>
                      </div>
                      <span className="assignee-pick-state">
                        {form.assignee === t.id ? "✓ Selecionado" : "Selecionar"}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="form-hint">
                  Você pode deixar não atribuído e fazer a triagem depois — a OS entra na fila com prioridade {form.priority}.
                </div>
              </div>

              <div className="form-row">
                <label className="form-label">Notificações</label>
                <div className="form-checks">
                  <label className="form-check">
                    <input type="checkbox" defaultChecked /> Avisar técnico atribuído
                  </label>
                  <label className="form-check">
                    <input type="checkbox" defaultChecked /> Avisar operador solicitante
                  </label>
                  <label className="form-check">
                    <input type="checkbox" /> Disparar alerta crítico (planta toda)
                  </label>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="modal-foot">
          <div className="modal-foot-l">
            {step === 2 && (
              <button className="btn" data-no-toast="true" onClick={() => setStep(1)}>← Voltar</button>
            )}
          </div>
          <div className="modal-foot-r">
            <button className="btn" data-no-toast="true" onClick={() => setOpen(false)}>Cancelar</button>
            {step === 1 ? (
              <button className="btn btn-primary" data-no-toast="true"
                      disabled={!valid1}
                      onClick={() => setStep(2)}>
                Continuar →
              </button>
            ) : (
              <button className="btn btn-primary" data-no-toast="true"
                      disabled={!valid2 || submitting}
                      onClick={submit}>
                {submitting ? "Criando…" : "Criar ordem de serviço"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

window.NewWOModal = NewWOModal;
