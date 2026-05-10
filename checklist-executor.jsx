// ═══════════════════════════════════════════════════════════════════════════
// CHECKLIST-EXECUTOR.JSX - Executor de Checklist em OS
// ═══════════════════════════════════════════════════════════════════════════

function ChecklistExecutor({ woId, onClose, onComplete }) {
  const [templates, setTemplates] = React.useState([]);
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  const [checklist, setChecklist] = React.useState(null);
  const [responses, setResponses] = React.useState({});

  React.useEffect(() => {
    setTemplates(Storage.getChecklistTemplates());
    
    // Verificar se já existe checklist para esta OS
    const checklists = Storage.getChecklists();
    const existing = checklists.find(c => c.woId === woId && c.status !== 'concluído');
    if (existing) {
      setChecklist(existing);
      setResponses(existing.respostas || {});
      const template = Storage.getChecklistTemplates().find(t => t.id === existing.templateId);
      setSelectedTemplate(template);
    }
  }, [woId]);

  const startChecklist = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const newChecklist = {
      woId,
      templateId: template.id,
      templateNome: template.nome,
      itens: template.itens,
      respostas: {},
      status: 'em_andamento',
      tecnicoId: Storage.getCurrentUser()?.id
    };

    const saved = Storage.addChecklist(newChecklist);
    setChecklist(saved);
    setSelectedTemplate(template);
    setResponses({});
  };

  const setResponse = (itemId, value) => {
    setResponses(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  const handleSave = () => {
    Storage.updateChecklist(checklist.id, {
      respostas: responses,
      status: 'em_andamento'
    });
    window.showToast?.('Checklist salvo', 'good');
  };

  const handleComplete = () => {
    // Validar obrigatórios
    const missing = selectedTemplate.itens
      .filter(item => item.obrigatorio)
      .find(item => !responses[item.id] || responses[item.id] === '');

    if (missing) {
      alert(`O item "${missing.texto}" é obrigatório!`);
      return;
    }

    Storage.updateChecklist(checklist.id, {
      respostas: responses,
      status: 'concluído',
      dataFinalizacao: new Date().toISOString()
    });

    window.showToast?.('Checklist concluído!', 'good');
    onComplete?.();
    onClose?.();
  };

  if (!checklist && !selectedTemplate) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
          <div className="modal-header">
            <h2 className="modal-title">Selecionar Checklist</h2>
            <button className="btn-icon" onClick={onClose}>{I.x}</button>
          </div>
          <div className="modal-body">
            {templates.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-3)' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <div>Nenhum template de checklist disponível</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {templates.map(template => (
                  <button
                    key={template.id}
                    className="template-select-btn"
                    onClick={() => startChecklist(template.id)}
                  >
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: '4px' }}>{template.nome}</div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-3)' }}>
                        {template.itens.length} itens • {template.tipo}
                      </div>
                    </div>
                    <span style={{ fontSize: '20px' }}>→</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const progress = selectedTemplate ? 
    (Object.keys(responses).filter(k => responses[k]).length / selectedTemplate.itens.length) * 100 : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{selectedTemplate?.nome}</h2>
            <p className="modal-subtitle">OS {woId}</p>
          </div>
          <button className="btn-icon" onClick={onClose}>{I.x}</button>
        </div>

        <div style={{ padding: '16px 24px', background: 'var(--accent-subtle)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
            <span>Progresso: {Object.keys(responses).filter(k => responses[k]).length}/{selectedTemplate?.itens.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar" style={{ height: '8px' }}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="modal-body scroll" style={{ maxHeight: '60vh' }}>
          {selectedTemplate?.itens.map((item, index) => (
            <div key={item.id} className="checklist-item-exec">
              <div style={{ display: 'flex', alignItems: 'start', gap: '8px', marginBottom: '8px' }}>
                <span style={{ 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  color: 'var(--ink-3)',
                  minWidth: '24px'
                }}>
                  {index + 1}.
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px' }}>
                    {item.obrigatorio && <span style={{ color: 'var(--crit)', marginRight: '4px' }}>*</span>}
                    {item.texto}
                  </div>
                  
                  {item.tipo === 'checkbox' && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={responses[item.id] === true}
                        onChange={(e) => setResponse(item.id, e.target.checked)}
                        style={{ width: '20px', height: '20px' }}
                      />
                      <span style={{ fontSize: '13px' }}>
                        {responses[item.id] ? '✓ Verificado' : 'Marcar como verificado'}
                      </span>
                    </label>
                  )}

                  {item.tipo === 'texto' && (
                    <textarea
                      className="form-input"
                      rows="2"
                      value={responses[item.id] || ''}
                      onChange={(e) => setResponse(item.id, e.target.value)}
                      placeholder="Digite sua resposta..."
                    />
                  )}

                  {item.tipo === 'numero' && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="number"
                        className="form-input"
                        value={responses[item.id] || ''}
                        onChange={(e) => setResponse(item.id, e.target.value)}
                        placeholder="0"
                        style={{ maxWidth: '150px' }}
                      />
                      {item.unidade && <span style={{ fontSize: '13px', color: 'var(--ink-3)' }}>{item.unidade}</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn" onClick={handleSave}>Salvar progresso</button>
          <button className="btn btn-primary" onClick={handleComplete}>
            Concluir checklist
          </button>
        </div>
      </div>
    </div>
  );
}

window.ChecklistExecutor = ChecklistExecutor;
