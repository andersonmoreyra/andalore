// ═══════════════════════════════════════════════════════════════════════════
// PARTS-MANAGER.JSX - Gestão de Peças e Estoque
// ═══════════════════════════════════════════════════════════════════════════

function PartsManager() {
  const [parts, setParts] = React.useState([]);
  const [editing, setEditing] = React.useState(null);
  const [creating, setCreating] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [filter, setFilter] = React.useState('all');

  React.useEffect(() => {
    loadParts();
  }, []);

  const loadParts = () => {
    setParts(Storage.getParts());
  };

  const handleDelete = (id) => {
    if (!confirm('Deseja realmente excluir esta peça?')) return;
    Storage.deletePart(id);
    loadParts();
    window.showToast?.('Peça excluída', 'neutral');
  };

  const filtered = parts.filter(p => {
    if (search) {
      const s = search.toLowerCase();
      if (!p.nome.toLowerCase().includes(s) && !p.codigo.toLowerCase().includes(s)) {
        return false;
      }
    }
    if (filter === 'baixo') return p.estoque <= p.estoqueMinimo;
    if (filter === 'ok') return p.estoque > p.estoqueMinimo;
    return true;
  });

  const baixoEstoque = parts.filter(p => p.estoque <= p.estoqueMinimo).length;

  return (
    <div className="screen-content">
      <div className="screen-head">
        <div>
          <h1 className="screen-title">Peças e Estoque</h1>
          <p className="screen-subtitle">Controle de materiais e peças de reposição</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>
          {I.plus}<span>Nova peça</span>
        </button>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Buscar por nome ou código..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginBottom: '12px' }}
        />

        <div className="tabs">
          <button className={`tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            Todas ({parts.length})
          </button>
          <button className={`tab ${filter === 'baixo' ? 'active' : ''}`} onClick={() => setFilter('baixo')}>
            Estoque Baixo ({baixoEstoque})
          </button>
          <button className={`tab ${filter === 'ok' ? 'active' : ''}`} onClick={() => setFilter('ok')}>
            OK ({parts.length - baixoEstoque})
          </button>
        </div>
      </div>

      <div className="parts-table-container">
        <table className="parts-table-full">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nome</th>
              <th>Estoque</th>
              <th>Mínimo</th>
              <th>Status</th>
              <th>Localização</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(part => {
              const baixo = part.estoque <= part.estoqueMinimo;
              return (
                <tr key={part.id} className={baixo ? 'part-row-low' : ''}>
                  <td className="mono">{part.codigo}</td>
                  <td>{part.nome}</td>
                  <td className="mono">{part.estoque}</td>
                  <td className="mono">{part.estoqueMinimo}</td>
                  <td>
                    {baixo ? (
                      <span className="pill crit">Baixo</span>
                    ) : (
                      <span className="pill good">OK</span>
                    )}
                  </td>
                  <td>{part.localizacao || '-'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="btn-icon" onClick={() => setEditing(part)} title="Editar">
                        {I.edit}
                      </button>
                      <button className="btn-icon" onClick={() => handleDelete(part.id)} title="Excluir">
                        {I.trash}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: '48px', opacity: 0.3 }}>📦</div>
            <div style={{ fontSize: '14px' }}>Nenhuma peça encontrada</div>
          </div>
        )}
      </div>

      {(creating || editing) && (
        <PartEditor
          part={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={() => {
            loadParts();
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function PartEditor({ part, onClose, onSave }) {
  const [form, setForm] = React.useState(part || {
    codigo: '',
    nome: '',
    estoque: 0,
    estoqueMinimo: 5,
    localizacao: '',
    fornecedor: '',
    preco: 0
  });

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.codigo || !form.nome) {
      alert('Preencha código e nome');
      return;
    }

    if (part) {
      Storage.updatePart(part.id, form);
      window.showToast?.('Peça atualizada!', 'good');
    } else {
      Storage.addPart(form);
      window.showToast?.('Peça adicionada!', 'good');
    }
    
    onSave();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{part ? 'Editar' : 'Nova'} Peça</h2>
          <button className="btn-icon" onClick={onClose}>{I.x}</button>
        </div>

        <div className="modal-body">
          <div className="form-grid">
            <div className="form-row">
              <label className="form-label">Código *</label>
              <input
                className="form-input"
                value={form.codigo}
                onChange={e => set('codigo', e.target.value)}
                placeholder="P-001"
              />
            </div>

            <div className="form-row">
              <label className="form-label">Localização</label>
              <input
                className="form-input"
                value={form.localizacao || ''}
                onChange={e => set('localizacao', e.target.value)}
                placeholder="Prateleira A1"
              />
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Nome da Peça *</label>
            <input
              className="form-input"
              value={form.nome}
              onChange={e => set('nome', e.target.value)}
              placeholder="Rolamento 6205"
            />
          </div>

          <div className="form-grid">
            <div className="form-row">
              <label className="form-label">Estoque Atual</label>
              <input
                type="number"
                className="form-input"
                value={form.estoque}
                onChange={e => set('estoque', parseInt(e.target.value))}
                min="0"
              />
            </div>

            <div className="form-row">
              <label className="form-label">Estoque Mínimo</label>
              <input
                type="number"
                className="form-input"
                value={form.estoqueMinimo}
                onChange={e => set('estoqueMinimo', parseInt(e.target.value))}
                min="0"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-row">
              <label className="form-label">Fornecedor</label>
              <input
                className="form-input"
                value={form.fornecedor || ''}
                onChange={e => set('fornecedor', e.target.value)}
                placeholder="SKF"
              />
            </div>

            <div className="form-row">
              <label className="form-label">Preço (R$)</label>
              <input
                type="number"
                className="form-input"
                value={form.preco}
                onChange={e => set('preco', parseFloat(e.target.value))}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {part ? 'Salvar' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
}

window.PartsManager = PartsManager;
