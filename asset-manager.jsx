// ═══════════════════════════════════════════════════════════════════════════
// ASSET-MANAGER.JSX - Gestão de Ativos
// ═══════════════════════════════════════════════════════════════════════════

function AssetManager() {
  const [assets, setAssets] = React.useState([]);
  const [editing, setEditing] = React.useState(null);
  const [creating, setCreating] = React.useState(false);
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = () => {
    setAssets(Storage.getAssets());
  };

  const handleDelete = (id) => {
    if (!confirm('Deseja realmente excluir este ativo?')) return;
    Storage.deleteAsset(id);
    loadAssets();
    window.showToast?.('Ativo excluído', 'neutral');
  };

  const filtered = assets.filter(a => {
    if (!search) return true;
    const s = search.toLowerCase();
    return a.nome.toLowerCase().includes(s) || 
           a.codigo.toLowerCase().includes(s) ||
           a.area.toLowerCase().includes(s);
  });

  return (
    <div className="screen-content">
      <div className="screen-head">
        <div>
          <h1 className="screen-title">Ativos e Equipamentos</h1>
          <p className="screen-subtitle">Gerencie o cadastro de máquinas e equipamentos</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCreating(true)}>
          {I.plus}<span>Novo ativo</span>
        </button>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Buscar por nome, código ou área..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="asset-grid">
        {filtered.map(asset => (
          <div key={asset.id} className="asset-card">
            <div className="asset-card-header">
              <span className="mono asset-code">{asset.codigo}</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="btn-icon" onClick={() => setEditing(asset)}>{I.edit}</button>
                <button className="btn-icon" onClick={() => handleDelete(asset.id)}>{I.trash}</button>
              </div>
            </div>
            <h3 className="asset-name">{asset.nome}</h3>
            <div className="asset-meta">
              <span>{asset.area}</span>
              <span>·</span>
              <span className="mono">{asset.id}</span>
            </div>
            {asset.fabricante && (
              <div style={{ fontSize: '12px', color: 'var(--ink-3)', marginTop: '8px' }}>
                {asset.fabricante}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: '48px', opacity: 0.3 }}>⚙️</div>
            <div style={{ fontSize: '14px' }}>Nenhum ativo encontrado</div>
          </div>
        )}
      </div>

      {(creating || editing) && (
        <AssetEditor
          asset={editing}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={() => {
            loadAssets();
            setCreating(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function AssetEditor({ asset, onClose, onSave }) {
  const [form, setForm] = React.useState(asset || {
    codigo: '',
    nome: '',
    area: 'Produção',
    fabricante: '',
    modelo: '',
    numeroSerie: ''
  });

  const set = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.codigo || !form.nome) {
      alert('Preencha código e nome');
      return;
    }

    if (asset) {
      Storage.updateAsset(asset.id, form);
      window.showToast?.('Ativo atualizado!', 'good');
    } else {
      Storage.addAsset(form);
      window.showToast?.('Ativo adicionado!', 'good');
    }
    
    onSave();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{asset ? 'Editar' : 'Novo'} Ativo</h2>
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
                placeholder="EX-01"
              />
            </div>

            <div className="form-row">
              <label className="form-label">Área</label>
              <select className="form-input" value={form.area} onChange={e => set('area', e.target.value)}>
                <option>Produção</option>
                <option>Utilidades</option>
                <option>Manutenção</option>
                <option>Qualidade</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Nome do Equipamento *</label>
            <input
              className="form-input"
              value={form.nome}
              onChange={e => set('nome', e.target.value)}
              placeholder="Extrusora 01"
            />
          </div>

          <div className="form-grid">
            <div className="form-row">
              <label className="form-label">Fabricante</label>
              <input
                className="form-input"
                value={form.fabricante || ''}
                onChange={e => set('fabricante', e.target.value)}
                placeholder="Ex: Sandvik"
              />
            </div>

            <div className="form-row">
              <label className="form-label">Modelo</label>
              <input
                className="form-input"
                value={form.modelo || ''}
                onChange={e => set('modelo', e.target.value)}
                placeholder="Ex: EX-500"
              />
            </div>
          </div>

          <div className="form-row">
            <label className="form-label">Número de Série</label>
            <input
              className="form-input"
              value={form.numeroSerie || ''}
              onChange={e => set('numeroSerie', e.target.value)}
              placeholder="Ex: SN123456789"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {asset ? 'Salvar' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
}

window.AssetManager = AssetManager;
