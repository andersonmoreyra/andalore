// ═══════════════════════════════════════════════════════════════════════════
// CHECKLIST-MANAGER.JSX - Gerenciador de Templates de Checklist
// Sistema de Gestão de Manutenção - Marvi Alimentos
// ═══════════════════════════════════════════════════════════════════════════

function ChecklistManager() {
  const [templates, setTemplates] = React.useState([]);
  const [editing, setEditing] = React.useState(null);
  const [creating, setCreating] = React.useState(false);

  React.useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = () => {
    setTemplates(Storage.getChecklistTemplates());
  };

  const handleDelete = (id) => {
    if (confirm('Deseja realmente excluir este template de checklist?')) {
      Storage.deleteChecklistTemplate(id);
      loadTemplates();
      window.showToast?.('Template excluído', 'neutral');
    }
  };

  return (
    <div className="screen-content">
      <div className="screen-head">
        <div>
          <h1 className="screen-title">Templates de Checklist</h1>
          <p className="screen-subtitle">Crie e gerencie modelos de checklist para manutenções</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>
          {I.plus}<span>Novo template</span>
        </button>
      </div>

      <div className="templates-grid">
        {templates.map(template => (
          <div key={template.id} className="template-card">
            <div className="template-header">
              <div>
                <h3 className="template-name">{template.nome}</h3>
                <span className="pill" data-tone={toneType(template.tipo)}>{template.tipo}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-icon" onClick={() => setEditing(template)} title="Editar">
                  {I.edit}
                </button>
                <button className="btn-icon" onClick={() => handleDelete(template.id)} title="Excluir">
                  {I.trash}
                </button>
              </div>
            </div>
            <div className="template-meta">
              <span>{template.itens.length} itens</span>
              <span>·</span>
              <span className="ink-3">{new Date(template.dataCriacao).toLocaleDateString('pt-BR')}</span>
            </div>
            <div className="template-items">
              {template.itens.slice(0, 3).map(item => (
                <div key={item.id} className="template-item-preview">
                  {item.obrigatorio && <span style={{ color: 'var(--crit)' }}>*</span>}
                  <span>{item.texto}</span>
                </div>
              ))}
              {template.itens.length > 3 && (
                <div className="ink-3" style={{ fontSize: '12px' }}>
                  +{template.itens.length - 3} itens...
                </div>
              )}
            </div>
          </div>
        ))}

        {templates.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '48px', opacity: 0.3 }}>✓</div>
            <div style={{ fontSize: '14px', marginBottom: '16px' }}>Nenhum template criado ainda</div>
            <button className="btn btn-primary" onClick={() => setCreating(true)}>
              {I.plus}<span>Criar primeiro template</span>
            </button>
          </div>
        )}
      </div>

      {(creating || editing) && (
        <ChecklistEditor
          template={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={() => {
            loadTemplates();
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function ChecklistEditor({ template, onClose, onSave }) {
  const [form, setForm] = React.useState(template || {
    nome: '',
    tipo: 'preventiva',
    itens: []
  });

  const [newItem, setNewItem] = React.useState({
    texto: '',
    tipo: 'checkbox',
    obrigatorio: true
  });

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const addItem = () => {
    if (!newItem.texto.trim()) return;
    
    const item = {
      id: Date.now(),
      ...newItem
    };
    
    set('itens', [...form.itens, item]);
    setNewItem({ texto: '', tipo: 'checkbox', obrigatorio: true });
  };

  const removeItem = (id) => {
    set('itens', form.itens.filter(i => i.id !== id));
  };

  const moveItem = (index, direction) => {
    const newItems = [...form.itens];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newItems.length) return;
    
    [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
    set('itens', newItems);
  };

  const handleSave = () => {
    if (!form.nome.trim()) {
      alert('Por favor, informe um nome para o template');
      return;
    }
    if (form.itens.length === 0) {
      alert('Adicione pelo menos um item ao checklist');
      return;
    }

    if (template) {
      Storage.updateChecklistTemplate(template.id, form);
      window.showToast?.('Template atualizado!', 'good');
    } else {
      Storage.addChecklistTemplate(form);
      window.showToast?.('Template criado!', 'good');
    }
    
    onSave();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 800 }}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{template ? 'Editar' : 'Novo'} template de checklist</h2>
          </div>
          <button className="btn-icon" onClick={onClose}>{I.x}</button>
        </div>

        <div className="modal-body scroll">
          <div className="form-row">
            <label className="form-label">Nome do template *</label>
            <input 
              className="form-input" 
              value={form.nome} 
              onChange={(e) => set('nome', e.target.value)}
              placeholder="Ex: Manutenção Preventiva - Extrusora"
            />
          </div>

          <div className="form-row">
            <label className="form-label">Tipo de manutenção</label>
            <select className="form-input" value={form.tipo} onChange={(e) => set('tipo', e.target.value)}>
              <option value="preventiva">Preventiva</option>
              <option value="corretiva">Corretiva</option>
              <option value="preditiva">Preditiva</option>
              <option value="melhoria">Melhoria</option>
            </select>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Itens do checklist</h3>
            
            {/* Adicionar novo item */}
            <div style={{ background: 'var(--accent-subtle)', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
              <div className="form-row" style={{ marginBottom: '12px' }}>
                <input 
                  className="form-input" 
                  value={newItem.texto}
                  onChange={(e) => setNewItem(prev => ({ ...prev, texto: e.target.value }))}
                  placeholder="Descreva o item do checklist..."
                  onKeyPress={(e) => e.key === 'Enter' && addItem()}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <select 
                  className="form-input" 
                  value={newItem.tipo}
                  onChange={(e) => setNewItem(prev => ({ ...prev, tipo: e.target.value }))}
                  style={{ flex: 1 }}
                >
                  <option value="checkbox">Checkbox (Sim/Não)</option>
                  <option value="texto">Texto livre</option>
                  <option value="numero">Número/Medição</option>
                </select>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                  <input 
                    type="checkbox" 
                    checked={newItem.obrigatorio}
                    onChange={(e) => setNewItem(prev => ({ ...prev, obrigatorio: e.target.checked }))}
                  />
                  Obrigatório
                </label>
                <button className="btn btn-primary" onClick={addItem}>Adicionar item</button>
              </div>
            </div>

            {/* Lista de itens */}
            <div className="checklist-items-list">
              {form.itens.map((item, index) => (
                <div key={item.id} className="checklist-item-card">
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <button 
                        className="btn-icon" 
                        onClick={() => moveItem(index, 'up')}
                        disabled={index === 0}
                        title="Mover para cima"
                      >
                        ↑
                      </button>
                      <button 
                        className="btn-icon" 
                        onClick={() => moveItem(index, 'down')}
                        disabled={index === form.itens.length - 1}
                        title="Mover para baixo"
                      >
                        ↓
                      </button>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        {item.obrigatorio && <span style={{ color: 'var(--crit)', fontWeight: 'bold' }}>*</span>}
                        <span style={{ fontSize: '14px' }}>{item.texto}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ink-3)' }}>
                        {item.tipo === 'checkbox' && '✓ Checkbox'}
                        {item.tipo === 'texto' && '✎ Texto livre'}
                        {item.tipo === 'numero' && '# Número/medição'}
                        {item.unidade && ` · ${item.unidade}`}
                      </div>
                    </div>
                    <button className="btn-icon" onClick={() => removeItem(item.id)} title="Remover">
                      {I.trash}
                    </button>
                  </div>
                </div>
              ))}

              {form.itens.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-3)', fontSize: '13px' }}>
                  Nenhum item adicionado ainda. Use o formulário acima para adicionar itens.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {template ? 'Salvar alterações' : 'Criar template'}
          </button>
        </div>
      </div>
    </div>
  );
}

window.ChecklistManager = ChecklistManager;
